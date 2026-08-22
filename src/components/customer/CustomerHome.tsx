import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { translations, formatCurrency, getCategoryName } from '../../utils/translations';
import { ProductCategory, Product, Shop } from '../../types';
import { INITIAL_CATEGORIES } from '../../data/mockData';
import {
  Search,
  MapPin,
  Sparkles,
  Flame,
  Clock,
  Star,
  Plus,
  Heart,
  ChevronRight,
  Store,
  Truck,
  ShieldCheck,
  Tag,
  AlertTriangle,
  ArrowRight,
  ShoppingBag,
  HeartPulse,
  Utensils,
  Apple,
  Shirt,
  Smartphone,
  Home as HomeIcon,
} from 'lucide-react';

interface CustomerHomeProps {
  onSelectProduct: (product: Product) => void;
  onSelectShop: (shopId: string) => void;
  onSelectCategory: (category: ProductCategory) => void;
  onOpenLocationModal: () => void;
  onQuickBuyNow: (product: Product, quantity: number) => void;
}

export const CustomerHome: React.FC<CustomerHomeProps> = ({
  onSelectProduct,
  onSelectShop,
  onSelectCategory,
  onOpenLocationModal,
  onQuickBuyNow,
}) => {
  const {
    products,
    shops,
    banners,
    addToCart,
    wishlist,
    toggleWishlist,
    currentLocationDetails,
    serviceAreas,
    isServiceAvailableInArea,
    language,
    searchQuery,
    setSearchQuery,
  } = useApp();

  const t = translations[language];

  // Banner carousel state
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);

  // Flash deals countdown timer simulation
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 22, seconds: 48 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 5, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto rotate banners
  useEffect(() => {
    if (banners.length <= 1) return;
    const bannerInterval = setInterval(() => {
      setActiveBannerIdx(i => (i + 1) % banners.length);
    }, 4500);
    return () => clearInterval(bannerInterval);
  }, [banners.length]);

  const currentAreaObj = serviceAreas.find(a => a.id === currentLocationDetails.areaId);

  // Category Icon map helper
  const getCategoryIcon = (id: ProductCategory) => {
    switch (id) {
      case 'grocery': return <ShoppingBag className="w-5 h-5" />;
      case 'food': return <Utensils className="w-5 h-5" />;
      case 'pharmacy': return <HeartPulse className="w-5 h-5" />;
      case 'vegetables_fruits': return <Apple className="w-5 h-5" />;
      case 'clothing': return <Shirt className="w-5 h-5" />;
      case 'electronics': return <Smartphone className="w-5 h-5" />;
      case 'home_kitchen': return <HomeIcon className="w-5 h-5" />;
      case 'cosmetics': return <Sparkles className="w-5 h-5" />;
      case 'local_shops': return <Store className="w-5 h-5" />;
      default: return <Tag className="w-5 h-5" />;
    }
  };

  // Filtered products if search query is active
  const filteredProducts = searchQuery.trim()
    ? products.filter(p =>
        p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.nameBn.includes(searchQuery) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : products;

  const popularProducts = products.filter(p => p.rating >= 4.8).slice(0, 6);
  const flashOfferProducts = products.filter(p => p.discountPrice || p.isOfferOfTheDay).slice(0, 6);
  const recommendedProducts = products.slice(2, 6);

  return (
    <div id="customer-home-view" className="space-y-6 pb-20 md:pb-8 animate-in fade-in duration-200">
      {/* 1. Search Bar & Location Header Section */}
      <div className="bg-gradient-to-b from-emerald-800 to-teal-900 text-white pt-4 pb-8 px-4 sm:px-6 -mx-4 sm:-mx-6 rounded-b-3xl shadow-md">
        <div className="max-w-4xl mx-auto space-y-3.5">
          {/* Tagline */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
                {language === 'bn' ? 'আপনার লোকাল এলাকার সবকিছু' : 'Everything In Your Local Area'}
              </h2>
              <p className="text-xs text-emerald-200 mt-0.5">
                {t.taglineSubtitle}
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-100 border border-white/10">
              <Truck className="w-4 h-4 text-emerald-300" />
              <span>COD Guaranteed</span>
            </div>
          </div>

          {/* Search Input Box */}
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              id="home-main-search-input"
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white text-slate-900 text-sm font-medium rounded-2xl shadow-lg focus:outline-none focus:ring-3 focus:ring-emerald-400 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-600 px-2 py-1 rounded-lg"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Search Tags */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 text-xs">
            <span className="text-emerald-300 font-semibold shrink-0">Popular:</span>
            {['Kacchi Biryani', 'Nazirshail Rice', 'Napa Extend', 'Mustard Oil', 'Power Bank', 'Panjabi'].map((tag, i) => (
              <button
                key={i}
                onClick={() => setSearchQuery(tag)}
                className="bg-white/15 hover:bg-white/25 text-white text-[11px] px-2.5 py-1 rounded-full whitespace-nowrap transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Service Area Restriction Alert (if inactive) */}
      {!isServiceAvailableInArea && (
        <div id="home-service-unavailable-banner" className="p-4 bg-rose-50 border-2 border-rose-300 rounded-3xl flex items-start justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-900">
                Delivery Location Notice
              </h3>
              <p className="text-sm font-black text-rose-800 mt-0.5">
                {t.serviceUnavailable}
              </p>
              <p className="text-xs text-rose-700 mt-0.5">
                We are currently expanding to your union/ward. Please switch to an active delivery area to place orders.
              </p>
            </div>
          </div>
          <button
            id="change-area-alert-btn"
            onClick={onOpenLocationModal}
            className="text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-2 rounded-xl shadow-xs shrink-0"
          >
            {t.changeLocation}
          </button>
        </div>
      )}

      {/* If search is active, show matching results view */}
      {searchQuery.trim() ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Search results for "{searchQuery}" ({filteredProducts.length})
            </h3>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-emerald-700 font-bold hover:underline"
            >
              Reset Search
            </button>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 text-slate-400 bg-slate-50 rounded-3xl border border-slate-200">
              <Search className="w-12 h-12 mx-auto text-slate-300 stroke-1" />
              <p className="text-sm font-semibold mt-2">No matching products or shops found</p>
              <p className="text-xs mt-1">Try checking for spelling or search general categories.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
              {filteredProducts.map(prod => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  language={language}
                  isWishlisted={wishlist.includes(prod.id)}
                  onSelect={onSelectProduct}
                  onAddToCart={addToCart}
                  onToggleWishlist={toggleWishlist}
                  onBuyNow={onQuickBuyNow}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* 3. Promotional Banners Carousel */}
          {banners.length > 0 && (
            <div className="relative rounded-3xl overflow-hidden shadow-md">
              {banners.map((banner, index) => {
                const isActive = activeBannerIdx === index;
                if (!isActive) return null;

                return (
                  <div
                    key={banner.id}
                    className={`relative h-44 sm:h-52 bg-gradient-to-r ${banner.bgGradient} text-white flex items-center p-6 sm:p-8 transition-all`}
                  >
                    <div className="relative z-10 max-w-sm space-y-2">
                      <span className="bg-white/20 backdrop-blur-md text-white text-[11px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {language === 'bn' ? banner.badgeBn : banner.badgeEn}
                      </span>
                      <h3 className="text-lg sm:text-2xl font-black leading-tight drop-shadow-xs">
                        {language === 'bn' ? banner.titleBn : banner.titleEn}
                      </h3>
                      <p className="text-xs text-white/90 line-clamp-2">
                        {language === 'bn' ? banner.subtitleBn : banner.subtitleEn}
                      </p>
                      <button
                        onClick={() => banner.targetCategory && onSelectCategory(banner.targetCategory)}
                        className="text-xs font-bold bg-white text-slate-900 hover:bg-emerald-50 px-4 py-2 rounded-xl shadow-md transition-all flex items-center gap-1.5 mt-2"
                      >
                        <span>Shop Now</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <img
                      src={banner.imageUrl}
                      alt={banner.titleEn}
                      className="absolute right-0 top-0 bottom-0 w-1/2 object-cover mask-gradient-left opacity-90 hidden sm:block"
                    />
                  </div>
                );
              })}

              {/* Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                {banners.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveBannerIdx(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      activeBannerIdx === i ? 'w-5 bg-white' : 'w-1.5 bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 4. Categories Grid (9 Core Categories) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>{t.allCategories}</span>
              </h3>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-2.5">
              {INITIAL_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  id={`cat-card-${cat.id}`}
                  onClick={() => onSelectCategory(cat.id)}
                  className="bg-white hover:bg-emerald-50/60 p-3 rounded-2xl border border-slate-200/80 hover:border-emerald-300 flex flex-col items-center justify-center text-center gap-2 group transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                >
                  <div
                    className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${cat.bgGradient} text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform duration-200`}
                  >
                    {getCategoryIcon(cat.id)}
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 group-hover:text-emerald-800 line-clamp-2 leading-tight">
                    {language === 'bn' ? cat.nameBn : cat.nameEn}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 5. Today's Flash Offers & Deals */}
          <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-red-500/10 p-4 sm:p-5 rounded-3xl border border-amber-200 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                  <Flame className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {t.todaysOffers}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-amber-900 font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{t.endsIn}:</span>
                    <span className="font-mono bg-amber-200/80 px-1.5 py-0.5 rounded text-amber-950 font-bold">
                      {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {flashOfferProducts.map(prod => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  language={language}
                  isWishlisted={wishlist.includes(prod.id)}
                  onSelect={onSelectProduct}
                  onAddToCart={addToCart}
                  onToggleWishlist={toggleWishlist}
                  onBuyNow={onQuickBuyNow}
                />
              ))}
            </div>
          </div>

          {/* 6. Popular Local Shops */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Store className="w-4 h-4 text-emerald-600" />
                <h3 className="text-base font-black text-slate-900">
                  {t.popularShops}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {shops.map(shop => (
                <div
                  key={shop.id}
                  id={`shop-card-${shop.id}`}
                  onClick={() => onSelectShop(shop.id)}
                  className="bg-white p-3.5 rounded-2xl border border-slate-200/80 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer flex items-center gap-3.5 group"
                >
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    <img
                      src={shop.image}
                      alt={shop.nameEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate group-hover:text-emerald-700">
                        {language === 'bn' ? shop.nameBn : shop.nameEn}
                      </h4>
                    </div>

                    <p className="text-[11px] text-slate-500 truncate">
                      {language === 'bn' ? shop.addressBn : shop.addressEn}
                    </p>

                    <div className="flex items-center gap-2.5 text-[11px] mt-1.5">
                      <span className="flex items-center gap-0.5 font-bold text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded-md">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {shop.rating}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-600 font-medium">{shop.avgDeliveryTime}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-emerald-700 font-semibold">Min ৳{shop.minOrder}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 7. Popular in Your Area */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">
                {t.popularProducts}
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {popularProducts.map(prod => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  language={language}
                  isWishlisted={wishlist.includes(prod.id)}
                  onSelect={onSelectProduct}
                  onAddToCart={addToCart}
                  onToggleWishlist={toggleWishlist}
                  onBuyNow={onQuickBuyNow}
                />
              ))}
            </div>
          </div>

          {/* 8. Recommended For You */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">
                {t.recommendedForYou}
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {recommendedProducts.map(prod => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  language={language}
                  isWishlisted={wishlist.includes(prod.id)}
                  onSelect={onSelectProduct}
                  onAddToCart={addToCart}
                  onToggleWishlist={toggleWishlist}
                  onBuyNow={onQuickBuyNow}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Reusable Product Card Component
interface ProductCardProps {
  product: Product;
  language: 'en' | 'bn';
  isWishlisted: boolean;
  onSelect: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  onToggleWishlist: (id: string) => void;
  onBuyNow?: (p: Product, q: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  language,
  isWishlisted,
  onSelect,
  onAddToCart,
  onToggleWishlist,
}) => {
  const activePrice = product.discountPrice || product.price;

  return (
    <div
      id={`product-card-${product.id}`}
      className="bg-white rounded-2xl border border-slate-200/80 p-2.5 flex flex-col justify-between hover:shadow-md hover:border-emerald-300 transition-all group"
    >
      {/* Image & Badges */}
      <div
        className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 mb-2 cursor-pointer"
        onClick={() => onSelect(product)}
      >
        <img
          src={product.images[0]}
          alt={product.nameEn}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {product.discountPrice && (
          <span className="absolute top-1.5 left-1.5 bg-rose-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded-md shadow-xs">
            {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
          </span>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-slate-700 shadow-xs"
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {product.rating >= 4.8 && (
          <span className="absolute bottom-1.5 left-1.5 bg-slate-900/80 backdrop-blur-xs text-amber-400 text-[9px] font-bold px-1.5 py-0.2 rounded-md flex items-center gap-0.5">
            <Star className="w-2.5 h-2.5 fill-amber-400" />
            {product.rating}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="space-y-1">
        <h4
          onClick={() => onSelect(product)}
          className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug cursor-pointer hover:text-emerald-700"
        >
          {language === 'bn' ? product.nameBn : product.nameEn}
        </h4>
        <div className="flex items-center justify-between text-[10px] text-slate-400">
          <span className="truncate max-w-[90px]">{product.shopName}</span>
          <span>{product.unit}</span>
        </div>
      </div>

      {/* Pricing & Add to Cart button */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
        <div>
          <div className="text-xs font-extrabold text-emerald-900">
            {formatCurrency(activePrice, language)}
          </div>
          {product.discountPrice && (
            <div className="text-[10px] text-slate-400 line-through">
              {formatCurrency(product.price, language)}
            </div>
          )}
        </div>

        <button
          id={`add-btn-${product.id}`}
          onClick={() => onAddToCart(product)}
          className="w-7 h-7 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white flex items-center justify-center shadow-xs transition-all"
          title="Add to Cart"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
