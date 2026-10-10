const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const caseRoutes = require('./routes/caseRoutes');
const adminRoutes = require('./routes/adminRoutes');
const agentRoutes = require('./routes/agentRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();

// Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);

// CORS configuration for local & production origins
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Allow dev environments or Amplify origin
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Serve Static Uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Root & Favicon Handlers
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'E-Waste Intelligence & Circular Recovery API',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      cases: '/api/cases',
      admin: '/api/admin',
      chat: '/api/chat'
    }
  });
});

app.get('/favicon.ico', (req, res) => res.status(204).end());

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'E-Waste Intelligence API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    databaseProvider: process.env.DATABASE_PROVIDER || 'mongodb',
    storageProvider: process.env.STORAGE_PROVIDER || 'local'
  });
});

// API Routes Mapping
app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/chat', chatRoutes);

// 404 Route Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route '${req.originalUrl}' not found on this server.`
  });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[API Error]:', err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

module.exports = app;
