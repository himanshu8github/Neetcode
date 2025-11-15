import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Editor from '@monaco-editor/react';
import { useParams, NavLink } from 'react-router';
import axiosClient from "../utils/axiosClient";
import SubmissionHistory from "../components/SubmissionHistory";
import ChatAi from '../components/AiBot';
import { Home, Code2, Send, CheckCircle, XCircle } from 'lucide-react';

const langMap = {
  cpp: 'C++',
  java: 'Java',
  javascript: 'JavaScript'
};

const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeRightTab, setActiveRightTab] = useState('code');
  const editorRef = useRef(null);
  let { problemId } = useParams();

  const { handleSubmit } = useForm();

  // UI helpers (no logic change)
  const prettyTab = (key) => {
    if (key === 'testcase') return 'Test Case';
    if (key === 'chatAI') return 'Chat AI';
    return key.charAt(0).toUpperCase() + key.slice(1);
  };

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(`/problem/problemById/${problemId}`);
        const initialCode = response.data.startCode.find(sc => sc.language === langMap[selectedLanguage]).initialCode;
        setProblem(response.data);
        setCode(initialCode);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [problemId]);

  useEffect(() => {
    if (problem) {
      const initialCode = problem.startCode.find(sc => sc.language === langMap[selectedLanguage]).initialCode;
      setCode(initialCode);
    }
  }, [selectedLanguage, problem]);

  const handleEditorChange = (value) => {
    setCode(value || '');
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const handleRun = async () => {
    setLoading(true);
    setRunResult(null);
    try {
      const response = await axiosClient.post(`/submission/run/${problemId}`, {
        code,
        language: selectedLanguage
      });
      setRunResult(response.data);
      setLoading(false);
      setActiveRightTab('testcase');
    } catch (error) {
      setRunResult({ success: false, error: 'Internal server error' });
      setLoading(false);
      setActiveRightTab('testcase');
    }
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    setSubmitResult(null);
    try {
      const response = await axiosClient.post(`/submission/submit/${problemId}`, {
        code: code,
        language: selectedLanguage
      });
      setSubmitResult(response.data);
      setLoading(false);
      setActiveRightTab('result');
    } catch (error) {
      setSubmitResult(null);
      setLoading(false);
      setActiveRightTab('result');
    }
  };

  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case 'javascript': return 'javascript';
      case 'java': return 'java';
      case 'cpp': return 'cpp';
      default: return 'javascript';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'hard': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  if (loading && !problem) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <span className="loading loading-spinner loading-lg text-sky-500"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

      {/* Navbar */}
      <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 h-16 flex-shrink-0 sticky top-0 z-30">
        <div className="h-full px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="bg-gradient-to-br from-sky-500 to-sky-600 p-1.5 rounded shadow-sm shadow-sky-500/25">
              <Code2 className="w-4 h-4" />
            </div>
            <span className="font-bold tracking-tight truncate">
              Code<span className="text-sky-500">Matrix</span>
            </span>
          </div>

          {problem && (
            <div className="hidden md:flex items-center gap-3 min-w-0">
              <span className="text-slate-300 font-semibold text-sm truncate max-w-xs">{problem.title}</span>
              <div className={`px-2 py-1 rounded border ${getDifficultyColor(problem.difficulty)} text-xs font-medium`}>
                {problem.difficulty?.charAt(0).toUpperCase() + problem.difficulty?.slice(1)}
              </div>
            </div>
          )}

          <NavLink to="/" className="flex items-center gap-2 hover:opacity-80 transition group">
            <span className="text-slate-400 group-hover:text-sky-400 transition font-medium text-sm">Home</span>
            <Home className="w-5 h-5 text-slate-400 group-hover:text-sky-400 transition" />
          </NavLink>
        </div>
      </nav>

      {/* Mobile header */}
      {problem && (
        <div className="md:hidden px-4 pt-3 pb-2 border-b border-slate-800 bg-slate-900/40">
          <h1 className="text-base font-semibold truncate">{problem.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className={`px-2 py-1 rounded border ${getDifficultyColor(problem.difficulty)} text-[11px] font-semibold`}>
              {problem.difficulty?.charAt(0).toUpperCase() + problem.difficulty?.slice(1)}
            </span>
          </div>
        </div>
      )}

      {/* Main layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

        {/* Left panel */}
        <div className="w-full md:w-1/2 flex flex-col overflow-hidden border-b md:border-r border-slate-800">
          {/* Tabs */}
          <div className="flex gap-1 bg-slate-900/60 border-b border-slate-800 px-2 py-2 flex-wrap">
            {['description', 'editorial', 'solutions', 'submissions', 'chatAI'].map((tab) => (
              <button
                key={tab}
                className={`px-3 py-2 rounded-md text-xs md:text-sm font-medium transition-all ${
                  activeLeftTab === tab
                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
                onClick={() => setActiveLeftTab(tab)}
              >
                {prettyTab(tab)}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-black">
            {problem && activeLeftTab === 'description' && (
              <div className="space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold">{problem.title}</h2>

                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
                  <h3 className="text-base md:text-lg font-semibold mb-3">Problem Description</h3>
                  <div className="whitespace-pre-wrap text-xs md:text-sm text-slate-300 leading-relaxed">
                    {problem.description}
                  </div>
                </div>

                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
                  <h3 className="text-base md:text-lg font-semibold mb-4">Examples</h3>
                  <div className="space-y-4">
                    {problem.visibleTestCases.map((example, index) => (
                      <div key={index} className="bg-slate-800/50 border border-slate-700 p-4 rounded-lg">
                        <h4 className="font-semibold text-sky-400 mb-3 text-sm">Example {index + 1}</h4>
                        <div className="space-y-2 text-xs md:text-sm font-mono text-slate-300">
                          <div><span className="text-sky-400">Input:</span> {example.input}</div>
                          <div><span className="text-green-400">Output:</span> {example.output}</div>
                          <div><span className="text-purple-400">Explanation:</span> {example.explanation}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeLeftTab === 'editorial' && (
              <div className="text-center text-slate-400 p-6 border border-slate-800 bg-slate-900/60 rounded-xl text-sm">
                Editorial coming soon
              </div>
            )}

        
{activeLeftTab === 'solutions' && (
  <div className="space-y-5">
    <h2 className="text-lg md:text-xl font-bold">Solutions</h2>

    {Array.isArray(problem?.referenceSolution) && problem.referenceSolution.length > 0 ? (
      <>
        {problem.referenceSolution.map((solution, index) => (
          <div key={index} className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
            <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-700 flex items-center justify-between">
              <h3 className="font-semibold text-sky-400 text-sm">{solution.language}</h3>
              <span className="text-[10px] px-2 py-1 rounded bg-sky-500/15 text-sky-300 border border-sky-500/30 font-mono">
                Reference
              </span>
            </div>
            <div className="p-4">
              <pre className="bg-black/70 border border-slate-700 p-4 rounded text-[11px] md:text-xs overflow-x-auto text-slate-300 leading-relaxed">
                <code>{solution.completeCode}</code>
              </pre>
            </div>
          </div>
        ))}
      </>
    ) : (
      <div className="text-center text-slate-400 p-6 border border-slate-800 bg-slate-900/60 rounded-xl text-sm">
        No solutions available at the moment.
      </div>
    )}
  </div>
)}


            {activeLeftTab === 'submissions' && (
              <div className="space-y-4">
                <h2 className="text-lg md:text-xl font-bold">My Submissions</h2>
                <SubmissionHistory problemId={problemId} />
              </div>
            )}

            {activeLeftTab === 'chatAI' && (
              <div className="space-y-4">
                <h2 className="text-lg md:text-xl font-bold">Chat with AI</h2>
                <ChatAi problem={problem} />
              </div>
            )}
          </div>
        </div>

        {/* Right panel */}
        <div className="w-full md:w-1/2 flex flex-col overflow-hidden bg-black">
          {/* Tabs */}
          <div className="flex gap-1 bg-slate-900/60 border-b border-slate-800 px-2 py-2 flex-wrap">
            {['code', 'testcase', 'result'].map((tab) => (
              <button
                key={tab}
                className={`px-3 py-2 rounded-md text-xs md:text-sm font-medium transition-all ${
                  activeRightTab === tab
                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
                onClick={() => setActiveRightTab(tab)}
              >
                {prettyTab(tab)}
              </button>
            ))}
          </div>

          <div className="flex-1 flex flex-col overflow-y-auto md:overflow-hidden">
            {activeRightTab === 'code' && (
              <>
                {/* Language selector */}
                <div className="flex gap-2 p-3 border-b border-slate-800 bg-slate-900/40 overflow-x-auto">
                  {['javascript', 'java', 'cpp'].map((lang) => (
                    <button
                      key={lang}
                      className={`px-3 py-1.5 rounded text-xs md:text-sm border font-medium ${
                        selectedLanguage === lang
                          ? 'bg-sky-500/25 text-sky-300 border-sky-500/50 shadow-sm'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white'
                      }`}
                      onClick={() => handleLanguageChange(lang)}
                    >
                      {lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JavaScript' : 'Java'}
                    </button>
                  ))}
                </div>

                {/* Editor (increased height by ~16px) */}
                <div className="h-[272px] md:min-h-[360px] border-b border-slate-800">
                  <Editor
                    height="100%"
                    language={getLanguageForMonaco(selectedLanguage)}
                    value={code}
                    onChange={handleEditorChange}
                    onMount={handleEditorDidMount}
                    theme="vs-dark"
                    options={{
                      fontSize: 13,
                      minimap: { enabled: false },
                      automaticLayout: true,
                      wordWrap: 'on',
                      scrollBeyondLastLine: false
                    }}
                  />
                </div>

                {/* Actions (sticky on mobile) */}
                <div className="p-3 border-t border-slate-800 bg-slate-950/80 backdrop-blur-md flex flex-wrap justify-end gap-2 fixed bottom-0 left-0 right-0 md:static z-40">
                  <button
                    className={`px-5 py-2 rounded-md text-sm font-semibold border border-slate-700 bg-slate-800 hover:bg-slate-700 hover:border-slate-600 transition ${
                      loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={handleRun}
                    disabled={loading}
                  >
                    {loading ? 'Running' : 'Run'}
                  </button>
                  <button
                    className={`px-5 py-2 rounded-md text-sm font-semibold bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 border border-sky-500/40 shadow-sm shadow-sky-500/30 transition ${
                      loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={handleSubmitCode}
                    disabled={loading}
                  >
                    {loading ? 'Submitting' : 'Submit'}
                  </button>
                </div>

                {/* Output */}
                <div className="flex-1 overflow-y-auto px-4 py-4 pb-28 md:pb-4 bg-black">
                  <h3 className="font-semibold text-xs md:text-sm mb-2">Output</h3>
                  <div className="border border-slate-800 bg-slate-900/60 p-3 rounded text-xs md:text-sm text-slate-300 min-h-16">
                    {runResult ? (runResult.success ? 'Test passed' : 'Test failed') : 'Click Run to see output'}
                  </div>
                </div>
              </>
            )}

            {activeRightTab === 'testcase' && (
              <div className="flex-1 overflow-y-auto px-4 py-4 bg-black">
                <h3 className="font-semibold text-sm md:text-base mb-3">Test Results</h3>
                {runResult ? (
                  <div className={`rounded-xl border p-4 text-xs md:text-sm ${
                    runResult.success ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'
                  }`}>
                    <div className="flex items-center gap-2 mb-3">
                      {runResult.success ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                      <h4 className={`font-bold ${runResult.success ? 'text-green-400' : 'text-red-400'}`}>
                        {runResult.success ? 'Passed' : 'Failed'}
                      </h4>
                    </div>

                    {runResult.success && (
                      <div className="text-[11px] md:text-xs text-slate-300 space-y-1 mb-3">
                        <p>Runtime: <span className="text-sky-400">{runResult.runtime} sec</span></p>
                        <p>Memory: <span className="text-sky-400">{runResult.memory} KB</span></p>
                      </div>
                    )}

                    <div className="space-y-2">
                      {runResult.testCases?.map((tc, i) => (
                        <div key={i} className="border border-slate-700 bg-slate-900/60 p-2 rounded text-xs md:text-sm">
                          <div>Input: {tc.stdin}</div>
                          <div>Output: {tc.stdout}</div>
                          <div className={tc.status_id === 3 ? 'text-green-400' : 'text-red-400'}>{tc.status_id === 3 ? 'Passed' : 'Failed'}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-400 text-xs md:text-sm">Click Run to test your code</div>
                )}
              </div>
            )}

            {activeRightTab === 'result' && (
              <div className="flex-1 overflow-y-auto px-4 py-4 bg-black">
                <h3 className="font-semibold text-sm md:text-base mb-4">Submission Result</h3>
                {submitResult ? (
                  <div className={`rounded-xl border p-4 ${
                    submitResult.accepted ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'
                  }`}>
                    <div className="flex items-center gap-2 mb-4">
                      {submitResult.accepted ? (
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-400" />
                      )}
                      <h4 className={`font-bold text-base ${submitResult.accepted ? 'text-green-400' : 'text-red-400'}`}>
                        {submitResult.accepted ? 'Accepted' : 'Not Accepted'}
                      </h4>
                    </div>

                    <div className="space-y-2 text-xs md:text-sm text-slate-300">
                      <p>Passed: <span className="text-sky-400">{submitResult.passedTestCases}/{submitResult.totalTestCases}</span></p>
                      <p>Runtime: <span className="text-sky-400">{submitResult.runtime} sec</span></p>
                      <p>Memory: <span className="text-sky-400">{submitResult.memory} KB</span></p>
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-400 text-xs md:text-sm">Click Submit to submit your solution</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        ::selection { background:#0ea5e9; color:white; }
        @media (max-width: 768px) {
          pre { font-size:11px !important; }
        }
      `}</style>
    </div>
  );
};

export default ProblemPage;