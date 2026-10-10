const repo = require('../repositories/repositoryFactory');
const assessmentService = require('../services/assessment/assessmentService');
const workflowService = require('../services/workflowService');
const storageAdapter = require('../services/storage/storageAdapter');

// Helper for generating unique case reference
const generateCaseReference = () => {
  const year = new Date().getFullYear();
  const randomHex = Math.floor(1000 + Math.random() * 9000);
  return `EWC-${year}-${randomHex}`;
};

// @desc    Upload product images
// @route   POST /api/cases/upload-images
// @access  Private
exports.uploadImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Please upload at least one image file.' });
    }

    const imageResults = [];
    for (const file of req.files) {
      const result = await storageAdapter.uploadFile(file);
      imageResults.push(result);
    }

    res.status(200).json({
      success: true,
      images: imageResults
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Preview / Draft assessment before submitting case
// @route   POST /api/cases/assess-draft
// @access  Private
exports.assessDraft = async (req, res, next) => {
  try {
    const assessment = await assessmentService.evaluateDevice(req.body);
    res.status(200).json({
      success: true,
      assessment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit e-waste case
// @route   POST /api/cases
// @access  Private (User)
exports.createCase = async (req, res, next) => {
  try {
    const {
      productName,
      category,
      brand,
      model,
      approxAge,
      quantity,
      physicalCondition,
      visibleDamage,
      missingComponents,
      batteryStatus,
      description,
      pickupAddress,
      preferredContact,
      images
    } = req.body;

    const caseReference = generateCaseReference();

    // 1. Create Case Document
    const caseData = {
      caseReference,
      userId: req.user._id,
      productName,
      category,
      brand: brand || '',
      model: model || '',
      approxAge: approxAge || 'Unknown',
      quantity: quantity || 1,
      physicalCondition,
      visibleDamage: visibleDamage || 'None reported',
      missingComponents: missingComponents || 'None',
      batteryStatus: batteryStatus || 'Normal',
      description: description || '',
      pickupAddress: pickupAddress || '',
      preferredContact: preferredContact || req.user.phone || req.user.email,
      images: images || [],
      status: 'Submitted'
    };

    const newCase = await repo.cases.create(caseData);

    // 2. Generate and store Assessment
    const assessmentData = await assessmentService.evaluateDevice(req.body);
    assessmentData.caseId = newCase._id;
    const savedAssessment = await repo.assessments.create(assessmentData);

    // 3. Record Initial Status History
    await repo.statusHistory.create({
      caseId: newCase._id,
      previousStatus: 'None',
      newStatus: 'Submitted',
      changedBy: req.user._id,
      changedByName: req.user.fullName,
      changedByRole: req.user.role,
      reasonOrNotes: 'Case submitted by user'
    });

    // 4. Audit Log
    await repo.auditLogs.create({
      action: 'CASE_CREATED',
      performedBy: req.user._id,
      performedByName: req.user.fullName,
      performedByRole: req.user.role,
      targetEntity: 'EWasteCase',
      targetId: newCase._id.toString(),
      details: { caseReference, category, productName }
    });

    res.status(201).json({
      success: true,
      message: `E-Waste case ${caseReference} submitted successfully`,
      case: newCase,
      assessment: savedAssessment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's submitted cases
// @route   GET /api/cases/my
// @access  Private (User)
exports.getMyCases = async (req, res, next) => {
  try {
    const { status, search, page, limit } = req.query;
    const result = await repo.cases.findByUser(req.user._id, { status, search, page, limit });

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single case by ID with assessment & timeline
// @route   GET /api/cases/:id
// @access  Private
exports.getCaseById = async (req, res, next) => {
  try {
    const caseDoc = await repo.cases.findById(req.params.id);
    if (!caseDoc) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    // Security Ownership Check for 'user' role
    if (req.user.role === 'user' && caseDoc.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Forbidden. You do not have permission to view this case.' });
    }

    // Security Agent Check for 'agent' role
    if (req.user.role === 'agent' && caseDoc.assignedAgentId?._id?.toString() !== req.user._id.toString()) {
      // Allow viewing if agent is unassigned or assigned to them
      if (caseDoc.assignedAgentId && caseDoc.assignedAgentId._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Forbidden. You are not the assigned agent for this case.' });
      }
    }

    // Fetch related assessment and status history
    const assessment = await repo.assessments.findByCaseId(caseDoc._id);
    const history = await repo.statusHistory.findByCaseId(caseDoc._id);

    // Sanitize internal notes for normal users
    let sanitizedCase = { ...caseDoc };
    if (req.user.role === 'user') {
      delete sanitizedCase.internalNotes;
    }

    res.status(200).json({
      success: true,
      case: sanitizedCase,
      assessment,
      statusHistory: history
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all cases (Admin)
// @route   GET /api/cases
// @access  Private (Admin)
exports.getAllCases = async (req, res, next) => {
  try {
    const { status, category, assignedAgentId, search, page, limit } = req.query;
    const result = await repo.cases.findAll({ status, category, assignedAgentId, search, page, limit });

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get cases assigned to current agent
// @route   GET /api/agent/cases
// @access  Private (Agent)
exports.getAgentCases = async (req, res, next) => {
  try {
    const { status, page, limit } = req.query;
    const result = await repo.cases.findAssignedToAgent(req.user._id, { status, page, limit });

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update case status with workflow engine validation
// @route   POST /api/cases/:id/status
// @access  Private (Admin, Agent, User for Cancelled)
exports.updateStatus = async (req, res, next) => {
  try {
    const { status, reasonOrNotes } = req.body;
    const caseId = req.params.id;

    const updatedCase = await workflowService.transitionStatus({
      caseId,
      newStatus: status,
      user: req.user,
      reasonOrNotes
    });

    res.status(200).json({
      success: true,
      message: `Case status updated to '${status}'`,
      case: updatedCase
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Assign or reassign case to agent
// @route   POST /api/cases/:id/assign
// @access  Private (Admin)
exports.assignAgent = async (req, res, next) => {
  try {
    const { agentId } = req.body;
    const caseId = req.params.id;

    const agent = await repo.users.findById(agentId);
    if (!agent || agent.role !== 'agent') {
      return res.status(400).json({ success: false, message: 'Invalid agent ID provided.' });
    }

    const updatedCase = await repo.cases.update(caseId, {
      assignedAgentId: agentId,
      assignedAt: new Date(),
      status: 'Agent Assigned'
    });

    // Status History
    await repo.statusHistory.create({
      caseId,
      previousStatus: updatedCase.status,
      newStatus: 'Agent Assigned',
      changedBy: req.user._id,
      changedByName: req.user.fullName,
      changedByRole: 'admin',
      reasonOrNotes: `Assigned case to field agent ${agent.fullName}`
    });

    // Audit Log
    await repo.auditLogs.create({
      action: 'CASE_ASSIGNED',
      performedBy: req.user._id,
      performedByName: req.user.fullName,
      performedByRole: 'admin',
      targetEntity: 'EWasteCase',
      targetId: caseId,
      details: { agentId, agentName: agent.fullName }
    });

    res.status(200).json({
      success: true,
      message: `Case assigned to agent ${agent.fullName}`,
      case: updatedCase
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add staff note (internal or public customer note)
// @route   POST /api/cases/:id/notes
// @access  Private (Admin, Agent)
exports.addNote = async (req, res, next) => {
  try {
    const { note, isInternal } = req.body;
    const caseId = req.params.id;

    const noteObj = {
      authorId: req.user._id,
      authorName: req.user.fullName,
      note,
      createdAt: new Date()
    };

    const updatedCase = await repo.cases.addNote(caseId, noteObj, isInternal);

    res.status(200).json({
      success: true,
      message: `${isInternal ? 'Internal' : 'Public'} note added successfully`,
      case: updatedCase
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update agent inspection findings & recommendation
// @route   POST /api/cases/:id/inspection
// @access  Private (Agent, Admin)
exports.updateInspection = async (req, res, next) => {
  try {
    const { inspectionFindings, recommendedAction } = req.body;
    const caseId = req.params.id;

    const updatedCase = await repo.cases.update(caseId, {
      inspectionFindings,
      recommendedAction
    });

    res.status(200).json({
      success: true,
      message: 'Inspection findings updated successfully',
      case: updatedCase
    });
  } catch (error) {
    next(error);
  }
};
