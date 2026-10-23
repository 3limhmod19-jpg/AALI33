export type UserRole = 'pharmacy' | 'supplier' | 'rep' | 'admin';

export type AccountStatus = 'verified' | 'pending_verification' | 'rejected' | 'suspended';

export type SupplierType = 'wholesaler' | 'scientific_office' | 'pharma_company' | 'authorized_distributor';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  phone: string;
  governorate: string; // Baghdad, Erbil, Basra, etc.
  status: AccountStatus;
  licenseNumber?: string;
  organizationName: string;
  legalEntityName?: string;
  supplierType?: SupplierType;
  commercialRegister?: string;
  managerName?: string;
  managerPhone?: string;
  addressDetails?: string;
  referralCodeUsed?: string;
  repCode?: string; // For sales reps
  avatar?: string;
  createdAt: string;
}

export interface VerificationDocument {
  id: string;
  userId: string;
  organizationName: string;
  role: UserRole;
  documentType: 'syndicate_license' | 'moh_permit' | 'chamber_of_commerce' | 'pharmacist_id';
  documentNumber: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  status: 'verified' | 'pending' | 'rejected';
  rejectionReason?: string;
  verifiedAt?: string;
  verifiedBy?: string;
}

export interface Product {
  id: string;
  nameEn: string;
  nameAr: string;
  brand: string;
  activeIngredient: string;
  manufacturer: string;
  countryOfOrigin: string;
  dosageForm: string; // Tablets, Capsules, Syrup, Ampoules, Suspension, IV Solution, Inhaler, Cream
  strength: string; // 500mg, 1g, 100ml, 250mg/5ml
  packageSize: string; // 30 Tablets, 1 Vial, 100ml Bottle
  barcode: string;
  category: string; // Antibiotics, Cardiology, Gastro, Respiratory, Analgesics, Diabetes, Pediatrics, Dermatology
  isControlled: boolean; // Flag for restricted Iraqi law
  fictionalDemoNote: string;
  minPriceIQD?: number;
  offersCount?: number;
  createdSupplierId?: string; // ID of the supplier/office who created this product
  approvalStatus?: 'approved' | 'pending_review' | 'rejected';
  imageUrl?: string;
}

export interface SupplierOffer {
  id: string;
  productId: string;
  supplierId: string;
  supplierName: string;
  supplierGov: string;
  priceIQD: number;
  stockQuantity: number;
  minOrderQty: number;
  batchNumber: string;
  productionDate?: string;
  expiryDate: string;
  leadTimeHours: number;
  discountNotes?: string;
  isVerifiedSupplier: boolean;
  status?: 'active' | 'paused' | 'pending_review';
  isColdChain?: boolean;
  coaDocumentRef?: string;
  updatedAt: string;
}

export interface CartItem {
  offerId: string;
  productId: string;
  productName: string;
  brand: string;
  activeIngredient: string;
  dosageForm: string;
  strength: string;
  packageSize: string;
  supplierId: string;
  supplierName: string;
  supplierGov: string;
  unitPriceIQD: number;
  quantity: number;
  minOrderQty: number;
  stockQuantity: number;
  batchNumber: string;
  expiryDate: string;
}

export type SubOrderStatus = 
  | 'pending_supplier_review'
  | 'supplier_modified'
  | 'confirmed'
  | 'dispatched'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  brand: string;
  activeIngredient: string;
  dosageForm: string;
  strength: string;
  packageSize: string;
  quantity: number;
  originalQuantity?: number;
  unitPriceIQD: number;
  originalUnitPriceIQD?: number;
  totalPriceIQD: number;
  batchNumber: string;
  expiryDate: string;
  isModified?: boolean;
}

export interface ModificationProposal {
  proposedAt: string;
  reason: string;
  originalSubtotalIQD: number;
  newSubtotalIQD: number;
  pharmacyDecision?: 'pending' | 'accepted' | 'rejected';
  decidedAt?: string;
  notes?: string;
}

export interface SubOrder {
  id: string;
  masterOrderId: string;
  suborderNumber: string;
  supplierId: string;
  supplierName: string;
  pharmacyId: string;
  pharmacyName: string;
  pharmacyPhone: string;
  pharmacyGov: string;
  items: OrderItem[];
  subtotalIQD: number;
  status: SubOrderStatus;
  modificationProposal?: ModificationProposal;
  invoiceNumber?: string;
  courierName?: string;
  courierPhone?: string;
  deliveryTrackingNote?: string;
  supplierNotes?: string;
  commissionRatePercent: number; // e.g. 2.5%
  commissionAmountIQD: number;
  repCommissionAmountIQD: number;
  repAttributedCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MasterOrder {
  id: string;
  orderNumber: string;
  pharmacyId: string;
  pharmacyName: string;
  pharmacyGov: string;
  pharmacyPhone: string;
  deliveryAddress: string;
  totalAmountIQD: number;
  suborders: SubOrder[];
  status: 'submitted' | 'processing' | 'partially_fulfilled' | 'completed' | 'cancelled';
  repAttributedCode?: string;
  createdAt: string;
}

export interface CommissionRecord {
  id: string;
  suborderId: string;
  suborderNumber: string;
  supplierId: string;
  supplierName: string;
  pharmacyName: string;
  saleAmountIQD: number;
  platformRatePercent: number;
  platformFeeIQD: number;
  repCode?: string;
  repFeeIQD: number;
  settlementStatus: 'accrued' | 'invoiced' | 'settled';
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  timestamp: string;
}

export interface Dispute {
  id: string;
  suborderId: string;
  suborderNumber: string;
  pharmacyId: string;
  pharmacyName: string;
  supplierId: string;
  supplierName: string;
  reason: 'damaged_goods' | 'incorrect_batch' | 'short_expiry' | 'missing_items' | 'pricing_discrepancy';
  description: string;
  status: 'open' | 'investigating' | 'refund_approved' | 'rejected' | 'resolved';
  resolutionNotes?: string;
  refundAmountIQD?: number;
  createdAt: string;
}

export interface FinancialMetrics {
  gmvIQD: number;
  completedSalesIQD: number;
  platformGrossCommissionIQD: number;
  repCommissionsPaidIQD: number;
  platformNetRevenueIQD: number;
  totalOrdersCount: number;
  completedOrdersCount: number;
  activeDisputesCount: number;
  operatingExpensesIQD: number;
  netOperatingResultIQD: number;
}
