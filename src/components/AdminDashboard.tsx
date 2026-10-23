import React, { useState, useEffect } from 'react';
import { FinancialMetrics, VerificationDocument, AuditLog, Dispute } from '../types';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileText,
  DollarSign,
  TrendingUp,
  Settings,
  Lock,
  RotateCcw,
  AlertTriangle,
  Scale,
  Building,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { language, currentUser, showToast, activeTab, refreshUserData } = useApp();
  const isAr = language === 'ar';

  const [metrics, setMetrics] = useState<FinancialMetrics | null>(null);
  const [documents, setDocuments] = useState<VerificationDocument[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [disputes, setDisputes] = useState<Dispute[]>([]);

  // Configurable Commission rates
  const [platformCommissionRate, setPlatformCommissionRate] = useState<number>(2.5);
  const [repCommissionRate, setRepCommissionRate] = useState<number>(0.8);

  const fetchData = async () => {
    try {
      // Financials
      const resFin = await fetch('/api/financials');
      const dataFin = await resFin.json();
      setMetrics(dataFin.metrics);

      // Verifications
      const resDocs = await fetch('/api/verifications');
      const dataDocs = await resDocs.json();
      setDocuments(dataDocs.documents || []);

      // Audit logs
      const resLogs = await fetch('/api/audit-logs');
      const dataLogs = await resLogs.json();
      setAuditLogs(dataLogs.logs || []);

      // Disputes
      const resDisp = await fetch('/api/disputes');
      const dataDisp = await resDisp.json();
      setDisputes(dataDisp.disputes || []);

      // Settings
      const resSet = await fetch('/api/settings');
      const dataSet = await resSet.json();
      if (dataSet.settings) {
        setPlatformCommissionRate(dataSet.settings.defaultPlatformCommissionPercent);
        setRepCommissionRate(dataSet.settings.defaultRepCommissionPercent);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleReviewDoc = async (docId: string, status: 'verified' | 'rejected', reason?: string) => {
    try {
      const res = await fetch(`/api/verifications/${docId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, rejectionReason: reason }),
      });
      if (!res.ok) throw new Error('Failed to review document');
      showToast(
        isAr
          ? `تم تحديث حالة وثيقة الترخيص إلى: ${status === 'verified' ? 'معتمد وموثق' : 'مرفوض'}`
          : `Document status updated to ${status}`
      );
      fetchData();
      refreshUserData();
    } catch (err: any) {
      alert(err.message || 'خطأ أثناء تدقيق الوثيقة');
    }
  };

  const handleSaveCommissionRules = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          defaultPlatformCommissionPercent: platformCommissionRate,
          defaultRepCommissionPercent: repCommissionRate,
        }),
      });
      if (!res.ok) throw new Error('Failed to update settings');
      showToast(isAr ? 'تم حفظ وتعميم نسب العمولات الجديدة' : 'Commission rules saved');
      fetchData();
    } catch (err: any) {
      alert(err.message || 'خطأ أثناء الحفظ');
    }
  };

  const handleResetData = async () => {
    if (confirm(isAr ? 'هل تريد استعادة البيانات الافتراضية الأولية؟' : 'Reset database to initial demo seed?')) {
      await fetch('/api/reset', { method: 'POST' });
      showToast(isAr ? 'تمت استعادة البيانات الافتراضية' : 'Data reset to demo defaults');
      fetchData();
      refreshUserData();
    }
  };

  return (
    <div className="space-y-8">
      {/* Admin Title & Legal Disclaimers */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-xs font-semibold rounded mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{isAr ? 'لوحة القيادة الرقابية والمالية' : 'Executive Governance Console'}</span>
          </div>
          <h1 className="text-xl font-bold">
            {isAr ? 'إدارة منصة سوق الدواء العراقي B2B والرقابة الدوائية' : 'Iraqi Pharma B2B Administration'}
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            {isAr
              ? 'تدقيق تراخيص نقابة صيادلة العراق، مراقبة إيرادات المنصة مقارنة بمبيعات المذاخر، ضبط العمولات، وسجل الأمان الرقابي.'
              : 'Syndicate license compliance, marketplace financial transparency, commission governance, and immutable audit logs.'}
          </p>
        </div>

        <button
          onClick={handleResetData}
          className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg flex items-center gap-1.5 shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{isAr ? 'إعادة ضبط البيانات التجريبية' : 'Reset Demo Data'}</span>
        </button>
      </div>

      {/* Tab 1: Financial & GMV Analytics */}
      {activeTab === 'admin_overview' && metrics && (
        <div className="space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {isAr ? 'التقرير المالي وحجم التداول التجاري (GMV vs. Platform Revenue)' : 'Financial Ledger & GMV Breakdown'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isAr
                ? 'الفصل المحاسبي الدقيق بين إجمالي مبيعات الأدوية للمذاخر وصافي إيرادات عمولات المنصة'
                : 'Clear accounting distinction between supplier gross merchandise sales and net marketplace fee'}
            </p>
          </div>

          {/* Metric KPI cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1">
              <div className="text-[11px] text-slate-400 font-medium">
                {isAr ? 'إجمالي قيمة التداول (GMV)' : 'Gross Merchandise Value'}
              </div>
              <div className="text-xl font-bold text-slate-900 font-mono-nums">
                {metrics.gmvIQD.toLocaleString()} د.ع
              </div>
              <div className="text-[10px] text-slate-500">
                {metrics.totalOrdersCount} {isAr ? 'إجمالي الطلبيات المقدمة' : 'total orders'}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1">
              <div className="text-[11px] text-slate-400 font-medium">
                {isAr ? 'المبيعات المكتملة والمستلمة' : 'Completed Sales Volume'}
              </div>
              <div className="text-xl font-bold text-slate-900 font-mono-nums">
                {metrics.completedSalesIQD.toLocaleString()} د.ع
              </div>
              <div className="text-[10px] text-emerald-700 font-semibold">
                {metrics.completedOrdersCount} {isAr ? 'طلبيات مستلمة بنجاح' : 'completed deliveries'}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1">
              <div className="text-[11px] text-slate-400 font-medium">
                {isAr ? 'إجمالي عمولة المنصة (2.5%)' : 'Platform Gross Commission'}
              </div>
              <div className="text-xl font-bold text-amber-700 font-mono-nums">
                {metrics.platformGrossCommissionIQD.toLocaleString()} د.ع
              </div>
              <div className="text-[10px] text-slate-500">
                {isAr ? 'تحتسب فقط على المكتمل' : 'Only on completed'}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1">
              <div className="text-[11px] text-slate-400 font-medium">
                {isAr ? 'صافي نتيجة التشغيل للمنصة' : 'Net Operating Result'}
              </div>
              <div className={`text-xl font-bold font-mono-nums ${metrics.netOperatingResultIQD >= 0 ? 'text-emerald-700' : 'text-slate-800'}`}>
                {metrics.netOperatingResultIQD.toLocaleString()} د.ع
              </div>
              <div className="text-[10px] text-slate-500">
                {isAr ? 'بعد خصم المناديب والمصاريف' : 'After reps & costs'}
              </div>
            </div>
          </div>

          {/* Revenue Model Breakdown Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              {isAr ? 'بيان التسوية المالية للمنصة والمذاخر (Accounting Reconciliation)' : 'Platform vs. Supplier Financial Reconciliation'}
            </h3>

            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-600 font-medium">
                  {isAr ? '(+) إجمالي المبيعات المكتملة للأدوية (مستحقات المذاخر الإجمالية):' : '(+) Completed Medicine Sales (Suppliers Gross):'}
                </span>
                <span className="font-mono-nums font-bold text-slate-900">
                  {metrics.completedSalesIQD.toLocaleString()} د.ع
                </span>
              </div>

              <div className="py-2.5 flex justify-between">
                <span className="text-slate-600 font-medium">
                  {isAr ? '(+) عمولة المنصة المستحقة على المبيعات المكتملة (2.5%):' : '(+) Marketplace Commission (2.5%):'}
                </span>
                <span className="font-mono-nums font-bold text-amber-700">
                  {metrics.platformGrossCommissionIQD.toLocaleString()} د.ع
                </span>
              </div>

              <div className="py-2.5 flex justify-between">
                <span className="text-slate-600 font-medium">
                  {isAr ? '(-) عمولات المناديب العلميين المحالة (0.8%):' : '(-) Sales Rep Referral Payouts (0.8%):'}
                </span>
                <span className="font-mono-nums font-bold text-red-600">
                  - {metrics.repCommissionsPaidIQD.toLocaleString()} د.ع
                </span>
              </div>

              <div className="py-2.5 flex justify-between">
                <span className="text-slate-600 font-medium">
                  {isAr ? '(-) مصاريف التشغيل وخوادم التحقق والرسائل:' : '(-) Operating & Verification Overhead:'}
                </span>
                <span className="font-mono-nums font-bold text-red-600">
                  - {metrics.operatingExpensesIQD.toLocaleString()} د.ع
                </span>
              </div>

              <div className="py-3 flex justify-between text-sm font-bold border-t-2 border-slate-900">
                <span className="text-slate-900">
                  {isAr ? '(=) صافي دخل المنصة التشغيلي (Net Operating Income):' : '(=) Net Marketplace Operating Income:'}
                </span>
                <span className="font-mono-nums text-emerald-800">
                  {metrics.netOperatingResultIQD.toLocaleString()} د.ع
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: License Verifications Queue */}
      {activeTab === 'admin_verifications' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {isAr ? 'قائمة تدقيق واعتماد تراخيص نقابة صيادلة العراق' : 'Syndicate License Verification Queue'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isAr
                ? 'مراجعة طلبات الانضمام والتحقق من صحة إجازات ممارسة المهنة للصيدليات والمذاخر'
                : 'Review submissions and verify validity of Syndicate practice permits'}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-xs text-right rtl:text-right ltr:text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="py-3 px-4">{isAr ? 'المؤسسة الصيدلانية' : 'Organization'}</th>
                  <th className="py-3 px-4">{isAr ? 'نوع الكيان' : 'Role'}</th>
                  <th className="py-3 px-4">{isAr ? 'نوع الوثيقة والجهة المصدرة' : 'Document & Issuer'}</th>
                  <th className="py-3 px-4 font-mono-nums">{isAr ? 'رقم الإجازة' : 'Doc No.'}</th>
                  <th className="py-3 px-4 font-mono-nums">{isAr ? 'تاريخ النفاذ' : 'Expiry'}</th>
                  <th className="py-3 px-4 text-center">{isAr ? 'الحالة' : 'Status'}</th>
                  <th className="py-3 px-4 text-center">{isAr ? 'قرار التدقيق' : 'Review Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documents.map(doc => (
                  <tr key={doc.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-slate-900">{doc.organizationName}</td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {doc.role === 'pharmacy' ? (isAr ? 'صيدلية أهلية' : 'Pharmacy') : (isAr ? 'مذخر أدوية' : 'Wholesaler')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div>{doc.documentType === 'syndicate_license' ? (isAr ? 'إجازة نقابة الصيادلة' : 'Syndicate License') : doc.documentType}</div>
                      <div className="text-[10px] text-slate-400">{doc.issuer}</div>
                    </td>
                    <td className="py-3 px-4 font-mono-nums font-semibold text-slate-800">{doc.documentNumber}</td>
                    <td className="py-3 px-4 font-mono-nums text-slate-600">{doc.expiryDate}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          doc.status === 'verified'
                            ? 'bg-emerald-100 text-emerald-800'
                            : doc.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {doc.status === 'verified' ? (isAr ? 'معتمد وموثق' : 'Verified') : doc.status === 'rejected' ? (isAr ? 'مرفوض' : 'Rejected') : (isAr ? 'قيد المراجعة' : 'Pending')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {doc.status === 'pending' ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleReviewDoc(doc.id, 'verified')}
                            className="px-2.5 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{isAr ? 'اعتماد' : 'Approve'}</span>
                          </button>
                          <button
                            onClick={() => {
                              const reason = prompt(isAr ? 'سبب الرفض:' : 'Rejection Reason:') || 'الوثيقة غير واضحة أو منتهية الصلاحية';
                              handleReviewDoc(doc.id, 'rejected', reason);
                            }}
                            className="px-2.5 py-1 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded flex items-center gap-1"
                          >
                            <XCircle className="w-3 h-3" />
                            <span>{isAr ? 'رفض' : 'Reject'}</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-mono-nums">
                          {doc.verifiedAt ? new Date(doc.verifiedAt).toLocaleDateString('ar-IQ') : '—'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Commission Rules Configurator */}
      {activeTab === 'admin_rules' && (
        <div className="max-w-2xl bg-white rounded-xl border border-slate-200 p-6 space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {isAr ? 'تهيئة وضبط قواعد العمولات والإحالات' : 'Commission Rules Configurator'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isAr
                ? 'تخصيص نسب عمولة المنصة والمندوبين وفق العقود المبرمة مع المكاتب العلمية والمذاخر'
                : 'Configure platform take rate and representative attribution fees'}
            </p>
          </div>

          <form onSubmit={handleSaveCommissionRules} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isAr ? 'نسبة عمولة المنصة الافتراضية على المبيعات المكتملة (%)' : 'Default Platform Commission Rate (%)'}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step={0.1}
                  min={0.5}
                  max={10.0}
                  value={platformCommissionRate}
                  onChange={e => setPlatformCommissionRate(parseFloat(e.target.value) || 2.5)}
                  className="w-32 text-xs p-2 border border-slate-300 rounded font-mono-nums"
                />
                <span className="text-xs text-slate-500 font-semibold">%</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {isAr
                  ? 'تُستقطع النسبة فقط بعد تسليم الطلبية وإصدار الفاتورة وتوقيع استلام الصيدلية.'
                  : 'Calculated strictly on eligible completed sales after pharmacy confirmation.'}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isAr ? 'نسبة عمولة المندوب العلمي والتجاري (%)' : 'Sales Representative Commission Rate (%)'}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step={0.1}
                  min={0.1}
                  max={5.0}
                  value={repCommissionRate}
                  onChange={e => setRepCommissionRate(parseFloat(e.target.value) || 0.8)}
                  className="w-32 text-xs p-2 border border-slate-300 rounded font-mono-nums"
                />
                <span className="text-xs text-slate-500 font-semibold">%</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {isAr
                  ? 'تُحتسب للمندوب الذي قام بتسجيل الصيدلية عبر كود الإحالة الخاص به.'
                  : 'Attributed to the verified representative whose referral code onboarded the pharmacy.'}
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs"
              >
                {isAr ? 'حفظ وتطبيق القواعد' : 'Save Rules'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 4: Security & Operational Audit Log */}
      {activeTab === 'admin_audit' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {isAr ? 'سجل الرقابة والتتبع الأمني غير القابل للتعديل (Audit Trail)' : 'Security & Operational Audit Log'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isAr
                ? 'توثيق تاريخي زمني فوري لكافة الإجراءات الحساسة: تغيير الأسعار، اعتماد التراخيص، وتقسيم الطلبيات'
                : 'Immutable chronological trace of sensitive events: price changes, verifications, and order splits'}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-xs text-right rtl:text-right ltr:text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="py-2.5 px-3 font-mono-nums">{isAr ? 'التاريخ والوقت' : 'Timestamp'}</th>
                  <th className="py-2.5 px-3">{isAr ? 'المنفذ' : 'Actor'}</th>
                  <th className="py-2.5 px-3">{isAr ? 'الدور' : 'Role'}</th>
                  <th className="py-2.5 px-3">{isAr ? 'نوع الإجراء' : 'Action Type'}</th>
                  <th className="py-2.5 px-3">{isAr ? 'التفاصيل والمعلومات الرقابية' : 'Details'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-mono-nums text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString('ar-IQ')}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{log.actorName}</td>
                    <td className="py-2.5 px-3">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                        {log.actorRole}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono-nums font-semibold text-emerald-800">
                      {log.action}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 max-w-md">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Controlled Substances & Iraqi Law Guard Banner */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-3">
        <Scale className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">
            {isAr ? 'الامتثال الصارم لقانون مزاولة مهنة الصيدلة العراقي:' : 'Iraqi Pharmaceutical Compliance Guard:'}
          </span>{' '}
          {isAr
            ? 'تلتزم المنصة بتعليمات وزارة الصحة ونقابة صيادلة العراق. يحظر تماماً تداول المؤثرات العقلية أو الأدوية الخاضعة للرقابة الخاصة (Schedule/Narcotic drugs) عبر التداول الرقمي المفتوح دون تصريح رسمي وموافقة التفتيش المختص.'
            : 'Controlled medications and narcotics are prohibited from open digital B2B checkout without physical Syndicate triplicate prescriptions.'}
        </div>
      </div>
    </div>
  );
};
