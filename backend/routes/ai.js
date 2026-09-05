const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const auth = require('../middleware/auth');

// POST /api/ai/chat — AI Tax Advisor chat (public — no auth required)
router.post('/chat', aiController.chat);

// POST /api/ai/insights — Generate AI insights (protected)
router.post('/insights', auth, aiController.insights);

module.exports = router;
