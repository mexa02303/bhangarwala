const app = require('./ewaste-platform/backend/src/app');
const connectDB = require('./ewaste-platform/backend/src/config/db');

module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('Serverless DB error:', err);
  }
  return app(req, res);
};
