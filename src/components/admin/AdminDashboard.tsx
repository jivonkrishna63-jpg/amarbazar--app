import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations, formatCurrency, getOrderStatusLabel } from '../../utils/translations';
import { DeliveryArea, Coupon, Shop, Order } from '../../types';
import { Logo } from '../common/Logo';
import { LogoModal } from '../common/LogoModal';
import {
  ShieldCheck,
  MapPin,
  Store,
  Bike,
  Users,
  Percent,
  Tag,
  Package,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  TrendingUp,
  Settings,
  Edit2,
  Sliders,
  DollarSign,
  Palette,
  Sparkles,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    shops,
    orders,
    users,
    serviceAreas,
    addServiceArea,
    updateServiceArea,
    commissionRate,
    setCommissionRate,
    coupons,
    addCoupon,
    updateOrderStatus,
    language,
    logoConfig,
    showToast,
  } = useApp();

  const t = translations[language];

  const [activeTab, setActiveTab] = useState<'overview' | 'geofence' | 'shops' | 'coupons' | 'orders' | 'settings'>('overview');
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

  // New Area Modal State
  const [isAddAreaOpen, setIsAddAreaOpen] = useState(false);
  const [newAreaNameEn, setNewAreaNameEn] = useState('');
  const [newAreaNameBn, setNewAreaNameBn] = useState('');
  const [newAreaCharge, setNewAreaCharge] = useState('35');
  const [newAreaEstMin, setNewAreaEstMin] = useState('25');
  const [newAreaUnions, setNewAreaUnions] = useState('Central, North');
  const [newAreaWards, setNewAreaWards] = useState('1, 2, 3, 4');

  // New Coupon State
  const [isAddCouponOpen, setIsAddCouponOpen] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [newCouponValue, setNewCouponValue] = useState('10');
  const [newCouponMinOrder, setNewCouponMinOrder] = useState('300');
  const [newCouponDescEn, setNewCouponDescEn] = useState('Special discount voucher');

  // Stats
  const totalGMV = orders
    .filter(o => o.orderStatus === 'delivered')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const platformEarnings = (totalGMV * commissionRate) / 100;
  const activeOrdersCount = orders.filter(o => o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled').length;

  const handleCreateArea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAreaNameEn) return;

    addServiceArea({
      nameEn: newAreaNameEn,
      nameBn: newAreaNameBn || newAreaNameEn,
      deliveryCharge: Number(newAreaCharge),
      estimatedDeliveryMin: Number(newAreaEstMin),
      unions: newAreaUnions.split(',').map(s => s.trim()),
      wards: newAreaWards.split(',').map(s => s.trim()),
      isActive: true,
    });

    setIsAddAreaOpen(false);
    setNewAreaNameEn('');
    setNewAreaNameBn('');
    showToast('New service delivery area created & activated', 'success');
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;

    addCoupon({
      code: newCouponCode.toUpperCase().trim(),
      discountType: newCouponType,
      discountValue: Number(newCouponValue),
      minOrderAmount: Number(newCouponMinOrder),
      maxDiscount: 100,
      descriptionEn: newCouponDescEn,
      descriptionBn: 'বিশেষ ছাড় ভাউচার',
      validUntil: '2026-12-31',
      isActive: true,
    });

    setIsAddCouponOpen(false);
    setNewCouponCode('');
    showToast('Promotional voucher created', 'success');
  };

  return (
    <div id="admin-dashboard" className="space-y-6 pb-20 md:pb-8 animate-in fade-in max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-slate-900 text-white p-5 sm:p-6 rounded-3xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-purple-600/30 border-2 border-purple-400/40 flex items-center justify-center text-purple-300 font-bold text-2xl shrink-0">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black">{t.adminConsole}</h2>
            <p className="text-xs text-purple-200 mt-0.5">
              Marketplace Operations, Geo-fencing & Commission Control
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/15 text-xs">
          <Percent className="w-4 h-4 text-purple-300" />
          <span>Seller Commission: </span>
          <span className="font-extrabold text-amber-300">{commissionRate}%</span>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Gross Volume (GMV)</div>
          <div className="text-xl font-black text-slate-900 mt-1">
            {formatCurrency(totalGMV, language)}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">{orders.filter(o => o.orderStatus === 'delivered').length} completed</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Platform Revenue</div>
          <div className="text-xl font-black text-purple-700 mt-1">
            {formatCurrency(platformEarnings, language)}
          </div>
          <span className="text-[10px] text-slate-400">{commissionRate}% commission cut</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Active Orders</div>
          <div className="text-xl font-black text-amber-600 mt-1">{activeOrdersCount}</div>
          <span className="text-[10px] text-slate-500">Live in fulfillment</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Registered Shops</div>
          <div className="text-xl font-black text-emerald-800 mt-1">{shops.length}</div>
          <span className="text-[10px] text-emerald-600 font-semibold">{shops.filter(s => s.isVerified).length} verified</span>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 no-scrollbar">
        {[
          { id: 'overview', label: 'Overview', icon: TrendingUp },
          { id: 'geofence', label: `${t.serviceAreas} (${serviceAreas.length})`, icon: MapPin },
          { id: 'shops', label: `${t.shopManagement} (${shops.length})`, icon: Store },
          { id: 'coupons', label: `${t.couponManagement} (${coupons.length})`, icon: Tag },
          { id: 'orders', label: `Orders Monitor (${orders.length})`, icon: Package },
          { id: 'settings', label: t.businessSettings, icon: Sliders },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. Geo-fencing & Delivery Areas Tab */}
      {activeTab === 'geofence' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">{t.serviceAreas}</h3>
              <p className="text-xs text-slate-500">
                Define geographic operational zones, delivery fees, and unions/wards.
              </p>
            </div>
            <button
              onClick={() => setIsAddAreaOpen(true)}
              className="px-3.5 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addArea}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {serviceAreas.map(area => (
              <div
                key={area.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-black text-sm text-slate-900">{area.nameEn}</h4>
                    <p className="text-xs text-slate-500">{area.nameBn}</p>
                  </div>
                  <button
                    onClick={() => updateServiceArea({ ...area, isActive: !area.isActive })}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      area.isActive
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {area.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </button>
                </div>

                <div className="space-y-1 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl">
                  <div className="flex justify-between">
                    <span>Delivery Fee:</span>
                    <span className="font-bold text-slate-900">৳{area.deliveryCharge}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Est. Delivery Time:</span>
                    <span className="font-bold text-slate-900">~{area.estimatedDeliveryMin} mins</span>
                  </div>
                  <div className="pt-1 text-[11px] text-slate-400">
                    Wards: {area.wards.join(', ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Shop Verifications Tab */}
      {activeTab === 'shops' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm">{t.shopManagement}</h3>
            <span className="text-xs text-slate-500">Verified shop list and status</span>
          </div>

          <div className="space-y-3">
            {shops.map(shop => (
              <div
                key={shop.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img src={shop.image} alt={shop.nameEn} className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-sm text-slate-900">{shop.nameEn}</h4>
                      {shop.isVerified && (
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{shop.addressEn} • {shop.phone}</p>
                    <span className="text-[10px] text-slate-400">Owner: {shop.ownerName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-xl ${
                    shop.isOpen ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {shop.isOpen ? 'Open' : 'Closed'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Promotional Coupons Tab */}
      {activeTab === 'coupons' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">{t.couponManagement}</h3>
              <p className="text-xs text-slate-500">Create discount promo codes for customer acquisition</p>
            </div>
            <button
              onClick={() => setIsAddCouponOpen(true)}
              className="px-3.5 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Coupon</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {coupons.map(coupon => (
              <div
                key={coupon.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                    {coupon.code}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {coupon.isActive ? 'ACTIVE' : 'EXPIRED'}
                  </span>
                </div>

                <p className="text-xs text-slate-700">{coupon.descriptionEn}</p>
                <div className="text-[11px] text-slate-400">
                  Discount: <span className="font-bold text-slate-900">
                    {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `৳${coupon.discountValue}`}
                  </span> • Min Order: ৳{coupon.minOrderAmount}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Orders Live Monitor */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm">System Orders Oversight</h3>
            <span className="text-xs text-slate-500">{orders.length} total recorded</span>
          </div>

          <div className="space-y-3">
            {orders.map(order => (
              <div
                key={order.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{order.orderNumber}</span>
                    <span className="font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                      {getOrderStatusLabel(order.orderStatus, language)}
                    </span>
                  </div>
                  <p className="text-slate-500 mt-0.5">
                    {order.customerName} → {order.shopName} ({order.deliveryAddress.areaName})
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-black text-slate-900 text-sm">
                      {formatCurrency(order.totalAmount, language)}
                    </div>
                    <div className="text-[10px] text-emerald-700 font-semibold">COD</div>
                  </div>

                  <select
                    value={order.orderStatus}
                    onChange={e => updateOrderStatus(order.id, e.target.value as any, 'Status modified by admin')}
                    className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                  >
                    <option value="order_placed">Order Placed</option>
                    <option value="seller_confirmed">Confirmed</option>
                    <option value="preparing">Preparing</option>
                    <option value="rider_assigned">Rider Assigned</option>
                    <option value="picked_up">Picked Up</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Business Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-4 max-w-xl">
          {/* Logo & Brand Identity Setting Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <Palette className="w-4 h-4 text-purple-700" />
                  <span>{language === 'bn' ? 'লগো ও ব্র্যান্ড আইডেন্টিটি' : 'App Logo & Brand Identity'}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {language === 'bn' ? 'অ্যাপের লগো, ব্র্যান্ড নাম এবং ট্যাগলাইন পরিবর্তন করুন' : 'Manage app logo icon, brand name, and custom image asset'}
                </p>
              </div>

              <button
                id="admin-change-logo-btn"
                onClick={() => setIsLogoModalOpen(true)}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'লগো চেঞ্জ করুন' : 'Change Logo'}</span>
              </button>
            </div>

            {/* Current Active Logo Preview */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <Logo size="lg" />
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Preset</span>
                <span className="text-xs font-black text-purple-700 uppercase">{logoConfig.preset}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm">{t.businessSettings}</h3>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Seller Commission Percentage (%)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={commissionRate}
                  onChange={e => setCommissionRate(Number(e.target.value))}
                  className="w-32 p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
                <span className="text-xs text-slate-500 self-center">
                  Deducted automatically from seller COD payouts
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <button
                onClick={() => showToast('Settings updated successfully', 'success')}
                className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Service Area Modal */}
      {isAddAreaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">Add New Delivery Area</h3>
              <button onClick={() => setIsAddAreaOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateArea} className="p-5 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Area Name (English)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Uttara Sector 1-14"
                  value={newAreaNameEn}
                  onChange={e => setNewAreaNameEn(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Area Name (বাংলা)</label>
                <input
                  type="text"
                  placeholder="যেমন: উত্তরা ১-১৪ সেক্টর"
                  value={newAreaNameBn}
                  onChange={e => setNewAreaNameBn(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Delivery Charge (৳)</label>
                  <input
                    type="number"
                    value={newAreaCharge}
                    onChange={e => setNewAreaCharge(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Est. Delivery (Mins)</label>
                  <input
                    type="number"
                    value={newAreaEstMin}
                    onChange={e => setNewAreaEstMin(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Unions / Sectors (comma-separated)</label>
                <input
                  type="text"
                  value={newAreaUnions}
                  onChange={e => setNewAreaUnions(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Wards (comma-separated)</label>
                <input
                  type="text"
                  value={newAreaWards}
                  onChange={e => setNewAreaWards(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsAddAreaOpen(false)} className="px-3 py-1.5 text-slate-500">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 bg-purple-700 text-white font-bold rounded-xl">
                  Create Area
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Coupon Modal */}
      {isAddCouponOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">Create Promo Coupon</h3>
              <button onClick={() => setIsAddCouponOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="p-5 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MONSOON20"
                  value={newCouponCode}
                  onChange={e => setNewCouponCode(e.target.value.toUpperCase())}
                  className="w-full p-2 uppercase bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Discount Type</label>
                  <select
                    value={newCouponType}
                    onChange={e => setNewCouponType(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (৳)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Discount Value</label>
                  <input
                    type="number"
                    value={newCouponValue}
                    onChange={e => setNewCouponValue(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Min Order Amount (৳)</label>
                <input
                  type="number"
                  value={newCouponMinOrder}
                  onChange={e => setNewCouponMinOrder(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsAddCouponOpen(false)} className="px-3 py-1.5 text-slate-500">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 bg-purple-700 text-white font-bold rounded-xl">
                  Create Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Logo Customizer Modal */}
      <LogoModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
      />
    </div>
  );
};
