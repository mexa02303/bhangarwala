const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const repo = require('../repositories/repositoryFactory');

// Generate JWT Helper
const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const secret = process.env.JWT_SECRET || 'super-secret-jwt-key-ewaste-intelligence-2026';
  const token = jwt.sign({ id: user._id, role: user.role }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });

  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
  };

  const userObj = {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    username: user.username,
    role: user.role,
    phone: user.phone || '',
    createdAt: user.createdAt
  };

  res
    .status(statusCode)
    .cookie('jwt', token, options)
    .json({
      success: true,
      message,
      token,
      user: userObj
    });
};

// @desc    Register a public user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { fullName, email, username, password, phone } = req.body;

    // Security check: Check existing email or username
    const existingEmail = await repo.users.findByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ success: false, message: 'Email address is already registered.' });
    }

    const existingUsername = await repo.users.findByUsername(username);
    if (existingUsername) {
      return res.status(400).json({ success: false, message: 'Username is already taken.' });
    }

    // Force role to 'user' for public registration
    const user = await repo.users.create({
      fullName,
      email,
      username,
      password,
      phone: phone || '',
      role: 'user'
    });

    // Record Audit Log
    await repo.auditLogs.create({
      action: 'USER_REGISTERED',
      performedBy: user._id,
      performedByName: user.fullName,
      performedByRole: 'user',
      targetEntity: 'User',
      targetId: user._id.toString(),
      details: { email: user.email }
    });

    sendTokenResponse(user, 201, res, 'Registration successful');
  } catch (error) {
    next(error);
  }
};

// @desc    Login user / agent / admin
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Fetch user with password included
    const user = await repo.users.findByEmail(email, true);

    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Log Successful Audit
    await repo.auditLogs.create({
      action: 'USER_LOGIN',
      performedBy: user._id,
      performedByName: user.fullName,
      performedByRole: user.role,
      targetEntity: 'User',
      targetId: user._id.toString(),
      details: { role: user.role }
    });

    sendTokenResponse(user, 200, res, `Welcome back, ${user.fullName}`);
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user & clear cookie
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  res.cookie('jwt', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: 'Successfully logged out'
  });
};

// @desc    Get current authenticated user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
};

// @desc    Update profile info (name, phone)
// @route   PATCH /api/users/me
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { fullName, phone } = req.body;
    const updateFields = {};
    if (fullName) updateFields.fullName = fullName;
    if (phone !== undefined) updateFields.phone = phone;

    const updatedUser = await repo.users.update(req.user._id, updateFields);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   POST /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await repo.users.findByEmail(req.user.email, true);
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await repo.users.update(req.user._id, { password: hashedPassword });

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
};
