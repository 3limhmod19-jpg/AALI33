import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Building2,
  Phone,
  MapPin,
  FileBadge,
  User,
  CheckCircle2,
  X,
  Sparkles,
  ArrowRight,
  AlertCircle,
  FileText,
  UploadCloud,
  Lock,
  Stethoscope,
  Info,
} from 'lucide-react';
import { PharmacyLogo } from './PharmacyLogo';

const IRAQI_GOVERNORATES = [
  { value: 'بغداد - المنصور', label: 'بغداد - المنصور (الكرخ)' },
  { value: 'بغداد - الكرادة', label: 'بغداد - الكرادة (الرصافة)' },
  { value: 'بغداد - الحارثية', label: 'بغداد - الحارثية والشارع الطبي' },
  { value: 'بغداد - الكاظمية', label: 'بغداد - الكاظمية المقدسة' },
  { value: 'بغداد - الأعظمية', label: 'بغداد - الأعظمية' },
  { value: 'بغداد - زيونة', label: 'بغداد - زيونة وشارع فلسطين' },
  { value: 'بغداد - اليرموك', label: 'بغداد - اليرموك وحي الجامعة' },
  { value: 'البصرة - العشار', label: 'البصرة - العشار والجبيلة' },
  { value: 'البصرة - الطويسة', label: 'البصرة - الطويسة والجزائر' },
  { value: 'أربيل - شارع 60', label: 'أربيل - شارع 60 وعينكاوة' },
  { value: 'النجف الأشرف - شارع الكوفة', label: 'النجف الأشرف - شارع الكوفة والأمير' },
  { value: 'كربلاء المقدسة - حي الحسين', label: 'كربلاء المقدسة - حي الحسين والعباس' },
  { value: 'السليمانية - بختياري', label: 'السليمانية - شارع سالم وبختياري' },
  { value: 'نينوى - الموصل (المجموعة)', label: 'نينوى - الموصل (المجموعة الثقافية)' },
  { value: 'بابل - الحلة', label: 'بابل - الحلة (شارع الأطباء)' },
  { value: 'ذي قار - الناصرية', label: 'ذي قار - الناصرية (حي الإدارة المحلية)' },
  { value: 'كركوك - طريق بغداد', label: 'كركوك - طريق بغداد والقصابين' },
  { value: 'الأنبار - الرمادي', label: 'الأنبار - الرمادي والفلوجة' },
  { value: 'ديالى - بعقوبة', label: 'ديالى - بعقوبة (المفرق)' },
  { value: 'ميسان - العمارة', label: 'ميسان - العمارة' },
  { value: 'المثنى - السماوة', label: 'المثنى - السماوة' },
  { value: 'واسط - الكوت', label: 'واسط - الكوت' },
  { value: 'القادسية - الديوانية', label: 'القادسية - الديوانية' },
  { value: 'دهوك - المركز', label: 'دهوك - المركز' },
  { value: 'صلاح الدين - تكريت', label: 'صلاح الدين - تكريت وسامراء' },
];

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    registerPharmacy,
    loginPharmacy,
    language,
    allUsers,
    switchUser,
  } = useApp();

  const isAr = language === 'ar';

  // Form Fields State (Name, Phone, Area/Region, Pharmacy License)
  const [name, setName] = useState('');
  const [pharmacyName, setPharmacyName] = useState('');
  const [phone, setPhone] = useState('');
  const [governorate, setGovernorate] = useState(IRAQI_GOVERNORATES[0].value);
  const [areaDetails, setAreaDetails] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [referralCode, setReferralCode] = useState('REP-BGW-104');
  const [hasLicenseDoc, setHasLicenseDoc] = useState(true);

  // Login Form Field
  const [loginIdentifier, setLoginIdentifier] = useState('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  // Fill sample data helper for instant reviewer testing
  const handleQuickDemoFill = () => {
    setName('د. حيدر جاسم الموسوي');
    setPharmacyName('صيدلية المنصور التخصصية');
    setPhone('0771 890 2345');
    setGovernorate('بغداد - المنصور');
    setAreaDetails('شارع 14 رمضان - مقابل المستشفى المركزي');
    setLicenseNumber('BAG-2024-8931');
    setReferralCode('REP-BGW-104');
    setHasLicenseDoc(true);
    setErrorMessage(null);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage(isAr ? 'يرجى إدخال اسم الصيدلي' : 'Pharmacist name is required');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage(isAr ? 'يرجى إدخال رقم الهاتف' : 'Phone number is required');
      return;
    }
    if (!governorate.trim()) {
      setErrorMessage(isAr ? 'يرجى اختيار المنطقة والمحافظة' : 'Area/Governorate is required');
      return;
    }
    if (!licenseNumber.trim()) {
      setErrorMessage(isAr ? 'يرجى إدخال رقم رخصة الصيدلية المعتمد' : 'Pharmacy syndicate license number is required');
      return;
    }

    setIsSubmitting(true);
    const fullArea = areaDetails.trim() ? `${governorate} (${areaDetails.trim()})` : governorate;
    const finalOrgName = pharmacyName.trim() || `صيدلية ${name.replace(/^د\.?\s*/, '').trim()}`;

    const res = await registerPharmacy({
      name,
      phone,
      governorate: fullArea,
      organizationName: finalOrgName,
      licenseNumber: licenseNumber.trim().toUpperCase(),
      referralCode,
    });

    setIsSubmitting(false);
    if (!res.success) {
      setErrorMessage(res.error || (isAr ? 'فشل التسجيل، حاول مجدداً' : 'Registration failed'));
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!loginIdentifier.trim()) {
      setErrorMessage(isAr ? 'يرجى إدخال رقم الهاتف أو رقم رخصة الصيدلية' : 'Enter phone number or license number');
      return;
    }

    setIsSubmitting(true);
    const res = await loginPharmacy(loginIdentifier);
    setIsSubmitting(false);

    if (!res.success) {
      setErrorMessage(res.error || (isAr ? 'تعذر تسجيل الدخول' : 'Login failed'));
    }
  };

  // Pre-filtered registered pharmacies for quick-login pills
  const samplePharmacies = allUsers.filter(u => u.role === 'pharmacy');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl my-8 overflow-hidden text-right rtl:text-right ltr:text-left">
        {/* Top Header Pattern */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-6 relative">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 left-4 rtl:left-4 rtl:right-auto ltr:right-4 ltr:left-auto text-emerald-100 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            title={isAr ? 'إغلاق' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <PharmacyLogo size="lg" variant="white" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-wide uppercase px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-100 border border-emerald-400/30">
                  {isAr ? 'منصة نبض' : 'Nabdh'}
                </span>
                <span className="text-xs text-emerald-200">{isAr ? 'نقابة صيادلة العراق' : 'Syndicate Portal'}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
                {authModalMode === 'register'
                  ? isAr
                    ? 'تسجيل وترخيص صيدلية جديدة'
                    : 'Licensed Pharmacy Registration'
                  : isAr
                  ? 'تسجيل الدخول للصيدليات والمذاخر'
                  : 'Pharmacy & Supplier Sign In'}
              </h2>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                {isAr
                  ? 'بوابة الشراء الدوائي المباشر من المذاخر والمكاتب العلمية المعتمدة'
                  : 'Central B2B Wholesale Portal for Licensed Iraqi Pharmacies'}
              </p>
            </div>
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex items-center gap-2 mt-5 bg-black/20 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => {
                setAuthModalMode('register');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                authModalMode === 'register'
                  ? 'bg-white text-emerald-900 shadow-sm font-bold'
                  : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              <FileBadge className="w-3.5 h-3.5" />
              <span>{isAr ? 'تسجيل صيدلية مجازة (حساب جديد)' : 'New Pharmacy Registration'}</span>
            </button>
            <button
              onClick={() => {
                setAuthModalMode('login');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                authModalMode === 'login'
                  ? 'bg-white text-emerald-900 shadow-sm font-bold'
                  : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isAr ? 'دخول برقم الهاتف أو رخصة الصيدلية' : 'Quick Sign In'}</span>
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Tab 1: Registration Form (Name, Phone, Region/Area, Pharmacy License) */}
        {authModalMode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="p-6 space-y-4">
            {/* Quick Demo Fill Banner */}
            <div className="flex items-center justify-between bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3 text-xs">
              <div className="flex items-center gap-2 text-emerald-800">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {isAr
                    ? 'هل تريد تجربة التسجيل السريع ببيانات نموذجية مجازة؟'
                    : 'Want to test quickly with pre-filled verified Iraqi pharmacy data?'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleQuickDemoFill}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-xs text-[11px] shrink-0 transition-colors"
              >
                {isAr ? 'تعبئة تلقائية تجريبية' : 'Auto Fill Demo'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Field 1: الاسم (Name) */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isAr ? 'الاسم (اسم الصيدلاني المسؤول) *' : 'Pharmacist Name *'}</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={isAr ? 'مثال: د. حيدر جاسم الموسوي' : 'e.g., Dr. Haider Jassim'}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                />
                <span className="text-[10px] text-slate-400 block">
                  {isAr ? 'الاسم الثلاثي المطابق لهوية نقابة صيادلة العراق' : 'Full name matching syndicate credentials'}
                </span>
              </div>

              {/* Pharmacy Facility Name */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isAr ? 'اسم الصيدلية الأهلية' : 'Pharmacy Facility Name'}</span>
                </label>
                <input
                  type="text"
                  placeholder={isAr ? 'مثال: صيدلية المنصور النموذجية' : 'e.g., Al-Mansour Pharmacy'}
                  value={pharmacyName}
                  onChange={e => setPharmacyName(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                />
                <span className="text-[10px] text-slate-400 block">
                  {isAr ? 'اسم الصيدلية كما في لافتة المحل وقوائم الشراء' : 'Official commercial name on invoices'}
                </span>
              </div>

              {/* Field 2: الرقم (Phone Number) */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isAr ? 'الرقم (رقم هاتف الصيدلية / الموبايل) *' : 'Phone Number *'}</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 rtl:left-3 rtl:right-auto ltr:right-3 ltr:left-auto text-[11px] font-mono-nums font-semibold text-slate-500 pointer-events-none flex items-center gap-1">
                    <span>🇮🇶</span>
                    <span>+964</span>
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder="0770 123 4567"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none font-mono-nums transition-all pl-16 rtl:pl-16 rtl:pr-3"
                  />
                </div>
                <span className="text-[10px] text-slate-400 block">
                  {isAr ? 'يستخدم لاستلام إشعارات الشحن ومندوبي التوصيل' : 'Used for delivery verification & tracking'}
                </span>
              </div>

              {/* Field 3: المنطقة (Area / Region & Governorate) */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isAr ? 'المنطقة والمحافظة *' : 'Governorate & District *'}</span>
                </label>
                <select
                  required
                  value={governorate}
                  onChange={e => setGovernorate(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                >
                  {IRAQI_GOVERNORATES.map(gov => (
                    <option key={gov.value} value={gov.value}>
                      {gov.label}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder={isAr ? 'الحي / الشارع / أقرب نقطة دالة (اختياري)' : 'Street address / Nearest landmark'}
                  value={areaDetails}
                  onChange={e => setAreaDetails(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none mt-1"
                />
              </div>
            </div>

            {/* Field 4: رخصة الصيدلية (Pharmacy License Number & Document) */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <FileBadge className="w-4 h-4 text-emerald-600" />
                  <span>{isAr ? 'رخصة الصيدلية (إجازة فتح الصيدلية / النقابة) *' : 'Pharmacy Syndicate License *'}</span>
                </label>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  {isAr ? 'توثيق رسمي إلزامي' : 'Mandatory Syndicate License'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="BAG-11402 أو BAS-2024-998"
                    value={licenseNumber}
                    onChange={e => setLicenseNumber(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none font-mono-nums font-bold text-slate-800 uppercase"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {isAr ? 'رقم الإجازة الصادر من المقر العام لنقابة صيادلة العراق' : 'Official Syndicate License Serial'}
                  </span>
                </div>

                <div className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="text-[11px] leading-tight">
                    <div className="font-bold text-slate-800">
                      {isAr ? 'التحقق الآلي الفوري' : 'Instant Verification'}
                    </div>
                    <div className="text-slate-500 text-[10px]">
                      {isAr ? 'مربوط بسجل الأطباء والصيادلة المجازين' : 'Cross-checked with Syndicate database'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Syndicate Document Attachment Preview */}
              <div className="border border-dashed border-emerald-300 bg-emerald-50/40 rounded-lg p-3 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <div className="font-semibold text-emerald-950">
                      {isAr ? 'وثيقة إجازة ممارسة المهنة وهوية النقابة' : 'Syndicate License Certificate & ID'}
                    </div>
                    <div className="text-[10px] text-emerald-700">
                      {hasLicenseDoc
                        ? isAr
                          ? 'تم تجهيز وثيقة الترخيص الرقمية للاعتماد الفوري'
                          : 'Digital license verified and ready'
                        : isAr
                        ? 'يرجى إرفاق صورة الإجازة'
                        : 'Attach license document'}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setHasLicenseDoc(!hasLicenseDoc)}
                  className="px-2.5 py-1 text-[11px] font-semibold text-emerald-800 bg-white hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors"
                >
                  {hasLicenseDoc ? (isAr ? 'وثيقة مرفقة ✓' : 'Attached ✓') : (isAr ? 'إرفاق وثيقة' : 'Attach File')}
                </button>
              </div>
            </div>

            {/* Optional Referral Code */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-800">
                  {isAr ? 'كود المندوب العلمي للإحالة (اختياري)' : 'Medical Rep Referral Code (Optional)'}
                </span>
                <span className="text-[10px] text-slate-400 block">
                  {isAr ? 'يمنح صيدليتك أولوية التجهيز وتخفيضات خاصة على أول طلبيات' : 'Grants priority shipping & intro discounts'}
                </span>
              </div>
              <input
                type="text"
                value={referralCode}
                onChange={e => setReferralCode(e.target.value)}
                placeholder="REP-BGW-104"
                className="w-32 text-xs p-1.5 text-center font-mono-nums font-bold uppercase bg-white border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>

            {/* Regulatory Disclaimer */}
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-[11px] text-amber-900 leading-relaxed flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                {isAr
                  ? 'إقرار تنظيمي: يؤكد الصيدلي المسجل صحة البيانات ورقم الإجازة النقابية وخضوع المعاملات للتعليمات الصادرة عن وزارة الصحة العراقية وقانون مزاولة مهنة الصيدلة.'
                  : 'Regulatory Declaration: The registering pharmacist certifies the accuracy of syndicate credentials and compliance with Iraqi Ministry of Health wholesale regulations.'}
              </span>
            </div>

            {/* Submit Action Button */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(false)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 px-6 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <span>{isAr ? 'جاري التحقق والاعتماد...' : 'Verifying & Registering...'}</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isAr ? 'تسجيل الدخول واعتماد ترخيص الصيدلية' : 'Register & Log In to Pharmacy'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Fast Login Form (Phone number or Syndicate License) */}
        {authModalMode === 'login' && (
          <div className="p-6 space-y-5">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800">
                  {isAr ? 'الرقم (رقم الهاتف) أو رقم رخصة الصيدلية *' : 'Phone Number or Syndicate License No. *'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder={isAr ? 'أدخل رقم الهاتف مثل 07701234567 أو رقم الإجازة مثل BAG-11402' : 'Enter 0770xxxxxxx or License No.'}
                    value={loginIdentifier}
                    onChange={e => setLoginIdentifier(e.target.value)}
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none font-mono-nums transition-all"
                  />
                </div>
                <span className="text-[10px] text-slate-400 block">
                  {isAr
                    ? 'يمكنك تسجيل الدخول المباشر برقم الهاتف المحفوظ، رقم رخصة الصيدلية، أو اسم المنشأة'
                    : 'Log in using registered phone number, syndicate license number, or organization name'}
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <span>{isAr ? 'جاري التحقق...' : 'Authenticating...'}</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>{isAr ? 'دخول إلى بوابة الصيدلية' : 'Sign In'}</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Pharmacies Login Selector */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>{isAr ? 'صيدليات مسجلة مسبقاً (دخول سريع بنقرة واحدة):' : 'Pre-registered Pharmacies (One-click login):'}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {samplePharmacies.map(pharmacy => (
                  <button
                    key={pharmacy.id}
                    onClick={async () => {
                      await switchUser(pharmacy.id);
                      setIsAuthModalOpen(false);
                    }}
                    className="p-3 bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 rounded-xl text-right rtl:text-right ltr:text-left transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">
                        {pharmacy.organizationName}
                      </span>
                      <span className="text-[10px] font-mono-nums font-bold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded">
                        {pharmacy.licenseNumber}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                      <span>{pharmacy.name}</span>
                      <span>·</span>
                      <span>{pharmacy.governorate}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono-nums mt-0.5">
                      {pharmacy.phone}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Switch to Register link */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setAuthModalMode('register')}
                className="text-xs text-emerald-700 hover:text-emerald-900 font-bold hover:underline"
              >
                {isAr
                  ? 'صيدلية جديدة؟ سجل واعتمد ترخيصك النقابي الآن'
                  : "Don't have an account? Register your licensed pharmacy"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
