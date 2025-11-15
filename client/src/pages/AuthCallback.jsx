import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router';
import axiosClient from '../utils/axiosClient';
import toast from 'react-hot-toast';

export default function AuthCallback() {
  const { isSignedIn, user: clerkUser, isLoaded } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const registerClerkUser = async () => {
      if (!isLoaded || !isSignedIn || !clerkUser) return;

      try {
        console.log('Attempting to register Clerk user:', clerkUser.id);
        
        const response = await axiosClient.post('/user/clerk-register', {
          clerkId: clerkUser.id,
          firstName: clerkUser.firstName || clerkUser.username || 'User',
          emailId: clerkUser.emailAddresses[0]?.emailAddress
        });

        console.log('Registration response:', response.data);
        toast.success('Logged in successfully! 🎉');
        
        setTimeout(() => {
          navigate('/');
        }, 500);
      } catch (error) {
        console.error('Full error:', error.response?.data || error.message);
        toast.error(error.response?.data?.message || 'Registration failed');
        navigate('/auth');
      }
    };

    registerClerkUser();
  }, [isLoaded, isSignedIn, clerkUser, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-300">Authenticating...</p>
      </div>
    </div>
  );
}