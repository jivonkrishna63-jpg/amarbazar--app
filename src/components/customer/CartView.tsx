import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations, formatCurrency } from '../../utils/translations';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Tag,
  ArrowRight,
  Truck,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

interface CartViewProps {
  onStartShopping: () => void;
  onProceedCheckout: () => void;
}

export const CartView: React.FC<CartViewProps> = ({
  onStartShopping,
  onProceedCheckout,
}) => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    appliedCoupon,
    applyCouponCode,
    removeCoupon,
    coupons,
    currentLocationDetails,
    serviceAreas,
    isServiceAvailableInArea,
    language,
  } = useApp();

  const t = translations[language];
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const currentAreaObj = serviceAreas.find(a => a.id === currentLocationDetails.areaId) || serviceAreas[0];
  const deliveryFee = currentAreaObj?.deliveryCharge || 35;

  const subtotal = cart.reduce((sum, item) => {
    const price = item.product.discountPrice || item.product.price;
    return sum + price * item.quantity;
  }, 0);

  let discount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.minOrderAmount) {
    if (appliedCoupon.discountType === 'fixed') {
      discount = appliedCoupon.discountValue;
    } else {
      discount = Math.min(
        (subtotal * appliedCoupon.discountValue) / 100,
        appliedCoupon.maxDiscount || 9999
      );
    }
  }

  const totalPayable = Math.max(0, subtotal + deliveryFee - discount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;

    const result = applyCouponCode(couponInput.trim());
    if (!result.success) {
      setCouponError(result.message);
    } else {
      setCouponInput('');
    }
  };

  if (cart.length === 0) {
    return (
      <div id="empty-cart-view" className="py-16 px-4 text-center max-w-md mx-auto space-y-4 animate-in fade-in">
        <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <ShoppingCart className="w-10 h-10 stroke-1" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">{t.cartEmpty}</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          {t.startShopping}
        </p>
        <button
          id="cart-start-shopping-btn"
          onClick={onStartShopping}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
        >
          Explore Local Market
        </button>
      </div>
    );
  }

  return (
    <div id="cart-view" className="space-y-5 pb-20 md:pb-8 animate-in fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">{t.shoppingCart}</h2>
          <p className="text-xs text-slate-500">
            {cart.length} {t.itemsInCart}
          </p>
        </div>
        <button
          id="clear-cart-btn"
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{t.clearCart}</span>
        </button>
      </div>

      {/* Warning if area is outside delivery zone */}
      {!isServiceAvailableInArea && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-xs text-rose-800">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{t.serviceUnavailable}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Item list (2 cols on lg) */}
        <div className="lg:col-span-2 space-y-3">
          {cart.map(item => {
            const activePrice = item.product.discountPrice || item.product.price;
            const itemTotal = activePrice * item.quantity;

            return (
              <div
                key={item.product.id}
                id={`cart-item-${item.product.id}`}
                className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5"
              >
                <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.nameEn}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                    {language === 'bn' ? item.product.nameBn : item.product.nameEn}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {item.product.shopName} • {item.product.unit}
                  </p>
                  <div className="text-xs font-black text-emerald-900 mt-1">
                    {formatCurrency(activePrice, language)}
                  </div>
                </div>

                {/* Quantity adjustments */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                      className="w-6 h-6 rounded-lg bg-white shadow-xs text-slate-700 flex items-center justify-center hover:bg-slate-50 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-lg bg-white shadow-xs text-slate-700 flex items-center justify-center hover:bg-slate-50 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary & Coupons (1 col on lg) */}
        <div className="space-y-4">
          {/* Apply Coupon Box */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.applyCoupon}</span>
            </h4>

            {appliedCoupon ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{appliedCoupon.code} ({t.applied})</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    {language === 'bn' ? appliedCoupon.descriptionBn : appliedCoupon.descriptionEn}
                  </p>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs font-bold text-rose-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    id="coupon-input-field"
                    type="text"
                    placeholder="e.g. WELCOME50, FREEDEL"
                    value={couponInput}
                    onChange={e => setCouponInput(e.target.value.toUpperCase())}
                    className="flex-1 px-3 py-1.5 text-xs uppercase bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <button
                    id="apply-coupon-btn"
                    type="submit"
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                  >
                    {t.apply}
                  </button>
                </div>
                {couponError && (
                  <p className="text-[11px] text-rose-600 font-medium">{couponError}</p>
                )}

                {/* Available coupon chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {coupons.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCouponInput(c.code)}
                      className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md hover:bg-emerald-100 transition-colors"
                    >
                      {c.code}
                    </button>
                  ))}
                </div>
              </form>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-800">{t.orderSummary}</h4>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>{t.subtotal}</span>
                <span className="font-semibold text-slate-900">
                  {formatCurrency(subtotal, language)}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>{t.deliveryFee}</span>
                <span className="font-semibold text-slate-900">
                  {formatCurrency(deliveryFee, language)}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex items-center justify-between text-emerald-600 font-semibold">
                  <span>{t.couponDiscount}</span>
                  <span>-{formatCurrency(discount, language)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-100">
                <span>{t.totalPayable}</span>
                <span className="text-emerald-700 text-base">
                  {formatCurrency(totalPayable, language)}
                </span>
              </div>
            </div>

            {/* Cash on Delivery Note */}
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-600 flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t.codAvailable}</span>
            </div>

            {/* Checkout Button */}
            <button
              id="proceed-checkout-btn"
              onClick={onProceedCheckout}
              disabled={!isServiceAvailableInArea}
              className={`w-full py-3 px-4 rounded-2xl font-bold text-xs text-white shadow-md transition-all flex items-center justify-center gap-2 ${
                isServiceAvailableInArea
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25 active:scale-98'
                  : 'bg-slate-400 cursor-not-allowed'
              }`}
            >
              <span>{t.proceedToCheckout}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
