import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  ShoppingCart,
  Languages,
  UserCheck,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  FileCheck2,
  Briefcase,
  Store,
  Menu,
  X,
  AlertCircle,
  FileBadge,
  Lock,
  LogOut,
  Pill,
  Package,
  Sparkles,
  Receipt,
  Snowflake,
  AlertTriangle,
  RefreshCw,
  Layers,
  TrendingUp,
  DollarSign,
  Users,
  Award,
  Type,
} from 'lucide-react';
import { PharmacyLogo } from './PharmacyLogo';

export const Header: React.FC = () => {
  const {
    language,
    setLanguage,
    currentUser,
    allUsers,
    switchUser,
    cartItemsCount,
    cartSuppliersCount,
    setIsCartOpen,
    activeTab,
    setActiveTab,
    openLoginModal,
    openRegisterModal,
    logout,
  } = useApp();

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileAccordion, setOpenMobileAccordion] = useState<string | null>(null);
  
  const [fontFamily, setFontFamily] = useState<'plex' | 'cairo' | 'system'>(() => {
    return (localStorage.getItem('preferred_font_family') as 'plex' | 'cairo' | 'system') || 'plex';
  });
  const [isFontMenuOpen, setIsFontMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.remove('font-mode-plex', 'font-mode-cairo', 'font-mode-system');
    document.body.classList.remove('font-mode-plex', 'font-mode-cairo', 'font-mode-system');

    document.documentElement.classList.add(`font-mode-${fontFamily}`);
    document.body.classList.add(`font-mode-${fontFamily}`);
    localStorage.setItem('preferred_font_family', fontFamily);
  }, [fontFamily]);

  // Close dropdowns on click outside or Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.header-dropdown-container')) {
        setOpenDropdown(null);
      }
      if (!target.closest('.font-menu-container')) {
        setIsFontMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null);
        setIsFontMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const isAr = language === 'ar';

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'pharmacy':
        return isAr ? 'صيدلية مرخصة' : 'Licensed Pharmacy';
      case 'supplier':
        return isAr ? 'مذخر / مكتب علمي' : 'Pharma Supplier';
      case 'rep':
        return isAr ? 'مندوب علمي' : 'Sales Representative';
      case 'admin':
        return isAr ? 'إدارة المنصة' : 'Platform Admin';
      default:
        return role;
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-8 h-16">
            {/* Zone 1: Brand Wordmark */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => {
                  if (currentUser?.role === 'pharmacy') setActiveTab('catalog');
                  if (currentUser?.role === 'supplier') setActiveTab('supplier_orders');
                  if (currentUser?.role === 'rep') setActiveTab('rep_overview');
                  if (currentUser?.role === 'admin') setActiveTab('admin_overview');
                }}
                className="flex items-center gap-2.5 text-left rtl:text-right group focus:outline-none"
              >
                <PharmacyLogo size="md" variant="red" />
                <div>
                  <div className="text-base font-extrabold text-slate-900 tracking-tight whitespace-nowrap flex items-center gap-1.5">
                    <span>{isAr ? 'منصة نبض' : 'Nabdh'}</span>
                    <span className="text-[10px] font-bold bg-red-100 text-red-800 px-1.5 py-0.2 rounded-md">
                      {isAr ? 'الصيدلانية' : 'Pharma'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium whitespace-nowrap">
                    {isAr ? 'سوق الأدوية والمتاجر المركزي' : 'Central Pharma & Wholesalers Hub'}
                  </div>
                </div>
              </button>
            </div>

            {/* Zone 2: Navigation Dropdowns (نبثاق القوائم التفاعلية) */}
            <nav className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-700">
              {currentUser?.role === 'pharmacy' && (
                <>
                  {/* Dropdown 1: دليل الأدوية والمتاجر */}
                  <div className="header-dropdown-container relative">
                    <button
                      type="button"
                      onClick={() => setOpenDropdown(openDropdown === 'catalog' ? null : 'catalog')}
                      className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs lg:text-sm font-semibold transition-all cursor-pointer ${
                        openDropdown === 'catalog' || activeTab === 'catalog' || activeTab === 'stores'
                          ? 'text-red-700 bg-red-50 ring-1 ring-red-200 shadow-2xs'
                          : 'text-slate-700 hover:text-red-700 hover:bg-slate-100'
                      }`}
                    >
                      <Pill className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{isAr ? 'دليل الأدوية والمتاجر' : 'Medicines & Stores'}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          openDropdown === 'catalog' ? 'rotate-180 text-red-600' : 'text-slate-400'
                        }`}
                      />
                    </button>

                    {openDropdown === 'catalog' && (
                      <div className="absolute top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 p-2 z-50 rtl:right-0 ltr:left-0">
                        <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 border-b border-slate-100 flex items-center justify-between">
                          <span>{isAr ? 'دليل التجهيز الدوائي' : 'Pharma Directory'}</span>
                          <span className="text-[10px] bg-red-100 text-red-800 font-bold px-1.5 py-0.5 rounded">
                            {isAr ? 'سوق نبض' : 'Nabdh Hub'}
                          </span>
                        </div>
                        <div className="mt-1 space-y-1">
                          <button
                            onClick={() => {
                              setActiveTab('catalog');
                              setOpenDropdown(null);
                            }}
                            className={`w-full flex items-start gap-3 p-2.5 rounded-lg text-right rtl:text-right ltr:text-left transition-colors cursor-pointer ${
                              activeTab === 'catalog' ? 'bg-red-50 text-red-900' : 'hover:bg-slate-50 text-slate-800'
                            }`}
                          >
                            <div className="p-2 rounded-lg bg-red-100 text-red-600 shrink-0 mt-0.5">
                              <Package className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-bold text-xs">{isAr ? 'كافة الأدوية والمونوغراف' : 'Medicines Catalog'}</span>
                                <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                                  {isAr ? '12,000+ صنف' : '12k+ items'}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                {isAr ? 'تصفح الأدوية، المواد الفعالة، والباركود' : 'Standardized medicines and active ingredients'}
                              </p>
                            </div>
                          </button>

                          <button
                            onClick={() => {
                              setActiveTab('stores');
                              setOpenDropdown(null);
                            }}
                            className={`w-full flex items-start gap-3 p-2.5 rounded-lg text-right rtl:text-right ltr:text-left transition-colors cursor-pointer ${
                              activeTab === 'stores' ? 'bg-red-50 text-red-900' : 'hover:bg-slate-50 text-slate-800'
                            }`}
                          >
                            <div className="p-2 rounded-lg bg-red-100 text-red-600 shrink-0 mt-0.5">
                              <Store className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-bold text-xs">{isAr ? 'دليل المتاجر والمذاخر المعتمدة' : 'Wholesalers Directory'}</span>
                                <span className="text-[9px] font-bold bg-red-100 text-red-800 px-1.5 py-0.5 rounded">
                                  {isAr ? '40+ مذخر' : '40+ Stores'}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                {isAr ? 'مذاخر ومكاتب علمية مرخصة في بغداد والمحافظات' : 'Licensed wholesalers in Baghdad & Governorates'}
                              </p>
                            </div>
                          </button>

                          <button
                            onClick={() => {
                              setActiveTab('catalog');
                              setOpenDropdown(null);
                            }}
                            className="w-full flex items-start gap-3 p-2.5 rounded-lg text-right rtl:text-right ltr:text-left hover:bg-slate-50 text-slate-800 transition-colors cursor-pointer"
                          >
                            <div className="p-2 rounded-lg bg-slate-100 text-slate-700 shrink-0 mt-0.5">
                              <Layers className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-bold text-xs">{isAr ? 'مقارنة أسعار وعروض الموردين' : 'Compare Offers'}</span>
                                <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                                  {isAr ? 'تحديث لحظي' : 'Live'}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                {isAr ? 'أفضل أسعار الجملة، شروط السداد، ومواعيد التسليم' : 'Compare supplier prices & payment terms'}
                              </p>
                            </div>
                          </button>

                          <button
                            onClick={() => {
                              setActiveTab('catalog');
                              setOpenDropdown(null);
                            }}
                            className="w-full flex items-start gap-3 p-2.5 rounded-lg text-right rtl:text-right ltr:text-left hover:bg-slate-50 text-slate-800 transition-colors cursor-pointer"
                          >
                            <div className="p-2 rounded-lg bg-amber-100 text-amber-700 shrink-0 mt-0.5">
                              <Sparkles className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-bold text-xs">{isAr ? 'عروض التجهيز السريع والبونص' : 'Bonus & Instant Deals'}</span>
                                <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                                  {isAr ? 'بونص 10+2' : 'Bonus'}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                {isAr ? 'بونصات صيدلانية وتخفيضات خاصة على الكميات' : 'Special volume bonuses and quick delivery'}
                              </p>
                            </div>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Dropdown 2: طلبياتي وفواتيري */}
                  <div className="header-dropdown-container relative">
                    <button
                      type="button"
                      onClick={() => setOpenDropdown(openDropdown === 'orders' ? null : 'orders')}
                      className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs lg:text-sm font-semibold transition-all cursor-pointer ${
                        openDropdown === 'orders' || activeTab === 'pharmacy_orders'
                          ? 'text-red-700 bg-red-50 ring-1 ring-red-200 shadow-2xs'
                          : 'text-slate-700 hover:text-red-700 hover:bg-slate-100'
                      }`}
                    >
                      <Receipt className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{isAr ? 'طلبياتي وفواتيري' : 'Orders & Invoices'}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          openDropdown === 'orders' ? 'rotate-180 text-red-600' : 'text-slate-400'
                        }`}
                      />
                    </button>

                    {openDropdown === 'orders' && (
                      <div className="absolute top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 p-2 z-50 rtl:right-0 ltr:left-0">
                        <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 border-b border-slate-100 flex items-center justify-between">
                          <span>{isAr ? 'إدارة الطلبيات والمحاسبة' : 'Orders & Accounting'}</span>
                          <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-1.5 py-0.5 rounded">
                            {isAr ? 'تجزئة الموردين' : 'Multi-Supplier'}
                          </span>
                        </div>
                        <div className="mt-1 space-y-1">
                          <button
                            onClick={() => {
                              setActiveTab('pharmacy_orders');
                              setOpenDropdown(null);
                            }}
                            className={`w-full flex items-start gap-3 p-2.5 rounded-lg text-right rtl:text-right ltr:text-left transition-colors cursor-pointer ${
                              activeTab === 'pharmacy_orders' ? 'bg-red-50 text-red-900' : 'hover:bg-slate-50 text-slate-800'
                            }`}
                          >
                            <div className="p-2 rounded-lg bg-red-100 text-red-600 shrink-0 mt-0.5">
                              <FileCheck2 className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-bold text-xs">{isAr ? 'طلبيات التجهيز المركزية' : 'Central Orders'}</span>
                                <span className="text-[9px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                                  {isAr ? 'متابعة' : 'Track'}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                {isAr ? 'متابعة حالات قبول وتجهيز الطلبيات المجزأة' : 'Track suborders fulfillment status by supplier'}
                              </p>
                            </div>
                          </button>

                          <button
                            onClick={() => {
                              setActiveTab('pharmacy_orders');
                              setOpenDropdown(null);
                            }}
                            className="w-full flex items-start gap-3 p-2.5 rounded-lg text-right rtl:text-right ltr:text-left hover:bg-slate-50 text-slate-800 transition-colors cursor-pointer"
                          >
                            <div className="p-2 rounded-lg bg-slate-100 text-slate-700 shrink-0 mt-0.5">
                              <Receipt className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-bold text-xs">{isAr ? 'فواتير التجهيز الرسمية والمحاسبة' : 'Tax & Supplier Invoices'}</span>
                              </div>
                              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                {isAr ? 'تحميل فواتير المذاخر الرسمية وسندات القبض' : 'Download invoices and supplier account statements'}
                              </p>
                            </div>
                          </button>

                          <button
                            onClick={() => {
                              setActiveTab('pharmacy_orders');
                              setOpenDropdown(null);
                            }}
                            className="w-full flex items-start gap-3 p-2.5 rounded-lg text-right rtl:text-right ltr:text-left hover:bg-slate-50 text-slate-800 transition-colors cursor-pointer"
                          >
                            <div className="p-2 rounded-lg bg-sky-100 text-sky-700 shrink-0 mt-0.5">
                              <Snowflake className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-bold text-xs">{isAr ? 'سلسلة التبريد (Cold-Chain 2-8°C)' : 'Cold-Chain Logs'}</span>
                                <span className="text-[9px] font-bold bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded">
                                  {isAr ? 'أمان الأنسولين' : '2-8°C'}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                {isAr ? 'سجل درجات الحرارة للأدوية الحساسة أثناء النقل' : 'Real-time temperature log during transport'}
                              </p>
                            </div>
                          </button>

                          <button
                            onClick={() => {
                              setIsCartOpen(true);
                              setOpenDropdown(null);
                            }}
                            className="w-full flex items-start gap-3 p-2.5 rounded-lg text-right rtl:text-right ltr:text-left bg-red-50/70 hover:bg-red-100/80 text-red-900 transition-colors cursor-pointer border border-red-200 mt-1"
                          >
                            <div className="p-2 rounded-lg bg-red-600 text-white shrink-0 mt-0.5">
                              <ShoppingCart className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-bold text-xs">{isAr ? 'سلة الطلبيات الموحدة' : 'Unified Cart'}</span>
                                {cartItemsCount > 0 && (
                                  <span className="text-[10px] font-bold bg-red-600 text-white px-2 py-0.2 rounded-full">
                                    {cartItemsCount} {isAr ? 'صنف' : 'items'}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-red-700 line-clamp-1 mt-0.5">
                                {isAr ? 'مراجعة الأصناف وتأكيد الإرسال للمذاخر' : 'Review items and submit checkout'}
                              </p>
                            </div>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Dropdown 3: الأمان والرقابة النقابية */}
                  <div className="header-dropdown-container relative">
                    <button
                      type="button"
                      onClick={() => setOpenDropdown(openDropdown === 'safety' ? null : 'safety')}
                      className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs lg:text-sm font-semibold transition-all cursor-pointer ${
                        openDropdown === 'safety' || activeTab === 'verification' || activeTab === 'disputes'
                          ? 'text-red-700 bg-red-50 ring-1 ring-red-200 shadow-2xs'
                          : 'text-slate-700 hover:text-red-700 hover:bg-slate-100'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{isAr ? 'الأمان والرقابة النقابية' : 'Safety & Syndicate'}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          openDropdown === 'safety' ? 'rotate-180 text-red-600' : 'text-slate-400'
                        }`}
                      />
                    </button>

                    {openDropdown === 'safety' && (
                      <div className="absolute top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 p-2 z-50 rtl:right-0 ltr:left-0">
                        <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 border-b border-slate-100 flex items-center justify-between">
                          <span>{isAr ? 'الامتثال الدوائي والسلامة' : 'Syndicate Compliance'}</span>
                          <span className="text-[10px] bg-red-100 text-red-800 font-bold px-1.5 py-0.5 rounded">
                            {isAr ? 'معايير نقابية' : 'Standards'}
                          </span>
                        </div>
                        <div className="mt-1 space-y-1">
                          <button
                            onClick={() => {
                              setActiveTab('verification');
                              setOpenDropdown(null);
                            }}
                            className={`w-full flex items-start gap-3 p-2.5 rounded-lg text-right rtl:text-right ltr:text-left transition-colors cursor-pointer ${
                              activeTab === 'verification' ? 'bg-red-50 text-red-900' : 'hover:bg-slate-50 text-slate-800'
                            }`}
                          >
                            <div className="p-2 rounded-lg bg-red-100 text-red-600 shrink-0 mt-0.5">
                              <ShieldCheck className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-bold text-xs">{isAr ? 'توثيق إجازة نقابة الصيادلة' : 'Syndicate License'}</span>
                                <span className="text-[9px] font-bold bg-red-100 text-red-800 px-1.5 py-0.5 rounded">
                                  {currentUser?.status === 'verified' ? (isAr ? 'موثقة' : 'Verified') : (isAr ? 'قيد التدقيق' : 'Pending')}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                {isAr ? 'فحص هوية النقابة وإجازة ممارسة المهنة' : 'Check Syndicate of Iraqi Pharmacists license'}
                              </p>
                            </div>
                          </button>

                          <button
                            onClick={() => {
                              setActiveTab('verification');
                              setOpenDropdown(null);
                            }}
                            className="w-full flex items-start gap-3 p-2.5 rounded-lg text-right rtl:text-right ltr:text-left hover:bg-slate-50 text-slate-800 transition-colors cursor-pointer"
                          >
                            <div className="p-2 rounded-lg bg-amber-100 text-amber-700 shrink-0 mt-0.5">
                              <AlertTriangle className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-bold text-xs">{isAr ? 'مركز الإنذارات وسحب التشغيلات' : 'Recalls & Alerts'}</span>
                                <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                                  {isAr ? 'إنذارات رسمية' : 'Official'}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                {isAr ? 'تنبيهات سلامة الدواء وسحب الباتشات من التداول' : 'Official drug recall notices and safety alerts'}
                              </p>
                            </div>
                          </button>

                          <button
                            onClick={() => {
                              setActiveTab('disputes');
                              setOpenDropdown(null);
                            }}
                            className={`w-full flex items-start gap-3 p-2.5 rounded-lg text-right rtl:text-right ltr:text-left transition-colors cursor-pointer ${
                              activeTab === 'disputes' ? 'bg-red-50 text-red-900' : 'hover:bg-slate-50 text-slate-800'
                            }`}
                          >
                            <div className="p-2 rounded-lg bg-slate-100 text-slate-700 shrink-0 mt-0.5">
                              <RefreshCw className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-bold text-xs">{isAr ? 'البلاغات والإرجاع الدوائي' : 'Disputes & Returns'}</span>
                              </div>
                              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                {isAr ? 'إرجاع البضاعة التالفة، الخطأ بالدفعة، وفروقات السعر' : 'Report damaged items, batch mismatch, or returns'}
                              </p>
                            </div>
                          </button>

                          <button
                            onClick={() => {
                              openRegisterModal();
                              setOpenDropdown(null);
                            }}
                            className="w-full flex items-start gap-3 p-2.5 rounded-lg text-right rtl:text-right ltr:text-left hover:bg-slate-50 text-slate-800 transition-colors cursor-pointer"
                          >
                            <div className="p-2 rounded-lg bg-slate-100 text-slate-700 shrink-0 mt-0.5">
                              <FileBadge className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-bold text-xs">{isAr ? 'تحديث ترخيص وبيانات الصيدلية' : 'Update Pharmacy License'}</span>
                              </div>
                              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                {isAr ? 'تعديل وثائق النقابة، الصيدلي المدير، وعنوان التوصيل' : 'Update license documents and delivery address'}
                              </p>
                            </div>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {currentUser?.role === 'supplier' && (
                <>
                  {/* Supplier Dropdown 1: عمليات التجهيز */}
                  <div className="header-dropdown-container relative">
                    <button
                      type="button"
                      onClick={() => setOpenDropdown(openDropdown === 'sup_orders' ? null : 'sup_orders')}
                      className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs lg:text-sm font-semibold transition-all cursor-pointer ${
                        openDropdown === 'sup_orders' || activeTab === 'supplier_orders'
                          ? 'text-red-700 bg-red-50 ring-1 ring-red-200 shadow-2xs'
                          : 'text-slate-700 hover:text-red-700 hover:bg-slate-100'
                      }`}
                    >
                      <Briefcase className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{isAr ? 'عمليات التجهيز' : 'Fulfillment Ops'}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          openDropdown === 'sup_orders' ? 'rotate-180 text-red-600' : 'text-slate-400'
                        }`}
                      />
                    </button>

                    {openDropdown === 'sup_orders' && (
                      <div className="absolute top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 p-2 z-50 rtl:right-0 ltr:left-0">
                        <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 border-b border-slate-100">
                          {isAr ? 'إدارة الطلبيات والشحن' : 'Orders & Dispatch'}
                        </div>
                        <div className="mt-1 space-y-1">
                          <button
                            onClick={() => {
                              setActiveTab('supplier_orders');
                              setOpenDropdown(null);
                            }}
                            className="w-full flex items-center gap-2.5 p-2 rounded-lg text-right rtl:text-right ltr:text-left hover:bg-slate-50 text-xs font-bold text-slate-800"
                          >
                            <FileCheck2 className="w-4 h-4 text-red-600" />
                            <span>{isAr ? 'طلبات التجهيز الواردة' : 'Incoming Suborders'}</span>
                          </button>
                          <button
                            onClick={() => {
                              setActiveTab('supplier_orders');
                              setOpenDropdown(null);
                            }}
                            className="w-full flex items-center gap-2.5 p-2 rounded-lg text-right rtl:text-right ltr:text-left hover:bg-slate-50 text-xs font-bold text-slate-800"
                          >
                            <Snowflake className="w-4 h-4 text-sky-600" />
                            <span>{isAr ? 'سلسلة التبريد والشحن المبرد' : 'Cold-Chain Shipments'}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Supplier Dropdown 2: المخزون والأسعار */}
                  <div className="header-dropdown-container relative">
                    <button
                      type="button"
                      onClick={() => setOpenDropdown(openDropdown === 'sup_inv' ? null : 'sup_inv')}
                      className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs lg:text-sm font-semibold transition-all cursor-pointer ${
                        openDropdown === 'sup_inv' || activeTab === 'supplier_inventory'
                          ? 'text-red-700 bg-red-50 ring-1 ring-red-200 shadow-2xs'
                          : 'text-slate-700 hover:text-red-700 hover:bg-slate-100'
                      }`}
                    >
                      <Package className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{isAr ? 'المخزون والأسعار' : 'Stock & Pricing'}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          openDropdown === 'sup_inv' ? 'rotate-180 text-red-600' : 'text-slate-400'
                        }`}
                      />
                    </button>

                    {openDropdown === 'sup_inv' && (
                      <div className="absolute top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 p-2 z-50 rtl:right-0 ltr:left-0">
                        <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 border-b border-slate-100">
                          {isAr ? 'التسعير ونظام FEFO' : 'Pricing & FEFO System'}
                        </div>
                        <div className="mt-1 space-y-1">
                          <button
                            onClick={() => {
                              setActiveTab('supplier_inventory');
                              setOpenDropdown(null);
                            }}
                            className="w-full flex items-center gap-2.5 p-2 rounded-lg text-right rtl:text-right ltr:text-left hover:bg-slate-50 text-xs font-bold text-slate-800"
                          >
                            <Layers className="w-4 h-4 text-red-600" />
                            <span>{isAr ? 'إدارة العروض والأسعار' : 'Offers & Stock Management'}</span>
                          </button>
                          <button
                            onClick={() => {
                              setActiveTab('supplier_inventory');
                              setOpenDropdown(null);
                            }}
                            className="w-full flex items-center gap-2.5 p-2 rounded-lg text-right rtl:text-right ltr:text-left hover:bg-slate-50 text-xs font-bold text-slate-800"
                          >
                            <AlertTriangle className="w-4 h-4 text-amber-600" />
                            <span>{isAr ? 'تنبيهات انتهاء الصلاحية FEFO' : 'FEFO Expiry Warnings'}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Supplier Link 3: كشف تسوية العمولات */}
                  <button
                    onClick={() => setActiveTab('supplier_reconciliation')}
                    className={`whitespace-nowrap transition-colors py-1.5 px-3 rounded-lg text-xs lg:text-sm font-semibold cursor-pointer ${
                      activeTab === 'supplier_reconciliation'
                        ? 'text-red-700 bg-red-50 ring-1 ring-red-200'
                        : 'text-slate-700 hover:text-red-700 hover:bg-slate-100'
                    }`}
                  >
                    {isAr ? 'كشف تسوية العمولات' : 'Commission Statements'}
                  </button>
                </>
              )}

              {currentUser?.role === 'rep' && (
                <>
                  {/* Rep Dropdown: شبكة الصيدليات والمندوب */}
                  <div className="header-dropdown-container relative">
                    <button
                      type="button"
                      onClick={() => setOpenDropdown(openDropdown === 'rep_hub' ? null : 'rep_hub')}
                      className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs lg:text-sm font-semibold transition-all cursor-pointer ${
                        openDropdown === 'rep_hub' || activeTab === 'rep_overview' || activeTab === 'rep_pharmacies'
                          ? 'text-red-700 bg-red-50 ring-1 ring-red-200 shadow-2xs'
                          : 'text-slate-700 hover:text-red-700 hover:bg-slate-100'
                      }`}
                    >
                      <Users className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{isAr ? 'شبكة المندوب والإحالات' : 'Rep Network'}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          openDropdown === 'rep_hub' ? 'rotate-180 text-red-600' : 'text-slate-400'
                        }`}
                      />
                    </button>

                    {openDropdown === 'rep_hub' && (
                      <div className="absolute top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 p-2 z-50 rtl:right-0 ltr:left-0">
                        <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 border-b border-slate-100">
                          {isAr ? 'لوحة المندوب العلمي' : 'Sales Representative'}
                        </div>
                        <div className="mt-1 space-y-1">
                          <button
                            onClick={() => {
                              setActiveTab('rep_overview');
                              setOpenDropdown(null);
                            }}
                            className="w-full flex items-center gap-2.5 p-2 rounded-lg text-right rtl:text-right ltr:text-left hover:bg-slate-50 text-xs font-bold text-slate-800"
                          >
                            <TrendingUp className="w-4 h-4 text-red-600" />
                            <span>{isAr ? 'لوحة المندوب ورمز الإحالة' : 'Referral Hub & QR Code'}</span>
                          </button>
                          <button
                            onClick={() => {
                              setActiveTab('rep_pharmacies');
                              setOpenDropdown(null);
                            }}
                            className="w-full flex items-center gap-2.5 p-2 rounded-lg text-right rtl:text-right ltr:text-left hover:bg-slate-50 text-xs font-bold text-slate-800"
                          >
                            <Building2 className="w-4 h-4 text-slate-600" />
                            <span>{isAr ? 'الصيدليات المسجلة عبرك' : 'Referred Pharmacies'}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Rep Link: المستحقات */}
                  <button
                    onClick={() => setActiveTab('rep_earnings')}
                    className={`whitespace-nowrap transition-colors py-1.5 px-3 rounded-lg text-xs lg:text-sm font-semibold cursor-pointer ${
                      activeTab === 'rep_earnings'
                        ? 'text-red-700 bg-red-50 ring-1 ring-red-200'
                        : 'text-slate-700 hover:text-red-700 hover:bg-slate-100'
                    }`}
                  >
                    {isAr ? 'احتساب المستحقات' : 'Commission Ledger'}
                  </button>
                </>
              )}

              {currentUser?.role === 'admin' && (
                <>
                  {/* Admin Dropdown 1: الرقابة والامتثال */}
                  <div className="header-dropdown-container relative">
                    <button
                      type="button"
                      onClick={() => setOpenDropdown(openDropdown === 'admin_gov' ? null : 'admin_gov')}
                      className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs lg:text-sm font-semibold transition-all cursor-pointer ${
                        openDropdown === 'admin_gov' || activeTab === 'admin_verifications' || activeTab === 'admin_audit'
                          ? 'text-red-700 bg-red-50 ring-1 ring-red-200 shadow-2xs'
                          : 'text-slate-700 hover:text-red-700 hover:bg-slate-100'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{isAr ? 'الرقابة والتراخيص' : 'Governance & Audits'}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          openDropdown === 'admin_gov' ? 'rotate-180 text-red-600' : 'text-slate-400'
                        }`}
                      />
                    </button>

                    {openDropdown === 'admin_gov' && (
                      <div className="absolute top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 p-2 z-50 rtl:right-0 ltr:left-0">
                        <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 border-b border-slate-100">
                          {isAr ? 'الرقابة والتراخيص النقابية' : 'Compliance & Audits'}
                        </div>
                        <div className="mt-1 space-y-1">
                          <button
                            onClick={() => {
                              setActiveTab('admin_verifications');
                              setOpenDropdown(null);
                            }}
                            className="w-full flex items-center gap-2.5 p-2 rounded-lg text-right rtl:text-right ltr:text-left hover:bg-slate-50 text-xs font-bold text-slate-800"
                          >
                            <UserCheck className="w-4 h-4 text-red-600" />
                            <span>{isAr ? 'تدقيق تراخيص النقابة' : 'License Verifications'}</span>
                          </button>
                          <button
                            onClick={() => {
                              setActiveTab('admin_orders');
                              setOpenDropdown(null);
                            }}
                            className="w-full flex items-center gap-2.5 p-2 rounded-lg text-right rtl:text-right ltr:text-left hover:bg-slate-50 text-xs font-bold text-slate-800"
                          >
                            <FileCheck2 className="w-4 h-4 text-slate-600" />
                            <span>{isAr ? 'مراقبة الطلبيات والنزاعات' : 'Orders & Disputes'}</span>
                          </button>
                          <button
                            onClick={() => {
                              setActiveTab('admin_audit');
                              setOpenDropdown(null);
                            }}
                            className="w-full flex items-center gap-2.5 p-2 rounded-lg text-right rtl:text-right ltr:text-left hover:bg-slate-50 text-xs font-bold text-slate-800"
                          >
                            <Lock className="w-4 h-4 text-amber-600" />
                            <span>{isAr ? 'سجل الرقابة والأمان (Audit Log)' : 'Audit Logs'}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Admin Dropdown 2: المالية والمؤشرات */}
                  <div className="header-dropdown-container relative">
                    <button
                      type="button"
                      onClick={() => setOpenDropdown(openDropdown === 'admin_fin' ? null : 'admin_fin')}
                      className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs lg:text-sm font-semibold transition-all cursor-pointer ${
                        openDropdown === 'admin_fin' || activeTab === 'admin_overview' || activeTab === 'admin_rules'
                          ? 'text-red-700 bg-red-50 ring-1 ring-red-200 shadow-2xs'
                          : 'text-slate-700 hover:text-red-700 hover:bg-slate-100'
                      }`}
                    >
                      <DollarSign className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{isAr ? 'المالية والسياسات' : 'Financials & Rules'}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          openDropdown === 'admin_fin' ? 'rotate-180 text-red-600' : 'text-slate-400'
                        }`}
                      />
                    </button>

                    {openDropdown === 'admin_fin' && (
                      <div className="absolute top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 p-2 z-50 rtl:right-0 ltr:left-0">
                        <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 border-b border-slate-100">
                          {isAr ? 'المؤشرات وحسابات المنصة' : 'Platform Financials'}
                        </div>
                        <div className="mt-1 space-y-1">
                          <button
                            onClick={() => {
                              setActiveTab('admin_overview');
                              setOpenDropdown(null);
                            }}
                            className="w-full flex items-center gap-2.5 p-2 rounded-lg text-right rtl:text-right ltr:text-left hover:bg-slate-50 text-xs font-bold text-slate-800"
                          >
                            <TrendingUp className="w-4 h-4 text-red-600" />
                            <span>{isAr ? 'التقرير المالي والمؤشرات (GMV)' : 'Financials & GMV'}</span>
                          </button>
                          <button
                            onClick={() => {
                              setActiveTab('admin_rules');
                              setOpenDropdown(null);
                            }}
                            className="w-full flex items-center gap-2.5 p-2 rounded-lg text-right rtl:text-right ltr:text-left hover:bg-slate-50 text-xs font-bold text-slate-800"
                          >
                            <Layers className="w-4 h-4 text-slate-600" />
                            <span>{isAr ? 'قواعد ونسب العمولات' : 'Commission Rules'}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </nav>

            {/* Zone 3: Interactive Controls (Switch Role, Language, Cart) */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Font Family Selector (تخصيص الخط الطبيعي) */}
              <div className="font-menu-container relative">
                <button
                  type="button"
                  onClick={() => setIsFontMenuOpen(!isFontMenuOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
                  title={isAr ? 'تغيير نمط الخط' : 'Change Font'}
                >
                  <Type className="w-3.5 h-3.5 text-slate-600" />
                  <span className="hidden sm:inline">
                    {fontFamily === 'plex' ? (isAr ? 'خط طبيعي' : 'Natural') : fontFamily === 'cairo' ? (isAr ? 'خط كايرو' : 'Cairo') : (isAr ? 'خط النظام' : 'System')}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {isFontMenuOpen && (
                  <div className="absolute top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-50 rtl:left-0 ltr:right-0">
                    <div className="px-2.5 py-1.5 text-[11px] font-bold text-slate-400 border-b border-slate-100">
                      {isAr ? 'اختر نمط الخط المفضل' : 'Select Font Style'}
                    </div>
                    <div className="mt-1 space-y-1">
                      <button
                        type="button"
                        onClick={() => {
                          setFontFamily('plex');
                          setIsFontMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          fontFamily === 'plex' ? 'bg-red-50 text-red-700 font-bold' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span>{isAr ? 'خط طبيعي (IBM Plex)' : 'Natural (IBM Plex)'}</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                          {isAr ? 'طبيعي' : 'Default'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setFontFamily('cairo');
                          setIsFontMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          fontFamily === 'cairo' ? 'bg-red-50 text-red-700 font-bold' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span>{isAr ? 'خط عصري قياسي (Cairo)' : 'Modern (Cairo)'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setFontFamily('system');
                          setIsFontMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          fontFamily === 'system' ? 'bg-red-50 text-red-700 font-bold' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span>{isAr ? 'خط النظام (Tahoma/Segoe)' : 'System Native'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Language Toggle */}
              <button
                onClick={() => setLanguage(isAr ? 'en' : 'ar')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                title={isAr ? 'Switch to English' : 'التحويل إلى العربية'}
              >
                <Languages className="w-3.5 h-3.5" />
                <span>{isAr ? 'EN' : 'العربية'}</span>
              </button>

              {/* Gateway to Offices & Wholesalers Portal */}
              <button
                onClick={() => {
                  if (currentUser?.role === 'supplier') {
                    setActiveTab('supplier_inventory');
                  } else {
                    const supplierUser = allUsers.find(u => u.role === 'supplier');
                    if (supplierUser) {
                      switchUser(supplierUser.id);
                      setActiveTab('supplier_inventory');
                    } else {
                      setIsRoleModalOpen(true);
                    }
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg shadow-2xs transition-all cursor-pointer ${
                  currentUser?.role === 'supplier'
                    ? 'text-white bg-red-600 hover:bg-red-700 shadow-sm'
                    : 'text-red-900 bg-red-50 hover:bg-red-100 border border-red-300'
                }`}
                title={isAr ? 'بوابة المكاتب والمذاخر والشركات الدوائية' : 'Offices & Wholesalers Portal'}
              >
                <Building2 className="w-3.5 h-3.5 text-red-600" />
                <span className="hidden sm:inline">
                  {isAr ? 'بوابة المكاتب والشركات' : 'Offices Portal'}
                </span>
              </button>

              {/* Pharmacy Sign In / Registration with License */}
              <button
                onClick={openRegisterModal}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-800 bg-red-50 hover:bg-red-100 border border-red-300 rounded-lg shadow-2xs transition-all cursor-pointer"
                title={isAr ? 'واجهة تسجيل الدخول وترخيص الصيدلية' : 'Pharmacy Login & Syndicate License'}
              >
                <FileBadge className="w-3.5 h-3.5 text-red-600" />
                <span className="hidden sm:inline">
                  {isAr ? 'تسجيل / ترخيص صيدلية' : 'Pharmacy Auth'}
                </span>
              </button>

              {/* Cart Button (Always visible for Pharmacy) */}
              {currentUser?.role === 'pharmacy' && (
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span className="hidden sm:inline">{isAr ? 'سلة الطلبيات' : 'Cart'}</span>
                  {cartItemsCount > 0 && (
                    <span className="font-mono-nums bg-white text-red-800 text-[11px] font-bold px-1.5 py-0.2 rounded-full">
                      {cartItemsCount}
                    </span>
                  )}
                </button>
              )}

              {/* Current Role Switcher Button */}
              <button
                onClick={() => setIsRoleModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors cursor-pointer"
              >
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="max-w-[120px] sm:max-w-[160px] truncate">
                  {currentUser?.organizationName || currentUser?.name}
                </span>
                <span className="text-[10px] text-slate-500 hidden sm:inline">
                  ({getRoleBadge(currentUser?.role || '')})
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Logout Button (Returns to Login Screen) */}
              <button
                onClick={logout}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-red-700 bg-slate-100 hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-lg transition-colors cursor-pointer"
                title={isAr ? 'تسجيل الخروج والعودة لشاشة الدخول' : 'Log out & return to login screen'}
              >
                <LogOut className="w-3.5 h-3.5 text-slate-500 group-hover:text-red-600" />
                <span className="hidden sm:inline">{isAr ? 'خروج' : 'Logout'}</span>
              </button>

              {/* Mobile menu trigger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-1.5 text-slate-600 hover:text-slate-900"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Drawer with Expandable Menus (نبثاق القوائم في الجوال) */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2 max-h-[75vh] overflow-y-auto">
            {currentUser?.role === 'pharmacy' && (
              <>
                {/* Mobile Section 1: دليل الأدوية والمتاجر */}
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setOpenMobileAccordion(openMobileAccordion === 'catalog' ? null : 'catalog')}
                    className="w-full flex items-center justify-between p-3 text-sm font-bold text-slate-800 bg-slate-50/70 hover:bg-slate-100"
                  >
                    <div className="flex items-center gap-2">
                      <Pill className="w-4 h-4 text-red-600" />
                      <span>{isAr ? 'دليل الأدوية والمتاجر' : 'Medicines & Stores'}</span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                        openMobileAccordion === 'catalog' ? 'rotate-180 text-red-600' : ''
                      }`}
                    />
                  </button>
                  {openMobileAccordion === 'catalog' && (
                    <div className="p-2 space-y-1 bg-white border-t border-slate-100">
                      <button
                        onClick={() => {
                          setActiveTab('catalog');
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-md text-xs font-semibold text-slate-700 hover:bg-red-50 hover:text-red-900"
                      >
                        <Package className="w-4 h-4 text-red-600" />
                        <span>{isAr ? 'كافة الأدوية والمونوغراف العلمي' : 'Medicines Catalog'}</span>
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('stores');
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-md text-xs font-semibold text-slate-700 hover:bg-red-50 hover:text-red-900"
                      >
                        <Store className="w-4 h-4 text-red-600" />
                        <span>{isAr ? 'دليل المتاجر والمذاخر المعتمدة' : 'Wholesalers Directory'}</span>
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('catalog');
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-md text-xs font-semibold text-slate-700 hover:bg-red-50 hover:text-red-900"
                      >
                        <Layers className="w-4 h-4 text-emerald-600" />
                        <span>{isAr ? 'مقارنة أسعار وعروض الموردين' : 'Compare Offers'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Mobile Section 2: طلبياتي وفواتيري */}
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setOpenMobileAccordion(openMobileAccordion === 'orders' ? null : 'orders')}
                    className="w-full flex items-center justify-between p-3 text-sm font-bold text-slate-800 bg-slate-50/70 hover:bg-slate-100"
                  >
                    <div className="flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-red-600" />
                      <span>{isAr ? 'طلبياتي وفواتيري' : 'Orders & Invoices'}</span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                        openMobileAccordion === 'orders' ? 'rotate-180 text-red-600' : ''
                      }`}
                    />
                  </button>
                  {openMobileAccordion === 'orders' && (
                    <div className="p-2 space-y-1 bg-white border-t border-slate-100">
                      <button
                        onClick={() => {
                          setActiveTab('pharmacy_orders');
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-md text-xs font-semibold text-slate-700 hover:bg-red-50 hover:text-red-900"
                      >
                        <FileCheck2 className="w-4 h-4 text-red-600" />
                        <span>{isAr ? 'طلبيات التجهيز المركزية' : 'Central Orders'}</span>
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('pharmacy_orders');
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-md text-xs font-semibold text-slate-700 hover:bg-red-50 hover:text-red-900"
                      >
                        <Snowflake className="w-4 h-4 text-sky-600" />
                        <span>{isAr ? 'سلسلة التبريد (Cold-Chain)' : 'Cold-Chain Shipments'}</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsCartOpen(true);
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-md text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100"
                      >
                        <ShoppingCart className="w-4 h-4 text-red-600" />
                        <span>{isAr ? 'فتح سلة الطلبيات الموحدة' : 'Open Unified Cart'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Mobile Section 3: الأمان والرقابة النقابية */}
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setOpenMobileAccordion(openMobileAccordion === 'safety' ? null : 'safety')}
                    className="w-full flex items-center justify-between p-3 text-sm font-bold text-slate-800 bg-slate-50/70 hover:bg-slate-100"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-red-600" />
                      <span>{isAr ? 'الأمان والرقابة النقابية' : 'Safety & Syndicate'}</span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                        openMobileAccordion === 'safety' ? 'rotate-180 text-red-600' : ''
                      }`}
                    />
                  </button>
                  {openMobileAccordion === 'safety' && (
                    <div className="p-2 space-y-1 bg-white border-t border-slate-100">
                      <button
                        onClick={() => {
                          setActiveTab('verification');
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-md text-xs font-semibold text-slate-700 hover:bg-red-50 hover:text-red-900"
                      >
                        <ShieldCheck className="w-4 h-4 text-red-600" />
                        <span>{isAr ? 'توثيق إجازة نقابة الصيادلة' : 'Syndicate License'}</span>
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('verification');
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-md text-xs font-semibold text-slate-700 hover:bg-red-50 hover:text-red-900"
                      >
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span>{isAr ? 'مركز الإنذارات وسحب التشغيلات' : 'Recalls & Alerts'}</span>
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('disputes');
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-md text-xs font-semibold text-slate-700 hover:bg-red-50 hover:text-red-900"
                      >
                        <RefreshCw className="w-4 h-4 text-slate-600" />
                        <span>{isAr ? 'البلاغات والإرجاع الدوائي' : 'Disputes & Returns'}</span>
                      </button>
                      <button
                        onClick={() => {
                          openRegisterModal();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-md text-xs font-semibold text-slate-700 hover:bg-red-50 hover:text-red-900"
                      >
                        <FileBadge className="w-4 h-4 text-red-600" />
                        <span>{isAr ? 'تحديث ترخيص وبيانات الصيدلية' : 'Update Pharmacy License'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {currentUser?.role === 'supplier' && (
              <>
                <button
                  onClick={() => {
                    setActiveTab('supplier_orders');
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-right rtl:text-right ltr:text-left py-2.5 px-3 rounded-md text-sm font-semibold hover:bg-slate-100"
                >
                  {isAr ? 'طلبات التجهيز الواردة' : 'Incoming Suborders'}
                </button>
                <button
                  onClick={() => {
                    setActiveTab('supplier_inventory');
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-right rtl:text-right ltr:text-left py-2.5 px-3 rounded-md text-sm font-semibold hover:bg-slate-100"
                >
                  {isAr ? 'إدارة الأسعار والمخزون' : 'Offers & Stock'}
                </button>
                <button
                  onClick={() => {
                    setActiveTab('supplier_reconciliation');
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-right rtl:text-right ltr:text-left py-2.5 px-3 rounded-md text-sm font-semibold hover:bg-slate-100"
                >
                  {isAr ? 'كشف تسوية العمولات' : 'Commission Statements'}
                </button>
              </>
            )}

            {currentUser?.role === 'rep' && (
              <>
                <button
                  onClick={() => {
                    setActiveTab('rep_overview');
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-right rtl:text-right ltr:text-left py-2.5 px-3 rounded-md text-sm font-semibold hover:bg-slate-100"
                >
                  {isAr ? 'لوحة المندوب والإحالات' : 'Referral Hub'}
                </button>
                <button
                  onClick={() => {
                    setActiveTab('rep_pharmacies');
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-right rtl:text-right ltr:text-left py-2.5 px-3 rounded-md text-sm font-semibold hover:bg-slate-100"
                >
                  {isAr ? 'الصيدليات المسجلة' : 'Referred Pharmacies'}
                </button>
                <button
                  onClick={() => {
                    setActiveTab('rep_earnings');
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-right rtl:text-right ltr:text-left py-2.5 px-3 rounded-md text-sm font-semibold hover:bg-slate-100"
                >
                  {isAr ? 'احتساب المستحقات' : 'Commission Ledger'}
                </button>
              </>
            )}

            {currentUser?.role === 'admin' && (
              <>
                <button
                  onClick={() => {
                    setActiveTab('admin_overview');
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-right rtl:text-right ltr:text-left py-2.5 px-3 rounded-md text-sm font-semibold hover:bg-slate-100"
                >
                  {isAr ? 'المؤشرات المالية (GMV)' : 'Financials & GMV'}
                </button>
                <button
                  onClick={() => {
                    setActiveTab('admin_verifications');
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-right rtl:text-right ltr:text-left py-2.5 px-3 rounded-md text-sm font-semibold hover:bg-slate-100"
                >
                  {isAr ? 'تدقيق التراخيص النقابية' : 'Verifications'}
                </button>
                <button
                  onClick={() => {
                    setActiveTab('admin_audit');
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-right rtl:text-right ltr:text-left py-2.5 px-3 rounded-md text-sm font-semibold hover:bg-slate-100"
                >
                  {isAr ? 'سجل الرقابة والأمان' : 'Audit Logs'}
                </button>
              </>
            )}

            {/* Mobile Font Preference Selection */}
            <div className="pt-3 border-t border-slate-200 mt-2">
              <div className="text-[11px] font-bold text-slate-500 mb-2 px-1 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-slate-500" />
                <span>{isAr ? 'نمط الخط' : 'Font Style'}</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setFontFamily('plex')}
                  className={`py-1.5 px-2 text-center rounded-lg text-xs font-semibold cursor-pointer ${
                    fontFamily === 'plex' ? 'bg-red-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {isAr ? 'طبيعي' : 'Plex'}
                </button>
                <button
                  type="button"
                  onClick={() => setFontFamily('cairo')}
                  className={`py-1.5 px-2 text-center rounded-lg text-xs font-semibold cursor-pointer ${
                    fontFamily === 'cairo' ? 'bg-red-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {isAr ? 'كايرو' : 'Cairo'}
                </button>
                <button
                  type="button"
                  onClick={() => setFontFamily('system')}
                  className={`py-1.5 px-2 text-center rounded-lg text-xs font-semibold cursor-pointer ${
                    fontFamily === 'system' ? 'bg-red-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {isAr ? 'النظام' : 'System'}
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Role Switcher Modal (Allows testing all 4 personas easily) */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {isAr ? 'التبديل بين حسابات الأدوار التجريبية' : 'Switch Role & Test Persona'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isAr
                    ? 'اختر أحد الأدوار الأربعة لاختبار الصلاحيات وسير العمل'
                    : 'Select one of the 4 roles to test workflow and permissions'}
                </p>
              </div>
              <button
                onClick={() => setIsRoleModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-2.5 max-h-[60vh] overflow-y-auto">
              {allUsers.map(user => {
                const isActive = currentUser?.id === user.id;
                return (
                  <button
                    key={user.id}
                    onClick={async () => {
                      await switchUser(user.id);
                      setIsRoleModalOpen(false);
                    }}
                    className={`w-full text-left rtl:text-right p-3.5 rounded-lg border transition-all flex items-start justify-between ${
                      isActive
                        ? 'border-red-600 bg-red-50/50 ring-1 ring-red-600'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{user.name}</span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                            user.role === 'pharmacy'
                              ? 'bg-blue-100 text-blue-800'
                              : user.role === 'supplier'
                              ? 'bg-purple-100 text-purple-800'
                              : user.role === 'rep'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {getRoleBadge(user.role)}
                        </span>
                        {user.status === 'verified' ? (
                          <span className="text-[10px] text-red-700 flex items-center gap-0.5 font-medium">
                            <ShieldCheck className="w-3 h-3" />
                            {isAr ? 'موثق' : 'Verified'}
                          </span>
                        ) : (
                          <span className="text-[10px] text-amber-700 flex items-center gap-0.5 font-medium">
                            <AlertCircle className="w-3 h-3" />
                            {isAr ? 'قيد التدقيق' : 'Pending Review'}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-600 mt-1">{user.organizationName}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {user.governorate} {user.licenseNumber ? `· إجازة: ${user.licenseNumber}` : ''}
                      </div>
                    </div>
                    {isActive && (
                      <span className="text-xs font-bold text-red-700 shrink-0">
                        {isAr ? 'نشط الآن' : 'Active'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  setIsRoleModalOpen(false);
                  openRegisterModal();
                }}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-red-800 bg-red-50 hover:bg-red-100 border border-red-300 rounded-lg transition-colors cursor-pointer"
              >
                <FileBadge className="w-4 h-4 text-red-600" />
                <span>{isAr ? '+ تسجيل وترخيص صيدلية جديدة' : '+ Register New Licensed Pharmacy'}</span>
              </button>

              <button
                onClick={() => setIsRoleModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                {isAr ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
