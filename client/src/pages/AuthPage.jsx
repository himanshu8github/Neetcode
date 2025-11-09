import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { loginUser, registerUser } from '../authSlice';
import { Mail, Lock, User, Eye, EyeOff, Code2, Zap } from 'lucide-react';

// Validation Schemas
const loginSchema = z.object({
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(8, "Password is too weak")
});

const signupSchema = z.object({
  firstName: z.string().min(3, "Minimum 3 characters"),
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(8, "Password is too weak")
});

function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  // Login Form
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    reset: resetLogin
  } = useForm({ resolver: zodResolver(loginSchema) });

  // Signup Form
  const {
    register: registerSignup,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors },
    reset: resetSignup
  } = useForm({ resolver: zodResolver(signupSchema) });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onLoginSubmit = (data) => {
    dispatch(loginUser(data));
  };

  const onSignupSubmit = (data) => {
    dispatch(registerUser(data));
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setShowPassword(false);
    if (isSignUp) resetLogin();
    else resetSignup();
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse"></div>

      <div className="w-full max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Side - Welcome Section with Animation */}
          <div className="hidden lg:flex flex-col items-center justify-center space-y-12">
            {/* Animated Robot Icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-sky-500/20 rounded-full blur-2xl animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-sky-500 to-sky-600 p-8 rounded-2xl animate-bounce">
                <Zap className="w-16 h-16 text-white" />
              </div>
            </div>

            {/* Welcome Text with Animation */}
            <div className="text-center space-y-6 animate-fade-in-up">
              <div className="space-y-2">
                <p className="text-slate-400 text-sm tracking-widest uppercase animate-pulse">Welcome back</p>
                <h2 className="text-5xl font-bold text-white leading-tight">
                  to
                </h2>
                <h2 className="text-5xl font-bold bg-gradient-to-r from-sky-400 via-sky-500 to-sky-600 bg-clip-text text-transparent animate-pulse">
                  CodeMatrix
                </h2>
              </div>
              <p className="text-slate-400 text-lg max-w-sm mx-auto">
                Master Data Structures & Algorithms with AI-powered guidance
              </p>
            </div>

            {/* Single Feature */}
           
          </div>

          {/* Right Side - Auth Forms */}
          <div className="w-full max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-2 mb-4 animate-fade-in">
                <div className="bg-gradient-to-br from-sky-500 to-sky-600 p-2 rounded-lg shadow-lg shadow-sky-500/50">
                  <Code2 className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white">
                  Code<span className="text-sky-500">Matrix</span>
                </h1>
              </div>
              <p className="text-slate-400 text-sm">Master DSA with AI-powered guidance</p>
            </div>

            {/* Toggle Slider with Enhanced Animation */}
            <div className="flex gap-1 bg-slate-900/80 p-1 rounded-xl mb-8 border border-slate-800 backdrop-blur-sm shadow-lg">
              <button
                onClick={() => !isSignUp && toggleForm()}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-500 transform ${
                  !isSignUp
                    ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/50 scale-100'
                    : 'text-slate-400 hover:text-slate-300 scale-95'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => isSignUp && toggleForm()}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-500 transform ${
                  isSignUp
                    ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/50 scale-100'
                    : 'text-slate-400 hover:text-slate-300 scale-95'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Forms Container - Fixed Height */}
            <div className="relative h-96 sm:h-[420px]">
              {/* Sign In Form */}
              <div
                className={`absolute inset-0 transition-all duration-700 ease-out ${
                  isSignUp
                    ? 'opacity-0 translate-x-12 pointer-events-none'
                    : 'opacity-100 translate-x-0'
                }`}
              >
                <form onSubmit={handleLoginSubmit(onLoginSubmit)} className="space-y-4">
                  {/* Email */}
                  <div className="animate-fade-in" style={{ animationDelay: '0ms' }}>
                    <label className="block text-sm font-medium text-white mb-2">Email</label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-600 group-focus-within:text-sky-500 transition" />
                      <input
                        type="email"
                        placeholder="john@example.com"
                        autoComplete="email"
                        className={`w-full pl-10 pr-4 py-3 bg-slate-900 border rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 transition-all transform focus:scale-105 ${
                          loginErrors.emailId ? 'border-red-500' : 'border-slate-700'
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
                    <label className="block text-sm font-medium text-white mb-2">Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-600 group-focus-within:text-sky-500 transition" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        className={`w-full pl-10 pr-10 py-3 bg-slate-900 border rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 transition-all transform focus:scale-105 ${
                          loginErrors.password ? 'border-red-500' : 'border-slate-700'
                        }`}
                        {...registerLogin('password')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-600 hover:text-sky-500 transition-colors transform hover:scale-110"
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
                    className="w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6 transform hover:scale-105 shadow-lg shadow-sky-500/30 animate-fade-in"
                    style={{ animationDelay: '200ms' }}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
                  isSignUp
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 -translate-x-12 pointer-events-none'
                }`}
              >
                <form onSubmit={handleSignupSubmit(onSignupSubmit)} className="space-y-4">
                  {/* First Name */}
                  <div className="animate-fade-in" style={{ animationDelay: '0ms' }}>
                    <label className="block text-sm font-medium text-white mb-2">First Name</label>
                    <div className="relative group">
                      <User className="absolute left-3 top-3 w-5 h-5 text-slate-600 group-focus-within:text-sky-500 transition" />
                      <input
                        type="text"
                        placeholder="John"
                        autoComplete="given-name"
                        className={`w-full pl-10 pr-4 py-3 bg-slate-900 border rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 transition-all transform focus:scale-105 ${
                          signupErrors.firstName ? 'border-red-500' : 'border-slate-700'
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
                    <label className="block text-sm font-medium text-white mb-2">Email</label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-600 group-focus-within:text-sky-500 transition" />
                      <input
                        type="email"
                        placeholder="john@example.com"
                        autoComplete="email"
                        className={`w-full pl-10 pr-4 py-3 bg-slate-900 border rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 transition-all transform focus:scale-105 ${
                          signupErrors.emailId ? 'border-red-500' : 'border-slate-700'
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
                    <label className="block text-sm font-medium text-white mb-2">Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-600 group-focus-within:text-sky-500 transition" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className={`w-full pl-10 pr-10 py-3 bg-slate-900 border rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 transition-all transform focus:scale-105 ${
                          signupErrors.password ? 'border-red-500' : 'border-slate-700'
                        }`}
                        {...registerSignup('password')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-600 hover:text-sky-500 transition-colors transform hover:scale-110"
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
                    className="w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6 transform hover:scale-105 shadow-lg shadow-sky-500/30 animate-fade-in"
                    style={{ animationDelay: '300ms' }}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Footer */}
            {/* <div className="mt-8 text-center text-slate-500 text-sm animate-fade-in">
              <p>Secure authentication for coders worldwide</p>
            </div> */}
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}

export default AuthPage;