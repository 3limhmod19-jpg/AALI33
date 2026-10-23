import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Trash2,
  Building2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Truck,
  FileSpreadsheet,
} from 'lucide-react';

export const CartDrawer: React.FC<{ onOrderPlaced?: (orderId: string) => void }> = ({ onOrderPlaced }) => {
  const {
    language,
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartTotalIQD,
    cartSuppliersCount,
    currentUser,
    showToast,
    setActiveTab,
  } = useApp();

  const isAr = language === 'ar';
  const [deliveryAddress, setDeliveryAddress] = useState(currentUser?.governorate || 'بغداد - المنصور');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCartOpen) return null;

  // Group items by supplier
  const supplierGroups = cart.reduce((acc, item) => {
    if (!acc[item.supplierId]) {
      acc[item.supplierId] = {
        supplierId: item.supplierId,
        supplierName: item.supplierName,
        supplierGov: item.supplierGov,
        items: [],
        subtotal: 0,
      };
    }
    acc[item.supplierId].items.push(item);
    acc[item.supplierId].subtotal += item.unitPriceIQD * item.quantity;
    return acc;
  }, {} as Record<string, { supplierId: string; supplierName: string; supplierGov: string; items: typeof cart; subtotal: number }>);

  const groupsArray = Object.values(supplierGroups);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);

    try {
      const payload = {
        deliveryAddress,
        items: cart.map(i => ({
          offerId: i.offerId,
          quantity: i.quantity,
        })),
      };

      const res = await fetch('/api/cart/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit order');
      }

      clearCart();
      setIsCartOpen(false);
      showToast(
        isAr
          ? `تم إرسال الطلب بنجاح #${data.order.orderNumber} وتقسيمه إلى ${data.order.suborders.length} طلبية تجهيز منفصلة`
          : `Order submitted successfully #${data.order.orderNumber} and split into ${data.order.suborders.length} suborders`
      );

      setActiveTab('pharmacy_orders');
      if (onOrderPlaced) {
        onOrderPlaced(data.order.id);
      }
    } catch (err: any) {
      alert(err.message || 'حدث خطأ أثناء إرسال الطلبية');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-sm">
      <div className="absolute inset-y-0 right-0 max-w-full flex rtl:right-auto rtl:left-0">
        <div className="w-screen max-w-xl bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {isAr ? 'سلة الطلبيات المركزية' : 'Central Order Cart'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isAr
                  ? `تحتوي على منتجات من ${cartSuppliersCount} مذاخر / مكاتب علمية منفصلة`
                  : `Contains items from ${cartSuppliersCount} distinct verified suppliers`}
              </p>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <FileSpreadsheet className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-slate-700">
                  {isAr ? 'السلة فارغة' : 'Your cart is empty'}
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  {isAr
                    ? 'تصفح دليل الأدوية وقارن عروض المذاخر لإضافة المنتجات'
                    : 'Browse medicine catalog and compare supplier offers to add items'}
                </p>
              </div>
            ) : (
              <>
                {/* Notice on Split Order Mechanism */}
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-start gap-2.5">
                  <Truck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">
                      {isAr ? 'آلية التقسيم التلقائي للطلبيات:' : 'Automated Order Splitting:'}
                    </span>{' '}
                    {isAr
                      ? 'سيتم تقسيم سلتك آلياً إلى طلبيات تجهيز فرعية مستقلة لكل مذخر. يصدر كل مذخر فاتورته الرسمية وقائمة التجهيز الخاصة به.'
                      : 'Your cart will be automatically split into individual suborders per supplier. Each wholesaler generates an official separate invoice.'}
                  </div>
                </div>

                {/* Supplier Groups */}
                {groupsArray.map((group, idx) => (
                  <div key={group.supplierId} className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50/50">
                    <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-slate-600" />
                        <span className="text-xs font-bold text-slate-800">
                          {group.supplierName}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          ({group.supplierGov})
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-600">
                        {isAr ? `طلبية فرعية ${idx + 1}` : `Suborder ${idx + 1}`}
                      </span>
                    </div>

                    <div className="divide-y divide-slate-100 bg-white">
                      {group.items.map(item => (
                        <div key={item.offerId} className="p-4 flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 truncate">
                              {item.productName}
                            </h4>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              {item.brand} · {item.dosageForm} · {item.strength}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5 font-mono-nums">
                              {isAr ? 'الوجبة:' : 'Batch:'} {item.batchNumber} · {isAr ? 'الانتهاء:' : 'Exp:'} {item.expiryDate}
                            </div>
                            <div className="text-xs font-bold text-emerald-700 mt-1 font-mono-nums">
                              {item.unitPriceIQD.toLocaleString()} د.ع / {isAr ? 'علبة' : 'pack'}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            {/* Quantity controls */}
                            <div className="flex items-center border border-slate-200 rounded-md overflow-hidden">
                              <button
                                onClick={() => updateCartQuantity(item.offerId, item.quantity - 1)}
                                className="px-2 py-1 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700"
                              >
                                -
                              </button>
                              <span className="px-2.5 py-1 text-xs font-mono-nums font-semibold text-slate-900">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateCartQuantity(item.offerId, item.quantity + 1)}
                                className="px-2 py-1 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700"
                              >
                                +
                              </button>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.offerId)}
                              className="p-1.5 text-slate-400 hover:text-red-600 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
                      <span className="text-slate-500">
                        {isAr ? 'إجمالي هذه الطلبية الفرعية:' : 'Suborder Subtotal:'}
                      </span>
                      <span className="font-bold text-slate-900 font-mono-nums">
                        {group.subtotal.toLocaleString()} د.ع
                      </span>
                    </div>
                  </div>
                ))}

                {/* Delivery Information */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    {isAr ? 'عنوان استلام الصيدلية ونقطة التفريغ:' : 'Pharmacy Delivery Address:'}
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={e => setDeliveryAddress(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    placeholder={isAr ? 'المحافظة - القضاء - الشارع - علامة مميزة' : 'Governorate, District, Street'}
                  />
                  <p className="text-[11px] text-slate-500">
                    {isAr
                      ? 'يتم تسليم الأدوية في شاحنات مبردة مطابقة لتعليمات نقابة صيادلة العراق مع فحص درجة الحرارة عند الاستلام.'
                      : 'Medicines are transported in compliant temperature-controlled couriers with temperature verification at handover.'}
                  </p>
                </div>

                {/* Commercial Intermediary & Payment Disclaimer */}
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900 leading-relaxed">
                  <span className="font-bold">{isAr ? 'إشعار الدفع والفوترة القانوني:' : 'Payment & Invoice Policy:'}</span>{' '}
                  {isAr
                    ? 'المنصة وسيط إلكتروني ولا تستلم أموال الأدوية في حساب خاص. يتم سداد المبالغ مباشرة إلى المذاخر المجهزة بموجب فواتيرهم الرسمية عند الاستلام أو حسب التسهيلات الائتمانية المتفق عليها.'
                    : 'The platform acts as a digital intermediary and does not collect medicine funds into personal escrow. Payments are settled directly with suppliers upon receipt or per agreed commercial credit.'}
                </div>
              </>
            )}
          </div>

          {/* Footer with grand total and Split Submit */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-slate-200 bg-white space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500">
                    {isAr ? 'المجموع الكلي لكافة المذاخر' : 'Grand Total Across All Suppliers'}
                  </div>
                  <div className="text-xl font-extrabold text-slate-900 font-mono-nums">
                    {cartTotalIQD.toLocaleString()} د.ع
                  </div>
                </div>
                <div className="text-right rtl:text-left text-xs text-slate-500">
                  <div>{groupsArray.length} {isAr ? 'طلبيات تجهيز منفصلة' : 'distinct suborders'}</div>
                  <div className="text-[11px] text-emerald-600 font-medium">
                    {isAr ? 'شحن مبرد معتمد' : 'Verified Cold-Chain'}
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors text-sm"
              >
                {isSubmitting ? (
                  <span>{isAr ? 'جاري تقسيم وإرسال الطلبيات...' : 'Splitting and sending...'}</span>
                ) : (
                  <>
                    <span>
                      {isAr ? `تأكيد وإرسال الطلبيات (${groupsArray.length} مذاخر)` : `Confirm & Split Order (${groupsArray.length} Suppliers)`}
                    </span>
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
