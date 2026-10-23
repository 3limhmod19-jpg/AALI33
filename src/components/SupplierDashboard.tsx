import React, { useState, useEffect } from 'react';
import { SubOrder, SupplierOffer, Product } from '../types';
import { useApp } from '../context/AppContext';
import { InvoiceModal } from './InvoiceModal';
import {
  Building2,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  DollarSign,
  Plus,
  Edit2,
  ShieldCheck,
  Send,
  XCircle,
  TrendingUp,
  Snowflake,
  Trash2,
  Power,
  Search,
  Filter,
  Check,
  FileBadge,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Layers,
} from 'lucide-react';

const COMMON_DOSAGE_FORMS = [
  'أقراص ملبسة بالفيلم (Film-coated Tablets)',
  'كبسولات جيلاتينية (Capsules)',
  'شراب معلق فموي (Oral Suspension)',
  'حقن وريدية / عضلية (Vial / Ampoule)',
  'مرهم جلدي (Ointment)',
  'كريم موضعي (Cream)',
  'قطرة عين / أذن (Drops)',
  'بخاخ استنشاقي (Inhaler)',
  'تحاميل (Suppositories)',
];

const COMMON_CATEGORIES = [
  'مضادات حيوية (Antibiotics)',
  'مسكنات وخافضات حرارة (Analgesics & Antipyretics)',
  'أدوية القلب والضغط (Cardiovascular)',
  'أدوية الجهاز الهضمي (Gastrointestinal)',
  'أدوية السكري والغدد (Endocrine & Diabetes)',
  'أدوية الجهاز التنفسي والحساسية (Respiratory & Antihistamines)',
  'فيتامينات ومكملات غذائية (Vitamins & Supplements)',
  'أدوية الأمراض الجلدية (Dermatologicals)',
  'مستلزمات ومحاليل وريدية (IV Fluids & Medical Supplies)',
];

export const SupplierDashboard: React.FC = () => {
  const { language, currentUser, showToast, activeTab, setActiveTab, approveUser } = useApp();
  const isAr = language === 'ar';

  const [suborders, setSuborders] = useState<SubOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [myOffers, setMyOffers] = useState<SupplierOffer[]>([]);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Search & Filter for offers
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'paused' | 'pending_review'>('all');

  // Modals
  const [selectedSuborderForInvoice, setSelectedSuborderForInvoice] = useState<SubOrder | null>(null);
  const [modifyingSuborder, setModifyingSuborder] = useState<SubOrder | null>(null);
  const [modReason, setModReason] = useState('');
  const [modItems, setModItems] = useState<any[]>([]);

  const [dispatchingSuborder, setDispatchingSuborder] = useState<SubOrder | null>(null);
  const [courierName, setCourierName] = useState('');
  const [courierPhone, setCourierPhone] = useState('');
  const [deliveryTrackingNote, setDeliveryTrackingNote] = useState('');

  // Editing Offer modal
  const [editingOffer, setEditingOffer] = useState<SupplierOffer | null>(null);
  const [offerPrice, setOfferPrice] = useState<number>(0);
  const [offerStock, setOfferStock] = useState<number>(0);
  const [offerMOQ, setOfferMOQ] = useState<number>(0);
  const [offerBatch, setOfferBatch] = useState<string>('');
  const [offerExpiry, setOfferExpiry] = useState<string>('');

  // Add New Product & Offer Modal
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [productError, setProductError] = useState<string | null>(null);

  // Add Product Form State
  const [newProdNameAr, setNewProdNameAr] = useState('');
  const [newProdNameEn, setNewProdNameEn] = useState('');
  const [newProdActiveIngredient, setNewProdActiveIngredient] = useState('');
  const [newProdManufacturer, setNewProdManufacturer] = useState('');
  const [newProdCountry, setNewProdCountry] = useState('العراق');
  const [newProdDosageForm, setNewProdDosageForm] = useState(COMMON_DOSAGE_FORMS[0]);
  const [newProdStrength, setNewProdStrength] = useState('');
  const [newProdPackageSize, setNewProdPackageSize] = useState('');
  const [newProdBarcode, setNewProdBarcode] = useState('');
  const [newProdCategory, setNewProdCategory] = useState(COMMON_CATEGORIES[0]);
  const [newProdPrice, setNewProdPrice] = useState<number>(12000);
  const [newProdStock, setNewProdStock] = useState<number>(100);
  const [newProdMinQty, setNewProdMinQty] = useState<number>(5);
  const [newProdBatch, setNewProdBatch] = useState('');
  const [newProdProdDate, setNewProdProdDate] = useState('2024-01-15');
  const [newProdExpiryDate, setNewProdExpiryDate] = useState('2026-12-31');
  const [newProdIsColdChain, setNewProdIsColdChain] = useState(false);
  const [newProdDiscountNotes, setNewProdDiscountNotes] = useState('');

  const fetchData = async () => {
    try {
      setIsLoading(true);
      // Suborders
      const resOrders = await fetch('/api/orders');
      const dataOrders = await resOrders.json();
      const allSubs: SubOrder[] = (dataOrders.orders || []).flatMap((o: any) => o.suborders || []);
      setSuborders(allSubs);

      // Products & Offers
      const resProds = await fetch('/api/products');
      const dataProds = await resProds.json();
      const allProds: Product[] = dataProds.products || [];
      setProducts(allProds);

      const userOffers: SupplierOffer[] = [];
      allProds.forEach((p: any) => {
        (p.offers || []).forEach((o: SupplierOffer) => {
          if (o.supplierId === currentUser?.id) {
            userOffers.push(o);
          }
        });
      });
      setMyOffers(userOffers);

      // Financials
      const resFin = await fetch('/api/financials');
      const dataFin = await resFin.json();
      const userComms = (dataFin.commissions || []).filter((c: any) => c.supplierId === currentUser?.id);
      setCommissions(userComms);
    } catch (err) {
      console.error('Failed to load supplier data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, currentUser]);

  const handleAction = async (suborderId: string, action: string, payload?: any) => {
    try {
      const res = await fetch(`/api/suborders/${suborderId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast(isAr ? 'تم تحديث حالة الطلبية بنجاح' : 'Suborder updated successfully');
      fetchData();
    } catch (err: any) {
      alert(err.message || 'حدث خطأ');
    }
  };

  const handleToggleOffer = async (offerId: string) => {
    try {
      const res = await fetch(`/api/supplier/offers/${offerId}/toggle`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to toggle offer');
      showToast(
        data.offer.status === 'active'
          ? (isAr ? 'تم تفعيل وإتاحة الصنف للصيدليات' : 'Medicine is now active and visible')
          : (isAr ? 'تم إيقاف عرض الصنف مؤقتاً' : 'Medicine offer paused')
      );
      fetchData();
    } catch (err: any) {
      alert(err.message || 'خطأ أثناء تغيير حالة العرض');
    }
  };

  const handleDeleteOffer = async (offerId: string) => {
    if (!confirm(isAr ? 'هل أنت متأكد من حذف هذا العرض الدوائي من المستودع؟' : 'Are you sure you want to delete this offer?')) {
      return;
    }
    try {
      const res = await fetch(`/api/supplier/offers/${offerId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete offer');
      showToast(isAr ? 'تم حذف الصنف من المستودع بنجاح' : 'Offer deleted successfully');
      fetchData();
    } catch (err: any) {
      alert(err.message || 'خطأ أثناء الحذف');
    }
  };

  const handleOpenModifyModal = (sub: SubOrder) => {
    setModifyingSuborder(sub);
    setModReason('');
    setModItems(sub.items.map(it => ({ ...it })));
  };

  const handleSaveModification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modifyingSuborder) return;
    await handleAction(modifyingSuborder.id, 'propose_modification', {
      reason: modReason,
      items: modItems,
    });
    setModifyingSuborder(null);
  };

  const handleSaveDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchingSuborder) return;
    await handleAction(dispatchingSuborder.id, 'dispatch', {
      courierName: courierName || 'سائق النقل المبرد',
      courierPhone: courierPhone || '+964 771 000 0000',
      deliveryTrackingNote: deliveryTrackingNote || 'تم الانطلاق بشاحنة مبردة مجهزة بمقياس حرارة',
    });
    setDispatchingSuborder(null);
  };

  const handleSaveOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOffer) return;
    try {
      const res = await fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offerId: editingOffer.id,
          updates: {
            priceIQD: offerPrice,
            stockQuantity: offerStock,
            minOrderQty: offerMOQ,
            batchNumber: offerBatch,
            expiryDate: offerExpiry,
          },
        }),
      });
      if (!res.ok) throw new Error('Failed to update offer');
      showToast(isAr ? 'تم تحديث السعر والمخزون بنجاح' : 'Price and stock updated');
      setEditingOffer(null);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'خطأ أثناء التحديث');
    }
  };

  const handleDemoFillProduct = () => {
    const randomBatch = `BT-IQ-${Math.floor(1000 + Math.random() * 9000)}`;
    setNewProdNameAr('سيفيكسيم 400 ملغم كبسول');
    setNewProdNameEn('Cefixime 400mg Capsules');
    setNewProdActiveIngredient('Cefixime Trihydrate 400mg');
    setNewProdManufacturer('شركة بايونيير الدوائية - السليمانية');
    setNewProdCountry('العراق');
    setNewProdDosageForm('كبسولات جيلاتينية (Capsules)');
    setNewProdStrength('400 mg');
    setNewProdPackageSize('شريط 10 كبسولات (عبوة كرتونية)');
    setNewProdBarcode('6281009847123');
    setNewProdCategory('مضادات حيوية (Antibiotics)');
    setNewProdPrice(16500);
    setNewProdStock(120);
    setNewProdMinQty(10);
    setNewProdBatch(randomBatch);
    setNewProdProdDate('2024-03-01');
    setNewProdExpiryDate('2026-11-30');
    setNewProdIsColdChain(false);
    setNewProdDiscountNotes('بونص 10+1 للصيدليات عند طلب 20 علبة فأكثر');
    setProductError(null);
  };

  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProductError(null);

    if (!newProdNameAr.trim() || !newProdNameEn.trim()) {
      setProductError(isAr ? 'يرجى إدخال اسم الدواء بالعربية والإنجليزية' : 'Medicine name in Ar & En is required');
      return;
    }
    if (!newProdActiveIngredient.trim()) {
      setProductError(isAr ? 'يرجى إدخال الاسم العلمي والمادة الفعالة' : 'Active ingredient is required');
      return;
    }
    if (!newProdManufacturer.trim()) {
      setProductError(isAr ? 'يرجى إدخال اسم الشركة المصنعة' : 'Manufacturer name is required');
      return;
    }
    if (!newProdBatch.trim()) {
      setProductError(isAr ? 'يرجى إدخال رقم التشغيلة/الوجبة للتتبع الدوائي' : 'Batch number is required');
      return;
    }
    if (!newProdExpiryDate) {
      setProductError(isAr ? 'يرجى تحديد تاريخ انتهاء الصلاحية' : 'Expiry date is required');
      return;
    }
    if (newProdPrice <= 0) {
      setProductError(isAr ? 'سعر البيع للصيدليات يجب أن يكون قيمة موجبة بالدينار' : 'Price must be positive IQD');
      return;
    }

    try {
      setIsSubmittingProduct(true);
      const res = await fetch('/api/supplier/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nameAr: newProdNameAr.trim(),
          nameEn: newProdNameEn.trim(),
          activeIngredient: newProdActiveIngredient.trim(),
          manufacturer: newProdManufacturer.trim(),
          countryOfOrigin: newProdCountry.trim(),
          dosageForm: newProdDosageForm,
          strength: newProdStrength.trim() || '1000 mg',
          packageSize: newProdPackageSize.trim() || 'عبوة قياسية',
          barcode: newProdBarcode.trim() || `628${Math.floor(100000000 + Math.random() * 900000000)}`,
          category: newProdCategory,
          priceIQD: Number(newProdPrice),
          stockQuantity: Number(newProdStock),
          minOrderQty: Number(newProdMinQty) || 1,
          batchNumber: newProdBatch.trim().toUpperCase(),
          productionDate: newProdProdDate,
          expiryDate: newProdExpiryDate,
          isColdChain: newProdIsColdChain,
          discountNotes: newProdDiscountNotes.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to add product');
      }

      showToast(
        isAr
          ? `تم إضافة الدواء [${data.product.nameAr}] بنجاح إلى مستودع ${currentUser?.organizationName}`
          : `Medicine added successfully to inventory`
      );
      setIsAddProductModalOpen(false);
      // Reset form
      setNewProdNameAr('');
      setNewProdNameEn('');
      setNewProdActiveIngredient('');
      setNewProdBatch('');
      fetchData();
    } catch (err: any) {
      setProductError(err.message || 'خطأ أثناء إضافة الدواء');
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  const handleInstantApprove = async () => {
    if (!currentUser?.id) return;
    try {
      await approveUser(currentUser.id);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered offers list
  const filteredOffers = myOffers.filter(offer => {
    const prod = products.find(p => p.id === offer.productId);
    const matchesSearch =
      !searchQuery.trim() ||
      (prod?.nameAr && prod.nameAr.includes(searchQuery)) ||
      (prod?.nameEn && prod.nameEn.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (offer.batchNumber && offer.batchNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (prod?.activeIngredient && prod.activeIngredient.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && offer.status === 'active') ||
      (statusFilter === 'paused' && offer.status === 'paused') ||
      (statusFilter === 'pending_review' && offer.status === 'pending_review');

    return matchesSearch && matchesStatus;
  });

  const completedSalesTotal = commissions.reduce((sum, c) => sum + c.saleAmountIQD, 0);
  const platformCommissionsTotal = commissions.reduce((sum, c) => sum + c.platformFeeIQD, 0);
  const netSupplierIncome = completedSalesTotal - platformCommissionsTotal;

  const isPendingVerification = currentUser?.status === 'pending_verification';

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Account Verification Warning Banner (When pending admin / syndicate review) */}
      {isPendingVerification && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-900">
                  {isAr
                    ? 'الحساب قيد تدقيق الإدارة ونقابة الصيادلة قبل تفعيل البيع المباشر للصيدليات'
                    : 'Account Pending Admin & Syndicate Verification'}
                </h3>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                  {isAr
                    ? 'مرحباً بك! يمكنك الآن تجهيز وإدخال أدويتك ومخزونك في المستودع بشكل كامل. بمجرد اعتماد رخصة المذخر من الإدارة، ستظهر عروضك فورياً لجميع الصيدليات في سوق نبض.'
                    : 'You can add and manage medicines now. Once verified by admin, your offers will be live for all pharmacies.'}
                </p>
                <div className="text-[11px] text-amber-700 mt-1 font-semibold">
                  {isAr ? 'رقم الإجازة المسجل:' : 'License Number:'}{' '}
                  <span className="font-mono-nums font-bold text-amber-900">{currentUser?.licenseNumber}</span> ·{' '}
                  {isAr ? 'السجل التجاري:' : 'Commercial Register:'}{' '}
                  <span className="font-mono-nums font-bold text-amber-900">{currentUser?.commercialRegister || 'قيد التدقيق'}</span>
                </div>
              </div>
            </div>

            {/* Instant Demo Self-Approval Button */}
            <button
              onClick={handleInstantApprove}
              className="whitespace-nowrap px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center gap-1.5 self-end sm:self-center"
              title={isAr ? 'اعتماد الحساب فورياً لتجربة النشر والبيع للصيدليات' : 'Instant Demo Approval'}
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>{isAr ? '⚡ اعتماد الحساب فورياً للمعاينة والتجربة' : 'Instant Demo Approval'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Wholesaler Header Banner (Red Theme) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-red-100 flex items-center justify-center text-red-700 shrink-0 font-bold text-2xl shadow-inner">
            <Building2 className="w-8 h-8 text-red-700" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-black text-slate-900">
                {currentUser?.organizationName}
              </h1>
              {currentUser?.status === 'verified' ? (
                <span className="text-xs text-red-800 bg-red-100 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-red-700" />
                  {isAr ? 'مكتب / مذخر معتمد ونقابي' : 'Verified Wholesaler'}
                </span>
              ) : (
                <span className="text-xs text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                  {isAr ? 'بانتظار تدقيق الترخيص' : 'Pending Verification'}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {currentUser?.governorate} · {isAr ? 'الصيدلي المدير:' : 'Manager:'}{' '}
              <span className="font-semibold text-slate-700">{currentUser?.name}</span> · {isAr ? 'إجازة النقابة:' : 'License:'}{' '}
              <span className="font-mono-nums font-semibold text-slate-700">{currentUser?.licenseNumber}</span>
            </p>
          </div>
        </div>

        {/* Financial Highlights */}
        <div className="flex items-center gap-6 border-t md:border-t-0 pt-4 md:pt-0 w-full md:w-auto justify-around md:justify-end text-left rtl:text-right">
          <div>
            <div className="text-[11px] text-slate-400">
              {isAr ? 'إجمالي المبيعات المكتملة' : 'Completed Sales'}
            </div>
            <div className="text-base font-bold text-slate-900 font-mono-nums">
              {completedSalesTotal.toLocaleString()} د.ع
            </div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400">
              {isAr ? 'عمولة المنصة (2.5%)' : 'Platform Fee'}
            </div>
            <div className="text-base font-bold text-red-600 font-mono-nums">
              {platformCommissionsTotal.toLocaleString()} د.ع
            </div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400">
              {isAr ? 'صافي مستحقات المذخر' : 'Net Income'}
            </div>
            <div className="text-base font-bold text-emerald-700 font-mono-nums">
              {netSupplierIncome.toLocaleString()} د.ع
            </div>
          </div>
        </div>
      </div>

      {/* Selling Hub Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('supplier_inventory')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'supplier_inventory' || activeTab === 'sell'
              ? 'bg-red-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>{isAr ? 'إدارة المنتجات والأسعار والمخزون' : 'Products & Stock'}</span>
          <span className="bg-white/20 text-current px-1.5 py-0.2 rounded-full text-[10px] font-mono-nums">
            {myOffers.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('supplier_orders')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'supplier_orders'
              ? 'bg-red-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>{isAr ? 'طلبات التجهيز الواردة من الصيدليات' : 'Incoming Suborders'}</span>
          {suborders.filter(s => s.status === 'pending_supplier_review').length > 0 && (
            <span className="bg-red-500 text-white px-1.5 py-0.2 rounded-full text-[10px] font-mono-nums animate-pulse">
              {suborders.filter(s => s.status === 'pending_supplier_review').length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('supplier_reconciliation')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'supplier_reconciliation'
              ? 'bg-red-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>{isAr ? 'سجل المبيعات والعمولات والتقارير' : 'Sales & Ledger'}</span>
        </button>

        <button
          onClick={() => setActiveTab('supplier_profile')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'supplier_profile'
              ? 'bg-red-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <FileBadge className="w-4 h-4" />
          <span>{isAr ? 'بيانات المكتب والترخيص' : 'Office Profile & License'}</span>
        </button>
      </div>

      {/* ========================================================
          TAB 1: Products, Offers & Stock Management
          ======================================================== */}
      {(activeTab === 'supplier_inventory' || activeTab === 'sell') && (
        <div className="space-y-6">
          {/* Header Bar with Action Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {isAr ? 'قائمة الأدوية والمخزون المعروض للبيع' : 'Medicine Inventory & Wholesale Price Offers'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isAr
                  ? 'إضافة أدوية جديدة، تحديث الأسعار، كميات المستودع، أرقام التشغيلات، وإيقاف أو تفعيل العرض'
                  : 'Add new medicines, adjust prices in IQD, update warehouse batches and toggle availability'}
              </p>
            </div>

            <button
              onClick={() => {
                setIsAddProductModalOpen(true);
                setProductError(null);
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center gap-2 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? 'إضافة منتج دوائي جديد' : 'Add New Medicine'}</span>
            </button>
          </div>

          {/* Filter & Search Bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-3 flex flex-col md:flex-row items-center justify-between gap-3 shadow-2xs">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 rtl:right-3 ltr:left-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={isAr ? 'بحث بالاسم التجاري، العلمي، أو رقم الوجبة...' : 'Search medicine, active ingredient, or batch...'}
                className="w-full text-xs py-2 rtl:pr-9 rtl:pl-3 ltr:pl-9 ltr:pr-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-xs text-slate-500 font-semibold">{isAr ? 'الحالة:' : 'Status:'}</span>
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 text-xs rounded-lg font-semibold cursor-pointer ${
                  statusFilter === 'all' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {isAr ? 'الكل' : 'All'} ({myOffers.length})
              </button>
              <button
                onClick={() => setStatusFilter('active')}
                className={`px-2.5 py-1 text-xs rounded-lg font-semibold cursor-pointer ${
                  statusFilter === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {isAr ? 'نشط' : 'Active'} ({myOffers.filter(o => o.status === 'active').length})
              </button>
              <button
                onClick={() => setStatusFilter('paused')}
                className={`px-2.5 py-1 text-xs rounded-lg font-semibold cursor-pointer ${
                  statusFilter === 'paused' ? 'bg-slate-200 text-slate-800' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {isAr ? 'متوقف' : 'Paused'} ({myOffers.filter(o => o.status === 'paused').length})
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right rtl:text-right ltr:text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="py-3 px-4">{isAr ? 'المستحضر الدوائي' : 'Medicine'}</th>
                    <th className="py-3 px-4">{isAr ? 'الشركة المصنعة' : 'Manufacturer'}</th>
                    <th className="py-3 px-4 font-mono-nums">{isAr ? 'سعر البيع (د.ع)' : 'Wholesale Price'}</th>
                    <th className="py-3 px-4 text-center">{isAr ? 'المخزون' : 'Stock'}</th>
                    <th className="py-3 px-4 text-center">{isAr ? 'الحد الأدنى' : 'MOQ'}</th>
                    <th className="py-3 px-4 font-mono-nums">{isAr ? 'التشغيلة والصلاحية' : 'Batch / Exp'}</th>
                    <th className="py-3 px-4 text-center">{isAr ? 'حالة العرض' : 'Status'}</th>
                    <th className="py-3 px-4 text-center">{isAr ? 'إجراءات' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOffers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400">
                        <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <div>{isAr ? 'لا توجد منتجات مطابقة في المستودع' : 'No matching medicines in inventory'}</div>
                        <button
                          onClick={() => {
                            setIsAddProductModalOpen(true);
                            setProductError(null);
                          }}
                          className="mt-3 px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-lg text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{isAr ? 'إضافة دواء جديد الآن' : 'Add First Medicine'}</span>
                        </button>
                      </td>
                    </tr>
                  ) : (
                    filteredOffers.map(offer => {
                      const prod = products.find(p => p.id === offer.productId);
                      return (
                        <tr key={offer.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{prod?.nameAr || prod?.nameEn}</span>
                              {offer.isColdChain && (
                                <span className="text-[10px] bg-sky-100 text-sky-800 px-1 py-0.2 rounded font-semibold flex items-center gap-0.5">
                                  <Snowflake className="w-3 h-3 text-sky-600" />
                                  2-8°C
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 font-sans">
                              {prod?.nameEn} · {prod?.dosageForm} ({prod?.strength})
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {prod?.activeIngredient}
                            </div>
                          </td>

                          <td className="py-3 px-4 text-slate-600">
                            <div>{prod?.manufacturer}</div>
                            <div className="text-[10px] text-slate-400">{prod?.countryOfOrigin}</div>
                          </td>

                          <td className="py-3 px-4 font-bold text-slate-900 font-mono-nums">
                            {offer.priceIQD.toLocaleString()} د.ع
                            {offer.discountNotes && (
                              <div className="text-[10px] text-amber-700 font-normal">
                                {offer.discountNotes}
                              </div>
                            )}
                          </td>

                          <td className="py-3 px-4 text-center font-semibold font-mono-nums">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] ${
                                offer.stockQuantity <= 10
                                  ? 'bg-red-100 text-red-800 font-bold'
                                  : 'text-slate-800'
                              }`}
                            >
                              {offer.stockQuantity}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-center font-semibold font-mono-nums text-slate-600">
                            {offer.minOrderQty}
                          </td>

                          <td className="py-3 px-4 font-mono-nums text-slate-600">
                            <div className="font-bold">{offer.batchNumber}</div>
                            <div className="text-[10px] text-slate-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              <span>{offer.expiryDate}</span>
                            </div>
                          </td>

                          <td className="py-3 px-4 text-center">
                            {offer.status === 'active' && (
                              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                                {isAr ? 'نشط ومعروض' : 'Active'}
                              </span>
                            )}
                            {offer.status === 'paused' && (
                              <span className="text-[10px] font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded">
                                {isAr ? 'متوقف مؤقتاً' : 'Paused'}
                              </span>
                            )}
                            {offer.status === 'pending_review' && (
                              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                                {isAr ? 'قيد التدقيق' : 'Pending Review'}
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {/* Edit Button */}
                              <button
                                onClick={() => {
                                  setEditingOffer(offer);
                                  setOfferPrice(offer.priceIQD);
                                  setOfferStock(offer.stockQuantity);
                                  setOfferMOQ(offer.minOrderQty);
                                  setOfferBatch(offer.batchNumber);
                                  setOfferExpiry(offer.expiryDate);
                                }}
                                className="p-1.5 text-slate-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                title={isAr ? 'تعديل السعر والمخزون' : 'Edit Price & Stock'}
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              {/* Toggle Active/Paused */}
                              <button
                                onClick={() => handleToggleOffer(offer.id)}
                                className={`p-1.5 rounded transition-colors ${
                                  offer.status === 'active'
                                    ? 'text-amber-600 hover:bg-amber-50'
                                    : 'text-emerald-600 hover:bg-emerald-50'
                                }`}
                                title={
                                  offer.status === 'active'
                                    ? (isAr ? 'إيقاف عرض الصنف' : 'Pause offer')
                                    : (isAr ? 'تفعيل عرض الصنف' : 'Activate offer')
                                }
                              >
                                <Power className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete Offer */}
                              <button
                                onClick={() => handleDeleteOffer(offer.id)}
                                className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                title={isAr ? 'حذف الصنف من المستودع' : 'Delete Offer'}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: Incoming Suborders Queue
          ======================================================== */}
      {activeTab === 'supplier_orders' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {isAr ? 'طلبات التجهيز الواردة من الصيدليات' : 'Incoming Suborders Queue'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isAr
                  ? 'مراجعة وتأكيد الطلبيات، اقتراح تعديل الأسعار/الكميات، والشحن عبر الشاحنات المبردة'
                  : 'Review orders, propose substitutions/price edits, and record fulfillment status'}
              </p>
            </div>
            <span className="text-xs text-slate-500">
              {suborders.length} {isAr ? 'طلبيات واردة' : 'suborders'}
            </span>
          </div>

          {suborders.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
              <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-700">
                {isAr ? 'لا توجد طلبات تجهيز واردة حالياً' : 'No incoming suborders yet'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {isAr ? 'عندما تقوم صيدلية بإرسال طلبية تحتوي على أدويتك، ستظهر هنا فورياً' : 'Orders from pharmacies will appear here'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {suborders.map(sub => (
                <div
                  key={sub.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs p-5 space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-extrabold text-slate-900 font-mono-nums">
                          {sub.suborderNumber}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          {new Date(sub.createdAt).toLocaleDateString('ar-IQ')}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
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
                              : 'bg-red-50 text-red-800'
                          }`}
                        >
                          {sub.status === 'pending_supplier_review' && (isAr ? 'جديد (بانتظار التأكيد)' : 'Pending Review')}
                          {sub.status === 'supplier_modified' && (isAr ? 'بانتظار موافقة الصيدلية على التعديل' : 'Awaiting Pharmacy Approval')}
                          {sub.status === 'confirmed' && (isAr ? 'مؤكد ومُفوتر' : 'Confirmed')}
                          {sub.status === 'dispatched' && (isAr ? 'شُحن بالشاحنة المبردة' : 'Dispatched')}
                          {sub.status === 'delivered' && (isAr ? 'مكتمل ومُسلَّم' : 'Delivered')}
                          {sub.status === 'cancelled' && (isAr ? 'ملغى' : 'Cancelled')}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 mt-1">
                        {isAr ? 'الصيدلية الطالبة:' : 'Pharmacy:'}{' '}
                        <span className="font-bold text-slate-900">{sub.pharmacyName}</span> ({sub.pharmacyGov}) ·{' '}
                        <span className="font-mono-nums">{sub.pharmacyPhone}</span>
                      </div>
                    </div>

                    <div className="text-left rtl:text-left ltr:text-right">
                      <div className="text-xs text-slate-400">{isAr ? 'مبلغ التجهيز' : 'Amount'}</div>
                      <div className="text-base font-bold text-slate-900 font-mono-nums">
                        {sub.subtotalIQD.toLocaleString()} د.ع
                      </div>
                    </div>
                  </div>

                  {/* Line items table */}
                  <div className="divide-y divide-slate-100 border border-slate-100 rounded-lg overflow-hidden bg-slate-50/50">
                    {sub.items.map((it, idx) => (
                      <div key={idx} className="p-3 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-slate-900">{it.productName}</span>{' '}
                          <span className="text-slate-500">({it.strength})</span>
                          <div className="text-[10px] text-slate-400 font-mono-nums">
                            {isAr ? 'الوجبة:' : 'Batch:'} {it.batchNumber} · {isAr ? 'الصلاحية:' : 'Exp:'} {it.expiryDate}
                          </div>
                        </div>
                        <div className="text-left rtl:text-left ltr:text-right font-mono-nums">
                          <span className="font-bold text-slate-900">{it.quantity} {isAr ? 'علبة' : 'packs'}</span> ×{' '}
                          <span>{it.unitPriceIQD.toLocaleString()} د.ع</span> ={' '}
                          <span className="font-bold text-red-700">{it.totalPriceIQD.toLocaleString()} د.ع</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Courier tracking summary if present */}
                  {sub.courierName && (
                    <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-red-600" />
                        <span>
                          {isAr ? 'مندوب التوصيل:' : 'Courier:'} {sub.courierName} ({sub.courierPhone}) — {sub.deliveryTrackingNote}
                        </span>
                      </div>
                      {sub.invoiceNumber && (
                        <span className="text-xs font-mono-nums font-bold text-slate-700">
                          {isAr ? 'فاتورة:' : 'Invoice:'} {sub.invoiceNumber}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Action Buttons Toolbar */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                    <div className="text-xs text-slate-500 font-mono-nums">
                      {isAr ? 'عمولة المنصة المحتسبة عند التسليم:' : 'Platform Commission at completion:'}{' '}
                      <span className="font-bold text-red-600">{sub.commissionAmountIQD.toLocaleString()} د.ع ({sub.commissionRatePercent}%)</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Action 1: Accept Order */}
                      {sub.status === 'pending_supplier_review' && (
                        <>
                          <button
                            onClick={() => handleAction(sub.id, 'accept')}
                            className="px-3.5 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs"
                          >
                            {isAr ? 'تأكيد التجهيز وإصدار الفاتورة' : 'Accept & Issue Invoice'}
                          </button>
                          <button
                            onClick={() => handleOpenModifyModal(sub)}
                            className="px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg"
                          >
                            {isAr ? 'اقتراح تعديل كمية / سعر' : 'Propose Modification'}
                          </button>
                          <button
                            onClick={() => handleAction(sub.id, 'reject', { reason: 'المخزون نفد' })}
                            className="px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                          >
                            {isAr ? 'اعتذار' : 'Reject'}
                          </button>
                        </>
                      )}

                      {/* Action 2: Dispatch with Courier */}
                      {sub.status === 'confirmed' && (
                        <button
                          onClick={() => {
                            setDispatchingSuborder(sub);
                            setCourierName('');
                            setCourierPhone('');
                            setDeliveryTrackingNote('');
                          }}
                          className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs flex items-center gap-1.5"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>{isAr ? 'شحن الطلبية (سائق مبرد)' : 'Dispatch Suborder'}</span>
                        </button>
                      )}

                      {/* Action 3: Mark Delivered */}
                      {sub.status === 'dispatched' && (
                        <button
                          onClick={() => handleAction(sub.id, 'deliver')}
                          className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{isAr ? 'تأكيد التسليم للصيدلية' : 'Mark Delivered'}</span>
                        </button>
                      )}

                      {/* View Invoice */}
                      {(sub.status === 'confirmed' || sub.status === 'dispatched' || sub.status === 'delivered') && (
                        <button
                          onClick={() => setSelectedSuborderForInvoice(sub)}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center gap-1.5"
                        >
                          <FileText className="w-3.5 h-3.5 text-red-600" />
                          <span>{isAr ? 'عرض قائمة التجهيز' : 'View Invoice'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          TAB 3: Commission Reconciliation Statements
          ======================================================== */}
      {activeTab === 'supplier_reconciliation' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {isAr ? 'كشف تسوية عمولات ومبيعات المنصة' : 'Platform Commission Reconciliation'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isAr
                ? 'تحتسب عمولة المنصة فقط على المبيعات المكتملة والمستلمة فعلياً بموجب اتفاقية التجهيز (2.5%)'
                : 'Platform fee is calculated exclusively on eligible completed transactions per supplier agreement'}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-xs text-right rtl:text-right ltr:text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="py-3 px-4">{isAr ? 'رقم الطلبية الفرعية' : 'Suborder No.'}</th>
                  <th className="py-3 px-4">{isAr ? 'الصيدلية المستلمة' : 'Pharmacy'}</th>
                  <th className="py-3 px-4 font-mono-nums">{isAr ? 'قيمة المبيعات المكتملة' : 'Completed Sale'}</th>
                  <th className="py-3 px-4 text-center">{isAr ? 'نسبة العمولة' : 'Platform Rate'}</th>
                  <th className="py-3 px-4 font-mono-nums">{isAr ? 'مبلغ العمولة للمنصة' : 'Platform Fee'}</th>
                  <th className="py-3 px-4 text-center">{isAr ? 'حالة التسوية' : 'Settlement'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {commissions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      {isAr ? 'لا توجد عمولات مستحقة حالياً' : 'No commission records accrued yet'}
                    </td>
                  </tr>
                ) : (
                  commissions.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-bold font-mono-nums text-slate-900">{c.suborderNumber}</td>
                      <td className="py-3 px-4 text-slate-700">{c.pharmacyName}</td>
                      <td className="py-3 px-4 font-bold font-mono-nums text-slate-900">
                        {c.saleAmountIQD.toLocaleString()} د.ع
                      </td>
                      <td className="py-3 px-4 text-center font-mono-nums">{c.platformRatePercent}%</td>
                      <td className="py-3 px-4 font-bold font-mono-nums text-red-600">
                        {c.platformFeeIQD.toLocaleString()} د.ع
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                          {c.settlementStatus === 'settled' ? (isAr ? 'مسددة' : 'Settled') : (isAr ? 'مستحقة' : 'Accrued')}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 4: Office Profile & Legal License Details
          ======================================================== */}
      {activeTab === 'supplier_profile' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {isAr ? 'بيانات المكتب الدوائي والترخيص القانوني' : 'Office Profile & Syndicate License'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isAr
                ? 'تفاصيل التسجيل القانوني، إجازة نقابة صيادلة العراق، والسجل التجاري المعتمد'
                : 'Legal registration, Syndicate license details, and warehouse contacts'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Legal Entity Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{currentUser?.organizationName}</h3>
                  <p className="text-xs text-slate-500">{currentUser?.legalEntityName || currentUser?.organizationName}</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">{isAr ? 'نوع الكيان الدوائي:' : 'Entity Type:'}</span>
                  <span className="font-bold text-slate-900">
                    {currentUser?.supplierType === 'scientific_office'
                      ? (isAr ? 'مكتب علمي دوائي مجاز' : 'Scientific Office')
                      : currentUser?.supplierType === 'pharma_company'
                      ? (isAr ? 'شركة أدوية مصنّعة' : 'Pharma Manufacturer')
                      : (isAr ? 'مذخر أدوية جملة معتمد' : 'Pharma Wholesaler')}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">{isAr ? 'رقم إجازة نقابة صيادلة العراق:' : 'Syndicate License:'}</span>
                  <span className="font-mono-nums font-bold text-red-700">{currentUser?.licenseNumber}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">{isAr ? 'رقم السجل التجاري:' : 'Commercial Register:'}</span>
                  <span className="font-mono-nums font-bold text-slate-800">{currentUser?.commercialRegister || 'CR-IQ-99120'}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">{isAr ? 'المحافظة ومقر المستودع:' : 'Governorate & City:'}</span>
                  <span className="font-semibold text-slate-800">{currentUser?.governorate}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">{isAr ? 'العنوان التفصيلي:' : 'Address Details:'}</span>
                  <span className="text-slate-700">{currentUser?.addressDetails || 'شارع السعدون - مجمع المستودعات المركزية'}</span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-slate-500">{isAr ? 'حالة التوثيق النقابي:' : 'Verification Status:'}</span>
                  <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                    currentUser?.status === 'verified'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {currentUser?.status === 'verified'
                      ? (isAr ? 'معتمد وموثق نقابياً' : 'Verified')
                      : (isAr ? 'قيد التدقيق من الإدارة' : 'Pending Verification')}
                  </span>
                </div>
              </div>
            </div>

            {/* Manager Pharmacist Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold">
                  <FileBadge className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{isAr ? 'الصيدلي المدير المسؤول' : 'Pharmacist in Charge'}</h3>
                  <p className="text-xs text-slate-500">{currentUser?.name}</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">{isAr ? 'الاسم الثلاثي واللقب:' : 'Full Name:'}</span>
                  <span className="font-bold text-slate-900">{currentUser?.name}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">{isAr ? 'رقم الهاتف المباشر:' : 'Phone Number:'}</span>
                  <span className="font-mono-nums font-bold text-slate-900">{currentUser?.phone}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">{isAr ? 'البريد الإلكتروني:' : 'Email:'}</span>
                  <span className="font-mono text-slate-700">{currentUser?.email}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">{isAr ? 'سلسلة التبريد المعتمدة:' : 'Cold-Chain Certified:'}</span>
                  <span className="font-bold text-sky-800 flex items-center gap-1">
                    <Snowflake className="w-3.5 h-3.5 text-sky-600" />
                    {isAr ? 'شاحنات مبردة مجهزة بمتحسسات 2-8°C' : 'Certified 2-8°C'}
                  </span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-slate-500">{isAr ? 'اتفاقية الوساطة الرقمية:' : 'B2B Agreement:'}</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {isAr ? 'موقعة ومفعلة (عمولة 2.5%)' : 'Signed (2.5% fee)'}
                  </span>
                </div>
              </div>

              {isPendingVerification && (
                <div className="pt-2">
                  <button
                    onClick={handleInstantApprove}
                    className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    {isAr ? '⚡ اعتماد الحساب الآن لتفعيل النشر الفوري' : 'Verify Account Instantly'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: Add New Pharmaceutical Product & Offer
          ======================================================== */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-red-100 text-red-700 rounded-lg">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {isAr ? 'إضافة منتج دوائي جديد للمستودع' : 'Add New Medicine to Inventory'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isAr ? 'إدخال البيانات الدوائية الرسمية والتسعيرة وعرض البيع للصيدليات' : 'Standard pharmaceutical specs and wholesale pricing'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDemoFillProduct}
                  className="px-2.5 py-1 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                  title={isAr ? 'تعبئة الحقول ببيانات تجريبية سريعة' : 'Fill demo drug data'}
                >
                  <Sparkles className="w-3.5 h-3.5 text-red-600" />
                  <span>{isAr ? 'ملء سريع بدواء تجريبي' : 'Demo Fill'}</span>
                </button>
                <button
                  onClick={() => setIsAddProductModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  ✕
                </button>
              </div>
            </div>

            {productError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{productError}</span>
              </div>
            )}

            <form onSubmit={handleAddProductSubmit} className="mt-4 space-y-4">
              {/* Row 1: Medicine Trade Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isAr ? 'اسم الدواء التجاري (بالعربية) *' : 'Trade Name (Arabic) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newProdNameAr}
                    onChange={e => setNewProdNameAr(e.target.value)}
                    placeholder={isAr ? 'مثال: أوجمنتين 1000 ملغم' : 'Trade Name in Arabic'}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isAr ? 'اسم الدواء التجاري (بالإنجليزية) *' : 'Trade Name (English) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newProdNameEn}
                    onChange={e => setNewProdNameEn(e.target.value)}
                    placeholder="e.g. Augmentin 1g Tablets"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Row 2: Active Ingredient & Manufacturer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isAr ? 'الاسم العلمي / المادة الفعالة *' : 'Active Ingredient *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newProdActiveIngredient}
                    onChange={e => setNewProdActiveIngredient(e.target.value)}
                    placeholder="e.g. Amoxicillin + Clavulanic Acid"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isAr ? 'الشركة المصنّعة وبلد المنشأ *' : 'Manufacturer & Country *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newProdManufacturer}
                    onChange={e => setNewProdManufacturer(e.target.value)}
                    placeholder={isAr ? 'مثال: GSK - بريطانيا' : 'Manufacturer name'}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Row 3: Dosage Form, Strength, Package Size */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isAr ? 'الشكل الدوائي *' : 'Dosage Form *'}
                  </label>
                  <select
                    value={newProdDosageForm}
                    onChange={e => setNewProdDosageForm(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 bg-white"
                  >
                    {COMMON_DOSAGE_FORMS.map((form, i) => (
                      <option key={i} value={form}>{form}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isAr ? 'التركيز الدوائي *' : 'Strength *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newProdStrength}
                    onChange={e => setNewProdStrength(e.target.value)}
                    placeholder="e.g. 1000 mg, 500 mg/5ml"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isAr ? 'حجم وتعبئة العبوة' : 'Package Size'}
                  </label>
                  <input
                    type="text"
                    value={newProdPackageSize}
                    onChange={e => setNewProdPackageSize(e.target.value)}
                    placeholder={isAr ? 'مثال: 14 قرص / عبوة 100 مل' : 'e.g. 14 tabs'}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Row 4: Barcode & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isAr ? 'الباركود الدولي (GTIN / Barcode)' : 'Barcode'}
                  </label>
                  <input
                    type="text"
                    value={newProdBarcode}
                    onChange={e => setNewProdBarcode(e.target.value)}
                    placeholder="6281001234567"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 font-mono-nums"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isAr ? 'التصنيف العلاجي' : 'Therapeutic Category'}
                  </label>
                  <select
                    value={newProdCategory}
                    onChange={e => setNewProdCategory(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 bg-white"
                  >
                    {COMMON_CATEGORIES.map((cat, i) => (
                      <option key={i} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 5: Price, Stock, Min Order Quantity */}
              <div className="p-3 bg-red-50/50 rounded-xl border border-red-100 space-y-3">
                <div className="text-xs font-bold text-red-900 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-red-600" />
                  <span>{isAr ? 'بيانات التسعير والكميات المتاحة للصيدليات' : 'Pricing & Inventory Stock'}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {isAr ? 'سعر البيع للصيدليات (د.ع) *' : 'Wholesale Price (IQD) *'}
                    </label>
                    <input
                      type="number"
                      step={50}
                      required
                      value={newProdPrice}
                      onChange={e => setNewProdPrice(Number(e.target.value) || 0)}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 font-mono-nums font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {isAr ? 'الكمية المتوفرة بالمستودع *' : 'Stock Quantity *'}
                    </label>
                    <input
                      type="number"
                      min={0}
                      required
                      value={newProdStock}
                      onChange={e => setNewProdStock(Number(e.target.value) || 0)}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 font-mono-nums font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {isAr ? 'الحد الأدنى للطلب (MOQ)' : 'Min Order Qty'}
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={newProdMinQty}
                      onChange={e => setNewProdMinQty(Number(e.target.value) || 1)}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 font-mono-nums"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isAr ? 'بونص أو عروض ترويجية خاصة (اختياري)' : 'Bonus / Promotion Notes'}
                  </label>
                  <input
                    type="text"
                    value={newProdDiscountNotes}
                    onChange={e => setNewProdDiscountNotes(e.target.value)}
                    placeholder={isAr ? 'مثال: بونص 10+2 عند طلب 20 علبة' : 'e.g. 10+2 bonus'}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 bg-white"
                  />
                </div>
              </div>

              {/* Row 6: Batch, Expiry, Production & Cold-Chain */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{isAr ? 'بيانات التتبع والتشغيلة وسلسلة التبريد' : 'Batch Traceability & Cold-Chain'}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {isAr ? 'رقم الوجبة / التشغيلة (Batch) *' : 'Batch / Lot No. *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={newProdBatch}
                      onChange={e => setNewProdBatch(e.target.value)}
                      placeholder="e.g. B-2024-AUG-88"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 font-mono-nums uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {isAr ? 'تاريخ الإنتاج' : 'Production Date'}
                    </label>
                    <input
                      type="date"
                      value={newProdProdDate}
                      onChange={e => setNewProdProdDate(e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 font-mono-nums"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {isAr ? 'تاريخ انتهاء الصلاحية *' : 'Expiry Date *'}
                    </label>
                    <input
                      type="date"
                      required
                      value={newProdExpiryDate}
                      onChange={e => setNewProdExpiryDate(e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 font-mono-nums font-bold"
                    />
                  </div>
                </div>

                <div className="pt-1 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="newProdColdChain"
                    checked={newProdIsColdChain}
                    onChange={e => setNewProdIsColdChain(e.target.checked)}
                    className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500 cursor-pointer"
                  />
                  <label htmlFor="newProdColdChain" className="text-xs text-slate-700 font-semibold cursor-pointer flex items-center gap-1">
                    <Snowflake className="w-3.5 h-3.5 text-sky-600" />
                    <span>{isAr ? 'يتطلب حفظ ونقل مبرد (سلسلة التبريد 2 إلى 8 درجات مئوية)' : 'Requires Cold-Chain (2-8°C)'}</span>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddProductModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingProduct}
                  className="px-6 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 disabled:bg-slate-300 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
                >
                  {isSubmittingProduct ? (
                    <span>{isAr ? 'جاري الحفظ...' : 'Saving...'}</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{isAr ? 'حفظ وإدراج الدواء في المستودع' : 'Save & Publish to Warehouse'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {selectedSuborderForInvoice && (
        <InvoiceModal
          suborder={selectedSuborderForInvoice}
          onClose={() => setSelectedSuborderForInvoice(null)}
        />
      )}

      {/* Propose Modification Modal */}
      {modifyingSuborder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                {isAr ? 'اقتراح تعديل على طلبية التجهيز' : 'Propose Suborder Modification'}
              </h3>
              <button
                onClick={() => setModifyingSuborder(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveModification} className="mt-4 space-y-4">
              <div className="text-xs text-slate-500">
                {isAr
                  ? 'وفقاً لنظام المنصة، أي تعديل على الكمية أو السعر يتطلب موافقة الصيدلية قبل اعتماده.'
                  : 'Per marketplace rules, any price or quantity modification requires pharmacy confirmation.'}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isAr ? 'سبب التعديل الموجه للصيدلية:' : 'Reason for Modification:'}
                </label>
                <input
                  type="text"
                  required
                  value={modReason}
                  onChange={e => setModReason(e.target.value)}
                  placeholder={isAr ? 'مثال: توفر 15 علبة فقط بدلاً من 20، أو تحديث تسعيرة الوجبة الجديدة' : 'e.g. Only 15 packs available in batch'}
                  className="w-full text-xs p-2 border border-slate-300 rounded focus:ring-1 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div className="space-y-3 max-h-48 overflow-y-auto">
                {modItems.map((it, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded border border-slate-200 text-xs space-y-2">
                    <div className="font-bold text-slate-900">{it.productName}</div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-500">{isAr ? 'الكمية المقترحة' : 'Qty'}</label>
                        <input
                          type="number"
                          min={1}
                          value={it.quantity}
                          onChange={e => {
                            const val = parseInt(e.target.value) || 1;
                            const updated = [...modItems];
                            updated[idx].quantity = val;
                            setModItems(updated);
                          }}
                          className="w-full p-1 border rounded text-xs font-mono-nums"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500">{isAr ? 'سعر المفرد (د.ع)' : 'Unit Price'}</label>
                        <input
                          type="number"
                          step={50}
                          value={it.unitPriceIQD}
                          onChange={e => {
                            const val = parseInt(e.target.value) || 0;
                            const updated = [...modItems];
                            updated[idx].unitPriceIQD = val;
                            setModItems(updated);
                          }}
                          className="w-full p-1 border rounded text-xs font-mono-nums"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModifyingSuborder(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 rounded"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 rounded shadow-xs"
                >
                  {isAr ? 'إرسال التعديل للصيدلية' : 'Submit to Pharmacy'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dispatch Modal */}
      {dispatchingSuborder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                {isAr ? 'تسجيل بيانات الشحن والتوصيل المبرد' : 'Record Courier & Dispatch Details'}
              </h3>
              <button
                onClick={() => setDispatchingSuborder(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDispatch} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isAr ? 'اسم سائق الشاحنة المبردة أو شركة التوصيل' : 'Courier / Driver Name'}
                </label>
                <input
                  type="text"
                  required
                  value={courierName}
                  onChange={e => setCourierName(e.target.value)}
                  placeholder={isAr ? 'مثال: سجاد الكرخي (سيارة تبريد)' : 'e.g. Sajjad Transport'}
                  className="w-full text-xs p-2 border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isAr ? 'رقم هاتف السائق' : 'Driver Phone'}
                </label>
                <input
                  type="text"
                  required
                  value={courierPhone}
                  onChange={e => setCourierPhone(e.target.value)}
                  placeholder="+964 771 999 8877"
                  className="w-full text-xs p-2 border border-slate-300 rounded font-mono-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isAr ? 'ملاحظات التتبع ودرجة حرارة الشحنة' : 'Tracking & Cold-Chain Notes'}
                </label>
                <input
                  type="text"
                  value={deliveryTrackingNote}
                  onChange={e => setDeliveryTrackingNote(e.target.value)}
                  placeholder={isAr ? 'تم ضبط التبريد على 18 مئوية وانطلقت الشاحنة' : 'Temperature set to 18C'}
                  className="w-full text-xs p-2 border border-slate-300 rounded"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDispatchingSuborder(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 rounded"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded shadow-xs"
                >
                  {isAr ? 'تأكيد الشحن' : 'Confirm Dispatch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Offer Modal */}
      {editingOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                {isAr ? 'تعديل عرض السعر والمخزون' : 'Edit Offer & Stock'}
              </h3>
              <button
                onClick={() => setEditingOffer(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveOffer} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isAr ? 'السعر بالدينار العراقي (د.ع)' : 'Price (IQD)'}
                </label>
                <input
                  type="number"
                  step={50}
                  required
                  value={offerPrice}
                  onChange={e => setOfferPrice(parseInt(e.target.value) || 0)}
                  className="w-full text-xs p-2 border border-slate-300 rounded font-mono-nums"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isAr ? 'الكمية المتوفرة' : 'Stock Quantity'}
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={offerStock}
                    onChange={e => setOfferStock(parseInt(e.target.value) || 0)}
                    className="w-full text-xs p-2 border border-slate-300 rounded font-mono-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isAr ? 'الحد الأدنى للطلب (MOQ)' : 'Min Order Qty'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={offerMOQ}
                    onChange={e => setOfferMOQ(parseInt(e.target.value) || 1)}
                    className="w-full text-xs p-2 border border-slate-300 rounded font-mono-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isAr ? 'رقم الوجبة (Batch)' : 'Batch No.'}
                  </label>
                  <input
                    type="text"
                    required
                    value={offerBatch}
                    onChange={e => setOfferBatch(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-300 rounded font-mono-nums uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isAr ? 'تاريخ النفاذ' : 'Expiry Date'}
                  </label>
                  <input
                    type="date"
                    required
                    value={offerExpiry}
                    onChange={e => setOfferExpiry(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-300 rounded font-mono-nums"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingOffer(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 rounded"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded shadow-xs"
                >
                  {isAr ? 'حفظ التحديث' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
