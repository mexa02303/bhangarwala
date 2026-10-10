const express = require('express');
const router = express.Router();
const caseController = require('../controllers/caseController');
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect, authorize('agent', 'admin'));

router.get('/cases', caseController.getAgentCases);
router.get('/analytics', adminController.getAnalytics);

module.exports = router;
