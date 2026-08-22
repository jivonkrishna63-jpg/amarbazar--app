import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LogoPreset, LogoConfig } from '../../types';
import officialLogoImg from '../../assets/images/amarbazar_logo_1787399370303.jpg';
import {
  Sparkles,
  X,
  Upload,
  Link as LinkIcon,
  Check,
  RotateCcw,
  ShoppingBag,
  Bike,
  Image as ImageIcon,
} from 'lucide-react';

interface LogoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogoModal: React.FC<LogoModalProps> = ({ isOpen, onClose }) => {
  const { logoConfig, updateLogoConfig, resetLogoConfig, language, showToast } = useApp();

  const [selectedPreset, setSelectedPreset] = useState<LogoPreset>(logoConfig.preset);
  const [customUrlInput, setCustomUrlInput] = useState(logoConfig.customUrl || '');
  const [appNameEn, setAppNameEn] = useState(logoConfig.appNameEn || 'AmarBazar');
  const [appNameBn, setAppNameBn] = useState(logoConfig.appNameBn || 'আমারবাজার');
  const [taglineEn, setTaglineEn] = useState(logoConfig.taglineEn || 'Local Marketplace & Delivery');
  const [taglineBn, setTaglineBn] = useState(logoConfig.taglineBn || 'লোকাল মার্কেটপ্লেস ও ডেলিভারি');
  const [showBadge, setShowBadge] = useState(logoConfig.showBadge ?? true);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setCustomUrlInput(base64);
        setSelectedPreset('custom_url');
        showToast('Logo image uploaded successfully!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateLogoConfig({
      preset: selectedPreset,
      customUrl: customUrlInput,
      appNameEn,
      appNameBn,
      taglineEn,
      taglineBn,
      showBadge,
    });
    showToast(language === 'bn' ? 'লগো ও ব্র্যান্ডিং সফলভাবে আপডেট হয়েছে!' : 'Logo & Branding successfully updated!', 'success');
    onClose();
  };

  const handleReset = () => {
    resetLogoConfig();
    setSelectedPreset('official');
    setCustomUrlInput('');
    setAppNameEn('AmarBazar');
    setAppNameBn('আমারবাজার');
    setTaglineEn('Local Marketplace & Delivery');
    setTaglineBn('লোকাল মার্কেটপ্লেস ও ডেলিভারি');
    setShowBadge(true);
    showToast(language === 'bn' ? 'ডিফল্ট লগো রিস্টোর করা হয়েছে' : 'Restored to default official logo', 'info');
  };

  const presets = [
    {
      id: 'official' as LogoPreset,
      titleEn: 'Official Brand Emblem',
      titleBn: 'নতুন অফিসিয়াল লগো',
      desc: 'Modern Green & Gold Marketplace Vector with Leaf & Swoosh',
      preview: (
        <img
          src={officialLogoImg}
          alt="Official Logo"
          className="w-12 h-12 rounded-xl object-cover shadow-sm border border-emerald-300"
        />
      ),
    },
    {
      id: 'emerald_bag' as LogoPreset,
      titleEn: 'Emerald Shopping Bag',
      titleBn: 'এমেরাল্ড শপিং ব্যাগ',
      desc: 'Clean minimal vector shopping tote bag',
      preview: (
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 text-white flex items-center justify-center shadow-sm">
          <ShoppingBag className="w-6 h-6" />
        </div>
      ),
    },
    {
      id: 'speed_rider' as LogoPreset,
      titleEn: 'Speed Delivery Express',
      titleBn: 'সুপারফাস্ট ডেলিভারি রাইডার',
      desc: 'Dynamic express bike delivery badge',
      preview: (
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-emerald-700 text-white flex items-center justify-center shadow-sm">
          <Bike className="w-6 h-6" />
        </div>
      ),
    },
    {
      id: 'bangla_monogram' as LogoPreset,
      titleEn: 'Bangla Monogram (আ)',
      titleBn: 'বাংলা মনোগ্রাম (আ)',
      desc: 'Traditional clean Bangla typography emblem',
      preview: (
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center font-black text-xl shadow-sm">
          আ
        </div>
      ),
    },
  ];

  return (
    <div id="logo-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                {language === 'bn' ? 'লগো ও ব্র্যান্ডিং পরিবর্তন' : 'Change App Logo & Branding'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'bn' ? 'পছন্দের লগো নির্বাচন করুন অথবা নিজস্ব ছবি আপলোড করুন' : 'Select a preset style, upload your own icon, or set custom URL'}
              </p>
            </div>
          </div>
          <button
            id="close-logo-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Preset Styles */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2.5">
              {language === 'bn' ? 'লগো প্রিসেট নির্বাচন করুন' : 'Select Logo Style Preset'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {presets.map(p => {
                const isSelected = selectedPreset === p.id;
                return (
                  <div
                    key={p.id}
                    id={`logo-preset-${p.id}`}
                    onClick={() => setSelectedPreset(p.id)}
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    {p.preview}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 truncate">
                          {language === 'bn' ? p.titleBn : p.titleEn}
                        </span>
                        {isSelected && (
                          <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                            <Check className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{p.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Custom Upload or URL Option */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-emerald-600" />
                <span>{language === 'bn' ? 'কাস্টম লগো আপলোড করুন বা লিংক দিন' : 'Upload Custom Image / Image URL'}</span>
              </label>
              {selectedPreset === 'custom_url' && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Selected
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* File upload */}
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-3 bg-white cursor-pointer transition-colors text-center">
                <ImageIcon className="w-5 h-5 text-slate-400 mb-1" />
                <span className="text-xs font-bold text-slate-700">
                  {language === 'bn' ? 'ফাইল নির্বাচন করুন' : 'Browse image file'}
                </span>
                <span className="text-[10px] text-slate-400">PNG, JPG, SVG, WebP</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Direct URL input */}
              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-slate-500">
                  {language === 'bn' ? 'অথবা ছবির লিঙ্ক লিখুন' : 'Or enter public URL'}
                </span>
                <div className="relative">
                  <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="url"
                    placeholder="https://..."
                    value={customUrlInput}
                    onChange={e => {
                      setCustomUrlInput(e.target.value);
                      if (e.target.value) setSelectedPreset('custom_url');
                    }}
                    className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>
                {customUrlInput && (
                  <button
                    type="button"
                    onClick={() => setSelectedPreset('custom_url')}
                    className="w-full mt-1 py-1 text-[11px] font-bold bg-emerald-600 text-white rounded-lg"
                  >
                    Use this custom image
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Brand Titles Customization */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                App Title (English)
              </label>
              <input
                type="text"
                value={appNameEn}
                onChange={e => setAppNameEn(e.target.value)}
                className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                App Title (বাংলা)
              </label>
              <input
                type="text"
                value={appNameBn}
                onChange={e => setAppNameBn(e.target.value)}
                className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-2 text-slate-500 hover:text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'রিসেট' : 'Reset Default'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                {language === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="submit"
                id="save-logo-config-btn"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>{language === 'bn' ? 'লগো সংরক্ষণ করুন' : 'Save Logo'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
