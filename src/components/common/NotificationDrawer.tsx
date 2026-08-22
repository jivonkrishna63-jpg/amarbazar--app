import React from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../utils/translations';
import { Bell, Check, X, Package, Tag, Shield, Bike, Clock } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenOrder?: (orderId: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onOpenOrder,
}) => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    language,
    currentRole,
  } = useApp();

  const t = translations[language];

  if (!isOpen) return null;

  const filteredNotifs = notifications.filter(
    n => !n.role || n.role === 'all' || n.role === currentRole
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
      case 'delivery':
        return <Bike className="w-4 h-4 text-emerald-600" />;
      case 'promo':
        return <Tag className="w-4 h-4 text-amber-600" />;
      case 'system':
      default:
        return <Shield className="w-4 h-4 text-purple-600" />;
    }
  };

  return (
    <div id="notification-drawer-backdrop" className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base">
              {language === 'bn' ? 'বিজ্ঞপ্তিসমূহ' : 'Notifications'}
            </h3>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              {filteredNotifs.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {filteredNotifs.some(n => !n.isRead) && (
              <button
                id="mark-all-read-btn"
                onClick={markAllNotificationsRead}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Mark All Read</span>
              </button>
            )}
            <button
              id="close-notif-drawer-btn"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredNotifs.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Bell className="w-12 h-12 mx-auto text-slate-300 stroke-1" />
              <p className="text-sm font-medium">No notifications yet</p>
              <p className="text-xs">You will receive instant updates regarding your orders and offers here.</p>
            </div>
          ) : (
            filteredNotifs.map(n => (
              <div
                key={n.id}
                id={`notif-card-${n.id}`}
                onClick={() => {
                  markNotificationRead(n.id);
                  if (n.orderId && onOpenOrder) {
                    onOpenOrder(n.orderId);
                  }
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  n.isRead
                    ? 'bg-slate-50/70 border-slate-200/70 opacity-80'
                    : 'bg-white border-emerald-300 shadow-xs ring-1 ring-emerald-500/10'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h4 className={`text-xs font-bold truncate ${n.isRead ? 'text-slate-700' : 'text-slate-900'}`}>
                        {language === 'bn' ? n.titleBn : n.titleEn}
                      </h4>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {language === 'bn' ? n.messageBn : n.messageEn}
                    </p>
                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100/80 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {n.createdAt}
                      </span>
                      {n.orderId && (
                        <span className="text-emerald-700 font-bold hover:underline">
                          View Order →
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
