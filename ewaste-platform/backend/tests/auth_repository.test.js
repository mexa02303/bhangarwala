const test = require('node:test');
const assert = require('node:assert');
const bcrypt = require('bcryptjs');
const repo = require('../src/repositories/repositoryFactory');

test('Repository Factory - MongoDB Provider Activated', () => {
  assert.ok(repo.users, 'User repository should be initialized');
  assert.ok(repo.cases, 'Case repository should be initialized');
  assert.ok(repo.assessments, 'Assessment repository should be initialized');
  assert.ok(repo.statusHistory, 'StatusHistory repository should be initialized');
  assert.ok(repo.auditLogs, 'AuditLog repository should be initialized');
  assert.ok(repo.chats, 'Chat repository should be initialized');
});

test('Password Security - Bcrypt Hashing Functionality', async () => {
  const plain = 'SecureSecretPassword123!';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(plain, salt);

  assert.notStrictEqual(plain, hash, 'Password hash must not match plaintext');
  const match = await bcrypt.compare(plain, hash);
  assert.strictEqual(match, true, 'Bcrypt compare must succeed for valid password');

  const mismatch = await bcrypt.compare('WrongPassword', hash);
  assert.strictEqual(mismatch, false, 'Bcrypt compare must fail for incorrect password');
});
