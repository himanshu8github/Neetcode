import { useEffect, useState, useRef } from 'react';
import { NavLink } from 'react-router'; 
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../authSlice';
import { LogOut, Menu, X, Code2, CheckCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

function Homepage() {
  const toastShown = useRef(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [filters, setFilters] = useState({
    difficulty: 'all',
    tag: 'all',
    status: 'all' 
  });

 useEffect(() => {
   setLoading(true);
  const fetchProblems = async () => {
    try {
     
      const { data } = await axiosClient.get('/problem/getAllProblem');
      setProblems(data);
    } catch (error) {
      console.error('Error fetching problems:', error);
      toast.error('Failed to load problems');
    } finally {
      setLoading(false);
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


    
// useEffect(() => {
//   if (user && !toastShown.current) {
//     toast.success(`Welcome back, ${user.firstName}! 🎉`, {
//       duration: 3000,
//       position: 'top-center',
//       style: {
//         background: '#0f172a',
//         color: '#fff',
//         border: '1px solid #0ea5e9',
//         padding: '16px 24px',        
//         fontSize: '18px',            
//         fontWeight: '600',            
//         minWidth: '350px', 
//       },
//       iconTheme: {
//         primary: '#0ea5e9',
//         secondary: '#fff',
//       },
//     });
//     toastShown.current = true;
//   }
// }, [user]);


// useEffect(() => {
//   const justLoggedIn = sessionStorage.getItem('justLoggedIn'); //  from AuthPage
//   if (user && justLoggedIn && !toastShown.current) {
//     toast.success(`Welcome back, ${user.firstName}! 🎉`, {
//       duration: 3000,
//       position: 'top-center',
//       style: {
//         background: '#0f172a',
//         color: '#fff',
//         border: '1px solid #0ea5e9',
//         padding: '16px 24px',
//         fontSize: '18px',
//         fontWeight: '600',
//         minWidth: '350px',
//       },
//       iconTheme: {
//         primary: '#0ea5e9',
//         secondary: '#fff',
//       },
//     });
//     toastShown.current = true;

//     //  Remove flag so it won't trigger again on refresh
//     sessionStorage.removeItem('justLoggedIn');
//   }
// }, [user]);


  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]);
  };

  const filteredProblems = problems.filter(problem => {
    const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
    const tagMatch = filters.tag === 'all' || problem.tags === filters.tag;
    const statusMatch = filters.status === 'all' || 
                      solvedProblems.some(sp => sp._id === problem._id);
    return difficultyMatch && tagMatch && statusMatch;
  });

  const getTagColor = (tag) => {
    const tagColors = {
      'array': 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
      'linkedList': 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
      'graph': 'bg-pink-500/20 text-pink-400 border border-pink-500/30',
      'dp': 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
      'default': 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
    };
    return tagColors[tag] || tagColors['default'];
  };

  return (
    <div className="min-h-screen bg-black text-white">
          <Toaster /> 
      {/* Navigation Bar */}
      <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <div className="bg-gradient-to-br from-sky-500 to-sky-600 p-2 rounded-lg">
              <Code2 className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold">Code<span className="text-sky-500">Matrix</span></span>
          </NavLink>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="font-medium">{user?.firstName}</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all duration-300 border border-red-500/30"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>

            {user?.role === 'admin' && (
              <NavLink
                to="/admin"
                className="px-4 py-2 bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 rounded-lg transition-all duration-300 border border-sky-500/30"
              >
                Admin Panel
              </NavLink>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-slate-900 border-t border-slate-800 p-4 space-y-4 animate-fade-in">
            <div className="text-slate-300 font-medium">{user?.firstName}</div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
            {user?.role === 'admin' && (
              <NavLink
                to="/admin"
                className="block w-full px-4 py-2 bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 rounded-lg transition-all text-center"
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
        <div className="mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Problems <span className="text-sky-500">Library</span>
          </h1>
          <p className="text-slate-400">Solve DSA problems and master your skills</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <select 
            className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white hover:border-sky-500/50 focus:border-sky-500 focus:outline-none transition-all"
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="all">All Problems</option>
            <option value="solved">Solved Problems</option>
          </select>

          <select 
            className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white hover:border-sky-500/50 focus:border-sky-500 focus:outline-none transition-all"
            value={filters.difficulty}
            onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select 
            className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white hover:border-sky-500/50 focus:border-sky-500 focus:outline-none transition-all"
            value={filters.tag}
            onChange={(e) => setFilters({...filters, tag: e.target.value})}
          >
            <option value="all">All Tags</option>
            <option value="array">Array</option>
            <option value="linkedList">Linked List</option>
            <option value="graph">Graph</option>
            <option value="dp">DP</option>
          </select>

          <div className="text-slate-400 text-sm flex items-center px-4">
            Total: <span className="text-sky-400 font-semibold ml-2">{filteredProblems.length}</span>
          </div>
        </div>

       {/* Problems List */}
        <div className="space-y-4">
          {loading ? (
            // Loading Skeleton
            [...Array(5)].map((_, idx) => (
              <div
                key={idx}
                className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur-sm animate-pulse"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="h-6 bg-slate-800 rounded w-3/4 mb-2"></div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="h-8 bg-slate-800 rounded w-20"></div>
                  <div className="h-8 bg-slate-800 rounded w-24"></div>
                </div>
              </div>
            ))
          ) : filteredProblems.length > 0 ? (
            filteredProblems.map((problem, idx) => (
              <NavLink
                key={problem._id}
                to={`/problem/${problem._id}`}
                className="block group animate-fade-in"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {/* Keep all your existing problem card code here - DON'T CHANGE ANYTHING BELOW */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur-sm hover:border-sky-500/50 hover:bg-slate-900/80 transition-all duration-300 transform hover:scale-102 hover:shadow-lg hover:shadow-sky-500/10 cursor-pointer">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h2 className="text-lg md:text-xl font-semibold text-white group-hover:text-sky-400 transition-colors">
                        {problem.title}
                      </h2>
                    </div>

                    {solvedProblems.some(sp => sp._id === problem._id) && (
                      <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-lg animate-pulse">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-medium text-green-400">Solved</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3 items-center">
                    {/* Difficulty Badge */}
                    <div
                      className={`px-3 py-1 rounded-lg font-medium text-sm transition-all transform group-hover:scale-110 ${
                        problem.difficulty === 'easy'
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : problem.difficulty === 'medium'
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                    </div>

                    {/* Tag Badge */}
                    <div className={`px-3 py-1 rounded-lg font-medium text-sm transition-all transform group-hover:scale-110 ${getTagColor(problem.tags)}`}>
                      {problem.tags}
                    </div>
                  </div>
                </div>
              </NavLink>
            ))
          ) : (
            <div className="text-center py-16">
              <p className="text-slate-400 text-lg">No problems found</p>
            </div>
          )}
        </div>
      </div>

 

      {/* Custom Animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }

        .hover\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
}

export default Homepage;