/**
 * Repository Factory & Interface Abstraction Layer
 * ------------------------------------------------
 * This layer decouples Express controllers and business logic from specific database drivers.
 * 
 * Configurable via process.env.DATABASE_PROVIDER:
 * - 'mongodb' (default): Uses MongoUserRepository, MongoCaseRepository, etc.
 * - 'dynamodb': Architecture ready for Amazon DynamoDB Single-Table / Multi-Table design using AWS SDK v3.
 * 
 * Documentation for Future DynamoDB Implementation:
 * 1. User table (PK: USER#<id>, SK: METADATA#USER) or GSI1 (GSI1PK: EMAIL#<email>)
 * 2. EWasteCase table (PK: CASE#<id>, SK: METADATA#CASE, GSI1PK: USER#<userId>, GSI2PK: AGENT#<agentId>)
 * 3. Assessment table (PK: ASSESSMENT#<id>, GSI1PK: CASE#<caseId>)
 * 4. StatusHistory (PK: CASE#<caseId>, SK: STATUS#<timestamp>)
 * 
 * A DynamoDB adapter class (e.g. DynamoUserRepository) would implement the exact methods:
 * - findById(id), findByEmail(email), create(userData), update(id, data), etc.
 * without requiring ANY modifications to controllers or services.
 */

const MongoUserRepository = require('./mongo/MongoUserRepository');
const MongoCaseRepository = require('./mongo/MongoCaseRepository');
const MongoAssessmentRepository = require('./mongo/MongoAssessmentRepository');
const MongoStatusHistoryRepository = require('./mongo/MongoStatusHistoryRepository');
const MongoAuditLogRepository = require('./mongo/MongoAuditLogRepository');
const MongoChatRepository = require('./mongo/MongoChatRepository');

class RepositoryFactory {
  constructor() {
    const provider = (process.env.DATABASE_PROVIDER || 'mongodb').toLowerCase();

    if (provider === 'mongodb') {
      this.users = new MongoUserRepository();
      this.cases = new MongoCaseRepository();
      this.assessments = new MongoAssessmentRepository();
      this.statusHistory = new MongoStatusHistoryRepository();
      this.auditLogs = new MongoAuditLogRepository();
      this.chats = new MongoChatRepository();
    } else if (provider === 'dynamodb') {
      throw new Error(
        'DynamoDB adapter configured in environment, but DynamoDB adapter classes have not been activated. Please install AWS SDK DynamoDB client and configure DYNAMODB_TABLE_NAME.'
      );
    } else {
      throw new Error(`Unsupported DATABASE_PROVIDER: ${provider}`);
    }
  }
}

// Export singleton factory instance
module.exports = new RepositoryFactory();
