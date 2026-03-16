import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { supabase } from '../utils/supabase';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setIsAuthenticated } = useApp();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in both email and password');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError('Your email address or password are not correct');
        setLoading(false);
        return;
      }

      if (data.user) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Your email address or password are not correct');
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
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-md w-full relative z-10">
          <div className="text-center mb-8 space-y-4">
            <div className="relative inline-flex">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full shadow-xl">
                <Heart className="w-10 h-10 text-white" fill="currentColor" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 bg-clip-text text-transparent mb-2">
                Welcome to<br />The Wedding Works
              </h1>
              <p className="text-gray-600 text-lg">Plan your perfect day together</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50 p-8 md:p-10">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 font-semibold text-center">
                {error}
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
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
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    handleInputChange();
                  }}
                  className="w-full px-5 py-3.5 rounded-xl border-2 border-gray-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-gray-800 placeholder:text-gray-400"
                  placeholder="••••••••"
                  required
                  minLength={6}
                  disabled={loading}
                />
                <Link
                  to="/reset-password-request"
                  className="inline-block mt-2 text-sm text-primary-600 hover:text-primary-700 font-medium hover:underline transition-colors"
                >
                  I Forgot My Password
                </Link>
              </div>

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-500 via-primary-400 to-primary-500 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-2xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Signing in...' : 'Login'}
                </button>
                <Link
                  to="/register"
                  className="block w-full py-4 rounded-xl bg-white border-2 border-primary-300 text-primary-600 font-semibold text-lg transition-all duration-300 hover:bg-primary-50 hover:border-primary-400 text-center"
                >
                  Register New Account
                </Link>
              </div>
            </form>
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
