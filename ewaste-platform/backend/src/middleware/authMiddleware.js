const jwt = require('jsonwebtoken');
const repo = require('../repositories/repositoryFactory');

/**
 * Verifies JWT token from HttpOnly cookie or Authorization header.
 * Attaches verified user object to req.user.
 */
const protect = async (req, res, next) => {
  let token = null;

  // 1. Check HttpOnly Cookie
  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  // 2. Fallback to Bearer Token Header
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. Please log in to access this resource.'
    });
  }

  try {
    const secret = process.env.JWT_SECRET || 'super-secret-jwt-key-ewaste-intelligence-2026';
    const decoded = jwt.verify(token, secret);

    const user = await repo.users.findById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User account no longer exists or has been deactivated.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authentication token is invalid or has expired.'
    });
  }
};

/**
 * Enforces role authorization server-side.
 * @param  {...String} roles Permitted roles e.g. 'admin', 'agent'
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. Role '${req.user?.role || 'Guest'}' is not authorized to perform this operation.`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
