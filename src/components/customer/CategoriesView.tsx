import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCategory, Product } from '../../types';
import { INITIAL_CATEGORIES } from '../../data/mockData';
import { translations, formatCurrency } from '../../utils/translations';
import {
  ShoppingBag,
  Utensils,
  HeartPulse,
  Apple,
  Shirt,
  Smartphone,
  Home as HomeIcon,
  Sparkles,
  Store,
  Tag,
  Star,
  Plus,
  Heart,
  Search,
  Filter,
} from 'lucide-react';

interface CategoriesViewProps {
  initialCategory?: ProductCategory | 'all';
  onSelectProduct: (product: Product) => void;
  onQuickBuyNow: (product: Product, quantity: number) => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  initialCategory = 'all',
  onSelectProduct,
  onQuickBuyNow,
}) => {
  const {
    products,
    shops,
    addToCart,
    wishlist,
    toggleWishlist,
    language,
    selectedCategory,
    setSelectedCategory,
  } = useApp();

  const t = translations[language];

  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>(
    selectedCategory || initialCategory || 'all'
  );
  const [filterShopId, setFilterShopId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const getCategoryIcon = (id: ProductCategory) => {
    switch (id) {
      case 'grocery': return <ShoppingBag className="w-4 h-4" />;
      case 'food': return <Utensils className="w-4 h-4" />;
      case 'pharmacy': return <HeartPulse className="w-4 h-4" />;
      case 'vegetables_fruits': return <Apple className="w-4 h-4" />;
      case 'clothing': return <Shirt className="w-4 h-4" />;
      case 'electronics': return <Smartphone className="w-4 h-4" />;
      case 'home_kitchen': return <HomeIcon className="w-4 h-4" />;
      case 'cosmetics': return <Sparkles className="w-4 h-4" />;
      case 'local_shops': return <Store className="w-4 h-4" />;
      default: return <Tag className="w-4 h-4" />;
    }
  };

  const filteredProducts = products.filter(p => {
    const matchCat = activeCategory === 'all' || p.category === activeCategory;
    const matchShop = filterShopId === 'all' || p.shopId === filterShopId;
    const matchQuery =
      !searchQuery.trim() ||
      p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nameBn.includes(searchQuery) ||
      p.shopName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchShop && matchQuery;
  });

  return (
    <div id="categories-view" className="space-y-4 pb-20 md:pb-8 animate-in fade-in duration-200">
      {/* Search & Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">
            {t.allCategories}
          </h2>
          <p className="text-xs text-slate-500">
            Browse all 9 local product departments & verified stores
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            id="category-search-input"
            type="text"
            placeholder="Search within categories..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Horizontal Category Pill Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        <button
          id="cat-pill-all"
          onClick={() => {
            setActiveCategory('all');
            setSelectedCategory('all');
          }}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeCategory === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>All Items ({products.length})</span>
        </button>

        {INITIAL_CATEGORIES.map(cat => {
          const isSelected = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              id={`cat-pill-${cat.id}`}
              onClick={() => {
                setActiveCategory(cat.id);
                setSelectedCategory(cat.id);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-emerald-700 text-white shadow-xs scale-102'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {getCategoryIcon(cat.id)}
              <span>{language === 'bn' ? cat.nameBn : cat.nameEn}</span>
            </button>
          );
        })}
      </div>

      {/* Filter by Shop Dropdown */}
      <div className="flex items-center justify-between text-xs pt-1">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-semibold text-slate-600">Filter by Shop:</span>
          <select
            id="filter-shop-select"
            value={filterShopId}
            onChange={e => setFilterShopId(e.target.value)}
            className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">All Verified Shops</option>
            {shops.map(s => (
              <option key={s.id} value={s.id}>
                {language === 'bn' ? s.nameBn : s.nameEn}
              </option>
            ))}
          </select>
        </div>

        <span className="text-slate-400 font-medium">
          Showing {filteredProducts.length} items
        </span>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-200 text-slate-400 space-y-2">
          <ShoppingBag className="w-12 h-12 mx-auto text-slate-300 stroke-1" />
          <p className="text-sm font-semibold">No items match your filter</p>
          <p className="text-xs">Try selecting a different category or store.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {filteredProducts.map(prod => {
            const activePrice = prod.discountPrice || prod.price;
            const isWishlisted = wishlist.includes(prod.id);

            return (
              <div
                key={prod.id}
                id={`cat-prod-card-${prod.id}`}
                className="bg-white rounded-2xl border border-slate-200/80 p-2.5 flex flex-col justify-between hover:shadow-md hover:border-emerald-300 transition-all group"
              >
                {/* Image */}
                <div
                  className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 mb-2 cursor-pointer"
                  onClick={() => onSelectProduct(prod)}
                >
                  <img
                    src={prod.images[0]}
                    alt={prod.nameEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {prod.discountPrice && (
                    <span className="absolute top-1.5 left-1.5 bg-rose-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded-md shadow-xs">
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

                  <span className="absolute bottom-1.5 left-1.5 bg-slate-900/80 backdrop-blur-xs text-amber-400 text-[9px] font-bold px-1.5 py-0.2 rounded-md flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5 fill-amber-400" />
                    {prod.rating}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-1">
                  <h4
                    onClick={() => onSelectProduct(prod)}
                    className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug cursor-pointer hover:text-emerald-700"
                  >
                    {language === 'bn' ? prod.nameBn : prod.nameEn}
                  </h4>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="truncate max-w-[90px]">{prod.shopName}</span>
                    <span>{prod.unit}</span>
                  </div>
                </div>

                {/* Pricing & Add */}
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
                    className="w-7 h-7 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-xs transition-colors active:scale-95"
                    title="Add to Cart"
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
  );
};
