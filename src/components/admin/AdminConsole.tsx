import React, { useState } from 'react';
import {
  Building2,
  FileSpreadsheet,
  Plus,
  Link,
  Users,
  FileText,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  Trash2,
  Edit3,
  Calendar,
  Send,
  Eye,
  ShieldCheck,
  RotateCcw,
  Check,
  DollarSign,
  MapPin,
  ChevronRight,
  Filter,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Property, RentalApplication, Lease, PaymentRecord } from '../../types';
import { AddPropertyUrlModal } from './AddPropertyUrlModal';
import { BulkUrlImportModal } from './BulkUrlImportModal';
import { CreateLeaseModal } from './CreateLeaseModal';
import { SetTourAvailabilityModal } from './SetTourAvailabilityModal';

export const AdminConsole: React.FC = () => {
  const {
    properties,
    inquiries,
    applications,
    leases,
    payments,
    landlordInstructions,
    addProperty,
    addBulkProperties,
    updateProperty,
    deleteProperty,
    updateApplicationStatus,
    updateInquiryStatus,
    countersignLeaseLandlord,
    verifyPayment,
    recordPayment,
    updateLandlordInstructions,
    resetToInitialData
  } = useApp();

  const [activeTab, setActiveTab] = useState<'properties' | 'applications' | 'inquiries' | 'leases' | 'payments'>('properties');

  // Modals state
  const [addUrlModalOpen, setAddUrlModalOpen] = useState(false);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [leaseModalOpen, setLeaseModalOpen] = useState(false);
  const [selectedAppForLease, setSelectedAppForLease] = useState<RentalApplication | null>(null);
  const [selectedPropForLease, setSelectedPropForLease] = useState<Property | null>(null);

  // Tour Availability modal state
  const [tourModalOpen, setTourModalOpen] = useState(false);
  const [tourModalProperty, setTourModalProperty] = useState<Property | null>(null);
  const [tourModalApp, setTourModalApp] = useState<RentalApplication | null>(null);

  // Payment settings & manual log modal state
  const [editInstructionsOpen, setEditInstructionsOpen] = useState(false);
  const [logManualPaymentOpen, setLogManualPaymentOpen] = useState(false);
  const [viewLeaseModal, setViewLeaseModal] = useState<Lease | null>(null);

  // Instructions form state
  const [zelleEmail, setZelleEmail] = useState(landlordInstructions.zelleEmail);
  const [zellePhone, setZellePhone] = useState(landlordInstructions.zellePhone);
  const [venmoHandle, setVenmoHandle] = useState(landlordInstructions.venmoHandle);
  const [bankName, setBankName] = useState(landlordInstructions.bankName);
  const [bankAccountHolder, setBankAccountHolder] = useState(landlordInstructions.bankAccountHolder);
  const [bankRoutingNumber, setBankRoutingNumber] = useState(landlordInstructions.bankRoutingNumber);
  const [bankAccountNumberLast4, setBankAccountNumberLast4] = useState(landlordInstructions.bankAccountNumberLast4);
  const [checkMailingAddress, setCheckMailingAddress] = useState(landlordInstructions.checkMailingAddress);
  const [generalNotes, setGeneralNotes] = useState(landlordInstructions.generalNotes);

  // Manual payment form state
  const [manualPayPropId, setManualPayPropId] = useState(properties[0]?.id || '');
  const [manualTenantName, setManualTenantName] = useState('Elena Rostova');
  const [manualTenantEmail, setManualTenantEmail] = useState('elena.rostova@biogen.com');
  const [manualAmount, setManualAmount] = useState(properties[0]?.monthlyRent || 3500);
  const [manualMethod, setManualMethod] = useState<PaymentRecord['paymentMethod']>('Cashier Check / Mail');
  const [manualRef, setManualRef] = useState('CHK-' + Math.floor(100000 + Math.random() * 900000));
  const [manualType, setManualType] = useState<PaymentRecord['paymentType']>('Monthly Rent');

  // Stats
  const totalRentRoll = properties.reduce((acc, p) => acc + p.monthlyRent, 0);
  const pendingAppsCount = applications.filter(a => a.status === 'Pending').length;
  const newInquiriesCount = inquiries.filter(i => i.status === 'New').length;
  const pendingPaymentsCount = payments.filter(p => p.status === 'Pending Verification').length;
  const activeLeasesCount = leases.filter(l => l.status === 'Active' || l.status === 'Sent to Tenant').length;

  const handleSaveInstructions = (e: React.FormEvent) => {
    e.preventDefault();
    updateLandlordInstructions({
      zelleEmail,
      zellePhone,
      venmoHandle,
      bankName,
      bankAccountHolder,
      bankRoutingNumber,
      bankAccountNumberLast4,
      checkMailingAddress,
      generalNotes
    });
    setEditInstructionsOpen(false);
  };

  const handleSaveManualPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const prop = properties.find(p => p.id === manualPayPropId) || properties[0];

    recordPayment({
      propertyId: prop.id,
      propertyTitle: prop.title,
      tenantName: manualTenantName,
      tenantEmail: manualTenantEmail,
      amount: manualAmount,
      paymentType: manualType,
      paymentMethod: manualMethod,
      referenceNumber: manualRef,
      paymentDate: new Date().toISOString().split('T')[0],
      notes: 'Manually logged by landlord'
    });

    setLogManualPaymentOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Landlord Console Header Banner */}
      <div className="bg-gradient-to-r from-[#07172B] via-[#0A2240] to-[#133A66] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-0.5 bg-blue-400/20 border border-blue-300/30 text-blue-200 font-bold text-[11px] rounded-full uppercase tracking-wider">
                1 Landlord Console (Sole Admin)
              </span>
              <span className="text-slate-300 text-xs">David Sterling • Boston Beacon Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Landlord Console
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
              Unified administrative portal for your Boston rental portfolio. Import listings via Compass & Apartments.com links or CSV, review applications, set tour schedules, issue Massachusetts leases, and track manual payments.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setAddUrlModalOpen(true)}
              className="px-4 py-2.5 bg-white text-[#0A2240] hover:bg-slate-100 text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              <Link className="w-3.5 h-3.5" />
              <span>Add via URL Link</span>
            </button>

            <button
              onClick={() => setBulkModalOpen(true)}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl backdrop-blur-xs transition border border-white/20 flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Bulk CSV Import</span>
            </button>

            <button
              onClick={resetToInitialData}
              title="Reset sample listings to default"
              className="p-2.5 bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white rounded-xl transition border border-white/20"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-6 border-t border-white/10 text-xs">
          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <span className="text-slate-300 font-medium block text-[11px]">Properties</span>
            <div className="text-xl font-black mt-0.5">{properties.length} Active</div>
            <span className="text-[10px] text-slate-400">Boston & Greater Boston</span>
          </div>

          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <span className="text-slate-300 font-medium block text-[11px]">Applications</span>
            <div className="text-xl font-black mt-0.5 text-amber-300">
              {pendingAppsCount} Pending
            </div>
            <span className="text-[10px] text-slate-400">{applications.length} Total</span>
          </div>

          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <span className="text-slate-300 font-medium block text-[11px]">Inquiries / Tours</span>
            <div className="text-xl font-black mt-0.5 text-blue-200">
              {newInquiriesCount} New
            </div>
            <span className="text-[10px] text-slate-400">{inquiries.length} Inquiries</span>
          </div>

          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <span className="text-slate-300 font-medium block text-[11px]">Leases</span>
            <div className="text-xl font-black mt-0.5 text-emerald-300">
              {activeLeasesCount} Active
            </div>
            <span className="text-[10px] text-slate-400">{leases.length} Drafted</span>
          </div>

          <div className="bg-white/5 p-3 rounded-xl border border-white/10 col-span-2 sm:col-span-1">
            <span className="text-slate-300 font-medium block text-[11px]">Manual Payments</span>
            <div className="text-xl font-black mt-0.5 text-emerald-400">
              {pendingPaymentsCount} To Verify
            </div>
            <span className="text-[10px] text-slate-400">Zelle / Venmo / Checks</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-2xs gap-1 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('properties')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition whitespace-nowrap ${
            activeTab === 'properties'
              ? 'bg-[#0A2240] text-white shadow-xs'
              : 'text-slate-600 hover:text-[#0A2240] hover:bg-blue-50/60'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Properties Portfolio ({properties.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('applications')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition whitespace-nowrap ${
            activeTab === 'applications'
              ? 'bg-[#0A2240] text-white shadow-xs'
              : 'text-slate-600 hover:text-[#0A2240] hover:bg-blue-50/60'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Rental Applications ({applications.length})</span>
          {pendingAppsCount > 0 && (
            <span className="px-1.5 py-0.2 bg-amber-400 text-slate-900 text-[10px] font-black rounded-full">
              {pendingAppsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition whitespace-nowrap ${
            activeTab === 'inquiries'
              ? 'bg-[#0A2240] text-white shadow-xs'
              : 'text-slate-600 hover:text-[#0A2240] hover:bg-blue-50/60'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Inquiries & Tours ({inquiries.length})</span>
          {newInquiriesCount > 0 && (
            <span className="px-1.5 py-0.2 bg-blue-200 text-[#0A2240] text-[10px] font-black rounded-full">
              {newInquiriesCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('leases')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition whitespace-nowrap ${
            activeTab === 'leases'
              ? 'bg-[#0A2240] text-white shadow-xs'
              : 'text-slate-600 hover:text-[#0A2240] hover:bg-blue-50/60'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Leases & Agreements ({leases.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition whitespace-nowrap ${
            activeTab === 'payments'
              ? 'bg-[#0A2240] text-white shadow-xs'
              : 'text-slate-600 hover:text-[#0A2240] hover:bg-blue-50/60'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Manual Payments ({payments.length})</span>
          {pendingPaymentsCount > 0 && (
            <span className="px-1.5 py-0.2 bg-emerald-400 text-slate-900 text-[10px] font-black rounded-full">
              {pendingPaymentsCount}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: PROPERTIES */}
      {activeTab === 'properties' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <h2 className="font-bold text-slate-900 text-base">Your Boston Rental Portfolio</h2>
              <p className="text-xs text-slate-500">
                Manage listings, add single units from Compass & Apartments.com, or import bulk URLs from CSV.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAddUrlModalOpen(true)}
                className="px-3.5 py-2 bg-[#0066FF] hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-2xs flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add by URL</span>
              </button>
              <button
                onClick={() => setBulkModalOpen(true)}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Bulk CSV</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties.map(property => (
              <div
                key={property.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-16/9 bg-slate-100">
                    <img
                      src={property.photos[0]}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase text-white ${
                        property.sourcePortal === 'compass' ? 'bg-slate-900' : 'bg-blue-900'
                      }`}>
                        {property.sourcePortal}
                      </span>
                    </div>
                    <div className="absolute top-2.5 right-2.5">
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                        property.status === 'Available'
                          ? 'bg-emerald-500 text-white'
                          : property.status === 'Leased'
                          ? 'bg-slate-800 text-white'
                          : 'bg-amber-500 text-white'
                      }`}>
                        {property.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1E3A8A]">{property.neighborhood}</span>
                      <span className="text-base font-black text-slate-900">
                        ${property.monthlyRent.toLocaleString()}/mo
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm line-clamp-1">
                      {property.streetAddress} {property.unit}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {property.city}, {property.state} {property.zipCode} • {property.bedrooms}BR / {property.bathrooms}BA ({property.squareFeet} sqft)
                    </p>

                    {property.sourceUrl && (
                      <a
                        href={property.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-[#0A2240] truncate max-w-full"
                      >
                        <span className="truncate">{property.sourceUrl}</span>
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                  <button
                    onClick={() => {
                      const newStatus = property.status === 'Available' ? 'Leased' : 'Available';
                      updateProperty({ ...property, status: newStatus });
                    }}
                    className="px-2.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold rounded-lg text-[11px]"
                  >
                    Mark {property.status === 'Available' ? 'Leased' : 'Available'}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setTourModalProperty(property);
                        setTourModalApp(null);
                        setTourModalOpen(true);
                      }}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition ${
                        property.tourAvailability?.enabled
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                      title="Set unit tour schedule availability"
                    >
                      <Calendar className="w-3 h-3 text-emerald-600" />
                      <span>{property.tourAvailability?.enabled ? 'Tours Active' : 'Set Tours'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedPropForLease(property);
                        setLeaseModalOpen(true);
                      }}
                      className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#0066FF] font-semibold rounded-lg text-[11px]"
                    >
                      Create Lease
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete ${property.streetAddress} from portfolio?`)) {
                          deleteProperty(property.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                      title="Delete listing"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: APPLICATIONS */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200">
            <h2 className="font-bold text-slate-900 text-base">Rental Applications Review</h2>
            <p className="text-xs text-slate-500">
              Standardized Avail-style applications. Review verified income, credit authorization, and initiate Massachusetts lease agreements.
            </p>
          </div>

          <div className="space-y-3">
            {applications.map(app => {
              const incomeRatio = Math.round((app.monthlyRent / app.employment.monthlyIncome) * 100);
              const matchedProp = properties.find(p => p.id === app.propertyId);
              return (
                <div
                  key={app.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-base">{app.applicant.fullName}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          app.status === 'Accepted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'Declined'
                            ? 'bg-red-100 text-red-800'
                            : app.status === 'Lease Sent'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Applied for: <strong className="text-slate-800">{app.propertyAddress}</strong> (${app.monthlyRent.toLocaleString()}/mo)
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-slate-400">Submitted:</span>
                      <div className="text-xs font-medium text-slate-600">
                        {new Date(app.submittedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <span className="text-[11px] text-slate-400 font-semibold block uppercase">Applicant Contact</span>
                      <div className="font-bold text-slate-800 mt-1">{app.applicant.email}</div>
                      <div className="text-slate-600">{app.applicant.phone}</div>
                      <div className="text-slate-500 text-[11px] mt-1">{app.applicant.currentAddress}</div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl">
                      <span className="text-[11px] text-slate-400 font-semibold block uppercase">Employment & Income</span>
                      <div className="font-bold text-slate-800 mt-1">{app.employment.employer}</div>
                      <div className="text-slate-600">{app.employment.position}</div>
                      <div className="font-extrabold text-emerald-700 mt-1">
                        ${app.employment.monthlyIncome.toLocaleString()} / mo gross
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl">
                      <span className="text-[11px] text-slate-400 font-semibold block uppercase">Financial Qualification</span>
                      <div className="text-base font-black text-slate-900 mt-1">
                        {incomeRatio}% Rent-to-Income
                      </div>
                      <div className="text-[11px] text-slate-600 mt-0.5">
                        {incomeRatio <= 33 ? '✓ Exceeds 3x rent threshold' : 'Moderate rent burden'}
                      </div>
                      <div className="text-emerald-600 text-[11px] font-semibold mt-1">
                        ✓ Background Check Authorized
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl">
                      <span className="text-[11px] text-slate-400 font-semibold block uppercase">Occupants & Pets</span>
                      <div className="font-bold text-slate-800 mt-1">
                        {app.occupants.totalOccupants} Occupant ({app.occupants.occupantNames})
                      </div>
                      <div className="text-slate-600 text-[11px]">
                        Pets: {app.occupants.petsCount > 0 ? app.occupants.petDetails || 'Yes' : 'No pets'}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        Evictions: {app.background.hasEviction ? 'Yes' : 'None'}
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="text-slate-500 italic text-[11px]">
                        {app.notes ? `Note: ${app.notes}` : 'No landlord notes recorded.'}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {matchedProp?.tourAvailability?.enabled && (
                          <div className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 inline-flex items-center gap-1 font-medium">
                            <Calendar className="w-3 h-3 text-emerald-600" />
                            <span>Unit Tour Availability Active ({matchedProp.tourAvailability.availableDates.length} dates, {matchedProp.tourAvailability.timeSlots.length} slots)</span>
                          </div>
                        )}
                        {app.tourScheduled && (
                          <div className="text-[11px] text-[#1E3A8A] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 inline-flex items-center gap-1 font-medium">
                            <Clock className="w-3 h-3 text-[#1E3A8A]" />
                            <span>Scheduled Tour: <strong>{app.tourScheduled.date}</strong> at <strong>{app.tourScheduled.time}</strong> ({app.tourScheduled.type})</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {app.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => updateApplicationStatus(app.id, 'Declined', 'Declined by landlord')}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 font-semibold rounded-lg transition"
                          >
                            Decline
                          </button>
                          <button
                            onClick={() => {
                              updateApplicationStatus(app.id, 'Accepted', 'Approved by landlord');
                              if (matchedProp) {
                                setTourModalProperty(matchedProp);
                                setTourModalApp(app);
                                setTourModalOpen(true);
                              }
                            }}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-2xs transition flex items-center gap-1.5"
                            title="Accept application and immediately set unit tour schedule availability"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Accept & Set Tour Availability</span>
                          </button>
                        </>
                      )}

                      {(app.status === 'Accepted' || app.status === 'Lease Sent') && (
                        <button
                          onClick={() => {
                            if (matchedProp) {
                              setTourModalProperty(matchedProp);
                              setTourModalApp(app);
                              setTourModalOpen(true);
                            }
                          }}
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold rounded-lg shadow-2xs transition flex items-center gap-1.5"
                        >
                          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{matchedProp?.tourAvailability?.enabled ? 'Manage Tour Availability' : 'Set Tour Availability'}</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setSelectedAppForLease(app);
                          setLeaseModalOpen(true);
                        }}
                        className="px-4 py-1.5 bg-[#0A2240] hover:bg-[#07172B] text-white font-bold rounded-lg shadow-2xs transition flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Invite & Create Lease</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: INQUIRIES */}
      {activeTab === 'inquiries' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200">
            <h2 className="font-bold text-slate-900 text-base">Prospective Tenant Inquiries & Tour Requests</h2>
            <p className="text-xs text-slate-500">
              Manage tour appointments (in-person & virtual) and inquiries received through the marketplace.
            </p>
          </div>

          <div className="space-y-3">
            {inquiries.map(inq => (
              <div
                key={inq.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-sm">{inq.userName}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        inq.status === 'New'
                          ? 'bg-cyan-100 text-cyan-800'
                          : inq.status === 'Tour Scheduled'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {inq.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Inquired on: <strong className="text-slate-700">{inq.propertyAddress}</strong>
                    </p>
                  </div>

                  <div className="text-xs text-slate-600 sm:text-right">
                    <div>{inq.userEmail} • {inq.userPhone}</div>
                    <span className="text-[11px] text-slate-400">Target Move-In: {inq.moveInDate}</span>
                  </div>
                </div>

                {inq.tourRequested && (
                  <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#0066FF]" />
                      <span className="font-bold text-slate-900">
                        {inq.tourType} Requested:
                      </span>
                      <span className="text-slate-700">{inq.tourDate} at {inq.tourTime}</span>
                    </div>
                    <button
                      onClick={() => updateInquiryStatus(inq.id, 'Tour Scheduled')}
                      className="px-2.5 py-1 bg-[#0066FF] text-white rounded-lg text-[11px] font-semibold hover:bg-blue-700 transition"
                    >
                      Confirm Tour Slot
                    </button>
                  </div>
                )}

                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 italic">
                  &ldquo;{inq.message}&rdquo;
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-400">
                  <span>Received {new Date(inq.createdAt).toLocaleString()}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateInquiryStatus(inq.id, 'Replied')}
                      className="text-[#0066FF] hover:underline font-semibold"
                    >
                      Mark as Replied
                    </button>
                    <button
                      onClick={() => updateInquiryStatus(inq.id, 'Archived')}
                      className="text-slate-500 hover:text-slate-700"
                    >
                      Archive
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: LEASES */}
      {activeTab === 'leases' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <h2 className="font-bold text-slate-900 text-base">Massachusetts Residential Leases</h2>
              <p className="text-xs text-slate-500">
                Track digitally invited agreements, tenant signatures, and execute landlord countersignatures.
              </p>
            </div>

            <button
              onClick={() => {
                setSelectedAppForLease(null);
                setLeaseModalOpen(true);
              }}
              className="px-4 py-2 bg-[#0066FF] hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-2xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Lease</span>
            </button>
          </div>

          <div className="space-y-3">
            {leases.map(lease => (
              <div
                key={lease.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-base">{lease.propertyAddress}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        lease.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : lease.status === 'Signed by Tenant'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {lease.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Tenant: <strong>{lease.tenantName}</strong> ({lease.tenantEmail})
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-black text-slate-900">
                      ${lease.monthlyRent.toLocaleString()} / mo
                    </span>
                    <div className="text-[11px] text-slate-500">
                      Security Deposit: ${lease.securityDeposit.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <span className="text-slate-400 block text-[11px]">Lease Term</span>
                    <span className="font-bold text-slate-800">{lease.startDate} to {lease.endDate}</span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <span className="text-slate-400 block text-[11px]">Due Day & Grace</span>
                    <span className="font-bold text-slate-800">Day {lease.rentDueDay} ({lease.gracePeriodDays} days grace)</span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <span className="text-slate-400 block text-[11px]">Tenant Signature</span>
                    <span className="font-bold text-slate-800">
                      {lease.tenantSignature ? `Signed (${lease.tenantSignature})` : 'Pending Tenant Signature'}
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <span className="text-slate-400 block text-[11px]">Landlord Countersign</span>
                    <span className="font-bold text-slate-800">
                      {lease.landlordSignature ? `Signed (${lease.landlordSignature})` : 'Pending Countersign'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <button
                    onClick={() => setViewLeaseModal(lease)}
                    className="text-[#1E3A8A] hover:underline font-semibold flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Formal Lease Agreement</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {lease.status === 'Signed by Tenant' && !lease.landlordSignature && (
                      <button
                        onClick={() => countersignLeaseLandlord(lease.id, 'David Sterling (Landlord)')}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-2xs transition flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Landlord Countersign & Activate</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: MANUAL PAYMENTS */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          {/* Landlord Payment Settings Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#1E3A8A]" />
                  <h2 className="font-bold text-slate-900 text-base">Manual Payment Instructions & Methods</h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Payments are collected manually via Zelle, Venmo, ACH, and Mail Checks. Configure your banking details for tenants.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditInstructionsOpen(true)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-xs flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Instructions</span>
                </button>

                <button
                  onClick={() => setLogManualPaymentOpen(true)}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-2xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log Received Check/Cash</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs pt-2 border-t border-slate-100">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 block uppercase">Zelle Details</span>
                <div className="font-bold text-slate-900 mt-1">{landlordInstructions.zelleEmail}</div>
                <div className="text-slate-600">{landlordInstructions.zellePhone}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 block uppercase">Venmo Handle</span>
                <div className="font-bold text-slate-900 mt-1">{landlordInstructions.venmoHandle}</div>
                <div className="text-slate-500 text-[11px]">Instant manual verification</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 block uppercase">Bank ACH / Wire</span>
                <div className="font-bold text-slate-900 mt-1">{landlordInstructions.bankName}</div>
                <div className="text-slate-600">Routing: {landlordInstructions.bankRoutingNumber}</div>
                <div className="text-slate-600">Acct Ending: •••• {landlordInstructions.bankAccountNumberLast4}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 block uppercase">Check Mailing</span>
                <div className="text-slate-700 whitespace-pre-line text-[11px] mt-1 line-clamp-3">
                  {landlordInstructions.checkMailingAddress}
                </div>
              </div>
            </div>
          </div>

          {/* Payments Ledger Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Rent & Deposit Payments Ledger</h3>
              <span className="text-xs text-slate-500">
                {payments.length} Transactions recorded
              </span>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <tr>
                  <th className="p-3.5">Tenant & Property</th>
                  <th className="p-3.5">Payment Type</th>
                  <th className="p-3.5">Amount</th>
                  <th className="p-3.5">Method & Reference</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map(pay => (
                  <tr key={pay.id} className="hover:bg-slate-50/80">
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{pay.tenantName}</div>
                      <div className="text-[11px] text-slate-500">{pay.propertyTitle}</div>
                    </td>
                    <td className="p-3.5 font-medium text-slate-700">
                      {pay.paymentType}
                    </td>
                    <td className="p-3.5 font-black text-slate-900 text-sm">
                      ${pay.amount.toLocaleString()}
                    </td>
                    <td className="p-3.5">
                      <span className="font-semibold text-slate-800 block">{pay.paymentMethod}</span>
                      <span className="font-mono text-[11px] text-slate-500">{pay.referenceNumber}</span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        pay.status === 'Verified'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {pay.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      {pay.status === 'Pending Verification' ? (
                        <button
                          onClick={() => verifyPayment(pay.id, 'Verified in Eastern Bank statement.')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow-2xs"
                        >
                          Verify & Issue Receipt
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-700 font-semibold flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Receipt Issued</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Instructions Modal */}
      {editInstructionsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 backdrop-blur-xs p-3 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 my-auto text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Edit Landlord Payment Instructions</h3>
              <button onClick={() => setEditInstructionsOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveInstructions} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Zelle Email</label>
                  <input
                    type="email"
                    value={zelleEmail}
                    onChange={e => setZelleEmail(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Zelle Phone</label>
                  <input
                    type="tel"
                    value={zellePhone}
                    onChange={e => setZellePhone(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Venmo Handle</label>
                <input
                  type="text"
                  value={venmoHandle}
                  onChange={e => setVenmoHandle(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={e => setBankName(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Account Holder Name</label>
                  <input
                    type="text"
                    value={bankAccountHolder}
                    onChange={e => setBankAccountHolder(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Routing Number</label>
                  <input
                    type="text"
                    value={bankRoutingNumber}
                    onChange={e => setBankRoutingNumber(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Account Last 4</label>
                  <input
                    type="text"
                    value={bankAccountNumberLast4}
                    onChange={e => setBankAccountNumberLast4(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Check Mailing Address</label>
                <textarea
                  rows={3}
                  value={checkMailingAddress}
                  onChange={e => setCheckMailingAddress(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditInstructionsOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0A2240] hover:bg-[#07172B] text-white font-bold rounded-xl shadow-xs"
                >
                  Save Instructions
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Manual Payment Modal */}
      {logManualPaymentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 backdrop-blur-xs p-3 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md p-6 my-auto text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Log Received Check / Cash</h3>
              <button onClick={() => setLogManualPaymentOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveManualPayment} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Property</label>
                <select
                  value={manualPayPropId}
                  onChange={e => setManualPayPropId(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>{p.streetAddress} {p.unit}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tenant Name</label>
                <input
                  type="text"
                  required
                  value={manualTenantName}
                  onChange={e => setManualTenantName(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Amount ($)</label>
                  <input
                    type="number"
                    required
                    value={manualAmount}
                    onChange={e => setManualAmount(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Type</label>
                  <select
                    value={manualType}
                    onChange={e => setManualType(e.target.value as PaymentRecord['paymentType'])}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Monthly Rent">Monthly Rent</option>
                    <option value="Security Deposit">Security Deposit</option>
                    <option value="Key Deposit">Key Deposit</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Method</label>
                  <select
                    value={manualMethod}
                    onChange={e => setManualMethod(e.target.value as PaymentRecord['paymentMethod'])}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Cashier Check / Mail">Cashier Check / Mail</option>
                    <option value="Zelle">Zelle</option>
                    <option value="Venmo">Venmo</option>
                    <option value="Bank Transfer (ACH)">Bank Transfer (ACH)</option>
                    <option value="Other">Cash / Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Reference / Check #</label>
                  <input
                    type="text"
                    required
                    value={manualRef}
                    onChange={e => setManualRef(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setLogManualPaymentOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Full Lease Agreement Modal */}
      {viewLeaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-3 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col my-auto text-xs">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <span className="font-bold text-slate-800 text-sm">Massachusetts Standard Lease Agreement</span>
              <button onClick={() => setViewLeaseModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 font-serif text-slate-800 leading-relaxed text-xs">
              <div className="text-center pb-3 border-b border-slate-200">
                <h2 className="text-base font-bold uppercase tracking-wider text-slate-900 font-sans">
                  Commonwealth of Massachusetts Residential Lease Agreement
                </h2>
                <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                  Governed under Massachusetts General Laws Chapter 186
                </p>
              </div>

              <p>
                This Agreement is entered into on <strong>{viewLeaseModal.createdAt.split('T')[0]}</strong>, by and between{' '}
                <strong>Boston Beacon Realty / David Sterling</strong> (&ldquo;Landlord&rdquo;) and{' '}
                <strong>{viewLeaseModal.tenantName}</strong> (&ldquo;Tenant&rdquo;).
              </p>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1 font-sans text-xs">
                <div><strong>Premises:</strong> {viewLeaseModal.propertyAddress}</div>
                <div><strong>Lease Term:</strong> {viewLeaseModal.startDate} to {viewLeaseModal.endDate}</div>
                <div><strong>Monthly Rent:</strong> ${viewLeaseModal.monthlyRent.toLocaleString()} due on the {viewLeaseModal.rentDueDay}st of each month</div>
                <div><strong>Security Deposit:</strong> ${viewLeaseModal.securityDeposit.toLocaleString()} (held in Massachusetts interest-bearing escrow)</div>
              </div>

              <h4 className="font-bold font-sans text-slate-900">Utilities Included:</h4>
              <p className="font-sans text-slate-700">
                {viewLeaseModal.utilitiesIncluded.join(', ')}
              </p>

              <h4 className="font-bold font-sans text-slate-900">Rules & Provisions:</h4>
              <ul className="list-disc pl-5 space-y-1 font-sans text-slate-700">
                {viewLeaseModal.customRules.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>

              <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-4 font-sans">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Tenant Signature</span>
                  <div className="font-serif italic text-base text-[#1E3A8A] mt-1">
                    {viewLeaseModal.tenantSignature || 'Not yet signed by tenant'}
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {viewLeaseModal.tenantSignedAt ? `Signed on ${viewLeaseModal.tenantSignedAt.split('T')[0]}` : 'Awaiting signature'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Landlord Signature</span>
                  <div className="font-serif italic text-base text-slate-900 mt-1">
                    {viewLeaseModal.landlordSignature || 'David Sterling (Authorized Landlord)'}
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {viewLeaseModal.landlordSignedAt ? `Countersigned on ${viewLeaseModal.landlordSignedAt.split('T')[0]}` : 'Ready to countersign'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setViewLeaseModal(null)}
                className="px-4 py-2 bg-slate-800 text-white font-bold rounded-xl text-xs"
              >
                Close Agreement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Modals */}
      <AddPropertyUrlModal
        isOpen={addUrlModalOpen}
        onClose={() => setAddUrlModalOpen(false)}
        onAddProperty={addProperty}
      />

      <BulkUrlImportModal
        isOpen={bulkModalOpen}
        onClose={() => setBulkModalOpen(false)}
        onImportBulk={addBulkProperties}
      />

      <CreateLeaseModal
        isOpen={leaseModalOpen}
        onClose={() => {
          setLeaseModalOpen(false);
          setSelectedAppForLease(null);
          setSelectedPropForLease(null);
        }}
        application={selectedAppForLease}
        property={selectedPropForLease}
      />

      <SetTourAvailabilityModal
        isOpen={tourModalOpen}
        onClose={() => {
          setTourModalOpen(false);
          setTourModalProperty(null);
          setTourModalApp(null);
        }}
        property={tourModalProperty}
        application={tourModalApp}
      />
    </div>
  );
};
