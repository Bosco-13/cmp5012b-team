const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const pool = require('../db');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const result = await pool.query(
      'SELECT id, real_name, email, password_hash FROM healthsystem.users WHERE email = $1',
      [normalizedEmail]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid login details' });
    }

    const user = result.rows[0];

    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid login details' });
    }

    req.session.userId = user.id;

    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      console.log('Logged in DB user id:', user.id);
      console.log('Stored session user id:', req.session.userId);

      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          real_name: user.real_name,
          email: user.email
        }
      });
    });
  } catch (error) {
    console.error('Login route error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;