import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { supabase } from '../utils/supabase';

export const ResetPasswordRequest: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    if (!email.trim()) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      setSuccess(true);
      setLoading(false);
    } catch (err) {
      setSuccess(true);
      setLoading(false);
    }
  };

  const handleInputChange = () => {
    if (error) {
      setError('');
    }
  };

  return (
    <>
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
                Reset My Password
              </h1>
              <p className="text-gray-600 text-lg">
                Enter your email address. If your email is on file, you will receive an email with instructions regarding how to reset your password
              </p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50 p-8 md:p-10">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 font-semibold text-center">
                {error}
              </div>
            )}
            {success ? (
              <div className="space-y-6">
                <div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl text-green-700 text-center">
                  <p className="font-semibold mb-2">If your email address is registered, you will receive password reset instructions within a few minutes.</p>
                  <p className="text-sm">Please check your spam folder if you don't see the email.</p>
                </div>
                <div className="text-center">
                  <Link
                    to="/"
                    className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 via-primary-500 to-primary-500 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-2xl"
                  >
                    Back to Login
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleResetRequest} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Enter Your Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      handleInputChange();
                    }}
                    className="w-full px-5 py-3.5 rounded-xl border-2 border-gray-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-gray-800 placeholder:text-gray-400"
                    placeholder="your@email.com"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-500 via-primary-500 to-primary-500 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-2xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Sending...' : 'Submit'}
                  </button>
                  <div className="text-center">
                    <Link
                      to="/"
                      className="text-primary-600 hover:text-primary-700 font-semibold hover:underline transition-colors"
                    >
                      Back to Login
                    </Link>
                  </div>
                </div>
              </form>
            )}
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
    </>
  );
};
