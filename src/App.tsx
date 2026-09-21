import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { Marketplace } from './pages/Marketplace';
import { AdminConsole } from './components/admin/AdminConsole';
import { TenantPortal } from './components/tenant/TenantPortal';
import { Logo } from './components/Logo';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  ExternalLink,
  Phone,
  Mail
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { currentView, setCurrentView, currentRole, setRole, setView } = useApp();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-blue-100 selection:text-[#0066FF]">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
      />

      {/* Primary View Router */}
      <main className="flex-1">
        {currentView === 'marketplace' && <Marketplace />}
        {currentView === 'admin-console' && <AdminConsole />}
        {currentView === 'tenant-portal' && <TenantPortal />}
      </main>

      {/* Boston-Themed Avail-Style Footer */}
      <footer className="bg-slate-950 text-white border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            {/* Column 1: Brand & Logo */}
            <div className="space-y-3 md:col-span-1">
              <Logo size="md" light={true} />
              <p className="text-slate-400 text-xs leading-relaxed">
                Avail-inspired Boston rental ecosystem connecting tenants directly with verified residential properties. Integrated with Compass.com and Apartments.com data sources.
              </p>
              <div className="flex items-center gap-1 text-[11px] text-slate-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Single-Landlord Verified Portfolio</span>
              </div>
            </div>

            {/* Column 2: Boston Neighborhoods */}
            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
                Boston Rental Neighborhoods
              </h4>
              <ul className="space-y-1.5 text-slate-400">
                <li><button onClick={() => setView('marketplace')} className="hover:text-white transition">Back Bay & Copley</button></li>
                <li><button onClick={() => setView('marketplace')} className="hover:text-white transition">Beacon Hill & West End</button></li>
                <li><button onClick={() => setView('marketplace')} className="hover:text-white transition">South End & Ink Block</button></li>
                <li><button onClick={() => setView('marketplace')} className="hover:text-white transition">Seaport District</button></li>
                <li><button onClick={() => setView('marketplace')} className="hover:text-white transition">Cambridge (Kendall / Harvard)</button></li>
                <li><button onClick={() => setView('marketplace')} className="hover:text-white transition">Malden & Orange Line</button></li>
              </ul>
            </div>

            {/* Column 3: Platform Features */}
            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
                Platform Workflows
              </h4>
              <ul className="space-y-1.5 text-slate-400">
                <li><button onClick={() => setView('marketplace')} className="hover:text-white transition">Direct Property Search</button></li>
                <li><button onClick={() => setView('marketplace')} className="hover:text-white transition">Online Rental Application</button></li>
                <li><button onClick={() => setView('tenant-portal')} className="hover:text-white transition">Tenant Digital Portal</button></li>
                <li><button onClick={() => setRole('admin')} className="hover:text-white transition">Landlord URL Importer</button></li>
                <li><button onClick={() => setRole('admin')} className="hover:text-white transition">Bulk CSV Listing Ingestion</button></li>
                <li><button onClick={() => setRole('admin')} className="hover:text-white transition">Massachusetts Lease Generation</button></li>
              </ul>
            </div>

            {/* Column 4: Sole Landlord Contact & Manual Payments */}
            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
                Landlord Office
              </h4>
              <div className="space-y-2 text-slate-400 text-xs">
                <div>
                  <strong className="text-white block">David Sterling</strong>
                  <span>Sole Property Owner & Manager</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#0066FF]" />
                  <span>100 Franklin St, Boston, MA 02110</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#0066FF]" />
                  <span>rentals@bostonbeaconmgmt.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#0066FF]" />
                  <span>(617) 555-0192</span>
                </div>

                <div className="pt-2">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                    Accepted Manual Payments
                  </span>
                  <span className="text-slate-300 text-[11px]">
                    Zelle • Venmo • Eastern Bank ACH • Cashier Check
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <div>
              © 2026 Boston Beacon Property Management. Designed with Avail.co architecture for Massachusetts tenants & owners.
            </div>

            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <span>Active Role:</span>
                <strong className={currentRole === 'admin' ? 'text-amber-400' : 'text-blue-400'}>
                  {currentRole === 'admin' ? 'Landlord (David Sterling)' : 'Tenant (Elena Rostova)'}
                </strong>
              </span>

              <button
                onClick={() => setRole(currentRole === 'admin' ? 'tenant' : 'admin')}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-slate-200 rounded-lg transition"
              >
                Switch to {currentRole === 'admin' ? 'Tenant Mode' : 'Landlord Admin'}
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
