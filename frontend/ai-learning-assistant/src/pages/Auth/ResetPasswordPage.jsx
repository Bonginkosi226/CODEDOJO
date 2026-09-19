import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BrainCircuit, Lock, ArrowRight, CheckCircle2, Circle, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import authService from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const MIN_LENGTH = 8;

// Server enforces the minimum length; the strength rules are extra guidance.
const rulesFor = (pw) => [
  { id: 'length', label: `At least ${MIN_LENGTH} characters`, ok: pw.length >= MIN_LENGTH, required: true },
  { id: 'case', label: 'Upper and lower case letters', ok: /[a-z]/.test(pw) && /[A-Z]/.test(pw) },
  { id: 'number', label: 'A number', ok: /\d/.test(pw) },
  { id: 'symbol', label: 'A symbol (e.g. ! ? #)', ok: /[^A-Za-z0-9]/.test(pw) },
];

const STRENGTH = [
  { label: 'Too weak', bar: 'bg-slate-200', text: 'text-slate-400', width: '0%' },
  { label: 'Weak', bar: 'bg-red-400', text: 'text-red-500', width: '25%' },
  { label: 'Fair', bar: 'bg-amber-400', text: 'text-amber-500', width: '50%' },
  { label: 'Good', bar: 'bg-emerald-400', text: 'text-emerald-600', width: '75%' },
  { label: 'Strong', bar: 'bg-emerald-500', text: 'text-emerald-600', width: '100%' },
];

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [focused, setFocused] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [linkProblem, setLinkProblem] = useState(false);

  const rules = rulesFor(password);
  const score = password ? rules.filter((r) => r.ok).length : 0;
  const strength = STRENGTH[score];
  // Must meet the length rule AND at least 2 of the 3 other rules.
  const strongEnough = rules[0].ok && rules.slice(1).filter((r) => r.ok).length >= 2;
  const matches = password === confirm;
  const canSubmit = strongEnough && matches && confirm.length > 0 && !loading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError('');
    setLoading(true);

    try {
      await authService.resetPassword(token, password);
      // Any session in this browser is now dead server-side; clear it locally too.
      logout(false);
      toast.success('Password reset! Please sign in with your new password.');
      navigate('/login');
    } catch (err) {
      const message = err.error || err.message || 'Something went wrong. Please try again.';
      if (/invalid or has expired/i.test(message)) {
        setLinkProblem(true);
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition';

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-xl shadow-slate-200/50 p-6 sm:p-8 md:p-10">

          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/25 mb-4">
              {linkProblem ? (
                <AlertTriangle className="text-white" strokeWidth={2} />
              ) : (
                <BrainCircuit className="text-white" strokeWidth={2} />
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-semibold text-slate-800">
              {linkProblem ? 'This link no longer works' : 'Choose a new password'}
            </h1>

            <p className="text-sm sm:text-base text-slate-500 mt-2">
              {linkProblem
                ? 'Reset links expire after 1 hour and can only be used once'
                : 'Pick something strong that you have not used elsewhere'}
            </p>
          </div>

          {linkProblem ? (
            <div className="space-y-6">
              <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                This reset link is invalid or has expired. Please request a new one.
              </div>
              <Link
                to="/forgot-password"
                className="w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm sm:text-base font-medium flex items-center justify-center gap-2 hover:opacity-90 transition"
              >
                Request a new link
                <ArrowRight size={18} strokeWidth={2.5} />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              {/* New password */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-600 mb-2">
                  NEW PASSWORD
                </label>
                <div className="relative">
                  <Lock
                    className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                      focused === 'password' ? 'text-emerald-500' : 'text-slate-400'
                    }`}
                    strokeWidth={2}
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused(null)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className={inputClass}
                    required
                  />
                </div>

                {/* Strength meter + rules */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-400 font-medium">Strength</span>
                    <span className={`font-semibold ${strength.text}`}>{strength.label}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${strength.bar}`}
                      style={{ width: strength.width }}
                    />
                  </div>
                  <ul className="mt-3 space-y-1.5">
                    {rules.map((rule) => (
                      <li
                        key={rule.id}
                        className={`flex items-center gap-2 text-xs ${rule.ok ? 'text-emerald-600' : 'text-slate-400'}`}
                      >
                        {rule.ok ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                        {rule.label}
                        {rule.required && <span className="text-slate-300">(required)</span>}
                      </li>
                    ))}
                  </ul>
                  {password && !strongEnough && (
                    <p className="mt-2 text-xs text-slate-500">
                      Use at least {MIN_LENGTH} characters plus any two of the other rules.
                    </p>
                  )}
                </div>
              </div>

              {/* Confirm */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-600 mb-2">
                  CONFIRM PASSWORD
                </label>
                <div className="relative">
                  <Lock
                    className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                      focused === 'confirm' ? 'text-emerald-500' : 'text-slate-400'
                    }`}
                    strokeWidth={2}
                  />
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    onFocus={() => setFocused('confirm')}
                    onBlur={() => setFocused(null)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className={inputClass}
                    required
                  />
                </div>
                {confirm && !matches && (
                  <p className="mt-2 text-xs text-red-500">Passwords do not match.</p>
                )}
                {confirm && matches && (
                  <p className="mt-2 text-xs text-emerald-600">Passwords match.</p>
                )}
              </div>

              {error && <div className="text-sm text-red-500">{error}</div>}

              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm sm:text-base font-medium flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  'Resetting...'
                ) : (
                  <>
                    Reset password
                    <ArrowRight size={18} strokeWidth={2.5} />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-slate-500">
            <Link to="/login" className="text-emerald-600 font-medium hover:underline">
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
