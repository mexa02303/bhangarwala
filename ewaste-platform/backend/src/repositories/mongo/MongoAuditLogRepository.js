const AuditLog = require('../../models/AuditLog');

class MongoAuditLogRepository {
  async create(logData) {
    const log = new AuditLog(logData);
    const saved = await log.save();
    return saved.toObject();
  }

  async findAll({ page = 1, limit = 50, action, targetEntity }) {
    const query = {};
    if (action) query.action = action;
    if (targetEntity) query.targetEntity = targetEntity;

    const total = await AuditLog.countDocuments(query);
    const logs = await AuditLog.find(query)
      .populate('performedBy', 'fullName email role')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return { logs, total, page, pages: Math.ceil(total / limit) };
  }
}

module.exports = MongoAuditLogRepository;
