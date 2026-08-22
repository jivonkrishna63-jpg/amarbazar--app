import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../utils/translations';
import {
  MapPin,
  Bell,
  Languages,
  ChevronDown,
  User as UserIcon,
  Search,
  Store,
  Bike,
  ShieldCheck,
  ShoppingBag,
  Download,
} from 'lucide-react';
import { LocationPickerModal } from './LocationPickerModal';
import { NotificationDrawer } from './NotificationDrawer';
import { AuthModal } from './AuthModal';
import { Logo } from './Logo';
import { LogoModal } from './LogoModal';

interface HeaderProps {
  onOpenSearch?: () => void;
  onOpenTracking?: (orderId: string) => void;
  onOpenInstallModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenTracking, onOpenInstallModal }) => {
  const {
    language,
    setLanguage,
    currentRole,
    currentUser,
    currentLocationDetails,
    serviceAreas,
    unreadNotifCount,
    isServiceAvailableInArea,
  } = useApp();

  const t = translations[language];
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

  const currentAreaObj = serviceAreas.find(a => a.id === currentLocationDetails.areaId);

  return (
    <>
      <header id="main-app-header" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 py-2.5 flex items-center justify-between gap-2">
          {/* Left: Brand & Location */}
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="group relative flex items-center">
              <Logo
                size="md"
                onClick={() => setIsLogoModalOpen(true)}
                className="hover:opacity-90 transition-opacity"
              />
              <button
                onClick={() => setIsLogoModalOpen(true)}
                title={language === 'bn' ? 'লগো পরিবর্তন করুন' : 'Change Logo'}
                className="ml-1 opacity-0 group-hover:opacity-100 hover:bg-slate-100 text-slate-400 hover:text-emerald-700 p-1 rounded-lg text-[10px] transition-all hidden sm:flex items-center gap-0.5 border border-slate-200/60 bg-white shadow-xs"
              >
                <span>🎨 {language === 'bn' ? 'চেঞ্জ' : 'Edit'}</span>
              </button>
            </div>

            {/* Location Selector Pill (Customer Mode) */}
            {currentRole === 'customer' && (
              <button
                id="header-location-selector-btn"
                onClick={() => setIsLocationModalOpen(true)}
                className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-left transition-all ${
                  isServiceAvailableInArea
                    ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    : 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-800 animate-pulse'
                }`}
              >
                <MapPin className={`w-3.5 h-3.5 ${isServiceAvailableInArea ? 'text-emerald-600' : 'text-rose-600'}`} />
                <div className="text-xs">
                  <div className="text-[10px] text-slate-400 font-medium leading-none">
                    {t.deliverTo}
                  </div>
                  <div className="font-semibold text-slate-800 truncate max-w-[150px] leading-tight">
                    {currentAreaObj ? (language === 'bn' ? currentAreaObj.nameBn : currentAreaObj.nameEn) : 'Select Area'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
              </button>
            )}
          </div>

          {/* Right: Language switch, Notifications, Profile/Auth */}
          <div className="flex items-center gap-2">
            {/* Install App Button */}
            {onOpenInstallModal && (
              <button
                id="header-install-app-btn"
                onClick={onOpenInstallModal}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/90 hover:bg-emerald-200 rounded-xl transition-colors border border-emerald-300 shadow-xs"
                title={language === 'bn' ? 'অ্যাপ ইনস্টল করুন' : 'Install App'}
              >
                <Download className="w-3.5 h-3.5 text-emerald-700" />
                <span>{language === 'bn' ? 'ইনস্টল' : 'Install'}</span>
              </button>
            )}

            {/* Language Toggle Button */}
            <button
              id="language-toggle-btn"
              onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-200"
              title="Toggle Language / ভাষা পরিবর্তন"
            >
              <Languages className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'en' ? 'বাংলা' : 'English'}</span>
            </button>

            {/* Notification Bell */}
            <button
              id="header-notifications-btn"
              onClick={() => setIsNotifDrawerOpen(true)}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifCount > 0 && (
                <span
                  id="header-notif-badge"
                  className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white font-bold text-[10px] rounded-full flex items-center justify-center shadow-xs animate-bounce"
                >
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {/* User Profile / Auth button */}
            <button
              id="header-auth-btn"
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-1.5 pl-2 pr-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 text-slate-800 transition-colors"
            >
              {currentUser.avatar ? (
                <img src={currentUser.avatar} alt={currentUser.name} className="w-5 h-5 rounded-full object-cover" />
              ) : (
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {currentUser.name.charAt(0)}
                </div>
              )}
              <span className="hidden sm:inline truncate max-w-[90px]">{currentUser.name.split(' ')[0]}</span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-header Location Bar for Customer */}
        {currentRole === 'customer' && (
          <div className="md:hidden px-3.5 py-1.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
            <button
              id="mobile-location-btn"
              onClick={() => setIsLocationModalOpen(true)}
              className="flex items-center gap-1.5 text-slate-700 font-medium truncate"
            >
              <MapPin className={`w-3.5 h-3.5 shrink-0 ${isServiceAvailableInArea ? 'text-emerald-600' : 'text-rose-600'}`} />
              <span className="text-slate-500 text-[11px]">{t.deliverTo}:</span>
              <span className="font-semibold text-slate-900 truncate">
                {currentAreaObj ? (language === 'bn' ? currentAreaObj.nameBn : currentAreaObj.nameEn) : 'Choose Area'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {!isServiceAvailableInArea ? (
              <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                Service Unavailable
              </span>
            ) : (
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                COD Active
              </span>
            )}
          </div>
        )}
      </header>

        {/* Modals & Drawers */}
      <LocationPickerModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />

      <NotificationDrawer
        isOpen={isNotifDrawerOpen}
        onClose={() => setIsNotifDrawerOpen(false)}
        onOpenOrder={(orderId) => {
          setIsNotifDrawerOpen(false);
          if (onOpenTracking) onOpenTracking(orderId);
        }}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <LogoModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
      />
    </>
  );
};
