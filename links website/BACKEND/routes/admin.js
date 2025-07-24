const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminSettingsController = require('../controllers/adminSettingsController');
const auth = require('../middlewares/auth');

// Add admin check middleware to all admin routes
router.use(auth, adminController.checkAdmin);

router.get('/dashboard', adminController.getDashboard);
router.get('/users', adminController.getUsers);
router.get('/user/:id', adminController.getUserDetails);
router.put('/user/:id/suspend', adminController.suspendUser);
router.put('/user/:id/activate', adminController.activateUser);
router.get('/payments', adminController.getPayments);
router.get('/payments/stats', adminController.getPaymentStats);
router.get('/user/:id/analytics', auth, adminController.getUserAnalytics);
router.get('/links', adminController.getAllLinks);

// ===== WITHDRAWAL MANAGEMENT ROUTES =====
router.get('/withdraw', adminController.getAllWithdrawals);
router.get('/withdraw/stats', adminController.getWithdrawalStats);
router.get('/withdraw/:id', adminController.getWithdrawalById);
router.put('/withdraw/:id/complete', adminController.completeWithdrawal);
router.put('/withdraw/:id/reject', adminController.rejectWithdrawal);

// ===== ADMIN SETTINGS ROUTES =====
router.get('/settings', adminSettingsController.getSettings);
router.put('/settings/cpm', adminSettingsController.updateCpmSettings);
router.put('/settings/general', adminSettingsController.updateGeneralSettings);

module.exports = router; 