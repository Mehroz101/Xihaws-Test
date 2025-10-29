'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { signupUser, clearError } from '@/store/slices/authSlice';
import Link from 'next/link';
import { Mail, Lock, User, Loader2 } from 'lucide-react';
import Input from '@/components/ui/form/Input';

interface SignupForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignupPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const { user, isLoading, error } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [formData, setFormData] = useState<SignupForm>({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

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

  useEffect(() => {
    // Validate password match
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError('');
    }
  }, [formData.password, formData.confirmPassword]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Final validation before submission
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    setPasswordError('');
    dispatch(signupUser({
      username: formData.username,
      email: formData.email,
      password: formData.password
    }));
  };

  const isFormValid = formData.username &&
    formData.email &&
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword &&
    formData.password.length >= 6;

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-lg shadow-xl border border-white/20 dark:border-gray-700/20 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-br from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Sign Up
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Create your account to get started
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Name Field */}
            <div>
              <Input
                type="text"
                value={formData.username}
                onChange={(value) => setFormData({ ...formData, username: value })}
                placeholder="Enter your username"
                required
                icon={<User className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />}
              />
            </div>

            {/* Email Field */}
            <div>
              <Input
                type="email"
                value={formData.email}
                onChange={(value) => setFormData({ ...formData, email: value })}
                placeholder="Enter your email"
                required
                icon={<Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />}
              />
            </div>

            {/* Password Field */}
            <div>
              <Input
                type="password"
                value={formData.password}
                onChange={(value) => setFormData({ ...formData, password: value })}
                placeholder="Create password"
                required
                icon={<Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />}
              />
              {formData.password && formData.password.length < 6 && (
                <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
                  Password must be at least 6 characters
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <Input
                type="password"
                value={formData.confirmPassword}
                onChange={(value) => setFormData({ ...formData, confirmPassword: value })}
                placeholder="Confirm password"
                required
                icon={<Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />}
              />
              {passwordError && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {passwordError}
                </p>
              )}
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
              disabled={isLoading || !isFormValid}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 focus:outline-none rounded-lg shadow-lg text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform disabled:scale-100 hover:shadow-xl active:scale-95 flex items-center justify-center cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}