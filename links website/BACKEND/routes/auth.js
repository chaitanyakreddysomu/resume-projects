const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middlewares/auth');

router.post('/register', authController.register);
router.get('/verify/:token', authController.verifyEmail);
router.post('/login', authController.login);
router.post('/otp-verify', authController.otpVerify);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/me', auth, authController.getCurrentUser);

// Referral routes
router.get('/referral-info', auth, authController.getReferralInfo);
router.get('/referral/:referralCode', authController.getUserByReferralCode);

module.exports = router; 