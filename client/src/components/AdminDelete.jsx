import { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient'
import { Trash2, AlertCircle, Home, Code2, Search } from 'lucide-react';
import { NavLink } from 'react-router';

const AdminDelete = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get('/problem/getAllProblem');
      setProblems(data);
    } catch (err) {
      setError('Failed to fetch problems');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) return;
    
    try {
      await axiosClient.delete(`/problem/delete/${id}`);
      setProblems(problems.filter(problem => problem._id !== id));
    } catch (err) {
      setError('Failed to delete problem');
      console.error(err);
    }
  };

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = filterDifficulty === 'all' || problem.difficulty === filterDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'hard': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getTagColor = (tag) => {
    const colors = {
      'array': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'linkedlist': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'graph': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      'dp': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    };
    return colors[tag?.toLowerCase()] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-sky-500"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <NavLink to="/admin" className="flex items-center gap-2 hover:opacity-80 transition group">
            <span className="text-slate-400 group-hover:text-sky-400 transition font-medium">← Back</span>
          </NavLink>
          
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-red-500 to-red-600 p-2 rounded">
              <Trash2 className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold">Delete <span className="text-red-400">Problems</span></span>
          </div>

          <div className="text-slate-400 text-sm">Manage Problems</div>
        </div>
      </nav>

      {/* Header */}
      <div className="container mx-auto px-4 md:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Delete Problems</h1>
          <p className="text-slate-400">Permanently remove problems from the platform</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-600" />
            <input
              type="text"
              placeholder="Search problems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 transition-all"
            />
          </div>

          {/* Difficulty Filter */}
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 transition-all"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <button
            onClick={fetchProblems}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-all"
          >
            Refresh
          </button>
        </div>

        {/* Problems Count */}
        <div className="mb-4 text-slate-400 text-sm">
          Showing <span className="text-sky-400 font-semibold">{filteredProblems.length}</span> of <span className="text-sky-400 font-semibold">{problems.length}</span> problems
        </div>

        {/* Problems Table */}
        <div className="overflow-x-auto bg-slate-900/50 border border-slate-800 rounded-lg">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80">
                <th className="px-4 py-3 text-left text-sky-400 font-semibold text-sm">#</th>
                <th className="px-4 py-3 text-left text-sky-400 font-semibold text-sm">Title</th>
                <th className="px-4 py-3 text-left text-sky-400 font-semibold text-sm">Difficulty</th>
                <th className="px-4 py-3 text-left text-sky-400 font-semibold text-sm">Tags</th>
                <th className="px-4 py-3 text-left text-sky-400 font-semibold text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProblems.length > 0 ? (
                filteredProblems.map((problem, index) => (
                  <tr key={problem._id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-all">
                    <td className="px-4 py-3 text-slate-300 font-mono text-sm">{index + 1}</td>
                    <td className="px-4 py-3 text-slate-200 font-medium">{problem.title}</td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty?.charAt(0).toUpperCase() + problem.difficulty?.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${getTagColor(problem.tags)}`}>
                        {problem.tags}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(problem._id, problem.title)}
                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg font-medium text-sm transition-all transform hover:scale-105 flex items-center gap-2"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-slate-400">
                    <p>No problems found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Warning Box */}
        <div className="mt-8 bg-red-500/10 border border-red-500/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-400 mb-2 flex items-center gap-2">
            <AlertCircle size={20} />
            ⚠️ Warning
          </h3>
          <p className="text-red-300/80">
            Deleting a problem is permanent and cannot be undone. All submissions and related data will also be removed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDelete;