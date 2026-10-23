import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { db } from './src/server/db';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = 3000;

async function startServer() {
  const app = express();

  app.use(express.json());

  // API Endpoints
  // Session & User management
  app.get('/api/session', (req, res) => {
    try {
      const user = db.getCurrentUser();
      const allUsers = db.getUsers();
      res.json({ currentUser: user, allUsers });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/session/switch', (req, res) => {
    try {
      const { userId } = req.body;
      const user = db.setCurrentUserId(userId);
      res.json({ currentUser: user });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post('/api/auth/register-pharmacy', (req, res) => {
    try {
      const { name, phone, governorate, organizationName, licenseNumber, referralCode } = req.body;
      const result = db.registerPharmacy({
        name,
        phone,
        governorate,
        organizationName,
        licenseNumber,
        referralCode,
      });
      res.json({
        success: true,
        currentUser: result.user,
        verificationDocument: result.document,
        allUsers: db.getUsers(),
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post('/api/auth/login-pharmacy', (req, res) => {
    try {
      const { identifier } = req.body;
      const user = db.loginPharmacy(identifier);
      res.json({
        success: true,
        currentUser: user,
        allUsers: db.getUsers(),
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post('/api/auth/register-supplier', (req, res) => {
    try {
      const {
        name,
        phone,
        organizationName,
        supplierType,
        legalEntityName,
        governorate,
        addressDetails,
        licenseNumber,
        commercialRegister,
        email,
      } = req.body;
      const result = db.registerSupplier({
        name,
        phone,
        organizationName,
        supplierType,
        legalEntityName,
        governorate,
        addressDetails,
        licenseNumber,
        commercialRegister,
        email,
      });
      res.json({
        success: true,
        currentUser: result.user,
        verificationDocument: result.document,
        allUsers: db.getUsers(),
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post('/api/auth/login-supplier', (req, res) => {
    try {
      const { identifier } = req.body;
      const user = db.loginSupplier(identifier);
      res.json({
        success: true,
        currentUser: user,
        allUsers: db.getUsers(),
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    try {
      db.clearCurrentUser();
      res.json({ success: true, message: 'Logged out successfully' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Supplier Products & Offers Management
  app.post('/api/supplier/products', (req, res) => {
    try {
      const currentUser = db.getCurrentUser();
      if (!currentUser || (currentUser.role !== 'supplier' && currentUser.role !== 'admin')) {
        return res.status(403).json({ error: 'صلاحيات غير مصرح بها. فقط المكاتب والمذاخر الدوائية تملك صلاحية إضافة الأدوية.' });
      }
      const result = db.addNewProductAndOffer(req.body, currentUser);
      res.json({
        success: true,
        product: result.product,
        offer: result.offer,
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post('/api/supplier/offers/:id/toggle', (req, res) => {
    try {
      const currentUser = db.getCurrentUser();
      const updated = db.toggleOfferStatus(req.params.id, currentUser);
      res.json({ success: true, offer: updated });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.delete('/api/supplier/offers/:id', (req, res) => {
    try {
      const currentUser = db.getCurrentUser();
      db.deleteOffer(req.params.id, currentUser);
      res.json({ success: true, message: 'Offer deleted successfully' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post('/api/admin/users/:id/approve', (req, res) => {
    try {
      const currentUser = db.getCurrentUser();
      if (currentUser.role !== 'admin' && currentUser.id !== req.params.id) {
        return res.status(403).json({ error: 'Admin or account owner approval only' });
      }
      const approvedUser = db.approveUser(req.params.id, currentUser);
      res.json({ success: true, user: approvedUser, allUsers: db.getUsers() });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Products & Offers
  app.get('/api/products', (req, res) => {
    try {
      const { q, category, manufacturer } = req.query;
      const products = db.getProductsWithOffers(
        q as string,
        category as string,
        manufacturer as string
      );
      res.json({ products });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/products/:id', (req, res) => {
    try {
      const product = db.getProductDetail(req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json({ product });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/offers', (req, res) => {
    try {
      const currentUser = db.getCurrentUser();
      const { offerId, updates, newOffer } = req.body;

      if (offerId) {
        const updated = db.updateOffer(offerId, updates, currentUser);
        res.json({ offer: updated });
      } else if (newOffer) {
        const created = db.addOffer(newOffer, currentUser);
        res.json({ offer: created });
      } else {
        res.status(400).json({ error: 'Missing offer payload' });
      }
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Cart Split & Checkout
  app.post('/api/cart/checkout', (req, res) => {
    try {
      const currentUser = db.getCurrentUser();
      if (currentUser.role !== 'pharmacy') {
        return res.status(403).json({ error: 'Only licensed pharmacies can submit purchase orders' });
      }
      const { deliveryAddress, items } = req.body;
      const order = db.checkoutSplitCart({
        pharmacy: currentUser,
        deliveryAddress: deliveryAddress || currentUser.governorate,
        items,
      });
      res.json({ order });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Orders & Suborders
  app.get('/api/orders', (req, res) => {
    try {
      const currentUser = db.getCurrentUser();
      const orders = db.getOrders(currentUser);
      res.json({ orders });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/suborders/:id', (req, res) => {
    try {
      const sub = db.getSuborderById(req.params.id);
      if (!sub) return res.status(404).json({ error: 'Suborder not found' });
      res.json({ suborder: sub });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/suborders/:id/action', (req, res) => {
    try {
      const currentUser = db.getCurrentUser();
      const { action, payload } = req.body;
      const updated = db.updateSuborderAction(req.params.id, action, payload || {}, currentUser);
      res.json({ suborder: updated });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Verification Documents
  app.get('/api/verifications', (req, res) => {
    try {
      const docs = db.getVerificationDocuments();
      res.json({ documents: docs });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/verifications/:id/review', (req, res) => {
    try {
      const currentUser = db.getCurrentUser();
      if (currentUser.role !== 'admin') {
        return res.status(403).json({ error: 'Only platform admin can verify licenses' });
      }
      const { status, rejectionReason } = req.body;
      const reviewed = db.reviewVerificationDocument(req.params.id, status, rejectionReason, currentUser);
      res.json({ document: reviewed });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Financial Metrics & Reports
  app.get('/api/financials', (req, res) => {
    try {
      const metrics = db.getFinancialMetrics();
      const commissions = db.getCommissions();
      res.json({ metrics, commissions });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Representative Analytics
  app.get('/api/rep/stats', (req, res) => {
    try {
      const currentUser = db.getCurrentUser();
      const repCode = (req.query.code as string) || currentUser.repCode || 'REP-BGW-104';
      const stats = db.getRepresentativeStats(repCode);
      res.json({ stats });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Audit Logs & Disputes
  app.get('/api/audit-logs', (req, res) => {
    try {
      const logs = db.getAuditLogs();
      res.json({ logs });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/disputes', (req, res) => {
    try {
      const disputes = db.getDisputes();
      res.json({ disputes });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/disputes', (req, res) => {
    try {
      const currentUser = db.getCurrentUser();
      const dispute = db.addDispute(req.body, currentUser);
      res.json({ dispute });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Settings & Reset
  app.get('/api/settings', (req, res) => {
    try {
      res.json({ settings: db.getSettings() });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/settings', (req, res) => {
    try {
      const currentUser = db.getCurrentUser();
      if (currentUser.role !== 'admin') {
        return res.status(403).json({ error: 'Admin only' });
      }
      const settings = db.updateSettings(req.body, currentUser);
      res.json({ settings });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post('/api/reset', (req, res) => {
    try {
      db.resetToSample();
      res.json({ success: true, message: 'Database reset to initial demo seed' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Dev server via Vite middlewares or production static build
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Iraqi Pharma B2B Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server start error:', err);
  process.exit(1);
});
