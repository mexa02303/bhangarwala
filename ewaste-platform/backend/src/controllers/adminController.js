const repo = require('../repositories/repositoryFactory');

// @desc    Get all users (with search and role filters)
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getUsers = async (req, res, next) => {
  try {
    const { role, search, page, limit } = req.query;
    const result = await repo.users.findAllUsers({ role, search, page, limit });

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all agents
// @route   GET /api/admin/agents
// @access  Private (Admin)
exports.getAgents = async (req, res, next) => {
  try {
    const agents = await repo.users.findAgents();
    res.status(200).json({
      success: true,
      count: agents.length,
      agents
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new agent staff account
// @route   POST /api/admin/agents
// @access  Private (Admin)
exports.createAgent = async (req, res, next) => {
  try {
    const { fullName, email, username, password, phone } = req.body;

    const existingEmail = await repo.users.findByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ success: false, message: 'Email address already exists.' });
    }

    const existingUsername = await repo.users.findByUsername(username);
    if (existingUsername) {
      return res.status(400).json({ success: false, message: 'Username already taken.' });
    }

    const agent = await repo.users.create({
      fullName,
      email,
      username,
      password,
      phone: phone || '',
      role: 'agent'
    });

    // Audit Log
    await repo.auditLogs.create({
      action: 'AGENT_CREATED',
      performedBy: req.user._id,
      performedByName: req.user.fullName,
      performedByRole: 'admin',
      targetEntity: 'User',
      targetId: agent._id.toString(),
      details: { email: agent.email, username: agent.username }
    });

    res.status(201).json({
      success: true,
      message: `Agent account created for ${agent.fullName}`,
      agent
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user/agent account active status
// @route   PATCH /api/admin/users/:id/toggle-status
// @access  Private (Admin)
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await repo.users.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot deactivate Admin accounts.' });
    }

    const updatedUser = await repo.users.update(req.params.id, { isActive: !user.isActive });

    await repo.auditLogs.create({
      action: 'USER_STATUS_TOGGLED',
      performedBy: req.user._id,
      performedByName: req.user.fullName,
      performedByRole: 'admin',
      targetEntity: 'User',
      targetId: req.params.id,
      details: { newActiveState: !user.isActive }
    });

    res.status(200).json({
      success: true,
      message: `Account status updated to ${updatedUser.isActive ? 'Active' : 'Inactive'}`,
      user: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get aggregate platform analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin, Agent)
exports.getAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await repo.users.countByRole('user');
    const totalAgents = await repo.users.countByRole('agent');

    const statusCountsRaw = await repo.cases.countByStatus();
    const categoryCountsRaw = await repo.cases.countByCategory();
    const monthlyTrends = await repo.cases.getMonthlyTrends();

    // Map aggregated metrics
    const statusDistribution = {};
    let totalCases = 0;
    let completedCases = 0;
    let pendingCases = 0;

    statusCountsRaw.forEach((item) => {
      statusDistribution[item._id] = item.count;
      totalCases += item.count;
      if (item._id === 'Completed') completedCases += item.count;
      if (['Submitted', 'Under Review', 'Agent Assigned', 'Awaiting Collection'].includes(item._id)) {
        pendingCases += item.count;
      }
    });

    const categoryDistribution = categoryCountsRaw.map((item) => ({
      category: item._id,
      count: item.count
    }));

    res.status(200).json({
      success: true,
      analytics: {
        totalUsers,
        totalAgents,
        totalCases,
        completedCases,
        pendingCases,
        statusDistribution,
        categoryDistribution,
        monthlyTrends
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get platform audit logs
// @route   GET /api/admin/audit-logs
// @access  Private (Admin)
exports.getAuditLogs = async (req, res, next) => {
  try {
    const { page, limit, action, targetEntity } = req.query;
    const result = await repo.auditLogs.findAll({ page, limit, action, targetEntity });

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export authorized cases data to CSV
// @route   GET /api/admin/export-cases
// @access  Private (Admin)
exports.exportCasesCsv = async (req, res, next) => {
  try {
    const { cases } = await repo.cases.findAll({ limit: 1000 });

    let csvContent = 'Case Reference,Product Name,Category,Condition,Status,Assigned Agent,User Email,Created Date\n';

    cases.forEach((c) => {
      const ref = c.caseReference;
      const pName = `"${(c.productName || '').replace(/"/g, '""')}"`;
      const cat = c.category;
      const cond = c.physicalCondition;
      const status = c.status;
      const agent = c.assignedAgentId ? `"${c.assignedAgentId.fullName}"` : 'Unassigned';
      const userEmail = c.userId ? c.userId.email : 'Unknown';
      const date = new Date(c.createdAt).toISOString().split('T')[0];

      csvContent += `${ref},${pName},${cat},${cond},${status},${agent},${userEmail},${date}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="ewaste_cases_export.csv"');
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};
