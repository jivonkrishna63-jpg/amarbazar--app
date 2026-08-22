import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations, formatCurrency } from '../../utils/translations';
import { UserRole, Product } from '../../types';
import {
  User,
  MapPin,
  Heart,
  Headphones,
  Languages,
  LogOut,
  Store,
  Bike,
  ShieldCheck,
  ChevronRight,
  Plus,
  Trash2,
  CheckCircle,
  FileText,
  Phone,
  Palette,
  Download,
  Smartphone,
} from 'lucide-react';
import { SupportModal } from './SupportModal';
import { LogoModal } from '../common/LogoModal';
import { InstallModal } from '../common/InstallModal';

interface ProfileViewProps {
  onSelectProduct: (product: Product) => void;
  deferredPrompt?: any;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onSelectProduct, deferredPrompt }) => {
  const {
    currentUser,
    setCurrentRole,
    language,
    setLanguage,
    wishlist,
    products,
    toggleWishlist,
    addToCart,
    showToast,
  } = useApp();

  const t = translations[language];
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddrTitle, setNewAddrTitle] = useState('Home');
  const [newAddrStreet, setNewAddrStreet] = useState('');

  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div id="customer-profile-view" className="space-y-5 pb-20 md:pb-8 animate-in fade-in max-w-2xl mx-auto">
      {/* Profile Card */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-5 rounded-3xl shadow-lg flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center text-white font-black text-xl overflow-hidden">
            {currentUser.avatar ? (
              <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
            ) : (
              currentUser.name.charAt(0)
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold">{currentUser.name}</h2>
              {currentUser.isVerified && (
                <CheckCircle className="w-4 h-4 text-emerald-300" />
              )}
            </div>
            <p className="text-xs text-emerald-200">{currentUser.phone}</p>
            <span className="inline-block mt-1 text-[10px] uppercase font-black bg-emerald-700/80 px-2 py-0.5 rounded-md border border-emerald-500/50">
              Customer Account
            </span>
          </div>
        </div>
      </div>

      {/* Switch Role Quick Hub */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Switch In-App Experience
        </h3>
        <div className="grid grid-cols-3 gap-2">
          <button
            id="profile-switch-seller-btn"
            onClick={() => setCurrentRole('seller')}
            className="p-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-2xl flex flex-col items-center justify-center text-center gap-1.5 text-amber-950 transition-colors"
          >
            <Store className="w-5 h-5 text-amber-700" />
            <span className="text-xs font-bold">{t.roleSeller}</span>
            <span className="text-[10px] text-amber-700">Manage Shop</span>
          </button>

          <button
            id="profile-switch-rider-btn"
            onClick={() => setCurrentRole('rider')}
            className="p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-2xl flex flex-col items-center justify-center text-center gap-1.5 text-blue-950 transition-colors"
          >
            <Bike className="w-5 h-5 text-blue-700" />
            <span className="text-xs font-bold">{t.roleRider}</span>
            <span className="text-[10px] text-blue-700">Deliveries</span>
          </button>

          <button
            id="profile-switch-admin-btn"
            onClick={() => setCurrentRole('admin')}
            className="p-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-2xl flex flex-col items-center justify-center text-center gap-1.5 text-purple-950 transition-colors"
          >
            <ShieldCheck className="w-5 h-5 text-purple-700" />
            <span className="text-xs font-bold">{t.roleAdmin}</span>
            <span className="text-[10px] text-purple-700">Controls</span>
          </button>
        </div>
      </div>

      {/* Saved Addresses */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>{t.savedAddresses}</span>
          </h3>
          <button
            onClick={() => setIsAddingAddress(!isAddingAddress)}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.addNewAddress}</span>
          </button>
        </div>

        {isAddingAddress && (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs animate-in fade-in">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Title (e.g. Home, Office, Farm)"
                value={newAddrTitle}
                onChange={e => setNewAddrTitle(e.target.value)}
                className="p-2 bg-white border border-slate-200 rounded-xl"
              />
              <input
                type="text"
                placeholder="Street / House Address..."
                value={newAddrStreet}
                onChange={e => setNewAddrStreet(e.target.value)}
                className="p-2 bg-white border border-slate-200 rounded-xl"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setIsAddingAddress(false)}
                className="px-3 py-1 text-slate-500"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  showToast('Address saved to profile', 'success');
                  setIsAddingAddress(false);
                }}
                className="px-4 py-1 bg-emerald-600 text-white font-bold rounded-xl"
              >
                Save
              </button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {(currentUser.addresses || []).map(addr => (
            <div
              key={addr.id}
              className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start justify-between text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{addr.title}</span>
                  {addr.isDefault && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-md">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-slate-600 mt-0.5">{addr.streetAddress}</p>
                <p className="text-[11px] text-slate-400">
                  {addr.villageName}, {addr.unionName} (Ward {addr.wardNo}), {addr.areaName}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wishlist Preview */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-rose-500" />
            <span>{t.wishlist} ({wishlistedProducts.length})</span>
          </h3>
        </div>

        {wishlistedProducts.length === 0 ? (
          <p className="text-xs text-slate-400 py-3 text-center">Your wishlist is empty.</p>
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            {wishlistedProducts.map(p => (
              <div
                key={p.id}
                onClick={() => onSelectProduct(p)}
                className="p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 cursor-pointer flex items-center gap-2.5 transition-colors"
              >
                <img src={p.images[0]} alt={p.nameEn} className="w-12 h-12 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {language === 'bn' ? p.nameBn : p.nameEn}
                  </h4>
                  <div className="text-xs font-black text-emerald-800">
                    {formatCurrency(p.discountPrice || p.price, language)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* General Settings: Language, Support, Terms */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden text-xs font-semibold text-slate-800">
        {/* Language switch */}
        <button
          onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3 text-slate-700">
            <Languages className="w-4 h-4 text-emerald-600" />
            <span>{t.languagePreference}</span>
          </div>
          <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            {language === 'en' ? 'English (Current)' : 'বাংলা (সক্রিয়)'}
          </span>
        </button>

        {/* Support modal trigger */}
        <button
          onClick={() => setIsSupportModalOpen(true)}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3 text-slate-700">
            <Headphones className="w-4 h-4 text-emerald-600" />
            <span>{t.customerSupport}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* Install App Button */}
        <button
          id="profile-install-app-btn"
          onClick={() => setIsInstallModalOpen(true)}
          className="w-full p-4 flex items-center justify-between hover:bg-emerald-50/50 transition-colors bg-emerald-50/20"
        >
          <div className="flex items-center gap-3 text-emerald-900 font-bold">
            <Download className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>{language === 'bn' ? 'AmarBazar অ্যাপ ইনস্টল করুন' : 'Install AmarBazar App'}</span>
          </div>
          <span className="text-[11px] font-extrabold text-white bg-emerald-600 px-2.5 py-1 rounded-lg shadow-xs flex items-center gap-1">
            <Smartphone className="w-3 h-3" />
            {language === 'bn' ? 'ইনস্টল' : 'Install'}
          </span>
        </button>

        {/* Change Logo trigger */}
        <button
          id="profile-change-logo-btn"
          onClick={() => setIsLogoModalOpen(true)}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3 text-slate-700">
            <Palette className="w-4 h-4 text-purple-600" />
            <span>{language === 'bn' ? 'লগো ও ব্র্যান্ডিং চেঞ্জ করুন' : 'Change App Logo & Branding'}</span>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
            {language === 'bn' ? 'কাস্টমাইজ' : 'Customize'}
          </span>
        </button>
      </div>

      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />

      <LogoModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
      />

      <InstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        deferredPrompt={deferredPrompt}
      />
    </div>
  );
};
