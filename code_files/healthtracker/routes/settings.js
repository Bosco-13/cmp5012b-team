const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const pool = require('../db');
const requireLogin = require('../middleware/requireLogin');

console.log('settings routes loaded');


router.get('/settings/profile', requireLogin, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT real_name, email FROM healthsystem.users WHERE id = $1',
      [req.session.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error('Settings GET profile error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/settings/profile', requireLogin, async (req, res) => {
  const { real_name, email } = req.body;

  if (!real_name || real_name.trim() === '') {
    return res.status(400).json({ message: 'Name cannot be empty' });
  }
  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'Invalid email address' });
  }

  try {
    const existing = await pool.query(
      'SELECT id FROM healthsystem.users WHERE email = $1 AND id != $2',
      [email.trim().toLowerCase(), req.session.userId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    await pool.query(
      'UPDATE healthsystem.users SET real_name = $1, email = $2 WHERE id = $3',
      [real_name.trim(), email.trim().toLowerCase(), req.session.userId]
    );

    return res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Settings POST profile error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/settings/password', requireLogin, async (req, res) => {
  const { current_password, new_password, confirm_password } = req.body;

  if (!current_password || !new_password || !confirm_password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  if (new_password !== confirm_password) {
    return res.status(400).json({ message: 'New passwords do not match' });
  }
  if (new_password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters' });
  }

  try {
    const result = await pool.query(
      'SELECT password_hash FROM healthsystem.users WHERE id = $1',
      [req.session.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordMatches = await bcrypt.compare(current_password, result.rows[0].password_hash);

    if (!passwordMatches) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const newHash = await bcrypt.hash(new_password, 10);

    await pool.query(
      'UPDATE healthsystem.users SET password_hash = $1 WHERE id = $2',
      [newHash, req.session.userId]
    );

    return res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Settings POST password error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/settings/goals', requireLogin, async (req, res) => {
  try{
    const result = await pool.query(
      `SELECT goal_type, target_value FROM healthsystem.goals WHERE user_id = $1 AND goal_type IN ('steps', 'calories', 'sleep')`,
      [req.session.userId]
    );

    const goals = {steps: '', calories: '', sleep: ''};
    result.rows.forEach(row => {
      goals[row.goal_type] = row.target_value;
    });

    return res.json(goals);
  } catch (error) {
    console.error('Settings GET goals error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/settings/goals', requireLogin, async (req, res) => {
  const { steps, calories, sleep } = req.body;

  const stepsNum = parseInt(steps);
  const caloriesNum = parseInt(calories);
  const sleepNum = parseInt(sleep);

  if (!Number.isInteger(stepsNum) || stepsNum <= 0) {
    return res.status(400).json({ message: 'Error Invalid Steps Goal' });
  }
  if(!Number.isInteger(caloriesNum) || caloriesNum <= 0) {
    return res.status(400).json({ message: 'Error Invalid Calories Goal' });
  }
  if(!Number.isInteger(sleepNum) || sleepNum <= 0) {
    return res.status(400).json({ message: 'Error Invalid Sleep Goal' });
  }

  try{
    const upsert = (goalType, value) => pool.query(
      `INSERT INTO healthsystem.goals (user_id, goal_category, goal_type, target_value) VALUES ($1,'fitness', $2, $3) ON CONFLICT (user_id, goal_type) DO UPDATE SET target_value = EXCLUDED.target_value`,
      [req.session.userId, goalType, value]
    );

    await Promise.all([
      upsert('steps', stepsNum),
      upsert('calories', caloriesNum),
      upsert('sleep', sleepNum)
    ]);

    return res.json({ message: 'Goals updated successfully' });
  } catch (error) {
    console.error('Settings POST goals error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;
