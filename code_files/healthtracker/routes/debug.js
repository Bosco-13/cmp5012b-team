const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/me', (req, res) => {
  res.json({ userId: req.session.userId || null });
});

router.get('/debug/headers', (req, res) => {
  res.json({
    cookieHeader: req.headers.cookie || null,
    sessionID: req.sessionID,
    sessionUserId: req.session?.userId || null,
    session: req.session
  });
});

router.get('/debug/profile', async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({
        message: 'No logged in user in session'
      });
    }

    const result = await pool.query(
      'SELECT * FROM healthsystem.profiles WHERE user_id = $1',
      [userId]
    );

    res.json({
      sessionUserId: userId,
      profile: result.rows[0] || null
    });
  } catch (error) {
    console.error('Debug profile route error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;