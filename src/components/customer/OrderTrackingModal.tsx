import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import {
  translations,
  formatCurrency,
  getOrderStatusLabel,
  getOrderStatusDesc,
} from '../../utils/translations';
import {
  X,
  CheckCircle2,
  Clock,
  Bike,
  Store,
  MapPin,
  Phone,
  Banknote,
  AlertTriangle,
  ChevronRight,
  Navigation,
  ShieldCheck,
  Package,
} from 'lucide-react';

interface OrderTrackingModalProps {
  orderId: string | null;
  onClose: () => void;
}

const ORDER_STEPS: OrderStatus[] = [
  'order_placed',
  'seller_confirmed',
  'preparing',
  'rider_assigned',
  'picked_up',
  'out_for_delivery',
  'delivered',
];

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  orderId,
  onClose,
}) => {
  const { orders, updateOrderStatus, cancelOrder, language } = useApp();
  const t = translations[language];

  const order = orders.find(o => o.id === orderId) || orders[0];

  // Rider animated map progression
  const [riderProgress, setRiderProgress] = useState(0.45);

  useEffect(() => {
    if (order?.orderStatus === 'out_for_delivery') {
      const interval = setInterval(() => {
        setRiderProgress(p => (p >= 0.95 ? 0.2 : p + 0.08));
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [order?.orderStatus]);

  if (!orderId || !order) return null;

  const currentStepIndex = ORDER_STEPS.indexOf(order.orderStatus);
  const isCancelled = order.orderStatus === 'cancelled';
  const isDelivered = order.orderStatus === 'delivered';
  const canCancel =
    order.orderStatus === 'order_placed' ||
    order.orderStatus === 'seller_confirmed' ||
    order.orderStatus === 'preparing';

  const handleSimulateNext = () => {
    if (currentStepIndex < ORDER_STEPS.length - 1) {
      const nextStatus = ORDER_STEPS[currentStepIndex + 1];
      updateOrderStatus(order.id, nextStatus, `Simulated step update to ${nextStatus}`);
    }
  };

  return (
    <div id="order-tracking-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Bike className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  {t.orderTracking}
                </h3>
                <span className="text-xs bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-md">
                  {order.orderNumber}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Placed on {order.placedAt} • COD Payment
              </p>
            </div>
          </div>
          <button
            id="close-tracking-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          {/* Top Status Banner */}
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between ${
              isCancelled
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : isDelivered
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-emerald-950 text-white border-emerald-900'
            }`}
          >
            <div>
              <div className="text-[11px] uppercase tracking-wider font-semibold opacity-80">
                {t.status}
              </div>
              <h2 className="text-base sm:text-lg font-black mt-0.5">
                {getOrderStatusLabel(order.orderStatus, language)}
              </h2>
              <p className={`text-xs mt-1 ${isCancelled ? 'text-rose-700' : isDelivered ? 'text-emerald-700' : 'text-slate-300'}`}>
                {getOrderStatusDesc(order.orderStatus, language)}
              </p>
            </div>

            {/* Quick Simulation Trigger for testing transitions */}
            {!isCancelled && !isDelivered && (
              <button
                id="simulate-next-step-btn"
                onClick={handleSimulateNext}
                className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-xl transition-colors shadow-sm flex items-center gap-1 shrink-0 ml-2"
                title="Advance order to next state for instant demo"
              >
                <span>Advance State</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Interactive Simulated Live Map */}
          <div className="relative h-44 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
            {/* Map Canvas Background Simulation */}
            <div className="absolute inset-0 bg-emerald-950/5 flex flex-col justify-between p-4">
              {/* Map grid lines */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />

              {/* Shop Pin */}
              <div className="relative z-10 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-md">
                  <Store className="w-4 h-4" />
                </div>
                <div className="bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md text-[11px] font-bold text-slate-800 shadow-xs">
                  {order.shopName}
                </div>
              </div>

              {/* Live Moving Rider Pin */}
              <div
                className="absolute z-20 transition-all duration-1000 flex flex-col items-center"
                style={{
                  left: `${riderProgress * 75 + 10}%`,
                  top: '48%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg ring-4 ring-emerald-300/40 animate-pulse">
                  <Bike className="w-5 h-5" />
                </div>
                <span className="bg-emerald-950 text-white text-[9px] font-black px-1.5 py-0.2 rounded-md mt-1 shadow-xs whitespace-nowrap">
                  Rider {order.riderName?.split(' ')[0] || 'Tanvir'}
                </span>
              </div>

              {/* Customer Pin */}
              <div className="relative z-10 self-end flex items-center gap-2">
                <div className="bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md text-[11px] font-bold text-slate-800 shadow-xs">
                  Your Address: {order.deliveryAddress.villageName || 'Kathalbagan'}
                </div>
                <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md">
                  <MapPin className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-md">
              📍 Live GPS Route Simulation • Active Order Tracking
            </div>
          </div>

          {/* Step-by-Step Vertical Timeline */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Delivery Progress
            </h4>

            <div className="space-y-4 relative pl-3">
              {/* Vertical connector line */}
              <div className="absolute left-6 top-3 bottom-3 w-0.5 bg-slate-200" />

              {ORDER_STEPS.map((stepKey, idx) => {
                const isPassed = currentStepIndex >= idx;
                const isCurrent = currentStepIndex === idx;

                const historyItem = order.statusHistory.find(h => h.status === stepKey);

                return (
                  <div key={stepKey} className="relative flex items-start gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold z-10 transition-all ${
                        isPassed
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white border-2 border-slate-300 text-slate-400'
                      } ${isCurrent ? 'ring-4 ring-emerald-200' : ''}`}
                    >
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h5
                          className={`text-xs font-bold ${
                            isCurrent
                              ? 'text-emerald-950 font-extrabold'
                              : isPassed
                              ? 'text-slate-800'
                              : 'text-slate-400'
                          }`}
                        >
                          {getOrderStatusLabel(stepKey, language)}
                        </h5>
                        {historyItem && (
                          <span className="text-[10px] text-slate-400 font-medium">
                            {historyItem.timestamp}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        {getOrderStatusDesc(stepKey, language)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rider & Shop Contact Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Rider Details */}
            <div className="p-3.5 bg-white rounded-2xl border border-slate-200 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Bike className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">
                    Delivery Rider
                  </div>
                  <div className="text-xs font-bold text-slate-900">
                    {order.riderName || 'Tanvir Ahmed'}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {order.riderVehicle || 'Honda 125cc'}
                  </div>
                </div>
              </div>
              <a
                href={`tel:${order.riderPhone || '01911223344'}`}
                className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition-colors"
                title="Call Rider"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>

            {/* Shop Details */}
            <div className="p-3.5 bg-white rounded-2xl border border-slate-200 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">
                    Local Shop
                  </div>
                  <div className="text-xs font-bold text-slate-900 truncate max-w-[140px]">
                    {order.shopName}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {order.deliveryAddress.areaName}
                  </div>
                </div>
              </div>
              <a
                href={`tel:${order.shopPhone || '01811223344'}`}
                className="p-2.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl transition-colors"
                title="Call Shop"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Cash on Delivery summary note */}
          <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-center justify-between text-xs text-amber-950">
            <div className="flex items-center gap-2.5">
              <Banknote className="w-5 h-5 text-amber-700" />
              <div>
                <span className="font-bold">Cash on Delivery (COD) Amount: </span>
                <span className="text-sm font-black text-amber-900">
                  {formatCurrency(order.totalAmount, language)}
                </span>
                <p className="text-[11px] text-amber-800">
                  Please keep exact change ready for rider handover.
                </p>
              </div>
            </div>
          </div>

          {/* Cancel Order Action (if eligible) */}
          {canCancel && (
            <div className="pt-2 flex justify-end">
              <button
                id="cancel-order-action-btn"
                onClick={() => {
                  if (confirm(t.cancelConfirm)) {
                    cancelOrder(order.id, 'Cancelled by customer before pickup');
                  }
                }}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-4 py-2 rounded-xl border border-rose-200 transition-colors"
              >
                {t.cancelOrder}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
