/**
 * E-Waste Case Workflow Transition Engine
 * ----------------------------------------
 * Enforces valid state machine transitions server-side.
 * Records audit logs and status history entries for every status change.
 */

const repo = require('../repositories/repositoryFactory');

const ALLOWED_TRANSITIONS = {
  'Submitted': ['Under Review', 'Agent Assigned', 'Rejected', 'Cancelled'],
  'Under Review': ['Agent Assigned', 'Assessment Confirmed', 'Needs More Information', 'Rejected', 'Cancelled'],
  'Agent Assigned': ['Under Review', 'Assessment Confirmed', 'Needs More Information', 'Rejected', 'Cancelled'],
  'Assessment Confirmed': ['Awaiting Collection', 'Under Review', 'Cancelled'],
  'Awaiting Collection': ['Collected', 'Cancelled'],
  'Collected': ['Repair / Refurbishment / Recycling', 'Cancelled'],
  'Repair / Refurbishment / Recycling': ['Completed'],
  'Needs More Information': ['Under Review', 'Submitted', 'Cancelled'],
  'Rejected': [], // Terminal
  'Cancelled': [], // Terminal
  'Completed': []  // Terminal
};

class WorkflowService {
  isValidTransition(currentStatus, targetStatus) {
    if (currentStatus === targetStatus) return true;
    const allowed = ALLOWED_TRANSITIONS[currentStatus] || [];
    return allowed.includes(targetStatus);
  }

  async transitionStatus({ caseId, newStatus, user, reasonOrNotes = '' }) {
    const caseDoc = await repo.cases.findById(caseId);
    if (!caseDoc) {
      throw new Error('Case not found');
    }

    const currentStatus = caseDoc.status;

    // Check transition validity
    if (!this.isValidTransition(currentStatus, newStatus)) {
      throw new Error(
        `Invalid workflow transition from '${currentStatus}' to '${newStatus}'. Allowed transitions: ${
          ALLOWED_TRANSITIONS[currentStatus]?.join(', ') || 'None (Terminal state)'
        }`
      );
    }

    // Role permission check
    if (user.role === 'user' && !['Cancelled'].includes(newStatus)) {
      throw new Error('Customers can only cancel their own pending submissions.');
    }

    // Perform Update
    const updateData = { status: newStatus };
    if (newStatus === 'Rejected') updateData.rejectionReason = reasonOrNotes;
    if (newStatus === 'Cancelled') updateData.cancellationReason = reasonOrNotes;

    const updatedCase = await repo.cases.update(caseId, updateData);

    // Record Status History
    await repo.statusHistory.create({
      caseId,
      previousStatus: currentStatus,
      newStatus,
      changedBy: user._id,
      changedByName: user.fullName,
      changedByRole: user.role,
      reasonOrNotes
    });

    // Record Audit Log
    await repo.auditLogs.create({
      action: 'CASE_STATUS_CHANGE',
      performedBy: user._id,
      performedByName: user.fullName,
      performedByRole: user.role,
      targetEntity: 'EWasteCase',
      targetId: caseId,
      details: { previousStatus: currentStatus, newStatus, reasonOrNotes }
    });

    return updatedCase;
  }
}

module.exports = new WorkflowService();
