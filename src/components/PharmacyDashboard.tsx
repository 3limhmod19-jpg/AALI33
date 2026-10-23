import React, { useState, useEffect } from 'react';
import { Product, MasterOrder, SubOrder, SupplierOffer } from '../types';
import { useApp } from '../context/AppContext';
import { ProductCompareModal } from './ProductCompareModal';
import { InvoiceModal } from './InvoiceModal';
import {
  Search,
  Filter,
  Building2,
  Package,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Truck,
  FileText,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Phone,
  MapPin,
  User,
  FileBadge,
  LogIn,
} from 'lucide-react';

export const PharmacyDashboard: React.FC = () => {
  const {
    language,
    currentUser,
    showToast,
    activeTab,
    setActiveTab,
    openRegisterModal,
    openLoginModal,
  } = useApp();
  const isAr = language === 'ar';

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<MasterOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedManufacturer, setSelectedManufacturer] = useState('all');

  // Modals
  const [selectedProductForCompare, setSelectedProductForCompare] = useState<Product | null>(null);
  const [selectedSuborderForInvoice, setSelectedSuborderForInvoice] = useState<SubOrder | null>(null);
  const [disputeModalSuborder, setDisputeModalSuborder] = useState<SubOrder | null>(null);
  const [disputeReason, setDisputeReason] = useState<'damaged_goods' | 'incorrect_batch' | 'short_expiry' | 'missing_items'>('damaged_goods');
  const [disputeDescription, setDisputeDescription] = useState('');

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedManufacturer !== 'all') params.append('manufacturer', selectedManufacturer);

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error('Failed to load orders:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, selectedCategory, selectedManufacturer]);

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  const handleSuborderAction = async (suborderId: string, action: string, payload?: any) => {
    try {
      const res = await fetch(`/api/suborders/${suborderId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast(isAr ? 'تم تحديث حالة الطلبية بنجاح' : 'Suborder updated successfully');
      fetchOrders();
    } catch (err: any) {
      alert(err.message || 'حدث خطأ');
    }
  };

  const handleDisputeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeModalSuborder) return;
    try {
      const res = await fetch('/api/disputes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          suborderId: disputeModalSuborder.id,
          suborderNumber: disputeModalSuborder.suborderNumber,
          pharmacyId: disputeModalSuborder.pharmacyId,
          pharmacyName: disputeModalSuborder.pharmacyName,
          supplierId: disputeModalSuborder.supplierId,
          supplierName: disputeModalSuborder.supplierName,
          reason: disputeReason,
          description: disputeDescription,
        }),
      });
      if (!res.ok) throw new Error('Failed to submit dispute');
      showToast(isAr ? 'تم إرسال البلاغ إلى المذخر وإدارة المنصة للتدقيق' : 'Dispute logged and sent for audit');
      setDisputeModalSuborder(null);
      setDisputeDescription('');
    } catch (err: any) {
      alert(err.message || 'حدث خطأ أثناء تقديم البلاغ');
    }
  };

  const categories = [
    { id: 'all', labelAr: 'كافة الأصناف', labelEn: 'All Categories' },
    { id: 'مضادات حيوية', labelAr: 'مضادات حيوية (Antibiotics)', labelEn: 'Antibiotics' },
    { id: 'مسكنات', labelAr: 'مسكنات وخافضات حرارة', labelEn: 'Analgesics' },
    { id: 'السكري', labelAr: 'أدوية السكري', labelEn: 'Diabetes' },
    { id: 'القلب', labelAr: 'أدوية القلب والضغط', labelEn: 'Cardiovascular' },
    { id: 'الجهاز الهضمي', labelAr: 'الجهاز الهضمي', labelEn: 'Gastrointestinal' },
    { id: 'التنفسي', labelAr: 'الجهاز التنفسي والربو', labelEn: 'Respiratory' },
  ];

  return (
    <div className="space-y-8">
      {/* View 1: Catalog */}
      {activeTab === 'catalog' && (
        <>
          {/* Hero Banner Section */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 text-white shadow-sm">
            <div className="absolute inset-0 z-0">
              <img
                src="/src/assets/images/pharma_b2b_hero_1792274047488.jpg"
                alt="Iraqi Pharmaceutical B2B Logistics"
                className="w-full h-full object-cover opacity-25"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent rtl:bg-gradient-to-l" />
            </div>

            <div className="relative z-10 p-6 sm:p-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-400/30 text-red-300 rounded-md text-xs font-semibold mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isAr ? 'سوق حصري للصيدليات والمذاخر المرخصة' : 'Licensed Iraqi Marketplace'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                {isAr
                  ? 'طلب وتجهيز الأدوية مباشرة من المذاخر المعتمدة'
                  : 'Procure Medicines Directly from Verified Iraqi Suppliers'}
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                {isAr
                  ? 'قارن أسعار المذاخر والمكاتب العلمية لحظياً، واطلب من موردين متعددين بسلة واحدة مع التقسيم التلقائي للطلبيات وفواتير التجهيز الرسمية.'
                  : 'Compare real-time prices across verified wholesalers, order from multiple vendors in one unified cart with auto-order splitting.'}
              </p>

              {/* Fictional demo notice */}
              <div className="mt-4 pt-3 border-t border-slate-700/60 text-[11px] text-slate-400 flex items-center gap-1.5">
                <span className="font-semibold text-amber-400">
                  {isAr ? 'تنويه تجريبي:' : 'Demo Note:'}
                </span>{' '}
                {isAr
                  ? 'جميع أسعار الأدوية وبيانات المذاخر المعروضة افتراضية لأغراض المحاكاة والتجربة.'
                  : 'All drug pricing and supplier stock records are simulated fictional demonstration data.'}
              </div>
            </div>
          </div>

          {/* Pharmacy Credentials & License Bar (الاسم، الرقم، المنطقة، ورخصة الصيدلية) */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center justify-center shrink-0">
                  <FileBadge className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-slate-900">
                      {currentUser?.organizationName || (isAr ? 'صيدلية غير مسجلة' : 'Unregistered Pharmacy')}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-100/80 px-2 py-0.5 rounded-full">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {isAr ? 'إجازة نقابة موثقة' : 'Syndicate Verified'}
                    </span>
                  </div>

                  {/* The 4 core user credentials: الاسم، الرقم، المنطقة، رخصة الصيدلية */}
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-400">{isAr ? 'الاسم:' : 'Name:'}</span>
                      <strong className="text-slate-800">{currentUser?.name}</strong>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-400">{isAr ? 'الرقم:' : 'Phone:'}</span>
                      <strong className="text-slate-800 font-mono-nums">{currentUser?.phone}</strong>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-400">{isAr ? 'المنطقة:' : 'Area:'}</span>
                      <strong className="text-slate-800">{currentUser?.governorate}</strong>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1 font-mono-nums">
                      <FileBadge className="w-3.5 h-3.5 text-red-600" />
                      <span className="text-slate-400">{isAr ? 'رخصة الصيدلية:' : 'License:'}</span>
                      <strong className="text-red-800 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                        {currentUser?.licenseNumber || 'BAG-11402'}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons to open Login or Register modal */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={openRegisterModal}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <FileBadge className="w-3.5 h-3.5" />
                  <span>{isAr ? 'تسجيل صيدلية جديدة' : 'Register Pharmacy'}</span>
                </button>
                <button
                  onClick={openLoginModal}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{isAr ? 'دخول بحساب آخر' : 'Sign In'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 right-3 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={
                    isAr
                      ? 'ابحث باسم الدواء التجاري، المادة الفعالة، المصنع (سامراء، بايونير...) أو الباركود...'
                      : 'Search by brand, active ingredient, manufacturer, or barcode...'
                  }
                  className="w-full text-xs sm:text-sm py-2.5 px-9 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute top-1/2 -translate-y-1/2 left-3 rtl:left-3 rtl:right-auto ltr:right-3 ltr:left-auto text-xs text-slate-400 hover:text-slate-600"
                  >
                    {isAr ? 'مسح' : 'Clear'}
                  </button>
                )}
              </div>

              {/* Manufacturer selector */}
              <select
                value={selectedManufacturer}
                onChange={e => setSelectedManufacturer(e.target.value)}
                className="w-full sm:w-56 text-xs py-2.5 px-3 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-700"
              >
                <option value="all">{isAr ? 'كافة الشركات المصنعة' : 'All Manufacturers'}</option>
                <option value="SDI Samarra">SDI Samarra (سامراء)</option>
                <option value="Pioneer Pharma">Pioneer Pharma (بايونير)</option>
                <option value="Awamedica">Awamedica (أواميديكا)</option>
                <option value="Hikma">Hikma (حكمة)</option>
                <option value="Pfizer">Pfizer / AstraZeneca</option>
                <option value="GSK">GSK (جلاكسو)</option>
              </select>
            </div>

            {/* Interactive Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {isAr ? cat.labelAr : cat.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Product Catalog Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">
                {isAr ? 'قائمة الأدوية المعتمدة للمقارنة والتجهيز' : 'Standardized Drug Monographs'}
              </h2>
              <span className="text-xs text-slate-500">
                {isAr ? `إجمالي النتائج: ${products.length} دواء` : `Found ${products.length} products`}
              </span>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-48 bg-slate-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-700">
                  {isAr ? 'لم يتم العثور على أدوية مطابقة' : 'No matching medicines found'}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {isAr ? 'جرب البحث باسم تجاري آخر أو اختر كافة الأصناف' : 'Try searching another brand name or reset filters'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map(prod => {
                  const offersCount = (prod as any).offersCount || 0;
                  const minPrice = (prod as any).minPriceIQD;

                  return (
                    <div
                      key={prod.id}
                      className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 p-5 flex flex-col justify-between transition-all hover:shadow-xs group"
                    >
                      <div className="space-y-2">
                        {/* Monograph Top Line */}
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[11px] font-semibold text-red-800 bg-red-50 px-2 py-0.5 rounded">
                            {prod.category}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono-nums">
                            {prod.barcode}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-sm font-bold text-slate-900 group-hover:text-red-700 transition-colors">
                            {prod.nameEn}
                          </h3>
                          <div className="text-xs text-slate-600 font-medium">
                            {prod.nameAr}
                          </div>
                        </div>

                        <div className="text-xs text-slate-500 space-y-0.5 pt-1 border-t border-slate-100">
                          <div>
                            <span className="text-slate-400">{isAr ? 'الفعال:' : 'Active:'}</span>{' '}
                            <span className="text-slate-700 font-medium">{prod.activeIngredient}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">{isAr ? 'المصنع:' : 'Maker:'}</span>{' '}
                            <span className="text-slate-700">{prod.manufacturer}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">{isAr ? 'الشكل والعبوة:' : 'Pack:'}</span>{' '}
                            <span className="text-slate-700">{prod.dosageForm} · {prod.packageSize}</span>
                          </div>
                        </div>
                      </div>

                      {/* Pricing Comparison Anchor */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-slate-400">
                            {isAr ? 'يبدأ من (أقل سعر)' : 'Starting from'}
                          </div>
                          {minPrice ? (
                            <div className="text-base font-extrabold text-slate-900 font-mono-nums">
                              {minPrice.toLocaleString()} د.ع
                            </div>
                          ) : (
                            <div className="text-xs text-slate-400">{isAr ? 'غير متوفر' : 'Out of stock'}</div>
                          )}
                          <div className="text-[11px] text-red-700 font-medium flex items-center gap-1 mt-0.5">
                            <Building2 className="w-3 h-3" />
                            <span>
                              {isAr
                                ? `${offersCount} مذاخر ومكاتب عارضة`
                                : `${offersCount} Supplier offers`}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => setSelectedProductForCompare(prod)}
                          className="px-3.5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-red-600 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                        >
                          <span>{isAr ? 'مقارنة الأسعار' : 'Compare Offers'}</span>
                          <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* View 2: Orders & Invoices */}
      {(activeTab === 'pharmacy_orders' || activeTab === 'orders') && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {isAr ? 'سجل الطلبيات المركزية وفواتير التجهيز' : 'Orders & Invoices History'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isAr
                  ? 'متابعة الطلبيات المقسمة على المذاخر، واعتماد التعديلات، وعرض قوائم التجهيز الرسمية'
                  : 'Track split suborders per wholesaler, approve proposals, and access formal invoices'}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('catalog')}
              className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg"
            >
              {isAr ? '+ إنشاء طلبية جديدة' : '+ New Order'}
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-700">
                {isAr ? 'لا توجد طلبيات سابقة' : 'No previous orders found'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {isAr ? 'تصفح دليل الأدوية وأضف المنتجات إلى السلة' : 'Browse medicine catalog and place your first order'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map(order => (
                <div
                  key={order.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs"
                >
                  {/* Master Order Header */}
                  <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-slate-900 font-mono-nums">
                          #{order.orderNumber}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500">
                          {new Date(order.createdAt).toLocaleDateString('ar-IQ')}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            order.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {order.status === 'completed' ? (isAr ? 'مكتمل التسليم' : 'Completed') : (isAr ? 'قيد المعالجة' : 'Processing')}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {isAr ? 'عنوان الاستلام:' : 'Delivery Address:'} {order.deliveryAddress}
                        {order.repAttributedCode && (
                          <span className="mr-2 rtl:mr-2 ltr:ml-2 text-emerald-700 font-mono-nums">
                            · {isAr ? 'كود المندوب:' : 'Rep:'} {order.repAttributedCode}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-left rtl:text-left ltr:text-right">
                      <div className="text-xs text-slate-400">{isAr ? 'إجمالي الطلب العام' : 'Master Total'}</div>
                      <div className="text-lg font-bold text-slate-900 font-mono-nums">
                        {order.totalAmountIQD.toLocaleString()} د.ع
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {order.suborders.length} {isAr ? 'طلبيات تجهيز لمذاخر مختلفة' : 'Wholesaler Suborders'}
                      </div>
                    </div>
                  </div>

                  {/* Suborders Split List */}
                  <div className="p-6 space-y-4">
                    <div className="text-xs font-bold text-slate-700 mb-2">
                      {isAr ? 'طلبيات التجهيز المقسمة آلياً لكل مذخر:' : 'Automated Wholesaler Suborders:'}
                    </div>

                    <div className="space-y-4">
                      {order.suborders.map(sub => (
                        <div
                          key={sub.id}
                          className="border border-slate-200 rounded-lg p-4 bg-slate-50/30 space-y-3"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-100">
                            <div>
                              <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-emerald-700" />
                                <span className="text-xs font-bold text-slate-900">
                                  {sub.supplierName}
                                </span>
                                <span className="text-[11px] font-mono-nums text-slate-500">
                                  ({sub.suborderNumber})
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500 mt-0.5">
                                {sub.pharmacyGov}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Suborder Status Badge */}
                              <span
                                className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                                  sub.status === 'delivered'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : sub.status === 'dispatched'
                                    ? 'bg-blue-100 text-blue-800'
                                    : sub.status === 'confirmed'
                                    ? 'bg-purple-100 text-purple-800'
                                    : sub.status === 'supplier_modified'
                                    ? 'bg-amber-100 text-amber-900 ring-1 ring-amber-400'
                                    : sub.status === 'cancelled'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {sub.status === 'pending_supplier_review' && (isAr ? 'بانتظار مراجعة المذخر' : 'Pending Supplier Review')}
                                {sub.status === 'supplier_modified' && (isAr ? '⚠️ اقترح المذخر تعديلاً (مطلوب موافقتك)' : 'Modified by Supplier')}
                                {sub.status === 'confirmed' && (isAr ? 'تم التأكيد وتجهيز الفاتورة' : 'Confirmed')}
                                {sub.status === 'dispatched' && (isAr ? 'شُحنت بالشاحنة المبردة' : 'Dispatched')}
                                {sub.status === 'delivered' && (isAr ? 'تم استلام الوجبة' : 'Delivered')}
                                {sub.status === 'cancelled' && (isAr ? 'ملغية' : 'Cancelled')}
                              </span>

                              {/* Invoice Button */}
                              {(sub.status === 'confirmed' || sub.status === 'dispatched' || sub.status === 'delivered') && (
                                <button
                                  onClick={() => setSelectedSuborderForInvoice(sub)}
                                  className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 flex items-center gap-1"
                                >
                                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>{isAr ? 'قائمة التجهيز' : 'Invoice'}</span>
                                </button>
                              )}

                              {/* Dispute / Return */}
                              {sub.status === 'delivered' && (
                                <button
                                  onClick={() => setDisputeModalSuborder(sub)}
                                  className="px-2.5 py-1 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded"
                                >
                                  {isAr ? 'إبلاغ أو إرجاع' : 'Dispute'}
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Critical: Pharmacy Modification Approval Workflow */}
                          {sub.status === 'supplier_modified' && sub.modificationProposal && (
                            <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-lg space-y-2">
                              <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                                <span>{isAr ? 'تنبيه: اقترح المذخر تعديلاً على كمية أو أسعار هذه الطلبية:' : 'Supplier proposed modifications to quantities/prices:'}</span>
                              </div>
                              <p className="text-xs text-amber-800">
                                {isAr ? 'السبب المعلن:' : 'Reason:'} <span className="font-semibold">{sub.modificationProposal.reason}</span>
                              </p>
                              <div className="text-xs text-amber-900 font-mono-nums">
                                {isAr ? 'المبلغ الأصلي:' : 'Original Total:'} {sub.modificationProposal.originalSubtotalIQD.toLocaleString()} د.ع ➔{' '}
                                <span className="font-bold text-emerald-800">
                                  {isAr ? 'المبلغ الجديد بعد التعديل:' : 'New Total:'} {sub.modificationProposal.newSubtotalIQD.toLocaleString()} د.ع
                                </span>
                              </div>
                              <div className="flex items-center gap-2 pt-2">
                                <button
                                  onClick={() => handleSuborderAction(sub.id, 'approve_modification')}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-md"
                                >
                                  {isAr ? 'قبول التعديل وإصدار الفاتورة' : 'Approve Modifications'}
                                </button>
                                <button
                                  onClick={() => handleSuborderAction(sub.id, 'reject_modification')}
                                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-md"
                                >
                                  {isAr ? 'رفض التعديل وإلغاء هذه الطلبية' : 'Reject & Cancel Suborder'}
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Line items snapshot */}
                          <div className="divide-y divide-slate-100 bg-white rounded border border-slate-100 overflow-hidden">
                            {sub.items.map((it, idx) => (
                              <div key={idx} className="p-2.5 flex items-center justify-between text-xs">
                                <div>
                                  <span className="font-bold text-slate-800">{it.productName}</span>{' '}
                                  <span className="text-slate-500">({it.strength})</span>
                                  <div className="text-[10px] text-slate-400 font-mono-nums">
                                    {isAr ? 'الوجبة:' : 'Batch:'} {it.batchNumber} · {isAr ? 'الانتهاء:' : 'Exp:'} {it.expiryDate}
                                  </div>
                                </div>
                                <div className="text-left rtl:text-left ltr:text-right font-mono-nums">
                                  <span className="font-bold text-slate-900">{it.quantity} {isAr ? 'علبة' : 'packs'}</span> ×{' '}
                                  <span>{it.unitPriceIQD.toLocaleString()} د.ع</span> ={' '}
                                  <span className="font-bold text-emerald-700">{it.totalPriceIQD.toLocaleString()} د.ع</span>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Courier tracking note if dispatched */}
                          {sub.deliveryTrackingNote && (
                            <div className="text-xs text-slate-600 bg-emerald-50/50 p-2 rounded flex items-center gap-2">
                              <Truck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                              <span>
                                {isAr ? 'معلومات النقل المبرد:' : 'Courier Tracking:'}{' '}
                                <span className="font-semibold">{sub.courierName}</span> ({sub.courierPhone}) — {sub.deliveryTrackingNote}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* View 3: Syndicate Verification & Security */}
      {(activeTab === 'verification' || activeTab === 'security') && (
        <div className="max-w-3xl mx-auto bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
              <h2 className="text-lg font-bold text-slate-900">
                {isAr ? 'مركز الأمان والخصوصية وترخيص نقابة صيادلة العراق' : 'Security, Privacy & Syndicate Accreditation'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {isAr
                ? 'وفقاً لتعليمات وزارة الصحة ونقابة صيادلة العراق، يقتصر شراء الأدوية بالجملة على الصيدليات المجازة رسمياً فقط.'
                : 'Per Iraqi Ministry of Health regulations, wholesale pharmaceutical transactions require verified Syndicate licenses.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <div className="text-xs text-slate-500">{isAr ? 'الاسم (الصيدلي المدير المسؤول)' : 'Pharmacist in Charge'}</div>
              <div className="text-sm font-bold text-slate-900">{currentUser?.name}</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <div className="text-xs text-slate-500">{isAr ? 'اسم الصيدلية الأهلية' : 'Pharmacy Name'}</div>
              <div className="text-sm font-bold text-slate-900">{currentUser?.organizationName}</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <div className="text-xs text-slate-500">{isAr ? 'الرقم (رقم هاتف الصيدلية)' : 'Pharmacy Phone'}</div>
              <div className="text-sm font-bold text-slate-900 font-mono-nums">{currentUser?.phone}</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <div className="text-xs text-slate-500">{isAr ? 'المنطقة والمحافظة' : 'Governorate & Area'}</div>
              <div className="text-sm font-bold text-slate-900">{currentUser?.governorate}</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <div className="text-xs text-slate-500">{isAr ? 'رخصة الصيدلية (إجازة نقابة صيادلة العراق)' : 'Syndicate License No.'}</div>
              <div className="text-sm font-bold text-emerald-800 font-mono-nums">
                {currentUser?.licenseNumber || 'BAG-11402'}
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <div className="text-xs text-slate-500">{isAr ? 'حالة التوثيق الرقابي' : 'Verification Status'}</div>
              <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{isAr ? 'مرخصة وموثقة رسمياً في النقابة' : 'Verified & Licensed'}</span>
              </div>
            </div>
          </div>

          {/* Action to update credentials or switch pharmacy */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-emerald-900">
              <span className="font-bold">{isAr ? 'تعديل بيانات الصيدلية أو تسجيل رخصة جديدة:' : 'Update License or Register New Pharmacy:'}</span>{' '}
              {isAr
                ? 'يمكنك تسجيل صيدلية جديدة بالاسم والرقم والمنطقة ورخصة النقابة في أي وقت.'
                : 'You can update credentials or register a new syndicate license anytime.'}
            </div>
            <button
              onClick={openRegisterModal}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shrink-0 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <FileBadge className="w-4 h-4" />
              <span>{isAr ? 'تسجيل / تعديل ترخيص الصيدلية' : 'Register / Edit License'}</span>
            </button>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 leading-relaxed">
            <span className="font-bold">{isAr ? 'ضمان الأمان الدوائي:' : 'Security Standard:'}</span>{' '}
            {isAr
              ? 'تتم مطابقة بيانات التراخيص دورياً مع سجلات نقابة صيادلة العراق. لا يتم عرض أو تداول أي منتجات مخدرة أو خاضعة للرقابة المشددة إلا بموجب سجلات الوصفات المعتمدة قانونياً.'
              : 'Licenses are reconciled against Syndicate registry records. Restricted or controlled medications are strictly prohibited from open B2B checkout.'}
          </div>
        </div>
      )}

      {/* Compare Modal */}
      {selectedProductForCompare && (
        <ProductCompareModal
          product={selectedProductForCompare}
          onClose={() => setSelectedProductForCompare(null)}
        />
      )}

      {/* Invoice Modal */}
      {selectedSuborderForInvoice && (
        <InvoiceModal
          suborder={selectedSuborderForInvoice}
          onClose={() => setSelectedSuborderForInvoice(null)}
        />
      )}

      {/* Dispute Modal */}
      {disputeModalSuborder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                {isAr ? 'تقديم بلاغ أو طلب إرجاع وجبة' : 'Raise Dispute or Return Request'}
              </h3>
              <button
                onClick={() => setDisputeModalSuborder(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleDisputeSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isAr ? 'رقم طلبية التجهيز' : 'Suborder No.'}
                </label>
                <input
                  type="text"
                  disabled
                  value={disputeModalSuborder.suborderNumber}
                  className="w-full text-xs p-2 bg-slate-100 border border-slate-300 rounded font-mono-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isAr ? 'سبب البلاغ' : 'Dispute Reason'}
                </label>
                <select
                  value={disputeReason}
                  onChange={e => setDisputeReason(e.target.value as any)}
                  className="w-full text-xs p-2 bg-white border border-slate-300 rounded"
                >
                  <option value="damaged_goods">{isAr ? 'تلف العبوات أثناء النقل' : 'Damaged goods in transit'}</option>
                  <option value="incorrect_batch">{isAr ? 'عدم تطابق رقم الوجبة' : 'Incorrect batch number'}</option>
                  <option value="short_expiry">{isAr ? 'صلاحية قصيرة غير مطابقة للاتفاق' : 'Short expiry date'}</option>
                  <option value="missing_items">{isAr ? 'نقص في عدد العلب المستلمة' : 'Missing items in package'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isAr ? 'تفاصيل البلاغ وملاحظات الفحص' : 'Description & Inspection Notes'}
                </label>
                <textarea
                  rows={3}
                  required
                  value={disputeDescription}
                  onChange={e => setDisputeDescription(e.target.value)}
                  placeholder={isAr ? 'يرجى كتابة التفاصيل الدقيقة ورقم الوجبة المتضررة...' : 'Enter precise inspection notes...'}
                  className="w-full text-xs p-2 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDisputeModalSuborder(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 rounded"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded shadow-xs"
                >
                  {isAr ? 'إرسال البلاغ' : 'Submit Dispute'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
