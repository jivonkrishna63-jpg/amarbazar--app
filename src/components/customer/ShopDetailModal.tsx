import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Shop, Product } from '../../types';
import { translations, formatCurrency } from '../../utils/translations';
import {
  X,
  Store,
  Star,
  Clock,
  MapPin,
  Phone,
  CheckCircle,
  ShoppingBag,
  Heart,
  Plus,
} from 'lucide-react';

interface ShopDetailModalProps {
  shopId: string | null;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const ShopDetailModal: React.FC<ShopDetailModalProps> = ({
  shopId,
  onClose,
  onSelectProduct,
}) => {
  const { shops, products, addToCart, wishlist, toggleWishlist, language } = useApp();
  const t = translations[language];

  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');

  if (!shopId) return null;
  const shop = shops.find(s => s.id === shopId);
  if (!shop) return null;

  const shopProducts = products.filter(p => p.shopId === shopId);

  return (
    <div id="shop-detail-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Banner & Info */}
        <div className="relative h-44 sm:h-52 bg-slate-800">
          <img
            src={shop.bannerImage}
            alt={shop.nameEn}
            className="w-full h-full object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent" />

          {/* Close button */}
          <button
            id="close-shop-modal-btn"
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Shop Avatar & Details */}
          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-white shrink-0">
                <img src={shop.image} alt={shop.nameEn} className="w-full h-full object-cover" />
              </div>
              <div className="text-white">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-base sm:text-lg font-black leading-tight drop-shadow-xs">
                    {language === 'bn' ? shop.nameBn : shop.nameEn}
                  </h2>
                  {shop.isVerified && (
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate-200 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  <span>{language === 'bn' ? shop.addressBn : shop.addressEn}</span>
                </p>
                <div className="flex items-center gap-3 text-[11px] text-slate-300 mt-1">
                  <span className="flex items-center gap-1 bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md font-bold">
                    <Star className="w-3 h-3 fill-amber-400" /> {shop.rating} ({shop.totalReviews})
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" /> {shop.openingHours}
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden sm:block text-right text-white">
              <div className="text-[11px] text-slate-300">{t.minOrder}: ৳{shop.minOrder}</div>
              <div className="text-xs font-bold text-emerald-400">{shop.avgDeliveryTime} Delivery</div>
            </div>
          </div>
        </div>

        {/* Product Catalog list */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">
              {language === 'bn' ? 'দোকানের পণ্যসমূহ' : 'Store Products'} ({shopProducts.length})
            </h3>
            <span className="text-xs text-slate-500">
              COD Supported • Local Pickup & Delivery
            </span>
          </div>

          {shopProducts.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Store className="w-12 h-12 mx-auto text-slate-300 stroke-1" />
              <p className="text-sm font-medium mt-2">No products listed by this store yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {shopProducts.map(prod => {
                const activePrice = prod.discountPrice || prod.price;
                const isWishlisted = wishlist.includes(prod.id);

                return (
                  <div
                    key={prod.id}
                    className="bg-white rounded-2xl border border-slate-200/80 p-2.5 flex flex-col justify-between hover:shadow-md hover:border-emerald-200 transition-all group"
                  >
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 mb-2 cursor-pointer" onClick={() => onSelectProduct(prod)}>
                      <img
                        src={prod.images[0]}
                        alt={prod.nameEn}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {prod.discountPrice && (
                        <span className="absolute top-1.5 left-1.5 bg-rose-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded-md">
                          {Math.round(((prod.price - prod.discountPrice) / prod.price) * 100)}% OFF
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(prod.id);
                        }}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-slate-700 shadow-xs"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                      </button>
                    </div>

                    <div className="space-y-1">
                      <h4
                        onClick={() => onSelectProduct(prod)}
                        className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug cursor-pointer hover:text-emerald-700"
                      >
                        {language === 'bn' ? prod.nameBn : prod.nameEn}
                      </h4>
                      <p className="text-[10px] text-slate-400">{prod.unit}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                      <div>
                        <div className="text-xs font-extrabold text-emerald-900">
                          {formatCurrency(activePrice, language)}
                        </div>
                        {prod.discountPrice && (
                          <div className="text-[10px] text-slate-400 line-through">
                            {formatCurrency(prod.price, language)}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => addToCart(prod, 1)}
                        className="w-7 h-7 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-xs transition-colors"
                        title="Add to cart"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
