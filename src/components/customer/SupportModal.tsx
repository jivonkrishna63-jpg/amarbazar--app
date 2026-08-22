import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../utils/translations';
import {
  X,
  Headphones,
  Phone,
  MessageSquare,
  Send,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  const { language, showToast } = useApp();
  const t = translations[language];

  const [subject, setSubject] = useState('');
  const [complaintText, setComplaintText] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintText.trim()) return;

    setIsSubmitted(true);
    showToast('Your complaint/inquiry has been submitted to support team.', 'success');
    setTimeout(() => {
      setIsSubmitted(false);
      setSubject('');
      setComplaintText('');
      setOrderNumber('');
      onClose();
    }, 1800);
  };

  return (
    <div id="support-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                {t.customerSupport}
              </h3>
              <p className="text-xs text-slate-500">24/7 Helpline & Order Resolution</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {/* Quick Hotline Call Card */}
          <div className="p-4 bg-emerald-950 text-white rounded-2xl flex items-center justify-between shadow-md">
            <div>
              <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">
                Emergency Helpline
              </span>
              <h4 className="text-base font-black mt-0.5">+880 9612 000 888</h4>
              <p className="text-[11px] text-emerald-200 mt-0.5">Toll-free customer assistance</p>
            </div>
            <a
              href="tel:+8809612000888"
              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Now</span>
            </a>
          </div>

          {/* Form */}
          {isSubmitted ? (
            <div className="py-8 text-center space-y-2 text-emerald-800 animate-in zoom-in-95">
              <CheckCircle className="w-12 h-12 mx-auto text-emerald-600" />
              <h4 className="text-sm font-bold">Ticket Submitted Successfully</h4>
              <p className="text-xs text-slate-500">
                Support Ticket #TK-{Math.floor(100000 + Math.random() * 900000)} is created. Our support team will call you within 15 minutes.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Submit a Complaint / Inquiry
              </h4>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Order Number (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. AMB-8801"
                  value={orderNumber}
                  onChange={e => setOrderNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Issue Topic
                </label>
                <select
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
                >
                  <option value="">Select an issue...</option>
                  <option value="delivery_delay">Delivery is delayed</option>
                  <option value="wrong_item">Received incorrect/damaged product</option>
                  <option value="cod_issue">Cash on Delivery payment query</option>
                  <option value="rider_behavior">Rider behavior feedback</option>
                  <option value="seller_quality">Shop product quality issue</option>
                  <option value="other">Other question</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Describe the issue
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide details so our local supervisor can take immediate action..."
                  value={complaintText}
                  onChange={e => setComplaintText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Ticket</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
