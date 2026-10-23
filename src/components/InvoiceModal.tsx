import React from 'react';
import { SubOrder } from '../types';
import { useApp } from '../context/AppContext';
import { X, Printer, ShieldCheck, FileCheck, CheckCircle2 } from 'lucide-react';

interface InvoiceModalProps {
  suborder: SubOrder;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ suborder, onClose }) => {
  const { language } = useApp();
  const isAr = language === 'ar';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 print:p-0 print:bg-white">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col border border-slate-200 overflow-hidden print:border-none print:shadow-none print:max-w-none print:w-full">
        {/* Top actions (hidden when printing) */}
        <div className="px-6 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between print:hidden">
          <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <FileCheck className="w-4 h-4 text-emerald-600" />
            <span>
              {isAr ? 'قائمة تجهيز أدوية رسمية (نسخة رقمية)' : 'Official Pharmaceutical Supply Invoice'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isAr ? 'طباعة القائمة' : 'Print Invoice'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Sheet */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-white font-sans text-slate-900">
          {/* Header & Logo */}
          <div className="border-b-2 border-slate-800 pb-5">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  {suborder.supplierName}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isAr
                    ? 'مذخر أدوية ومستلزمات طبية مجاز من نقابة صيادلة العراق'
                    : 'Licensed Pharmaceutical Wholesaler & Bureau'}
                </p>
                <p className="text-xs text-slate-500">
                  {isAr ? 'العراق · الكرخ/الرصافة' : 'Iraq Pharma Wholesale Depot'}
                </p>
              </div>

              <div className="text-right rtl:text-left">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {isAr ? 'رقم القائمة' : 'Invoice No.'}
                </div>
                <div className="text-base font-bold text-slate-900 font-mono-nums">
                  {suborder.invoiceNumber || `INV-${suborder.id.slice(-6).toUpperCase()}`}
                </div>
                <div className="text-xs text-slate-500 mt-1 font-mono-nums">
                  {isAr ? 'تاريخ التجهيز:' : 'Date:'}{' '}
                  {new Date(suborder.createdAt).toLocaleDateString('ar-IQ')}
                </div>
              </div>
            </div>
          </div>

          {/* Parties metadata */}
          <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs">
            <div>
              <div className="font-bold text-slate-500 mb-1">
                {isAr ? 'المجهز (المذخر / المكتب):' : 'Supplier Details:'}
              </div>
              <div className="font-bold text-slate-900 text-sm">
                {suborder.supplierName}
              </div>
              <div className="text-slate-600 mt-0.5">
                {isAr ? 'نوع الترخيص: مذخر أدوية معتمد' : 'Type: Licensed Pharmaceutical Wholesaler'}
              </div>
              <div className="text-slate-600 mt-0.5">
                {isAr ? 'إشعار نقابة صيادلة العراق: موثق وساري' : 'Syndicate Status: Verified Active'}
              </div>
            </div>

            <div>
              <div className="font-bold text-slate-500 mb-1">
                {isAr ? 'الجهة المستلمة (الصيدلية):' : 'Receiving Pharmacy:'}
              </div>
              <div className="font-bold text-slate-900 text-sm">
                {suborder.pharmacyName}
              </div>
              <div className="text-slate-600 mt-0.5">
                {isAr ? 'المحافظة:' : 'Location:'} {suborder.pharmacyGov}
              </div>
              <div className="text-slate-600 mt-0.5 font-mono-nums">
                {isAr ? 'هاتف الصيدلي المسؤول:' : 'Contact:'} {suborder.pharmacyPhone}
              </div>
            </div>
          </div>

          {/* Line items table */}
          <div>
            <table className="w-full text-xs text-right rtl:text-right ltr:text-left">
              <thead>
                <tr className="border-b border-slate-300 text-slate-500 font-semibold">
                  <th className="py-2.5 px-2">#</th>
                  <th className="py-2.5 px-2">{isAr ? 'المادة الدوائية والشكل' : 'Product & Form'}</th>
                  <th className="py-2.5 px-2">{isAr ? 'رقم الوجبة' : 'Batch No.'}</th>
                  <th className="py-2.5 px-2">{isAr ? 'تاريخ النفاذ' : 'Expiry'}</th>
                  <th className="py-2.5 px-2 text-center">{isAr ? 'الكمية' : 'Qty'}</th>
                  <th className="py-2.5 px-2 text-left rtl:text-left ltr:text-right">{isAr ? 'سعر المفرد' : 'Unit (IQD)'}</th>
                  <th className="py-2.5 px-2 text-left rtl:text-left ltr:text-right">{isAr ? 'المجموع' : 'Total (IQD)'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {suborder.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-2 text-slate-400 font-mono-nums">{idx + 1}</td>
                    <td className="py-2.5 px-2">
                      <div className="font-bold text-slate-900">{item.productName}</div>
                      <div className="text-[11px] text-slate-500">
                        {item.brand} · {item.dosageForm} ({item.strength})
                      </div>
                    </td>
                    <td className="py-2.5 px-2 font-mono-nums text-slate-700">{item.batchNumber}</td>
                    <td className="py-2.5 px-2 font-mono-nums text-slate-700">{item.expiryDate}</td>
                    <td className="py-2.5 px-2 text-center font-bold font-mono-nums text-slate-900">{item.quantity}</td>
                    <td className="py-2.5 px-2 text-left rtl:text-left ltr:text-right font-mono-nums">
                      {item.unitPriceIQD.toLocaleString()} د.ع
                    </td>
                    <td className="py-2.5 px-2 text-left rtl:text-left ltr:text-right font-bold text-slate-900 font-mono-nums">
                      {item.totalPriceIQD.toLocaleString()} د.ع
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Subtotal & Stamp */}
          <div className="border-t-2 border-slate-800 pt-4 flex flex-col md:flex-row justify-between gap-6">
            <div className="space-y-2 text-xs text-slate-600 max-w-sm">
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{isAr ? 'شروط الرقابة الدوائية وسلسلة التبريد:' : 'Cold Chain & Inspection:'}</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500">
                {isAr
                  ? 'تم نقل هذه الوجبة في درجات حرارة خاضعة للمعايرة (15-25 مئوية أو 2-8 للأنسولين والبيولوجيات) بموجب شروط نقابة صيادلة العراق. يُسدد المبلغ مباشرة للمذخر.'
                  : 'Handled in calibrated cold-chain fleet per Iraqi Syndicate requirements. Payment is directly remitted to the supplier.'}
              </p>
              <div className="mt-4 pt-2 border-t border-dashed border-slate-300">
                <div className="text-[10px] text-slate-400">
                  {isAr ? 'توقيع وختم الصيدلي المستلم:' : 'Pharmacist Signature & Stamp:'}
                </div>
                <div className="h-10 border-b border-slate-300 mt-2" />
              </div>
            </div>

            <div className="w-64 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs space-y-2 shrink-0">
              <div className="flex justify-between text-slate-600">
                <span>{isAr ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                <span className="font-mono-nums font-semibold">
                  {suborder.subtotalIQD.toLocaleString()} د.ع
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>{isAr ? 'أجور النقل والتبريد:' : 'Cold-Chain Delivery:'}</span>
                <span className="text-emerald-700 font-semibold">{isAr ? 'مجاني للمنصة' : 'Included'}</span>
              </div>
              <div className="border-t border-slate-300 pt-2 flex justify-between text-sm font-bold text-slate-900">
                <span>{isAr ? 'صافي القائمة المطلوب:' : 'Total Amount Due:'}</span>
                <span className="font-mono-nums text-emerald-800 font-extrabold">
                  {suborder.subtotalIQD.toLocaleString()} د.ع
                </span>
              </div>
              <div className="text-[10px] text-slate-400 text-center pt-1">
                {isAr ? 'السداد مباشر للمذخر المجهز' : 'Direct payment to supplier'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
