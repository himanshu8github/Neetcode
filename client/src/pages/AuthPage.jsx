import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { loginUser, registerUser } from '../authSlice';
import { Mail, Lock, User, Eye, EyeOff, Code2, ArrowRight } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import {
  signInWithPopup,
  getRedirectResult,
  GoogleAuthProvider,
  signInWithRedirect
} from 'firebase/auth';
import { auth } from '../config/firebase';
import axiosClient from '../utils/axiosClient';
import LeftHero from '../components/LeftHero';

// Validation Schemas
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
  const [firebaseLoading, setFirebaseLoading] = useState(false);
  const [checkingRedirect, setCheckingRedirect] = useState(false);

  // Forms
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    reset: resetLogin,
  } = useForm({ resolver: zodResolver(loginSchema) });
  const {
    register: registerSignup,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors },
    reset: resetSignup,
  } = useForm({ resolver: zodResolver(signupSchema) });

  // Manual auth redirect
  useEffect(() => {
    if (isAuthenticated) {
      setTimeout(() => navigate('/'), 500);
    }
  }, [isAuthenticated, navigate]);

  // Firebase redirect
  useEffect(() => {
    const checkRedirectResult = async () => {
      setCheckingRedirect(true);
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          const intendedMode = sessionStorage.getItem('googleIntendedMode'); // added
          const wasSignup = intendedMode === 'signup';                       // added
          await handleFirebaseUser(result.user, wasSignup);                  // changed
          sessionStorage.removeItem('googleIntendedMode');
          return;
        }
      } catch (error) {
        console.error('Firebase redirect error:', error);
        toast.error('Authentication failed');
      } finally {
        setCheckingRedirect(false);   // Only set to false if no redirect result
      }
    };
    checkRedirectResult();
  }, []);

  const handleFirebaseUser = async (user, isNewSignup) => {
    try {
      await user.reload();
      const email =
        user.email ||
        user.providerData?.find(p => p.providerId === 'google.com')?.email ||
        null;

      if (!email) {
        toast.error('Email not available from Google. Please try again.');
        setFirebaseLoading(false);
        setCheckingRedirect(false);
        return;
      }
      const idToken = await user.getIdToken();
      const response = await axiosClient.post('/user/firebase-register', {
        uid: user.uid,
        firstName: user.displayName?.split(' ')[0] || 'User',
        emailId: email,
        photoURL: user.photoURL || null,
        idToken,
      });

      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: "auth/loginSuccess",
          payload: response.data.user
        });

        sessionStorage.setItem('justLoggedIn', 'true');

        // Navigate IMMEDIATELY without delay or toast
        navigate('/', { replace: true });

        setTimeout(() => {
          toast.success(isNewSignup ?
            'Account created successfully! 🎉'
            : 'Logged in successfully! 🎉', {
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
        }, 100);
      }
    } catch (error) {
      console.error('Firebase user registration error:', error);
      toast.error(error.response?.data?.message || 'Registration failed');
      setCheckingRedirect(false);
    } finally {
      setFirebaseLoading(false);
    }
  };

  // Google OAuth only
  const handleGoogleAuth = async () => {
    if (firebaseLoading) return;
    setFirebaseLoading(true);
    sessionStorage.setItem('googleIntendedMode', isSignUp ? 'signup' : 'login');
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      const result = await signInWithPopup(auth, provider);
      await handleFirebaseUser(result.user, isSignUp);
    } catch (e) {
      console.warn('Popup failed, falling back to redirect:', e?.message || e);
      await signInWithRedirect(auth, provider);
    } finally {
      if (!sessionStorage.getItem('googleIntendedMode')) {
        setFirebaseLoading(false);
      }
    }
  };

  // Manual login
  const onLoginSubmit = async (data) => {
    try {
      await dispatch(loginUser(data)).unwrap();
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
        sessionStorage.setItem('loginToastShown', 'true');
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

  // Manual signup
  const onSignupSubmit = async (data) => {
    try {
      await dispatch(registerUser(data)).unwrap();
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
        sessionStorage.setItem('signupToastShown', 'true');
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

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setShowPassword(false);
    toastShownLogin.current = false;
    toastShownSignup.current = false;
    if (isSignUp) resetLogin();
    else resetSignup();
  };

  if (checkingRedirect) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <Toaster />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="w-full max-w-5xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <LeftHero />

          <div className="w-full max-w-md mx-auto">
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl hover:border-slate-600/50 transition-colors duration-300">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">CodeMatrix</h2>
                  <p className="text-xl text-slate-400">Master DSA</p>
                </div>
              </div>

              <div className="flex gap-2 bg-slate-800/30 p-1.5 rounded-lg mb-5 border border-slate-700/30">
                <button
                  type="button"
                  onClick={() => { if (isSignUp) toggleForm(); }}
                  className={`flex-1 py-2.5 px-3 rounded-md font-semibold text-sm transition-all duration-300 ${!isSignUp ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30' : 'text-slate-400 hover:text-slate-300'}`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { if (!isSignUp) toggleForm(); }}
                  className={`flex-1 py-2.5 px-3 rounded-md font-semibold text-sm transition-all duration-300 ${isSignUp ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30' : 'text-slate-400 hover:text-slate-300'}`}
                >
                  Sign Up
                </button>
              </div>

              {/* Mobile-only heading above the form */}
              <div className="lg:hidden text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-1">
                  {isSignUp ? 'Welcome to CodeMatrix' : 'Welcome back'}
                </h3>

              </div>

              <div className={`relative h-auto ${ isSignUp
      ? 'min-h-[500px] lg:min-h-[440px]'
      : 'min-h-[500px] lg:min-h-[400px]'}`}>
                {/* Sign In */}
                <div className={`absolute inset-0 transition-all duration-500 ${isSignUp ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                  <form onSubmit={handleLoginSubmit(onLoginSubmit)} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">Email Address</label>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-500 group-focus-within:text-cyan-500 transition-colors" />
                        <input
                          type="email"
                          placeholder="your@gmail.com"
                          autoComplete="email"
                          className={`w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all ${loginErrors.emailId ? 'border-red-500/50' : 'border-slate-700/50'}`}
                          {...registerLogin('emailId')}
                        />
                      </div>
                      {loginErrors.emailId && <p className="text-red-400 text-xs mt-1.5">{loginErrors.emailId.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">Password</label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-500 group-focus-within:text-cyan-500 transition-colors" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="enter your password"
                          autoComplete="current-password"
                          className={`w-full pl-10 pr-10 py-2.5 bg-slate-800/50 border rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all ${loginErrors.password ? 'border-red-500/50' : 'border-slate-700/50'}`}
                          {...registerLogin('password')}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {loginErrors.password && <p className="text-red-400 text-xs mt-1.5">{loginErrors.password.message}</p>}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full mt-6 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-cyan-600/40"
                    >
                      {loading ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        <>
                          Sign In <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>

                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex-1 h-px bg-slate-700/30" />
                    <span className="text-xs text-slate-400 px-2">OR</span>
                    <div className="flex-1 h-px bg-slate-700/30" />
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={handleGoogleAuth}
                      disabled={firebaseLoading}
                      className="col-span-3 flex items-center justify-center gap-1 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 disabled:opacity-60"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Google
                    </button>
                  </div>

                  {/* Social footer (Sign In) */}
<div className="mt-6 pt-6 border-t border-slate-700/30 lg:hidden">
  <p className="text-center text-xs text-slate-400 mb-3">Connect with us</p>

  <div className="flex justify-center gap-4">

    {/* LinkedIn */}
    <a
      href="https://www.linkedin.com/in/himanshu-choudhary-1a19ba255"
      target="_blank"
      rel="noopener noreferrer"
      className="text-slate-400 hover:text-cyan-500 transition-colors"
      aria-label="LinkedIn"
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0 8h5v16H0V8zm7.5 0h4.7v2.2h.1c.7-1.3 2.4-2.7 5-2.7 5.3 0 6.3 3.5 6.3 8v8.5h-5V16c0-2.4 0-5.5-3.3-5.5-3.3 0-3.8 2.6-3.8 5.3v8.2h-5V8z"/>
      </svg>
    </a>

    {/* Twitter / X */}
    <a
      href="https://x.com/himanshuu_5"
      target="_blank"
      rel="noopener noreferrer"
      className="text-slate-400 hover:text-cyan-500 transition-colors"
      aria-label="Twitter"
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
      </svg>
    </a>

    {/* GitHub */}
    <a
      href="https://github.com/himanshu8github"
      target="_blank"
      rel="noopener noreferrer"
      className="text-slate-400 hover:text-cyan-500 transition-colors"
      aria-label="GitHub"
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.371 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756C2.545 16.266 3.718 16.28 3.718 16.28c1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604C6.146 16.604 3.344 15.575 3.344 10c0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.48 11.48 0 0112 4.079c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 5.592-2.807 6.609-5.479 6.906.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12z"/>
      </svg>
    </a>

  </div>
</div>

                </div>

                {/* Sign Up */}
                <div className={`absolute inset-0 transition-all duration-500 ${isSignUp ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                  <form onSubmit={handleSignupSubmit(onSignupSubmit)} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">Full Name</label>
                      <div className="relative group">
                        <User className="absolute left-3 top-3.5 w-4 h-4 text-slate-500 group-focus-within:text-cyan-500 transition-colors" />
                        <input
                          type="text"
                          placeholder="Enter your name"
                          autoComplete="given-name"
                          className={`w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all ${signupErrors.firstName ? 'border-red-500/50' : 'border-slate-700/50'}`}
                          {...registerSignup('firstName')}
                        />
                      </div>
                      {signupErrors.firstName && <p className="text-red-400 text-xs mt-1.5">{signupErrors.firstName.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">Email Address</label>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-500 group-focus-within:text-cyan-500 transition-colors" />
                        <input
                          type="email"
                          placeholder="your@gmail.com"
                          autoComplete="email"
                          className={`w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all ${signupErrors.emailId ? 'border-red-500/50' : 'border-slate-700/50'}`}
                          {...registerSignup('emailId')}
                        />
                      </div>
                      {signupErrors.emailId && <p className="text-red-400 text-xs mt-1.5">{signupErrors.emailId.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">Password</label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-500 group-focus-within:text-cyan-500 transition-colors" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="enter your password"
                          autoComplete="new-password"
                          className={`w-full pl-10 pr-10 py-2.5 bg-slate-800/50 border rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all ${signupErrors.password ? 'border-red-500/50' : 'border-slate-700/50'}`}
                          {...registerSignup('password')}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {signupErrors.password && <p className="text-red-400 text-xs mt-1.5">{signupErrors.password.message}</p>}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full mt-6 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-cyan-600/40"
                    >
                      {loading ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          Create Account <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>

                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex-1 h-px bg-slate-700/30" />
                    <span className="text-xs text-slate-400 px-2">OR</span>
                    <div className="flex-1 h-px bg-slate-700/30" />
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-1">
                    <button
                      type="button"
                      onClick={handleGoogleAuth}
                      disabled={firebaseLoading}
                      className="col-span-3 w-full flex items-center justify-center gap-1 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 disabled:opacity-60"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Google
                    </button>
                  </div>

                  {/* Social footer (Sign Up) */}
                 <div className="mt-6 pt-6 border-t border-slate-700/30 lg:hidden" >
  <p className="text-center text-xs text-slate-400 mb-3">Connect with us</p>

  <div className="flex justify-center gap-4">

    {/* LinkedIn */}
    <a 
      href="https://www.linkedin.com/in/himanshu-choudhary-1a19ba255"
      target="_blank"
      rel="noopener noreferrer"
      className="text-slate-400 hover:text-cyan-500 transition-colors"
      aria-label="LinkedIn"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0 8h5v16H0V8zm7.5 0h4.7v2.2h.1c.7-1.3 2.4-2.7 5-2.7 5.3 0 6.3 3.5 6.3 8v8.5h-5V16c0-2.4 0-5.5-3.3-5.5-3.3 0-3.8 2.6-3.8 5.3v8.2h-5V8z"/>
      </svg>
    </a>

    {/* Twitter / X */}
    <a 
      href="https://x.com/himanshuu_5"
      target="_blank"
      rel="noopener noreferrer"
      className="text-slate-400 hover:text-cyan-500 transition-colors"
      aria-label="Twitter"
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
      </svg>
    </a>

    {/* GitHub */}
    <a 
      href="https://github.com/himanshu8github"
      target="_blank"
      rel="noopener noreferrer"
      className="text-slate-400 hover:text-cyan-500 transition-colors"
      aria-label="GitHub"
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    </a>

  </div>
</div>



                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes subtle-fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-subtle-fade {
          animation: subtle-fade 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default AuthPage;