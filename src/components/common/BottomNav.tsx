import React from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../utils/translations';
import { Home, LayoutGrid, ShoppingCart, Package, User } from 'lucide-react';

export type CustomerTab = 'home' | 'categories' | 'cart' | 'orders' | 'profile';

interface BottomNavProps {
  activeTab: CustomerTab;
  setActiveTab: (tab: CustomerTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { cart, orders, language } = useApp();
  const t = translations[language];

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const activeOrdersCount = orders.filter(
    o => o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled'
  ).length;

  const navItems: { id: CustomerTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'home',
      label: t.navHome,
      icon: <Home className="w-5 h-5" />,
    },
    {
      id: 'categories',
      label: t.navCategories,
      icon: <LayoutGrid className="w-5 h-5" />,
    },
    {
      id: 'cart',
      label: t.navCart,
      icon: <ShoppingCart className="w-5 h-5" />,
      badge: totalCartCount > 0 ? totalCartCount : undefined,
    },
    {
      id: 'orders',
      label: t.navOrders,
      icon: <Package className="w-5 h-5" />,
      badge: activeOrdersCount > 0 ? activeOrdersCount : undefined,
    },
    {
      id: 'profile',
      label: t.navProfile,
      icon: <User className="w-5 h-5" />,
    },
  ];

  return (
    <nav
      id="customer-bottom-nav"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg px-2 py-1.5 md:hidden"
    >
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`bottom-nav-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150 ${
                isActive
                  ? 'text-emerald-700 font-bold scale-105'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 bg-rose-600 text-white font-black text-[9px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 font-medium leading-none">
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
