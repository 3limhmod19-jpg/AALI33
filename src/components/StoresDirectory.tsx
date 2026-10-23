import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  MapPin,
  Phone,
  ShieldCheck,
  Truck,
  Star,
  Search,
  CheckCircle2,
  Clock,
  Package,
  Layers,
  ArrowRight,
  ExternalLink,
  Filter,
} from 'lucide-react';

interface WholesalerStore {
  id: string;
  name: string;
  typeAr: string;
  typeEn: string;
  governorate: string;
  city: string;
  licenseNumber: string;
  phone: string;
  rating: number;
  completedOrders: number;
  leadTimeHours: number;
  minOrderIQD: number;
  coverageGovs: string[];
  refrigeratedFleet: boolean;
  featuredBrands: string[];
  specialty: string;
}

const IRAQI_WHOLESALERS: WholesalerStore[] = [
  {
    id: 'store_babil',
    name: 'مذخر بابل الحديث للأدوية والمستلزمات الطبية',
    typeAr: 'مذخر أدوية عام مجاز',
    typeEn: 'Licensed Pharma Wholesaler',
    governorate: 'بغداد',
    city: 'الكرخ - شارع حيفا والمنصور',
    licenseNumber: 'WH-BG-2023-441',
    phone: '+964 771 555 1212',
    rating: 4.9,
    completedOrders: 1420,
    leadTimeHours: 6,
    minOrderIQD: 250000,
    coverageGovs: ['بغداد', 'بابل', 'الأنبار', 'ديالى', 'واسط'],
    refrigeratedFleet: true,
    featuredBrands: ['Augmentin', 'Panadol', 'Glucophage', 'Zithromax'],
    specialty: 'مضادات حيوية، مسكنات، أدوية الأمراض المزمنة والرعاية الحرجة',
  },
  {
    id: 'store_dijla',
    name: 'المكتب العلمي لدجلة للأدوية العالمية',
    typeAr: 'مكتب علمي واستيراد معتمد',
    typeEn: 'Scientific Bureau & Importer',
    governorate: 'أربيل',
    city: 'شارع 60 وعينكاوة',
    licenseNumber: 'BUR-ER-2024-112',
    phone: '+964 750 444 8899',
    rating: 4.85,
    completedOrders: 980,
    leadTimeHours: 12,
    minOrderIQD: 500000,
    coverageGovs: ['أربيل', 'السليمانية', 'دهوك', 'نينوى', 'كركوك'],
    refrigeratedFleet: true,
    featuredBrands: ['Lipitor', 'Concor', 'Ventolin', 'Nexium'],
    specialty: 'أدوية القلب والضغط، أجهزة الاستنشاق الصدرية، علاجات المعدة المستوردة',
  },
  {
    id: 'store_najaf',
    name: 'مذخر النجف المركزي للمستلزمات الطبية',
    typeAr: 'مذخر أدوية ومستلزمات',
    typeEn: 'Pharma & Medical Supplies',
    governorate: 'النجف الأشرف',
    city: 'شارع الكوفة - حي الأمير',
    licenseNumber: 'WH-NJ-2022-89',
    phone: '+964 781 222 3344',
    rating: 4.8,
    completedOrders: 860,
    leadTimeHours: 8,
    minOrderIQD: 200000,
    coverageGovs: ['النجف الأشرف', 'كربلاء المقدسة', 'القادسية', 'المثنى'],
    refrigeratedFleet: true,
    featuredBrands: ['Cravit', 'Cataflam', 'Lantus', 'Amoxil'],
    specialty: 'محاليل وريدية، أدوية السكري والانسولين، مضادات حيوية واسعة الطيف',
  },
  {
    id: 'store_basra',
    name: 'مذخر شط العرب الدوائي المتكامل',
    typeAr: 'مذخر توزيع دوائي رئيسي',
    typeEn: 'Regional Distribution Wholesaler',
    governorate: 'البصرة',
    city: 'العشار - شارع الكويت والجبيلة',
    licenseNumber: 'WH-BAS-2023-519',
    phone: '+964 780 999 1122',
    rating: 4.75,
    completedOrders: 1190,
    leadTimeHours: 8,
    minOrderIQD: 300000,
    coverageGovs: ['البصرة', 'ميسان', 'ذي قار'],
    refrigeratedFleet: true,
    featuredBrands: ['Brufen', 'Klavox', 'Plavix', 'Spiriva'],
    specialty: 'أدوية القلب وجلطات الشرايين، مسكنات العظام، أدوية الأطفال المبردة',
  },
  {
    id: 'store_babil_furat',
    name: 'مذخر الفرات الأوسط للتجهيز الدوائي',
    typeAr: 'مذخر جملة وتوزيع مركزي',
    typeEn: 'Central Wholesale Pharma',
    governorate: 'بابل',
    city: 'الحلة - شارع الأطباء والجمعية',
    licenseNumber: 'WH-BAB-2024-332',
    phone: '+964 772 333 4455',
    rating: 4.9,
    completedOrders: 710,
    leadTimeHours: 6,
    minOrderIQD: 150000,
    coverageGovs: ['بابل', 'كربلاء المقدسة', 'النجف الأشرف', 'بغداد'],
    refrigeratedFleet: true,
    featuredBrands: ['Voltaren', 'Zantac', 'Januvia', 'Ceftriaxone'],
    specialty: 'حقن وريدية، أمبولات، علاجات السكري وأمراض الجهاز الهضمي',
  },
  {
    id: 'store_ninawa',
    name: 'مكتب نينوى العلمي للأدوية التخصصية',
    typeAr: 'مكتب علمي وتجهيز مستشفيات',
    typeEn: 'Scientific Bureau & Hospital Supply',
    governorate: 'نينوى',
    city: 'الموصل - المجموعة الثقافية',
    licenseNumber: 'BUR-NIN-2024-041',
    phone: '+964 770 888 6677',
    rating: 4.8,
    completedOrders: 530,
    leadTimeHours: 10,
    minOrderIQD: 350000,
    coverageGovs: ['نينوى', 'كركوك', 'صلاح الدين', 'دهوك'],
    refrigeratedFleet: true,
    featuredBrands: ['Rocephin', 'Ciprobay', 'Atorvastatin', 'Salbutamol'],
    specialty: 'أدوية الأمراض التنفسية، مضادات الالتهاب الحادة، أدوية الأورام والمناعة',
  },
];

export const StoresDirectory: React.FC = () => {
  const { language, setActiveTab, showToast } = useApp();
  const isAr = language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGov, setSelectedGov] = useState('all');
  const [selectedStoreModal, setSelectedStoreModal] = useState<WholesalerStore | null>(null);

  const filteredStores = IRAQI_WHOLESALERS.filter(store => {
    const matchesSearch =
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.featuredBrands.some(b => b.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesGov = selectedGov === 'all' || store.governorate.includes(selectedGov);
    return matchesSearch && matchesGov;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl p-6 sm:p-8 border border-slate-700/80 shadow-md text-right rtl:text-right ltr:text-left">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 mb-2">
              <Building2 className="w-3.5 h-3.5" />
              <span>{isAr ? 'دليل المتاجر والمذاخر المعتمدة في العراق' : 'Certified Iraqi Wholesalers & Bureaus'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {isAr ? 'متاجر ومذاخر الأدوية والمكاتب العلمية' : 'Wholesale Stores & Scientific Bureaus'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {isAr
                ? 'استعرض كافة المذاخر والمكاتب العلمية المرخصة في بغداد، أربيل، البصرة، النجف، والمحافظات، واطلب تجهيز الأدوية مباشرة بأفضل الأسعار.'
                : 'Browse verified pharmaceutical wholesalers and bureaus across all Iraqi governorates with direct ordering.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('sell')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Package className="w-4 h-4" />
              <span>{isAr ? 'أضف متجرك أو اعرض بضاعتك للبيع' : 'Sell as Wholesaler'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs space-y-3 text-right rtl:text-right ltr:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 right-3 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto" />
            <input
              type="text"
              placeholder={isAr ? 'ابحث باسم المذخر، المحافظة، التخصص، أو الأصناف (مثل: بابل، Augmentin، أنسولين)...' : 'Search wholesalers, governorate, or products...'}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none pr-9 rtl:pr-9 rtl:pl-3 ltr:pl-9 ltr:pr-3 transition-all"
            />
          </div>

          <div className="w-full sm:w-60">
            <select
              value={selectedGov}
              onChange={e => setSelectedGov(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="all">{isAr ? 'كافة المحافظات العراقية' : 'All Governorates'}</option>
              <option value="بغداد">بغداد</option>
              <option value="أربيل">أربيل</option>
              <option value="البصرة">البصرة</option>
              <option value="النجف">النجف الأشرف</option>
              <option value="بابل">بابل</option>
              <option value="نينوى">نينوى</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStores.map(store => (
          <div
            key={store.id}
            className="bg-white rounded-xl border border-slate-200 hover:border-emerald-400 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden text-right rtl:text-right ltr:text-left group"
          >
            <div className="p-5 space-y-3">
              {/* Top Row: Store Badge & Rating */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    {store.typeAr}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-1 group-hover:text-emerald-700 transition-colors">
                    {store.name}
                  </h3>
                </div>

                <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-900 px-2 py-0.5 rounded-md text-xs font-bold shrink-0 font-mono-nums">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>{store.rating}</span>
                </div>
              </div>

              {/* Location & License */}
              <div className="space-y-1 text-xs text-slate-600">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>
                    {store.governorate} · {store.city}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 font-mono-nums text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>إجازة نقابة صيادلة العراق: {store.licenseNumber}</span>
                </div>
              </div>

              {/* Specialty */}
              <div className="p-2.5 bg-slate-50 rounded-lg text-xs text-slate-700 border border-slate-100">
                <span className="font-semibold text-slate-900 block mb-0.5">{isAr ? 'التخصص الدوائي:' : 'Specialty:'}</span>
                <span className="text-[11px] leading-relaxed text-slate-600">{store.specialty}</span>
              </div>

              {/* Badges / Metrics */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 bg-emerald-50/60 rounded border border-emerald-100 text-emerald-900 font-mono-nums">
                  <span className="text-[10px] text-emerald-700 block">{isAr ? 'الحد الأدنى للطلب:' : 'Min Order:'}</span>
                  <span className="font-bold">{store.minOrderIQD.toLocaleString()} د.ع</span>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-100 text-slate-800 font-mono-nums">
                  <span className="text-[10px] text-slate-500 block">{isAr ? 'زمن التجهيز:' : 'Lead Time:'}</span>
                  <span className="font-bold">{store.leadTimeHours} {isAr ? 'ساعات' : 'hours'}</span>
                </div>
              </div>

              {/* Delivery & Fleet */}
              <div className="flex items-center gap-2 text-[11px] text-slate-600">
                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  {isAr ? 'نقل مبرد مجهز' : 'Refrigerated Fleet'} ·{' '}
                  <span className="text-slate-500">{store.completedOrders} {isAr ? 'طلبية مكتملة' : 'orders'}</span>
                </span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  setActiveTab('catalog');
                  showToast(isAr ? `تصفح أدوية ${store.name}` : `Browsing ${store.name}`);
                }}
                className="flex-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>{isAr ? 'تصفح أدوية هذا المذخر' : 'Browse Medicines'}</span>
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </button>

              <button
                onClick={() => setSelectedStoreModal(store)}
                className="py-1.5 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                {isAr ? 'تفاصيل' : 'Details'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Store Detail Modal */}
      {selectedStoreModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 text-right rtl:text-right ltr:text-left">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">{selectedStoreModal.name}</h3>
              <button
                onClick={() => setSelectedStoreModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                <div className="text-slate-500">{isAr ? 'المحافظة والمنطقة:' : 'Location:'}</div>
                <div className="font-bold text-slate-900">{selectedStoreModal.governorate} - {selectedStoreModal.city}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                <div className="text-slate-500">{isAr ? 'رقم الإجازة في نقابة صيادلة العراق:' : 'Syndicate License:'}</div>
                <div className="font-bold text-emerald-800 font-mono-nums">{selectedStoreModal.licenseNumber}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                <div className="text-slate-500">{isAr ? 'رقم هاتف المذخر المباشر:' : 'Direct Phone:'}</div>
                <div className="font-bold text-slate-900 font-mono-nums">{selectedStoreModal.phone}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                <div className="text-slate-500">{isAr ? 'المحافظات المشمولة بالتوصيل السريع:' : 'Delivery Coverage:'}</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedStoreModal.coverageGovs.map((gov, i) => (
                    <span key={i} className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[11px]">
                      {gov}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedStoreModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer"
              >
                {isAr ? 'إغلاق' : 'Close'}
              </button>
              <button
                onClick={() => {
                  setSelectedStoreModal(null);
                  setActiveTab('catalog');
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                {isAr ? 'طلب أدوية من هذا المذخر' : 'Order Medicines'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
