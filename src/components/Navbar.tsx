import React, { useState } from 'react';
import {
  MapPin,
  ShieldCheck,
  Building2,
  User,
  LogOut,
  FileText,
  CreditCard,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';
import { AuthModal } from './AuthModal';

interface NavbarProps {
  currentView: 'marketplace' | 'tenant-portal' | 'admin-console';
  onNavigate: (view: 'marketplace' | 'tenant-portal' | 'admin-console') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const { currentRole, setCurrentRole, currentUser, setCurrentUser, leases, applications, inquiries } = useApp();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const pendingApps = applications.filter(a => a.status === 'Pending').length;
  const newInquiries = inquiries.filter(i => i.status === 'New').length;
  const activeLeases = leases.filter(l => l.status === 'Sent to Tenant' || l.status === 'Active').length;

  const handleRoleToggle = () => {
    if (currentRole === 'tenant') {
      setCurrentRole('admin');
      onNavigate('admin-console');
    } else {
      setCurrentRole('tenant');
      onNavigate('marketplace');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            {/* Left: Logo & Location Indicator */}
            <div className="flex items-center gap-4 sm:gap-6">
              <button
                onClick={() => onNavigate('marketplace')}
                className="flex items-center hover:opacity-90 transition-opacity focus:outline-none"
              >
                <Logo size="md" />
              </button>

              <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-slate-100/80 text-slate-700 text-xs font-semibold rounded-full border border-slate-200">
                <MapPin className="w-3.5 h-3.5 text-[#0066FF]" />
                <span>Boston & Greater Boston, MA</span>
              </div>
            </div>

            {/* Center Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              <button
                onClick={() => onNavigate('marketplace')}
                className={`px-3.5 py-2 text-sm font-medium rounded-xl transition-colors ${
                  currentView === 'marketplace'
                    ? 'text-[#0B2038] bg-blue-50/90 font-bold border border-blue-200/60'
                    : 'text-slate-600 hover:text-[#0B2038] hover:bg-slate-50'
                }`}
              >
                Find Rentals
              </button>

              <button
                onClick={() => {
                  setCurrentRole('tenant');
                  onNavigate('tenant-portal');
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-xl transition-colors ${
                  currentView === 'tenant-portal'
                    ? 'text-[#0B2038] bg-blue-50/90 font-bold border border-blue-200/60'
                    : 'text-slate-600 hover:text-[#0B2038] hover:bg-slate-50'
                }`}
              >
                <FileText className="w-4 h-4 text-[#1E3A8A]" />
                <span>Tenant Portal</span>
                {activeLeases > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 bg-[#1E3A8A] text-white text-[11px] font-bold rounded-full">
                    {activeLeases}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setCurrentRole('admin');
                  onNavigate('admin-console');
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-xl transition-colors ${
                  currentView === 'admin-console'
                    ? 'text-white bg-[#0B2038] font-bold shadow-xs'
                    : 'text-slate-700 hover:text-[#0B2038] hover:bg-slate-50'
                }`}
                title="Single landlord platform: Landlord Console and Admin are the exact same console"
              >
                <ShieldCheck className="w-4 h-4 text-blue-300" />
                <span>Landlord Console</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-blue-500/20 text-blue-200 border border-blue-400/30">
                  1 Landlord
                </span>
                {(pendingApps > 0 || newInquiries > 0) && (
                  <span className="ml-0.5 px-1.5 py-0.2 bg-amber-400 text-slate-950 text-[11px] font-black rounded-full">
                    {pendingApps + newInquiries}
                  </span>
                )}
              </button>
            </nav>

            {/* Right: Quick Switcher & User Profile */}
            <div className="flex items-center gap-3">
              {/* Role Toggle Switch */}
              <button
                onClick={handleRoleToggle}
                className={`relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all duration-200 shadow-2xs ${
                  currentRole === 'admin'
                    ? 'bg-[#0B2038] border-[#0B2038] text-white hover:bg-[#071526]'
                    : 'bg-blue-50 border-blue-200 text-[#0B2038] hover:bg-blue-100/80'
                }`}
                title="Landlord and Admin are the same (1 landlord only). Click to toggle between Landlord Console and Tenant Portal."
              >
                {currentRole === 'admin' ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
                    <span className="hidden sm:inline">Landlord Console (David Sterling)</span>
                    <span className="sm:hidden">Landlord</span>
                  </>
                ) : (
                  <>
                    <Building2 className="w-3.5 h-3.5 text-[#1E3A8A]" />
                    <span className="hidden sm:inline">Tenant Portal</span>
                    <span className="sm:hidden">Tenant</span>
                  </>
                )}
              </button>

              {/* User Account / Profile */}
              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pl-2.5 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition focus:outline-none"
                  >
                    <div className="text-right hidden sm:block">
                      <div className="text-xs font-bold text-slate-800 leading-tight">
                        {currentUser.fullName}
                      </div>
                      <div className="text-[10px] text-slate-500 leading-none">
                        {currentRole === 'admin' ? 'Single Landlord' : 'Renter Account'}
                      </div>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white ${
                      currentRole === 'admin' ? 'bg-[#0B2038]' : 'bg-[#1E3A8A]'
                    }`}>
                      {currentUser.fullName.charAt(0)}
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1" />
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3.5 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-[#0B2038]">{currentUser.fullName}</p>
                        <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                        <span className="mt-1 text-[10px] font-bold text-[#1E3A8A] bg-blue-50 px-2 py-0.5 rounded-md inline-block">
                          {currentUser.role === 'admin' ? 'Sole Landlord / Admin' : 'Prospective Tenant'}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          setCurrentRole('tenant');
                          onNavigate('tenant-portal');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#1E3A8A]" />
                        My Rental Applications & Leases
                      </button>

                      <button
                        onClick={() => {
                          setCurrentRole('tenant');
                          onNavigate('tenant-portal');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <CreditCard className="w-3.5 h-3.5 text-[#1E3A8A]" />
                        Manual Rent Payments
                      </button>

                      <div className="border-t border-slate-100 my-1"></div>

                      <button
                        onClick={() => {
                          setCurrentRole('admin');
                          onNavigate('admin-console');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs text-[#0B2038] hover:bg-blue-50 flex items-center gap-2 font-bold"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-[#1E3A8A]" />
                        Open Landlord Console
                      </button>

                      <div className="border-t border-slate-100 my-1"></div>

                      <button
                        onClick={() => {
                          setCurrentUser(null);
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-[#0B2038] hover:bg-[#071526] text-white rounded-xl text-xs font-semibold shadow-xs transition"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Sign In / Register</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile secondary navigation */}
        <div className="lg:hidden border-t border-slate-100 px-4 py-2 flex items-center justify-around bg-slate-50/70 text-xs">
          <button
            onClick={() => onNavigate('marketplace')}
            className={`py-1 px-2.5 rounded-md font-medium ${
              currentView === 'marketplace' ? 'text-[#0B2038] font-bold bg-blue-50' : 'text-slate-600'
            }`}
          >
            Find Rentals
          </button>
          <button
            onClick={() => {
              setCurrentRole('tenant');
              onNavigate('tenant-portal');
            }}
            className={`py-1 px-2.5 rounded-md font-medium ${
              currentView === 'tenant-portal' ? 'text-[#0B2038] font-bold bg-blue-50' : 'text-slate-600'
            }`}
          >
            Tenant Portal ({activeLeases})
          </button>
          <button
            onClick={() => {
              setCurrentRole('admin');
              onNavigate('admin-console');
            }}
            className={`py-1 px-2.5 rounded-md font-medium flex items-center gap-1 ${
              currentView === 'admin-console' ? 'text-white font-bold bg-[#0B2038]' : 'text-slate-600'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
            Landlord Console
          </button>
        </div>
      </header>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
};
