import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import { useNavigate, NavLink } from 'react-router-dom';
import { Plus, Trash2, Code2 } from 'lucide-react';

// Zod schema matching the problem schema
const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.enum(['array', 'linkedList', 'graph', 'dp']),
  visibleTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required'),
      explanation: z.string().min(1, 'Explanation is required')
    })
  ).min(1, 'At least one visible test case required'),
  hiddenTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required')
    })
  ).min(1, 'At least one hidden test case required'),
  startCode: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      initialCode: z.string().min(1, 'Initial code is required')
    })
  ).length(3, 'All three languages required'),
  referenceSolution: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      completeCode: z.string().min(1, 'Complete code is required')
    })
  ).length(3, 'All three languages required')
});

function AdminPanel() {
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      startCode: [
        { language: 'C++', initialCode: '' },
        { language: 'Java', initialCode: '' },
        { language: 'JavaScript', initialCode: '' }
      ],
      referenceSolution: [
        { language: 'C++', completeCode: '' },
        { language: 'Java', completeCode: '' },
        { language: 'JavaScript', completeCode: '' }
      ]
    }
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

  const onSubmit = async (data) => {
    try {
      console.log('DATA BEING SENT:', JSON.stringify(data, null, 2));
      await axiosClient.post('/problem/create', data);
      alert('Problem created successfully!');
      navigate('/');
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Decorative background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 opacity-100 bg-[radial-gradient(ellipse_at_top_left,rgba(56,189,248,0.12),transparent_45%),radial-gradient(ellipse_at_bottom_right,rgba(217,70,239,0.10),transparent_45%)]" />
      </div>

      {/* Navbar */}
      <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 h-16">
        <div className="h-full px-4 md:px-8 flex items-center justify-between">
          <NavLink to="/admin" className="flex items-center gap-2 hover:opacity-90 transition group">
            <span className="text-slate-400 group-hover:text-sky-400 transition font-medium">← Back</span>
          </NavLink>

          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-sky-500 to-sky-600 p-2 rounded-lg shadow-sm shadow-sky-500/10">
              <Code2 className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold">
              Create <span className="text-sky-500">Problem</span>
            </span>
          </div>

          <div className="text-slate-400 text-sm"></div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-8 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto">
          {/* Basic Information */}
          <div className="rounded-2xl p-[1px] bg-gradient-to-r from-sky-600/20 to-fuchsia-600/20">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 backdrop-blur-sm hover:border-slate-700 transition-colors">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <span className="inline-block w-1.5 h-6 rounded bg-sky-500" />
                  Basic Information
                </h2>
                <span className="text-xs text-slate-400">Step 1 of 3</span>
              </div>

              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Title <span className="text-slate-500 font-normal">(required)</span>
                  </label>
                  <input
                    {...register('title')}
                    placeholder="e.g., Two Sum"
                    className={`w-full px-4 py-3 bg-slate-950/70 border rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/25 transition-all ${
                      errors.title ? 'border-red-500' : 'border-slate-700'
                    }`}
                  />
                  {errors.title && (
                    <span className="text-red-400 text-sm mt-1 block">{errors.title.message}</span>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Description <span className="text-slate-500 font-normal">(required)</span>
                  </label>
                  <textarea
                    {...register('description')}
                    placeholder="Describe the problem, constraints, and examples..."
                    rows={6}
                    className={`w-full px-4 py-3 bg-slate-950/70 border rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/25 transition-all resize-none ${
                      errors.description ? 'border-red-500' : 'border-slate-700'
                    }`}
                  />
                  {errors.description && (
                    <span className="text-red-400 text-sm mt-1 block">{errors.description.message}</span>
                  )}
                </div>

                {/* Difficulty & Tag */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Difficulty</label>
                    <select
                      {...register('difficulty')}
                      className={`w-full px-4 py-3 bg-slate-950/70 border rounded-lg text-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/25 transition-all ${
                        errors.difficulty ? 'border-red-500' : 'border-slate-700'
                      }`}
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                    {errors.difficulty && (
                      <span className="text-red-400 text-sm mt-1 block">{errors.difficulty.message}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Tag</label>
                    <select
                      {...register('tags')}
                      className={`w-full px-4 py-3 bg-slate-950/70 border rounded-lg text-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/25 transition-all ${
                        errors.tags ? 'border-red-500' : 'border-slate-700'
                      }`}
                    >
                      <option value="array">Array</option>
                      <option value="linkedList">Linked List</option>
                      <option value="graph">Graph</option>
                      <option value="dp">DP</option>
                    </select>
                    {errors.tags && (
                      <span className="text-red-400 text-sm mt-1 block">{errors.tags.message}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Test Cases */}
          <div className="rounded-2xl p-[1px] bg-gradient-to-r from-sky-600/20 to-fuchsia-600/20">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 backdrop-blur-sm hover:border-slate-700 transition-colors">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <span className="inline-block w-1.5 h-6 rounded bg-sky-500" />
                  Test Cases
                </h2>
                <span className="text-xs text-slate-400">Step 2 of 3</span>
              </div>

              {/* Visible Test Cases */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-slate-200">Visible Test Cases</h3>
                  <button
                    type="button"
                    onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
                    className="flex items-center gap-2 px-4 py-2 bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 rounded-lg border border-sky-500/30 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Add Visible Case
                  </button>
                </div>

                <div className="space-y-4">
                  {visibleFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="bg-slate-950/60 border border-slate-800 rounded-xl p-6 space-y-4 hover:border-sky-500/30 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-1 rounded bg-sky-500/15 text-sky-300 text-xs font-mono">
                          Case #{index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeVisible(index)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-red-500/15 hover:bg-red-500/25 text-red-300 rounded-lg border border-red-500/30 transition-all text-sm"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Remove
                        </button>
                      </div>

                      {/* INPUT */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Input</label>
                        <textarea
                          {...register(`visibleTestCases.${index}.input`)}
                          placeholder="Input"
                          rows={5}
                          className="w-full px-4 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 transition-all resize-none"
                        />
                        {errors.visibleTestCases?.[index]?.input && (
                          <span className="text-red-400 text-sm mt-1 block">
                            {errors.visibleTestCases[index]?.input?.message}
                          </span>
                        )}
                      </div>

                      {/* OUTPUT */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Output</label>
                        <input
                          {...register(`visibleTestCases.${index}.output`)}
                          placeholder="Output"
                          className="w-full px-4 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 transition-all"
                        />
                        {errors.visibleTestCases?.[index]?.output && (
                          <span className="text-red-400 text-sm mt-1 block">
                            {errors.visibleTestCases[index]?.output?.message}
                          </span>
                        )}
                      </div>

                      {/* EXPLANATION */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Explanation</label>
                        <textarea
                          {...register(`visibleTestCases.${index}.explanation`)}
                          placeholder="Explanation"
                          rows={3}
                          className="w-full px-4 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 transition-all resize-none"
                        />
                        {errors.visibleTestCases?.[index]?.explanation && (
                          <span className="text-red-400 text-sm mt-1 block">
                            {errors.visibleTestCases[index]?.explanation?.message}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hidden Test Cases */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-slate-200">Hidden Test Cases</h3>
                  <button
                    type="button"
                    onClick={() => appendHidden({ input: '', output: '' })}
                    className="flex items-center gap-2 px-4 py-2 bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 rounded-lg border border-sky-500/30 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Add Hidden Case
                  </button>
                </div>

                <div className="space-y-4">
                  {hiddenFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="bg-slate-950/60 border border-slate-800 rounded-xl p-6 space-y-4 hover:border-sky-500/30 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-1 rounded bg-fuchsia-500/15 text-fuchsia-300 text-xs font-mono">
                          Hidden #{index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeHidden(index)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-red-500/15 hover:bg-red-500/25 text-red-300 rounded-lg border border-red-500/30 transition-all text-sm"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Remove
                        </button>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Input</label>
                        <textarea
                          {...register(`hiddenTestCases.${index}.input`)}
                          placeholder="Input"
                          rows={5}
                          className="w-full px-4 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 transition-all resize-none"
                        />
                        {errors.hiddenTestCases?.[index]?.input && (
                          <span className="text-red-400 text-sm mt-1 block">
                            {errors.hiddenTestCases[index]?.input?.message}
                          </span>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Output</label>
                        <input
                          {...register(`hiddenTestCases.${index}.output`)}
                          placeholder="Output"
                          className="w-full px-4 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 transition-all"
                        />
                        {errors.hiddenTestCases?.[index]?.output && (
                          <span className="text-red-400 text-sm mt-1 block">
                            {errors.hiddenTestCases[index]?.output?.message}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Code Templates */}
          <div className="rounded-2xl p-[1px] bg-gradient-to-r from-sky-600/20 to-fuchsia-600/20">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 backdrop-blur-sm hover:border-slate-700 transition-colors">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <span className="inline-block w-1.5 h-6 rounded bg-sky-500" />
                  Code Templates
                </h2>
                <span className="text-xs text-slate-400">Step 3 of 3</span>
              </div>

              <div className="space-y-8">
                {[0, 1, 2].map((index) => {
                  const languages = ['C++', 'Java', 'JavaScript'];
                  const lang = languages[index];

                  return (
                    <div
                      key={index}
                      className="bg-slate-950/60 border border-slate-800 rounded-xl p-6 hover:border-sky-500/30 transition-colors"
                    >
                      <h3 className="font-semibold text-lg text-slate-200 mb-4 flex items-center gap-2">
                        <span className="px-2 py-1 bg-sky-500/15 text-sky-300 rounded text-xs font-mono">
                          {lang}
                        </span>
                      </h3>

                      {/* Initial Code */}
                      <div className="mb-6">
                        <label className="block text-sm font-semibold text-slate-300 mb-2">Initial Code</label>
                        <div className="bg-slate-900/70 border border-slate-700 rounded-lg p-4 overflow-hidden">
                          <textarea
                            {...register(`startCode.${index}.initialCode`)}
                            placeholder={`Enter initial ${lang} code...`}
                            className="w-full bg-transparent font-mono text-sm text-slate-300 placeholder-slate-600 focus:outline-none resize-none leading-6"
                            rows={8}
                          />
                        </div>
                      </div>

                      {/* Reference Solution */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">Reference Solution</label>
                        <div className="bg-slate-900/70 border border-slate-700 rounded-lg p-4 overflow-hidden">
                          <textarea
                            {...register(`referenceSolution.${index}.completeCode`)}
                            placeholder={`Enter complete ${lang} solution...`}
                            className="w-full bg-transparent font-mono text-sm text-slate-300 placeholder-slate-600 focus:outline-none resize-none leading-6"
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

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-6 py-4 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/25"
          >
            Create Problem
          </button>
        </form>
      </div>

      {/* Custom Styles */}
      <style>{`
        textarea::-webkit-scrollbar { width: 6px; }
        textarea::-webkit-scrollbar-track { background: #0b1220; }
        textarea::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
        textarea::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}</style>
    </div>
  );
}

export default AdminPanel;