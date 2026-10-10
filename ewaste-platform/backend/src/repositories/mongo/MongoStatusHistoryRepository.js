const StatusHistory = require('../../models/StatusHistory');

class MongoStatusHistoryRepository {
  async create(historyData) {
    const history = new StatusHistory(historyData);
    const saved = await history.save();
    return saved.toObject();
  }

  async findByCaseId(caseId) {
    return await StatusHistory.find({ caseId })
      .populate('changedBy', 'fullName role')
      .sort({ createdAt: 1 })
      .lean();
  }
}

module.exports = MongoStatusHistoryRepository;
