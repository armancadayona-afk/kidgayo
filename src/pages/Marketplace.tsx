import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Sparkles,
  Building,
  ShieldCheck,
  Search,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Compass
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Property } from '../types';
import { SearchAndFilters, FilterState } from '../components/SearchAndFilters';
import { PropertyCard } from '../components/PropertyCard';
import { PropertyDetailsModal } from '../components/PropertyDetailsModal';
import { InquiryModal } from '../components/InquiryModal';
import { RentalApplicationModal } from '../components/RentalApplicationModal';

const INITIAL_FILTERS: FilterState = {
  searchQuery: '',
  neighborhood: 'All Greater Boston',
  minPrice: 0,
  maxPrice: 15000,
  bedrooms: 'all',
  bathrooms: 'all',
  pets: 'all',
  amenities: [],
  sortBy: 'featured'
};

export const Marketplace: React.FC = () => {
  const { properties } = useApp();

  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

  // Modal states
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [inquiryProperty, setInquiryProperty] = useState<Property | null>(null);
  const [applyProperty, setApplyProperty] = useState<Property | null>(null);

  // Filter & sort logic
  const filteredProperties = useMemo(() => {
    return properties.filter(prop => {
      // Search query
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matches =
          prop.title.toLowerCase().includes(q) ||
          prop.streetAddress.toLowerCase().includes(q) ||
          prop.city.toLowerCase().includes(q) ||
          prop.neighborhood.toLowerCase().includes(q) ||
          prop.zipCode.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Neighborhood
      if (filters.neighborhood !== 'All Greater Boston') {
        const nFilter = filters.neighborhood.toLowerCase();
        const pNeigh = prop.neighborhood.toLowerCase();
        const pCity = prop.city.toLowerCase();
        if (!pNeigh.includes(nFilter) && !nFilter.includes(pNeigh) && !pCity.includes(nFilter)) {
          return false;
        }
      }

      // Price range
      if (prop.monthlyRent < filters.minPrice || prop.monthlyRent > filters.maxPrice) {
        return false;
      }

      // Bedrooms
      if (filters.bedrooms !== 'all') {
        const bedNum = parseInt(filters.bedrooms);
        if (filters.bedrooms === '4+' ? prop.bedrooms < 4 : prop.bedrooms !== bedNum) {
          return false;
        }
      }

      // Bathrooms
      if (filters.bathrooms !== 'all') {
        const bathNum = parseFloat(filters.bathrooms);
        if (filters.bathrooms === '3+' ? prop.bathrooms < 3 : prop.bathrooms < bathNum) {
          return false;
        }
      }

      // Pets
      if (filters.pets === 'pets-allowed') {
        if (!prop.petPolicy.toLowerCase().includes('allowed')) {
          return false;
        }
      } else if (filters.pets === 'cats-only') {
        if (!prop.petPolicy.toLowerCase().includes('cat')) {
          return false;
        }
      } else if (filters.pets === 'dogs-only') {
        if (!prop.petPolicy.toLowerCase().includes('dog')) {
          return false;
        }
      }

      // Amenities filter
      if (filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every(amenityReq => {
          const lowerReq = amenityReq.toLowerCase();
          return (
            prop.amenities.some(a => a.toLowerCase().includes(lowerReq)) ||
            (lowerReq.includes('washer') && prop.laundry.toLowerCase().includes('in-unit')) ||
            (lowerReq.includes('parking') && !prop.parking.toLowerCase().includes('street parking')) ||
            (lowerReq.includes('air') && prop.airConditioning.toLowerCase().includes('air'))
          );
        });
        if (!hasAllAmenities) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-asc') return a.monthlyRent - b.monthlyRent;
      if (filters.sortBy === 'price-desc') return b.monthlyRent - a.monthlyRent;
      if (filters.sortBy === 'beds-desc') return b.bedrooms - a.bedrooms;
      if (filters.sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [properties, filters]);

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Boston Sub-Hero Header */}
      <div className="bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200/80 rounded-full text-[#1E3A8A] text-xs font-bold mb-3">
                <MapPin className="w-3.5 h-3.5" />
                <span>Boston Metropolitan Housing Hub</span>
                <span className="w-1 h-1 rounded-full bg-blue-400"></span>
                <span className="text-slate-600 font-normal">Avail Platform Experience</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Boston Apartments for Rent
              </h1>

              <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
                Browse verified rental homes directly from the property owner. Listings sourced and synced from <strong>Compass.com</strong> and <strong>Apartments.com</strong> with seamless online applications and Massachusetts standard leases.
              </p>

              {/* Boston Trust Badges */}
              <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>No Broker Fees</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#1E3A8A]" />
                  <span>100% Verified Boston Real Estate Data</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Avail Digital Application System</span>
                </div>
              </div>
            </div>

            {/* Quick Stats Box */}
            <div className="bg-gradient-to-br from-[#07172B] via-[#0A2240] to-[#123A63] p-5 rounded-2xl text-white shadow-xl lg:min-w-[280px]">
              <span className="text-[11px] font-bold text-blue-200 uppercase tracking-wider block">
                Live Portfolio Status
              </span>
              <div className="text-3xl font-black text-white mt-1">
                {properties.length} Active Units
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Back Bay, Beacon Hill, Seaport, Downtown, Cambridge, & Malden
              </p>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-300">Median Boston Rent:</span>
                <span className="font-bold text-emerald-400">$3,500 / mo</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Filters Toolbar */}
        <SearchAndFilters
          filters={filters}
          onFilterChange={setFilters}
          totalResults={filteredProperties.length}
        />

        {/* Property Grid or Empty State */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map(prop => (
              <PropertyCard
                key={prop.id}
                property={prop}
                onSelect={p => setSelectedProperty(p)}
                onInquire={p => setInquiryProperty(p)}
                onApply={p => setApplyProperty(p)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 max-w-lg mx-auto my-8">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No matching Boston properties found</h3>
            <p className="text-xs text-slate-500">
              Try adjusting your price range, bedroom criteria, or selected neighborhood to discover available homes.
            </p>
            <button
              onClick={() => setFilters(INITIAL_FILTERS)}
              className="px-4 py-2 bg-[#0A2240] hover:bg-[#07172B] text-white font-semibold rounded-xl text-xs transition"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <PropertyDetailsModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        onInquire={p => setInquiryProperty(p)}
        onApply={p => setApplyProperty(p)}
      />

      <InquiryModal
        property={inquiryProperty}
        isOpen={!!inquiryProperty}
        onClose={() => setInquiryProperty(null)}
        onOpenApplyModal={p => {
          setInquiryProperty(null);
          setApplyProperty(p);
        }}
      />

      <RentalApplicationModal
        property={applyProperty}
        isOpen={!!applyProperty}
        onClose={() => setApplyProperty(null)}
      />
    </div>
  );
};
