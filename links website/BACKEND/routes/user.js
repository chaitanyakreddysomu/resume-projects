const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');

router.get('/profile', auth, userController.getProfile);
// router.put('/profile', auth, userController.updatePersonal);

router.put('/profile/personal', auth, userController.updatePersonal);
router.put('/profile/security', auth, userController.updateSecurity);
router.put('/profile/payment', auth, userController.updatePayment);
router.get('/dashboard', auth, userController.getDashboard);
router.get('/earnings', auth, userController.getEarnings);
router.get('/earnings/analytics', auth, userController.getEarningsAnalytics);
router.get('/time-based-analytics', auth, userController.getTimeBasedAnalytics);
router.get('/transactions', auth, userController.getTransactions);
router.post('/profile/payment/send-otp', auth, userController.sendUpiOtp);
router.post('/profile/payment/send-withdrawal-otp', auth, userController.sendWithdrawalOtp);
router.post('/profile/payment/verify-otp', auth, userController.verifyUpiOtp);
router.delete('/profile/payment', auth, userController.deleteUpiWithOtp);
router.get('/settings', auth, userController.getSettings);

module.exports = router; 