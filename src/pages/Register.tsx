import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, UserPlus } from 'lucide-react';
import { supabase } from '../utils/supabase';
import { useApp } from '../contexts/AppContext';

interface FieldError {
  brideFirstName?: string;
  brideLastName?: string;
  brideEmail?: string;
  groomFirstName?: string;
  groomLastName?: string;
  groomEmail?: string;
  weddingDate?: string;
  budget?: string;
  weddingType?: string;
  password?: string;
  confirmPassword?: string;
  agreement?: string;
  joinCode?: string;
}

export const Register: React.FC = () => {
  const [joinCode, setJoinCode] = useState('');
  const [hasJoinCode, setHasJoinCode] = useState(false);
  const [brideFirstName, setBrideFirstName] = useState('');
  const [brideLastName, setBrideLastName] = useState('');
  const [brideEmail, setBrideEmail] = useState('');
  const [groomFirstName, setGroomFirstName] = useState('');
  const [groomLastName, setGroomLastName] = useState('');
  const [groomEmail, setGroomEmail] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [budget, setBudget] = useState('');
  const [weddingType, setWeddingType] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreement, setAgreement] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldError>({});
  const [loading, setLoading] = useState(false);
  const { setIsAuthenticated } = useApp();
  const navigate = useNavigate();

  const generateJoinCode = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const errors: FieldError = {};
    let isValid = true;

    if (hasJoinCode && joinCode.trim()) {
      if (joinCode.trim().length !== 6) {
        errors.joinCode = 'Join code must be 6 characters';
        isValid = false;
      }
    }

    if (!brideFirstName.trim()) {
      errors.brideFirstName = 'First name is required';
      isValid = false;
    }
    if (!brideLastName.trim()) {
      errors.brideLastName = 'Last name is required';
      isValid = false;
    }
    if (!brideEmail.trim()) {
      errors.brideEmail = 'Email is required';
      isValid = false;
    } else if (!validateEmail(brideEmail)) {
      errors.brideEmail = 'Please enter a valid email address';
      isValid = false;
    }

    if (!hasJoinCode) {
      if (!groomFirstName.trim()) {
        errors.groomFirstName = 'Groom first name is required';
        isValid = false;
      }
      if (!groomLastName.trim()) {
        errors.groomLastName = 'Groom last name is required';
        isValid = false;
      }
      if (!groomEmail.trim()) {
        errors.groomEmail = 'Groom email is required';
        isValid = false;
      } else if (!validateEmail(groomEmail)) {
        errors.groomEmail = 'Please enter a valid email address';
        isValid = false;
      }

      if (!weddingDate) {
        errors.weddingDate = 'Wedding date is required';
        isValid = false;
      } else {
        const selectedDate = new Date(weddingDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate <= today) {
          errors.weddingDate = 'Wedding date must be in the future';
          isValid = false;
        }
      }

      if (!budget.trim()) {
        errors.budget = 'Budget is required';
        isValid = false;
      } else if (!/^\d+(\.\d{1,2})?$/.test(budget)) {
        errors.budget = 'Budget must be a valid number';
        isValid = false;
      }

      if (!weddingType) {
        errors.weddingType = 'Please select a wedding type';
        isValid = false;
      }
    }

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

    if (!agreement) {
      errors.agreement = 'You must agree to the terms';
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    if (!validateForm()) {
      setError('Please correct the errors below');
      return;
    }

    setLoading(true);

    try {
      if (hasJoinCode && joinCode.trim()) {
        const { data: coupleData } = await supabase
          .from('couples')
          .select('*')
          .eq('join_code', joinCode.trim().toUpperCase())
          .maybeSingle();

        if (!coupleData) {
          setError('Invalid join code. Please check the code and try again.');
          setLoading(false);
          return;
        }

        if (coupleData.partner2_user_id) {
          setError('This join code has already been used.');
          setLoading(false);
          return;
        }

        const { data, error: signUpError } = await supabase.auth.signUp({
          email: brideEmail,
          password,
        });

        if (signUpError) {
          if (signUpError.message.includes('User already registered')) {
            setError('This email is already registered. Please login instead.');
          } else {
            setError(signUpError.message || 'Registration failed. Please try again.');
          }
          setLoading(false);
          return;
        }

        if (data.user) {
          const { error: updateError } = await supabase
            .from('couples')
            .update({
              partner2_user_id: data.user.id,
              partner2_first_name: brideFirstName,
              partner2_last_name: brideLastName,
              partner2_email: brideEmail,
              partner2_name: `${brideFirstName} ${brideLastName}`,
              join_code: null
            })
            .eq('id', coupleData.id);

          if (updateError) {
            console.error('Couple update error:', updateError);
            setError('Failed to link accounts. Please contact support.');
            setLoading(false);
            return;
          }

          navigate('/home');
        }
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: brideEmail,
          password,
        });

        if (signUpError) {
          if (signUpError.message.includes('User already registered')) {
            setError('This email is already registered. Please login instead.');
          } else {
            setError(signUpError.message || 'Registration failed. Please try again.');
          }
          setLoading(false);
          return;
        }

        if (data.user) {
          try {
            const joinCode = generateJoinCode();
            const { error: coupleError } = await supabase
              .from('couples')
              .insert({
                user_id: data.user.id,
                partner1_first_name: brideFirstName,
                partner1_last_name: brideLastName,
                partner1_email: brideEmail,
                partner1_name: `${brideFirstName} ${brideLastName}`,
                partner2_first_name: groomFirstName,
                partner2_last_name: groomLastName,
                partner2_email: groomEmail,
                partner2_name: `${groomFirstName} ${groomLastName}`,
                wedding_date: weddingDate,
                budget: parseFloat(budget),
                wedding_type: weddingType,
                join_code: joinCode,
              });

            if (coupleError) {
              console.error('Couple insert error:', coupleError);
              setError('Failed to save registration details. Please contact support.');
              setLoading(false);
              return;
            }

            navigate('/home');
          } catch (insertError) {
            console.error('Insert error:', insertError);
            setError('An error occurred during registration. Please try logging in.');
            setLoading(false);
          }
        }
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Registration failed. Please try again.');
      setLoading(false);
    }
  };

  const clearFieldError = (field: keyof FieldError) => {
    if (fieldErrors[field]) {
      setFieldErrors({ ...fieldErrors, [field]: undefined });
    }
    if (error) {
      setError('');
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center px-4 py-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-3xl w-full relative z-10">
          <div className="text-center mb-8 space-y-4">
            <div className="relative inline-flex">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-500 rounded-full shadow-xl">
                <Heart className="w-10 h-10 text-white" fill="currentColor" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold bg-gradient-to-r from-primary-600 via-primary-600 to-primary-600 bg-clip-text text-transparent mb-2">
                Registration
              </h1>
              <p className="text-gray-600 text-lg">All entries can be updated in the Wedding Planner application</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50 p-8 md:p-10">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 font-semibold text-center">
                {error}
              </div>
            )}
            <form onSubmit={handleRegister} className="space-y-8">
              <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <UserPlus className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-serif font-bold text-gray-800">Have a Join Code?</h2>
                </div>
                <p className="text-sm text-gray-700 mb-4">
                  If your partner already has an account and shared a join code with you, enter it here to link your accounts.
                </p>
                <div className="flex items-center gap-3 mb-4">
                  <input
                    type="checkbox"
                    id="hasJoinCode"
                    checked={hasJoinCode}
                    onChange={(e) => setHasJoinCode(e.target.checked)}
                    className="w-5 h-5 text-blue-500 rounded focus:ring-blue-400"
                    disabled={loading}
                  />
                  <label htmlFor="hasJoinCode" className="font-medium text-gray-800">
                    I have a join code from my partner
                  </label>
                </div>
                {hasJoinCode && (
                  <div>
                    <label htmlFor="joinCode" className="block text-sm font-semibold text-gray-700 mb-2">
                      Enter Join Code
                    </label>
                    <input
                      id="joinCode"
                      type="text"
                      value={joinCode}
                      onChange={(e) => {
                        setJoinCode(e.target.value.toUpperCase());
                        clearFieldError('joinCode');
                      }}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-gray-800 placeholder:text-gray-400 uppercase font-mono tracking-wider text-lg"
                      placeholder="ABC123"
                      maxLength={6}
                      disabled={loading}
                    />
                    {fieldErrors.joinCode && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.joinCode}</p>
                    )}
                    <p className="mt-2 text-xs text-gray-600">
                      When using a join code, you only need to provide your information below. Wedding details are already set up.
                    </p>
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-2xl font-serif font-bold text-primary-600 mb-4">
                  {hasJoinCode ? 'Your Information' : 'Bride Information'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="brideFirstName" className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      id="brideFirstName"
                      type="text"
                      value={brideFirstName}
                      onChange={(e) => {
                        setBrideFirstName(e.target.value);
                        clearFieldError('brideFirstName');
                      }}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-gray-800 placeholder:text-gray-400"
                      placeholder="First name"
                      disabled={loading}
                    />
                    {fieldErrors.brideFirstName && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.brideFirstName}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="brideLastName" className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      id="brideLastName"
                      type="text"
                      value={brideLastName}
                      onChange={(e) => {
                        setBrideLastName(e.target.value);
                        clearFieldError('brideLastName');
                      }}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-gray-800 placeholder:text-gray-400"
                      placeholder="Last name"
                      disabled={loading}
                    />
                    {fieldErrors.brideLastName && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.brideLastName}</p>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <label htmlFor="brideEmail" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="brideEmail"
                    type="email"
                    value={brideEmail}
                    onChange={(e) => {
                      setBrideEmail(e.target.value);
                      clearFieldError('brideEmail');
                    }}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-gray-800 placeholder:text-gray-400"
                    placeholder="email@example.com"
                    disabled={loading}
                  />
                  {fieldErrors.brideEmail && (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors.brideEmail}</p>
                  )}
                </div>
              </div>

              {!hasJoinCode && (
              <div>
                <h2 className="text-2xl font-serif font-bold text-primary-600 mb-4">Groom Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="groomFirstName" className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      id="groomFirstName"
                      type="text"
                      value={groomFirstName}
                      onChange={(e) => {
                        setGroomFirstName(e.target.value);
                        clearFieldError('groomFirstName');
                      }}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-gray-800 placeholder:text-gray-400"
                      placeholder="First name"
                      disabled={loading}
                    />
                    {fieldErrors.groomFirstName && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.groomFirstName}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="groomLastName" className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      id="groomLastName"
                      type="text"
                      value={groomLastName}
                      onChange={(e) => {
                        setGroomLastName(e.target.value);
                        clearFieldError('groomLastName');
                      }}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-gray-800 placeholder:text-gray-400"
                      placeholder="Last name"
                      disabled={loading}
                    />
                    {fieldErrors.groomLastName && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.groomLastName}</p>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <label htmlFor="groomEmail" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="groomEmail"
                    type="email"
                    value={groomEmail}
                    onChange={(e) => {
                      setGroomEmail(e.target.value);
                      clearFieldError('groomEmail');
                    }}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-gray-800 placeholder:text-gray-400"
                    placeholder="email@example.com"
                    disabled={loading}
                  />
                  {fieldErrors.groomEmail && (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors.groomEmail}</p>
                  )}
                </div>
              </div>
              )}

              {!hasJoinCode && (
              <div>
                <h2 className="text-2xl font-serif font-bold text-primary-600 mb-4">Wedding Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="weddingDate" className="block text-sm font-semibold text-gray-700 mb-2">
                      Wedding Date
                    </label>
                    <input
                      id="weddingDate"
                      type="date"
                      value={weddingDate}
                      onChange={(e) => {
                        setWeddingDate(e.target.value);
                        clearFieldError('weddingDate');
                      }}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-gray-800"
                      disabled={loading}
                    />
                    {fieldErrors.weddingDate && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.weddingDate}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="budget" className="block text-sm font-semibold text-gray-700 mb-2">
                      Budget
                    </label>
                    <input
                      id="budget"
                      type="text"
                      value={budget}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
                          setBudget(value);
                          clearFieldError('budget');
                        }
                      }}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-gray-800 placeholder:text-gray-400"
                      placeholder="10000"
                      disabled={loading}
                    />
                    {fieldErrors.budget && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.budget}</p>
                    )}
                  </div>
                </div>
              </div>
              )}

              {!hasJoinCode && (
              <div>
                <h2 className="text-2xl font-serif font-bold text-primary-600 mb-4">Wedding Type</h2>
                <div className="space-y-3">
                  <label className="flex items-start p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-primary-300 transition-colors">
                    <input
                      type="radio"
                      name="weddingType"
                      value="traditional"
                      checked={weddingType === 'traditional'}
                      onChange={(e) => {
                        setWeddingType(e.target.value);
                        clearFieldError('weddingType');
                      }}
                      className="mt-1 w-4 h-4 text-primary-500 focus:ring-primary-400"
                      disabled={loading}
                    />
                    <div className="ml-3">
                      <span className="font-semibold text-gray-800">Traditional Wedding</span>
                      <p className="text-sm text-gray-600">150+ Guests, Formal Ceremony</p>
                    </div>
                  </label>
                  <label className="flex items-start p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-primary-300 transition-colors">
                    <input
                      type="radio"
                      name="weddingType"
                      value="destination"
                      checked={weddingType === 'destination'}
                      onChange={(e) => {
                        setWeddingType(e.target.value);
                        clearFieldError('weddingType');
                      }}
                      className="mt-1 w-4 h-4 text-primary-500 focus:ring-primary-400"
                      disabled={loading}
                    />
                    <div className="ml-3">
                      <span className="font-semibold text-gray-800">Destination Wedding</span>
                      <p className="text-sm text-gray-600">50-100 Guests, Exotic Location, Travel Coordination</p>
                    </div>
                  </label>
                  <label className="flex items-start p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-primary-300 transition-colors">
                    <input
                      type="radio"
                      name="weddingType"
                      value="small"
                      checked={weddingType === 'small'}
                      onChange={(e) => {
                        setWeddingType(e.target.value);
                        clearFieldError('weddingType');
                      }}
                      className="mt-1 w-4 h-4 text-primary-500 focus:ring-primary-400"
                      disabled={loading}
                    />
                    <div className="ml-3">
                      <span className="font-semibold text-gray-800">Small Wedding</span>
                      <p className="text-sm text-gray-600">20-50 Guests, Personal Touch</p>
                    </div>
                  </label>
                  <label className="flex items-start p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-primary-300 transition-colors">
                    <input
                      type="radio"
                      name="weddingType"
                      value="micro"
                      checked={weddingType === 'micro'}
                      onChange={(e) => {
                        setWeddingType(e.target.value);
                        clearFieldError('weddingType');
                      }}
                      className="mt-1 w-4 h-4 text-primary-500 focus:ring-primary-400"
                      disabled={loading}
                    />
                    <div className="ml-3">
                      <span className="font-semibold text-gray-800">Micro Wedding</span>
                      <p className="text-sm text-gray-600">5-20 Guests, Ultra Intimate</p>
                    </div>
                  </label>
                </div>
                {fieldErrors.weddingType && (
                  <p className="mt-2 text-sm text-red-600">{fieldErrors.weddingType}</p>
                )}
              </div>
              )}

              <div>
                <h2 className="text-2xl font-serif font-bold text-primary-600 mb-4">Password Setup</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        clearFieldError('password');
                      }}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-gray-800 placeholder:text-gray-400"
                      placeholder="••••••••"
                      disabled={loading}
                    />
                    {fieldErrors.password && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        clearFieldError('confirmPassword');
                      }}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-gray-800 placeholder:text-gray-400"
                      placeholder="••••••••"
                      disabled={loading}
                    />
                    {fieldErrors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.confirmPassword}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreement}
                    onChange={(e) => {
                      setAgreement(e.target.checked);
                      clearFieldError('agreement');
                    }}
                    className="mt-1 w-5 h-5 text-primary-500 focus:ring-primary-400 rounded"
                    disabled={loading}
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    I have read, understand, and agree to the Limitation of Liability and Hold Harmless Agreement
                  </span>
                </label>
                {fieldErrors.agreement && (
                  <p className="mt-2 text-sm text-red-600">{fieldErrors.agreement}</p>
                )}
              </div>

              <div className="space-y-3">
                <div className="text-center pb-2">
                  <Link
                    to="/terms-of-service"
                    className="text-primary-600 hover:text-primary-700 font-semibold hover:underline transition-colors"
                    target="_blank"
                  >
                    Terms of Service
                  </Link>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-500 via-primary-500 to-primary-500 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-2xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating Account...' : 'Register'}
                </button>
                <div className="text-center">
                  <span className="text-gray-600">Already have an account? </span>
                  <Link
                    to="/"
                    className="text-primary-600 hover:text-primary-700 font-semibold hover:underline transition-colors"
                  >
                    Login
                  </Link>
                </div>
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
