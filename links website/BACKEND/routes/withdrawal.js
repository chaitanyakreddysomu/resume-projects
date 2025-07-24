const express = require('express');
const router = express.Router();
const withdrawalController = require('../controllers/withdrawalController');
const auth = require('../middlewares/auth');
const adminController = require('../controllers/adminController');

// User endpoints
router.post('/request', auth, withdrawalController.requestWithdrawal);
router.get('/user', auth, withdrawalController.getUserWithdrawals);

// Admin endpoints - require admin authentication
router.get('/stats', auth, adminController.checkAdmin, withdrawalController.getWithdrawalStats);
router.get('/all', auth, adminController.checkAdmin, withdrawalController.getAllWithdrawals);
router.put('/:id/complete', auth, adminController.checkAdmin, withdrawalController.completeWithdrawal);
router.put('/:id/reject', auth, adminController.checkAdmin, withdrawalController.rejectWithdrawal);

module.exports = router; 