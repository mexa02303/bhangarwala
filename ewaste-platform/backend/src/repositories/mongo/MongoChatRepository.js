const ChatMessage = require('../../models/ChatMessage');

class MongoChatRepository {
  async create(chatData) {
    const msg = new ChatMessage(chatData);
    const saved = await msg.save();
    return saved.toObject();
  }

  async findByUser(userId, limit = 50) {
    return await ChatMessage.find({ userId })
      .sort({ createdAt: 1 })
      .limit(limit)
      .lean();
  }

  async deleteByUser(userId) {
    return await ChatMessage.deleteMany({ userId });
  }
}

module.exports = MongoChatRepository;
