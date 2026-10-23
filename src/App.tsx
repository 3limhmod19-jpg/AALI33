import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { LoginScreen } from './components/LoginScreen';
import { PharmacyDashboard } from './components/PharmacyDashboard';
import { SupplierDashboard } from './components/SupplierDashboard';
import { RepDashboard } from './components/RepDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { StoresDirectory } from './components/StoresDirectory';
import { PharmacyLogo } from './components/PharmacyLogo';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentUser, isAuthenticated, language, toastMessage, activeTab } = useApp();
  const isAr = language === 'ar';

  // If user is not authenticated yet, show Login & Registration Gate BEFORE opening program interface
  if (!isAuthenticated || !currentUser) {
    return (
      <div className="relative">
        <LoginScreen />

        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 border border-slate-700 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans animate-fade-in">
      {/* Top Header */}
      <Header />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'stores' ? (
          <StoresDirectory />
        ) : (
          <>
            {currentUser?.role === 'pharmacy' && <PharmacyDashboard />}
            {currentUser?.role === 'supplier' && <SupplierDashboard />}
            {currentUser?.role === 'rep' && <RepDashboard />}
            {currentUser?.role === 'admin' && <AdminDashboard />}
          </>
        )}
      </main>

      {/* Multi-Supplier Split Cart Drawer */}
      <CartDrawer />

      {/* Pharmacy Login / Registration Modal with Name, Phone, Region, License */}
      <AuthModal />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 border border-slate-700 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <PharmacyLogo size="sm" variant="emerald" />
              <span className="font-bold text-slate-900">
                {isAr ? 'منصة نبض' : 'Nabdh'}
              </span>
              <span>·</span>
              <span>
                {isAr ? 'سوق الأدوية والمتاجر العراقي المركزي' : 'Iraqi Central Pharmaceutical Hub'}
              </span>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span>{isAr ? 'بغداد · أربيل · البصرة · النجف' : 'Baghdad · Erbil · Basra · Najaf'}</span>
              <span>·</span>
              <span>{isAr ? 'نقابة صيادلة العراق' : 'Syndicate of Iraqi Pharmacists'}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 leading-relaxed text-center">
            {isAr
              ? 'تنويه تنظيمي وتجريبي: المنصة وسيط تقني لتسهيل التبادل التجاري بين المذاخر والشركات والمكاتب العلمية والصيدليات المرخصة في جمهورية العراق. المنصة لا تبيع الأدوية ولا تحتفظ بالمخزون، وتتم المعاملات المالية وقوائم التجهيز مباشرة بين الأطراف المرخصة. جميع البيانات المعروضة في هذه النسخة افتراضية لأغراض المحاكاة والتطوير.'
              : 'Regulatory and Demonstration Notice: The platform operates as a digital marketplace intermediary connecting licensed pharmaceutical wholesalers, bureaus, and licensed community pharmacies across Iraq. The platform does not sell medicine or hold inventory; transactions and invoices are handled directly between licensed entities. All catalog prices and records in this demo are simulated fictional data.'}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
