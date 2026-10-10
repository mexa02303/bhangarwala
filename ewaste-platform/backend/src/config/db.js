const mongoose = require('mongoose');
const dns = require('dns');

// Resolve MongoDB Atlas SRV records reliably if local ISP DNS refuses querySrv
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  // Use default OS resolver if custom cannot be set
}

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ewaste_platform';
    const conn = await mongoose.connect(connStr);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] ${error.message}`);
    // Fall back or exit cleanly depending on environment
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
