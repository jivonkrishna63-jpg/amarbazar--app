import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, ProductReview } from '../../types';
import { translations, formatCurrency } from '../../utils/translations';
import {
  X,
  Star,
  ShoppingBag,
  Store,
  CheckCircle,
  Truck,
  Heart,
  Plus,
  Minus,
  MessageSquare,
  Shield,
  Clock,
  Sparkles,
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onOpenShop?: (shopId: string) => void;
  onBuyNow?: (product: Product, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onOpenShop,
  onBuyNow,
}) => {
  const {
    addToCart,
    wishlist,
    toggleWishlist,
    language,
    currentLocationDetails,
    isServiceAvailableInArea,
  } = useApp();

  const t = translations[language];
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [reviewsList, setReviewsList] = useState<ProductReview[]>([
    {
      id: 'rev-1',
      userId: 'u1',
      userName: 'Tanvir Hossain',
      rating: 5,
      comment: 'Excellent fresh quality! Delivered within 20 minutes.',
      date: 'Yesterday',
    },
    {
      id: 'rev-2',
      userId: 'u2',
      userName: 'Nadia Sultana',
      rating: 5,
      comment: 'Very satisfied with the authentic packaging and price.',
      date: '3 days ago',
    },
  ]);

  if (!product) return null;

  const isWishlisted = wishlist.includes(product.id);
  const activePrice = product.discountPrice || product.price;
  const savings = product.discountPrice ? product.price - product.discountPrice : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNowClick = () => {
    if (onBuyNow) {
      onBuyNow(product, quantity);
    } else {
      addToCart(product, quantity);
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;
    const newRev: ProductReview = {
      id: `rev-${Date.now()}`,
      userId: 'current',
      userName: 'You (Verified Buyer)',
      rating: newReviewRating,
      comment: newReviewText.trim(),
      date: 'Just now',
    };
    setReviewsList(prev => [newRev, ...prev]);
    setNewReviewText('');
  };

  return (
    <div id="product-detail-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              {language === 'bn' ? 'পণ্যের বিবরণ' : 'Product Details'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="product-wishlist-toggle"
              onClick={() => toggleWishlist(product.id)}
              className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
            <button
              id="close-product-modal-btn"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image Gallery */}
            <div className="space-y-3">
              <div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-slate-200/70 relative">
                <img
                  src={product.images[selectedImageIndex] || product.images[0]}
                  alt={product.nameEn}
                  className="w-full h-full object-cover"
                />
                {product.discountPrice && (
                  <span className="absolute top-3 left-3 bg-rose-600 text-white font-bold text-xs px-2.5 py-1 rounded-lg shadow-sm">
                    {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                  </span>
                )}
                {product.isOfferOfTheDay && (
                  <span className="absolute top-3 right-3 bg-amber-500 text-white font-bold text-[11px] px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
                    <Sparkles className="w-3 h-3" /> Offer of the Day
                  </span>
                )}
              </div>

              {product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImageIndex === idx
                          ? 'border-emerald-600 scale-105'
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info & Price */}
            <div className="space-y-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                  {language === 'bn' ? product.nameBn : product.nameEn}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Unit: <span className="font-semibold text-slate-700">{product.unit}</span>
                </p>
              </div>

              {/* Shop Badge */}
              <div
                onClick={() => onOpenShop && onOpenShop(product.shopId)}
                className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">
                      {t.shopInfo}
                    </div>
                    <div className="text-xs font-bold text-slate-800">{product.shopName}</div>
                  </div>
                </div>
                <span className="text-xs text-emerald-700 font-semibold">View Store →</span>
              </div>

              {/* Rating & Stock */}
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{product.rating}</span>
                  <span className="text-slate-400 font-normal">({product.totalReviews} reviews)</span>
                </div>

                {product.inStock ? (
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    {t.inStock} ({product.stock} left)
                  </span>
                ) : (
                  <span className="text-rose-700 font-bold bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                    {t.outOfStock}
                  </span>
                )}
              </div>

              {/* Pricing breakdown */}
              <div className="p-3.5 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-emerald-900">
                    {formatCurrency(activePrice, language)}
                  </span>
                  {product.discountPrice && (
                    <span className="text-sm text-slate-400 line-through">
                      {formatCurrency(product.price, language)}
                    </span>
                  )}
                </div>
                {savings > 0 && (
                  <div className="text-xs font-bold text-emerald-700">
                    🎉 {t.savings}: {formatCurrency(savings, language)}
                  </div>
                )}
                <div className="text-[11px] text-slate-600 flex items-center gap-1.5 pt-1">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Cash on Delivery (COD) available for this item</span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-bold text-slate-700">{t.quantity}:</span>
                <div className="flex items-center gap-3 bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <button
                    id="decrease-qty-btn"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-7 h-7 rounded-lg bg-white shadow-xs text-slate-700 flex items-center justify-center hover:bg-slate-50 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-bold text-sm text-slate-900 w-6 text-center">
                    {quantity}
                  </span>
                  <button
                    id="increase-qty-btn"
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    className="w-7 h-7 rounded-lg bg-white shadow-xs text-slate-700 flex items-center justify-center hover:bg-slate-50 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <h3 className="font-bold text-sm text-slate-900">{t.productDescription}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'bn' ? product.descriptionBn : product.descriptionEn}
            </p>
          </div>

          {/* Reviews Section */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>{t.ratingsAndReviews}</span>
              </h3>
              <span className="text-xs text-slate-500 font-medium">{reviewsList.length} verified ratings</span>
            </div>

            {/* Existing reviews */}
            <div className="space-y-2.5">
              {reviewsList.map(rev => (
                <div key={rev.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-800">{rev.userName}</span>
                    <div className="flex items-center text-amber-500 font-semibold gap-0.5">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{rev.rating}.0</span>
                    </div>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{rev.comment}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">{rev.date}</span>
                </div>
              ))}
            </div>

            {/* Write review form */}
            <form onSubmit={handleAddReview} className="p-3 bg-emerald-50/40 rounded-xl border border-emerald-100 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-950">{t.writeReview}</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReviewRating(star)}
                      className="p-0.5"
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          star <= newReviewRating
                            ? 'text-amber-500 fill-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Share your experience with this item..."
                  value={newReviewText}
                  onChange={e => setNewReviewText(e.target.value)}
                  className="flex-1 text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="text-xs bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center gap-3">
          <button
            id="add-to-cart-modal-btn"
            onClick={handleAddToCart}
            className="flex-1 py-3 px-4 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition-colors border border-emerald-300 shadow-xs"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-700" />
            <span>{t.addToCart}</span>
          </button>

          <button
            id="buy-now-modal-btn"
            onClick={handleBuyNowClick}
            className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all active:scale-98"
          >
            <span>{t.buyNow} ({formatCurrency(activePrice * quantity, language)})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
