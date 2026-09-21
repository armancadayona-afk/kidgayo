import React, { useState } from 'react';
import {
  Bed,
  Bath,
  Square,
  MapPin,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Sparkles,
  ArrowRight,
  Lock,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Property } from '../types';
import { useApp } from '../context/AppContext';

interface PropertyCardProps {
  property: Property;
  onSelect: (property: Property) => void;
  onInquire: (property: Property) => void;
  onApply: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSelect,
  onInquire,
  onApply
}) => {
  const { getUserApplicationForProperty, currentUser } = useApp();
  const application = getUserApplicationForProperty(property.id, currentUser?.email);
  const [photoIndex, setPhotoIndex] = useState(0);

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev + 1) % property.photos.length);
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev - 1 + property.photos.length) % property.photos.length);
  };

  const currentPhoto = property.photos[photoIndex] || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80';

  return (
    <div
      onClick={() => onSelect(property)}
      className="group bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-200 overflow-hidden flex flex-col cursor-pointer"
    >
      {/* Photo Carousel Header */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
        <img
          src={currentPhoto}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
          loading="lazy"
        />

        {/* Gradient Overlay for badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/30 pointer-events-none"></div>

        {/* Source Portal Tag (Compass vs Apartments.com) */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          {property.sourcePortal === 'compass' ? (
            <div className="flex items-center gap-1 px-2.5 py-1 bg-slate-900/90 text-white text-[11px] font-bold rounded-lg backdrop-blur-xs shadow-xs border border-white/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Compass Verified</span>
            </div>
          ) : property.sourcePortal === 'apartments' ? (
            <div className="flex items-center gap-1 px-2.5 py-1 bg-blue-900/90 text-white text-[11px] font-bold rounded-lg backdrop-blur-xs shadow-xs border border-blue-400/30">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span>Apartments.com Verified</span>
            </div>
          ) : (
            <div className="px-2.5 py-1 bg-slate-800/80 text-white text-[11px] font-bold rounded-lg backdrop-blur-xs">
              Direct Landlord Listing
            </div>
          )}

          {property.featured && (
            <span className="flex items-center gap-0.5 px-2 py-1 bg-amber-500 text-white text-[11px] font-bold rounded-lg shadow-xs">
              <Sparkles className="w-3 h-3" />
              <span>Featured</span>
            </span>
          )}
        </div>

        {/* Direct Source Link */}
        {property.sourceUrl && (
          <a
            href={property.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            title="View original listing on portal"
            className="absolute top-3 right-3 p-1.5 bg-white/90 hover:bg-white text-slate-800 hover:text-[#0A2240] rounded-lg backdrop-blur-xs shadow-xs transition z-10"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}

        {/* Navigation Arrows for Photos */}
        {property.photos.length > 1 && (
          <>
            <button
              onClick={prevPhoto}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextPhoto}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
              aria-label="Next photo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Bottom Carousel Dots & Price Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between z-10 text-white">
          <div>
            <div className="text-2xl font-black tracking-tight leading-none drop-shadow-md">
              ${property.monthlyRent.toLocaleString()}
              <span className="text-xs font-medium text-slate-200 ml-1">/ month</span>
            </div>
            <div className="text-[11px] text-slate-200 flex items-center gap-1 mt-0.5">
              <span>Security Deposit: ${property.securityDeposit.toLocaleString()}</span>
            </div>
          </div>

          {/* Dots */}
          {property.photos.length > 1 && (
            <div className="flex gap-1 bg-black/30 backdrop-blur-xs px-2 py-1 rounded-full">
              {property.photos.slice(0, 5).map((_, i) => (
                <span
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    photoIndex === i ? 'bg-white w-3' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Property Details Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Location & Title */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1E3A8A] mb-1">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{property.neighborhood}</span>
          </div>

          <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-[#1E3A8A] transition-colors line-clamp-1 mb-1">
            {property.streetAddress} {property.unit && <span className="text-slate-600 font-medium">({property.unit})</span>}
          </h3>

          <p className="text-xs text-slate-500 mb-3">
            {property.city}, {property.state} {property.zipCode}
          </p>

          {/* Specs Row */}
          <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 mb-3.5">
            <div className="flex items-center gap-1.5">
              <Bed className="w-4 h-4 text-slate-500" />
              <span className="font-semibold">{property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath className="w-4 h-4 text-slate-500" />
              <span className="font-semibold">{property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Square className="w-4 h-4 text-slate-500" />
              <span className="font-semibold">{property.squareFeet.toLocaleString()} sqft</span>
            </div>
          </div>

          {/* Key Amenities Snippet */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {property.amenities.slice(0, 3).map((amenity, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[11px] font-medium rounded-md"
              >
                {amenity}
              </span>
            ))}
            {property.amenities.length > 3 && (
              <span className="px-1.5 py-0.5 text-slate-400 text-[11px] font-medium">
                +{property.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Avail-style action buttons */}
        <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
          {application ? (
            application.status === 'Accepted' || application.status === 'Lease Sent' ? (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onInquire(property);
                  }}
                  className="flex-1 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl transition text-center flex items-center justify-center gap-1.5 border border-emerald-200"
                >
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Schedule Tour</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(property);
                  }}
                  className="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition text-center flex items-center justify-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Approved</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onInquire(property);
                  }}
                  className="flex-1 py-2 px-3 bg-blue-50 hover:bg-blue-100 text-[#1E3A8A] text-xs font-semibold rounded-xl transition text-center flex items-center justify-center gap-1"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Tour Status</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(property);
                  }}
                  className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-xl transition text-center"
                >
                  <span>App Submitted</span>
                </button>
              </>
            )
          ) : (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onInquire(property);
                }}
                className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200/90 text-slate-700 text-xs font-medium rounded-xl transition text-center flex items-center justify-center gap-1"
                title="Application required before scheduling a tour"
              >
                <Lock className="w-3 h-3 text-amber-600" />
                <span>Tour (App Req.)</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onApply(property);
                }}
                className="flex-1 py-2 px-3 bg-[#0A2240] hover:bg-[#07172B] text-white text-xs font-semibold rounded-xl shadow-xs transition text-center flex items-center justify-center gap-1"
              >
                <span>Apply Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
