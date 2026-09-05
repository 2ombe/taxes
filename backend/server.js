const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const taxRoutes = require('./routes/tax');
const aiRoutes = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check (for Cloud Run)
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'AGN Bridge Consult API', timestamp: new Date().toISOString() }));

// Check DB connection middleware (non-blocking for health & AI routes)
app.use((req, res, next) => {
  const isExempt = req.path === '/health' || req.path.startsWith('/api/ai/chat');
  if (!isExempt && mongoose.connection.readyState !== 1 && req.path.startsWith('/api')) {
    return res.status(503).json({
      error: 'Database not connected. Please check MongoDB connection.',
    });
  }
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tax', taxRoutes);
app.use('/api/ai', aiRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.path} not found.` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error.' });
});

// Start Server (before DB connection for Cloud Run health checks)
const server = app.listen(PORT, () => {
  console.log(`🚀 AGN Bridge Consult API running on port ${PORT}`);
  console.log(`🌐 API ready at http://localhost:${PORT}/api`);
  console.log(`🤖 AI Advisor endpoint: POST /api/ai/chat`);
});

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI is not defined in environment variables.');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    if (err.name === 'MongooseServerSelectionError') {
      console.log('\n--- TROUBLESHOOTING ---');
      console.log('1. Is your IP whitelisted in MongoDB Atlas? (Allow 0.0.0.0/0 for Cloud Run)');
      console.log('2. Are MONGO_URI credentials correct in .env?');
      console.log('3. Is port 27017 open on your network?');
      console.log('------------------------\n');
    }
  });
