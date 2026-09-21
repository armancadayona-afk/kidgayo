import React, { useState } from 'react';
import {
  X,
  FileText,
  Calendar,
  DollarSign,
  ShieldCheck,
  Send,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Property, RentalApplication, Lease } from '../../types';
import { useApp } from '../../context/AppContext';

interface CreateLeaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  application?: RentalApplication | null;
  property?: Property | null;
}

export const CreateLeaseModal: React.FC<CreateLeaseModalProps> = ({
  isOpen,
  onClose,
  application,
  property
}) => {
  const { properties, createLease, updateApplicationStatus } = useApp();

  const selectedProp = property || properties.find(p => p.id === application?.propertyId) || properties[0];

  const [propId, setPropId] = useState(selectedProp?.id || '');
  const [tenantName, setTenantName] = useState(application?.applicant.fullName || '');
  const [tenantEmail, setTenantEmail] = useState(application?.applicant.email || '');
  const [tenantPhone, setTenantPhone] = useState(application?.applicant.phone || '');
  const [startDate, setStartDate] = useState('2026-10-01');
  const [endDate, setEndDate] = useState('2027-09-30');
  const [monthlyRent, setMonthlyRent] = useState(selectedProp?.monthlyRent || 3500);
  const [securityDeposit, setSecurityDeposit] = useState(selectedProp?.securityDeposit || 3500);
  const [keyDeposit, setKeyDeposit] = useState(100);
  const [rentDueDay, setRentDueDay] = useState(1);
  const [gracePeriodDays, setGracePeriodDays] = useState(5);

  const [utilities, setUtilities] = useState<string[]>([
    'Water & Sewer',
    'Curbside Trash & Recycling',
    'Snow Removal & Landscaping'
  ]);

  const [rules, setRules] = useState<string[]>([
    'No smoking of any kind inside premises or on balconies',
    'Quiet hours strictly observed between 10:00 PM and 7:00 AM',
    'Tenant to maintain property in clean condition and notify landlord promptly of any plumbing leaks',
    'Assigned parking space is reserved strictly for authorized tenant vehicle'
  ]);

  const [newRuleInput, setNewRuleInput] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const currentProperty = properties.find(p => p.id === propId) || selectedProp;

  const handleAddRule = () => {
    if (newRuleInput.trim()) {
      setRules([...rules, newRuleInput.trim()]);
      setNewRuleInput('');
    }
  };

  const handleRemoveRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const handleUtilityToggle = (item: string) => {
    if (utilities.includes(item)) {
      setUtilities(utilities.filter(u => u !== item));
    } else {
      setUtilities([...utilities, item]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newLease = createLease({
      propertyId: currentProperty.id,
      propertyTitle: currentProperty.title,
      propertyAddress: `${currentProperty.streetAddress}${currentProperty.unit ? ' ' + currentProperty.unit : ''}, ${currentProperty.city}, MA ${currentProperty.zipCode}`,
      tenantName,
      tenantEmail,
      tenantPhone,
      startDate,
      endDate,
      monthlyRent,
      securityDeposit,
      keyDeposit,
      rentDueDay,
      gracePeriodDays,
      utilitiesIncluded: utilities,
      customRules: rules
    });

    if (application) {
      updateApplicationStatus(application.id, 'Lease Sent', 'Lease invitation dispatched to tenant.');
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95 duration-200 relative">
        {/* Header */}
        <div className="p-4 sm:px-6 border-b border-slate-100 flex items-center justify-between bg-white">
          <div>
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
              Landlord Console • Massachusetts Lease Agreement
            </span>
            <h2 className="text-lg font-extrabold text-slate-900">
              Create & Send Lease Agreement
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-10 text-center space-y-4 my-auto">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Lease Agreement Dispatched!</h3>
            <p className="text-sm text-slate-600 max-w-sm mx-auto">
              The tenant has been invited to review and sign the lease in their <strong>Tenant Portal</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-5 text-xs">
            {/* Property Selector */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Rental Property</label>
              <select
                value={propId}
                onChange={e => {
                  setPropId(e.target.value);
                  const p = properties.find(prop => prop.id === e.target.value);
                  if (p) {
                    setMonthlyRent(p.monthlyRent);
                    setSecurityDeposit(p.securityDeposit);
                  }
                }}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                {properties.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.streetAddress} {p.unit} — ${p.monthlyRent.toLocaleString()}/mo ({p.neighborhood})
                  </option>
                ))}
              </select>
            </div>

            {/* Tenant Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tenant Full Name *</label>
                <input
                  type="text"
                  required
                  value={tenantName}
                  onChange={e => setTenantName(e.target.value)}
                  placeholder="Elena Rostova"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tenant Email *</label>
                <input
                  type="email"
                  required
                  value={tenantEmail}
                  onChange={e => setTenantEmail(e.target.value)}
                  placeholder="elena@example.com"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tenant Phone</label>
                <input
                  type="tel"
                  value={tenantPhone}
                  onChange={e => setTenantPhone(e.target.value)}
                  placeholder="(617) 555-0100"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            {/* Dates & Financials */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Lease Start Date</label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Lease End Date</label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Monthly Rent ($)</label>
                <input
                  type="number"
                  required
                  value={monthlyRent}
                  onChange={e => setMonthlyRent(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Security Deposit ($)</label>
                <input
                  type="number"
                  required
                  value={securityDeposit}
                  onChange={e => setSecurityDeposit(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Key Deposit ($)</label>
                <input
                  type="number"
                  value={keyDeposit}
                  onChange={e => setKeyDeposit(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Rent Due Day</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={rentDueDay}
                  onChange={e => setRentDueDay(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Grace Period (Days)</label>
                <input
                  type="number"
                  value={gracePeriodDays}
                  onChange={e => setGracePeriodDays(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            {/* Included Utilities */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Utilities Included in Rent</label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Water & Sewer',
                  'Curbside Trash & Recycling',
                  'Snow Removal & Landscaping',
                  'Heat (HOA)',
                  'Hot Water',
                  'Gas',
                  'Electricity',
                  'High-Speed Internet'
                ].map(item => {
                  const included = utilities.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleUtilityToggle(item)}
                      className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition ${
                        included
                          ? 'bg-blue-50 border-blue-300 text-[#0066FF] font-semibold'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {included ? '✓ ' : '+ '}
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Rules */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Building & Tenancy Rules</label>
              <ul className="space-y-1.5 mb-2">
                {rules.map((rule, idx) => (
                  <li key={idx} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100 text-[11px] text-slate-700">
                    <span>• {rule}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRule(idx)}
                      className="text-slate-400 hover:text-red-600 p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add custom rule (e.g. No subletting without prior written consent)"
                  value={newRuleInput}
                  onChange={e => setNewRuleInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddRule())}
                  className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddRule}
                  className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl text-xs"
                >
                  Add Rule
                </button>
              </div>
            </div>

            {/* Footer */}
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
                <Send className="w-4 h-4" />
                <span>Invite & Dispath Lease to Tenant</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
