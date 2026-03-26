const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND password = $2',
      [email, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid login details' });
    }

    req.session.userId = result.rows[0].id;

    console.log('Logged in DB user id:', result.rows[0].id);
    console.log('Stored session user id:', req.session.userId);

    res.json({ message: 'Login successful', user: result.rows[0] });
  } catch (error) {
    console.error('Login route error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;