'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { loginUser, clearError } from '@/store/slices/authSlice';
import Link from 'next/link';
import { Mail, Lock, Loader2 } from 'lucide-react';
import Input from '@/components/ui/form/Input';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [isMounted, setIsMounted] = useState(false);
  const { user, isLoading, error } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [formData, setFormData] = useState<LoginForm>({ email: '', password: '' });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const onSubmit = async (data: LoginForm) => {
    dispatch(loginUser(data));
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-lg shadow-xl border border-white/20 dark:border-gray-700/20 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            {/* <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg mb-4">
              <span className="text-white font-bold text-2xl">SL</span>
            </div> */}
            <h1 className="text-3xl font-bold bg-gradient-to-br from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Login
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Sign in to your account to continue
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <div className="relative group">
                <Input
                  type="text"
                  value={formData.email}
                  onChange={(value) => setFormData({ ...formData, email: value })}
                  placeholder="Enter your email"
                  required
                  icon={<Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />}
                />

              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="relative group">
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(value) => setFormData({ ...formData, password: value })}
                  placeholder="Enter your password"
                  required
                  icon={<Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm text-center backdrop-blur-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !formData.email || !formData.password}
              className="w-full py-3 px-4 bg-gradient-to-br bg-blue-600 hover:bg-blue-700  focus:outline-none  rounded-lg shadow-lg text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform disabled:scale-100 hover:shadow-xl active:scale-95 flex items-center justify-center cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Don't have an account?{' '}
              <Link
                href="/signup"
                className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200 hover:underline"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div >
  );
}