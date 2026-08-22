import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div id="toast-container" className="fixed bottom-16 sm:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(t => {
        let bgClass = 'bg-slate-900 text-white border-slate-800';
        let Icon = Info;

        if (t.type === 'success') {
          bgClass = 'bg-emerald-900/95 text-white border-emerald-700 shadow-emerald-950/30';
          Icon = CheckCircle2;
        } else if (t.type === 'warning') {
          bgClass = 'bg-amber-900/95 text-white border-amber-700 shadow-amber-950/30';
          Icon = AlertTriangle;
        } else if (t.type === 'error') {
          bgClass = 'bg-rose-900/95 text-white border-rose-700 shadow-rose-950/30';
          Icon = AlertCircle;
        }

        return (
          <div
            key={t.id}
            id={`toast-${t.id}`}
            className={`pointer-events-auto p-3.5 rounded-2xl shadow-xl border flex items-start gap-2.5 backdrop-blur-md animate-in slide-in-from-bottom-2 duration-200 ${bgClass}`}
          >
            <Icon className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-xs font-medium leading-relaxed flex-1">{t.message}</p>
            <button
              onClick={() => removeToast(t.id)}
              className="text-white/70 hover:text-white shrink-0 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
