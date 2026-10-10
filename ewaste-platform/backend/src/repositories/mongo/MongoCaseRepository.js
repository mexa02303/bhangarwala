const EWasteCase = require('../../models/EWasteCase');

class MongoCaseRepository {
  async findById(id) {
    return await EWasteCase.findById(id)
      .populate('userId', 'fullName email username phone')
      .populate('assignedAgentId', 'fullName email username')
      .populate('internalNotes.authorId', 'fullName role')
      .populate('publicNotes.authorId', 'fullName role')
      .lean();
  }

  async findByReference(caseReference) {
    return await EWasteCase.findOne({ caseReference })
      .populate('userId', 'fullName email username phone')
      .populate('assignedAgentId', 'fullName email username')
      .lean();
  }

  async create(caseData) {
    const newCase = new EWasteCase(caseData);
    const saved = await newCase.save();
    return saved.toObject();
  }

  async update(id, updateData) {
    return await EWasteCase.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate('userId', 'fullName email username phone')
      .populate('assignedAgentId', 'fullName email username')
      .lean();
  }

  async addNote(id, noteObj, isInternal = false) {
    const updateField = isInternal ? { internalNotes: noteObj } : { publicNotes: noteObj };
    return await EWasteCase.findByIdAndUpdate(
      id,
      { $push: updateField },
      { new: true }
    ).lean();
  }

  async findByUser(userId, { status, search, page = 1, limit = 20 }) {
    const query = { userId };
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { caseReference: { $regex: search, $options: 'i' } },
        { productName: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }
    const total = await EWasteCase.countDocuments(query);
    const cases = await EWasteCase.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return { cases, total, page, pages: Math.ceil(total / limit) };
  }

  async findAll({ status, category, assignedAgentId, search, page = 1, limit = 50 }) {
    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (assignedAgentId) query.assignedAgentId = assignedAgentId;
    if (search) {
      query.$or = [
        { caseReference: { $regex: search, $options: 'i' } },
        { productName: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }
    const total = await EWasteCase.countDocuments(query);
    const cases = await EWasteCase.find(query)
      .populate('userId', 'fullName email username')
      .populate('assignedAgentId', 'fullName email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return { cases, total, page, pages: Math.ceil(total / limit) };
  }

  async findAssignedToAgent(agentId, { status, page = 1, limit = 50 }) {
    const query = { assignedAgentId: agentId };
    if (status) query.status = status;

    const total = await EWasteCase.countDocuments(query);
    const cases = await EWasteCase.find(query)
      .populate('userId', 'fullName email phone')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return { cases, total, page, pages: Math.ceil(total / limit) };
  }

  async countByStatus(queryFilter = {}) {
    return await EWasteCase.aggregate([
      { $match: queryFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
  }

  async countByCategory(queryFilter = {}) {
    return await EWasteCase.aggregate([
      { $match: queryFilter },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
  }

  async getMonthlyTrends() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    return await EWasteCase.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
  }
}

module.exports = MongoCaseRepository;
