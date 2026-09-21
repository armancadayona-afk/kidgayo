import React, { useState } from 'react';
import {
  User,
  FileText,
  CreditCard,
  CheckCircle2,
  Clock,
  Send,
  Building,
  Calendar,
  AlertCircle,
  FileCheck,
  ShieldCheck,
  ExternalLink,
  DollarSign,
  PenTool
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Lease, PaymentRecord, Property } from '../../types';
import { InquiryModal } from '../InquiryModal';

export const TenantPortal: React.FC = () => {
  const {
    currentUser,
    properties,
    leases,
    applications,
    inquiries,
    payments,
    landlordInstructions,
    signLeaseTenant,
    recordPayment
  } = useApp();

  const [activeTab, setActiveTab] = useState<'leases' | 'payments' | 'applications' | 'inquiries'>('leases');
  const [tourModalProp, setTourModalProp] = useState<Property | null>(null);

  // Sign lease modal state
  const [signingLease, setSigningLease] = useState<Lease | null>(null);
  const [tenantSignName, setTenantSignName] = useState(currentUser?.fullName || 'Elena Rostova');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Manual payment submission form state
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [payAmount, setPayAmount] = useState<number>(3500);
  const [payType, setPayType] = useState<PaymentRecord['paymentType']>('Monthly Rent');
  const [payMethod, setPayMethod] = useState<PaymentRecord['paymentMethod']>('Zelle');
  const [refNumber, setRefNumber] = useState('');
  const [payDate, setPayDate] = useState(new Date().toISOString().split('T')[0]);
  const [payNotes, setPayNotes] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Filter items for this tenant
  const tenantLeases = leases.filter(
    l => l.tenantEmail.toLowerCase() === (currentUser?.email || 'elena.rostova@biogen.com').toLowerCase()
  );

  const tenantApps = applications.filter(
    a => a.applicant.email.toLowerCase() === (currentUser?.email || 'elena.rostova@biogen.com').toLowerCase()
  );

  const tenantInquiries = inquiries.filter(
    i => i.userEmail.toLowerCase() === (currentUser?.email || 'elena.rostova@biogen.com').toLowerCase()
  );

  const tenantPayments = payments.filter(
    p => p.tenantEmail.toLowerCase() === (currentUser?.email || 'elena.rostova@biogen.com').toLowerCase()
  );

  // Pending lease awaiting signature
  const pendingSignLease = tenantLeases.find(l => l.status === 'Sent to Tenant');

  const handleSignLease = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signingLease || !agreedToTerms || !tenantSignName.trim()) return;

    signLeaseTenant(signingLease.id, tenantSignName);
    setSigningLease(null);
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const targetLease = tenantLeases[0];

    recordPayment({
      propertyId: targetLease?.propertyId || 'prop-1',
      propertyTitle: targetLease?.propertyTitle || '110 Stuart St Unit 26A',
      tenantName: currentUser?.fullName || 'Elena Rostova',
      tenantEmail: currentUser?.email || 'elena.rostova@biogen.com',
      amount: payAmount,
      paymentType: payType,
      paymentMethod: payMethod,
      referenceNumber: refNumber || `MAN-${Math.floor(100000 + Math.random() * 900000)}`,
      paymentDate: payDate,
      notes: payNotes
    });

    setPaymentSuccess(true);
    setTimeout(() => {
      setPaymentSuccess(false);
      setShowPaymentForm(false);
      setRefNumber('');
      setPayNotes('');
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-blue-100 text-[#0066FF] font-bold text-xs rounded-full">
              Tenant Dashboard
            </span>
            <span className="text-slate-400 text-xs">Avail-Powered Boston Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Welcome, {currentUser?.fullName || 'Elena Rostova'}
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Manage your rental applications, review & sign Massachusetts lease agreements, and notify your landlord of manual payments.
          </p>
        </div>

        <button
          onClick={() => setShowPaymentForm(true)}
          className="px-5 py-2.5 bg-[#0066FF] hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-1.5"
        >
          <DollarSign className="w-4 h-4" />
          <span>Notify Landlord of Payment</span>
        </button>
      </div>

      {/* Urgent Action Banner: Pending Lease Signature */}
      {pendingSignLease && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 bg-amber-100 text-amber-800 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-amber-900 text-sm">
                Action Required: Residential Lease Agreement Awaiting Signature
              </h3>
              <p className="text-xs text-amber-800 mt-0.5">
                Landlord David Sterling has invited you to lease{' '}
                <strong>{pendingSignLease.propertyAddress}</strong> (${pendingSignLease.monthlyRent.toLocaleString()}/mo).
              </p>
            </div>
          </div>

          <button
            onClick={() => setSigningLease(pendingSignLease)}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-xs transition flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <FileText className="w-4 h-4" />
            <span>Review & Digitally Sign</span>
          </button>
        </div>
      )}

      {/* Portal Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-2xs gap-1 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('leases')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition whitespace-nowrap ${
            activeTab === 'leases'
              ? 'bg-[#0066FF] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>My Leases & Agreements ({tenantLeases.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition whitespace-nowrap ${
            activeTab === 'payments'
              ? 'bg-[#0066FF] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Manual Rent & Payment Ledger ({tenantPayments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('applications')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition whitespace-nowrap ${
            activeTab === 'applications'
              ? 'bg-[#0066FF] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>My Applications ({tenantApps.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition whitespace-nowrap ${
            activeTab === 'inquiries'
              ? 'bg-[#0066FF] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Tours & Inquiries ({tenantInquiries.length})</span>
        </button>
      </div>

      {/* TAB 1: LEASES */}
      {activeTab === 'leases' && (
        <div className="space-y-4">
          {tenantLeases.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 text-xs">
              No leases currently issued to this account. Once your application is approved, your lease will appear here.
            </div>
          ) : (
            tenantLeases.map(lease => (
              <div
                key={lease.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      lease.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : lease.status === 'Signed by Tenant'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {lease.status}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-lg mt-1">{lease.propertyAddress}</h3>
                    <p className="text-xs text-slate-500">
                      Standard Residential Lease • Term: {lease.startDate} to {lease.endDate}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-black text-slate-900">
                      ${lease.monthlyRent.toLocaleString()}
                      <span className="text-xs font-normal text-slate-500"> / mo</span>
                    </div>
                    <span className="text-xs text-slate-500">
                      Due on the {lease.rentDueDay}st of each month
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-400 block text-[11px]">Security Deposit</span>
                    <span className="font-bold text-slate-800">${lease.securityDeposit.toLocaleString()} (Escrow)</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-400 block text-[11px]">Tenant Signature</span>
                    <span className="font-bold text-slate-800">
                      {lease.tenantSignature ? `✓ Signed: ${lease.tenantSignature}` : 'Awaiting your signature'}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-400 block text-[11px]">Landlord Countersign</span>
                    <span className="font-bold text-slate-800">
                      {lease.landlordSignature ? `✓ Executed: ${lease.landlordSignature}` : 'Awaiting landlord countersign'}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-blue-950 block">Utilities Included in Rent:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {lease.utilitiesIncluded.map((u, i) => (
                      <span key={i} className="px-2 py-0.5 bg-white border border-blue-200 text-blue-800 font-medium rounded-md text-[11px]">
                        ✓ {u}
                      </span>
                    ))}
                  </div>
                </div>

                {lease.status === 'Sent to Tenant' && (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setSigningLease(lease)}
                      className="px-6 py-2.5 bg-[#0066FF] hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center gap-2"
                    >
                      <PenTool className="w-4 h-4" />
                      <span>Review & Sign Lease Online</span>
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: MANUAL PAYMENTS */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          {/* Landlord Payment Instructions Guide */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-base">How to Pay Your Rent (Manual Collection)</h3>
            </div>
            <p className="text-xs text-slate-300">
              Per your lease, payments are processed manually. Please transfer using one of the following methods, then submit the payment notification below so your landlord can verify it in their Eastern Bank account.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs pt-2">
              <div className="p-3.5 bg-white/10 rounded-2xl border border-white/10">
                <span className="text-emerald-400 font-bold block text-[11px] uppercase">Zelle (Fastest)</span>
                <div className="font-bold text-white mt-1 text-sm">{landlordInstructions.zelleEmail}</div>
                <div className="text-slate-300">{landlordInstructions.zellePhone}</div>
              </div>

              <div className="p-3.5 bg-white/10 rounded-2xl border border-white/10">
                <span className="text-cyan-400 font-bold block text-[11px] uppercase">Venmo</span>
                <div className="font-bold text-white mt-1 text-sm">{landlordInstructions.venmoHandle}</div>
                <div className="text-slate-300 text-[11px]">Include apartment & unit in note</div>
              </div>

              <div className="p-3.5 bg-white/10 rounded-2xl border border-white/10">
                <span className="text-amber-300 font-bold block text-[11px] uppercase">Bank ACH / Wire</span>
                <div className="font-bold text-white mt-1">{landlordInstructions.bankName}</div>
                <div className="text-slate-300">Routing: {landlordInstructions.bankRoutingNumber}</div>
                <div className="text-slate-300">Acct Ending: •••• {landlordInstructions.bankAccountNumberLast4}</div>
              </div>

              <div className="p-3.5 bg-white/10 rounded-2xl border border-white/10">
                <span className="text-purple-300 font-bold block text-[11px] uppercase">Mail Check</span>
                <div className="text-slate-200 text-[11px] whitespace-pre-line mt-1 line-clamp-3">
                  {landlordInstructions.checkMailingAddress}
                </div>
              </div>
            </div>
          </div>

          {/* Payment History Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Payment Notifications & Verified Receipts</h3>
              <button
                onClick={() => setShowPaymentForm(true)}
                className="px-3.5 py-1.5 bg-[#0066FF] text-white font-bold rounded-lg text-xs shadow-2xs hover:bg-blue-700 transition"
              >
                + Submit New Payment Notice
              </button>
            </div>

            {tenantPayments.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No payment notices submitted yet. Once you send rent or deposits, record them here.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <tr>
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5">Payment Type</th>
                    <th className="p-3.5">Amount</th>
                    <th className="p-3.5">Method & Reference</th>
                    <th className="p-3.5">Verification Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tenantPayments.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/80">
                      <td className="p-3.5 text-slate-700 font-medium">{p.paymentDate}</td>
                      <td className="p-3.5 text-slate-900 font-semibold">{p.paymentType}</td>
                      <td className="p-3.5 text-base font-black text-slate-900">${p.amount.toLocaleString()}</td>
                      <td className="p-3.5">
                        <span className="font-semibold text-slate-800">{p.paymentMethod}</span>
                        <div className="font-mono text-[11px] text-slate-500">{p.referenceNumber}</div>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          p.status === 'Verified'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: APPLICATIONS */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          {tenantApps.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
              You haven&apos;t submitted any rental applications yet. Browse Boston properties in the marketplace to apply.
            </div>
          ) : (
            tenantApps.map(app => {
              const matchedProp = properties.find(p => p.id === app.propertyId);
              return (
                <div key={app.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        app.status === 'Accepted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : app.status === 'Declined'
                          ? 'bg-red-100 text-red-800'
                          : app.status === 'Lease Sent'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        Application Status: {app.status}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base mt-1">{app.propertyAddress}</h3>
                    </div>
                    <div className="sm:text-right">
                      <span className="text-base font-black text-slate-900">${app.monthlyRent.toLocaleString()} / mo</span>
                      <div className="text-[11px] text-slate-400">
                        Applied on {new Date(app.submittedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Tour Status Section */}
                  <div className="p-4 rounded-2xl border text-xs space-y-2.5 bg-slate-50 border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                        <Calendar className="w-4 h-4 text-[#0066FF]" />
                        <span>Unit Tour Scheduling</span>
                      </span>

                      {app.tourScheduled ? (
                        <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
                          Tour Booked
                        </span>
                      ) : app.status === 'Accepted' || app.status === 'Lease Sent' ? (
                        <span className="px-2.5 py-0.5 bg-blue-100 text-[#0066FF] rounded-full font-bold text-[10px]">
                          Tour Unlocked
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-full font-bold text-[10px]">
                          Awaiting Approval
                        </span>
                      )}
                    </div>

                    {app.tourScheduled ? (
                      <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                        <div className="flex items-center gap-2 text-slate-900 font-bold">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Confirmed: {app.tourScheduled.date} at {app.tourScheduled.time}</span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Format: <strong>{app.tourScheduled.type}</strong>
                          {app.tourScheduled.notes && ` • Note: "${app.tourScheduled.notes}"`}
                        </div>
                        {matchedProp?.tourAvailability?.meetingInstructions && (
                          <div className="text-[11px] text-blue-800 bg-blue-50/70 p-2 rounded-lg mt-1 border border-blue-100">
                            <strong>Access Instructions:</strong> {matchedProp.tourAvailability.meetingInstructions}
                          </div>
                        )}
                        <div className="pt-1 flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              if (matchedProp) setTourModalProp(matchedProp);
                            }}
                            className="text-xs text-[#0066FF] hover:underline font-bold"
                          >
                            Reschedule Tour Slot
                          </button>
                        </div>
                      </div>
                    ) : app.status === 'Accepted' || app.status === 'Lease Sent' ? (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-emerald-200">
                        <div className="space-y-0.5">
                          <div className="font-bold text-emerald-900 text-xs">
                            Application Accepted by Landlord David Sterling!
                          </div>
                          <p className="text-[11px] text-slate-600">
                            {matchedProp?.tourAvailability?.enabled
                              ? 'The landlord has published open tour availability for this unit. Pick your preferred viewing slot.'
                              : 'Your application is accepted! Request your preferred tour time.'}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (matchedProp) setTourModalProp(matchedProp);
                          }}
                          className="px-4 py-2 bg-[#0066FF] hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition shadow-xs whitespace-nowrap flex items-center gap-1.5 self-start sm:self-center"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Book Unit Tour Slot</span>
                        </button>
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Your application is currently under review by landlord David Sterling. Once approved, the unit&apos;s active tour schedule will unlock here so you can schedule a private showing.
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 4: INQUIRIES */}
      {activeTab === 'inquiries' && (
        <div className="space-y-4">
          {tenantInquiries.map(inq => (
            <div key={inq.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">{inq.propertyAddress}</h3>
                <span className="px-2 py-0.5 bg-blue-100 text-[#0066FF] rounded-full text-[11px] font-bold">
                  {inq.status}
                </span>
              </div>
              <p className="text-slate-600 italic">&ldquo;{inq.message}&rdquo;</p>
              {inq.tourRequested && (
                <div className="text-[11px] text-slate-500">
                  Tour requested: {inq.tourType} on {inq.tourDate} at {inq.tourTime}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Sign Lease Modal */}
      {signingLease && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-3 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col my-auto text-xs">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-[11px] font-bold text-[#0066FF] uppercase">Digital Lease Execution</span>
                <h3 className="text-base font-bold text-slate-900">Sign Residential Lease for {signingLease.propertyAddress}</h3>
              </div>
              <button onClick={() => setSigningLease(null)} className="text-slate-400 hover:text-slate-600">
                &times;
              </button>
            </div>

            <form onSubmit={handleSignLease} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Premises Address:</span>
                  <span className="font-bold text-slate-900">{signingLease.propertyAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Lease Term:</span>
                  <span className="font-bold text-slate-900">{signingLease.startDate} to {signingLease.endDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Monthly Rent:</span>
                  <span className="font-bold text-[#0066FF]">${signingLease.monthlyRent.toLocaleString()}/mo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Security Deposit:</span>
                  <span className="font-bold text-slate-900">${signingLease.securityDeposit.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-1">Utilities Provided by Landlord:</span>
                <p className="text-slate-600">{signingLease.utilitiesIncluded.join(', ')}</p>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-1">Building Rules:</span>
                <ul className="list-disc pl-5 text-slate-600 space-y-0.5">
                  {signingLease.customRules.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl space-y-2">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="leaseAgree"
                    required
                    checked={agreedToTerms}
                    onChange={e => setAgreedToTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-[#0066FF] rounded cursor-pointer"
                  />
                  <label htmlFor="leaseAgree" className="text-slate-700 leading-snug cursor-pointer">
                    I have reviewed the terms of this Massachusetts Residential Lease Agreement and hereby agree to all provisions, rent obligations, and house rules.
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Type Your Legal Full Name (E-Signature) *</label>
                <input
                  type="text"
                  required
                  value={tenantSignName}
                  onChange={e => setTenantSignName(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-serif text-base text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSigningLease(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!agreedToTerms || !tenantSignName.trim()}
                  className="px-6 py-2 bg-[#0066FF] hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold rounded-xl shadow-md"
                >
                  Confirm & Execute Signature
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submit Manual Payment Modal */}
      {showPaymentForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-3 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md p-6 my-auto text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Notify Landlord of Sent Payment</h3>
              <button onClick={() => setShowPaymentForm(false)} className="text-slate-400 hover:text-slate-600">
                &times;
              </button>
            </div>

            {paymentSuccess ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Payment Notification Logged!</h4>
                <p className="text-slate-500 text-xs">
                  Your landlord has been alerted and will verify the transfer in Eastern Bank.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRecordPayment} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Amount Sent ($)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={payAmount}
                      onChange={e => setPayAmount(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Payment Type</label>
                    <select
                      value={payType}
                      onChange={e => setPayType(e.target.value as PaymentRecord['paymentType'])}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
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
                    <label className="block font-semibold text-slate-700 mb-1">Method Used</label>
                    <select
                      value={payMethod}
                      onChange={e => setPayMethod(e.target.value as PaymentRecord['paymentMethod'])}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    >
                      <option value="Zelle">Zelle</option>
                      <option value="Venmo">Venmo</option>
                      <option value="Bank Transfer (ACH)">Bank Transfer (ACH)</option>
                      <option value="Cashier Check / Mail">Cashier Check / Mail</option>
                      <option value="Other">Cash / Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Confirmation / Ref #</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ZEL-882914 or Check #"
                      value={refNumber}
                      onChange={e => setRefNumber(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date Sent</label>
                  <input
                    type="date"
                    required
                    value={payDate}
                    onChange={e => setPayDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Notes / Memo for Landlord</label>
                  <input
                    type="text"
                    placeholder="e.g. October Rent for Unit 26A"
                    value={payNotes}
                    onChange={e => setPayNotes(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowPaymentForm(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#0066FF] hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
                  >
                    Submit Notification
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Tour Scheduling Modal */}
      <InquiryModal
        property={tourModalProp}
        isOpen={!!tourModalProp}
        onClose={() => setTourModalProp(null)}
      />
    </div>
  );
};
