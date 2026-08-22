import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations, formatCurrency, getOrderStatusLabel } from '../../utils/translations';
import { Order } from '../../types';
import {
  Package,
  Bike,
  Store,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  RotateCcw,
} from 'lucide-react';

interface OrderHistoryViewProps {
  onOpenTracking: (orderId: string) => void;
  onStartShopping: () => void;
}

export const OrderHistoryView: React.FC<OrderHistoryViewProps> = ({
  onOpenTracking,
  onStartShopping,
}) => {
  const { orders, currentUser, language } = useApp();
  const t = translations[language];

  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'completed'>('all');

  const customerOrders = orders.filter(
    o => o.customerId === currentUser.id || !o.customerId || o.customerId.startsWith('user-customer')
  );

  const filteredOrders = customerOrders.filter(o => {
    if (activeFilter === 'active') {
      return o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled';
    }
    if (activeFilter === 'completed') {
      return o.orderStatus === 'delivered' || o.orderStatus === 'cancelled';
    }
    return true;
  });

  const getStatusBadge = (status: Order['orderStatus']) => {
    switch (status) {
      case 'order_placed':
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Order Placed</span>;
      case 'seller_confirmed':
        return <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Confirmed</span>;
      case 'preparing':
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">Preparing</span>;
      case 'rider_assigned':
        return <span className="bg-cyan-100 text-cyan-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Rider Assigned</span>;
      case 'picked_up':
        return <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Picked Up</span>;
      case 'out_for_delivery':
        return <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 animate-bounce">🛵 Out for Delivery</span>;
      case 'delivered':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Delivered</span>;
      case 'cancelled':
        return <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Cancelled</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full">{status}</span>;
    }
  };

  if (customerOrders.length === 0) {
    return (
      <div id="empty-orders-view" className="py-16 px-4 text-center max-w-md mx-auto space-y-4 animate-in fade-in">
        <div className="w-20 h-20 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <Package className="w-10 h-10 stroke-1" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">No orders placed yet</h3>
        <p className="text-xs text-slate-500">
          Order groceries, hot biryani, medicine or clothing with fast doorstep delivery!
        </p>
        <button
          onClick={onStartShopping}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
        >
          Explore Local Market
        </button>
      </div>
    );
  }

  return (
    <div id="order-history-view" className="space-y-4 pb-20 md:pb-8 animate-in fade-in max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">{t.navOrders}</h2>
          <p className="text-xs text-slate-500">
            Real-time tracking and purchase receipts
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          {(['all', 'active', 'completed'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-3 py-1 rounded-lg font-bold capitalize transition-all ${
                activeFilter === tab
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.map(order => {
          const isActive = order.orderStatus !== 'delivered' && order.orderStatus !== 'cancelled';

          return (
            <div
              key={order.id}
              id={`order-history-card-${order.id}`}
              onClick={() => onOpenTracking(order.id)}
              className={`bg-white p-4 rounded-3xl border transition-all cursor-pointer hover:shadow-md ${
                isActive
                  ? 'border-emerald-300 shadow-xs ring-1 ring-emerald-500/10'
                  : 'border-slate-200/80'
              }`}
            >
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                      {order.shopName}
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      {t.orderNo} {order.orderNumber} • {order.placedAt}
                    </span>
                  </div>
                </div>

                <div>{getStatusBadge(order.orderStatus)}</div>
              </div>

              {/* Items preview */}
              <div className="py-3 flex items-center justify-between text-xs">
                <div className="space-y-0.5 min-w-0 pr-2">
                  <p className="font-medium text-slate-700 truncate">
                    {order.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Deliver to: {order.deliveryAddress.villageName || order.deliveryAddress.areaName}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-black text-slate-900">
                    {formatCurrency(order.totalAmount, language)}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-semibold">
                    Cash on Delivery
                  </div>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">
                  {order.items.length} {t.items}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenTracking(order.id);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors ${
                    isActive
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {isActive ? (
                    <>
                      <Truck className="w-3.5 h-3.5" />
                      <span>{t.trackOrder}</span>
                    </>
                  ) : (
                    <>
                      <span>View Receipt</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
