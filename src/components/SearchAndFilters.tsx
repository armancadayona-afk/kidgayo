import React, { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  X,
  RotateCcw,
  Check,
  ChevronDown
} from 'lucide-react';

export interface FilterState {
  searchQuery: string;
  neighborhood: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: string;
  bathrooms: string;
  pets: string;
  amenities: string[];
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'beds-desc' | 'newest';
}

interface SearchAndFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  totalResults: number;
}

const BOSTON_NEIGHBORHOODS = [
  'All Greater Boston',
  'Theater District / Back Bay',
  'Back Bay',
  'Malden Center / Greater Boston',
  'Seaport / Fort Point',
  'Cambridge / Harvard Square',
  'South End'
];

const AMENITY_OPTIONS = [
  'In-Unit Washer & Dryer',
  'Valet Parking Included',
  'Dedicated Off-Street Parking',
  '2 Private Balconies',
  'Central Air Conditioning',
  'Sub-Zero & Wolf Appliances',
  '24/7 Concierge Service',
  'Hardwood Floors',
  'Shared Roof Deck with Skyline Views'
];

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  filters,
  onFilterChange,
  totalResults
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearchChange = (query: string) => {
    onFilterChange({ ...filters, searchQuery: query });
  };

  const handleNeighborhoodSelect = (n: string) => {
    onFilterChange({ ...filters, neighborhood: n === 'All Greater Boston' ? '' : n });
  };

  const handleBedroomsChange = (beds: string) => {
    onFilterChange({ ...filters, bedrooms: beds });
  };

  const handleAmenityToggle = (amenity: string) => {
    const exists = filters.amenities.includes(amenity);
    const updated = exists
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    onFilterChange({ ...filters, amenities: updated });
  };

  const handleReset = () => {
    onFilterChange({
      searchQuery: '',
      neighborhood: '',
      minPrice: 0,
      maxPrice: 10000,
      bedrooms: 'any',
      bathrooms: 'any',
      pets: 'any',
      amenities: [],
      sortBy: 'featured'
    });
  };

  const hasActiveFilters =
    filters.searchQuery ||
    filters.neighborhood ||
    filters.bedrooms !== 'any' ||
    filters.bathrooms !== 'any' ||
    filters.pets !== 'any' ||
    filters.amenities.length > 0 ||
    filters.minPrice > 0 ||
    filters.maxPrice < 10000;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs p-4 sm:p-5 mb-6">
      {/* Top Search Bar & Main Controls */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search Boston address, unit, neighborhood, zip code..."
            value={filters.searchQuery}
            onChange={e => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2240] focus:bg-white transition"
          />
          {filters.searchQuery && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Bedroom Filter */}
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
          {[
            { label: 'All Beds', value: 'any' },
            { label: '1 BR', value: '1' },
            { label: '2 BR', value: '2' },
            { label: '3 BR', value: '3' },
            { label: '4+ BR', value: '4' }
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => handleBedroomsChange(opt.value)}
              className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                filters.bedrooms === opt.value
                  ? 'bg-[#0A2240] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={filters.sortBy}
            onChange={e => onFilterChange({ ...filters, sortBy: e.target.value as FilterState['sortBy'] })}
            className="w-full md:w-auto px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0A2240] appearance-none pr-8 cursor-pointer"
          >
            <option value="featured">Sort: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="beds-desc">Bedrooms (Most)</option>
            <option value="newest">Recently Listed</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Advanced Filters Toggle Button */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition ${
            showAdvanced || filters.amenities.length > 0 || filters.pets !== 'any'
              ? 'bg-blue-50 border-blue-200 text-[#1E3A8A]'
              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters</span>
          {(filters.amenities.length > 0 || filters.pets !== 'any' || filters.minPrice > 0) && (
            <span className="w-2 h-2 rounded-full bg-[#1E3A8A]"></span>
          )}
        </button>
      </div>

      {/* Neighborhood Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 mt-2 scrollbar-none text-xs">
        <span className="text-slate-400 font-medium text-[11px] whitespace-nowrap mr-1">
          Boston Areas:
        </span>
        {BOSTON_NEIGHBORHOODS.map(n => {
          const isSelected =
            (n === 'All Greater Boston' && !filters.neighborhood) ||
            filters.neighborhood === n;
          return (
            <button
              key={n}
              onClick={() => handleNeighborhoodSelect(n)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-all font-medium ${
                isSelected
                  ? 'bg-slate-900 text-white font-semibold shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              {n}
            </button>
          );
        })}
      </div>

      {/* Advanced Filters Expandable Drawer */}
      {showAdvanced && (
        <div className="pt-4 mt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs animate-in fade-in duration-150">
          {/* Price Range */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1.5">
              Monthly Rent Range: ${filters.minPrice} - ${filters.maxPrice >= 10000 ? '10,000+' : filters.maxPrice}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="250"
                min="0"
                max="10000"
                placeholder="Min $"
                value={filters.minPrice || ''}
                onChange={e => onFilterChange({ ...filters, minPrice: Number(e.target.value) || 0 })}
                className="w-1/2 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
              <span className="text-slate-400">to</span>
              <input
                type="number"
                step="250"
                min="0"
                max="15000"
                placeholder="Max $"
                value={filters.maxPrice === 10000 ? '' : filters.maxPrice}
                onChange={e => onFilterChange({ ...filters, maxPrice: Number(e.target.value) || 10000 })}
                className="w-1/2 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          {/* Pet Policy */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1.5">
              Pet Policy
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { label: 'Any', value: 'any' },
                { label: 'Cats OK', value: 'cats' },
                { label: 'Dogs OK', value: 'dogs' }
              ].map(p => (
                <button
                  key={p.value}
                  onClick={() => onFilterChange({ ...filters, pets: p.value })}
                  className={`py-1.5 px-2 rounded-lg text-center border font-medium transition ${
                    filters.pets === p.value
                      ? 'bg-blue-50 border-blue-200 text-[#1E3A8A] font-semibold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bathrooms */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1.5">
              Bathrooms
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { label: 'Any Bath', value: 'any' },
                { label: '1+ Bath', value: '1' },
                { label: '2+ Baths', value: '2' }
              ].map(b => (
                <button
                  key={b.value}
                  onClick={() => onFilterChange({ ...filters, bathrooms: b.value })}
                  className={`py-1.5 px-2 rounded-lg text-center border font-medium transition ${
                    filters.bathrooms === b.value
                      ? 'bg-blue-50 border-blue-200 text-[#1E3A8A] font-semibold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Specific Amenities */}
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="block font-semibold text-slate-800 mb-2">
              Specific Boston Amenities
            </label>
            <div className="flex flex-wrap gap-2">
              {AMENITY_OPTIONS.map(amenity => {
                const checked = filters.amenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    onClick={() => handleAmenityToggle(amenity)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition text-xs ${
                      checked
                        ? 'bg-[#0A2240] border-[#0A2240] text-white font-medium shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {checked && <Check className="w-3 h-3" />}
                    <span>{amenity}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Results Bar & Active Filter Indicator */}
      <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-xs text-slate-500">
        <div>
          Showing <span className="font-bold text-slate-900">{totalResults}</span> available rental properties in Boston & Greater Boston
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-slate-500 hover:text-red-600 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>
    </div>
  );
};
