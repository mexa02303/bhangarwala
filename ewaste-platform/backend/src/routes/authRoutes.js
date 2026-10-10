const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { registerSchema, loginSchema, changePasswordSchema, validate } = require('../validators/authValidators');

// Rate limiting on login and registration endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // max 20 login attempts per IP
  message: { success: false, message: 'Too many login/registration attempts. Please try again in 15 minutes.' }
});

router.post('/register', authLimiter, validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/logout', protect, authController.logout);
router.get('/me', protect, authController.getMe);
router.patch('/me', protect, authController.updateProfile);
router.post('/change-password', protect, validate(changePasswordSchema), authController.changePassword);

module.exports = router;
