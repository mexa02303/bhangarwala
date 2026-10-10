const express = require('express');
const router = express.Router();
const caseController = require('../controllers/caseController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { caseSubmissionSchema, statusUpdateSchema, noteSchema } = require('../validators/caseValidators');
const { validate } = require('../validators/authValidators');

router.use(protect);

// Image Upload
router.post('/upload-images', upload.array('images', 5), caseController.uploadImages);

// Draft Assessment Preview
router.post('/assess-draft', caseController.assessDraft);

// Case Creation & Listing
router.post('/', validate(caseSubmissionSchema), caseController.createCase);
router.get('/my', caseController.getMyCases);
router.get('/', authorize('admin'), caseController.getAllCases);
router.get('/:id', caseController.getCaseById);

// Workflow Status & Management
router.post('/:id/status', validate(statusUpdateSchema), caseController.updateStatus);
router.post('/:id/assign', authorize('admin'), caseController.assignAgent);
router.post('/:id/notes', authorize('admin', 'agent'), validate(noteSchema), caseController.addNote);
router.post('/:id/inspection', authorize('agent', 'admin'), caseController.updateInspection);

module.exports = router;
