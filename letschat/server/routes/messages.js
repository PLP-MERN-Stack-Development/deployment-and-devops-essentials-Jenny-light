const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const authMiddleware = require('../middleware/auth');

// Get messages
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { room = 'general', limit = 50 } = req.query;
    
    const messages = await Message.find({ room })
      .populate('sender', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;