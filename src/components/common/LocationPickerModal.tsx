import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../utils/translations';
import { MapPin, CheckCircle, AlertTriangle, X, Search, ChevronRight, Navigation } from 'lucide-react';

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({ isOpen, onClose }) => {
  const {
    serviceAreas,
    selectedAreaId,
    setSelectedAreaId,
    currentLocationDetails,
    setDeliveryLocation,
    language,
  } = useApp();

  const t = translations[language];

  const [tempAreaId, setTempAreaId] = useState<string>(selectedAreaId);
  const [selectedUnion, setSelectedUnion] = useState<string>(currentLocationDetails.union);
  const [selectedWard, setSelectedWard] = useState<string>(currentLocationDetails.ward);
  const [selectedVillage, setSelectedVillage] = useState<string>(currentLocationDetails.village);
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const currentAreaObj = serviceAreas.find(a => a.id === tempAreaId) || serviceAreas[0];
  const isAvailable = currentAreaObj?.isActive ?? false;

  const filteredAreas = serviceAreas.filter(a =>
    a.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.nameBn.includes(searchQuery) ||
    a.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.upazila.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = () => {
    setSelectedAreaId(tempAreaId);
    setDeliveryLocation({
      areaId: tempAreaId,
      union: selectedUnion || currentAreaObj?.unions[0] || '',
      ward: selectedWard || currentAreaObj?.wards[0] || '01',
      village: selectedVillage || currentAreaObj?.villages[0] || '',
    });
    onClose();
  };

  const handleSelectArea = (areaId: string) => {
    setTempAreaId(areaId);
    const area = serviceAreas.find(a => a.id === areaId);
    if (area) {
      setSelectedUnion(area.unions[0] || '');
      setSelectedWard(area.wards[0] || '');
      setSelectedVillage(area.villages[0] || '');
    }
  };

  return (
    <div id="location-picker-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">{t.selectLocation}</h3>
              <p className="text-xs text-slate-500">{t.selectYourArea}</p>
            </div>
          </div>
          <button
            id="close-location-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* Quick Auto Location Pin */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Navigation className="w-4 h-4 text-emerald-600 animate-pulse" />
              <div>
                <p className="text-xs font-semibold text-emerald-900">Current Device GPS</p>
                <p className="text-[11px] text-emerald-700">Detect within local service range</p>
              </div>
            </div>
            <button
              onClick={() => handleSelectArea('area-dhanmondi')}
              className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-3 py-1.5 rounded-lg shadow-xs transition-colors"
            >
              Auto Detect
            </button>
          </div>

          {/* Search Areas */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              id="area-search-input"
              type="text"
              placeholder="Search area, union, upazila, district..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>

          {/* Service Area Selection */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
              1. Select Delivery Area
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {filteredAreas.map(area => {
                const isSelected = tempAreaId === area.id;
                return (
                  <button
                    key={area.id}
                    id={`select-area-${area.id}`}
                    onClick={() => handleSelectArea(area.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all duration-150 flex items-center justify-between ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <MapPin className={`w-4 h-4 mt-0.5 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <div>
                        <div className="font-semibold text-sm text-slate-900">
                          {language === 'bn' ? area.nameBn : area.nameEn}
                        </div>
                        <div className="text-xs text-slate-500">
                          {area.upazila}, {area.district} • {area.radiusKm} km radius
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {area.isActive ? (
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          {t.serviceAvailable}
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Unavailable
                        </span>
                      )}
                      {isSelected && <ChevronRight className="w-4 h-4 text-emerald-600" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Area Status Alert */}
          {!isAvailable ? (
            <div id="service-unavailable-alert" className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-rose-900">
                  {language === 'bn' ? 'সেবা অনুপলব্ধ' : 'Outside Service Area'}
                </h4>
                <p className="text-xs text-rose-700 mt-0.5 font-medium">
                  {t.serviceUnavailable}
                </p>
                <p className="text-[11px] text-rose-600 mt-1">
                  You can still browse products, but orders cannot be delivered to this location until local delivery is enabled.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center justify-between text-xs">
              <span className="font-medium">
                ⚡ Express Delivery: ~{currentAreaObj?.estimatedDeliveryMin} mins • Base Charge: ৳{currentAreaObj?.deliveryCharge}
              </span>
              <span className="font-bold text-emerald-700">COD Active</span>
            </div>
          )}

          {/* Granular Location: Union, Ward, Village */}
          {currentAreaObj && (
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                2. Precise Local Address Details
              </label>

              <div className="grid grid-cols-2 gap-2.5">
                {/* Union Selector */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {t.union}
                  </label>
                  <select
                    id="union-select"
                    value={selectedUnion}
                    onChange={e => setSelectedUnion(e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {currentAreaObj.unions.map((u, i) => (
                      <option key={i} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Ward Selector */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {t.ward}
                  </label>
                  <select
                    id="ward-select"
                    value={selectedWard}
                    onChange={e => setSelectedWard(e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {currentAreaObj.wards.map((w, i) => (
                      <option key={i} value={w}>
                        Ward {w}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Village / Mahalla */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {t.village}
                </label>
                <select
                  id="village-select"
                  value={selectedVillage}
                  onChange={e => setSelectedVillage(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {currentAreaObj.villages.map((v, i) => (
                    <option key={i} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
          <button
            id="cancel-location-btn"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl transition-colors"
          >
            {t.cancel}
          </button>
          <button
            id="save-location-btn"
            onClick={handleSave}
            className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all"
          >
            {t.save}
          </button>
        </div>
      </div>
    </div>
  );
};
