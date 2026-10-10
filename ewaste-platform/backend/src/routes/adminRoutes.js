const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { createAgentSchema, validate } = require('../validators/authValidators');

router.use(protect);

// Analytics accessible to Admin and Agent
router.get('/analytics', authorize('admin', 'agent'), adminController.getAnalytics);

// Admin-only endpoints
router.use(authorize('admin'));

router.get('/users', adminController.getUsers);
router.patch('/users/:id/toggle-status', adminController.toggleUserStatus);

router.get('/agents', adminController.getAgents);
router.post('/agents', validate(createAgentSchema), adminController.createAgent);

router.get('/audit-logs', adminController.getAuditLogs);
router.get('/export-cases', adminController.exportCasesCsv);

module.exports = router;
