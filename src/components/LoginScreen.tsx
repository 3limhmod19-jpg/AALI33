import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  ShieldCheck,
  Phone,
  MapPin,
  FileBadge,
  User,
  CheckCircle2,
  Sparkles,
  Lock,
  ArrowRight,
  AlertCircle,
  FileText,
  Languages,
  BadgeAlert,
  Layers,
  Truck,
  Package,
} from 'lucide-react';
import { PharmacyLogo } from './PharmacyLogo';

const IRAQI_GOVERNORATES = [
  { value: 'بغداد - المنصور', label: 'بغداد - المنصور (الكرخ)' },
  { value: 'بغداد - الكرادة', label: 'بغداد - الكرادة (الرصافة)' },
  { value: 'بغداد - الحارثية', label: 'بغداد - الحارثية (الشارع الطبي)' },
  { value: 'بغداد - الكاظمية', label: 'بغداد - الكاظمية المقدسة' },
  { value: 'بغداد - الأعظمية', label: 'بغداد - الأعظمية' },
  { value: 'بغداد - زيونة', label: 'بغداد - زيونة وشارع فلسطين' },
  { value: 'البصرة - العشار', label: 'البصرة - العشار والجبيلة' },
  { value: 'البصرة - الجزائر', label: 'البصرة - الجزائر والطويسة' },
  { value: 'أربيل - شارع 60', label: 'أربيل - شارع 60 وعينكاوة' },
  { value: 'النجف الأشرف - شارع الكوفة', label: 'النجف الأشرف - شارع الكوفة والأمير' },
  { value: 'كربلاء المقدسة - حي الحسين', label: 'كربلاء المقدسة - حي الحسين والعباس' },
  { value: 'السليمانية - بختياري', label: 'السليمانية - شارع سالم وبختياري' },
  { value: 'نينوى - الموصل', label: 'نينوى - الموصل (المجموعة الثقافية)' },
  { value: 'بابل - الحلة', label: 'بابل - الحلة (شارع الأطباء)' },
  { value: 'ذي قار - الناصرية', label: 'ذي قار - الناصرية (حي الإدارة)' },
  { value: 'كركوك - طريق بغداد', label: 'كركوك - طريق بغداد' },
  { value: 'الأنبار - الرمادي', label: 'الأنبار - الرمادي والفلوجة' },
  { value: 'ديالى - بعقوبة', label: 'ديالى - بعقوبة المركز' },
  { value: 'ميسان - العمارة', label: 'ميسان - العمارة' },
  { value: 'المثنى - السماوة', label: 'المثنى - السماوة' },
  { value: 'واسط - الكوت', label: 'واسط - الكوت' },
  { value: 'القادسية - الديوانية', label: 'القادسية - الديوانية' },
  { value: 'دهوك - المركز', label: 'دهوك - المركز' },
  { value: 'صلاح الدين - تكريت', label: 'صلاح الدين - تكريت وسامراء' },
];

export const LoginScreen: React.FC = () => {
  const {
    language,
    setLanguage,
    registerPharmacy,
    loginPharmacy,
    registerSupplier,
    loginSupplier,
    allUsers,
    switchUser,
  } = useApp();

  const isAr = language === 'ar';

  // Dual Portal Selector: 'pharmacy' (صيدليات) or 'supplier' (مكاتب ومذاخر وشركات)
  const [portal, setPortal] = useState<'pharmacy' | 'supplier'>('pharmacy');
  const [mode, setMode] = useState<'register' | 'login'>('register');

  // Pharmacy Required Fields (الاسم، الرقم، المنطقة، ورخصة الصيدلية)
  const [name, setName] = useState('');
  const [pharmacyName, setPharmacyName] = useState('');
  const [phone, setPhone] = useState('');
  const [governorate, setGovernorate] = useState(IRAQI_GOVERNORATES[0].value);
  const [areaDetails, setAreaDetails] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [referralCode, setReferralCode] = useState('REP-BGW-104');
  const [hasLicenseDoc, setHasLicenseDoc] = useState(true);

  // Supplier / Office Required Fields (اسم المكتب، الكيان، القانوني، الترخيص، السجل، المحافظة، العنوان، المسؤول، الهاتف)
  const [supplierName, setSupplierName] = useState('');
  const [supplierType, setSupplierType] = useState<'wholesaler' | 'scientific_office' | 'pharma_company' | 'authorized_distributor'>('wholesaler');
  const [supplierLegalName, setSupplierLegalName] = useState('');
  const [supplierLicense, setSupplierLicense] = useState('');
  const [supplierCommercialRegister, setSupplierCommercialRegister] = useState('');
  const [supplierGov, setSupplierGov] = useState(IRAQI_GOVERNORATES[0].value);
  const [supplierAddress, setSupplierAddress] = useState('');
  const [supplierManagerName, setSupplierManagerName] = useState('');
  const [supplierPhone, setSupplierPhone] = useState('');
  const [supplierEmail, setSupplierEmail] = useState('');

  // Fast Login identifier
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [supplierLoginIdentifier, setSupplierLoginIdentifier] = useState('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Quick Demo Auto-fill Helper for Pharmacy
  const handleQuickDemoFill = () => {
    setName('د. حيدر جاسم الموسوي');
    setPharmacyName('صيدلية المنصور التخصصية');
    setPhone('0771 890 2345');
    setGovernorate('بغداد - المنصور');
    setAreaDetails('شارع 14 رمضان - قرب المستشفى');
    setLicenseNumber('BAG-2024-8931');
    setReferralCode('REP-BGW-104');
    setHasLicenseDoc(true);
    setErrorMessage(null);
  };

  // Quick Demo Auto-fill Helper for Supplier / Office
  const handleQuickDemoSupplierFill = () => {
    setSupplierName('مذخر الفيحاء للأدوية والمستلزمات');
    setSupplierType('wholesaler');
    setSupplierLegalName('شركة الفيحاء للتجارة العامة وتوزيع الأدوية ذ.م.م');
    setSupplierLicense('WH-BG-2024-912');
    setSupplierCommercialRegister('CR-BAG-882190');
    setSupplierGov('بغداد - الكرخ');
    setSupplierAddress('شارع السعدون - مجمع الأدوية التخصصي');
    setSupplierManagerName('د. علي عبد الحسين الجابري');
    setSupplierPhone('0770 456 7890');
    setSupplierEmail('al-fayhaa@pharma.iq');
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
      setErrorMessage(isAr ? 'يرجى إدخال رقم رخصة الصيدلية الصادر من النقابة' : 'Pharmacy license number is required');
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
      setErrorMessage(res.error || (isAr ? 'فشل تسجيل الصيدلية' : 'Registration failed'));
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!loginIdentifier.trim()) {
      setErrorMessage(isAr ? 'يرجى إدخال رقم الهاتف أو رقم رخصة الصيدلية' : 'Please enter phone or license number');
      return;
    }

    setIsSubmitting(true);
    const res = await loginPharmacy(loginIdentifier);
    setIsSubmitting(false);

    if (!res.success) {
      setErrorMessage(res.error || (isAr ? 'تعذر تسجيل الدخول' : 'Login failed'));
    }
  };

  const handleSupplierRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!supplierName.trim()) {
      setErrorMessage(isAr ? 'يرجى إدخال اسم المكتب أو المذخر أو الشركة' : 'Office/Supplier name is required');
      return;
    }
    if (!supplierLicense.trim()) {
      setErrorMessage(isAr ? 'يرجى إدخال رقم ترخيص نقابة صيادلة العراق أو وزارة الصحة' : 'Syndicate license number is required');
      return;
    }
    if (!supplierManagerName.trim()) {
      setErrorMessage(isAr ? 'يرجى إدخال اسم المدير المسؤول أو الصيدلي المشرف' : 'Manager or Responsible Pharmacist name is required');
      return;
    }
    if (!supplierPhone.trim()) {
      setErrorMessage(isAr ? 'يرجى إدخال رقم الهاتف للتواصل' : 'Contact phone number is required');
      return;
    }

    setIsSubmitting(true);
    const res = await registerSupplier({
      name: supplierManagerName.trim(),
      phone: supplierPhone.trim(),
      organizationName: supplierName.trim(),
      supplierType,
      legalEntityName: supplierLegalName.trim() || supplierName.trim(),
      governorate: supplierGov,
      addressDetails: supplierAddress.trim(),
      licenseNumber: supplierLicense.trim().toUpperCase(),
      commercialRegister: supplierCommercialRegister.trim(),
      email: supplierEmail.trim(),
    });

    setIsSubmitting(false);
    if (!res.success) {
      setErrorMessage(res.error || (isAr ? 'فشل تسجيل المكتب الدوائي' : 'Registration failed'));
    }
  };

  const handleSupplierLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!supplierLoginIdentifier.trim()) {
      setErrorMessage(isAr ? 'يرجى إدخال رقم الهاتف أو رقم ترخيص المذخر/المكتب' : 'Please enter phone or license number');
      return;
    }

    setIsSubmitting(true);
    const res = await loginSupplier(supplierLoginIdentifier);
    setIsSubmitting(false);

    if (!res.success) {
      setErrorMessage(res.error || (isAr ? 'تعذر تسجيل الدخول لحساب المكتب' : 'Login failed'));
    }
  };

  const samplePharmacies = allUsers.filter(u => u.role === 'pharmacy');
  const sampleSuppliers = allUsers.filter(u => u.role === 'supplier');
  const otherDemoUsers = allUsers.filter(u => u.role !== 'pharmacy' && u.role !== 'supplier');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-red-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-red-600 selection:text-white">
      {/* Top Bar with Language and Official Regulatory Badge */}
      <header className="border-b border-slate-700/60 bg-slate-900/60 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <PharmacyLogo size="md" variant="red" />
          <div>
            <div className="text-sm font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>{isAr ? 'منصة نبض' : 'Nabdh'}</span>
              <span className="text-[10px] font-semibold bg-red-500/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded-full">
                {isAr ? 'سوق الأدوية والمتاجر المركزي' : 'Iraqi Central Pharma Hub'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
            <ShieldCheck className="w-4 h-4 text-red-400" />
            <span>{isAr ? 'معتمد ومطابق لتعليمات نقابة صيادلة العراق' : 'Syndicate of Iraqi Pharmacists Compliant'}</span>
          </div>

          <button
            onClick={() => setLanguage(isAr ? 'en' : 'ar')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{isAr ? 'English' : 'العربية'}</span>
          </button>
        </div>
      </header>

      {/* Main Gateway Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex flex-col justify-center">
        
        {/* Top Dual Portal Switcher (الخيار الواضح لبوابة المكاتب والشركات الدوائية) */}
        <div className="flex items-center justify-center p-1.5 bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-700 max-w-xl w-full mx-auto mb-8 shadow-xl">
          <button
            type="button"
            onClick={() => {
              setPortal('pharmacy');
              setMode('register');
              setErrorMessage(null);
            }}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              portal === 'pharmacy'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <PharmacyLogo size="sm" variant="white" />
            <span>{isAr ? 'بوابة الصيدليات المرخصة' : 'Licensed Pharmacies'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setPortal('supplier');
              setMode('login');
              setErrorMessage(null);
            }}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              portal === 'supplier'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Building2 className="w-4 h-4 text-white" />
            <span>{isAr ? 'بوابة المكاتب والشركات الدوائية' : 'Offices & Wholesalers Hub'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
          
          {/* Left Column: Portal Introduction & Trust Factors */}
          <div className="lg:col-span-5 space-y-6 text-right rtl:text-right ltr:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>
                {portal === 'pharmacy'
                  ? (isAr ? 'بوابة التحقق والرقابة الصيدلانية' : 'Pharmacy Syndicate Verification')
                  : (isAr ? 'بوابة المكاتب والمذاخر والشركات الدوائية' : 'Pharma Suppliers & Offices Gateway')}
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
                {portal === 'pharmacy' ? (
                  isAr ? (
                    <>
                      تسجيل الدخول وانضمام <span className="text-red-400">الصيدليات المرخصة</span>
                    </>
                  ) : (
                    <>
                      Sign In & Register for <span className="text-red-400">Licensed Pharmacies</span>
                    </>
                  )
                ) : (
                  isAr ? (
                    <>
                      بوابة المكاتب والمذاخر <span className="text-red-400">والشركات الدوائية</span>
                    </>
                  ) : (
                    <>
                      Offices, Wholesalers & <span className="text-red-400">Pharma Companies</span> Portal
                    </>
                  )
                )}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {portal === 'pharmacy'
                  ? isAr
                    ? 'بموجب تعليمات نقابة صيادلة العراق ووزارة الصحة، يتطلب الدخول إلى سوق الجملة الدوائي تسجيل بيانات الصيدلي المسؤول وإجازة ممارسة المهنة قبل فتح واجهة التجهيز والأسعار.'
                    : 'Per Syndicate and Ministry of Health regulations, accessing wholesale medicines requires verified pharmacist license credentials.'
                  : isAr
                    ? 'المنصة المركزية لربط المكاتب العلمية والمذاخر ومصانع الأدوية بالصيدليات المرخصة في كافة محافظات العراق، مع إدارة المخزون، الشحنات المبردة، وتتبع التشغيلات.'
                    : 'The central B2B pharmaceutical network connecting authorized drug bureaus, wholesalers, and manufacturers with licensed community pharmacies across Iraq.'}
              </p>
            </div>

            {/* Core Feature Pillars */}
            <div className="space-y-3 pt-2">
              {portal === 'pharmacy' ? (
                <>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div className="text-xs">
                      <div className="font-bold text-white">
                        {isAr ? 'تجهيز مباشر من المذاخر والمكاتب العلمية' : 'Direct Wholesale Procurement'}
                      </div>
                      <div className="text-slate-400 mt-0.5 leading-relaxed">
                        {isAr
                          ? 'مقارنة حية لأسعار الأدوية من المذاخر المعتمدة في بغداد، أربيل، البصرة، والنجف.'
                          : 'Compare real-time prices across licensed Iraqi pharmaceutical wholesalers.'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div className="text-xs">
                      <div className="font-bold text-white">
                        {isAr ? 'تقسيم تلقائي للطلبيات والفواتير' : 'Multi-Supplier Automated Order Splitting'}
                      </div>
                      <div className="text-slate-400 mt-0.5 leading-relaxed">
                        {isAr
                          ? 'سلة موحدة تُقسم تلقائياً إلى طلبيات تجهيز رسمية لكل مذخر مع متابعة النقل المبرد.'
                          : 'Single unified cart automatically splits into official suborders per supplier.'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 mt-0.5">
                      <FileBadge className="w-4 h-4" />
                    </div>
                    <div className="text-xs">
                      <div className="font-bold text-white">
                        {isAr ? 'حماية الرقابة وتوثيق إجازة النقابة' : 'Syndicate License Verification'}
                      </div>
                      <div className="text-slate-400 mt-0.5 leading-relaxed">
                        {isAr
                          ? 'سجل تدقيق إلكتروني لمطابقة الأرقام النقابية ومنع تداول الأدوية مجهولة المصدر.'
                          : 'Live license reconciliation to ensure compliance with Iraqi Syndicate registries.'}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Package className="w-4 h-4" />
                    </div>
                    <div className="text-xs">
                      <div className="font-bold text-white">
                        {isAr ? 'إدارة المنتجات والأسعار والمخزون' : 'Inventory & Pricing Management'}
                      </div>
                      <div className="text-slate-400 mt-0.5 leading-relaxed">
                        {isAr
                          ? 'إضافة أدوية جديدة وتحديد أسعار الجملة للصيدليات مع إمكانية إيقاف وتفعيل الأصناف فورياً.'
                          : 'Add new medicines, define wholesale pricing, and toggle product visibility in real time.'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div className="text-xs">
                      <div className="font-bold text-white">
                        {isAr ? 'متابعة الطلبيات وشحنات سلسلة التبريد' : 'Order Fulfillment & Cold-Chain Logistics'}
                      </div>
                      <div className="text-slate-400 mt-0.5 leading-relaxed">
                        {isAr
                          ? 'استقبال طلبيات الصيدليات وإصدار الفواتير الرسمية وسندات الشحن المبرد (2-8°C).'
                          : 'Receive pharmacy purchase orders, issue tax invoices, and dispatch cold-chain trucks.'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 mt-0.5">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="text-xs">
                      <div className="font-bold text-white">
                        {isAr ? 'اعتماد ترخيص نقابة صيادلة العراق' : 'Syndicate Accreditation & Verification'}
                      </div>
                      <div className="text-slate-400 mt-0.5 leading-relaxed">
                        {isAr
                          ? 'تدقيق إجازة فتح المذخر أو المكتب وتفعيل الحساب رسمياً بعد التحقق لضمان سلامة الدواء.'
                          : 'Syndicate of Iraqi Pharmacists license verification ensures legitimate supply chains.'}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Portal Authentication Form */}
          <div className="lg:col-span-7">
            <div className="bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-right rtl:text-right ltr:text-left">
              
              {/* Card Header with Tabs */}
              <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-200">
                <div className="flex items-center justify-between pb-3">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">
                      {portal === 'pharmacy' ? (
                        mode === 'register'
                          ? (isAr ? 'تسجيل وترخيص صيدلية جديدة' : 'Register Licensed Pharmacy')
                          : (isAr ? 'تسجيل الدخول إلى حساب الصيدلية' : 'Sign In to Your Pharmacy')
                      ) : (
                        mode === 'register'
                          ? (isAr ? 'تسجيل حساب جديد للمكتب أو الشركة الدوائية' : 'Register New Office / Wholesaler')
                          : (isAr ? 'تسجيل الدخول لحساب المكتب الدوائي' : 'Sign In to Office / Wholesaler')
                      )}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {portal === 'pharmacy'
                        ? (isAr ? 'سجل بياناتك المعتمدة لتفعيل الحساب وفتح واجهة البرنامج' : 'Enter credentials to open pharmacy interface')
                        : (isAr ? 'لوحة تحكم مركزية لإدارة الأدوية والمخزون وطلبيات الصيدليات' : 'Central control panel for inventory and incoming orders')}
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-red-800 bg-red-100 border border-red-300 px-2.5 py-1 rounded-full">
                    {portal === 'pharmacy' ? (isAr ? 'بوابة الصيدليات' : 'Pharmacy') : (isAr ? 'بوابة المكاتب' : 'Office')}
                  </span>
                </div>

                {/* Sub-Tabs Switcher */}
                <div className="flex items-center gap-2 bg-slate-200/80 p-1 rounded-xl text-xs font-semibold mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setErrorMessage(null);
                    }}
                    className={`flex-1 py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      mode === 'register'
                        ? 'bg-white text-red-900 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <FileBadge className="w-3.5 h-3.5" />
                    <span>
                      {portal === 'pharmacy'
                        ? (isAr ? 'تسجيل صيدلية مجازة (جديد)' : 'New Pharmacy Registration')
                        : (isAr ? 'تسجيل مكتب / شركة جديدة' : 'Register New Office')}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMessage(null);
                    }}
                    className={`flex-1 py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      mode === 'login'
                        ? 'bg-white text-red-900 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>
                      {portal === 'pharmacy'
                        ? (isAr ? 'دخول برقم الهاتف أو رخصة الصيدلية' : 'Pharmacy Quick Sign In')
                        : (isAr ? 'دخول أصحاب المكاتب والمذاخر' : 'Office Quick Sign In')}
                    </span>
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* ==================== PHARMACY FORMS ==================== */}
              {portal === 'pharmacy' && mode === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="p-6 space-y-4">
                  {/* Demo Auto-fill Helper */}
                  <div className="flex items-center justify-between bg-red-50/80 border border-red-200 rounded-xl p-3 text-xs">
                    <div className="flex items-center gap-2 text-red-900">
                      <Sparkles className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{isAr ? 'هل تريد تجربة فورية بملء الحقول الأربعة تلقائياً؟' : 'Fill fields with demo verified pharmacy data'}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleQuickDemoFill}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-xs text-[11px] shrink-0 transition-colors cursor-pointer"
                    >
                      {isAr ? 'تعبئة تلقائية تجريبية' : 'Auto Fill Demo'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-red-600" />
                        <span>{isAr ? '1. الاسم (اسم الصيدلاني المسؤول) *' : '1. Pharmacist Name *'}</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={isAr ? 'مثال: د. حيدر جاسم الموسوي' : 'e.g., Dr. Haider Jassim'}
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-red-500 outline-none transition-all font-medium"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-red-600" />
                        <span>{isAr ? 'اسم الصيدلية الأهلية' : 'Pharmacy Facility Name'}</span>
                      </label>
                      <input
                        type="text"
                        placeholder={isAr ? 'مثال: صيدلية المنصور التخصصية' : 'e.g., Al-Mansour Pharmacy'}
                        value={pharmacyName}
                        onChange={e => setPharmacyName(e.target.value)}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-red-500 outline-none transition-all font-medium"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-red-600" />
                        <span>{isAr ? '2. الرقم (رقم هاتف الصيدلية / الموبايل) *' : '2. Phone Number *'}</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="0770 123 4567"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-red-500 outline-none font-mono-nums transition-all"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-red-600" />
                        <span>{isAr ? '3. المنطقة والمحافظة *' : '3. Area & Governorate *'}</span>
                      </label>
                      <select
                        required
                        value={governorate}
                        onChange={e => setGovernorate(e.target.value)}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-red-500 outline-none transition-all font-medium"
                      >
                        {IRAQI_GOVERNORATES.map(gov => (
                          <option key={gov.value} value={gov.value}>
                            {gov.label}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder={isAr ? 'الحي / الشارع / أقرب نقطة دالة' : 'Street address / Nearby landmark'}
                        value={areaDetails}
                        onChange={e => setAreaDetails(e.target.value)}
                        className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-1 focus:ring-red-500 outline-none mt-1"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <FileBadge className="w-4 h-4 text-red-600" />
                        <span>{isAr ? '4. رخصة الصيدلية (إجازة نقابة صيادلة العراق) *' : '4. Pharmacy Syndicate License *'}</span>
                      </label>
                      <span className="text-[10px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded-full">
                        {isAr ? 'إلزامي للنظام الدوائي' : 'Mandatory'}
                      </span>
                    </div>

                    <input
                      type="text"
                      required
                      placeholder="مثال: BAG-2024-8931 أو BAS-11402"
                      value={licenseNumber}
                      onChange={e => setLicenseNumber(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none font-mono-nums font-bold text-slate-900 uppercase"
                    />

                    <div className="border border-dashed border-red-300 bg-red-50/50 rounded-lg p-2.5 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-red-600 shrink-0" />
                        <span className="text-[11px] font-semibold text-red-950">
                          {hasLicenseDoc ? (isAr ? 'تم التحقق من بطاقة النقابة ورخصة الصيدلية الرقمية' : 'Syndicate license ID verified') : (isAr ? 'إرفاق وثيقة الترخيص' : 'Attach license document')}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setHasLicenseDoc(!hasLicenseDoc)}
                        className="px-2 py-0.5 text-[10px] font-bold text-red-800 bg-white border border-red-200 rounded hover:bg-red-100 transition-colors cursor-pointer"
                      >
                        {hasLicenseDoc ? (isAr ? 'معتمد ✓' : 'Verified ✓') : (isAr ? 'إرفاق' : 'Attach')}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 px-6 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl shadow-lg shadow-red-700/25 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.01]"
                    >
                      {isSubmitting ? (
                        <span>{isAr ? 'جاري التحقق وتفعيل الحساب...' : 'Activating session...'}</span>
                      ) : (
                        <>
                          <ShieldCheck className="w-5 h-5" />
                          <span>{isAr ? 'تسجيل الدخول وفتح واجهة المنصة ➔' : 'Register & Enter Platform ➔'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {portal === 'pharmacy' && mode === 'login' && (
                <div className="p-6 space-y-5">
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-800">
                        {isAr ? 'أدخل رقم الهاتف أو رقم رخصة الصيدلية *' : 'Enter Phone Number or Syndicate License No. *'}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={isAr ? 'مثال: 07701234567 أو BAG-11402' : 'e.g. 0770xxxxxxx or BAG-11402'}
                        value={loginIdentifier}
                        onChange={e => setLoginIdentifier(e.target.value)}
                        className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 outline-none font-mono-nums transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl shadow-lg shadow-red-700/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span>{isAr ? 'جاري التحقق...' : 'Authenticating...'}</span>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>{isAr ? 'تسجيل الدخول وفتح واجهة الصيدلية ➔' : 'Sign In & Open Platform ➔'}</span>
                        </>
                      )}
                    </button>
                  </form>

                  <div className="pt-4 border-t border-slate-100 space-y-2.5">
                    <div className="text-xs text-slate-500 font-bold">
                      {isAr ? 'صيدليات مسجلة مسبقاً (دخول فوري بنقرة واحدة):' : 'Pre-registered Pharmacies (One-click login):'}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {samplePharmacies.map(pharmacy => (
                        <button
                          key={pharmacy.id}
                          onClick={async () => {
                            await switchUser(pharmacy.id);
                          }}
                          className="p-3 bg-slate-50 hover:bg-red-50/70 border border-slate-200 hover:border-red-300 rounded-xl text-right rtl:text-right ltr:text-left transition-all cursor-pointer group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 group-hover:text-red-800">
                              {pharmacy.organizationName}
                            </span>
                            <span className="text-[10px] font-mono-nums font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded">
                              {pharmacy.licenseNumber}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                            <span>{pharmacy.name}</span>
                            <span>·</span>
                            <span>{pharmacy.governorate}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ==================== SUPPLIER / OFFICE FORMS ==================== */}
              {portal === 'supplier' && mode === 'register' && (
                <form onSubmit={handleSupplierRegisterSubmit} className="p-6 space-y-4">
                  {/* Demo Auto-fill Helper for Supplier */}
                  <div className="flex items-center justify-between bg-red-50/80 border border-red-200 rounded-xl p-3 text-xs">
                    <div className="flex items-center gap-2 text-red-900">
                      <Sparkles className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{isAr ? 'هل تريد ملء حقول المذخر تلقائياً لتجربة فورية؟' : 'Fill fields with demo verified wholesaler data'}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleQuickDemoSupplierFill}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-xs text-[11px] shrink-0 transition-colors cursor-pointer"
                    >
                      {isAr ? 'تعبئة تجريبية للمكتب' : 'Auto Fill Office Demo'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Office Name */}
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-red-600" />
                        <span>{isAr ? 'اسم المكتب أو المذخر أو الشركة الدوائية *' : 'Office/Wholesaler Name *'}</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={isAr ? 'مثال: مذخر الفيحاء للأدوية والمستلزمات' : 'e.g. Al-Fayhaa Pharma Wholesaler'}
                        value={supplierName}
                        onChange={e => setSupplierName(e.target.value)}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-red-500 outline-none font-medium"
                      />
                    </div>

                    {/* Supplier Entity Type */}
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-red-600" />
                        <span>{isAr ? 'نوع الكيان الدوائي *' : 'Entity Type *'}</span>
                      </label>
                      <select
                        value={supplierType}
                        onChange={e => setSupplierType(e.target.value as any)}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-red-500 outline-none font-medium"
                      >
                        <option value="wholesaler">{isAr ? 'مذخر أدوية جملة مجاز (Wholesaler)' : 'Licensed Drug Wholesaler'}</option>
                        <option value="scientific_office">{isAr ? 'مكتب علمي لتسجيل وتوزيع الأدوية (Scientific Office)' : 'Scientific Drug Bureau'}</option>
                        <option value="pharma_company">{isAr ? 'شركة تصنيع دوائي محلية أو دولية (Manufacturer)' : 'Pharma Manufacturer'}</option>
                        <option value="authorized_distributor">{isAr ? 'وكيل وموزع رسمي معتمد (Authorized Distributor)' : 'Authorized Distributor'}</option>
                      </select>
                    </div>

                    {/* Legal Entity Name */}
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-red-600" />
                        <span>{isAr ? 'الاسم التجاري والقانوني المسجل' : 'Legal Registered Entity Name'}</span>
                      </label>
                      <input
                        type="text"
                        placeholder={isAr ? 'مثال: شركة الفيحاء للتجارة العامة وتوزيع الأدوية ذ.م.م' : 'Official Registered Commercial Name'}
                        value={supplierLegalName}
                        onChange={e => setSupplierLegalName(e.target.value)}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-red-500 outline-none font-medium"
                      />
                    </div>

                    {/* Syndicate / MoH License */}
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <FileBadge className="w-3.5 h-3.5 text-red-600" />
                        <span>{isAr ? 'رقم ترخيص نقابة الصيادلة / وزارة الصحة *' : 'Syndicate / MoH Permit No. *'}</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="WH-BG-2024-912"
                        value={supplierLicense}
                        onChange={e => setSupplierLicense(e.target.value)}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-red-500 outline-none font-mono-nums font-bold uppercase"
                      />
                    </div>

                    {/* Responsible Manager / Pharmacist */}
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-red-600" />
                        <span>{isAr ? 'اسم المدير المسؤول أو الصيدلي المشرف *' : 'Responsible Pharmacist / Manager *'}</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={isAr ? 'مثال: د. علي عبد الحسين الجابري' : 'e.g., Dr. Ali Abdulhussein'}
                        value={supplierManagerName}
                        onChange={e => setSupplierManagerName(e.target.value)}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-red-500 outline-none font-medium"
                      />
                    </div>

                    {/* Contact Phone */}
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-red-600" />
                        <span>{isAr ? 'رقم الهاتف المباشر للتجهيز والطلبيات *' : 'Contact Phone Number *'}</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="0770 456 7890"
                        value={supplierPhone}
                        onChange={e => setSupplierPhone(e.target.value)}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-red-500 outline-none font-mono-nums font-medium"
                      />
                    </div>

                    {/* Governorate */}
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-red-600" />
                        <span>{isAr ? 'المحافظة وموقع المستودع المركزي *' : 'Governorate & Warehouse City *'}</span>
                      </label>
                      <select
                        required
                        value={supplierGov}
                        onChange={e => setSupplierGov(e.target.value)}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-red-500 outline-none font-medium"
                      >
                        {IRAQI_GOVERNORATES.map(gov => (
                          <option key={gov.value} value={gov.value}>
                            {gov.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Warehouse Address */}
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-red-600" />
                        <span>{isAr ? 'العنوان التفصيلي ومستودع الأدوية' : 'Warehouse Detailed Address'}</span>
                      </label>
                      <input
                        type="text"
                        placeholder={isAr ? 'شارع السعدون - مجمع الأدوية التخصصي' : 'District, Street, Warehouse building'}
                        value={supplierAddress}
                        onChange={e => setSupplierAddress(e.target.value)}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-red-500 outline-none font-medium"
                      />
                    </div>
                  </div>

                  {/* Pending Review Regulatory Banner */}
                  <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-900">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-0.5 leading-relaxed">
                      <div className="font-bold">{isAr ? 'إشعار التدقيق والاعتماد المسبق للبيع:' : 'Regulatory Accreditation Notice:'}</div>
                      <p className="text-[11px] text-amber-800">
                        {isAr
                          ? 'بموجب سياسة المنصة والتعليمات النقابية، يكون حساب المكتب الجديد بحالة (بانتظار مراجعة الإدارة) للتحقق من سلامة الترخيص الصيدلي ومطابقته لدى نقابة صيادلة العراق قبل تفعيل البيع المباشر ونشر الأدوية للصيدليات.'
                          : 'Per platform compliance rules, new supplier accounts are placed in pending verification status until official syndicate licenses are reconciled before live ordering.'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 px-6 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl shadow-lg shadow-red-700/25 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.01]"
                    >
                      {isSubmitting ? (
                        <span>{isAr ? 'جاري تسجيل المكتب وإرساله للتدقيق...' : 'Submitting office registration...'}</span>
                      ) : (
                        <>
                          <Building2 className="w-5 h-5" />
                          <span>{isAr ? 'تسجيل المكتب الدوائي والانتقال للوحة التحكم ➔' : 'Register Office & Open Dashboard ➔'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {portal === 'supplier' && mode === 'login' && (
                <div className="p-6 space-y-5">
                  <form onSubmit={handleSupplierLoginSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-800">
                        {isAr ? 'رقم هاتف المكتب أو رقم إجازة المذخر *' : 'Office Phone Number or Wholesaler License No. *'}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={isAr ? 'مثال: 07715551212 أو WH-BG-2023-441' : 'e.g. 0771xxxxxxx or WH-BG-2023-441'}
                        value={supplierLoginIdentifier}
                        onChange={e => setSupplierLoginIdentifier(e.target.value)}
                        className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 outline-none font-mono-nums transition-all"
                      />
                      <span className="text-[10px] text-slate-400 block">
                        {isAr ? 'يمكنك الدخول برقم الهاتف المسجل أو رقم الترخيص أو اسم المكتب' : 'Log in using registered phone, license number, or office name'}
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl shadow-lg shadow-red-700/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span>{isAr ? 'جاري التحقق...' : 'Authenticating...'}</span>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>{isAr ? 'دخول لوحة تحكم المكتب والمخزون ➔' : 'Enter Office Control Panel ➔'}</span>
                        </>
                      )}
                    </button>
                  </form>

                  {/* Pre-registered Suppliers One-Click Login */}
                  <div className="pt-4 border-t border-slate-100 space-y-2.5">
                    <div className="text-xs text-slate-500 font-bold">
                      {isAr ? 'مكاتب ومذاخر مسجلة مسبقاً (دخول فوري للمعاينة):' : 'Pre-registered Wholesalers (One-click login):'}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {sampleSuppliers.map(supplier => (
                        <button
                          key={supplier.id}
                          onClick={async () => {
                            await switchUser(supplier.id);
                          }}
                          className="p-3 bg-slate-50 hover:bg-red-50/70 border border-slate-200 hover:border-red-300 rounded-xl text-right rtl:text-right ltr:text-left transition-all cursor-pointer group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 group-hover:text-red-800">
                              {supplier.organizationName}
                            </span>
                            <span className="text-[10px] font-mono-nums font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded">
                              {supplier.licenseNumber}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                            <span>{supplier.name}</span>
                            <span>·</span>
                            <span>{supplier.governorate}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono-nums mt-0.5">
                            {supplier.phone}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer Notice */}
      <footer className="border-t border-slate-800 bg-slate-950/80 py-4 px-4 sm:px-8 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <PharmacyLogo size="sm" variant="red" />
            <span className="font-bold text-slate-200">
              {isAr ? 'منصة نبض' : 'Nabdh Pharmaceutical Platform'}
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            {isAr
              ? 'تخضع جميع المعاملات وتراخيص الصيدليات والمذاخر لرقابة نقابة صيادلة العراق ووزارة الصحة'
              : 'Transactions strictly governed by Syndicate of Iraqi Pharmacists regulations'}
          </span>
        </div>
      </footer>
    </div>
  );
};
