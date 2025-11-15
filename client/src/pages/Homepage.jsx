import { useEffect, useState, useRef } from 'react';
import { NavLink } from 'react-router-dom'; // fixed import
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../authSlice';
import {
  LogOut,
  Menu,
  X,
  Code2,
  CheckCircle,
  ChevronDown,
  Check,
  Filter,
  BarChart3,
  Sparkles
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

function Homepage() {
  const toastShown = useRef(false);
  const firstLoadRef = useRef(true); // first-load overlay
  const MIN_LOAD_MS = 500;           // smooth out flicker

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // dropdown states
  const [openStatus, setOpenStatus] = useState(false);
  const [openDifficulty, setOpenDifficulty] = useState(false);
  const [openTag, setOpenTag] = useState(false);

  const [filters, setFilters] = useState({
    difficulty: 'all',
    tag: 'all',
    status: 'all'
  });

  useEffect(() => {
    setLoading(true);
    const startedAt = Date.now();

    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/getAllProblem');
        setProblems(data);
      } catch (error) {
        console.error('Error fetching problems:', error);
        toast.error('Failed to load problems');
      } finally {
        // Keep loader on screen at least MIN_LOAD_MS
        const elapsed = Date.now() - startedAt;
        const remaining = Math.max(0, MIN_LOAD_MS - elapsed);
        setTimeout(() => {
          setLoading(false);
          firstLoadRef.current = false;
        }, remaining);
      }
    };

    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/problemSolvedByUser');
        setSolvedProblems(data);
      } catch (error) {
        console.error('Error fetching solved problems:', error);
      }
    };

    fetchProblems();
    if (user) {
      fetchSolvedProblems();
    }
  }, [user]);

  // same filtering logic (unchanged)
  const filteredProblems = problems.filter(problem => {
    const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
    const tagMatch = filters.tag === 'all' || problem.tags === filters.tag;
    const statusMatch =
      filters.status === 'all' ||
      solvedProblems.some(sp => sp._id === problem._id);
    return difficultyMatch && tagMatch && statusMatch;
  });

  const getTagColor = (tag) => {
    const tagColors = {
      array: 'bg-blue-500/15 text-blue-300 border border-blue-500/25',
      linkedList: 'bg-purple-500/15 text-purple-300 border border-purple-500/25',
      graph: 'bg-pink-500/15 text-pink-300 border border-pink-500/25',
      dp: 'bg-orange-500/15 text-orange-300 border border-orange-500/25',
      default: 'bg-slate-500/15 text-slate-300 border border-slate-600/25'
    };
    return tagColors[tag] || tagColors['default'];
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]);
  };

  // dropdown helpers
  const statusLabel = filters.status === 'all' ? 'All Problems' : 'Solved Problems';
  const difficultyLabel = ({
    all: 'All Difficulties',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard'
  })[filters.difficulty] || 'All Difficulties';
  const tagLabelMap = {
    all: 'All Tags',
    array: 'Array',
    linkedList: 'Linked List',
    graph: 'Graph',
    dp: 'DP'
  };
  const tagLabel = tagLabelMap[filters.tag] || 'All Tags';

  const closeAllDropdowns = () => {
    setOpenStatus(false);
    setOpenDifficulty(false);
    setOpenTag(false);
  };

  // derived stats (UI only)
  const totalCount = problems.length;
  const solvedCount = solvedProblems.length;
  const unsolvedCount = Math.max(totalCount - solvedCount, 0);

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Subtle decorative background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-sky-600/15 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-fuchsia-600/15 blur-3xl" />
      </div>

      <Toaster />

      {/* Top progress bar (minimal) */}
      {loading && (
        <div className="fixed top-0 left-0 right-0 z-50 h-0.5 overflow-hidden">
          <div className="h-full bg-sky-500 animate-loadbar" />
        </div>
      )}

      {/* First-load overlay (only on first ever page load) */}
      {loading && firstLoadRef.current && (
        <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="w-full max-w-sm text-center border border-slate-800 bg-slate-900/70 rounded-xl p-6">
            <div className="mx-auto mb-4 w-8 h-8 border-2 border-slate-600 border-t-sky-500 rounded-full animate-spin" />
            <h3 className="text-lg font-semibold">Fetching problems…</h3>
            <p className="text-slate-400 text-sm mt-1">Please wait a moment</p>
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <div className="bg-gradient-to-br from-sky-500 to-sky-600 p-2 rounded-lg">
              <Code2 className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold">
              Code<span className="text-sky-500">Matrix</span>
            </span>
          </NavLink>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="font-medium">{user?.firstName}</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/15 hover:bg-red-500/25 text-red-300 rounded-lg transition-all duration-200 border border-red-500/25"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>

            {user?.role === 'admin' && (
              <NavLink
                to="/admin"
                className="px-4 py-2 bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 rounded-lg transition-all duration-200 border border-sky-500/25"
              >
                Admin Panel
              </NavLink>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-slate-900 border-t border-slate-800 p-4 space-y-4">
            <div className="text-slate-300 font-medium">{user?.firstName}</div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 bg-red-500/15 hover:bg-red-500/25 text-red-300 rounded-lg transition-all"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
            {user?.role === 'admin' && (
              <NavLink
                to="/admin"
                className="block w-full px-4 py-2 bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 rounded-lg transition-all text-center"
              >
                Admin Panel
              </NavLink>
            )}
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div className="container mx-auto p-4 md:p-8">
        {/* Header Section */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-2 leading-tight">
            Problems <span className="bg-gradient-to-r from-sky-400 to-fuchsia-400 bg-clip-text text-transparent">Library</span>
          </h1>
          <p className="text-slate-400">Solve DSA problems and master your skills</p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-sky-400" />
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-400">Total</div>
              <div className="text-lg font-semibold">{totalCount}</div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-400">Solved</div>
              <div className="text-lg font-semibold text-emerald-300">{solvedCount}</div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-fuchsia-400" />
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-400">Unsolved</div>
              <div className="text-lg font-semibold text-fuchsia-300">{unsolvedCount}</div>
            </div>
          </div>
        </div>

        {/* Filters Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 md:p-4 mb-6 md:mb-8">
          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            <div className="flex items-center gap-2 text-slate-400">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filters</span>
            </div>

            {/* Status dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  const next = !openStatus;
                  setOpenStatus(next);
                  if (next) { setOpenDifficulty(false); setOpenTag(false); }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-white hover:border-sky-500/50 focus:border-sky-500 focus:outline-none"
              >
                {statusLabel}
                <ChevronDown className={`w-4 h-4 transition-transform ${openStatus ? 'rotate-180' : ''}`} />
              </button>
              {openStatus && (
                <div className="absolute mt-2 w-52 bg-slate-950/95 border border-slate-700 rounded-lg shadow-xl z-10">
                  {[
                    { value: 'all', label: 'All Problems' },
                    { value: 'solved', label: 'Solved Problems' }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      className="w-full text-left px-3 py-2 hover:bg-slate-800/70 flex items-center justify-between"
                      onClick={() => {
                        setFilters({ ...filters, status: opt.value });
                        setOpenStatus(false);
                      }}
                    >
                      <span>{opt.label}</span>
                      {filters.status === opt.value && <Check className="w-4 h-4 text-sky-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Difficulty dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  const next = !openDifficulty;
                  setOpenDifficulty(next);
                  if (next) { setOpenStatus(false); setOpenTag(false); }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-white hover:border-sky-500/50 focus:border-sky-500 focus:outline-none"
              >
                {difficultyLabel}
                <ChevronDown className={`w-4 h-4 transition-transform ${openDifficulty ? 'rotate-180' : ''}`} />
              </button>
              {openDifficulty && (
                <div className="absolute mt-2 w-52 bg-slate-950/95 border border-slate-700 rounded-lg shadow-xl z-10">
                  {[
                    { value: 'all', label: 'All Difficulties' },
                    { value: 'easy', label: 'Easy' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'hard', label: 'Hard' }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      className="w-full text-left px-3 py-2 hover:bg-slate-800/70 flex items-center justify-between"
                      onClick={() => {
                        setFilters({ ...filters, difficulty: opt.value });
                        setOpenDifficulty(false);
                      }}
                    >
                      <span>{opt.label}</span>
                      {filters.difficulty === opt.value && <Check className="w-4 h-4 text-sky-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Tag dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  const next = !openTag;
                  setOpenTag(next);
                  if (next) { setOpenStatus(false); setOpenDifficulty(false); }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-white hover:border-sky-500/50 focus:border-sky-500 focus:outline-none"
              >
                {tagLabel}
                <ChevronDown className={`w-4 h-4 transition-transform ${openTag ? 'rotate-180' : ''}`} />
              </button>
              {openTag && (
                <div className="absolute mt-2 w-52 bg-slate-950/95 border border-slate-700 rounded-lg shadow-xl z-10">
                  {[
                    { value: 'all', label: 'All Tags' },
                    { value: 'array', label: 'Array' },
                    { value: 'linkedList', label: 'Linked List' },
                    { value: 'graph', label: 'Graph' },
                    { value: 'dp', label: 'DP' }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      className="w-full text-left px-3 py-2 hover:bg-slate-800/70 flex items-center justify-between"
                      onClick={() => {
                        setFilters({ ...filters, tag: opt.value });
                        setOpenTag(false);
                      }}
                    >
                      <span>{opt.label}</span>
                      {filters.tag === opt.value && <Check className="w-4 h-4 text-sky-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Clear filters (if any active) */}
            {(filters.difficulty !== 'all' || filters.tag !== 'all' || filters.status !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setFilters({ difficulty: 'all', tag: 'all', status: 'all' });
                  closeAllDropdowns();
                }}
                className="px-3 py-2 text-sm bg-slate-950/70 border border-slate-700 rounded-lg hover:border-slate-600"
              >
                Clear
              </button>
            )}

            {/* Count */}
            <div className="text-slate-400 text-sm md:ml-auto px-1 md:px-2">
              Total: <span className="text-sky-400 font-semibold ml-1">{filteredProblems.length}</span>
            </div>
          </div>

          {/* Active filter chips */}
          {(filters.difficulty !== 'all' || filters.tag !== 'all' || filters.status !== 'all') && (
            <div className="mt-3 flex flex-wrap gap-2">
              {filters.status !== 'all' && (
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm border border-sky-500/30 bg-sky-500/10 text-sky-300">
                  Status: {statusLabel}
                  <button
                    className="hover:text-white"
                    onClick={() => setFilters({ ...filters, status: 'all' })}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}
              {filters.difficulty !== 'all' && (
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm border border-amber-500/30 bg-amber-500/10 text-amber-300">
                  Difficulty: {difficultyLabel}
                  <button
                    className="hover:text-white"
                    onClick={() => setFilters({ ...filters, difficulty: 'all' })}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}
              {filters.tag !== 'all' && (
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm border border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-300">
                  Tag: {tagLabel}
                  <button
                    className="hover:text-white"
                    onClick={() => setFilters({ ...filters, tag: 'all' })}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Problems List */}
        <div className="space-y-4">
          {loading ? (
            // Loading Skeleton (shimmer)
            [...Array(5)].map((_, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 p-6 bg-slate-900/60"
              >
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="h-6 shimmer rounded w-3/4 mb-2"></div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="h-8 shimmer rounded w-20"></div>
                  <div className="h-8 shimmer rounded w-24"></div>
                </div>
              </div>
            ))
          ) : filteredProblems.length > 0 ? (
            filteredProblems.map((problem) => (
              <NavLink
                key={problem._id}
                to={`/problem/${problem._id}`}
                className="block group"
              >
                {/* Gradient border wrapper for subtle premium look */}
                <div className="rounded-xl p-[1px] bg-gradient-to-r from-sky-600/20 to-fuchsia-600/20 hover:from-sky-600/35 hover:to-fuchsia-600/35 transition-colors">
                  <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-6 backdrop-blur-sm hover:bg-slate-900/70 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <h2 className="text-lg md:text-xl font-semibold text-white group-hover:text-sky-300 transition-colors">
                          {problem.title}
                        </h2>
                      </div>

                      {solvedProblems.some(sp => sp._id === problem._id) && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/15 border border-emerald-500/30 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-emerald-300" />
                          <span className="text-sm font-medium text-emerald-300">Solved</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-3 items-center">
                      {/* Difficulty Badge */}
                      <div
                        className={`px-3 py-1 rounded-lg font-medium text-sm ${
                          problem.difficulty === 'easy'
                            ? 'bg-green-500/15 text-green-300 border border-green-500/30'
                            : problem.difficulty === 'medium'
                            ? 'bg-yellow-500/15 text-yellow-300 border border-yellow-500/30'
                            : 'bg-red-500/15 text-red-300 border border-red-500/30'
                        }`}
                      >
                        {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                      </div>

                      {/* Tag Badge */}
                      <div className={`px-3 py-1 rounded-lg font-medium text-sm ${getTagColor(problem.tags)}`}>
                        {problem.tags}
                      </div>
                    </div>
                  </div>
                </div>
              </NavLink>
            ))
          ) : (
            <div className="text-center py-16 rounded-xl border border-slate-800 bg-slate-900/60">
              <p className="text-slate-300 text-lg">No problems found</p>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => setFilters({ difficulty: 'all', tag: 'all', status: 'all' })}
                  className="px-4 py-2 bg-slate-950/70 border border-slate-700 rounded-lg hover:border-slate-600"
                >
                  Clear filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Minimal CSS utilities */}
      <style>{`
        /* Minimal indeterminate bar */
        @keyframes loadbar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(-20%); }
          100% { transform: translateX(100%); }
        }
        .animate-loadbar {
          width: 30%;
          height: 100%;
          animation: loadbar 1.2s ease-in-out infinite;
        }

        /* Shimmer for skeletons */
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .shimmer {
          background: linear-gradient(90deg, rgba(15,23,42,0.6) 25%, rgba(51,65,85,0.6) 50%, rgba(15,23,42,0.6) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.2s ease-in-out infinite;
        }

        .hover\\:scale-102:hover { transform: scale(1.02); }
      `}</style>
    </div>
  );
}

export default Homepage;