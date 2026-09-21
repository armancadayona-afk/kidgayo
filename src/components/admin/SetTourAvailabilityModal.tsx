import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Video,
  UserCheck,
  Plus,
  Trash2,
  Info
} from 'lucide-react';
import { Property, RentalApplication, UnitTourAvailability } from '../../types';
import { useApp } from '../../context/AppContext';

interface SetTourAvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
  application?: RentalApplication | null;
}

const DEFAULT_TIME_SLOTS = [
  '10:00 AM',
  '11:30 AM',
  '1:00 PM',
  '2:30 PM',
  '4:00 PM',
  '5:30 PM'
];

export const SetTourAvailabilityModal: React.FC<SetTourAvailabilityModalProps> = ({
  isOpen,
  onClose,
  property,
  application
}) => {
  const { setUnitTourAvailability } = useApp();

  const [enabled, setEnabled] = useState(true);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [newDateInput, setNewDateInput] = useState('');
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>(DEFAULT_TIME_SLOTS);
  const [newTimeInput, setNewTimeInput] = useState('');
  const [tourType, setTourType] = useState<'In-Person' | 'Virtual Video Tour' | 'Both'>('Both');
  const [instructions, setInstructions] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Initialize or populate from existing property availability
  useEffect(() => {
    if (property) {
      if (property.tourAvailability) {
        setEnabled(property.tourAvailability.enabled);
        setSelectedDates(property.tourAvailability.availableDates || []);
        setSelectedTimeSlots(property.tourAvailability.timeSlots || DEFAULT_TIME_SLOTS);
        setTourType(property.tourAvailability.tourType || 'Both');
        setInstructions(property.tourAvailability.meetingInstructions || '');
      } else {
        // Generate upcoming 3 business days by default
        const dates: string[] = [];
        const today = new Date();
        for (let i = 1; i <= 5; i++) {
          const nextDay = new Date(today);
          nextDay.setDate(today.getDate() + i);
          // Skip Sundays (0)
          if (nextDay.getDay() !== 0) {
            dates.push(nextDay.toISOString().split('T')[0]);
          }
          if (dates.length >= 3) break;
        }
        setSelectedDates(dates);
        setSelectedTimeSlots(DEFAULT_TIME_SLOTS);
        setTourType('Both');
        setInstructions(
          `Please arrive 5 minutes before your scheduled slot at ${property.streetAddress}${property.unit ? ' ' + property.unit : ''}. Dial intercom buzzer or call (617) 555-0192 for entry. Street parking available.`
        );
      }
    }
  }, [property, isOpen]);

  if (!isOpen || !property) return null;

  const handleAddDate = () => {
    if (newDateInput && !selectedDates.includes(newDateInput)) {
      setSelectedDates(prev => [...prev, newDateInput].sort());
      setNewDateInput('');
    }
  };

  const handleRemoveDate = (dateToRemove: string) => {
    setSelectedDates(prev => prev.filter(d => d !== dateToRemove));
  };

  const handleAddTimeSlot = () => {
    if (newTimeInput.trim() && !selectedTimeSlots.includes(newTimeInput.trim())) {
      setSelectedTimeSlots(prev => [...prev, newTimeInput.trim()]);
      setNewTimeInput('');
    }
  };

  const handleRemoveTimeSlot = (slotToRemove: string) => {
    setSelectedTimeSlots(prev => prev.filter(s => s !== slotToRemove));
  };

  const handleSave = () => {
    const updatedAvailability: UnitTourAvailability = {
      enabled,
      availableDates: selectedDates,
      timeSlots: selectedTimeSlots,
      tourType,
      meetingInstructions: instructions,
      updatedAt: new Date().toISOString()
    };

    setUnitTourAvailability(property.id, updatedAvailability);

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200 relative">
        {/* Header */}
        <div className="p-6 sm:px-8 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-800 text-[11px] font-bold mb-2">
              <Calendar className="w-3 h-3 text-emerald-600" />
              <span>Landlord Unit Tour Scheduling</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Set Unit Tour Availability
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Configure open tour dates and available time slots for{' '}
              <strong className="text-slate-800 font-semibold">{property.streetAddress}{property.unit ? ' ' + property.unit : ''}</strong>.
            </p>
            {application && (
              <div className="mt-2.5 flex items-center gap-2 px-3 py-1.5 bg-blue-50/80 border border-blue-100 rounded-xl text-xs text-blue-900">
                <UserCheck className="w-3.5 h-3.5 text-[#0066FF]" />
                <span>
                  Applicant: <strong>{application.applicant.fullName}</strong> ({application.status})
                </span>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {savedSuccess ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Tour Availability Published!</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              The unit tour availability schedule is now active. Accepted tenants can immediately select from these dates and time slots to confirm their tour.
            </p>
          </div>
        ) : (
          <div className="p-6 sm:p-8 space-y-6 max-h-[78vh] overflow-y-auto">
            {/* Availability Toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div>
                <span className="font-bold text-sm text-slate-900 block">
                  Enable Tour Scheduling for this Unit
                </span>
                <span className="text-xs text-slate-500">
                  When enabled, approved applicants are permitted to choose from the dates & slots below.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setEnabled(!enabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  enabled ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Section 1: Available Dates */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#0066FF]" />
                  <span>Available Tour Dates</span>
                </label>
                <span className="text-[11px] text-slate-500">
                  {selectedDates.length} {selectedDates.length === 1 ? 'date' : 'dates'} selected
                </span>
              </div>

              {/* Date Pills */}
              <div className="flex flex-wrap gap-2">
                {selectedDates.map(date => {
                  const dateObj = new Date(date + 'T12:00:00');
                  const formatted = dateObj.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  });
                  return (
                    <span
                      key={date}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 text-[#0066FF] font-semibold text-xs rounded-xl"
                    >
                      <span>{formatted}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveDate(date)}
                        className="hover:text-red-500 transition"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  );
                })}
              </div>

              {/* Add Date Input */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="date"
                  value={newDateInput}
                  onChange={e => setNewDateInput(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0066FF]"
                />
                <button
                  type="button"
                  onClick={handleAddDate}
                  disabled={!newDateInput}
                  className="px-3 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white text-xs font-semibold rounded-xl transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Date</span>
                </button>
              </div>
            </div>

            {/* Section 2: Time Slots */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#0066FF]" />
                  <span>Available Time Slots</span>
                </label>
                <span className="text-[11px] text-slate-500">
                  {selectedTimeSlots.length} slots
                </span>
              </div>

              {/* Time Slot Chips */}
              <div className="flex flex-wrap gap-2">
                {selectedTimeSlots.map(slot => (
                  <span
                    key={slot}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-800 font-semibold text-xs rounded-xl"
                  >
                    <span>{slot}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTimeSlot(slot)}
                      className="hover:text-red-500 transition text-slate-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add Custom Time Slot */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  placeholder="e.g. 3:00 PM"
                  value={newTimeInput}
                  onChange={e => setNewTimeInput(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0066FF] max-w-[140px]"
                />
                <button
                  type="button"
                  onClick={handleAddTimeSlot}
                  disabled={!newTimeInput.trim()}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Time Slot</span>
                </button>
              </div>
            </div>

            {/* Section 3: Tour Format Type */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Permitted Tour Types
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {(['Both', 'In-Person', 'Virtual Video Tour'] as const).map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setTourType(type)}
                    className={`py-2 px-3 rounded-xl font-semibold border text-center transition ${
                      tourType === type
                        ? 'bg-blue-50 border-[#0066FF] text-[#0066FF] ring-2 ring-[#0066FF]/20'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {type === 'Both' ? 'In-Person & Virtual' : type}
                  </button>
                ))}
              </div>
            </div>

            {/* Section 4: Access & Meeting Instructions */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Arrival & Access Instructions for Tenant
              </label>
              <textarea
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
                rows={3}
                className="w-full p-3 border border-slate-200 rounded-xl text-xs bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0066FF]"
                placeholder="Entry door instructions, buzzer codes, parking details..."
              />
              <p className="text-[11px] text-slate-400">
                Shown to approved applicants upon booking their tour slot.
              </p>
            </div>

            {/* Preview Box */}
            <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Tenant Booking Experience</span>
              </div>
              <p className="text-emerald-800 text-[11px]">
                Once saved, applicants with an accepted application will be able to click &ldquo;Schedule Tour&rdquo;, choose from your {selectedDates.length} dates and {selectedTimeSlots.length} slots, and immediately receive access instructions.
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 sm:px-8 border-t border-slate-100 bg-white flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold transition"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={selectedDates.length === 0 || selectedTimeSlots.length === 0}
            className="px-6 py-2.5 bg-[#0066FF] hover:bg-blue-700 disabled:bg-slate-200 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save & Publish Tour Availability</span>
          </button>
        </div>
      </div>
    </div>
  );
};
