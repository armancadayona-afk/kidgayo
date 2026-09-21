import React, { useState } from 'react';
import {
  X,
  User,
  Briefcase,
  Users,
  ShieldCheck,
  CheckCircle2,
  Upload,
  DollarSign,
  AlertCircle,
  FileCheck,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { Property } from '../types';
import { useApp } from '../context/AppContext';

interface RentalApplicationModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RentalApplicationModal: React.FC<RentalApplicationModalProps> = ({
  property,
  isOpen,
  onClose
}) => {
  const { currentUser, submitApplication } = useApp();

  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // Step 1: Personal Information
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [dob, setDob] = useState('1992-06-15');
  const [currentAddress, setCurrentAddress] = useState('15 Beacon St, Apt 4B, Boston, MA 02108');
  const [currentLandlordName, setCurrentLandlordName] = useState('Charlesgate Properties');
  const [currentLandlordPhone, setCurrentLandlordPhone] = useState('(617) 555-3921');
  const [currentRent, setCurrentRent] = useState<number>(3200);
  const [reasonForMoving, setReasonForMoving] = useState('Lease ending; looking for closer commute and updated finishes.');

  // Step 2: Employment & Income
  const [employer, setEmployer] = useState('Biogen / Boston BioTech');
  const [position, setPosition] = useState('Senior Research Scientist');
  const [monthlyIncome, setMonthlyIncome] = useState<number>(12500);
  const [employmentLength, setEmploymentLength] = useState('3 years 6 months');
  const [supervisorName, setSupervisorName] = useState('Dr. David Hayes');
  const [supervisorPhone, setSupervisorPhone] = useState('(617) 555-8822');
  const [additionalIncome, setAdditionalIncome] = useState('');
  const [paystubUploaded, setPaystubUploaded] = useState(true);

  // Step 3: Occupants & Pets
  const [totalOccupants, setTotalOccupants] = useState(1);
  const [occupantNames, setOccupantNames] = useState(currentUser?.fullName || 'Elena Rostova');
  const [petsCount, setPetsCount] = useState(0);
  const [petDetails, setPetDetails] = useState('');

  // Step 4: Background & Declarations
  const [hasEviction, setHasEviction] = useState(false);
  const [hasBankruptcy, setHasBankruptcy] = useState(false);
  const [hasCriminalHistory, setHasCriminalHistory] = useState(false);
  const [additionalComments, setAdditionalComments] = useState('');
  const [authorizationChecked, setAuthorizationChecked] = useState(true);
  const [signatureName, setSignatureName] = useState(currentUser?.fullName || '');
  const [signatureDate, setSignatureDate] = useState(new Date().toISOString().split('T')[0]);

  if (!isOpen || !property) return null;

  const rentToIncomeRatio = monthlyIncome > 0
    ? Math.round((property.monthlyRent / monthlyIncome) * 100)
    : 0;

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!authorizationChecked) {
      alert('Please check the credit and background check authorization.');
      return;
    }

    submitApplication({
      propertyId: property.id,
      propertyTitle: property.title,
      propertyAddress: `${property.streetAddress}${property.unit ? ' ' + property.unit : ''}, ${property.city}, MA`,
      monthlyRent: property.monthlyRent,
      applicant: {
        fullName,
        email,
        phone,
        dob,
        currentAddress,
        currentLandlordName,
        currentLandlordPhone,
        currentRent,
        reasonForMoving
      },
      employment: {
        employer,
        position,
        monthlyIncome,
        employmentLength,
        supervisorName,
        supervisorPhone,
        additionalIncome,
        paystubUploaded
      },
      occupants: {
        totalOccupants,
        occupantNames,
        petsCount,
        petDetails
      },
      background: {
        hasEviction,
        hasBankruptcy,
        hasCriminalHistory,
        additionalComments,
        authorizationChecked,
        signatureName: signatureName || fullName,
        signatureDate
      }
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95 duration-200 relative">
        {/* Header */}
        <div className="p-4 sm:px-6 border-b border-slate-100 flex items-center justify-between bg-white">
          <div>
            <span className="text-[11px] font-bold text-[#0066FF] uppercase tracking-wider block">
              Avail-Standard Rental Application
            </span>
            <h2 className="text-lg font-extrabold text-slate-900">
              Applying for {property.streetAddress} {property.unit}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-4 bg-slate-50 border-b border-slate-100 text-xs">
          {[
            { num: 1, label: 'Personal', icon: User },
            { num: 2, label: 'Employment', icon: Briefcase },
            { num: 3, label: 'Occupants', icon: Users },
            { num: 4, label: 'Background', icon: ShieldCheck }
          ].map(s => {
            const Icon = s.icon;
            const active = step === s.num;
            const completed = step > s.num;
            return (
              <div
                key={s.num}
                className={`py-3 px-2 text-center border-r last:border-r-0 border-slate-200/80 transition-all ${
                  active
                    ? 'bg-blue-50/90 text-[#0066FF] font-bold'
                    : completed
                    ? 'text-emerald-700 font-semibold'
                    : 'text-slate-400 font-medium'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5">
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{s.label}</span>
                  <span className="sm:hidden">{s.num}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Content Body */}
        {submitted ? (
          <div className="p-10 text-center space-y-4 my-auto">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Rental Application Submitted!</h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Your application has been received by the landlord. You can track your status, review documents, and view your upcoming lease in your <strong>Tenant Portal</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-5 text-xs">
            {/* Step 1: Personal */}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Full Legal Name *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="e.g. Elena Rostova"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Date of Birth *</label>
                    <input
                      type="date"
                      required
                      value={dob}
                      onChange={e => setDob(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Current Residential Address *</label>
                  <input
                    type="text"
                    required
                    value={currentAddress}
                    onChange={e => setCurrentAddress(e.target.value)}
                    placeholder="Street, Unit, City, State, Zip"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Current Landlord</label>
                    <input
                      type="text"
                      value={currentLandlordName}
                      onChange={e => setCurrentLandlordName(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Landlord Phone</label>
                    <input
                      type="tel"
                      value={currentLandlordPhone}
                      onChange={e => setCurrentLandlordPhone(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Current Rent ($/mo)</label>
                    <input
                      type="number"
                      value={currentRent}
                      onChange={e => setCurrentRent(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Reason for Moving</label>
                  <textarea
                    rows={2}
                    value={reasonForMoving}
                    onChange={e => setReasonForMoving(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl resize-none"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Employment */}
            {step === 2 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Current Employer *</label>
                    <input
                      type="text"
                      required
                      value={employer}
                      onChange={e => setEmployer(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Job Title / Position *</label>
                    <input
                      type="text"
                      required
                      value={position}
                      onChange={e => setPosition(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Monthly Gross Income ($) *</label>
                    <input
                      type="number"
                      required
                      min="500"
                      value={monthlyIncome}
                      onChange={e => setMonthlyIncome(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Length of Employment</label>
                    <input
                      type="text"
                      value={employmentLength}
                      onChange={e => setEmploymentLength(e.target.value)}
                      placeholder="e.g. 2 years 4 months"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                {/* Affordability Preview */}
                <div className="p-3.5 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 text-xs">Rent-to-Income Calculation:</span>
                    <p className="text-[11px] text-slate-500">
                      Rent is ${property.monthlyRent}/mo of ${monthlyIncome}/mo gross income
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full font-extrabold text-xs ${
                    rentToIncomeRatio <= 33
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {rentToIncomeRatio}% {rentToIncomeRatio <= 33 ? '✓ Excellent' : 'Moderate'}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Supervisor / HR Contact</label>
                    <input
                      type="text"
                      value={supervisorName}
                      onChange={e => setSupervisorName(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Supervisor Phone</label>
                    <input
                      type="tel"
                      value={supervisorPhone}
                      onChange={e => setSupervisorPhone(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                {/* Proof of Income Simulation */}
                <div className="p-4 border-2 border-dashed border-slate-200 rounded-2xl text-center bg-slate-50">
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                  <span className="font-semibold text-slate-800 block text-xs">
                    Proof of Income / Paystub Document
                  </span>
                  <p className="text-[11px] text-slate-500 mb-2">
                    Upload recent W2, 1099, or paystub (PDF or image)
                  </p>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-50 shadow-2xs">
                    <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{paystubUploaded ? 'paystub_sept2026.pdf (Attached)' : 'Attach Paystub'}</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={() => setPaystubUploaded(true)}
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Step 3: Occupants & Pets */}
            {step === 3 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Total Number of Occupants *</label>
                    <input
                      type="number"
                      min="1"
                      max="6"
                      value={totalOccupants}
                      onChange={e => setTotalOccupants(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Occupant Names</label>
                    <input
                      type="text"
                      value={occupantNames}
                      onChange={e => setOccupantNames(e.target.value)}
                      placeholder="List all adult & minor occupants"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 block text-xs">Do you have pets?</span>
                      <p className="text-[11px] text-slate-500">Building policy: {property.petPolicy}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPetsCount(0)}
                        className={`px-3 py-1 rounded-lg font-medium text-xs ${
                          petsCount === 0 ? 'bg-slate-900 text-white' : 'bg-white border'
                        }`}
                      >
                        No Pets
                      </button>
                      <button
                        type="button"
                        onClick={() => setPetsCount(1)}
                        className={`px-3 py-1 rounded-lg font-medium text-xs ${
                          petsCount > 0 ? 'bg-[#0066FF] text-white' : 'bg-white border'
                        }`}
                      >
                        Have Pets
                      </button>
                    </div>
                  </div>

                  {petsCount > 0 && (
                    <div className="pt-2 border-t border-slate-200">
                      <label className="block font-semibold text-slate-700 mb-1">Pet Type, Breed, & Weight</label>
                      <input
                        type="text"
                        value={petDetails}
                        onChange={e => setPetDetails(e.target.value)}
                        placeholder="e.g. 1 French Bulldog, 18 lbs, vaccinated"
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Background & Declarations */}
            {step === 4 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="space-y-2">
                  <span className="font-bold text-slate-800 block text-xs">Declarations</span>

                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-700 text-xs">Have you ever been evicted or asked to vacate?</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setHasEviction(false)}
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold ${!hasEviction ? 'bg-emerald-600 text-white' : 'bg-white border'}`}
                      >
                        No
                      </button>
                      <button
                        type="button"
                        onClick={() => setHasEviction(true)}
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold ${hasEviction ? 'bg-red-600 text-white' : 'bg-white border'}`}
                      >
                        Yes
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-700 text-xs">Have you declared bankruptcy within the last 7 years?</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setHasBankruptcy(false)}
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold ${!hasBankruptcy ? 'bg-emerald-600 text-white' : 'bg-white border'}`}
                      >
                        No
                      </button>
                      <button
                        type="button"
                        onClick={() => setHasBankruptcy(true)}
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold ${hasBankruptcy ? 'bg-red-600 text-white' : 'bg-white border'}`}
                      >
                        Yes
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-700 text-xs">Have you been convicted of a felony?</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setHasCriminalHistory(false)}
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold ${!hasCriminalHistory ? 'bg-emerald-600 text-white' : 'bg-white border'}`}
                      >
                        No
                      </button>
                      <button
                        type="button"
                        onClick={() => setHasCriminalHistory(true)}
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold ${hasCriminalHistory ? 'bg-red-600 text-white' : 'bg-white border'}`}
                      >
                        Yes
                      </button>
                    </div>
                  </div>
                </div>

                {/* Consent Checkbox */}
                <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-2xl space-y-2">
                  <div className="flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      id="authCheck"
                      checked={authorizationChecked}
                      onChange={e => setAuthorizationChecked(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-[#0066FF] rounded cursor-pointer flex-shrink-0"
                    />
                    <label htmlFor="authCheck" className="text-[11px] text-slate-700 leading-snug cursor-pointer">
                      I hereby certify that all information provided in this rental application is true and accurate. I authorize the landlord to verify my employment, contact past landlords, and perform credit and background checks in accordance with the Fair Credit Reporting Act (FCRA).
                    </label>
                  </div>
                </div>

                {/* E-Signature */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Applicant E-Signature Name *</label>
                    <input
                      type="text"
                      required
                      value={signatureName}
                      onChange={e => setSignatureName(e.target.value)}
                      placeholder="Type your full legal name"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-serif text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Signature Date</label>
                    <input
                      type="date"
                      value={signatureDate}
                      onChange={e => setSignatureDate(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Nav Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
              ) : (
                <div></div>
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-[#0066FF] hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow-xs"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Application</span>
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
