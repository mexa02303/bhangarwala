const User = require('../../models/User');

class MongoUserRepository {
  async findById(id) {
    return await User.findById(id).lean();
  }

  async findByEmail(email, includePassword = false) {
    const query = User.findOne({ email: email.toLowerCase() });
    if (includePassword) {
      query.select('+password');
    }
    return await query.lean();
  }

  async findByUsername(username) {
    return await User.findOne({ username }).lean();
  }

  async create(userData) {
    const user = new User(userData);
    const saved = await user.save();
    const obj = saved.toObject();
    delete obj.password;
    return obj;
  }

  async update(id, updateData) {
    return await User.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true }).select('-password').lean();
  }

  async findAllUsers({ role, search, page = 1, limit = 50 }) {
    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } }
      ];
    }
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return { users, total, page, pages: Math.ceil(total / limit) };
  }

  async findAgents() {
    return await User.find({ role: 'agent' }).select('-password').sort({ fullName: 1 }).lean();
  }

  async countByRole(role) {
    const query = role ? { role } : {};
    return await User.countDocuments(query);
  }
}

module.exports = MongoUserRepository;
