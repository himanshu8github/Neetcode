import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router';
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
  } = useFieldArray({
    control,
    name: 'visibleTestCases'
  });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden
  } = useFieldArray({
    control,
    name: 'hiddenTestCases'
  });

  const onSubmit = async (data) => {
    try {
        console.log("DATA BEING SENT:", JSON.stringify(data, null, 2));
      await axiosClient.post('/problem/create', data);
      alert('Problem created successfully!');
      navigate('/');
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
        <div className="container mx-auto px-4 md:px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-sky-500 to-sky-600 p-2 rounded-lg">
              <Code2 className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold">Create New <span className="text-sky-500">Problem</span></h1>
          </div>
          <p className="text-slate-400">Add DSA problems for CodeMatrix</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-8 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto">
          
          {/* Basic Information */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 backdrop-blur-sm hover:border-slate-700 transition-all">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-sky-500 rounded"></div>
              Basic Information
            </h2>
            
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Title</label>
                <input
                  {...register('title')}
                  placeholder="e.g., Two Sum"
                  className={`w-full px-4 py-3 bg-slate-900 border rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 transition-all ${
                    errors.title ? 'border-red-500' : 'border-slate-700'
                  }`}
                />
                {errors.title && (
                  <span className="text-red-400 text-sm mt-1">{errors.title.message}</span>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Description</label>
                <textarea
                  {...register('description')}
                  placeholder="Describe the problem..."
                  rows={5}
                  className={`w-full px-4 py-3 bg-slate-900 border rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 transition-all resize-none ${
                    errors.description ? 'border-red-500' : 'border-slate-700'
                  }`}
                />
                {errors.description && (
                  <span className="text-red-400 text-sm mt-1">{errors.description.message}</span>
                )}
              </div>

              {/* Difficulty & Tag */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Difficulty</label>
                  <select
                    {...register('difficulty')}
                    className={`w-full px-4 py-3 bg-slate-900 border rounded-lg text-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 transition-all ${
                      errors.difficulty ? 'border-red-500' : 'border-slate-700'
                    }`}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Tag</label>
                  <select
                    {...register('tags')}
                    className={`w-full px-4 py-3 bg-slate-900 border rounded-lg text-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 transition-all ${
                      errors.tags ? 'border-red-500' : 'border-slate-700'
                    }`}
                  >
                    <option value="array">Array</option>
                    <option value="linkedList">Linked List</option>
                    <option value="graph">Graph</option>
                    <option value="dp">DP</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Test Cases */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 backdrop-blur-sm hover:border-slate-700 transition-all">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-sky-500 rounded"></div>
              Test Cases
            </h2>
            
            {/* Visible Test Cases */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-300">Visible Test Cases</h3>
                <button
                  type="button"
                  onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
                  className="flex items-center gap-2 px-4 py-2 bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 rounded-lg border border-sky-500/30 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add Visible Case
                </button>
              </div>
              
              <div className="space-y-4">
                {visibleFields.map((field, index) => (
                  <div key={field.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4 hover:border-sky-500/30 transition-all">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeVisible(index)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg border border-red-500/30 transition-all text-sm"
                      >
                        <Trash2 className="w-3 h-3" />
                        Remove
                      </button>
                    </div>
                    
                    <input
                      {...register(`visibleTestCases.${index}.input`)}
                      placeholder="Input"
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 transition-all"
                    />
                    
                    <input
                      {...register(`visibleTestCases.${index}.output`)}
                      placeholder="Output"
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 transition-all"
                    />
                    
                    <textarea
                      {...register(`visibleTestCases.${index}.explanation`)}
                      placeholder="Explanation"
                      rows={3}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 transition-all resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Hidden Test Cases */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-300">Hidden Test Cases</h3>
                <button
                  type="button"
                  onClick={() => appendHidden({ input: '', output: '' })}
                  className="flex items-center gap-2 px-4 py-2 bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 rounded-lg border border-sky-500/30 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add Hidden Case
                </button>
              </div>
              
              <div className="space-y-4">
                {hiddenFields.map((field, index) => (
                  <div key={field.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4 hover:border-sky-500/30 transition-all">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeHidden(index)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg border border-red-500/30 transition-all text-sm"
                      >
                        <Trash2 className="w-3 h-3" />
                        Remove
                      </button>
                    </div>
                    
                    <input
                      {...register(`hiddenTestCases.${index}.input`)}
                      placeholder="Input"
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 transition-all"
                    />
                    
                    <input
                      {...register(`hiddenTestCases.${index}.output`)}
                      placeholder="Output"
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Code Templates */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 backdrop-blur-sm hover:border-slate-700 transition-all">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-sky-500 rounded"></div>
              Code Templates
            </h2>
            
            <div className="space-y-8">
              {[0, 1, 2].map((index) => {
                const languages = ['C++', 'Java', 'JavaScript'];
                const lang = languages[index];
                
                return (
                  <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-sky-500/30 transition-all">
                    <h3 className="font-semibold text-lg text-slate-200 mb-4 flex items-center gap-2">
                      <span className="px-2 py-1 bg-sky-500/20 text-sky-400 rounded text-xs font-mono">{lang}</span>
                    </h3>
                    
                    {/* Initial Code */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-slate-300 mb-2">Initial Code</label>
                      <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 overflow-hidden">
                        <textarea
                          {...register(`startCode.${index}.initialCode`)}
                          placeholder={`Enter initial ${lang} code...`}
                          className="w-full bg-transparent font-mono text-sm text-slate-300 placeholder-slate-600 focus:outline-none resize-none"
                          rows={6}
                        />
                      </div>
                    </div>
                    
                    {/* Reference Solution */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">Reference Solution</label>
                      <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 overflow-hidden">
                        <textarea
                          {...register(`referenceSolution.${index}.completeCode`)}
                          placeholder={`Enter complete ${lang} solution...`}
                          className="w-full bg-transparent font-mono text-sm text-slate-300 placeholder-slate-600 focus:outline-none resize-none"
                          rows={6}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-6 py-4 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-sky-500/30"
          >
            Create Problem
          </button>
        </form>
      </div>

      {/* Custom Styles */}
      <style>{`
        textarea::-webkit-scrollbar {
          width: 6px;
        }
        textarea::-webkit-scrollbar-track {
          background: #1e293b;
        }
        textarea::-webkit-scrollbar-thumb {
          background: #475569;
          border-radius: 3px;
        }
        textarea::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>
    </div>
  );
}

export default AdminPanel;