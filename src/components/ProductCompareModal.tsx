import React, { useState } from 'react';
import { Product, SupplierOffer } from '../types';
import { useApp } from '../context/AppContext';
import {
  X,
  Building2,
  Clock,
  ShieldCheck,
  Check,
  Package,
  Layers,
  Calendar,
  AlertCircle,
  Truck,
} from 'lucide-react';

interface ProductCompareModalProps {
  product: Product;
  onClose: () => void;
}

export const ProductCompareModal: React.FC<ProductCompareModalProps> = ({ product, onClose }) => {
  const { language, addToCart } = useApp();
  const isAr = language === 'ar';

  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});

  const offers = (product as any).offers as SupplierOffer[] || [];

  const handleQtyChange = (offerId: string, minQty: number, maxQty: number, val: number) => {
    const qty = Math.max(minQty, Math.min(val, maxQty));
    setQuantities(prev => ({ ...prev, [offerId]: qty }));
  };

  const handleAdd = (offer: SupplierOffer) => {
    const qty = quantities[offer.id] || offer.minOrderQty;
    addToCart(offer, product, qty);
    setAddedMap(prev => ({ ...prev, [offer.id]: true }));
    setTimeout(() => {
      setAddedMap(prev => ({ ...prev, [offer.id]: false }));
    }, 2000);
  };

  // Find lowest price
  const lowestPrice = offers.length > 0 ? Math.min(...offers.map(o => o.priceIQD)) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded">
                {product.category}
              </span>
              <span className="text-xs text-slate-500 font-mono-nums">
                كود: {product.barcode}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              {product.nameEn}
            </h2>
            <div className="text-sm text-slate-600 font-medium">
              {product.nameAr} · {product.manufacturer}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {isAr ? 'المادة الفعالة:' : 'Active Ingredient:'}{' '}
              <span className="font-semibold text-slate-700">{product.activeIngredient}</span> ·{' '}
              {isAr ? 'الشكل والتركيز:' : 'Form & Strength:'}{' '}
              <span className="font-semibold text-slate-700">{product.dosageForm} ({product.strength})</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Offers comparison list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
            <span>
              {isAr
                ? `العروض المتوفرة من المذاخر والمكاتب العلمية المعتمدة (${offers.length})`
                : `Available Offers from Verified Suppliers (${offers.length})`}
            </span>
            <span>
              {isAr ? 'الأسعار بالدينار العراقي (د.ع)' : 'Prices in Iraqi Dinars (IQD)'}
            </span>
          </div>

          {offers.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              {isAr ? 'لا توجد عروض حالية لهذا المنتج' : 'No active offers available for this product'}
            </div>
          ) : (
            <div className="space-y-3">
              {offers.map(offer => {
                const isBestPrice = offer.priceIQD === lowestPrice;
                const currentQty = quantities[offer.id] || offer.minOrderQty;
                const isAdded = addedMap[offer.id];

                return (
                  <div
                    key={offer.id}
                    className={`border rounded-lg p-4 transition-all ${
                      isBestPrice
                        ? 'border-emerald-300 bg-emerald-50/20 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Supplier Metadata */}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-slate-700" />
                          <span className="text-sm font-bold text-slate-900">
                            {offer.supplierName}
                          </span>
                          {offer.isVerifiedSupplier && (
                            <span className="text-[10px] text-emerald-700 flex items-center gap-0.5 font-medium bg-emerald-50 px-1.5 py-0.5 rounded">
                              <ShieldCheck className="w-3 h-3" />
                              {isAr ? 'مذخر مرخص' : 'Verified'}
                            </span>
                          )}
                          {isBestPrice && (
                            <span className="text-[10px] text-emerald-900 font-bold bg-emerald-200 px-2 py-0.5 rounded">
                              {isAr ? 'أقل سعر متاح' : 'Best Price'}
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span>{offer.supplierGov}</span>
                          <span>·</span>
                          <span className="flex items-center gap-1 font-mono-nums">
                            <Clock className="w-3 h-3" />
                            {isAr ? `تجهيز خلال ${offer.leadTimeHours} ساعة` : `${offer.leadTimeHours}h Delivery`}
                          </span>
                          <span>·</span>
                          <span className="font-mono-nums">
                            {isAr ? 'الوجبة:' : 'Batch:'} {offer.batchNumber}
                          </span>
                          <span>·</span>
                          <span className="font-mono-nums">
                            {isAr ? 'الصلاحية:' : 'Exp:'} {offer.expiryDate}
                          </span>
                        </div>

                        {offer.discountNotes && (
                          <div className="text-[11px] text-emerald-700 font-medium">
                            💡 {offer.discountNotes}
                          </div>
                        )}
                      </div>

                      {/* Pricing and Action */}
                      <div className="flex flex-wrap items-center gap-4 shrink-0 justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0">
                        <div className="text-left rtl:text-right">
                          <div className="text-xs text-slate-400">
                            {isAr ? 'سعر العلبة' : 'Unit Price'}
                          </div>
                          <div className="text-lg font-extrabold text-slate-900 font-mono-nums">
                            {offer.priceIQD.toLocaleString()} د.ع
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono-nums">
                            {isAr ? `الحد الأدنى: ${offer.minOrderQty} علبة` : `MOQ: ${offer.minOrderQty}`}
                          </div>
                        </div>

                        {/* Quantity input & Add */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center border border-slate-300 rounded-md overflow-hidden bg-white">
                            <button
                              onClick={() => handleQtyChange(offer.id, offer.minOrderQty, offer.stockQuantity, currentQty - 5)}
                              className="px-2 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min={offer.minOrderQty}
                              max={offer.stockQuantity}
                              value={currentQty}
                              onChange={e => handleQtyChange(offer.id, offer.minOrderQty, offer.stockQuantity, parseInt(e.target.value) || offer.minOrderQty)}
                              className="w-14 text-center text-xs font-mono-nums font-semibold focus:outline-none"
                            />
                            <button
                              onClick={() => handleQtyChange(offer.id, offer.minOrderQty, offer.stockQuantity, currentQty + 5)}
                              className="px-2 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => handleAdd(offer)}
                            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                              isAdded
                                ? 'bg-emerald-700 text-white'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                            }`}
                          >
                            {isAdded ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>{isAr ? 'أُضيفت' : 'Added'}</span>
                              </>
                            ) : (
                              <span>{isAr ? 'إضافة للسلة' : 'Add to Cart'}</span>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-emerald-600" />
            <span>
              {isAr
                ? 'النقل والتوصيل يتم وفق ضوابط سلسلة التبريد لوزارة الصحة ونقابة صيادلة العراق'
                : 'Cold-chain transport conforms to Iraqi Ministry of Health logistics guidelines'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-medium"
          >
            {isAr ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
