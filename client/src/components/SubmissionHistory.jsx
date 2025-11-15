import { useState, useEffect } from 'react';
import axiosClient from '../utils/axiosClient';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

const SubmissionHistory = ({ problemId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(`/problem/submittedProblem/${problemId}`);
        const data = Array.isArray(response.data) ? response.data : (response.data?.submissions || []);
        setSubmissions(data || []);
        setError(null);
      } catch (err) {
        // Treat "no submissions" as empty state, not an error
        if (err?.response?.status === 404) {
          setSubmissions([]);
          setError(null);
        } else {
          setSubmissions([]);
          setError('Failed to fetch submission history');
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [problemId]);

  const getStatusIcon = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'accepted': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'wrong': return <XCircle className="w-5 h-5 text-red-400" />;
      case 'error': return <XCircle className="w-5 h-5 text-yellow-400" />;
      case 'pending': return <Clock className="w-5 h-5 text-blue-400" />;
      default: return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusBg = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'accepted': return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'wrong': return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'error': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'pending': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  const formatMemory = (memory) => {
    if (memory == null) return '-';
    if (memory < 1024) return `${memory} kB`;
    return `${(memory / 1024).toFixed(2)} MB`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return '-';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-48 shimmer rounded" />
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
          <div className="h-4 w-3/4 shimmer rounded" />
          <div className="h-4 w-2/3 shimmer rounded" />
          <div className="h-4 w-1/2 shimmer rounded" />
        </div>
        <style>{`
          @keyframes shimmer { 0% {background-position:-200% 0} 100% {background-position:200% 0} }
          .shimmer {
            background: linear-gradient(90deg, rgba(30,41,59,0.35) 25%, rgba(51,65,85,0.6) 50%, rgba(30,41,59,0.35) 75%);
            background-size: 200% 100%;
            animation: shimmer 1.2s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400">
        <p>{error}</p>
      </div>
    );
  }

  const hasNoSubmissions = !submissions || submissions.length === 0;

  return (
    <div className="space-y-4">
      <h2 className="text-xl md:text-2xl font-bold text-white">Submission History</h2>

      {hasNoSubmissions ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center">
          <p className="text-slate-300 font-medium">You have no submission history for this problem.</p>
          <p className="text-slate-500 text-sm mt-1">Run and submit your solution to see it here.</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto bg-slate-900/50 border border-slate-800 rounded-xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80">
                  <th className="px-4 py-3 text-left text-slate-300 font-semibold">#</th>
                  <th className="px-4 py-3 text-left text-slate-300 font-semibold">Language</th>
                  <th className="px-4 py-3 text-left text-slate-300 font-semibold">Status</th>
                  <th className="px-4 py-3 text-left text-slate-300 font-semibold">Runtime</th>
                  <th className="px-4 py-3 text-left text-slate-300 font-semibold">Memory</th>
                  <th className="px-4 py-3 text-left text-slate-300 font-semibold">Test Cases</th>
                  <th className="px-4 py-3 text-left text-slate-300 font-semibold">Submitted</th>
                  <th className="px-4 py-3 text-left text-slate-300 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub, index) => (
                  <tr key={sub._id || index} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3 text-slate-400 font-mono">{index + 1}</td>
                    <td className="px-4 py-3 text-slate-200">{sub.language}</td>
                    <td className="px-4 py-3">
                      <div className={`flex items-center gap-2 w-fit px-3 py-1 rounded-lg border ${getStatusBg(sub.status)}`}>
                        {getStatusIcon(sub.status)}
                        <span className="font-medium text-sm">
                          {(sub.status || '-').charAt(0).toUpperCase() + (sub.status || '-').slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-300 font-mono text-sm">{sub.runtime != null ? `${sub.runtime}s` : '-'}</td>
                    <td className="px-4 py-3 text-slate-300 font-mono text-sm">{formatMemory(sub.memory)}</td>
                    <td className="px-4 py-3 text-slate-300 font-mono text-sm">
                      {sub.testCasesPassed != null && sub.testCasesTotal != null
                        ? `${sub.testCasesPassed}/${sub.testCasesTotal}`
                        : '-'}
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-sm">{formatDate(sub.createdAt)}</td>
                    <td className="px-4 py-3">
                      <button
                        className="px-3 py-1.5 bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 border border-sky-500/30 rounded text-sm font-medium transition-colors"
                        onClick={() => setSelectedSubmission(sub)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {submissions.map((sub, index) => (
              <div
                key={sub._id || index}
                className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-semibold text-white">
                        #{index + 1} • {sub.language}
                      </h3>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-semibold ${getStatusBg(sub.status)}`}>
                        {getStatusIcon(sub.status)}
                        {(sub.status || '-').charAt(0).toUpperCase() + (sub.status || '-').slice(1)}
                      </span>
                      <span className="px-2.5 py-1 rounded-md border border-sky-500/30 bg-sky-500/10 text-sky-300 text-[11px] font-mono">
                        {sub.runtime != null ? `Runtime: ${sub.runtime}s` : 'Runtime: -'}
                      </span>
                      <span className="px-2.5 py-1 rounded-md border border-sky-500/30 bg-sky-500/10 text-sky-300 text-[11px] font-mono">
                        Memory: {formatMemory(sub.memory)}
                      </span>
                      <span className="px-2.5 py-1 rounded-md border border-sky-500/30 bg-sky-500/10 text-sky-300 text-[11px] font-mono">
                        {sub.testCasesPassed != null && sub.testCasesTotal != null
                          ? `${sub.testCasesPassed}/${sub.testCasesTotal}`
                          : '-'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2">Submitted: {formatDate(sub.createdAt)}</p>
                  </div>
                  <button
                    className="px-3 py-1.5 rounded-md bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 text-xs font-semibold active:scale-95 transition"
                    onClick={() => setSelectedSubmission(sub)}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs md:text-sm text-slate-400 mt-2">
            Showing <span className="text-sky-400 font-semibold">{submissions.length}</span> submissions
          </p>
        </>
      )}

      {/* Code View Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-slate-900/95 border-b border-slate-800 p-4 md:p-6 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-bold text-base md:text-lg text-white mb-2">
                  Submission: {selectedSubmission.language}
                </h3>
                <div className="flex flex-wrap gap-2">
                  <div className={`flex items-center gap-2 w-fit px-3 py-1 rounded-lg border text-sm ${getStatusBg(selectedSubmission.status)}`}>
                    {getStatusIcon(selectedSubmission.status)}
                    <span className="font-medium">
                      {(selectedSubmission.status || '-').charAt(0).toUpperCase() + (selectedSubmission.status || '-').slice(1)}
                    </span>
                  </div>
                  <div className="px-3 py-1 rounded-lg border border-sky-500/30 bg-sky-500/10 text-sky-400 text-sm font-mono">
                    Runtime: {selectedSubmission.runtime != null ? `${selectedSubmission.runtime}s` : '-'}
                  </div>
                  <div className="px-3 py-1 rounded-lg border border-sky-500/30 bg-sky-500/10 text-sky-400 text-sm font-mono">
                    Memory: {formatMemory(selectedSubmission.memory)}
                  </div>
                  <div className="px-3 py-1 rounded-lg border border-sky-500/30 bg-sky-500/10 text-sky-400 text-sm font-mono">
                    {selectedSubmission.testCasesPassed != null && selectedSubmission.testCasesTotal != null
                      ? `${selectedSubmission.testCasesPassed}/${selectedSubmission.testCasesTotal}`
                      : '-'}
                  </div>
                </div>
              </div>
              <button
                className="text-slate-400 hover:text-white transition text-2xl leading-none"
                onClick={() => setSelectedSubmission(null)}
                aria-label="Close"
                title="Close"
              >
                ✕
              </button>
            </div>

            {selectedSubmission.errorMessage && (
              <div className="m-4 md:m-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
                <p className="font-semibold mb-2">Error</p>
                <p className="text-sm">{selectedSubmission.errorMessage}</p>
              </div>
            )}

            <div className="p-4 md:p-6">
              <p className="text-slate-400 text-sm mb-3">Code</p>
              <pre className="p-4 bg-black/80 border border-slate-800 rounded overflow-x-auto text-xs md:text-sm text-slate-300 font-mono">
                <code>{selectedSubmission.code}</code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionHistory;