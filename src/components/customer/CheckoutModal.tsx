import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations, formatCurrency } from '../../utils/translations';
import { Order, CartItem } from '../../types';
import confetti from 'canvas-confetti';
import {
  X,
  MapPin,
  Phone,
  User,
  Truck,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Banknote,
  CreditCard,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  directBuyItem?: { product: any; quantity: number } | null;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  directBuyItem,
  onOrderSuccess,
}) => {
  const {
    cart,
    currentUser,
    currentLocationDetails,
    serviceAreas,
    appliedCoupon,
    placeOrder,
    language,
    isServiceAvailableInArea,
  } = useApp();

  const t = translations[language];

  // Recipient details
  const [name, setName] = useState(currentUser.name || 'Shanto Mojumdar');
  const [phone, setPhone] = useState(currentUser.phone || '01711223344');
  const [streetAddress, setStreetAddress] = useState(
    currentUser.addresses?.[0]?.streetAddress || 'House 42, Road 2/A, Dhanmondi'
  );
  const [deliveryNote, setDeliveryNote] = useState(
    currentUser.addresses?.[0]?.deliveryNote || 'Ring bell, 3rd Floor'
  );
  const [paymentMethod, setPaymentMethod] = useState<'cash_on_delivery'>('cash_on_delivery');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const currentAreaObj = serviceAreas.find(a => a.id === currentLocationDetails.areaId) || serviceAreas[0];
  const deliveryCharge = currentAreaObj?.deliveryCharge || 35;

  // Calculate items
  const itemsToCheckout: { productId: string; productName: string; price: number; quantity: number; unit: string; image: string; shopId: string; shopName: string }[] = directBuyItem
    ? [
        {
          productId: directBuyItem.product.id,
          productName: language === 'bn' ? directBuyItem.product.nameBn : directBuyItem.product.nameEn,
          price: directBuyItem.product.discountPrice || directBuyItem.product.price,
          quantity: directBuyItem.quantity,
          unit: directBuyItem.product.unit,
          image: directBuyItem.product.images[0],
          shopId: directBuyItem.product.shopId,
          shopName: directBuyItem.product.shopName,
        },
      ]
    : cart.map(item => ({
        productId: item.product.id,
        productName: language === 'bn' ? item.product.nameBn : item.product.nameEn,
        price: item.product.discountPrice || item.product.price,
        quantity: item.quantity,
        unit: item.product.unit,
        image: item.product.images[0],
        shopId: item.product.shopId,
        shopName: item.product.shopName,
      }));

  const subtotal = itemsToCheckout.reduce((sum, item) => sum + item.price * item.quantity, 0);

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

  const totalAmount = Math.max(0, subtotal + deliveryCharge - discount);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isServiceAvailableInArea) {
      alert(t.serviceUnavailable);
      return;
    }

    if (!phone || phone.length < 11) {
      alert('Please provide a valid 11-digit phone number for delivery confirmation.');
      return;
    }

    setIsSubmitting(true);

    try {
      const createdOrder = await placeOrder({
        customerName: name,
        customerPhone: phone,
        deliveryAddress: {
          id: `addr-${Date.now()}`,
          title: 'Delivery Point',
          areaId: currentLocationDetails.areaId,
          areaName: language === 'bn' ? currentAreaObj.nameBn : currentAreaObj.nameEn,
          unionName: currentLocationDetails.union,
          wardNo: currentLocationDetails.ward,
          villageName: currentLocationDetails.village,
          streetAddress,
          deliveryNote,
          isDefault: true,
        },
        items: itemsToCheckout,
        shopId: itemsToCheckout[0]?.shopId || 'shop-1',
        shopName: itemsToCheckout[0]?.shopName || 'Local Shop',
        subtotal,
        deliveryCharge,
        discount,
        couponCode: appliedCoupon?.code,
        totalAmount,
        paymentMethod: 'cash_on_delivery',
        paymentStatus: 'pending',
      });

      // Launch celebration confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        // silent
      }

      setIsSubmitting(false);
      onClose();
      onOrderSuccess(createdOrder);
    } catch (err) {
      setIsSubmitting(false);
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <div id="checkout-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">{t.checkoutTitle}</h3>
              <p className="text-xs text-slate-500">
                {itemsToCheckout.length} {t.items} • Cash on Delivery (COD)
              </p>
            </div>
          </div>
          <button
            id="close-checkout-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handlePlaceOrder} className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Location Area Warning if outside area */}
          {!isServiceAvailableInArea ? (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-rose-800">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-rose-950">Service Area Restriction</h4>
                <p className="text-xs text-rose-800 font-semibold">{t.serviceUnavailable}</p>
                <p className="text-[11px] text-rose-600 mt-1">Please select an active delivery area in the header.</p>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-900">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold">Delivering to: </span>
                  <span>
                    {language === 'bn' ? currentAreaObj.nameBn : currentAreaObj.nameEn} ({currentLocationDetails.union}, Ward {currentLocationDetails.ward})
                  </span>
                </div>
              </div>
              <span className="font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                ~{currentAreaObj.estimatedDeliveryMin} mins
              </span>
            </div>
          )}

          {/* Customer / Recipient Details */}
          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>{t.recipientDetails}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  {t.fullName}
                </label>
                <input
                  id="checkout-name-input"
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  {t.mobileNumber}
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1.5 text-xs font-bold text-slate-400">
                    +88
                  </span>
                  <input
                    id="checkout-phone-input"
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full pl-11 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                {t.houseRoad}
              </label>
              <input
                id="checkout-street-input"
                type="text"
                required
                placeholder="House #, Road #, Building Name, Flat..."
                value={streetAddress}
                onChange={e => setStreetAddress(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                {t.deliveryNotes}
              </label>
              <input
                id="checkout-notes-input"
                type="text"
                placeholder="e.g. Ring bell twice, leave with guard if absent..."
                value={deliveryNote}
                onChange={e => setDeliveryNote(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              {t.paymentMethod}
            </h4>

            {/* Active Cash on Delivery Option */}
            <div className="p-3.5 rounded-2xl border-2 border-emerald-600 bg-emerald-50/50 flex items-start justify-between shadow-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Banknote className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="font-bold text-xs text-slate-900">{t.cashOnDelivery}</h5>
                    <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.2 rounded-full">
                      ACTIVE
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                    {t.cashOnDeliveryDesc}
                  </p>
                </div>
              </div>
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            </div>

            {/* Upcoming Online Payment option preview */}
            <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50 opacity-60 flex items-center justify-between cursor-not-allowed">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-600 flex items-center justify-center shrink-0">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-xs text-slate-700">bKash / Nagad / Cards</h5>
                  <p className="text-[10px] text-slate-500">{t.onlinePaymentUpcoming}</p>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-slate-400 bg-slate-200 px-2 py-0.5 rounded-md">
                Coming Soon
              </span>
            </div>
          </div>

          {/* Items Breakdown summary */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2">
            <h4 className="text-xs font-bold text-slate-800">{t.orderSummary}</h4>
            <div className="max-h-32 overflow-y-auto space-y-1.5 pr-1 text-xs">
              {itemsToCheckout.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-slate-600 py-0.5">
                  <span className="truncate max-w-[240px]">
                    {item.quantity}x {item.productName}
                  </span>
                  <span className="font-semibold text-slate-900">
                    {formatCurrency(item.price * item.quantity, language)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-200 space-y-1 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>{t.subtotal}</span>
                <span>{formatCurrency(subtotal, language)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>{t.deliveryFee}</span>
                <span>{formatCurrency(deliveryCharge, language)}</span>
              </div>
              {discount > 0 && (
                <div className="flex items-center justify-between text-emerald-600 font-semibold">
                  <span>{t.couponDiscount} ({appliedCoupon?.code})</span>
                  <span>-{formatCurrency(discount, language)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm font-black text-slate-900 pt-1.5 border-t border-slate-200">
                <span>{t.totalPayable} (COD)</span>
                <span className="text-emerald-700 text-base">
                  {formatCurrency(totalAmount, language)}
                </span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            id="confirm-place-order-btn"
            type="submit"
            disabled={isSubmitting || !isServiceAvailableInArea}
            className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
              isServiceAvailableInArea
                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25 active:scale-98'
                : 'bg-slate-400 cursor-not-allowed'
            }`}
          >
            <span>{isSubmitting ? 'Processing Order...' : t.placeOrderCOD}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
