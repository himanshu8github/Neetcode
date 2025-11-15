import { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient';
import { Trash2, AlertCircle, Search } from 'lucide-react';
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
      case 'easy': return 'bg-green-500/15 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30';
      case 'hard': return 'bg-red-500/15 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
    }
  };

  const getTagColor = (tag) => {
    const colors = {
      array: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
      linkedlist: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
      graph: 'bg-pink-500/15 text-pink-400 border-pink-500/30',
      dp: 'bg-orange-500/15 text-orange-400 border-orange-500/30'
    };
    return colors[tag?.toLowerCase()] || 'bg-slate-500/15 text-slate-400 border-slate-500/30';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="space-y-5 w-full max-w-sm px-6">
          <div className="h-3 w-40 shimmer rounded" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
              <div className="h-4 w-2/3 shimmer rounded" />
              <div className="h-3 w-full shimmer rounded" />
              <div className="flex gap-2">
                <div className="h-6 w-16 shimmer rounded" />
                <div className="h-6 w-20 shimmer rounded" />
              </div>
            </div>
          ))}
        </div>
        <style>{`
          @keyframes shimmer { 0% {background-position:-200% 0} 100% {background-position:200% 0} }
          .shimmer {
            background: linear-gradient(90deg,rgba(30,41,59,0.3) 25%,rgba(51,65,85,0.55) 50%,rgba(30,41,59,0.3) 75%);
            background-size:200% 100%;
            animation: shimmer 1.3s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Decorative background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-red-600/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-sky-600/10 blur-3xl" />
      </div>

      {/* Navbar */}
      <nav className="bg-slate-950/85 backdrop-blur-md border-b border-slate-800/70 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <NavLink to="/admin" className="flex items-center gap-2 group">
            <span className="text-slate-400 group-hover:text-sky-400 transition font-medium text-sm md:text-base">
              ← Back
            </span>
          </NavLink>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-red-600 shadow shadow-red-500/30">
              <Trash2 className="w-5 h-5" />
            </div>
            <span className="text-lg md:text-xl font-bold tracking-tight">
              Delete <span className="text-red-400">Problems</span>
            </span>
          </div>
          <div className="text-[11px] md:text-sm text-slate-400 font-medium">
            Manage
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-10">
        {/* Header */}
        <div className="mb-8 md:mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 bg-gradient-to-r from-red-400 via-rose-400 to-sky-400 bg-clip-text text-transparent">
            Delete Problems
          </h1>
          <p className="text-slate-400 text-sm md:text-base">
            Permanently remove problems from the platform
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 rounded-xl border border-red-500/40 bg-gradient-to-br from-red-900/70 to-red-800/40 p-5 flex items-start gap-4">
            <div className="p-2 rounded-md bg-red-500/20">
              <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
            <p className="text-red-300 text-xs md:text-sm">{error}</p>
          </div>
        )}

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="grid gap-4 md:grid-cols-12">
            {/* Search */}
            <div className="md:col-span-6 relative">
              <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-600" />
              <input
                type="text"
                placeholder="Search problems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-950/70 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/25 transition text-sm"
              />
            </div>
            {/* Difficulty */}
            <div className="md:col-span-3">
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950/70 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/25 transition text-sm"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            {/* Refresh */}
            <div className="md:col-span-3 flex">
              <button
                onClick={fetchProblems}
                className="flex-1 px-4 py-3 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-white font-medium border border-slate-700 hover:border-slate-600 transition-all shadow-sm hover:shadow-sky-500/10 text-sm"
              >
                Refresh
              </button>
            </div>
          </div>
          <div className="text-xs md:text-sm text-slate-400">
            Showing <span className="text-sky-400 font-semibold">{filteredProblems.length}</span> of{' '}
            <span className="text-sky-400 font-semibold">{problems.length}</span> problems
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block rounded-2xl overflow-hidden border border-slate-800 bg-slate-950/50 backdrop-blur-sm shadow-sm shadow-black/40">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-900/70 border-b border-slate-800">
                <th className="px-4 py-3 text-left font-semibold text-slate-300">#</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-300">Title</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-300">Difficulty</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-300">Tag</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProblems.length > 0 ? (
                filteredProblems.map((problem, index) => (
                  <tr
                    key={problem._id}
                    className="group border-b border-slate-800/60 last:border-none hover:bg-slate-800/60 transition-colors"
                  >
                    <td className="px-4 py-3 text-slate-400 font-mono">{index + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="text-slate-200 font-medium group-hover:text-white transition">
                          {problem.title}
                        </span>
                        <span className="text-[11px] text-slate-500 truncate max-w-xs">
                          {problem.description || 'No description'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-3 py-1 rounded-md text-xs font-semibold tracking-wide ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty?.charAt(0).toUpperCase() + problem.difficulty?.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-3 py-1 rounded-md text-xs font-semibold tracking-wide ${getTagColor(problem.tags)}`}>
                        {problem.tags}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(problem._id, problem.title)}
                        className="px-4 py-2 inline-flex items-center gap-2 rounded-md bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30 text-xs font-semibold transition-colors shadow-sm hover:shadow-red-500/20 active:scale-[.97]"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-10 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                        <Trash2 className="w-5 h-5 text-slate-500" />
                      </div>
                      <p className="text-slate-400 text-sm">No problems found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {filteredProblems.length > 0 ? (
            filteredProblems.map((problem, index) => (
              <div
                key={problem._id}
                className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 shadow-sm flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-white">{index + 1}. {problem.title}</h3>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                      {problem.description || 'No description'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(problem._id, problem.title)}
                    className="px-3 py-1.5 rounded-md bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-[11px] font-semibold flex items-center gap-1.5 active:scale-95 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-semibold tracking-wide ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty?.charAt(0).toUpperCase() + problem.difficulty?.slice(1)}
                  </span>
                  <span className={`px-2 py-1 rounded-md text-[10px] font-semibold tracking-wide ${getTagColor(problem.tags)}`}>
                    {problem.tags}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-slate-400 text-sm py-10 border border-slate-800 rounded-xl">
              No problems found
            </div>
          )}
        </div>

        {/* Warning */}
        <div className="mt-10 rounded-2xl border border-red-500/40 bg-gradient-to-br from-red-900/60 to-red-800/40 p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-md bg-red-500/20">
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-red-300 font-semibold text-lg">
                Critical Warning
              </h3>
              <p className="text-red-200/80 text-sm leading-relaxed">
                Deleting a problem is permanent and cannot be undone. All submissions and related data will also be removed.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        ::selection { background:#ef4444; color:white; }
        tbody tr:hover td { cursor:pointer; }
      `}</style>
    </div>
  );
};

export default AdminDelete;