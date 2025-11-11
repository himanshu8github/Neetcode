import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import { useNavigate, NavLink } from 'react-router';
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
      explanation: z.string(),
    })
  ).optional(),

  hiddenTestCases: z.array(
    z.object({
      input: z.string(),
      output: z.string(),
    })
  ).optional(),

  startCode: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      initialCode: z.string(),
    })
  ).optional(),

  referenceSolution: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      completeCode: z.string(),
    })
  ).optional(),
});


function AdminUpdate() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [updating, setUpdating] = useState(false);
  
  // Popup states
  const [popup, setPopup] = useState({
    show: false,
    type: 'success', // 'success' or 'error'
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
    resolver: zodResolver(updateProblemSchema),
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

  // Fetch all problems
  useEffect(() => {
    fetchProblems();
  }, []);

  // Auto-close popup after 3 seconds
  useEffect(() => {
    if (popup.show) {
      const timer = setTimeout(() => {
        setPopup({ ...popup, show: false });
      }, 3000);
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

  // Select problem to edit
  const handleSelectProblem = (problem) => {
    setSelectedProblem(problem);
    
    // Ensure all arrays exist
    const formData = {
      title: problem.title || '',
      description: problem.description || '',
      difficulty: problem.difficulty || 'easy',
      tags: problem.tags || 'array',
      visibleTestCases: problem.visibleTestCases || [],
      hiddenTestCases: problem.hiddenTestCases || [],
      startCode: problem.startCode || [
        { language: 'C++', initialCode: '' },
        { language: 'Java', initialCode: '' },
        { language: 'JavaScript', initialCode: '' }
      ],
      referenceSolution: problem.referenceSolution || [
        { language: 'C++', completeCode: '' },
        { language: 'Java', completeCode: '' },
        { language: 'JavaScript', completeCode: '' }
      ]
    };
    
    reset(formData);
  };

  const showPopup = (type, title, message) => {
    setPopup({
      show: true,
      type,
      title,
      message
    });
  };

  // Update problem
  const onSubmit = async (data) => {
    if (!selectedProblem) {
      showPopup('error', 'Error!', 'No problem selected');
      return;
    }

    try {
      setUpdating(true);

      // Remove empty or unchanged fields
      const cleanedData = Object.fromEntries(
        Object.entries(data).filter(([key, value]) => {
          return value !== undefined && value !== "" && value !== null;
        })
      );

      // Remove empty arrays - check if all items are empty
      if (cleanedData.visibleTestCases?.every(tc => !tc.input && !tc.output && !tc.explanation)) delete cleanedData.visibleTestCases;
      if (cleanedData.hiddenTestCases?.every(tc => !tc.input && !tc.output)) delete cleanedData.hiddenTestCases;
      if (cleanedData.startCode?.every(sc => !sc.initialCode)) delete cleanedData.startCode;
      if (cleanedData.referenceSolution?.every(rs => !rs.completeCode)) delete cleanedData.referenceSolution;

      const response = await axiosClient.patch(`/problem/update/${selectedProblem._id}`, cleanedData);

      // Show success popup
      showPopup('success', '✓ Success!', `"${selectedProblem.title}" has been updated successfully.`);
      
      // Redirect after popup auto-closes
      setTimeout(() => {
        setSelectedProblem(null);
        fetchProblems();
      }, 1500);
    } catch (error) {
      // Show error popup
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
        <span className="loading loading-spinner loading-lg text-sky-500"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Success/Error Popup */}
      {popup.show && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setPopup({ ...popup, show: false })}
          />
          
          {/* Popup Card */}
          <div className={`relative max-w-sm w-full rounded-2xl border-2 p-8 shadow-2xl transform transition-all duration-300 ${
            popup.type === 'success' 
              ? 'bg-green-950/90 border-green-500/50' 
              : 'bg-red-950/90 border-red-500/50'
          }`}>
            {/* Close Button */}
            <button
              onClick={() => setPopup({ ...popup, show: false })}
              className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className={`p-4 rounded-full ${
                popup.type === 'success'
                  ? 'bg-green-500/20'
                  : 'bg-red-500/20'
              }`}>
                {popup.type === 'success' ? (
                  <CheckCircle className={`w-8 h-8 ${popup.type === 'success' ? 'text-green-400' : 'text-red-400'}`} />
                ) : (
                  <AlertCircle className={`w-8 h-8 ${popup.type === 'success' ? 'text-green-400' : 'text-red-400'}`} />
                )}
              </div>
            </div>

            {/* Title */}
            <h2 className={`text-2xl font-bold text-center mb-3 ${
              popup.type === 'success' ? 'text-green-400' : 'text-red-400'
            }`}>
              {popup.title}
            </h2>

            {/* Message */}
            <p className="text-center text-slate-300 mb-6 text-sm leading-relaxed">
              {popup.message}
            </p>

            {/* Progress Bar */}
            <div className={`h-1 rounded-full overflow-hidden ${
              popup.type === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'
            }`}>
              <div className={`h-full ${
                popup.type === 'success' ? 'bg-green-500' : 'bg-red-500'
              } animate-pulse`} style={{
                animation: 'slideOut 3s ease-in forwards'
              }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 h-16">
        <div className="h-full px-4 md:px-8 flex items-center justify-between">
          <NavLink to="/admin" className="flex items-center gap-2 hover:opacity-80 transition group">
            <span className="text-slate-400 group-hover:text-sky-400 transition font-medium">← Back</span>
          </NavLink>
          
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded">
              <Code2 className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold">Update <span className="text-blue-400">Problem</span></span>
          </div>

          <div className="text-slate-400 text-sm">Edit Problem</div>
        </div>
      </nav>

      <div className="container mx-auto px-4 md:px-8 py-8">
        {!selectedProblem ? (
          <>
            {/* Problems List View */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">Update Problems</h1>
              <p className="text-slate-400">Select a problem to edit</p>
            </div>

            {/* Search */}
            <div className="mb-6 relative">
              <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-600" />
              <input
                type="text"
                placeholder="Search problems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 transition-all"
              />
            </div>

            {/* Problems Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProblems.map((problem) => (
                <button
                  key={problem._id}
                  onClick={() => handleSelectProblem(problem)}
                  className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 hover:border-blue-500/50 hover:bg-slate-900/80 transition-all text-left group"
                >
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition mb-2">
                    {problem.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                    {problem.description}
                  </p>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${
                      problem.difficulty === 'easy' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                      problem.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                      'bg-red-500/20 text-red-400 border-red-500/30'
                    }`}>
                      {problem.difficulty}
                    </span>
                    <span className="px-2 py-1 rounded text-xs font-medium border bg-blue-500/20 text-blue-400 border-blue-500/30">
                      {problem.tags}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Edit Form */}
            <button
              onClick={() => setSelectedProblem(null)}
              className="mb-6 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-all"
            >
              ← Back to List
            </button>

            <div className="space-y-8 max-w-4xl">
              {/* Basic Information */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <div className="w-1 h-6 bg-blue-500 rounded"></div>
                  Basic Information
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Title</label>
                    <input
                      {...register('title')}
                      placeholder="Edit title..."
                      className={`w-full px-4 py-3 bg-slate-900 border rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all ${
                        errors.title ? 'border-red-500' : 'border-slate-700'
                      }`}
                    />
                    {errors.title && <span className="text-red-400 text-sm mt-1">{errors.title.message}</span>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Description</label>
                    <textarea
                      {...register('description')}
                      rows={5}
                      className={`w-full px-4 py-3 bg-slate-900 border rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all resize-none ${
                        errors.description ? 'border-red-500' : 'border-slate-700'
                      }`}
                    />
                    {errors.description && <span className="text-red-400 text-sm mt-1">{errors.description.message}</span>}
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">Difficulty</label>
                      <select
                        {...register('difficulty')}
                        className={`w-full px-4 py-3 bg-slate-900 border rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all ${
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
                      <label className="block text-sm font-semibold text-slate-300 mb-2">Tag</label>
                      <select
                        {...register('tags')}
                        className={`w-full px-4 py-3 bg-slate-900 border rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all ${
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

              {/* Test Cases */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <div className="w-1 h-6 bg-blue-500 rounded"></div>
                  Test Cases
                </h2>
                
                {/* Visible Test Cases */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-slate-300">Visible Test Cases</h3>
                    <button
                      type="button"
                      onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg border border-blue-500/30 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {visibleFields.map((field, index) => (
                      <div key={field.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
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
                        
                        <textarea
                          {...register(`visibleTestCases.${index}.input`)}
                          placeholder="Input"
                          rows={4}
                          className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all resize-none"
                        />
                        
                        <textarea
                          {...register(`visibleTestCases.${index}.output`)}
                          placeholder="Output"
                          rows={3}
                          className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all resize-none"
                        />
                        
                        <textarea
                          {...register(`visibleTestCases.${index}.explanation`)}
                          placeholder="Explanation"
                          rows={3}
                          className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all resize-none"
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
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg border border-blue-500/30 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {hiddenFields.map((field, index) => (
                      <div key={field.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
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
                        
                        <textarea
                          {...register(`hiddenTestCases.${index}.input`)}
                          placeholder="Input"
                          rows={4}
                          className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all resize-none"
                        />
                        
                        <textarea
                          {...register(`hiddenTestCases.${index}.output`)}
                          placeholder="Output"
                          rows={3}
                          className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all resize-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Code Templates */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <div className="w-1 h-6 bg-blue-500 rounded"></div>
                  Code Templates
                </h2>
                
                <div className="space-y-8">
                  {[0, 1, 2].map((index) => {
                    const languages = ['C++', 'Java', 'JavaScript'];
                    const lang = languages[index];
                    
                    return (
                      <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                        <h3 className="font-semibold text-lg text-slate-200 mb-4">
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-mono">{lang}</span>
                        </h3>
                        
                        <div className="mb-6">
                          <label className="block text-sm font-semibold text-slate-300 mb-2">Initial Code</label>
                          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
                            <textarea
                              {...register(`startCode.${index}.initialCode`)}
                              className="w-full bg-transparent font-mono text-sm text-slate-300 placeholder-slate-600 focus:outline-none resize-none"
                              rows={6}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-slate-300 mb-2">Reference Solution</label>
                          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
                            <textarea
                              {...register(`referenceSolution.${index}.completeCode`)}
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
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => handleSubmit(onSubmit)()}
                  disabled={updating}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/30 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <CheckCircle size={20} />
                  {updating ? 'Updating...' : 'Update Problem'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

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

        @keyframes slideOut {
          0% { width: 100%; }
          100% { width: 0%; }
        }
      `}</style>
    </div>
  );
}

export default AdminUpdate;