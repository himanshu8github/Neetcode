import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import { useNavigate, NavLink } from 'react-router-dom';
import { Plus, Trash2, Code2, Search, CheckCircle, X, AlertCircle } from 'lucide-react';

const updateProblemSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  tags: z.enum(['array', 'linkedList', 'graph', 'dp']).optional(),
  visibleTestCases: z.array(
    z.object({
      input: z.string(),
      output: z.string(),
      explanation: z.string()
    })
  ).optional(),
  hiddenTestCases: z.array(
    z.object({
      input: z.string(),
      output: z.string()
    })
  ).optional(),
  startCode: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      initialCode: z.string()
    })
  ).optional(),
  referenceSolution: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      completeCode: z.string()
    })
  ).optional()
});

function AdminUpdate() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [updating, setUpdating] = useState(false);

  const [popup, setPopup] = useState({
    show: false,
    type: 'success',
    message: '',
    title: ''
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(updateProblemSchema)
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible
  } = useFieldArray({ control, name: 'visibleTestCases' });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden
  } = useFieldArray({ control, name: 'hiddenTestCases' });

  useEffect(() => {
    fetchProblems();
  }, []);

  useEffect(() => {
    if (popup.show) {
      const timer = setTimeout(() => setPopup({ ...popup, show: false }), 3000);
      return () => clearTimeout(timer);
    }
  }, [popup.show]);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get('/problem/getAllProblem');
      setProblems(data);
    } catch (error) {
      console.error('Failed to fetch problems:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProblem = (problem) => {
    setSelectedProblem(problem);
    const formData = {
      title: problem.title || '',
      description: problem.description || '',
      difficulty: problem.difficulty || 'easy',
      tags: problem.tags || 'array',
      visibleTestCases: problem.visibleTestCases || [],
      hiddenTestCases: problem.hiddenTestCases || [],
      startCode:
        problem.startCode || [
          { language: 'C++', initialCode: '' },
          { language: 'Java', initialCode: '' },
          { language: 'JavaScript', initialCode: '' }
        ],
      referenceSolution:
        problem.referenceSolution || [
          { language: 'C++', completeCode: '' },
          { language: 'Java', completeCode: '' },
          { language: 'JavaScript', completeCode: '' }
        ]
    };
    reset(formData);
  };

  const showPopup = (type, title, message) => {
    setPopup({ show: true, type, title, message });
  };

  const onSubmit = async (data) => {
    if (!selectedProblem) {
      showPopup('error', 'Error!', 'No problem selected');
      return;
    }
    try {
      setUpdating(true);
      const cleanedData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined && value !== '' && value !== null)
      );
      if (cleanedData.visibleTestCases?.every(tc => !tc.input && !tc.output && !tc.explanation))
        delete cleanedData.visibleTestCases;
      if (cleanedData.hiddenTestCases?.every(tc => !tc.input && !tc.output))
        delete cleanedData.hiddenTestCases;
      if (cleanedData.startCode?.every(sc => !sc.initialCode))
        delete cleanedData.startCode;
      if (cleanedData.referenceSolution?.every(rs => !rs.completeCode))
        delete cleanedData.referenceSolution;

      await axiosClient.patch(`/problem/update/${selectedProblem._id}`, cleanedData);
      showPopup('success', '✓ Success!', `"${selectedProblem.title}" updated successfully.`);
      setTimeout(() => {
        setSelectedProblem(null);
        fetchProblems();
      }, 1500);
    } catch (error) {
      const errorMsg = error.response?.data || error.message || 'Something went wrong!';
      showPopup('error', '✗ Update Failed!', String(errorMsg));
    } finally {
      setUpdating(false);
    }
  };

  const filteredProblems = problems.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="space-y-4 w-full max-w-sm px-6">
          <div className="h-2 w-32 shimmer rounded"></div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
              <div className="h-5 shimmer rounded w-2/3"></div>
              <div className="h-3 shimmer rounded w-full"></div>
              <div className="flex gap-2">
                <div className="h-6 shimmer rounded w-16"></div>
                <div className="h-6 shimmer rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
        <style>{`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          .shimmer {
            background: linear-gradient(90deg,rgba(30,41,59,0.4) 25%,rgba(51,65,85,0.5) 50%,rgba(30,41,59,0.4) 75%);
            background-size:200% 100%;
            animation: shimmer 1.4s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Decorative background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-sky-600/15 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-fuchsia-600/15 blur-3xl" />
      </div>

      {/* Popup */}
      {popup.show && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setPopup({ ...popup, show: false })}
          />
          <div
            className={`relative max-w-sm w-full rounded-2xl border p-7 shadow-xl animate-popup ${
              popup.type === 'success'
                ? 'bg-gradient-to-br from-green-950/90 via-green-900/60 to-slate-900 border-green-500/40'
                : 'bg-gradient-to-br from-red-950/90 via-red-900/60 to-slate-900 border-red-500/40'
            }`}
          >
            <button
              onClick={() => setPopup({ ...popup, show: false })}
              className="absolute top-3 right-3 p-1 hover:bg-white/10 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex justify-center mb-5">
              <div
                className={`p-4 rounded-full ${
                  popup.type === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'
                }`}
              >
                {popup.type === 'success' ? (
                  <CheckCircle className="w-8 h-8 text-green-400" />
                ) : (
                  <AlertCircle className="w-8 h-8 text-red-400" />
                )}
              </div>
            </div>
            <h2
              className={`text-xl font-bold text-center mb-2 ${
                popup.type === 'success' ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {popup.title}
            </h2>
            <p className="text-center text-slate-300 text-sm mb-5 leading-relaxed">
              {popup.message}
            </p>
            <div
              className={`h-1 rounded-full overflow-hidden ${
                popup.type === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'
              }`}
            >
              <div
                className={`h-full ${
                  popup.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                } progress-bar`}
              />
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
        <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <NavLink to="/admin" className="flex items-center gap-2 group">
            <span className="text-slate-400 group-hover:text-sky-400 transition font-medium">
              ← Back
            </span>
          </NavLink>
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg shadow-sm shadow-blue-500/15">
              <Code2 className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold">
              Update <span className="text-blue-400">Problem</span>
            </span>
          </div>
          <div className="text-slate-400 text-sm">Editor</div>
        </div>
      </nav>

      <div className="container mx-auto px-4 md:px-8 py-8">
        {!selectedProblem ? (
          <>
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
                <span className="bg-gradient-to-r from-sky-400 via-cyan-400 to-fuchsia-400 bg-clip-text text-transparent">
                  Update Problems
                </span>
              </h1>
              <p className="text-slate-400 text-sm">
                Select a problem card to begin editing
              </p>
            </div>

            <div className="mb-6 relative">
              <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-600" />
              <input
                type="text"
                placeholder="Search problems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-950/70 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/25 transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProblems.map(problem => (
                <button
                  key={problem._id}
                  onClick={() => handleSelectProblem(problem)}
                  className="group rounded-xl p-[1px] bg-gradient-to-r from-blue-600/20 via-sky-600/10 to-fuchsia-600/20 hover:from-blue-600/35 hover:to-fuchsia-600/35 transition-colors"
                >
                  <div className="h-full rounded-xl bg-slate-900/60 border border-slate-800 p-5 backdrop-blur-sm group-hover:bg-slate-900/70 group-hover:border-slate-700 text-left flex flex-col gap-3">
                    <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition">
                      {problem.title}
                    </h3>
                    <p className="text-slate-400 text-xs line-clamp-3">
                      {problem.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      <span
                        className={`px-2 py-1 rounded-md text-[10px] font-semibold tracking-wide border ${
                          problem.difficulty === 'easy'
                            ? 'bg-green-500/15 text-green-300 border-green-500/30'
                            : problem.difficulty === 'medium'
                            ? 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30'
                            : 'bg-red-500/15 text-red-300 border-red-500/30'
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                      <span className="px-2 py-1 rounded-md text-[10px] font-semibold tracking-wide border bg-blue-500/15 text-blue-300 border-blue-500/30">
                        {problem.tags}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <button
              onClick={() => setSelectedProblem(null)}
              className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-sm border border-slate-700 transition"
            >
              ← Back to list
            </button>

            <div className="space-y-10 max-w-5xl">
              {/* Basic Information */}
              <div className="rounded-2xl p-[1px] bg-gradient-to-r from-blue-600/25 to-sky-600/25">
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 backdrop-blur-sm hover:border-blue-500/30 transition-colors">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                      <span className="inline-block w-1.5 h-7 rounded bg-blue-500" />
                      Basic Information
                    </h2>
                    <span className="text-xs text-slate-400">Core details</span>
                  </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                          Title
                        </label>
                        <input
                          {...register('title')}
                          placeholder="Edit title..."
                          className={`w-full px-4 py-3 bg-slate-950/70 border rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 transition ${
                            errors.title ? 'border-red-500' : 'border-slate-700'
                          }`}
                        />
                        {errors.title && (
                          <span className="text-red-400 text-xs mt-1 block">
                            {errors.title.message}
                          </span>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                          Description
                        </label>
                        <textarea
                          {...register('description')}
                          rows={6}
                          className={`w-full px-4 py-3 bg-slate-950/70 border rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 transition resize-none ${
                            errors.description ? 'border-red-500' : 'border-slate-700'
                          }`}
                        />
                        {errors.description && (
                          <span className="text-red-400 text-xs mt-1 block">
                            {errors.description.message}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-slate-300 mb-2">
                            Difficulty
                          </label>
                          <select
                            {...register('difficulty')}
                            className={`w-full px-4 py-3 bg-slate-950/70 border rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 transition ${
                              errors.difficulty ? 'border-red-500' : 'border-slate-700'
                            }`}
                          >
                            <option value="">Select difficulty</option>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-300 mb-2">
                            Tag
                          </label>
                          <select
                            {...register('tags')}
                            className={`w-full px-4 py-3 bg-slate-950/70 border rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 transition ${
                              errors.tags ? 'border-red-500' : 'border-slate-700'
                            }`}
                          >
                            <option value="">Select tag</option>
                            <option value="array">Array</option>
                            <option value="linkedList">Linked List</option>
                            <option value="graph">Graph</option>
                            <option value="dp">DP</option>
                          </select>
                        </div>
                      </div>
                    </div>
                </div>
              </div>

              {/* Test Cases */}
              <div className="rounded-2xl p-[1px] bg-gradient-to-r from-blue-600/25 to-fuchsia-600/25">
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 backdrop-blur-sm hover:border-blue-500/30 transition-colors">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                      <span className="inline-block w-1.5 h-7 rounded bg-blue-500" />
                      Test Cases
                    </h2>
                    <span className="text-xs text-slate-400">Public & hidden</span>
                  </div>

                  {/* Visible */}
                  <div className="mb-10">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-slate-200">
                        Visible Test Cases
                      </h3>
                      <button
                        type="button"
                        onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 rounded-lg border border-blue-500/30 transition"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </button>
                    </div>
                    <div className="space-y-4">
                      {visibleFields.map((field, index) => (
                        <div
                          key={field.id}
                          className="bg-slate-950/60 border border-slate-800 rounded-xl p-6 space-y-4 hover:border-blue-500/40 transition-colors"
                        >
                          <div className="flex justify-between items-center">
                            <span className="px-2 py-1 rounded bg-blue-500/15 text-blue-300 text-[10px] font-mono tracking-wide">
                              Visible #{index + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeVisible(index)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/15 hover:bg-red-500/25 text-red-300 rounded-lg border border-red-500/30 text-xs transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Remove
                            </button>
                          </div>
                          <textarea
                            {...register(`visibleTestCases.${index}.input`)}
                            placeholder="Input"
                            rows={4}
                            className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 text-sm resize-none"
                          />
                          <textarea
                            {...register(`visibleTestCases.${index}.output`)}
                            placeholder="Output"
                            rows={3}
                            className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 text-sm resize-none"
                          />
                          <textarea
                            {...register(`visibleTestCases.${index}.explanation`)}
                            placeholder="Explanation"
                            rows={3}
                            className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 text-sm resize-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hidden */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-slate-200">
                        Hidden Test Cases
                      </h3>
                      <button
                        type="button"
                        onClick={() => appendHidden({ input: '', output: '' })}
                        className="flex items-center gap-2 px-4 py-2 bg-fuchsia-500/15 hover:bg-fuchsia-500/25 text-fuchsia-300 rounded-lg border border-fuchsia-500/30 transition"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </button>
                    </div>
                    <div className="space-y-4">
                      {hiddenFields.map((field, index) => (
                        <div
                          key={field.id}
                          className="bg-slate-950/60 border border-slate-800 rounded-xl p-6 space-y-4 hover:border-fuchsia-500/40 transition-colors"
                        >
                          <div className="flex justify-between items-center">
                            <span className="px-2 py-1 rounded bg-fuchsia-500/15 text-fuchsia-300 text-[10px] font-mono tracking-wide">
                              Hidden #{index + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeHidden(index)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/15 hover:bg-red-500/25 text-red-300 rounded-lg border border-red-500/30 text-xs transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Remove
                            </button>
                          </div>
                          <textarea
                            {...register(`hiddenTestCases.${index}.input`)}
                            placeholder="Input"
                            rows={4}
                            className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500/30 text-sm resize-none"
                          />
                          <textarea
                            {...register(`hiddenTestCases.${index}.output`)}
                            placeholder="Output"
                            rows={3}
                            className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500/30 text-sm resize-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Code Templates */}
              <div className="rounded-2xl p-[1px] bg-gradient-to-r from-blue-600/25 to-cyan-600/25">
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 backdrop-blur-sm hover:border-blue-500/30 transition-colors">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                      <span className="inline-block w-1.5 h-7 rounded bg-blue-500" />
                      Code Templates
                    </h2>
                    <span className="text-xs text-slate-400">Starter & solution</span>
                  </div>
                  <div className="space-y-8">
                    {[0, 1, 2].map(index => {
                      const languages = ['C++', 'Java', 'JavaScript'];
                      const lang = languages[index];
                      return (
                        <div
                          key={index}
                          className="bg-slate-950/60 border border-slate-800 rounded-xl p-6 hover:border-blue-500/30 transition-colors"
                        >
                          <h3 className="font-semibold text-sm mb-4 flex items-center gap-2 text-slate-200">
                            <span className="px-2 py-1 bg-blue-500/15 text-blue-300 rounded text-[11px] font-mono tracking-wide">
                              {lang}
                            </span>
                          </h3>
                          <div className="mb-6">
                            <label className="block text-xs font-semibold text-slate-300 mb-2">
                              Initial Code
                            </label>
                            <div className="bg-slate-900/70 border border-slate-700 rounded-lg p-4">
                              <textarea
                                {...register(`startCode.${index}.initialCode`)}
                                className="w-full bg-transparent font-mono text-[13px] leading-6 text-slate-300 placeholder-slate-600 focus:outline-none resize-none"
                                rows={8}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-2">
                              Reference Solution
                            </label>
                            <div className="bg-slate-900/70 border border-slate-700 rounded-lg p-4">
                              <textarea
                                {...register(`referenceSolution.${index}.completeCode`)}
                                className="w-full bg-transparent font-mono text-[13px] leading-6 text-slate-300 placeholder-slate-600 focus:outline-none resize-none"
                                rows={8}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => handleSubmit(onSubmit)()}
                  disabled={updating}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <CheckCircle size={18} />
                  {updating ? 'Updating...' : 'Update Problem'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        textarea::-webkit-scrollbar { width: 6px; }
        textarea::-webkit-scrollbar-track { background: #0b1220; }
        textarea::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
        textarea::-webkit-scrollbar-thumb:hover { background: #475569; }

        .progress-bar { animation: shrink 3s linear forwards; }
        @keyframes shrink { 0% { width:100%; } 100% { width:0%; } }

        @keyframes popup {
          0% { transform: scale(.95) translateY(10px); opacity:0; }
          100% { transform: scale(1) translateY(0); opacity:1; }
        }
        .animate-popup { animation: popup .35s ease-out; }
      `}</style>
    </div>
  );
}

export default AdminUpdate;