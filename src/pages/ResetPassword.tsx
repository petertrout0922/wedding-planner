import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { supabase } from '../utils/supabase';

export const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenError, setTokenError] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session) {
        setTokenError(true);
      }
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setTokenError(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const validateForm = (): boolean => {
    const errors: { password?: string; confirmPassword?: string } = {};
    let isValid = true;

    if (!password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        setError('Failed to reset password. Please try again.');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
    } catch (err) {
      setError('Failed to reset password. Please try again.');
      setLoading(false);
    }
  };

  const clearFieldError = (field: 'password' | 'confirmPassword') => {
    if (fieldErrors[field]) {
      setFieldErrors({ ...fieldErrors, [field]: undefined });
    }
    if (error) {
      setError('');
    }
  };

  const handleGoToLogin = () => {
    navigate('/');
  };

  if (tokenError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-md w-full relative z-10">
          <div className="text-center mb-8 space-y-4">
            <div className="relative inline-flex">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-500 rounded-full shadow-xl">
                <Heart className="w-10 h-10 text-white" fill="currentColor" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold bg-gradient-to-r from-primary-600 via-primary-600 to-primary-600 bg-clip-text text-transparent mb-2">
                Password Reset
              </h1>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50 p-8 md:p-10">
            <div className="text-center space-y-6">
              <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700">
                <p className="font-semibold mb-2">This password reset link is invalid or has expired.</p>
                <p className="text-sm">Please request a new one.</p>
              </div>
              <Link
                to="/reset-password-request"
                className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 via-primary-500 to-primary-500 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-2xl"
              >
                Request New Reset Link
              </Link>
            </div>
          </div>
        </div>

        <style>{`
          .bg-size-200 {
            background-size: 200% 100%;
          }
          .bg-pos-0 {
            background-position: 0% 0%;
          }
          .hover\\:bg-pos-100:hover {
            background-position: 100% 0%;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8 space-y-4">
          <div className="relative inline-flex">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-500 rounded-full shadow-xl">
              <Heart className="w-10 h-10 text-white" fill="currentColor" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold bg-gradient-to-r from-primary-600 via-primary-600 to-primary-600 bg-clip-text text-transparent mb-2">
              Password Reset
            </h1>
            <p className="text-gray-600 text-lg">Enter your new password</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50 p-8 md:p-10">
          {success ? (
            <div className="text-center space-y-6">
              <div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl text-green-700">
                <p className="font-semibold">Your password has been successfully reset</p>
              </div>
              <button
                onClick={handleGoToLogin}
                className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-primary-500 via-primary-500 to-primary-500 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-2xl"
              >
                Go to Login
              </button>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 font-semibold text-center">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Enter Your New Password (min. 6 characters)
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      clearFieldError('password');
                    }}
                    className="w-full px-5 py-3.5 rounded-xl border-2 border-gray-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-gray-800 placeholder:text-gray-400"
                    placeholder="••••••••"
                    disabled={loading}
                  />
                  {fieldErrors.password && (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                    Verify Your New Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      clearFieldError('confirmPassword');
                    }}
                    className="w-full px-5 py-3.5 rounded-xl border-2 border-gray-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-gray-800 placeholder:text-gray-400"
                    placeholder="••••••••"
                    disabled={loading}
                  />
                  {fieldErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors.confirmPassword}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-500 via-primary-500 to-primary-500 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-2xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Resetting Password...' : 'Submit'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      <style>{`
        .bg-size-200 {
          background-size: 200% 100%;
        }
        .bg-pos-0 {
          background-position: 0% 0%;
        }
        .hover\\:bg-pos-100:hover {
          background-position: 100% 0%;
        }
      `}</style>
    </div>
  );
};
