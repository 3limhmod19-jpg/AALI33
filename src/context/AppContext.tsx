import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, CartItem, Product, SupplierOffer, MasterOrder } from '../types';

interface AppContextType {
  language: 'ar' | 'en';
  setLanguage: (lang: 'ar' | 'en') => void;
  currentUser: User | null;
  allUsers: User[];
  switchUser: (userId: string) => Promise<void>;
  cart: CartItem[];
  addToCart: (offer: SupplierOffer, product: Product, quantity: number) => void;
  updateCartQuantity: (offerId: string, quantity: number) => void;
  removeFromCart: (offerId: string) => void;
  clearCart: () => void;
  cartTotalIQD: number;
  cartSuppliersCount: number;
  cartItemsCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  refreshUserData: () => Promise<void>;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
  openLoginModal: () => void;
  openRegisterModal: () => void;
  isAuthenticated: boolean;
  logout: () => void;
  registerPharmacy: (data: {
    name: string;
    phone: string;
    governorate: string;
    licenseNumber: string;
    organizationName?: string;
    referralCode?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  loginPharmacy: (identifier: string) => Promise<{ success: boolean; error?: string }>;
  registerSupplier: (data: {
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
  }) => Promise<{ success: boolean; error?: string }>;
  loginSupplier: (identifier: string) => Promise<{ success: boolean; error?: string }>;
  approveUser: (userId: string) => Promise<{ success: boolean; error?: string }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<'ar' | 'en'>('ar');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('dawana_authenticated') === 'true';
  });
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('catalog');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('register');

  const setLanguage = (lang: 'ar' | 'en') => {
    setLanguageState(lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const fetchSession = async () => {
    try {
      const res = await fetch('/api/session');
      const data = await res.json();
      setAllUsers(data.allUsers || []);

      const hasStoredAuth = localStorage.getItem('dawana_authenticated') === 'true';
      if (hasStoredAuth && data.currentUser) {
        setCurrentUser(data.currentUser);
        setIsAuthenticated(true);
        if (data.currentUser.role === 'supplier') {
          setActiveTab('supplier_orders');
        } else if (data.currentUser.role === 'rep') {
          setActiveTab('rep_overview');
        } else if (data.currentUser.role === 'admin') {
          setActiveTab('admin_overview');
        } else {
          setActiveTab('catalog');
        }
      } else {
        // Force gate: user must authenticate before seeing dashboard
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    } catch (err) {
      console.error('Failed to load session:', err);
      setIsAuthenticated(false);
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const switchUser = async (userId: string) => {
    try {
      const res = await fetch('/api/session/switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (data.currentUser) {
        localStorage.setItem('dawana_authenticated', 'true');
        setIsAuthenticated(true);
        setCurrentUser(data.currentUser);
        showToast(
          language === 'ar'
            ? `تم التبديل إلى: ${data.currentUser.name} (${data.currentUser.organizationName})`
            : `Switched to: ${data.currentUser.name} (${data.currentUser.organizationName})`
        );
        if (data.currentUser.role === 'supplier') {
          setActiveTab('supplier_orders');
        } else if (data.currentUser.role === 'rep') {
          setActiveTab('rep_overview');
        } else if (data.currentUser.role === 'admin') {
          setActiveTab('admin_overview');
        } else {
          setActiveTab('catalog');
        }
      }
    } catch (err) {
      console.error('Failed to switch user:', err);
    }
  };

  const addToCart = (offer: SupplierOffer, product: Product, quantity: number) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.offerId === offer.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex].quantity = Math.min(newQty, offer.stockQuantity);
        return updated;
      } else {
        const newItem: CartItem = {
          offerId: offer.id,
          productId: product.id,
          productName: product.nameEn,
          brand: product.brand,
          activeIngredient: product.activeIngredient,
          dosageForm: product.dosageForm,
          strength: product.strength,
          packageSize: product.packageSize,
          supplierId: offer.supplierId,
          supplierName: offer.supplierName,
          supplierGov: offer.supplierGov,
          unitPriceIQD: offer.priceIQD,
          quantity: Math.max(quantity, offer.minOrderQty),
          minOrderQty: offer.minOrderQty,
          stockQuantity: offer.stockQuantity,
          batchNumber: offer.batchNumber,
          expiryDate: offer.expiryDate,
        };
        return [...prev, newItem];
      }
    });

    showToast(
      language === 'ar'
        ? `تمت إضافة ${product.nameAr} إلى السلة من ${offer.supplierName}`
        : `Added ${product.nameEn} to cart from ${offer.supplierName}`
    );
  };

  const updateCartQuantity = (offerId: string, quantity: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.offerId === offerId) {
            const validQty = Math.max(0, Math.min(quantity, item.stockQuantity));
            return { ...item, quantity: validQty };
          }
          return item;
        })
        .filter(item => item.quantity > 0)
    );
  };

  const removeFromCart = (offerId: string) => {
    setCart(prev => prev.filter(item => item.offerId !== offerId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotalIQD = cart.reduce((sum, item) => sum + item.unitPriceIQD * item.quantity, 0);
  const cartSuppliersCount = new Set(cart.map(i => i.supplierId)).size;
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const openLoginModal = () => {
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  const openRegisterModal = () => {
    setAuthModalMode('register');
    setIsAuthModalOpen(true);
  };

  const registerPharmacy = async (data: {
    name: string;
    phone: string;
    governorate: string;
    licenseNumber: string;
    organizationName?: string;
    referralCode?: string;
  }) => {
    try {
      const res = await fetch('/api/auth/register-pharmacy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        return { success: false, error: result.error || 'فشل في تسجيل الصيدلية' };
      }

      if (result.currentUser) {
        localStorage.setItem('dawana_authenticated', 'true');
        setIsAuthenticated(true);
        setCurrentUser(result.currentUser);
        setAllUsers(result.allUsers || []);
        setActiveTab('catalog');
        setIsAuthModalOpen(false);
        showToast(
          language === 'ar'
            ? `مرحباً بك د. ${result.currentUser.name} في منصة نبض!`
            : `Welcome Dr. ${result.currentUser.name} to Nabdh!`
        );
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'حدث خطأ في الاتصال بالخادم' };
    }
  };

  const loginPharmacy = async (identifier: string) => {
    try {
      const res = await fetch('/api/auth/login-pharmacy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier }),
      });
      const result = await res.json();
      if (!res.ok) {
        return { success: false, error: result.error || 'تعذر تسجيل الدخول' };
      }

      if (result.currentUser) {
        localStorage.setItem('dawana_authenticated', 'true');
        setIsAuthenticated(true);
        setCurrentUser(result.currentUser);
        setAllUsers(result.allUsers || []);
        if (result.currentUser.role === 'supplier') {
          setActiveTab('supplier_orders');
        } else if (result.currentUser.role === 'rep') {
          setActiveTab('rep_overview');
        } else if (result.currentUser.role === 'admin') {
          setActiveTab('admin_overview');
        } else {
          setActiveTab('catalog');
        }
        setIsAuthModalOpen(false);
        showToast(
          language === 'ar'
            ? `تم تسجيل الدخول بنجاح: ${result.currentUser.organizationName || result.currentUser.name}`
            : `Logged in successfully: ${result.currentUser.organizationName || result.currentUser.name}`
        );
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'حدث خطأ في الاتصال بالخادم' };
    }
  };

  const registerSupplier = async (data: {
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
  }) => {
    try {
      const res = await fetch('/api/auth/register-supplier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'فشل تسجيل المكتب');
      }
      if (result.currentUser) {
        localStorage.setItem('dawana_authenticated', 'true');
        setIsAuthenticated(true);
        setCurrentUser(result.currentUser);
        setAllUsers(result.allUsers || []);
        setActiveTab('supplier_inventory');
        setIsAuthModalOpen(false);
        showToast(
          language === 'ar'
            ? `مرحباً بك! تم تسجيل ${result.currentUser.organizationName} بنجاح، والحساب قيد تدقيق الإدارة لتفعيل البيع.`
            : `Welcome! ${result.currentUser.organizationName} registered successfully. Verification pending.`
        );
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'حدث خطأ في الاتصال بالخادم' };
    }
  };

  const loginSupplier = async (identifier: string) => {
    try {
      const res = await fetch('/api/auth/login-supplier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier }),
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'تعذر تسجيل الدخول للمكتب');
      }
      if (result.currentUser) {
        localStorage.setItem('dawana_authenticated', 'true');
        setIsAuthenticated(true);
        setCurrentUser(result.currentUser);
        setAllUsers(result.allUsers || []);
        setActiveTab('supplier_orders');
        setIsAuthModalOpen(false);
        showToast(
          language === 'ar'
            ? `تم تسجيل الدخول بنجاح لبوابة المكاتب: ${result.currentUser.organizationName}`
            : `Logged in to Offices Portal: ${result.currentUser.organizationName}`
        );
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'حدث خطأ في الاتصال بالخادم' };
    }
  };

  const approveUser = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      setAllUsers(result.allUsers || []);
      if (currentUser?.id === userId) {
        setCurrentUser(result.user);
      }
      showToast(
        language === 'ar'
          ? `تم اعتماد وتفعيل صلاحيات البيع للمؤسسة ${result.user.organizationName} بنجاح`
          : `Approved and verified ${result.user.organizationName}`
      );
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('dawana_authenticated');
      setIsAuthenticated(false);
      setCurrentUser(null);
      await fetch('/api/auth/logout', { method: 'POST' });
      showToast(
        language === 'ar'
          ? 'تم تسجيل الخروج بنجاح. يرجى تسجيل الدخول مجدداً للوصول للمنصة.'
          : 'Logged out successfully. Please sign in to access the platform.'
      );
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        currentUser,
        allUsers,
        switchUser,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotalIQD,
        cartSuppliersCount,
        cartItemsCount,
        isCartOpen,
        setIsCartOpen,
        activeTab,
        setActiveTab,
        toastMessage,
        showToast,
        refreshUserData: fetchSession,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        openLoginModal,
        openRegisterModal,
        registerPharmacy,
        loginPharmacy,
        registerSupplier,
        loginSupplier,
        approveUser,
        isAuthenticated,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
