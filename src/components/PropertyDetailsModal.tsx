import React, { useState } from 'react';
import {
  X,
  MapPin,
  Bed,
  Bath,
  Square,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Navigation,
  Train,
  Clock,
  Sparkles,
  ArrowRight,
  Share2,
  Heart,
  Lock
} from 'lucide-react';
import { Property } from '../types';
import { useApp } from '../context/AppContext';

interface PropertyDetailsModalProps {
  property: Property | null;
  onClose: () => void;
  onInquire: (property: Property) => void;
  onApply: (property: Property) => void;
}

export const PropertyDetailsModal: React.FC<PropertyDetailsModalProps> = ({
  property,
  onClose,
  onInquire,
  onApply
}) => {
  const { getUserApplicationForProperty, currentUser } = useApp();
  const application = property ? getUserApplicationForProperty(property.id, currentUser?.email) : undefined;
  const isApplied = !!application;
  const isAccepted = application?.status === 'Accepted' || application?.status === 'Lease Sent';
  const [activePhoto, setActivePhoto] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!property) return null;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Sticky Header Bar */}
        <div className="p-4 sm:px-6 border-b border-slate-100 flex items-center justify-between bg-white z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-blue-50 text-[#0066FF] text-xs font-bold rounded-lg">
              {property.propertyType}
            </span>
            {property.sourcePortal === 'compass' ? (
              <span className="px-2.5 py-1 bg-slate-900 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Compass Listing
              </span>
            ) : property.sourcePortal === 'apartments' ? (
              <span className="px-2.5 py-1 bg-blue-900 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                Apartments.com Listing
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
              title="Copy share link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            {copied && <span className="text-xs font-semibold text-emerald-600">Copied!</span>}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Main Photo Gallery */}
          <div className="space-y-3">
            <div className="aspect-16/9 sm:aspect-21/9 w-full rounded-2xl overflow-hidden bg-slate-100 relative shadow-inner">
              <img
                src={property.photos[activePhoto] || property.photos[0]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 right-3 px-3 py-1 bg-black/60 text-white text-xs font-medium rounded-full backdrop-blur-xs">
                Photo {activePhoto + 1} of {property.photos.length}
              </div>
            </div>

            {/* Thumbnail Row */}
            {property.photos.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                {property.photos.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePhoto(idx)}
                    className={`relative w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                      activePhoto === idx
                        ? 'border-[#0066FF] shadow-sm scale-102'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Heading & Rent Bar */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-[#0066FF] mb-1">
                <MapPin className="w-4 h-4" />
                <span>{property.neighborhood}, {property.city}, MA</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {property.streetAddress} {property.unit && <span className="text-slate-600 font-semibold">({property.unit})</span>}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {property.city}, {property.state} {property.zipCode}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-right min-w-[200px]">
              <div className="text-3xl font-black text-slate-900 leading-none">
                ${property.monthlyRent.toLocaleString()}
                <span className="text-xs font-medium text-slate-500 ml-1">/ month</span>
              </div>
              <div className="text-xs text-slate-600 mt-1.5 font-medium">
                Security Deposit: ${property.securityDeposit.toLocaleString()}
              </div>
              <div className="text-xs text-emerald-700 font-semibold flex items-center justify-end gap-1 mt-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Available: {property.availableDate}</span>
              </div>
            </div>
          </div>

          {/* Key Property Specs Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 font-medium block">Bedrooms</span>
              <div className="flex items-center gap-1.5 text-base font-bold text-slate-900 mt-0.5">
                <Bed className="w-4 h-4 text-[#0066FF]" />
                <span>{property.bedrooms} {property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 font-medium block">Bathrooms</span>
              <div className="flex items-center gap-1.5 text-base font-bold text-slate-900 mt-0.5">
                <Bath className="w-4 h-4 text-[#0066FF]" />
                <span>{property.bathrooms} Full Bath</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 font-medium block">Living Space</span>
              <div className="flex items-center gap-1.5 text-base font-bold text-slate-900 mt-0.5">
                <Square className="w-4 h-4 text-[#0066FF]" />
                <span>{property.squareFeet.toLocaleString()} sq ft</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 font-medium block">Parking</span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mt-0.5 truncate">
                <Navigation className="w-4 h-4 text-[#0066FF] flex-shrink-0" />
                <span className="truncate">{property.parking}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-2">About This Home</h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Amenities Breakdown */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-3">Amenities & Features</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {property.amenities.map((amenity, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs font-medium text-slate-700"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Lease & Utility Details */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Lease & Utility Policies</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-medium block">Pet Policy</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">{property.petPolicy}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Laundry</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">{property.laundry}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Air Conditioning</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">{property.airConditioning}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Heating</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">{property.heating}</span>
              </div>
            </div>
          </div>

          {/* Boston Transit & Location Highlights */}
          <div className="bg-blue-50/60 p-5 rounded-2xl border border-blue-100">
            <div className="flex items-center gap-2 text-sm font-bold text-blue-900 mb-2">
              <Train className="w-4 h-4 text-[#0066FF]" />
              <span>Boston Transit & Commute Highlights</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-white border border-blue-200 flex items-center justify-center font-bold text-blue-700 text-base">
                  {property.walkScore || 95}
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Walk Score®</span>
                  <span className="text-slate-500">Daily errands do not require a car</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-white border border-blue-200 flex items-center justify-center font-bold text-emerald-700 text-base">
                  {property.transitScore || 90}
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Transit Score®</span>
                  <span className="text-slate-500">World-class MBTA transit access</span>
                </div>
              </div>
            </div>

            {property.nearbyTransit && (
              <div className="mt-3 pt-3 border-t border-blue-100/80">
                <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block mb-1.5">
                  Nearby MBTA Stations & Lines:
                </span>
                <ul className="space-y-1 text-xs text-slate-700">
                  {property.nearbyTransit.map((station, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF]"></span>
                      <span>{station}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Original Source Notice */}
          {property.sourceUrl && (
            <div className="flex items-center justify-between p-3.5 bg-slate-100/70 rounded-xl text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>
                  Real authentic listing imported from{' '}
                  <strong className="text-slate-800 uppercase">{property.sourcePortal}</strong>
                </span>
              </div>
              <a
                href={property.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0066FF] hover:underline font-semibold flex items-center gap-1"
              >
                <span>View on {property.sourcePortal === 'compass' ? 'Compass.com' : 'Apartments.com'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Sticky Action Footer */}
        <div className="p-4 sm:px-6 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-left w-full sm:w-auto">
            <span className="text-xs text-slate-500 font-medium">Monthly Rent</span>
            <div className="text-xl font-black text-slate-900">
              ${property.monthlyRent.toLocaleString()} <span className="text-xs font-normal text-slate-500">/ mo</span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {isApplied ? (
              isAccepted ? (
                <>
                  <button
                    onClick={() => {
                      onInquire(property);
                      onClose();
                    }}
                    className="flex-1 sm:flex-initial py-3 px-5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl text-xs transition border border-emerald-200 flex items-center justify-center gap-1.5"
                  >
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <span>Schedule Unit Tour (Approved)</span>
                  </button>
                  <div className="px-3 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Application Accepted</span>
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      onInquire(property);
                      onClose();
                    }}
                    className="flex-1 sm:flex-initial py-3 px-5 bg-blue-50 hover:bg-blue-100 text-[#0066FF] font-semibold rounded-xl text-xs transition flex items-center justify-center gap-1.5"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Tour Status / Send Note</span>
                  </button>
                  <div className="px-3 py-2 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold rounded-xl flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>App Under Review</span>
                  </div>
                </>
              )
            ) : (
              <>
                <button
                  onClick={() => {
                    onInquire(property);
                    onClose();
                  }}
                  className="flex-1 sm:flex-initial py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition flex items-center justify-center gap-1.5"
                  title="Application must be submitted before scheduling a tour"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Schedule Tour (App Required)</span>
                </button>

                <button
                  onClick={() => {
                    onApply(property);
                    onClose();
                  }}
                  className="flex-1 sm:flex-initial py-3 px-6 bg-[#0066FF] hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md hover:shadow-lg transition flex items-center justify-center gap-1.5"
                >
                  <span>Submit Rental Application</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
