import React from 'react';
import { useApp } from '../../context/AppContext';
import officialLogoImg from '../../assets/images/amarbazar_logo_1787399370303.jpg';
import { ShoppingBag, Sparkles, Bike, Store, Zap } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showSubtitle?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  showSubtitle = true,
  className = '',
  onClick,
}) => {
  const { language, logoConfig } = useApp();

  const appName = language === 'bn' 
    ? (logoConfig.appNameBn || 'আমারবাজার') 
    : (logoConfig.appNameEn || 'AmarBazar');

  const tagline = language === 'bn'
    ? (logoConfig.taglineBn || 'লোকাল মার্কেটপ্লেস ও ডেলিভারি')
    : (logoConfig.taglineEn || 'Local Marketplace & Delivery');

  // Size dimensions
  const sizeClasses = {
    sm: {
      box: 'w-8 h-8 rounded-xl',
      img: 'w-8 h-8 rounded-xl',
      icon: 'w-4 h-4',
      title: 'text-base',
      badge: 'text-[9px] px-1 py-0.2',
      subtitle: 'text-[9px]',
    },
    md: {
      box: 'w-10 h-10 rounded-xl',
      img: 'w-10 h-10 rounded-xl',
      icon: 'w-5 h-5',
      title: 'text-lg',
      badge: 'text-[10px] px-1.5 py-0.5',
      subtitle: 'text-[10px]',
    },
    lg: {
      box: 'w-14 h-14 rounded-2xl',
      img: 'w-14 h-14 rounded-2xl',
      icon: 'w-7 h-7',
      title: 'text-2xl',
      badge: 'text-xs px-2 py-0.5',
      subtitle: 'text-xs',
    },
    xl: {
      box: 'w-20 h-20 rounded-3xl',
      img: 'w-20 h-20 rounded-3xl',
      icon: 'w-10 h-10',
      title: 'text-3xl',
      badge: 'text-sm px-2.5 py-1',
      subtitle: 'text-sm',
    },
  }[size];

  const renderIcon = () => {
    if (logoConfig.preset === 'custom_url' && logoConfig.customUrl) {
      return (
        <img
          src={logoConfig.customUrl}
          alt={appName}
          className={`${sizeClasses.img} object-cover shadow-sm border border-emerald-500/20`}
          onError={(e) => {
            // fallback if custom URL fails
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      );
    }

    if (logoConfig.preset === 'official') {
      return (
        <div className={`relative ${sizeClasses.box} overflow-hidden shadow-md shadow-emerald-700/20 ring-1 ring-emerald-500/30 shrink-0 bg-white`}>
          <img
            src={officialLogoImg}
            alt="AmarBazar Official Logo"
            className="w-full h-full object-cover transform scale-105 hover:scale-110 transition-transform duration-300"
          />
        </div>
      );
    }

    if (logoConfig.preset === 'emerald_bag') {
      return (
        <div className={`${sizeClasses.box} bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 text-white flex items-center justify-center font-black shadow-md shadow-emerald-700/25 shrink-0`}>
          <ShoppingBag className={sizeClasses.icon} />
        </div>
      );
    }

    if (logoConfig.preset === 'speed_rider') {
      return (
        <div className={`${sizeClasses.box} bg-gradient-to-br from-amber-500 via-orange-600 to-emerald-700 text-white flex items-center justify-center font-black shadow-md shadow-amber-600/25 shrink-0`}>
          <Bike className={sizeClasses.icon} />
        </div>
      );
    }

    // Default Bangla Monogram
    return (
      <div className={`${sizeClasses.box} bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center font-black shadow-md shadow-emerald-700/25 shrink-0`}>
        <span className="select-none text-base sm:text-lg">আ</span>
      </div>
    );
  };

  return (
    <div
      id="app-brand-logo"
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 ${onClick ? 'cursor-pointer select-none' : ''} ${className}`}
    >
      {renderIcon()}

      {showText && (
        <div className="leading-tight">
          <div className="flex items-center gap-1.5">
            <h1 className={`font-black text-slate-900 tracking-tight ${sizeClasses.title}`}>
              {appName}
            </h1>
            {logoConfig.showBadge !== false && (
              <span className={`font-extrabold tracking-wider uppercase rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200/60 ${sizeClasses.badge}`}>
                {language === 'bn' ? 'লোকাল' : 'LOCAL'}
              </span>
            )}
          </div>
          {showSubtitle && (
            <p className={`text-slate-500 font-medium ${sizeClasses.subtitle}`}>
              {tagline}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
