const test = require('node:test');
const assert = require('node:assert');
const workflowService = require('../src/services/workflowService');
const assessmentService = require('../src/services/assessment/assessmentService');

test('Workflow State Machine - Valid Transitions', () => {
  assert.strictEqual(workflowService.isValidTransition('Submitted', 'Under Review'), true);
  assert.strictEqual(workflowService.isValidTransition('Under Review', 'Agent Assigned'), true);
  assert.strictEqual(workflowService.isValidTransition('Agent Assigned', 'Assessment Confirmed'), true);
  assert.strictEqual(workflowService.isValidTransition('Assessment Confirmed', 'Awaiting Collection'), true);
  assert.strictEqual(workflowService.isValidTransition('Awaiting Collection', 'Collected'), true);
  assert.strictEqual(workflowService.isValidTransition('Collected', 'Repair / Refurbishment / Recycling'), true);
  assert.strictEqual(workflowService.isValidTransition('Repair / Refurbishment / Recycling', 'Completed'), true);
});

test('Workflow State Machine - Invalid Transitions Rejected', () => {
  // Cannot jump directly from Submitted to Completed
  assert.strictEqual(workflowService.isValidTransition('Submitted', 'Completed'), false);
  // Terminal state cannot transition to anything
  assert.strictEqual(workflowService.isValidTransition('Completed', 'Under Review'), false);
  assert.strictEqual(workflowService.isValidTransition('Rejected', 'Agent Assigned'), false);
});

test('Assessment Engine - Scoring Logic & Transparency', async () => {
  const result = await assessmentService.evaluateDevice({
    category: 'laptop',
    physicalCondition: 'working',
    approxAge: '1-2 years',
    visibleDamage: 'Minor scratches',
    batteryStatus: 'Normal'
  });

  assert.ok(result.repairabilityScore > 50, 'Working laptop should have high repairability score');
  assert.ok(result.recyclingScore >= 80, 'Recycling score should be high');
  assert.strictEqual(result.isDemoMode, true, 'Default provider should be transparently labeled as demo mode');
  assert.ok(result.environmentalImpact.estimatedCo2SavedKg > 0, 'Should estimate positive CO2 saved');
});
