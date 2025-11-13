import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { loginUser, registerUser } from '../authSlice';
import { Mail, Lock, User, Eye, EyeOff, Code2, Zap } from 'lucide-react';
import SocialFooter from '../components/Social'
import toast, { Toaster } from 'react-hot-toast';

// Validation Schemas (unchanged)
const loginSchema = z.object({
  emailId: z.string().email('Invalid Email'),
  password: z.string().min(8, 'Password is too weak'),
});

const signupSchema = z.object({
  firstName: z.string().min(3, 'Minimum 3 characters'),
  emailId: z.string().email('Invalid Email'),
  password: z.string().min(8, 'Password is too weak'),
});

function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const toastShownLogin = useRef(false);
const toastShownSignup = useRef(false);
// const [isRedirecting, setIsRedirecting] = useState(false);

  // Login Form (unchanged)
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    reset: resetLogin,
  } = useForm({ resolver: zodResolver(loginSchema) });

  // Signup Form (unchanged)
  const {
    register: registerSignup,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors },
    reset: resetSignup,
  } = useForm({ resolver: zodResolver(signupSchema) });

  // useEffect(() => {
  //   if (isAuthenticated) navigate('/');
  // }, [isAuthenticated, navigate]);
  
  useEffect(() => {
  if (isAuthenticated) {
    setIsRedirecting(true);
    // Small delay to show loading screen
    setTimeout(() => {
      navigate('/');
    }, 500);
  }
}, [isAuthenticated, navigate]);

  // Handlers (unchanged)
  // const onLoginSubmit = (data) => dispatch(loginUser(data));
  // const onSignupSubmit = (data) => dispatch(registerUser(data));

//   const onLoginSubmit = async (data) => {
//   try {
//     await dispatch(loginUser(data)).unwrap();
//     if (!toastShownLogin.current) {
//       toast.success('Signed in successfully! 🎉', {
//         duration: 3000,
//         position: 'top-center',
//         style: {
//           background: '#0f172a',
//           color: '#fff',
//           border: '1px solid #0ea5e9',
//           padding: '16px 24px',
//           fontSize: '16px',
//           fontWeight: '600',
//         },
//       });
//       toastShownLogin.current = true;
//     }
//   } catch (error) {
//     toast.error(error.message || 'Login failed. Please try again.', {
//       duration: 3000,
//       position: 'top-center',
//       style: {
//         background: '#0f172a',
//         color: '#fff',
//         border: '1px solid #ef4444',
//         padding: '16px 24px',
//         fontSize: '16px',
//         fontWeight: '600',
//       },
//     });
//   }
// };

const onLoginSubmit = async (data) => {
  try {
    await dispatch(loginUser(data)).unwrap();

    //  Show toast only once per session (even after refresh)
    if (!toastShownLogin.current && !sessionStorage.getItem('loginToastShown')) {
      toast.success('Signed in successfully! 🎉', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#0f172a',
          color: '#fff',
          border: '1px solid #0ea5e9',
          padding: '16px 24px',
          fontSize: '16px',
          fontWeight: '600',
        },
      });
      toastShownLogin.current = true;
      sessionStorage.setItem('loginToastShown', 'true'); // store flag till tab closes
    }

    sessionStorage.setItem('justLoggedIn', 'true');
  } catch (error) {
    toast.error(error.message || 'Login failed. Please try again.', {
      duration: 3000,
      position: 'top-center',
      style: {
        background: '#0f172a',
        color: '#fff',
        border: '1px solid #ef4444',
        padding: '16px 24px',
        fontSize: '16px',
        fontWeight: '600',
      },
    });
  }
};


const onSignupSubmit = async (data) => {
  try {
    await dispatch(registerUser(data)).unwrap();

    //  Show toast only once per session (even after refresh)
    if (!toastShownSignup.current && !sessionStorage.getItem('signupToastShown')) {
      toast.success('Account created successfully! 🎉', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#0f172a',
          color: '#fff',
          border: '1px solid #0ea5e9',
          padding: '16px 24px',
          fontSize: '16px',
          fontWeight: '600',
        },
      });
      toastShownSignup.current = true;
      sessionStorage.setItem('signupToastShown', 'true'); // store flag till tab closes
    }

  } catch (error) {
    toast.error(error.message || 'Signup failed. Please try again.', {
      duration: 3000,
      position: 'top-center',
      style: {
        background: '#0f172a',
        color: '#fff',
        border: '1px solid #ef4444',
        padding: '16px 24px',
        fontSize: '16px',
        fontWeight: '600',
      },
    });
  }
};


// const onSignupSubmit = async (data) => {
//   try {
//     await dispatch(registerUser(data)).unwrap();
//     if (!toastShownSignup.current) {
//       toast.success('Account created successfully! 🎉', {
//         duration: 3000,
//         position: 'top-center',
//         style: {
//           background: '#0f172a',
//           color: '#fff',
//           border: '1px solid #0ea5e9',
//           padding: '16px 24px',
//           fontSize: '16px',
//           fontWeight: '600',
//         },
//       });
//       toastShownSignup.current = true;
//     }
//   } catch (error) {
//     toast.error(error.message || 'Signup failed. Please try again.', {
//       duration: 3000,
//       position: 'top-center',
//       style: {
//         background: '#0f172a',
//         color: '#fff',
//         border: '1px solid #ef4444',
//         padding: '16px 24px',
//         fontSize: '16px',
//         fontWeight: '600',
//       },
//     });
//   }
// };

  // const toggleForm = () => {
  //   setIsSignUp(!isSignUp);
  //   setShowPassword(false);
  //   if (isSignUp) resetLogin();
  //   else resetSignup();
  // };

  const toggleForm = () => {
  setIsSignUp(!isSignUp);
  setShowPassword(false);
  toastShownLogin.current = false;
  toastShownSignup.current = false;
  if (isSignUp) resetLogin();
  else resetSignup();
};

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Gradient Blobs */}
          <Toaster />
      <div className="absolute top-[-20%] left-[-10%] w-[40rem] h-[40rem] bg-sky-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-25%] right-[-10%] w-[42rem] h-[42rem] bg-violet-500/10 rounded-full blur-3xl animate-pulse" />

      {/* Floating Particles */}
      <div className="absolute inset-0 -z-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-sky-400/10 rounded-full animate-float"
            style={{
              width: `${Math.random() * 10 + 4}px`,
              height: `${Math.random() * 10 + 4}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 5 + 3}s`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side — Hero / Branding */}
          <div className="hidden lg:flex flex-col items-center justify-center space-y-12">
            {/* Glowing Icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-sky-500/30 rounded-full blur-2xl animate-pulse" />
              <div className="relative bg-gradient-to-br from-sky-500 to-sky-600 p-8 rounded-3xl shadow-[0_0_40px_rgba(14,165,233,0.35)] animate-bounce-slow">
                <Zap className="w-16 h-13 text-white" />
              </div>
            </div>

            {/* Text */}
            <div className="text-center space-y-6 animate-fade-in-up">
              <p className="text-slate-400 text-2xl font-bold tracking-widest uppercase animate-pulse">
                Welcome back
              </p>
              <h2 className="text-3xl font-extrabold text-white leading-tight">to</h2>
              <h2 className="text-5xl font-extrabold bg-gradient-to-r from-sky-400 via-sky-500 to-sky-600 bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]">
                CodeMatrix
              </h2>
              <p className="text-slate-400 text-lg max-w-sm mx-auto">
                Master Data Structures &amp; Algorithms with AI-powered guidance
              </p>
            </div>

          {/* Social Footer inside Welcome Card */}
<div className="mt-1 w-full max-w-xs">
  <SocialFooter />
</div>

          </div>

          {/* Right Side — Auth Card with Gradient Border + Glass */}
          <div className="w-full max-w-md mx-auto">
            <div className="relative rounded-3xl p-[2px] bg-gradient-to-r from-sky-500 via-blue-600 to-purple-600 animate-gradient shadow-[0_10px_60px_rgba(59,130,246,0.25)]">
             <div className="rounded-3xl bg-slate-900/90 backdrop-blur-2xl border border-white/10 p-8">
                {/* Header */}
                {/* Header */}
<div className="text-center mb-8">
  <div className="flex items-center justify-center gap-2 mb-4 animate-fade-in">
    <div className="relative">
      <div className="absolute inset-0 bg-sky-500/30 blur-lg rounded-xl" />
      <div className="relative bg-gradient-to-br from-sky-500 to-sky-600 p-2 rounded-xl shadow-lg">
        <Code2 className="w-6 h-6 text-white" />
      </div>
    </div>
    <h1 className="text-3xl font-bold text-white">
      Code<span className="text-sky-500">Matrix</span>
    </h1>
  </div>
  
  {/* Larger animated welcome text */}
  <p className="text-slate-300 text-lg font-semibold mb-3 animate-fade-in-up">
    Welcome Back
  </p>
  
  <p className="text-slate-400 text-sm">Master DSA with AI-powered guidance</p>

</div>
               

                {/* Toggle Slider */}
            
<div className="flex gap-1 bg-slate-950/70 p-1 rounded-xl mb-6 border border-slate-800 backdrop-blur-sm shadow-inner">
  <button
    type="button"
    onClick={() => { if (isSignUp) toggleForm(); }}
    className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-500 transform ${
      !isSignUp
        ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/40 scale-100'
        : 'text-slate-400 hover:text-slate-200 scale-95'
    }`}
  >
    Sign In
  </button>
  <button
    type="button"
    onClick={() => { if (!isSignUp) toggleForm(); }}
    className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-500 transform ${
      isSignUp
        ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/40 scale-100'
        : 'text-slate-400 hover:text-slate-200 scale-95'
    }`}
  >
    Sign Up
  </button>
</div>
                {/* <div className="flex gap-1 bg-slate-900/70 p-1 rounded-xl mb-6 border border-slate-800 backdrop-blur-sm shadow-inner">
                  <button
                    onClick={() => !isSignUp && toggleForm()}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-500 transform ${
                      !isSignUp
                        ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/40 scale-100'
                        : 'text-slate-400 hover:text-slate-200 scale-95'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => isSignUp && toggleForm()}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-500 transform ${
                      isSignUp
                        ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/40 scale-100'
                        : 'text-slate-400 hover:text-slate-200 scale-95'
                    }`}
                  >
                    Sign Up
                  </button>
                </div> */}

                {/* Forms Container (same height, animated swap) */}
                {/* <div className="relative h-96 sm:h-[315px]"> */}
                <div className="relative h-96 sm:h-[320px]">
                  {/* Sign In Form */}
                  <div
                    className={`absolute inset-0 transition-all duration-700 ease-out ${
                      isSignUp ? 'opacity-0 translate-x-12 pointer-events-none' : 'opacity-100 translate-x-0'
                    }`}
                  >
                    <form onSubmit={handleLoginSubmit(onLoginSubmit)} className="space-y-4">
                      {/* Email */}
                      <div className="animate-fade-in" style={{ animationDelay: '0ms' }}>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                        <div className="relative group">
                          <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500 group-focus-within:text-sky-400 transition" />
                          <input
                            type="email"
                            placeholder="john@example.com"
                            autoComplete="email"
                            className={`w-full pl-10 pr-4 py-3 bg-slate-950/60 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/40 transition-all transform focus:scale-[1.015] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] ${
                              loginErrors.emailId ? 'border-red-500' : 'border-slate-800'
                            }`}
                            {...registerLogin('emailId')}
                          />
                        </div>
                        {loginErrors.emailId && (
                          <p className="text-red-400 text-xs mt-1">{loginErrors.emailId.message}</p>
                        )}
                      </div>

                      {/* Password */}
                      <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                        <div className="relative group">
                          <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500 group-focus-within:text-sky-400 transition" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            className={`w-full pl-10 pr-10 py-3 bg-slate-950/60 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/40 transition-all transform focus:scale-[1.015] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] ${
                              loginErrors.password ? 'border-red-500' : 'border-slate-800'
                            }`}
                            {...registerLogin('password')}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-slate-500 hover:text-sky-400 transition-colors transform hover:scale-110"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        {loginErrors.password && (
                          <p className="text-red-400 text-xs mt-1">{loginErrors.password.message}</p>
                        )}
                      </div>

                      {/* Sign In Button */}
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6 transform hover:scale-[1.02] active:scale-[0.99] shadow-lg shadow-sky-500/30 animate-fade-in"
                        style={{ animationDelay: '200ms' }}
                      >
                        {loading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Signing in...
                          </>
                        ) : (
                          'Sign In'
                        )}
                      </button>
                    </form>
                  </div>

                  {/* Sign Up Form */}
                  <div
                    className={`absolute inset-0 transition-all duration-700 ease-out ${
                      isSignUp ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12 pointer-events-none'
                    }`}
                  >
                    <form onSubmit={handleSignupSubmit(onSignupSubmit)} className="space-y-4">
                      {/* First Name */}
                      <div className="animate-fade-in" style={{ animationDelay: '0ms' }}>
                        <label className="block text-sm font-medium text-slate-200 mb-2">First Name</label>
                        <div className="relative group">
                          <User className="absolute left-3 top-3 w-5 h-5 text-slate-500 group-focus-within:text-sky-400 transition" />
                          <input
                            type="text"
                            placeholder="John"
                            autoComplete="given-name"
                            className={`w-full pl-10 pr-4 py-3 bg-slate-950/60 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/40 transition-all transform focus:scale-[1.015] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] ${
                              signupErrors.firstName ? 'border-red-500' : 'border-slate-800'
                            }`}
                            {...registerSignup('firstName')}
                          />
                        </div>
                        {signupErrors.firstName && (
                          <p className="text-red-400 text-xs mt-1">{signupErrors.firstName.message}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
                        <label className="block text-sm font-medium text-slate-200 mb-2">Email</label>
                        <div className="relative group">
                          <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500 group-focus-within:text-sky-400 transition" />
                          <input
                            type="email"
                            placeholder="john@example.com"
                            autoComplete="email"
                            className={`w-full pl-10 pr-4 py-3 bg-slate-950/60 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/40 transition-all transform focus:scale-[1.015] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] ${
                              signupErrors.emailId ? 'border-red-500' : 'border-slate-800'
                            }`}
                            {...registerSignup('emailId')}
                          />
                        </div>
                        {signupErrors.emailId && (
                          <p className="text-red-400 text-xs mt-1">{signupErrors.emailId.message}</p>
                        )}
                      </div>

                      {/* Password */}
                      <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
                        <label className="block text-sm font-medium text-slate-200 mb-2">Password</label>
                        <div className="relative group">
                          <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500 group-focus-within:text-sky-400 transition" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            autoComplete="new-password"
                            className={`w-full pl-10 pr-10 py-3 bg-slate-950/60 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/40 transition-all transform focus:scale-[1.015] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] ${
                              signupErrors.password ? 'border-red-500' : 'border-slate-800'
                            }`}
                            {...registerSignup('password')}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-slate-500 hover:text-sky-400 transition-colors transform hover:scale-110"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        {signupErrors.password && (
                          <p className="text-red-400 text-xs mt-1">{signupErrors.password.message}</p>
                        )}
                      </div>

                      {/* Sign Up Button */}
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6 transform hover:scale-[1.02] active:scale-[0.99] shadow-lg shadow-sky-500/30 animate-fade-in"
                        style={{ animationDelay: '300ms' }}
                      >
                        {loading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Creating account...
                          </>
                        ) : (
                          'Create Account'
                        )}
                      </button>
                    </form>
                  </div>
                </div>

    
                {/* Small Tagline
                <p className="text-center text-slate-500 text-xs mt-6">
                  Superfast • Secure • AI-Assisted Learning
                </p> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="absolute bottom-4 left-0 right-0 flex justify-center">
  <div className="w-[90%] sm:w-auto">
    <SocialFooter />
  </div>
</div> */}


      {/* Custom Animations */}
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out; }

        @keyframes fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }

        @keyframes float {
          0%   { transform: translateY(0); opacity: 0.4; }
          50%  { transform: translateY(-18px); opacity: 0.9; }
          100% { transform: translateY(0); opacity: 0.4; }
        }
        .animate-float { animation: float infinite ease-in-out; }

        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient { background-size: 200% 200%; animation: gradient 5s ease infinite; }

        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer { animation: shimmer 3.5s linear infinite; }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-bounce-slow { animation: bounce-slow 2.8s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

export default AuthPage;
