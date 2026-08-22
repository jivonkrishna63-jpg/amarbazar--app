import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from './Logo';
import {
  Download,
  Smartphone,
  CheckCircle2,
  X,
  Zap,
  ShieldCheck,
  ExternalLink,
  Info,
  Copy,
  Code,
  Layers,
  Terminal,
} from 'lucide-react';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any;
  onInstallNative?: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onInstallNative,
}) => {
  const { language, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'apk' | 'pwa'>('apk');
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isInIframe, setIsInIframe] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  useEffect(() => {
    try {
      setIsInIframe(window.self !== window.top);
    } catch {
      setIsInIframe(true);
    }

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    const isInStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes('android-app://');
    setIsStandalone(!!isInStandaloneMode);
  }, []);

  if (!isOpen) return null;

  const appUrl = window.location.href;

  const handleOpenInNewTab = () => {
    window.open(appUrl, '_blank');
    showToast(
      language === 'bn'
        ? 'নতুন ব্রাউজার ট্যাবে ওপেন হচ্ছে...'
        : 'Opening in new browser tab...',
      'info'
    );
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopiedLink(true);
    showToast(
      language === 'bn'
        ? 'অ্যাপ লিঙ্ক কপি হয়েছে!'
        : 'App URL copied!',
      'success'
    );
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCommand = (cmd: string, id: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(id);
    showToast(
      language === 'bn' ? 'কমান্ড কপি হয়েছে!' : 'Command copied!',
      'success'
    );
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        showToast(
          language === 'bn'
            ? 'অ্যাপ ইনস্টল শুরু হয়েছে!'
            : 'App installation started!',
          'success'
        );
      }
      if (onInstallNative) onInstallNative();
      onClose();
    } else if (isInIframe) {
      handleOpenInNewTab();
    } else {
      showToast(
        language === 'bn'
          ? 'ব্রাউজারের মেন্যু (⋮) থেকে "Install app" সিলেক্ট করুন'
          : 'Tap browser menu (⋮) and select "Install app"',
        'info'
      );
    }
  };

  return (
    <div
      id="install-app-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-xs animate-in fade-in"
    >
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-950 via-emerald-800 to-teal-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-emerald-300 font-bold shrink-0">
              <Smartphone className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">
                {language === 'bn' ? 'AmarBazar Android App (.APK)' : 'AmarBazar Android App'}
              </h3>
              <p className="text-xs text-emerald-200">
                {language === 'bn'
                  ? 'অ্যান্ড্রয়েড APK ও ইনস্টলেশন সম্পূর্ণ গাইড'
                  : 'Android APK creation & installation guide'}
              </p>
            </div>
          </div>

          <button
            id="close-install-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 bg-slate-50 p-1.5 gap-1.5">
          <button
            onClick={() => setActiveTab('apk')}
            className={`flex-1 py-2 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'apk'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>{language === 'bn' ? 'Android APK ফাইল (.apk)' : 'Android APK Build'}</span>
          </button>

          <button
            onClick={() => setActiveTab('pwa')}
            className={`flex-1 py-2 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'pwa'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>{language === 'bn' ? 'মোবাইলে সরাসরি ইনস্টল (PWA)' : 'Browser PWA Install'}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1 text-slate-800">
          {activeTab === 'apk' ? (
            /* TAB 1: Android APK Build Guide */
            <div className="space-y-4">
              {/* Ready status */}
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <h4 className="font-extrabold text-emerald-900">
                    {language === 'bn' ? 'Capacitor Android কনফিগারেশন রেডি!' : 'Capacitor Android Configured!'}
                  </h4>
                  <p className="text-emerald-700">
                    Package ID: <code className="font-mono font-bold bg-emerald-100 px-1 py-0.5 rounded">com.amarbazar.app</code>
                  </p>
                </div>
              </div>

              {/* Method 1: Android Studio Build */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">১</span>
                  <h4 className="font-extrabold text-xs text-slate-900">
                    {language === 'bn' ? 'Android Studio দিয়ে APK তৈরি করার নিয়ম:' : 'Build APK using Android Studio:'}
                  </h4>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="bg-slate-900 text-slate-100 p-3 rounded-xl font-mono text-[11px] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400"># 1. কোড ডাউনলোড করে প্যাকেজ সিঙ্ক করুন:</span>
                      <button
                        onClick={() => handleCopyCommand('npx cap add android && npm run cap:sync', 'cmd1')}
                        className="text-[10px] bg-slate-700 hover:bg-slate-600 px-2 py-0.5 rounded text-emerald-300 flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        {copiedCmd === 'cmd1' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <p className="text-emerald-400">npx cap add android && npm run cap:sync</p>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                      <span className="text-slate-400"># 2. Android Studio-তে প্রোজেক্ট খুলুন:</span>
                      <button
                        onClick={() => handleCopyCommand('npx cap open android', 'cmd2')}
                        className="text-[10px] bg-slate-700 hover:bg-slate-600 px-2 py-0.5 rounded text-emerald-300 flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        {copiedCmd === 'cmd2' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <p className="text-emerald-400">npx cap open android</p>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    👉 Android Studio খুলে গেলে উপরে <strong>Build ➔ Build Bundle(s) / APK(s) ➔ Build APK(s)</strong> এ ক্লিক করলেই সাথে সাথে আপনার মোবাইলের জন্য <code>.apk</code> ফাইল তৈরি হয়ে যাবে!
                  </p>
                </div>
              </div>

              {/* Method 2: Online 1-Click APK Builder */}
              <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-2xl space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-teal-700 text-white flex items-center justify-center text-xs font-bold">২</span>
                  <h4 className="font-extrabold text-xs text-teal-950">
                    {language === 'bn' ? 'অনলাইন ফ্রিতে ১-ক্লিকে APK জেনারেটর (No Code):' : 'Online 1-Click APK Builder:'}
                  </h4>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {language === 'bn'
                    ? 'আপনি চাইলে Microsoft-এর অফিসিয়াল PWABuilder (pwabuilder.com) অথবা WebIntoApp ব্যবহার করে কোনো কোডিং ছাড়াই সরাসরি APK এবং Google Play Store ফাইল নামিয়ে নিতে পারেন।'
                    : 'Use official PWABuilder or WebIntoApp to package this URL directly into an Android APK.'}
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <a
                    href="https://www.pwabuilder.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl text-center flex items-center justify-center gap-1 shadow-xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>PWABuilder.com</span>
                  </a>
                  <button
                    onClick={handleCopyLink}
                    className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs rounded-xl flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>{copiedLink ? (language === 'bn' ? 'কপি হয়েছে' : 'Copied') : (language === 'bn' ? 'URL কপি' : 'Copy URL')}</span>
                  </button>
                </div>
              </div>

              {/* How to export ZIP */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                <p className="font-extrabold flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-amber-700" />
                  {language === 'bn' ? 'কোড ডাউনলোড করতে:' : 'To download full source code:'}
                </p>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  AI Studio স্ক্রিনের উপরের <strong>Settings (গিয়ার)</strong> অথবা <strong>থ্রি-ডট (⋮)</strong> মেন্যু থেকে <strong>"Export as ZIP"</strong> বা <strong>"Export to GitHub"</strong> চাপুন।
                </p>
              </div>
            </div>
          ) : (
            /* TAB 2: PWA Mobile Install */
            <div className="space-y-4">
              {isInIframe && (
                <div className="p-4 bg-amber-50 border-2 border-amber-300/80 rounded-2xl space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <div className="p-1 bg-amber-200 text-amber-900 rounded-lg shrink-0 mt-0.5">
                      <Info className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-black text-xs text-amber-900">
                        {language === 'bn' ? 'নতুন ট্যাবে খুলুন' : 'Open in New Tab'}
                      </h4>
                      <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                        {language === 'bn'
                          ? 'ব্রাউজার সিকিউরিটির জন্য প্রিভিউ ফ্রেমের ভেতর থেকে সরাসরি ইনস্টল করা যায় না। নিচের বাটনে চাপ দিয়ে সরাসরি ফুল ব্রাউজারে ওপেন করুন:'
                          : 'Open in a full browser tab to install the PWA.'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={handleOpenInNewTab}
                      className="py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>{language === 'bn' ? 'ফুল ব্রাউজারে খুলুন' : 'Open Full Browser'}</span>
                    </button>

                    <button
                      onClick={handleCopyLink}
                      className="py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                    >
                      <Copy className="w-4 h-4 text-slate-500" />
                      <span>{copiedLink ? (language === 'bn' ? 'কপি হয়েছে!' : 'Copied!') : (language === 'bn' ? 'লিংক কপি করুন' : 'Copy Link')}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Install steps */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2">
                <p className="font-extrabold text-slate-900">
                  {language === 'bn' ? 'মোবাইলে হোমস্ক্রিনে অ্যাপ ইনস্টল করার নিয়ম:' : 'Install directly to Mobile Home Screen:'}
                </p>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <p>1. গুগল ক্রোম ব্রাউজারে অ্যাপটি ওপেন করুন।</p>
                  <p>2. উপরে ডানপাশের থ্রি-ডট মেন্যুতে (⋮) চাপুন।</p>
                  <p>3. <strong>"Install app"</strong> অথবা <strong>"Add to Home screen"</strong> চাপলেই ফোনে অ্যাপ ইনস্টল হয়ে যাবে।</p>
                </div>
              </div>
            </div>
          )}

          {/* Footer note */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Android Ready (Capacitor + PWA)</span>
            </div>
            <button
              onClick={onClose}
              className="font-bold text-slate-600 hover:text-slate-900 transition-colors"
            >
              {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
