require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Initialize Database connection and launch server
const startServer = async () => {
  if ((process.env.DATABASE_PROVIDER || 'mongodb').toLowerCase() === 'mongodb') {
    await connectDB();
  } else {
    console.log(`[Database] Running on Provider: ${process.env.DATABASE_PROVIDER}`);
  }

  const server = app.listen(PORT, () => {
    console.log(`
======================================================
🌱 E-WASTE INTELLIGENCE PLATFORM BACKEND ACTIVE
📡 Server URL: http://localhost:${PORT}
🏥 Health Check: http://localhost:${PORT}/health
💾 Database Provider: ${process.env.DATABASE_PROVIDER || 'mongodb'}
📦 Storage Adapter: ${process.env.STORAGE_PROVIDER || 'local'}
======================================================
    `);
  });

  process.on('unhandledRejection', (err) => {
    console.error(`[Unhandled Rejection Error]: ${err.message}`);
    // Keep server running in dev mode
  });
};

startServer();
