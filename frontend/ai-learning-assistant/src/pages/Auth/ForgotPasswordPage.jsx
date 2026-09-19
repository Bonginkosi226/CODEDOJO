import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, Mail, ArrowRight, ArrowLeft, MailCheck } from 'lucide-react';
import authService from '../../services/authService';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError('');
    setLoading(true);

    try {
      const res = await authService.forgotPassword(email.trim());
      // Always the same generic message from the server — we never reveal
      // whether the address has an account.
      setConfirmation(res.message);
    } catch (err) {
      setError(err.error || err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-xl shadow-slate-200/50 p-6 sm:p-8 md:p-10">

          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/25 mb-4">
              {confirmation ? (
                <MailCheck className="text-white" strokeWidth={2} />
              ) : (
                <BrainCircuit className="text-white" strokeWidth={2} />
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-semibold text-slate-800">
              {confirmation ? 'Check your email' : 'Forgot your password?'}
            </h1>

            <p className="text-sm sm:text-base text-slate-500 mt-2">
              {confirmation
                ? 'Follow the link in the email to choose a new password'
                : "Enter your email and we'll send you a link to reset it"}
            </p>
          </div>

          {confirmation ? (
            <div className="space-y-6">
              <div className="text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                {confirmation}
              </div>
              <p className="text-xs text-slate-400 text-center">
                Nothing arrived? Check your spam folder, or try again in a few minutes.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-600 mb-2">
                  EMAIL
                </label>

                <div className="relative">
                  <Mail
                    className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                      focused ? 'text-emerald-500' : 'text-slate-400'
                    }`}
                    strokeWidth={2}
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                    required
                  />
                </div>
              </div>

              {error && <div className="text-sm text-red-500">{error}</div>}

              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm sm:text-base font-medium flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-70"
              >
                {loading ? (
                  'Sending...'
                ) : (
                  <>
                    Send reset link
                    <ArrowRight size={18} strokeWidth={2.5} />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-slate-500">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-emerald-600 font-medium hover:underline"
            >
              <ArrowLeft size={14} strokeWidth={2.5} />
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
