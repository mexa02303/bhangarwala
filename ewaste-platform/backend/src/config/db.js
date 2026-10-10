const mongoose = require('mongoose');
const dns = require('dns');

// In local Windows environments, resolve SRV using Google DNS if ISP DNS fails
if (process.env.NODE_ENV !== 'production') {
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
  } catch (e) {
    // fallback to OS DNS
  }
}

let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ewaste_platform';
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 8000
    });
    cachedConnection = conn;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] ${error.message}`);
    // Do not crash serverless instance with process.exit
  }
};

module.exports = connectDB;
