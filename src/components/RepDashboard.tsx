import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Share2,
  Copy,
  Users,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Building2,
  Lock,
  UserPlus,
  AlertCircle,
  FileCheck,
} from 'lucide-react';

export const RepDashboard: React.FC = () => {
  const { language, currentUser, showToast, activeTab } = useApp();
  const isAr = language === 'ar';

  const [stats, setStats] = useState<any>(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [newPharmacyName, setNewPharmacyName] = useState('');
  const [newPharmacistName, setNewPharmacistName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newGov, setNewGov] = useState('بغداد - الكرخ');
  const [newLicenseNo, setNewLicenseNo] = useState('');

  const repCode = currentUser?.repCode || 'REP-BGW-104';
  const referralLink = `https://dawana.iq/register?ref=${repCode}`;

  const fetchStats = async () => {
    try {
      const res = await fetch(`/api/rep/stats?code=${repCode}`);
      const data = await res.json();
      setStats(data.stats);
    } catch (err) {
      console.error('Failed to load rep stats:', err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [repCode, activeTab]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast(isAr ? 'تم نسخ الرابط إلى الحافظة' : 'Copied link to clipboard');
  };

  const handleOnboardPharmacy = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(
      isAr
        ? `تم تسجيل الصيدلية ${newPharmacyName} وإحالتها للتدقيق النقابي بكود الإحالة ${repCode}`
        : `Pharmacy ${newPharmacyName} registered under referral code ${repCode}`
    );
    setIsOnboardingOpen(false);
    setNewPharmacyName('');
    setNewPharmacistName('');
    setNewPhone('');
    setNewLicenseNo('');
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0 font-bold text-2xl">
            ن
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">
                {currentUser?.name}
              </h1>
              <span className="text-xs text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded font-semibold">
                {isAr ? 'مندوب علمي وتجاري معتمد' : 'Authorized Sales Representative'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {currentUser?.governorate} · {isAr ? 'كود الإحالة المخصص:' : 'Referral Code:'}{' '}
              <span className="font-mono-nums font-bold text-slate-900">{repCode}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOnboardingOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>{isAr ? 'تسجيل صيدلية جديدة بالإحالة' : 'Register New Pharmacy'}</span>
        </button>
      </div>

      {/* Referral Tools Card */}
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              {isAr ? 'رابط الإحالة الرقمي المباشر' : 'Official Referral Link'}
            </span>
            <h3 className="text-base font-bold mt-1">
              {isAr ? 'شارك رابطك المعتمد مع الصيدليات في منطقتك' : 'Share your accredited link with regional pharmacies'}
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              {isAr
                ? 'تحتسب عمولة المندوب (0.8%) تلقائياً على كل طلبية تجهيز مكتملة تسجل عن طريقك.'
                : '0.8% rep commission is automatically accrued on every completed delivery from your registered pharmacies.'}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/10 p-2 rounded-lg border border-white/20">
            <span className="text-xs font-mono-nums text-slate-200 px-2 truncate max-w-xs">
              {referralLink}
            </span>
            <button
              onClick={() => handleCopy(referralLink)}
              className="p-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded text-xs flex items-center gap-1 shrink-0"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{isAr ? 'نسخ' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1">
          <div className="text-[11px] text-slate-400 font-medium">
            {isAr ? 'الصيدليات المسجلة عبرك' : 'Referred Pharmacies'}
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono-nums">
            {stats?.referredPharmaciesCount || 2}
          </div>
          <div className="text-[10px] text-emerald-700 flex items-center gap-1 font-semibold">
            <CheckCircle2 className="w-3 h-3" />
            <span>{stats?.verifiedPharmaciesCount || 1} {isAr ? 'موثقة ومجازة' : 'Verified'}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1">
          <div className="text-[11px] text-slate-400 font-medium">
            {isAr ? 'الطلبيات المكتملة المؤهلة' : 'Eligible Completed Orders'}
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono-nums">
            {stats?.completedOrdersCount || 1}
          </div>
          <div className="text-[10px] text-slate-500">
            {stats?.totalOrdersCount || 2} {isAr ? 'إجمالي الطلبات' : 'total orders'}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1">
          <div className="text-[11px] text-slate-400 font-medium">
            {isAr ? 'حجم المبيعات المكتملة' : 'Eligible Sales Volume'}
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono-nums">
            {(stats?.totalEligibleSalesIQD || 445000).toLocaleString()} د.ع
          </div>
          <div className="text-[10px] text-slate-500">
            {isAr ? 'مبيعات الأدوية الخاضعة للعمولة' : 'Volume base'}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1">
          <div className="text-[11px] text-slate-400 font-medium">
            {isAr ? 'عمولة المندوب المستحقة (0.8%)' : 'Earned Rep Commission'}
          </div>
          <div className="text-xl font-bold text-emerald-700 font-mono-nums">
            {(stats?.totalCommissionEarnedIQD || 3560).toLocaleString()} د.ع
          </div>
          <div className="text-[10px] text-emerald-800 font-bold">
            {isAr ? 'جاهزة للصرف والتحويل' : 'Accrued for payout'}
          </div>
        </div>
      </div>

      {/* Referred Pharmacies Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs space-y-3 p-5">
        <h3 className="text-sm font-bold text-slate-900">
          {isAr ? 'سجل الصيدليات المحالة وحالة التوثيق النقابي' : 'Referred Pharmacies & Verification Status'}
        </h3>

        <table className="w-full text-xs text-right rtl:text-right ltr:text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <th className="py-2.5 px-3">{isAr ? 'اسم الصيدلية' : 'Pharmacy'}</th>
              <th className="py-2.5 px-3">{isAr ? 'الصيدلي المدير' : 'Pharmacist'}</th>
              <th className="py-2.5 px-3">{isAr ? 'المحافظة والمنطقة' : 'Governorate'}</th>
              <th className="py-2.5 px-3 font-mono-nums">{isAr ? 'رقم الإجازة' : 'License'}</th>
              <th className="py-2.5 px-3 text-center">{isAr ? 'حالة التوثيق' : 'Status'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(stats?.referredPharmacies || []).map((ph: any) => (
              <tr key={ph.id} className="hover:bg-slate-50/50">
                <td className="py-3 px-3 font-bold text-slate-900">{ph.organizationName}</td>
                <td className="py-3 px-3 text-slate-700">{ph.name}</td>
                <td className="py-3 px-3 text-slate-500">{ph.governorate}</td>
                <td className="py-3 px-3 font-mono-nums text-slate-600">{ph.licenseNumber || '—'}</td>
                <td className="py-3 px-3 text-center">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      ph.status === 'verified'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {ph.status === 'verified' ? (isAr ? 'موثقة ومجازة' : 'Verified') : (isAr ? 'قيد مراجعة النقابة' : 'Pending')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Security & Data Privacy Isolation Banner */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-start gap-3">
        <Lock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-800">
            {isAr ? 'مبدأ حماية الخصوصية وعزل البيانات للمندوب:' : 'Data Privacy & Least-Privilege Isolation:'}
          </span>{' '}
          {isAr
            ? 'وفقاً لقواعد الامتثال الأمني للمنصة، لا يملك المندوب صلاحية الاطلاع على تفاصيل أسعار الشراء الخاصة بين المذاخر والصيدليات، ولا يمكنه الوصول للوثائق المالية أو الفواتير المفصلة لحماية سرية الأعمال التجارية.'
            : 'In compliance with least-privilege security, representatives never have access to private supplier pricing negotiations or confidential financial records.'}
        </div>
      </div>

      {/* Onboard Pharmacy Modal */}
      {isOnboardingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                {isAr ? 'تسجيل صيدلية أهلية جديدة' : 'Onboard New Pharmacy'}
              </h3>
              <button
                onClick={() => setIsOnboardingOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleOnboardPharmacy} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isAr ? 'اسم الصيدلية الأهلية' : 'Pharmacy Name'}
                </label>
                <input
                  type="text"
                  required
                  value={newPharmacyName}
                  onChange={e => setNewPharmacyName(e.target.value)}
                  placeholder={isAr ? 'مثال: صيدلية اليرموك النموذجية' : 'e.g. Al-Yarmouk Pharmacy'}
                  className="w-full text-xs p-2 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isAr ? 'اسم الصيدلي المدير المسؤول' : 'Pharmacist in Charge'}
                </label>
                <input
                  type="text"
                  required
                  value={newPharmacistName}
                  onChange={e => setNewPharmacistName(e.target.value)}
                  placeholder={isAr ? 'د. سارة التميمي' : 'Dr. Sara Al-Tamimi'}
                  className="w-full text-xs p-2 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isAr ? 'المحافظة والمنطقة' : 'Governorate'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newGov}
                    onChange={e => setNewGov(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isAr ? 'رقم هاتف الصيدلية' : 'Phone'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newPhone}
                    onChange={e => setNewPhone(e.target.value)}
                    placeholder="+964 770 123 4567"
                    className="w-full text-xs p-2 border border-slate-300 rounded font-mono-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isAr ? 'رقم إجازة نقابة صيادلة العراق' : 'Syndicate License No.'}
                </label>
                <input
                  type="text"
                  required
                  value={newLicenseNo}
                  onChange={e => setNewLicenseNo(e.target.value)}
                  placeholder="BAG-12345"
                  className="w-full text-xs p-2 border border-slate-300 rounded font-mono-nums"
                />
              </div>

              <div className="p-2.5 bg-slate-50 rounded text-[11px] text-slate-500 font-mono-nums">
                {isAr ? 'كود الإحالة المطبق تلقائياً:' : 'Referral code applied:'} <strong>{repCode}</strong>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOnboardingOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 rounded"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded shadow-xs"
                >
                  {isAr ? 'إرسال للتسجيل' : 'Register Pharmacy'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
