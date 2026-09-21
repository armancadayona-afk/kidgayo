import React, { useState, useEffect } from 'react';
import {
  X,
  Send,
  Calendar,
  Clock,
  Video,
  User,
  CheckCircle2,
  MapPin,
  Building,
  Lock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  FileText,
  Sparkles
} from 'lucide-react';
import { Property, RentalApplication } from '../types';
import { useApp } from '../context/AppContext';

interface InquiryModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenApplyModal?: (property: Property) => void;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({
  property,
  isOpen,
  onClose,
  onOpenApplyModal
}) => {
  const {
    currentUser,
    submitInquiry,
    getUserApplicationForProperty,
    scheduleTourForApplication,
    setView
  } = useApp();

  const application = property ? getUserApplicationForProperty(property.id, currentUser?.email) : undefined;
  const isApplicationSubmitted = !!application;
  const isApplicationAccepted = application?.status === 'Accepted' || application?.status === 'Lease Sent';

  // Tour selection state
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [tourType, setTourType] = useState<'In-Person' | 'Virtual Video Tour'>('In-Person');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [confirmDetails, setConfirmDetails] = useState<{ date: string; time: string; type: string } | null>(null);

  // Initialize selected date and time from property availability if present
  useEffect(() => {
    if (property?.tourAvailability?.enabled) {
      if (property.tourAvailability.availableDates?.length > 0) {
        setSelectedDate(property.tourAvailability.availableDates[0]);
      }
      if (property.tourAvailability.timeSlots?.length > 0) {
        setSelectedTime(property.tourAvailability.timeSlots[0]);
      }
    } else {
      setSelectedDate('2026-09-24');
      setSelectedTime('2:00 PM');
    }
  }, [property]);

  if (!isOpen || !property) return null;

  const handleScheduleTour = (e: React.FormEvent) => {
    e.preventDefault();

    if (application) {
      scheduleTourForApplication(application.id, {
        date: selectedDate,
        time: selectedTime,
        type: tourType,
        notes: message
      });
    } else {
      submitInquiry({
        propertyId: property.id,
        propertyTitle: property.title,
        propertyAddress: `${property.streetAddress}${property.unit ? ' ' + property.unit : ''}, ${property.city}, MA`,
        userName: currentUser?.fullName || 'Interested Tenant',
        userEmail: currentUser?.email || 'tenant@boston.com',
        userPhone: currentUser?.phone || '(617) 555-0100',
        moveInDate: property.availableDate || '2026-10-01',
        tourRequested: true,
        tourDate: selectedDate,
        tourTime: selectedTime,
        tourType,
        message: message || `Tour requested for ${property.streetAddress} on ${selectedDate} at ${selectedTime}.`
      });
    }

    setConfirmDetails({
      date: selectedDate,
      time: selectedTime,
      type: tourType
    });
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Confirmation State */}
        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Unit Tour Confirmed!</h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Your tour for <strong className="text-slate-900">{property.streetAddress}{property.unit ? ' ' + property.unit : ''}</strong> is scheduled for{' '}
              <strong className="text-[#0066FF]">{confirmDetails?.date}</strong> at{' '}
              <strong className="text-[#0066FF]">{confirmDetails?.time}</strong> ({confirmDetails?.type}).
            </p>

            {property.tourAvailability?.meetingInstructions && (
              <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl text-left text-xs text-blue-900">
                <span className="font-bold block mb-0.5">Arrival & Access Instructions:</span>
                <p className="text-blue-800 text-[11px] leading-relaxed">
                  {property.tourAvailability.meetingInstructions}
                </p>
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                  setView('tenant-portal');
                }}
                className="px-5 py-2.5 bg-[#0066FF] hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-xs"
              >
                View in Tenant Portal
              </button>
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : !isApplicationSubmitted ? (
          /* GATED STATE: Application NOT Submitted Yet */
          <div className="p-6 sm:p-8 space-y-5">
            {/* Unit Info Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <img
                src={property.photos[0]}
                alt={property.title}
                className="w-16 h-16 rounded-xl object-cover border border-slate-200 flex-shrink-0"
              />
              <div>
                <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">
                  Application Required
                </span>
                <h3 className="font-bold text-slate-900 text-sm line-clamp-1">
                  {property.streetAddress} {property.unit}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  ${property.monthlyRent.toLocaleString()}/mo • {property.neighborhood}
                </p>
              </div>
            </div>

            {/* Application Requirement Callout */}
            <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <Lock className="w-4 h-4 text-amber-600" />
                <span>Tour Scheduling Policy</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                Only prospective tenants with a <strong>submitted rental application</strong> are eligible to ask questions or schedule unit tours.
              </p>
              <p className="text-[11px] text-amber-700 leading-relaxed">
                Once your application is submitted, our landlord David Sterling will review your pre-qualification details, approve your application, and publish this unit&apos;s active tour schedule so you can select your preferred viewing time slot.
              </p>
            </div>

            {/* Two Step Flow Indicator */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-semibold text-slate-700">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] font-bold">
                  1
                </span>
                <span>Submit Rental Application (Takes ~3 mins)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[11px] font-bold">
                  2
                </span>
                <span>Landlord Approves &gt; Choose from Unit Tour Availability Slots</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenApplyModal) {
                    onOpenApplyModal(property);
                  }
                }}
                className="w-full py-3 px-5 bg-[#0066FF] hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>Submit Rental Application First</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition text-center"
              >
                Browse Other Boston Units
              </button>
            </div>
          </div>
        ) : (
          /* UNLOCKED STATE: Application HAS Been Submitted */
          <div className="p-6 sm:p-8 space-y-5">
            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <img
                src={property.photos[0]}
                alt={property.title}
                className="w-16 h-16 rounded-xl object-cover border border-slate-200 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Application on File: {application.status}</span>
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm line-clamp-1">
                  {property.streetAddress} {property.unit}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Applicant: {application.applicant.fullName}
                </p>
              </div>
            </div>

            {/* Status Condition */}
            {isApplicationAccepted ? (
              property.tourAvailability?.enabled ? (
                /* Landlord accepted application AND set unit availability */
                <form onSubmit={handleScheduleTour} className="space-y-4 text-xs">
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-900 text-xs">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>Unit Tour Availability Opened by Landlord</span>
                    </div>
                    <p className="text-[11px] text-emerald-800">
                      Your application has been accepted! Please select from the landlord&apos;s available dates and time slots below.
                    </p>
                  </div>

                  {/* Available Dates */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[11px]">
                      1. Select an Available Tour Date
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {property.tourAvailability.availableDates.map(date => {
                        const dateObj = new Date(date + 'T12:00:00');
                        const formatted = dateObj.toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        });
                        const isSelected = selectedDate === date;
                        return (
                          <button
                            key={date}
                            type="button"
                            onClick={() => setSelectedDate(date)}
                            className={`py-2 px-3 rounded-xl font-bold text-xs border transition ${
                              isSelected
                                ? 'bg-blue-50 border-[#0066FF] text-[#0066FF] ring-2 ring-[#0066FF]/20'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {formatted}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Available Time Slots */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[11px]">
                      2. Select Available Time Slot
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {property.tourAvailability.timeSlots.map(slot => {
                        const isSelected = selectedTime === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedTime(slot)}
                            className={`py-1.5 px-3 rounded-xl font-semibold text-xs border transition ${
                              isSelected
                                ? 'bg-blue-50 border-[#0066FF] text-[#0066FF] ring-2 ring-[#0066FF]/20'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tour Type */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[11px]">
                      3. Tour Format
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['In-Person', 'Virtual Video Tour'] as const).map(type => (
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
                          {type === 'In-Person' ? '🏢 In-Person Viewing' : '📱 Virtual FaceTime/Zoom'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Landlord Access Instructions */}
                  {property.tourAvailability.meetingInstructions && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-600">
                      <strong className="text-slate-800 block">Landlord Access Instructions:</strong>
                      <span>{property.tourAvailability.meetingInstructions}</span>
                    </div>
                  )}

                  {/* Notes */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Notes or Questions for Landlord (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder="e.g. Bringing my roommate, will arrive 5 mins early..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0066FF] focus:bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-5 bg-[#0066FF] hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Confirm & Schedule Unit Tour</span>
                  </button>
                </form>
              ) : (
                /* Landlord accepted application, but hasn't set unit tour schedule yet */
                <form onSubmit={handleScheduleTour} className="space-y-4 text-xs">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-blue-900 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-[#0066FF]" />
                      <span>Application Accepted! Awaiting Landlord Schedule</span>
                    </div>
                    <p className="text-[11px] text-blue-800 leading-relaxed">
                      Landlord David Sterling has accepted your application. The landlord is in the process of publishing the active tour availability schedule. You may submit your preferred date and time below to request a specific window.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Preferred Date</label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={e => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Preferred Time</label>
                      <input
                        type="text"
                        value={selectedTime}
                        onChange={e => setSelectedTime(e.target.value)}
                        placeholder="e.g. 2:00 PM"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Message for Landlord</label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder="Let the landlord know any special requests regarding tour timing..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-5 bg-[#0066FF] hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Tour Request to Landlord</span>
                  </button>
                </form>
              )
            ) : (
              /* Application is Pending Review */
              <form onSubmit={handleScheduleTour} className="space-y-4 text-xs">
                <div className="p-4 bg-amber-50/90 border border-amber-200 rounded-2xl space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900 text-xs">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>Application Under Review by Landlord</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Your rental application was submitted on{' '}
                    <strong>{new Date(application.submittedAt).toLocaleDateString()}</strong>. Once the landlord accepts your application, the unit&apos;s tour availability schedule will be activated for you to book a confirmed slot.
                  </p>
                  <p className="text-[11px] text-amber-700">
                    You may submit a tentative tour time request or question below for the landlord while review is in progress.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Requested Date</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={e => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Requested Time</label>
                    <input
                      type="text"
                      value={selectedTime}
                      onChange={e => setSelectedTime(e.target.value)}
                      placeholder="e.g. 11:30 AM"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Inquiry / Note</label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Ask questions about the unit or propose viewing times..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Tour Request & Note</span>
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
