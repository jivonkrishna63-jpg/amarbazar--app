import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { translations } from '../../utils/translations';
import { ShoppingBag, Store, Bike, ShieldCheck, RefreshCw } from 'lucide-react';

interface RoleSwitcherProps {
  compact?: boolean;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ compact = false }) => {
  const { currentRole, setCurrentRole, language, currentUser } = useApp();
  const t = translations[language];

  const roles: { role: UserRole; label: string; icon: React.ReactNode; color: string; badge: string }[] = [
    {
      role: 'customer',
      label: t.roleCustomer,
      icon: <ShoppingBag className="w-4 h-4" />,
      color: 'bg-emerald-600 text-white',
      badge: 'Buyer',
    },
    {
      role: 'seller',
      label: t.roleSeller,
      icon: <Store className="w-4 h-4" />,
      color: 'bg-amber-600 text-white',
      badge: 'Shop',
    },
    {
      role: 'rider',
      label: t.roleRider,
      icon: <Bike className="w-4 h-4" />,
      color: 'bg-blue-600 text-white',
      badge: 'Delivery',
    },
    {
      role: 'admin',
      label: t.roleAdmin,
      icon: <ShieldCheck className="w-4 h-4" />,
      color: 'bg-purple-600 text-white',
      badge: 'Admin',
    },
  ];

  if (compact) {
    return (
      <div id="role-switcher-compact" className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
        {roles.map(r => {
          const isActive = currentRole === r.role;
          return (
            <button
              key={r.role}
              id={`role-btn-${r.role}`}
              onClick={() => setCurrentRole(r.role)}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all duration-200 ${
                isActive
                  ? `${r.color} shadow-sm scale-102`
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
              title={r.label}
            >
              {r.icon}
              <span className="hidden sm:inline">{r.badge}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div id="role-switcher-banner" className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-3.5 py-2 flex items-center justify-between border-b border-slate-700/60 shadow-inner">
      <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
        <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
        <span className="hidden sm:inline text-slate-300">App Mode:</span>
        <span className="font-bold text-white bg-slate-700/80 px-2 py-0.5 rounded-md border border-slate-600">
          {roles.find(r => r.role === currentRole)?.label}
        </span>
        <span className="text-slate-400 text-[11px] hidden md:inline">({currentUser.name})</span>
      </div>

      <div className="flex items-center gap-1">
        <span className="text-[11px] text-slate-400 mr-1 hidden lg:inline">Switch Role:</span>
        <div className="flex items-center gap-1 bg-slate-800/90 p-0.5 rounded-lg border border-slate-700">
          {roles.map(r => {
            const isActive = currentRole === r.role;
            return (
              <button
                key={r.role}
                id={`role-switch-header-${r.role}`}
                onClick={() => setCurrentRole(r.role)}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all duration-150 ${
                  isActive
                    ? `${r.color} shadow font-semibold`
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                {r.icon}
                <span>{r.badge}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
