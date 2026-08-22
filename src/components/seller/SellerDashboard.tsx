import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations, formatCurrency, getOrderStatusLabel } from '../../utils/translations';
import { Product, ProductCategory, Order, OrderStatus } from '../../types';
import { INITIAL_CATEGORIES } from '../../data/mockData';
import {
  Store,
  Plus,
  Package,
  CheckCircle,
  Clock,
  Banknote,
  Star,
  Settings,
  Edit2,
  Trash2,
  Phone,
  Bike,
  AlertCircle,
  X,
  Check,
  TrendingUp,
  Tag,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

export const SellerDashboard: React.FC = () => {
  const {
    currentUser,
    shops,
    products,
    orders,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    toggleShopStatus,
    commissionRate,
    language,
    showToast,
  } = useApp();

  const t = translations[language];

  // Find current seller's shop
  const currentShop = shops.find(s => s.ownerId === currentUser.id) || shops[0];
  const shopProducts = products.filter(p => p.shopId === currentShop.id);
  const shopOrders = orders.filter(o => o.shopId === currentShop.id);

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'earnings' | 'settings'>('orders');
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New product form state
  const [newProdNameEn, setNewProdNameEn] = useState('');
  const [newProdNameBn, setNewProdNameBn] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<ProductCategory>('grocery');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdDiscountPrice, setNewProdDiscountPrice] = useState('');
  const [newProdStock, setNewProdStock] = useState('20');
  const [newProdUnit, setNewProdUnit] = useState('1 kg');
  const [newProdImage, setNewProdImage] = useState('https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60');
  const [newProdDescEn, setNewProdDescEn] = useState('');
  const [newProdDescBn, setNewProdDescBn] = useState('');

  // Financial calculations
  const totalSales = shopOrders
    .filter(o => o.orderStatus === 'delivered')
    .reduce((sum, o) => sum + o.subtotal, 0);
  const totalCommission = (totalSales * commissionRate) / 100;
  const netEarnings = totalSales - totalCommission;

  const pendingOrders = shopOrders.filter(
    o => o.orderStatus === 'order_placed' || o.orderStatus === 'seller_confirmed' || o.orderStatus === 'preparing'
  );

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdNameEn || !newProdPrice) return;

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        nameEn: newProdNameEn,
        nameBn: newProdNameBn || newProdNameEn,
        category: newProdCategory,
        price: Number(newProdPrice),
        discountPrice: newProdDiscountPrice ? Number(newProdDiscountPrice) : undefined,
        stock: Number(newProdStock),
        unit: newProdUnit,
        images: [newProdImage],
        descriptionEn: newProdDescEn,
        descriptionBn: newProdDescBn,
        inStock: Number(newProdStock) > 0,
      });
      showToast('Product updated successfully', 'success');
    } else {
      addProduct({
        nameEn: newProdNameEn,
        nameBn: newProdNameBn || newProdNameEn,
        descriptionEn: newProdDescEn || 'Fresh and genuine product from local store.',
        descriptionBn: newProdDescBn || 'স্থানীয় দোকান থেকে তাজা ও খাঁটি পণ্য।',
        category: newProdCategory,
        price: Number(newProdPrice),
        discountPrice: newProdDiscountPrice ? Number(newProdDiscountPrice) : undefined,
        stock: Number(newProdStock),
        unit: newProdUnit,
        images: [newProdImage],
        shopId: currentShop.id,
        shopName: language === 'bn' ? currentShop.nameBn : currentShop.nameEn,
        rating: 5.0,
        totalReviews: 0,
        inStock: true,
      });
      showToast('New product added to catalog', 'success');
    }

    setIsAddProductModalOpen(false);
    setEditingProduct(null);
    resetForm();
  };

  const resetForm = () => {
    setNewProdNameEn('');
    setNewProdNameBn('');
    setNewProdPrice('');
    setNewProdDiscountPrice('');
    setNewProdStock('20');
    setNewProdUnit('1 kg');
    setNewProdDescEn('');
    setNewProdDescBn('');
  };

  const handleEditClick = (p: Product) => {
    setEditingProduct(p);
    setNewProdNameEn(p.nameEn);
    setNewProdNameBn(p.nameBn);
    setNewProdCategory(p.category);
    setNewProdPrice(String(p.price));
    setNewProdDiscountPrice(p.discountPrice ? String(p.discountPrice) : '');
    setNewProdStock(String(p.stock));
    setNewProdUnit(p.unit);
    setNewProdImage(p.images[0]);
    setNewProdDescEn(p.descriptionEn);
    setNewProdDescBn(p.descriptionBn);
    setIsAddProductModalOpen(true);
  };

  return (
    <div id="seller-dashboard" className="space-y-6 pb-20 md:pb-8 animate-in fade-in max-w-5xl mx-auto">
      {/* Top Shop Banner & Status */}
      <div className="bg-gradient-to-r from-amber-800 via-amber-900 to-slate-900 text-white p-5 sm:p-6 rounded-3xl shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/20 border-2 border-white/40 shrink-0">
              <img src={currentShop.image} alt="shop" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black">
                  {language === 'bn' ? currentShop.nameBn : currentShop.nameEn}
                </h2>
                {currentShop.isVerified && (
                  <span className="text-[10px] bg-emerald-500 text-emerald-950 font-bold px-2 py-0.5 rounded-full">
                    VERIFIED
                  </span>
                )}
              </div>
              <p className="text-xs text-amber-200 mt-0.5">
                {language === 'bn' ? currentShop.addressBn : currentShop.addressEn}
              </p>
              <div className="flex items-center gap-3 text-xs text-amber-100/90 mt-2">
                <span className="flex items-center gap-1 font-bold text-amber-300">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {currentShop.rating} ({currentShop.totalReviews})
                </span>
                <span>•</span>
                <span>Min Order: ৳{currentShop.minOrder}</span>
              </div>
            </div>
          </div>

          {/* Open/Close Store Toggle */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15">
            <div>
              <div className="text-[11px] uppercase font-bold text-amber-200">
                {t.shopStatus}
              </div>
              <div className="text-xs font-black">
                {currentShop.isOpen ? (
                  <span className="text-emerald-300">🟢 {t.openAccepting}</span>
                ) : (
                  <span className="text-rose-300">🔴 {t.closed}</span>
                )}
              </div>
            </div>
            <button
              id="toggle-shop-open-btn"
              onClick={() => toggleShopStatus(currentShop.id)}
              className="p-1 rounded-xl hover:bg-white/20 transition-colors"
            >
              {currentShop.isOpen ? (
                <ToggleRight className="w-8 h-8 text-emerald-400" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-slate-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">{t.activeOrders}</div>
          <div className="text-xl font-black text-amber-600 mt-1">{pendingOrders.length}</div>
          <span className="text-[10px] text-slate-500">Requires processing</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">{t.totalProducts}</div>
          <div className="text-xl font-black text-slate-900 mt-1">{shopProducts.length}</div>
          <span className="text-[10px] text-emerald-600 font-semibold">{shopProducts.filter(p => p.inStock).length} in stock</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">{t.totalSales}</div>
          <div className="text-xl font-black text-emerald-800 mt-1">
            {formatCurrency(totalSales, language)}
          </div>
          <span className="text-[10px] text-slate-500">{shopOrders.filter(o => o.orderStatus === 'delivered').length} delivered</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">{t.netEarnings}</div>
          <div className="text-xl font-black text-slate-900 mt-1">
            {formatCurrency(netEarnings, language)}
          </div>
          <span className="text-[10px] text-slate-400">After {commissionRate}% commission</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'orders', label: `${t.incomingOrders} (${pendingOrders.length})`, icon: Package },
          { id: 'products', label: `${t.productManagement} (${shopProducts.length})`, icon: Tag },
          { id: 'earnings', label: t.earningsOverview, icon: TrendingUp },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`seller-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Orders Processing */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm">{t.incomingOrders}</h3>
            <span className="text-xs text-slate-500">Live order fulfillment queue</span>
          </div>

          {shopOrders.length === 0 ? (
            <div className="py-12 bg-white rounded-3xl border border-slate-200 text-center text-slate-400 space-y-2">
              <Package className="w-10 h-10 mx-auto stroke-1" />
              <p className="text-sm font-semibold">No orders received yet</p>
              <p className="text-xs">Incoming orders from local customers will alert here immediately.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {shopOrders.map(order => (
                <div
                  key={order.id}
                  id={`seller-order-${order.id}`}
                  className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900">
                          {order.orderNumber}
                        </span>
                        <span className="text-xs bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-md">
                          {order.placedAt}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Customer: <span className="font-bold text-slate-800">{order.customerName}</span> ({order.customerPhone})
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black text-emerald-800">
                        {formatCurrency(order.totalAmount, language)}
                      </span>
                      <div className="text-[10px] text-slate-400">Cash on Delivery (COD)</div>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="space-y-1.5 bg-slate-50 p-3 rounded-2xl text-xs">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Order Items:
                    </div>
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex items-center justify-between text-slate-700">
                        <span>
                          <span className="font-bold text-slate-900">{it.quantity}x</span> {it.productName} ({it.unit})
                        </span>
                        <span className="font-semibold text-slate-900">
                          {formatCurrency(it.price * it.quantity, language)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Order Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    <div className="text-xs">
                      <span className="text-slate-400">Current Status: </span>
                      <span className="font-extrabold text-amber-700 capitalize">
                        {getOrderStatusLabel(order.orderStatus, language)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {order.orderStatus === 'order_placed' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'seller_confirmed', 'Seller accepted order')}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{t.acceptOrder}</span>
                        </button>
                      )}

                      {order.orderStatus === 'seller_confirmed' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'preparing', 'Items being packed')}
                          className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>{t.markPreparing}</span>
                        </button>
                      )}

                      {order.orderStatus === 'preparing' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'rider_assigned', 'Ready for pickup')}
                          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1"
                        >
                          <Bike className="w-3.5 h-3.5" />
                          <span>{t.readyForPickup}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Products Catalog */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">{t.productManagement}</h3>
              <p className="text-xs text-slate-500">Manage catalog inventory, units, and pricing</p>
            </div>
            <button
              id="open-add-product-modal-btn"
              onClick={() => {
                resetForm();
                setEditingProduct(null);
                setIsAddProductModalOpen(true);
              }}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addNewProduct}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {shopProducts.map(prod => (
              <div
                key={prod.id}
                id={`seller-prod-card-${prod.id}`}
                className="bg-white p-3.5 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-xs space-y-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                    <img src={prod.images[0]} alt="prod" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {language === 'bn' ? prod.nameBn : prod.nameEn}
                    </h4>
                    <p className="text-[11px] text-slate-400 capitalize">{prod.category} • {prod.unit}</p>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="text-xs font-black text-emerald-900">
                        {formatCurrency(prod.discountPrice || prod.price, language)}
                      </span>
                      {prod.discountPrice && (
                        <span className="text-[10px] text-slate-400 line-through">
                          ৳{prod.price}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <button
                    onClick={() => updateProduct({ ...prod, inStock: !prod.inStock })}
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                      prod.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {prod.inStock ? 'In Stock' : 'Out of Stock'}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditClick(prod)}
                      className="p-1.5 text-slate-500 hover:text-amber-700 rounded-lg hover:bg-slate-100"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteProduct(prod.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Earnings Breakdown */}
      {activeTab === 'earnings' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm">{t.earningsOverview}</h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-600">Gross Delivered Sales</span>
                <span className="font-bold text-slate-900">{formatCurrency(totalSales, language)}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl text-amber-900">
                <span>Platform Commission ({commissionRate}%)</span>
                <span className="font-bold">-{formatCurrency(totalCommission, language)}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl text-emerald-950 text-sm font-black">
                <span>Net Seller Payout (COD Settlement)</span>
                <span className="text-lg">{formatCurrency(netEarnings, language)}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
              <Banknote className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                COD cash collected by riders is automatically settled weekly via bKash/Bank transfer.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-base">
                {editingProduct ? 'Edit Product' : t.addNewProduct}
              </h3>
              <button
                onClick={() => setIsAddProductModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-5 overflow-y-auto flex-1 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Name (English)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fresh Mustard Oil"
                    value={newProdNameEn}
                    onChange={e => setNewProdNameEn(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Name (বাংলা)</label>
                  <input
                    type="text"
                    placeholder="যেমন: খাঁটি সরিষার তেল"
                    value={newProdNameBn}
                    onChange={e => setNewProdNameBn(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newProdCategory}
                    onChange={e => setNewProdCategory(e.target.value as ProductCategory)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    {INITIAL_CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.nameEn}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Unit</label>
                  <input
                    type="text"
                    placeholder="e.g. 1 kg, 500g, 1 plate, 1 pack"
                    value={newProdUnit}
                    onChange={e => setNewProdUnit(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Price (৳)</label>
                  <input
                    type="number"
                    required
                    placeholder="250"
                    value={newProdPrice}
                    onChange={e => setNewProdPrice(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Discount Price (৳)</label>
                  <input
                    type="number"
                    placeholder="Optional"
                    value={newProdDiscountPrice}
                    onChange={e => setNewProdDiscountPrice(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Stock Qty</label>
                  <input
                    type="number"
                    value={newProdStock}
                    onChange={e => setNewProdStock(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Product Image URL</label>
                <input
                  type="text"
                  value={newProdImage}
                  onChange={e => setNewProdImage(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Description (English)</label>
                <textarea
                  rows={2}
                  value={newProdDescEn}
                  onChange={e => setNewProdDescEn(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductModalOpen(false)}
                  className="px-4 py-2 text-slate-500 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs transition-colors"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
