import React, { useState } from 'react';
import {
  X,
  Link,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Building,
  DollarSign,
  Bed,
  Bath,
  Square,
  MapPin,
  ExternalLink,
  Plus
} from 'lucide-react';
import { Property, SourcePortal } from '../../types';
import { parsePropertyUrl } from '../../utils/urlParser';

interface AddPropertyUrlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProperty: (property: Property) => void;
}

export const AddPropertyUrlModal: React.FC<AddPropertyUrlModalProps> = ({
  isOpen,
  onClose,
  onAddProperty
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [parsedProperty, setParsedProperty] = useState<Partial<Property> | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form fields for review/edit
  const [title, setTitle] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [unit, setUnit] = useState('');
  const [city, setCity] = useState('Boston');
  const [state, setState] = useState('MA');
  const [zipCode, setZipCode] = useState('02116');
  const [neighborhood, setNeighborhood] = useState('Boston');
  const [monthlyRent, setMonthlyRent] = useState(3500);
  const [securityDeposit, setSecurityDeposit] = useState(3500);
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [squareFeet, setSquareFeet] = useState(850);
  const [availableDate, setAvailableDate] = useState('2026-10-01');
  const [description, setDescription] = useState('');
  const [sourcePortal, setSourcePortal] = useState<SourcePortal>('manual');
  const [photos, setPhotos] = useState<string[]>([]);

  if (!isOpen) return null;

  const SAMPLE_URLS = [
    {
      name: 'Sample 1: Compass.com (W Hotel Luxury Condo)',
      url: 'https://www.compass.com/homedetails/110-Stuart-St-Unit-26A-Boston-MA-02116/1552204048448867145_lid/'
    },
    {
      name: 'Sample 2: Apartments.com (Malden 4BR Penthouse)',
      url: 'https://www.apartments.com/39-upham-st-malden-ma-unit-3/zzyrqhx/'
    }
  ];

  const handleParse = (targetUrl?: string) => {
    const toParse = targetUrl || urlInput;
    if (!toParse.trim()) {
      setParseError('Please enter a Compass.com or Apartments.com property link.');
      return;
    }

    setParsing(true);
    setParseError(null);

    setTimeout(() => {
      const result = parsePropertyUrl(toParse);
      setParsing(false);

      if (result.success && result.property) {
        const p = result.property;
        setParsedProperty(p);
        setTitle(p.title || '');
        setStreetAddress(p.streetAddress || '');
        setUnit(p.unit || '');
        setCity(p.city || 'Boston');
        setState(p.state || 'MA');
        setZipCode(p.zipCode || '02116');
        setNeighborhood(p.neighborhood || 'Boston');
        setMonthlyRent(p.monthlyRent || 3200);
        setSecurityDeposit(p.securityDeposit || 3200);
        setBedrooms(p.bedrooms || 1);
        setBathrooms(p.bathrooms || 1);
        setSquareFeet(p.squareFeet || 850);
        setAvailableDate(p.availableDate || '2026-10-01');
        setDescription(p.description || '');
        setSourcePortal(p.sourcePortal || 'manual');
        setPhotos(p.photos || []);
        setIsEditing(true);
      } else {
        setParseError(result.error || 'Failed to parse property link.');
      }
    }, 400);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const newProp: Property = {
      id: parsedProperty?.id || 'prop-' + Date.now(),
      title: title || `${streetAddress} ${unit}`,
      streetAddress,
      unit,
      city,
      state,
      zipCode,
      neighborhood,
      monthlyRent,
      securityDeposit,
      bedrooms,
      bathrooms,
      squareFeet,
      propertyType: parsedProperty?.propertyType || (bedrooms >= 4 ? 'Penthouse' : 'Condo'),
      availableDate,
      description,
      amenities: parsedProperty?.amenities || ['In-unit Laundry', 'Central A/C', 'Hardwood Floors', 'Pet Friendly'],
      petPolicy: parsedProperty?.petPolicy || 'Cats and Dogs Allowed',
      parking: parsedProperty?.parking || 'Off-Street Parking Included',
      laundry: parsedProperty?.laundry || 'In-unit',
      airConditioning: parsedProperty?.airConditioning || 'Central A/C',
      heating: parsedProperty?.heating || 'Forced Air Heat',
      sourcePortal,
      sourceUrl: urlInput,
      photos: photos.length > 0 ? photos : [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'
      ],
      status: 'Available',
      createdAt: new Date().toISOString(),
      walkScore: parsedProperty?.walkScore || 94,
      transitScore: parsedProperty?.transitScore || 90,
      nearbyTransit: parsedProperty?.nearbyTransit || ['MBTA Transit Station (0.3 mi)']
    };

    onAddProperty(newProp);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95 duration-200 relative">
        {/* Header */}
        <div className="p-4 sm:px-6 border-b border-slate-100 flex items-center justify-between bg-white">
          <div>
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
              Landlord Console • Direct URL Importer
            </span>
            <h2 className="text-lg font-extrabold text-slate-900">
              Add Property by Compass or Apartments.com Link
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-5 text-xs">
          {/* URL Input Section */}
          <div className="space-y-2">
            <label className="block font-bold text-slate-800 text-xs">
              Listing URL (Compass.com or Apartments.com only)
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Link className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="url"
                  placeholder="https://www.compass.com/homedetails/... or https://www.apartments.com/..."
                  value={urlInput}
                  onChange={e => setUrlInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0066FF] focus:bg-white transition"
                />
              </div>
              <button
                type="button"
                onClick={() => handleParse()}
                disabled={parsing || !urlInput.trim()}
                className="px-5 py-2.5 bg-[#0066FF] hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold rounded-xl transition shadow-xs flex items-center gap-1.5"
              >
                {parsing ? (
                  <span>Extracting...</span>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Extract Data</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Sample Buttons */}
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                Quick Test Real Boston Listings:
              </span>
              <div className="flex flex-col sm:flex-row gap-2">
                {SAMPLE_URLS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setUrlInput(sample.url);
                      handleParse(sample.url);
                    }}
                    className="p-2 text-left bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl transition group flex-1"
                  >
                    <span className="font-bold text-slate-800 group-hover:text-[#0066FF] block text-[11px]">
                      {sample.name}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate block">
                      {sample.url}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {parseError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{parseError}</span>
              </div>
            )}
          </div>

          {/* Review & Edit Form once parsed */}
          {isEditing && (
            <form onSubmit={handleSave} className="space-y-4 pt-4 border-t border-slate-200 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-800 text-xs flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Listing Extracted from {sourcePortal.toUpperCase()}
                </span>
                <span className="text-slate-400 text-[11px]">Verify & edit details before publishing</span>
              </div>

              {/* Photos Preview */}
              {photos.length > 0 && (
                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-700">Extracted Photos ({photos.length})</label>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {photos.map((photo, i) => (
                      <div key={i} className="relative w-24 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200">
                        <img src={photo} alt="prop" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Listing Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={streetAddress}
                    onChange={e => setStreetAddress(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unit / Suite (optional)</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={e => setUnit(e.target.value)}
                    placeholder="e.g. Unit 26A"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Neighborhood / District</label>
                  <input
                    type="text"
                    required
                    value={neighborhood}
                    onChange={e => setNeighborhood(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Monthly Rent ($)</label>
                  <input
                    type="number"
                    required
                    value={monthlyRent}
                    onChange={e => setMonthlyRent(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Security Deposit ($)</label>
                  <input
                    type="number"
                    required
                    value={securityDeposit}
                    onChange={e => setSecurityDeposit(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bedrooms</label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="10"
                    value={bedrooms}
                    onChange={e => setBedrooms(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bathrooms</label>
                  <input
                    type="number"
                    required
                    step="0.5"
                    min="1"
                    max="10"
                    value={bathrooms}
                    onChange={e => setBathrooms(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Square Feet</label>
                  <input
                    type="number"
                    value={squareFeet}
                    onChange={e => setSquareFeet(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Available Date</label>
                  <input
                    type="date"
                    value={availableDate}
                    onChange={e => setAvailableDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0066FF] hover:bg-blue-700 text-white font-bold rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish to Portfolio</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
