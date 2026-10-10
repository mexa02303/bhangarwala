const Assessment = require('../../models/Assessment');

class MongoAssessmentRepository {
  async findByCaseId(caseId) {
    return await Assessment.findOne({ caseId }).lean();
  }

  async findByTempId(tempId) {
    return await Assessment.findOne({ tempId }).lean();
  }

  async create(assessmentData) {
    const assessment = new Assessment(assessmentData);
    const saved = await assessment.save();
    return saved.toObject();
  }

  async update(id, updateData) {
    return await Assessment.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).lean();
  }

  async linkToCase(tempId, caseId) {
    return await Assessment.findOneAndUpdate(
      { tempId },
      { $set: { caseId } },
      { new: true }
    ).lean();
  }
}

module.exports = MongoAssessmentRepository;
