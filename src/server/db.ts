import fs from 'fs';
import path from 'path';
import {
  User,
  Product,
  SupplierOffer,
  MasterOrder,
  SubOrder,
  CommissionRecord,
  AuditLog,
  Dispute,
  VerificationDocument,
  FinancialMetrics,
} from '../types';
import {
  initialUsers,
  initialProducts,
  initialSupplierOffers,
  initialOrders,
  initialCommissions,
  initialAuditLogs,
  initialVerificationDocuments,
} from './mockData';

interface DatabaseSchema {
  users: User[];
  currentUserId: string;
  products: Product[];
  supplierOffers: SupplierOffer[];
  orders: MasterOrder[];
  commissions: CommissionRecord[];
  auditLogs: AuditLog[];
  verificationDocuments: VerificationDocument[];
  disputes: Dispute[];
  settings: {
    defaultPlatformCommissionPercent: number;
    defaultRepCommissionPercent: number;
    marketplaceDisclaimerAr: string;
    marketplaceDisclaimerEn: string;
  };
}

const DATA_DIR = path.resolve(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'marketplace_db.json');

class DatabaseStore {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadOrSeed();
  }

  private loadOrSeed(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('Could not read existing db file, initializing seed defaults:', err);
    }

    const defaultState: DatabaseSchema = {
      users: initialUsers,
      currentUserId: 'user_pharmacy_1', // default demo user
      products: initialProducts,
      supplierOffers: initialSupplierOffers,
      orders: initialOrders,
      commissions: initialCommissions,
      auditLogs: initialAuditLogs,
      verificationDocuments: initialVerificationDocuments,
      disputes: [],
      settings: {
        defaultPlatformCommissionPercent: 2.5,
        defaultRepCommissionPercent: 0.8,
        marketplaceDisclaimerAr: 'منصة وسيطة لتسهيل التجارة البينية للأدوية بين المذاخر والصيدليات المرخصة بموجب تعليمات نقابة صيادلة العراق. المنصة لا تبيع ولا تخزن الأدوية.',
        marketplaceDisclaimerEn: 'B2B intermediary marketplace connecting licensed Iraqi pharmacies and pharmaceutical suppliers under Syndicate guidelines. The platform does not sell or hold medicine inventory.',
      },
    };

    this.save(defaultState);
    return defaultState;
  }

  private save(data?: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data || this.data, null, 2), 'utf-8');
    } catch (err) {
      console.warn('Unable to persist db file to disk, relying on in-memory state:', err);
    }
  }

  // Session & User
  public getCurrentUser(): User {
    const user = this.data.users.find(u => u.id === this.data.currentUserId);
    return user || this.data.users[0];
  }

  public setCurrentUserId(userId: string): User {
    const user = this.data.users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    this.data.currentUserId = userId;
    this.save();
    return user;
  }

  public clearCurrentUser(): void {
    this.data.currentUserId = '';
    this.save();
  }

  public registerPharmacy(params: {
    name: string;
    phone: string;
    governorate: string;
    licenseNumber: string;
    organizationName?: string;
    referralCode?: string;
  }): { user: User; document: VerificationDocument } {
    if (!params.name?.trim()) throw new Error('الاسم مطلوب');
    if (!params.phone?.trim()) throw new Error('رقم الهاتف مطلوب');
    if (!params.governorate?.trim()) throw new Error('المنطقة والمحافظة مطلوبة');
    if (!params.licenseNumber?.trim()) throw new Error('رقم رخصة الصيدلية مطلوب');

    const cleanPhone = params.phone.replace(/[\s\-\+]/g, '');
    const cleanLicense = params.licenseNumber.trim().toUpperCase();

    // Check if pharmacy exists with same phone or license
    const existing = this.data.users.find(u => {
      const uPhone = u.phone.replace(/[\s\-\+]/g, '');
      return (uPhone && uPhone === cleanPhone) || (u.licenseNumber && u.licenseNumber.trim().toUpperCase() === cleanLicense);
    });

    if (existing) {
      this.data.currentUserId = existing.id;
      this.save();
      const existingDoc = this.data.verificationDocuments.find(d => d.userId === existing.id) || {
        id: `doc_${existing.id}`,
        userId: existing.id,
        organizationName: existing.organizationName,
        role: 'pharmacy',
        documentType: 'syndicate_license',
        documentNumber: existing.licenseNumber || params.licenseNumber,
        issuer: 'نقابة صيادلة العراق',
        issueDate: '2024-01-01',
        expiryDate: '2027-01-01',
        status: 'verified',
      };
      return { user: existing, document: existingDoc };
    }

    const orgName = params.organizationName?.trim() || `صيدلية ${params.name.replace(/^د\.?\s*/, '').trim()}`;
    const newUserId = `user_pharmacy_${Date.now()}`;
    const newUser: User = {
      id: newUserId,
      email: `${cleanPhone || Date.now()}@dawana.iq`,
      role: 'pharmacy',
      name: params.name.trim(),
      phone: params.phone.trim(),
      governorate: params.governorate.trim(),
      status: 'verified',
      licenseNumber: cleanLicense,
      organizationName: orgName,
      referralCodeUsed: params.referralCode?.trim() || 'REP-BGW-104',
      createdAt: new Date().toISOString(),
    };

    this.data.users.unshift(newUser);

    const docId = `doc_${Date.now()}`;
    const newDoc: VerificationDocument = {
      id: docId,
      userId: newUserId,
      organizationName: orgName,
      role: 'pharmacy',
      documentType: 'syndicate_license',
      documentNumber: cleanLicense,
      issuer: 'نقابة صيادلة العراق - المقر العام',
      issueDate: '2024-01-15',
      expiryDate: '2027-01-15',
      status: 'verified',
      verifiedAt: new Date().toISOString(),
      verifiedBy: 'نظام التحقق الآلي لنقابة صيادلة العراق',
    };
    this.data.verificationDocuments.unshift(newDoc);

    this.data.currentUserId = newUserId;

    this.logAudit(
      newUser,
      'REGISTER_PHARMACY',
      'user',
      newUserId,
      `تسجيل صيدلية جديدة وتوثيق رخصة النقابة: ${orgName} - إجازة رقم ${cleanLicense} - المنطقة: ${params.governorate}`
    );

    this.save();
    return { user: newUser, document: newDoc };
  }

  public registerSupplier(params: {
    name: string;
    phone: string;
    organizationName: string;
    supplierType?: any;
    legalEntityName?: string;
    governorate: string;
    addressDetails?: string;
    licenseNumber: string;
    commercialRegister?: string;
    email?: string;
  }): { user: User; document: VerificationDocument } {
    if (!params.name?.trim()) throw new Error('اسم المدير أو الصيدلي المسؤول مطلوب');
    if (!params.phone?.trim()) throw new Error('رقم الهاتف للتواصل مطلوب');
    if (!params.organizationName?.trim()) throw new Error('اسم المكتب أو المذخر أو الشركة الدوائية مطلوب');
    if (!params.governorate?.trim()) throw new Error('المحافظة وموقع المستودع مطلوب');
    if (!params.licenseNumber?.trim()) throw new Error('رقم إجازة نقابة صيادلة العراق أو وزارة الصحة مطلوب');

    const cleanPhone = params.phone.replace(/[\s\-\+]/g, '');
    const cleanLicense = params.licenseNumber.trim().toUpperCase();

    // Check if supplier already exists
    const existing = this.data.users.find(u => {
      const uPhone = u.phone.replace(/[\s\-\+]/g, '');
      return (
        (u.role === 'supplier' && uPhone && uPhone === cleanPhone) ||
        (u.licenseNumber && u.licenseNumber.trim().toUpperCase() === cleanLicense)
      );
    });

    if (existing) {
      this.data.currentUserId = existing.id;
      this.save();
      const existingDoc = this.data.verificationDocuments.find(d => d.userId === existing.id) || {
        id: `doc_${existing.id}`,
        userId: existing.id,
        organizationName: existing.organizationName,
        role: 'supplier',
        documentType: 'syndicate_license',
        documentNumber: existing.licenseNumber || params.licenseNumber,
        issuer: 'نقابة صيادلة العراق - قسم تنظيم المذاخر',
        issueDate: '2024-01-01',
        expiryDate: '2027-01-01',
        status: existing.status === 'verified' ? 'verified' : 'pending',
      };
      return { user: existing, document: existingDoc };
    }

    const newUserId = `user_supplier_${Date.now()}`;
    const newUser: User = {
      id: newUserId,
      email: params.email?.trim() || `${cleanPhone || Date.now()}@dawana.iq`,
      role: 'supplier',
      name: params.name.trim(),
      phone: params.phone.trim(),
      organizationName: params.organizationName.trim(),
      legalEntityName: params.legalEntityName?.trim() || params.organizationName.trim(),
      supplierType: params.supplierType || 'wholesaler',
      governorate: params.governorate.trim(),
      addressDetails: params.addressDetails?.trim(),
      licenseNumber: cleanLicense,
      commercialRegister: params.commercialRegister?.trim() || `CR-IQ-${Math.floor(100000 + Math.random() * 900000)}`,
      managerName: params.name.trim(),
      managerPhone: params.phone.trim(),
      status: 'pending_verification', // New supplier accounts are pending admin review before active selling
      createdAt: new Date().toISOString(),
    };

    this.data.users.unshift(newUser);

    const docId = `doc_${Date.now()}`;
    const newDoc: VerificationDocument = {
      id: docId,
      userId: newUserId,
      organizationName: newUser.organizationName,
      role: 'supplier',
      documentType: 'syndicate_license',
      documentNumber: cleanLicense,
      issuer: 'نقابة صيادلة العراق / وزارة الصحة',
      issueDate: '2024-01-01',
      expiryDate: '2027-01-01',
      status: 'pending',
    };
    this.data.verificationDocuments.unshift(newDoc);

    this.data.currentUserId = newUserId;

    this.logAudit(
      newUser,
      'REGISTER_SUPPLIER',
      'user',
      newUserId,
      `تسجيل مكتب/مذخر دوائي جديد: ${newUser.organizationName} (${newUser.supplierType}) - إجازة: ${cleanLicense} - بانتظار تدقيق الإدارة`
    );

    this.save();
    return { user: newUser, document: newDoc };
  }

  public loginPharmacy(identifier: string): User {
    if (!identifier?.trim()) throw new Error('يرجى إدخال رقم الهاتف أو رقم رخصة الصيدلية');
    const term = identifier.trim();
    const cleanTerm = term.replace(/[\s\-\+]/g, '');

    const found = this.data.users.find(u => {
      const uPhone = u.phone.replace(/[\s\-\+]/g, '');
      const uLic = (u.licenseNumber || '').trim().toUpperCase();
      return (
        (cleanTerm.length >= 4 && uPhone.includes(cleanTerm)) ||
        (uLic && (uLic === term.toUpperCase() || uLic.includes(term.toUpperCase()))) ||
        u.id === term ||
        u.name.toLowerCase().includes(term.toLowerCase()) ||
        u.organizationName.toLowerCase().includes(term.toLowerCase())
      );
    });

    if (!found) {
      throw new Error('لم يتم العثور على حساب مسجل برقم الهاتف أو رخصة الصيدلية هذه. يرجى التأكد أو إنشاء حساب صيدلية جديد.');
    }

    this.data.currentUserId = found.id;
    this.logAudit(
      found,
      'LOGIN_SUCCESS',
      'user',
      found.id,
      `تسجيل دخول ناجح للمؤسسة: ${found.organizationName} (${found.role})`
    );
    this.save();
    return found;
  }

  public loginSupplier(identifier: string): User {
    if (!identifier?.trim()) throw new Error('يرجى إدخال رقم الهاتف أو رقم ترخيص المذخر/المكتب');
    const term = identifier.trim();
    const cleanTerm = term.replace(/[\s\-\+]/g, '');

    const found = this.data.users.find(u => {
      if (u.role !== 'supplier' && u.role !== 'admin') return false;
      const uPhone = u.phone.replace(/[\s\-\+]/g, '');
      const uLic = (u.licenseNumber || '').trim().toUpperCase();
      return (
        (cleanTerm.length >= 4 && uPhone.includes(cleanTerm)) ||
        (uLic && (uLic === term.toUpperCase() || uLic.includes(term.toUpperCase()))) ||
        u.id === term ||
        u.organizationName.toLowerCase().includes(term.toLowerCase()) ||
        u.name.toLowerCase().includes(term.toLowerCase()) ||
        (u.email && u.email.toLowerCase() === term.toLowerCase())
      );
    });

    if (!found) {
      throw new Error('لم يتم العثور على حساب مكتب أو مذخر مسجل بهذه البيانات. يرجى إنشاء حساب جديد للمكتب أو التأكد من الرقم.');
    }

    this.data.currentUserId = found.id;
    this.logAudit(
      found,
      'LOGIN_SUCCESS',
      'user',
      found.id,
      `تسجيل دخول ناجح لبوابة المكاتب: ${found.organizationName} (${found.status})`
    );
    this.save();
    return found;
  }

  public getUsers(): User[] {
    return this.data.users;
  }

  public logAudit(actor: User, action: string, entityType: string, entityId: string, details: string) {
    const log: AuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action,
      entityType,
      entityId,
      details,
      timestamp: new Date().toISOString(),
    };
    this.data.auditLogs.unshift(log);
    this.save();
  }

  // Products & Offers
  public getProductsWithOffers(query?: string, category?: string, manufacturer?: string) {
    let prods = [...this.data.products];

    if (query) {
      const q = query.toLowerCase();
      prods = prods.filter(
        p =>
          p.nameEn.toLowerCase().includes(q) ||
          p.nameAr.includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.activeIngredient.toLowerCase().includes(q) ||
          p.manufacturer.toLowerCase().includes(q) ||
          p.barcode.includes(q)
      );
    }

    if (category && category !== 'all') {
      prods = prods.filter(p => p.category.includes(category));
    }

    if (manufacturer && manufacturer !== 'all') {
      prods = prods.filter(p => p.manufacturer.toLowerCase().includes(manufacturer.toLowerCase()));
    }

    return prods.map(prod => {
      const offers = this.data.supplierOffers.filter(
        o => o.productId === prod.id && o.stockQuantity > 0 && o.status !== 'paused' && o.status !== 'pending_review'
      );
      const minPriceIQD = offers.length > 0 ? Math.min(...offers.map(o => o.priceIQD)) : undefined;
      return {
        ...prod,
        offersCount: offers.length,
        minPriceIQD,
        offers,
      };
    });
  }

  public getProductDetail(productId: string) {
    const product = this.data.products.find(p => p.id === productId);
    if (!product) return null;
    const offers = this.data.supplierOffers
      .filter(o => o.productId === productId && o.status !== 'paused' && o.status !== 'pending_review')
      .sort((a, b) => a.priceIQD - b.priceIQD);
    return {
      ...product,
      offers,
    };
  }

  public updateOffer(offerId: string, updates: Partial<SupplierOffer>, actor: User) {
    const offerIndex = this.data.supplierOffers.findIndex(o => o.id === offerId);
    if (offerIndex === -1) throw new Error('Offer not found');
    const existing = this.data.supplierOffers[offerIndex];

    if (actor.role !== 'admin' && existing.supplierId !== actor.id) {
      throw new Error('Unauthorized to modify this offer');
    }

    this.data.supplierOffers[offerIndex] = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.logAudit(
      actor,
      'UPDATE_SUPPLIER_OFFER',
      'offer',
      offerId,
      `تم تحديث عرض المذخر ${existing.supplierName} - السعر الجديد: ${updates.priceIQD ?? existing.priceIQD} د.ع - الكمية: ${updates.stockQuantity ?? existing.stockQuantity}`
    );

    this.save();
    return this.data.supplierOffers[offerIndex];
  }

  public toggleOfferStatus(offerId: string, actor: User): SupplierOffer {
    const offer = this.data.supplierOffers.find(o => o.id === offerId);
    if (!offer) throw new Error('العرض الدوائي غير موجود');
    if (actor.role !== 'admin' && offer.supplierId !== actor.id) {
      throw new Error('غير مصرح لك بتعديل حالة هذا العرض');
    }

    offer.status = offer.status === 'paused' ? 'active' : 'paused';
    offer.updatedAt = new Date().toISOString();

    this.logAudit(
      actor,
      'TOGGLE_OFFER_STATUS',
      'offer',
      offerId,
      `تم ${offer.status === 'active' ? 'تفعيل وإتاحة' : 'إيقاف عرض'} الصنف الدوائي للمذخر ${offer.supplierName} (تشغيلة: ${offer.batchNumber})`
    );

    this.save();
    return offer;
  }

  public deleteOffer(offerId: string, actor: User): boolean {
    const idx = this.data.supplierOffers.findIndex(o => o.id === offerId);
    if (idx === -1) throw new Error('العرض الدوائي غير موجود');
    const offer = this.data.supplierOffers[idx];
    if (actor.role !== 'admin' && offer.supplierId !== actor.id) {
      throw new Error('غير مصرح لك بحذف هذا العرض');
    }

    this.data.supplierOffers.splice(idx, 1);
    this.logAudit(actor, 'DELETE_OFFER', 'offer', offerId, `تم حذف العرض الدوائي للتشغيلة ${offer.batchNumber}`);
    this.save();
    return true;
  }

  public addNewProductAndOffer(payload: {
    nameAr: string;
    nameEn: string;
    brand?: string;
    activeIngredient: string;
    manufacturer: string;
    countryOfOrigin?: string;
    dosageForm: string;
    strength: string;
    packageSize: string;
    barcode?: string;
    category?: string;
    priceIQD: number;
    stockQuantity: number;
    minOrderQty?: number;
    batchNumber: string;
    productionDate?: string;
    expiryDate: string;
    isColdChain?: boolean;
    leadTimeHours?: number;
    discountNotes?: string;
    imageUrl?: string;
  }, actor: User) {
    if (actor.role !== 'supplier' && actor.role !== 'admin') {
      throw new Error('فقط المكاتب والمذاخر والشركات الدوائية تملك صلاحية إضافة المنتجات');
    }

    if (!payload.nameAr?.trim() || !payload.nameEn?.trim()) {
      throw new Error('يرجى إدخال اسم الدواء باللغتين العربية والإنجليزية');
    }
    if (!payload.activeIngredient?.trim()) {
      throw new Error('الاسم العلمي والمادة الفعالة مطلوبة');
    }
    if (!payload.manufacturer?.trim()) {
      throw new Error('اسم الشركة المصنعة مطلوب');
    }
    if (!payload.dosageForm?.trim() || !payload.strength?.trim()) {
      throw new Error('الشكل الدوائي والتركيز مطلوبان بدقة');
    }
    if (!payload.priceIQD || payload.priceIQD <= 0) {
      throw new Error('سعر البيع للصيدليات يجب أن يكون قيمة موجبة بالدينار العراقي');
    }
    if (payload.stockQuantity === undefined || payload.stockQuantity < 0) {
      throw new Error('الكمية المتوفرة يجب أن تكون صفر أو أكثر');
    }
    if (!payload.batchNumber?.trim()) {
      throw new Error('رقم التشغيلة (Batch/Lot Number) مطلوب للتتبع الدوائي الصارم');
    }
    if (!payload.expiryDate?.trim()) {
      throw new Error('تاريخ انتهاء الصلاحية مطلوب');
    }

    // Check if standardized product already exists
    let existingProd = this.data.products.find(p => {
      if (payload.barcode && p.barcode && p.barcode.trim() === payload.barcode.trim()) return true;
      return (
        p.nameEn.toLowerCase() === payload.nameEn.trim().toLowerCase() &&
        p.dosageForm.toLowerCase() === payload.dosageForm.trim().toLowerCase() &&
        p.strength.toLowerCase() === payload.strength.trim().toLowerCase()
      );
    });

    let productId = existingProd?.id;
    const isSupplierVerified = actor.status === 'verified';

    if (!existingProd) {
      productId = `prod_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const newProd: Product = {
        id: productId,
        nameAr: payload.nameAr.trim(),
        nameEn: payload.nameEn.trim(),
        brand: payload.brand?.trim() || payload.nameEn.trim(),
        activeIngredient: payload.activeIngredient.trim(),
        manufacturer: payload.manufacturer.trim(),
        countryOfOrigin: payload.countryOfOrigin?.trim() || 'العراق / دولي',
        dosageForm: payload.dosageForm.trim(),
        strength: payload.strength.trim(),
        packageSize: payload.packageSize?.trim() || 'عبوة نظامية',
        barcode: payload.barcode?.trim() || `${Math.floor(1000000000000 + Math.random() * 9000000000000)}`,
        category: payload.category || 'عام',
        isControlled: false,
        fictionalDemoNote: 'منتج مسجل عبر بوابة المكاتب والمذاخر',
        createdSupplierId: actor.id,
        approvalStatus: isSupplierVerified ? 'approved' : 'pending_review',
        imageUrl: payload.imageUrl,
      };
      this.data.products.push(newProd);
      existingProd = newProd;
    }

    // Create supplier offer linked to this product and supplier
    const offerId = `offer_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newOffer: SupplierOffer = {
      id: offerId,
      productId: productId!,
      supplierId: actor.id,
      supplierName: actor.organizationName || actor.name,
      supplierGov: actor.governorate,
      priceIQD: Number(payload.priceIQD),
      stockQuantity: Number(payload.stockQuantity),
      minOrderQty: Number(payload.minOrderQty) || 1,
      batchNumber: payload.batchNumber.trim().toUpperCase(),
      productionDate: payload.productionDate || new Date().toISOString().split('T')[0],
      expiryDate: payload.expiryDate,
      leadTimeHours: payload.leadTimeHours || 24,
      discountNotes: payload.discountNotes,
      isVerifiedSupplier: isSupplierVerified,
      status: isSupplierVerified ? 'active' : 'pending_review',
      isColdChain: !!payload.isColdChain,
      coaDocumentRef: `COA-${payload.batchNumber.trim().toUpperCase()}`,
      updatedAt: new Date().toISOString(),
    };

    this.data.supplierOffers.push(newOffer);

    this.logAudit(
      actor,
      'ADD_OFFICE_PRODUCT',
      'product',
      productId!,
      `إضافة منتج دوائي جديد [${payload.nameAr} - ${payload.nameEn}] من قبل ${actor.organizationName} بسعر ${payload.priceIQD.toLocaleString()} د.ع - تشغيلة ${payload.batchNumber} - حالة النشر: ${newOffer.status}`
    );

    this.save();
    return { product: existingProd, offer: newOffer };
  }

  public approveUser(userId: string, reviewer: User): User {
    if (reviewer.role !== 'admin' && reviewer.id !== userId) {
      throw new Error('فقط إدارة المنصة تملك صلاحية اعتماد المكاتب والصيدليات');
    }
    const user = this.data.users.find(u => u.id === userId);
    if (!user) throw new Error('المستخدم غير موجود');

    user.status = 'verified';

    // Verify all pending documents
    this.data.verificationDocuments
      .filter(d => d.userId === userId)
      .forEach(d => {
        d.status = 'verified';
        d.verifiedAt = new Date().toISOString();
        d.verifiedBy = reviewer.name;
      });

    // Activate any pending offers
    this.data.supplierOffers
      .filter(o => o.supplierId === userId && o.status === 'pending_review')
      .forEach(o => {
        o.status = 'active';
        o.isVerifiedSupplier = true;
      });

    // Approve any products created by this supplier
    this.data.products
      .filter(p => p.createdSupplierId === userId && p.approvalStatus === 'pending_review')
      .forEach(p => {
        p.approvalStatus = 'approved';
      });

    this.logAudit(
      reviewer,
      'APPROVE_USER_ACCOUNT',
      'user',
      userId,
      `تم اعتماد وتفعيل صلاحيات البيع والنشر للمؤسسة: ${user.organizationName} (${user.role})`
    );

    this.save();
    return user;
  }

  public addOffer(newOffer: Omit<SupplierOffer, 'id' | 'updatedAt'>, actor: User) {
    const id = `offer_${Date.now()}`;
    const offer: SupplierOffer = {
      ...newOffer,
      id,
      updatedAt: new Date().toISOString(),
    };
    this.data.supplierOffers.push(offer);

    this.logAudit(
      actor,
      'CREATE_SUPPLIER_OFFER',
      'offer',
      id,
      `إضافة عرض دوائي جديد من ${newOffer.supplierName} بسعر ${newOffer.priceIQD} د.ع`
    );

    this.save();
    return offer;
  }

  // Cart & Orders Workflow
  public checkoutSplitCart(payload: {
    pharmacy: User;
    deliveryAddress: string;
    items: Array<{
      offerId: string;
      quantity: number;
    }>;
  }) {
    const { pharmacy, deliveryAddress, items } = payload;
    if (items.length === 0) throw new Error('Cart is empty');

    // Group items by supplier
    const supplierGroups = new Map<string, Array<{ offer: SupplierOffer; product: Product; quantity: number }>>();

    for (const item of items) {
      const offer = this.data.supplierOffers.find(o => o.id === item.offerId);
      if (!offer) throw new Error(`Offer ${item.offerId} not found`);
      const product = this.data.products.find(p => p.id === offer.productId);
      if (!product) throw new Error(`Product ${offer.productId} not found`);

      if (item.quantity < offer.minOrderQty) {
        throw new Error(`Minimum order quantity for ${product.nameAr} from ${offer.supplierName} is ${offer.minOrderQty}`);
      }
      if (item.quantity > offer.stockQuantity) {
        throw new Error(`Insufficient stock for ${product.nameAr} at ${offer.supplierName}`);
      }

      const list = supplierGroups.get(offer.supplierId) || [];
      list.push({ offer, product, quantity: item.quantity });
      supplierGroups.set(offer.supplierId, list);
    }

    const masterOrderId = `ord_${Date.now()}`;
    const orderNumber = `IQ-ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const suborders: SubOrder[] = [];
    let grandTotalIQD = 0;
    let letterIndex = 0;
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

    for (const [supplierId, groupItems] of supplierGroups.entries()) {
      const firstOffer = groupItems[0].offer;
      const suborderLetter = letters[letterIndex++] || 'Z';
      const suborderNumber = `${orderNumber}-${suborderLetter}`;

      let subtotal = 0;
      const orderItems = groupItems.map(({ offer, product, quantity }) => {
        const lineTotal = offer.priceIQD * quantity;
        subtotal += lineTotal;

        // Deduct from supplier warehouse stock immediately
        offer.stockQuantity = Math.max(0, offer.stockQuantity - quantity);
        offer.updatedAt = new Date().toISOString();

        return {
          productId: product.id,
          productName: product.nameEn,
          brand: product.brand,
          activeIngredient: product.activeIngredient,
          dosageForm: product.dosageForm,
          strength: product.strength,
          packageSize: product.packageSize,
          quantity,
          unitPriceIQD: offer.priceIQD,
          totalPriceIQD: lineTotal,
          batchNumber: offer.batchNumber,
          expiryDate: offer.expiryDate,
        };
      });

      grandTotalIQD += subtotal;

      const platformCommissionRate = this.data.settings.defaultPlatformCommissionPercent;
      const platformFee = Math.round((subtotal * platformCommissionRate) / 100);
      const repCommissionRate = pharmacy.referralCodeUsed ? this.data.settings.defaultRepCommissionPercent : 0;
      const repFee = Math.round((subtotal * repCommissionRate) / 100);

      const suborder: SubOrder = {
        id: `sub_${masterOrderId}_${suborderLetter}`,
        masterOrderId,
        suborderNumber,
        supplierId,
        supplierName: firstOffer.supplierName,
        pharmacyId: pharmacy.id,
        pharmacyName: pharmacy.organizationName || pharmacy.name,
        pharmacyPhone: pharmacy.phone,
        pharmacyGov: pharmacy.governorate,
        items: orderItems,
        subtotalIQD: subtotal,
        status: 'pending_supplier_review',
        commissionRatePercent: platformCommissionRate,
        commissionAmountIQD: platformFee,
        repCommissionAmountIQD: repFee,
        repAttributedCode: pharmacy.referralCodeUsed,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      suborders.push(suborder);
    }

    const masterOrder: MasterOrder = {
      id: masterOrderId,
      orderNumber,
      pharmacyId: pharmacy.id,
      pharmacyName: pharmacy.organizationName || pharmacy.name,
      pharmacyGov: pharmacy.governorate,
      pharmacyPhone: pharmacy.phone,
      deliveryAddress,
      totalAmountIQD: grandTotalIQD,
      suborders,
      status: 'submitted',
      repAttributedCode: pharmacy.referralCodeUsed,
      createdAt: new Date().toISOString(),
    };

    this.data.orders.unshift(masterOrder);

    this.logAudit(
      pharmacy,
      'PLACE_SPLIT_ORDER',
      'order',
      masterOrderId,
      `طلب جديد #${orderNumber} بإجمالي ${grandTotalIQD.toLocaleString()} د.ع مقسم إلى ${suborders.length} طلبية تجهيز منفصلة لمذاخر مختلفة`
    );

    this.save();
    return masterOrder;
  }

  public getOrders(user: User): MasterOrder[] {
    if (user.role === 'admin') {
      return this.data.orders;
    }
    if (user.role === 'pharmacy') {
      return this.data.orders.filter(o => o.pharmacyId === user.id);
    }
    if (user.role === 'supplier') {
      // Filter master orders that have suborders for this supplier
      return this.data.orders
        .map(order => ({
          ...order,
          suborders: order.suborders.filter(s => s.supplierId === user.id),
        }))
        .filter(order => order.suborders.length > 0);
    }
    if (user.role === 'rep') {
      return this.data.orders.filter(o => o.repAttributedCode === user.repCode);
    }
    return [];
  }

  public getSuborderById(suborderId: string): SubOrder | null {
    for (const order of this.data.orders) {
      const sub = order.suborders.find(s => s.id === suborderId);
      if (sub) return sub;
    }
    return null;
  }

  public updateSuborderAction(
    suborderId: string,
    action: 'accept' | 'propose_modification' | 'dispatch' | 'deliver' | 'reject' | 'approve_modification' | 'reject_modification',
    payload: any,
    actor: User
  ) {
    let targetSuborder: SubOrder | null = null;
    let parentOrder: MasterOrder | null = null;

    for (const order of this.data.orders) {
      const sub = order.suborders.find(s => s.id === suborderId);
      if (sub) {
        targetSuborder = sub;
        parentOrder = order;
        break;
      }
    }

    if (!targetSuborder || !parentOrder) {
      throw new Error('Suborder not found');
    }

    const now = new Date().toISOString();

    if (action === 'accept') {
      // Supplier confirms
      targetSuborder.status = 'confirmed';
      targetSuborder.invoiceNumber = `INV-${targetSuborder.supplierId.slice(-4).toUpperCase()}-${Date.now().toString().slice(-4)}`;
      targetSuborder.updatedAt = now;
      this.logAudit(actor, 'CONFIRM_SUBORDER', 'suborder', suborderId, `تم تأكيد طلبية التجهيز ${targetSuborder.suborderNumber} وإصدار فاتورة أولية ${targetSuborder.invoiceNumber}`);
    } else if (action === 'propose_modification') {
      // Supplier proposes price or quantity change
      const { reason, items } = payload;
      let newTotal = 0;
      targetSuborder.items = items.map((it: any) => {
        newTotal += it.quantity * it.unitPriceIQD;
        return {
          ...it,
          totalPriceIQD: it.quantity * it.unitPriceIQD,
          isModified: true,
        };
      });

      targetSuborder.modificationProposal = {
        proposedAt: now,
        reason: reason || 'تعديل السعر أو توفر الكمية من قبل المذخر',
        originalSubtotalIQD: targetSuborder.subtotalIQD,
        newSubtotalIQD: newTotal,
        pharmacyDecision: 'pending',
      };
      targetSuborder.subtotalIQD = newTotal;
      targetSuborder.status = 'supplier_modified';
      targetSuborder.updatedAt = now;
      this.logAudit(actor, 'PROPOSE_MODIFICATION', 'suborder', suborderId, `اقتراح تعديل كمية/سعر على ${targetSuborder.suborderNumber}: ${reason}`);
    } else if (action === 'approve_modification') {
      // Pharmacy approves supplier modification
      if (targetSuborder.modificationProposal) {
        targetSuborder.modificationProposal.pharmacyDecision = 'accepted';
        targetSuborder.modificationProposal.decidedAt = now;
      }
      targetSuborder.status = 'confirmed';
      targetSuborder.invoiceNumber = `INV-${targetSuborder.supplierId.slice(-4).toUpperCase()}-${Date.now().toString().slice(-4)}`;
      targetSuborder.updatedAt = now;
      this.logAudit(actor, 'APPROVE_MODIFICATION', 'suborder', suborderId, `الصيدلية وافقت على تعديلات المذخر للطلب ${targetSuborder.suborderNumber}`);
    } else if (action === 'reject_modification') {
      // Pharmacy rejects modification -> cancels this suborder
      if (targetSuborder.modificationProposal) {
        targetSuborder.modificationProposal.pharmacyDecision = 'rejected';
        targetSuborder.modificationProposal.decidedAt = now;
      }
      targetSuborder.status = 'cancelled';
      targetSuborder.updatedAt = now;
      this.logAudit(actor, 'REJECT_MODIFICATION', 'suborder', suborderId, `الصيدلية رفضت تعديلات المذخر وتم إلغاء الطلبية ${targetSuborder.suborderNumber}`);
    } else if (action === 'dispatch') {
      // Supplier dispatches with driver details
      targetSuborder.status = 'dispatched';
      targetSuborder.courierName = payload.courierName || 'مندوب التوصيل المبرد';
      targetSuborder.courierPhone = payload.courierPhone || '+964 770 000 0000';
      targetSuborder.deliveryTrackingNote = payload.deliveryTrackingNote || 'تم التحميل والانطلاق باتجاه الصيدلية';
      targetSuborder.updatedAt = now;
      this.logAudit(actor, 'DISPATCH_SUBORDER', 'suborder', suborderId, `تم شحن الطلبية ${targetSuborder.suborderNumber} مع السائق ${targetSuborder.courierName}`);
    } else if (action === 'deliver') {
      // Suborder delivered -> Record Commission on completed sale
      targetSuborder.status = 'delivered';
      targetSuborder.updatedAt = now;

      // Platform commission record
      const commissionRecord: CommissionRecord = {
        id: `comm_${Date.now()}`,
        suborderId: targetSuborder.id,
        suborderNumber: targetSuborder.suborderNumber,
        supplierId: targetSuborder.supplierId,
        supplierName: targetSuborder.supplierName,
        pharmacyName: targetSuborder.pharmacyName,
        saleAmountIQD: targetSuborder.subtotalIQD,
        platformRatePercent: targetSuborder.commissionRatePercent,
        platformFeeIQD: targetSuborder.commissionAmountIQD,
        repCode: targetSuborder.repAttributedCode,
        repFeeIQD: targetSuborder.repCommissionAmountIQD,
        settlementStatus: 'accrued',
        createdAt: now,
      };
      this.data.commissions.push(commissionRecord);

      this.logAudit(
        actor,
        'DELIVER_SUBORDER',
        'suborder',
        suborderId,
        `تم تأكيد تسليم طلبية التجهيز ${targetSuborder.suborderNumber} واحتساب عمولة المنصة ${targetSuborder.commissionAmountIQD.toLocaleString()} د.ع`
      );
    } else if (action === 'reject') {
      targetSuborder.status = 'cancelled';
      targetSuborder.supplierNotes = payload.reason || 'المخزون غير متوفر حالياً';
      targetSuborder.updatedAt = now;
      this.logAudit(actor, 'REJECT_SUBORDER', 'suborder', suborderId, `اعتذر المذخر عن تجهيز الطلبية ${targetSuborder.suborderNumber}: ${targetSuborder.supplierNotes}`);
    }

    // Refresh master order status
    const allStatuses = parentOrder.suborders.map(s => s.status);
    if (allStatuses.every(s => s === 'delivered')) {
      parentOrder.status = 'completed';
    } else if (allStatuses.every(s => s === 'cancelled')) {
      parentOrder.status = 'cancelled';
    } else if (allStatuses.some(s => s === 'delivered' || s === 'dispatched' || s === 'confirmed')) {
      parentOrder.status = 'processing';
    }

    this.save();
    return targetSuborder;
  }

  // Verifications
  public getVerificationDocuments(): VerificationDocument[] {
    return this.data.verificationDocuments;
  }

  public reviewVerificationDocument(docId: string, status: 'verified' | 'rejected', rejectionReason?: string, reviewer?: User) {
    const doc = this.data.verificationDocuments.find(d => d.id === docId);
    if (!doc) throw new Error('Document not found');

    doc.status = status;
    doc.rejectionReason = rejectionReason;
    doc.verifiedAt = new Date().toISOString();
    doc.verifiedBy = reviewer?.id || 'admin';

    // If verified, update the user's status if all their docs are verified
    const userDocs = this.data.verificationDocuments.filter(d => d.userId === doc.userId);
    const user = this.data.users.find(u => u.id === doc.userId);

    if (user) {
      if (status === 'rejected') {
        user.status = 'rejected';
      } else if (userDocs.every(d => d.status === 'verified')) {
        user.status = 'verified';
      }
    }

    if (reviewer) {
      this.logAudit(
        reviewer,
        'REVIEW_VERIFICATION_DOC',
        'verification',
        docId,
        `تمت مراجعة وثيقة ترخيص نقابة صيادلة العراق للمؤسسة ${doc.organizationName} - النتيجة: ${status === 'verified' ? 'معتمد وموثق' : 'مرفوض'}`
      );
    }

    this.save();
    return doc;
  }

  // Financial & Reports
  public getFinancialMetrics(): FinancialMetrics {
    const deliveredSuborders = this.data.orders
      .flatMap(o => o.suborders)
      .filter(s => s.status === 'delivered');

    const totalOrdersCount = this.data.orders.length;
    const completedOrdersCount = deliveredSuborders.length;

    const gmvIQD = this.data.orders.reduce((sum, o) => sum + o.totalAmountIQD, 0);
    const completedSalesIQD = deliveredSuborders.reduce((sum, s) => sum + s.subtotalIQD, 0);

    const platformGrossCommissionIQD = this.data.commissions.reduce((sum, c) => sum + c.platformFeeIQD, 0);
    const repCommissionsPaidIQD = this.data.commissions.reduce((sum, c) => sum + c.repFeeIQD, 0);

    const platformNetRevenueIQD = platformGrossCommissionIQD - repCommissionsPaidIQD;
    const operatingExpensesIQD = 250000; // Server, SMS alerts, Syndicate data verification API
    const netOperatingResultIQD = platformNetRevenueIQD - operatingExpensesIQD;

    return {
      gmvIQD,
      completedSalesIQD,
      platformGrossCommissionIQD,
      repCommissionsPaidIQD,
      platformNetRevenueIQD,
      totalOrdersCount,
      completedOrdersCount,
      activeDisputesCount: this.data.disputes.filter(d => d.status === 'open' || d.status === 'investigating').length,
      operatingExpensesIQD,
      netOperatingResultIQD,
    };
  }

  // Representative Stats
  public getRepresentativeStats(repCode: string) {
    const referredPharmacies = this.data.users.filter(
      u => u.role === 'pharmacy' && u.referralCodeUsed === repCode
    );

    const attributedOrders = this.data.orders.filter(
      o => o.repAttributedCode === repCode
    );

    const completedAttributedSuborders = attributedOrders
      .flatMap(o => o.suborders)
      .filter(s => s.status === 'delivered');

    const totalEligibleSalesIQD = completedAttributedSuborders.reduce((sum, s) => sum + s.subtotalIQD, 0);
    const totalCommissionEarnedIQD = this.data.commissions
      .filter(c => c.repCode === repCode)
      .reduce((sum, c) => sum + c.repFeeIQD, 0);

    return {
      repCode,
      referredPharmaciesCount: referredPharmacies.length,
      verifiedPharmaciesCount: referredPharmacies.filter(p => p.status === 'verified').length,
      totalOrdersCount: attributedOrders.length,
      completedOrdersCount: completedAttributedSuborders.length,
      totalEligibleSalesIQD,
      totalCommissionEarnedIQD,
      commissionRatePercent: this.data.settings.defaultRepCommissionPercent,
      referredPharmacies,
    };
  }

  // Settings
  public updateSettings(settings: Partial<DatabaseSchema['settings']>, actor: User) {
    this.data.settings = {
      ...this.data.settings,
      ...settings,
    };
    this.logAudit(actor, 'UPDATE_COMMISSION_RULES', 'settings', 'global', `تحديث نسب العمولات: المنصة ${this.data.settings.defaultPlatformCommissionPercent}% - المندوب ${this.data.settings.defaultRepCommissionPercent}%`);
    this.save();
    return this.data.settings;
  }

  public getSettings() {
    return this.data.settings;
  }

  public getAuditLogs(): AuditLog[] {
    return this.data.auditLogs;
  }

  public getCommissions(): CommissionRecord[] {
    return this.data.commissions;
  }

  public addDispute(payload: Omit<Dispute, 'id' | 'status' | 'createdAt'>, actor: User) {
    const dispute: Dispute = {
      ...payload,
      id: `disp_${Date.now()}`,
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    this.data.disputes.unshift(dispute);
    this.logAudit(actor, 'SUBMIT_DISPUTE', 'dispute', dispute.id, `تقديم بلاغ/نزاع للطلبية ${dispute.suborderNumber} بسبب ${dispute.reason}`);
    this.save();
    return dispute;
  }

  public getDisputes(): Dispute[] {
    return this.data.disputes;
  }

  public resetToSample() {
    this.data = {
      users: initialUsers,
      currentUserId: 'user_pharmacy_1',
      products: initialProducts,
      supplierOffers: initialSupplierOffers,
      orders: initialOrders,
      commissions: initialCommissions,
      auditLogs: initialAuditLogs,
      verificationDocuments: initialVerificationDocuments,
      disputes: [],
      settings: {
        defaultPlatformCommissionPercent: 2.5,
        defaultRepCommissionPercent: 0.8,
        marketplaceDisclaimerAr: 'منصة وسيطة لتسهيل التجارة البينية للأدوية بين المذاخر والصيدليات المرخصة بموجب تعليمات نقابة صيادلة العراق. المنصة لا تبيع ولا تخزن الأدوية.',
        marketplaceDisclaimerEn: 'B2B intermediary marketplace connecting licensed Iraqi pharmacies and pharmaceutical suppliers under Syndicate guidelines. The platform does not sell or hold medicine inventory.',
      },
    };
    this.save();
    return true;
  }
}

export const db = new DatabaseStore();
