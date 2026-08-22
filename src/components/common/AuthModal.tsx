import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../utils/translations';
import { UserRole } from '../../types';
import { Phone, ShieldCheck, CheckCircle, X, ArrowRight, UserCheck } from 'lucide-react';
import { Logo } from './Logo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const {
    loginWithPhoneOtp,
    currentUser,
    users,
    switchUser,
    setCurrentRole,
    language,
  } = useApp();

  const t = translations[language];

  const [phoneNumber, setPhoneNumber] = useState('01711223344');
  const [userName, setUserName] = useState('');
  const [targetRole, setTargetRole] = useState<UserRole>('customer');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otpCode, setOtpCode] = useState('2026');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 11) {
      alert('Please enter a valid 11-digit Bangladesh phone number');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 600);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== '2026' && otpCode.length !== 4) {
      alert('Please enter a 4-digit OTP code (e.g. 2026)');
      return;
    }
    setIsLoading(true);
    await loginWithPhoneOtp(phoneNumber, targetRole, userName);
    setIsLoading(false);
    onClose();
  };

  const handleQuickDemoUser = (user: typeof users[0]) => {
    switchUser(user);
    onClose();
  };

  return (
    <div id="auth-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <Logo size="sm" showTagline={false} />
          <button
            id="close-auth-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Quick Demo Switcher Presets */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
              {t.demoAccounts}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {users.map(u => {
                const isCurrent = currentUser.id === u.id;
                return (
                  <button
                    key={u.id}
                    id={`demo-user-btn-${u.role}`}
                    onClick={() => handleQuickDemoUser(u)}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                      isCurrent
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                      u.role === 'customer' ? 'bg-emerald-100 text-emerald-700' :
                      u.role === 'seller' ? 'bg-amber-100 text-amber-700' :
                      u.role === 'rider' ? 'bg-blue-100 text-blue-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {u.role.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold truncate">{u.name.split(' ')[0]}</div>
                      <div className="text-[10px] text-slate-500 capitalize">{u.role}</div>
                    </div>
                    {isCurrent && <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative flex items-center justify-center py-2">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-2 text-xs font-medium text-slate-400 absolute">
              OR Custom Phone OTP
            </span>
          </div>

          {/* Form */}
          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {t.mobileNumber}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-500">
                    +88
                  </span>
                  <input
                    id="auth-phone-input"
                    type="tel"
                    required
                    placeholder="017XXXXXXXX"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    className="w-full pl-12 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Full Name (Optional for new users)
                </label>
                <input
                  id="auth-name-input"
                  type="text"
                  placeholder="Your Name"
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Register / Login As
                </label>
                <select
                  id="auth-role-select"
                  value={targetRole}
                  onChange={e => setTargetRole(e.target.value as UserRole)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                >
                  <option value="customer">Customer (Buyer)</option>
                  <option value="seller">Seller / Shop Owner</option>
                  <option value="rider">Delivery Rider</option>
                  <option value="admin">Marketplace Admin</option>
                </select>
              </div>

              <button
                id="send-otp-btn"
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 mt-2"
              >
                <span>{isLoading ? 'Sending SMS...' : t.sendOtp}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-3">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
                <div>
                  <span className="font-medium">OTP sent to: </span>
                  <span className="font-bold">+88 {phoneNumber}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="text-emerald-700 underline font-bold"
                >
                  Change
                </button>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {t.enterOtp}
                </label>
                <input
                  id="auth-otp-input"
                  type="text"
                  maxLength={4}
                  required
                  placeholder="2026"
                  value={otpCode}
                  onChange={e => setOtpCode(e.target.value)}
                  className="w-full text-center tracking-[0.5em] text-lg font-bold py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
                />
                <p className="text-[11px] text-slate-500 text-center mt-1">
                  Demo code: <span className="font-bold text-emerald-600">2026</span>
                </p>
              </div>

              <button
                id="verify-otp-btn"
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 mt-2"
              >
                <span>{isLoading ? 'Verifying...' : t.verifyAndLogin}</span>
                <ShieldCheck className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
