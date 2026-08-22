import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Download, X, ExternalLink } from 'lucide-react';
import { Logo } from './Logo';

interface InstallBannerProps {
  onOpenInstallModal: () => void;
  deferredPrompt: any;
}

export const InstallBanner: React.FC<InstallBannerProps> = ({
  onOpenInstallModal,
  deferredPrompt,
}) => {
  const { language } = useApp();
  const [isDismissed, setIsDismissed] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isInIframe, setIsInIframe] = useState(false);

  useEffect(() => {
    // Check if dismissed before in session
    const dismissed = sessionStorage.getItem('pwa_banner_dismissed');
    if (dismissed) setIsDismissed(true);

    try {
      setIsInIframe(window.self !== window.top);
    } catch {
      setIsInIframe(true);
    }

    const isInStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes('android-app://');
    setIsStandalone(!!isInStandaloneMode);
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('pwa_banner_dismissed', 'true');
  };

  if (isDismissed || isStandalone) return null;

  return (
    <div
      id="smart-pwa-install-banner"
      className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 text-white px-3 sm:px-4 py-2.5 shadow-md flex items-center justify-between gap-2 sm:gap-3 text-xs border-b border-emerald-500/20 sticky top-0 z-30"
    >
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <Logo size="sm" showSubtitle={false} showText={false} />
        <div className="min-w-0">
          <div className="font-extrabold text-white text-xs truncate flex items-center gap-1.5">
            <span>{language === 'bn' ? 'AmarBazar অ্যাপ ইনস্টল করুন' : 'Install AmarBazar App'}</span>
            <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded-sm hidden sm:inline">
              FAST PWA
            </span>
          </div>
          <p className="text-[10px] text-emerald-200 truncate">
            {language === 'bn'
              ? 'মোবাইলে সহজে শপিং ও ডেলিভারি পেতে অ্যাপ নামিয়ে নিন'
              : 'Add to home screen for faster shopping & live tracking'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <button
          id="banner-install-cta-btn"
          onClick={onOpenInstallModal}
          className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'ইনস্টল' : 'Install'}</span>
        </button>
        <button
          onClick={handleDismiss}
          className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

