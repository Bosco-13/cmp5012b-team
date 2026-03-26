const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1 AND password = $2',
      [username, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid login details' });
    }

    req.session.userId = result.rows[0].id;

    console.log('DB user id:', result.rows[0].id);
    console.log('Session user id:', req.session.userId);

    res.json({ message: 'Login successful', user: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;