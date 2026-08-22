import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations, formatCurrency, getOrderStatusLabel } from '../../utils/translations';
import { Order } from '../../types';
import {
  Bike,
  MapPin,
  Phone,
  Store,
  CheckCircle2,
  Navigation,
  Banknote,
  Clock,
  Check,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Package,
  Shield,
} from 'lucide-react';

export const RiderDashboard: React.FC = () => {
  const {
    currentUser,
    orders,
    updateOrderStatus,
    language,
    showToast,
  } = useApp();

  const t = translations[language];

  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState<'assigned' | 'available' | 'earnings'>('assigned');

  // Rider's active & assigned orders
  const myAssignedOrders = orders.filter(
    o => (o.riderId === currentUser.id || !o.riderId) &&
         (o.orderStatus === 'rider_assigned' || o.orderStatus === 'picked_up' || o.orderStatus === 'out_for_delivery')
  );

  const completedToday = orders.filter(
    o => o.orderStatus === 'delivered'
  );

  // Available new orders ready for pickup by any rider
  const availableOrders = orders.filter(
    o => o.orderStatus === 'preparing' || (o.orderStatus === 'rider_assigned' && !o.riderId)
  );

  const totalCodCollected = completedToday.reduce((sum, o) => sum + o.totalAmount, 0);
  const riderEarnings = completedToday.length * 35; // ৳35 commission per delivery

  const handleAcceptOrder = (order: Order) => {
    updateOrderStatus(order.id, 'rider_assigned', `Rider ${currentUser.name} accepted delivery`);
    showToast('Delivery request accepted! Head to shop for pickup.', 'success');
  };

  const handleMarkPickedUp = (orderId: string) => {
    updateOrderStatus(orderId, 'picked_up', 'Rider collected parcel from shop');
    showToast('Parcel marked as Picked Up', 'success');
  };

  const handleMarkOutForDelivery = (orderId: string) => {
    updateOrderStatus(orderId, 'out_for_delivery', 'Rider is on the way to customer address');
    showToast('Out for Delivery status activated', 'success');
  };

  const handleConfirmDelivered = (orderId: string, amount: number) => {
    updateOrderStatus(orderId, 'delivered', `Delivered! Collected COD: ৳${amount}`);
    showToast(`Order marked delivered! Cash received: ৳${amount}`, 'success');
  };

  return (
    <div id="rider-dashboard" className="space-y-6 pb-20 md:pb-8 animate-in fade-in max-w-4xl mx-auto">
      {/* Top Rider Profile Banner & Duty Status */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 rounded-3xl shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/30 border-2 border-blue-400/40 flex items-center justify-center text-blue-300 font-bold text-2xl shrink-0">
              <Bike className="w-9 h-9" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black">{currentUser.name}</h2>
                <span className="text-[10px] bg-blue-500 text-blue-950 font-black px-2 py-0.5 rounded-full">
                  VERIFIED RIDER
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-0.5">
                Vehicle: Honda 125cc (Dhaka Metro-Ha 44-9021)
              </p>
              <div className="flex items-center gap-2 text-xs text-blue-300 mt-1">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>Active Service Area: Dhanmondi & Mohammadpur</span>
              </div>
            </div>
          </div>

          {/* Duty Status Toggle */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15">
            <div>
              <div className="text-[11px] uppercase font-bold text-blue-200">
                {t.dutyStatus}
              </div>
              <div className="text-xs font-black">
                {isOnline ? (
                  <span className="text-emerald-300">🟢 {t.onlineReady}</span>
                ) : (
                  <span className="text-slate-400">⚪ {t.offline}</span>
                )}
              </div>
            </div>
            <button
              id="rider-duty-toggle-btn"
              onClick={() => setIsOnline(!isOnline)}
              className="p-1 rounded-xl hover:bg-white/20 transition-colors"
            >
              {isOnline ? (
                <ToggleRight className="w-8 h-8 text-emerald-400" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-slate-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Active Runs</div>
          <div className="text-xl font-black text-blue-600 mt-1">{myAssignedOrders.length}</div>
          <span className="text-[10px] text-slate-500">In-progress deliveries</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">{t.completedRuns}</div>
          <div className="text-xl font-black text-emerald-800 mt-1">{completedToday.length}</div>
          <span className="text-[10px] text-emerald-600 font-semibold">Today's deliveries</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">{t.riderEarnings}</div>
          <div className="text-xl font-black text-slate-900 mt-1">
            {formatCurrency(riderEarnings, language)}
          </div>
          <span className="text-[10px] text-slate-400">৳35 fee per run</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">{t.codCashOnHand}</div>
          <div className="text-xl font-black text-amber-600 mt-1">
            {formatCurrency(totalCodCollected, language)}
          </div>
          <span className="text-[10px] text-slate-400">To deposit at hub</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('assigned')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'assigned'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Bike className="w-4 h-4" />
          <span>Active Runs ({myAssignedOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('available')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'available'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>New Requests ({availableOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('earnings')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'earnings'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Banknote className="w-4 h-4" />
          <span>COD & Payouts</span>
        </button>
      </div>

      {/* Tab 1: Active In-Progress Deliveries */}
      {activeTab === 'assigned' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm">Active In-Progress Orders</h3>
            <span className="text-xs text-slate-500">Pickup and doorstep delivery tasks</span>
          </div>

          {myAssignedOrders.length === 0 ? (
            <div className="py-12 bg-white rounded-3xl border border-slate-200 text-center text-slate-400 space-y-2">
              <Bike className="w-10 h-10 mx-auto stroke-1 text-slate-300" />
              <p className="text-sm font-semibold">No active delivery in progress</p>
              <p className="text-xs">Switch to "New Requests" tab to accept upcoming delivery orders.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myAssignedOrders.map(order => {
                const isPickedUp = order.orderStatus === 'picked_up' || order.orderStatus === 'out_for_delivery';
                const isOutForDeliv = order.orderStatus === 'out_for_delivery';

                return (
                  <div
                    key={order.id}
                    className="bg-white p-4 sm:p-5 rounded-3xl border border-blue-200 shadow-md space-y-4 ring-1 ring-blue-500/10"
                  >
                    {/* Top order info & COD amount banner */}
                    <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-slate-900">
                            {order.orderNumber}
                          </span>
                          <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full uppercase">
                            {getOrderStatusLabel(order.orderStatus, language)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {order.items.length} items • {order.placedAt}
                        </p>
                      </div>

                      <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-right">
                        <div className="text-[10px] font-bold uppercase text-amber-800">
                          Collect COD Cash
                        </div>
                        <div className="text-base font-black text-amber-950">
                          {formatCurrency(order.totalAmount, language)}
                        </div>
                      </div>
                    </div>

                    {/* Step 1: Pickup Location (Shop) */}
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                          <Store className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-[10px] uppercase font-bold text-slate-400">
                            Pickup from Shop:
                          </div>
                          <div className="text-xs font-bold text-slate-900">{order.shopName}</div>
                          <div className="text-[11px] text-slate-500">{order.deliveryAddress.areaName}</div>
                        </div>
                      </div>
                      <a
                        href={`tel:${order.shopPhone || '01811223344'}`}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl flex items-center gap-1"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call Store</span>
                      </a>
                    </div>

                    {/* Step 2: Dropoff Location (Customer) */}
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-[10px] uppercase font-bold text-slate-400">
                            Deliver to Customer:
                          </div>
                          <div className="text-xs font-bold text-slate-900">{order.customerName}</div>
                          <div className="text-[11px] text-slate-600">
                            {order.deliveryAddress.streetAddress}, {order.deliveryAddress.villageName}
                          </div>
                          {order.deliveryAddress.deliveryNote && (
                            <div className="text-[10px] text-amber-700 italic mt-0.5">
                              Note: {order.deliveryAddress.deliveryNote}
                            </div>
                          )}
                        </div>
                      </div>
                      <a
                        href={`tel:${order.customerPhone}`}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call Client</span>
                      </a>
                    </div>

                    {/* Action Progression Controls */}
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2">
                      {!isPickedUp && (
                        <button
                          id={`mark-picked-up-btn-${order.id}`}
                          onClick={() => handleMarkPickedUp(order.id)}
                          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                        >
                          <Package className="w-4 h-4" />
                          <span>{t.markPickedUp}</span>
                        </button>
                      )}

                      {order.orderStatus === 'picked_up' && (
                        <button
                          id={`mark-out-delivery-btn-${order.id}`}
                          onClick={() => handleMarkOutForDelivery(order.id)}
                          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                        >
                          <Navigation className="w-4 h-4" />
                          <span>Start Route ({t.outForDelivery})</span>
                        </button>
                      )}

                      {isOutForDeliv && (
                        <button
                          id={`mark-delivered-btn-${order.id}`}
                          onClick={() => handleConfirmDelivered(order.id, order.totalAmount)}
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/25 transition-all flex items-center gap-1.5 animate-pulse"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{t.markDelivered} & Collect {formatCurrency(order.totalAmount, language)}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Available Delivery Requests */}
      {activeTab === 'available' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm">
              New Delivery Requests ({availableOrders.length})
            </h3>
            <span className="text-xs text-slate-500">Pickups available in your local radius</span>
          </div>

          {availableOrders.length === 0 ? (
            <div className="py-12 bg-white rounded-3xl border border-slate-200 text-center text-slate-400">
              <Clock className="w-10 h-10 mx-auto stroke-1" />
              <p className="text-sm font-semibold mt-2">No pending pickup requests</p>
            </div>
          ) : (
            <div className="space-y-3">
              {availableOrders.map(order => (
                <div
                  key={order.id}
                  className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{order.shopName}</span>
                      <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-md">
                        {order.orderNumber}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      To: {order.deliveryAddress.streetAddress}, {order.deliveryAddress.villageName}
                    </p>
                    <div className="text-xs font-black text-emerald-800 mt-1">
                      COD Cash: {formatCurrency(order.totalAmount, language)} • Rider Fee: ৳35
                    </div>
                  </div>

                  <button
                    id={`accept-request-btn-${order.id}`}
                    onClick={() => handleAcceptOrder(order)}
                    className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                  >
                    {t.acceptDelivery}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Earnings & COD Settlement */}
      {activeTab === 'earnings' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm">Rider COD & Commission Record</h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-600">Total Completed Deliveries Today</span>
                <span className="font-bold text-slate-900">{completedToday.length} Orders</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl text-emerald-950 font-bold">
                <span>Rider Delivery Commission Earned</span>
                <span>{formatCurrency(riderEarnings, language)}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-amber-50 rounded-2xl text-amber-950 font-black text-sm">
                <span>Cash on Delivery (COD) To Handover at Hub</span>
                <span className="text-lg">{formatCurrency(totalCodCollected, language)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
