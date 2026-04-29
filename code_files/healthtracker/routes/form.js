const express = require('express');
const router = express.Router();
const pool = require('../db');
const requireLogin = require('../middleware/requireLogin');

router.post('/form', requireLogin, async (req, res) => {
  console.log('Profile route session user id:', req.session.userId);

  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ message: 'You must be logged in' });
  }

  const {
    age,
    gender,
    weight,
    height,
    fitness_goal,
    activity_level,
    target_weight,
    preferred_workout_type,
    dietary_preference,
    sleep_target
  } = req.body;

  if (
    age == null || age === '' ||
    gender == null || gender === '' ||
    weight == null || weight === '' ||
    height == null || height === '' ||
    fitness_goal == null || fitness_goal === '' ||
    activity_level == null || activity_level === ''
  ) {
    return res.status(400).json({ message: 'Please fill in all required fields' });
  }

  try {
    await pool.query(
      `INSERT INTO healthsystem.profiles (
        user_id,
        age,
        gender,
        weight,
        height,
        fitness_goal,
        activity_level,
        target_weight,
        preferred_workout_type,
        dietary_preference,
        sleep_target
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (user_id)
      DO UPDATE SET
        age = EXCLUDED.age,
        gender = EXCLUDED.gender,
        weight = EXCLUDED.weight,
        height = EXCLUDED.height,
        fitness_goal = EXCLUDED.fitness_goal,
        activity_level = EXCLUDED.activity_level,
        target_weight = EXCLUDED.target_weight,
        preferred_workout_type = EXCLUDED.preferred_workout_type,
        dietary_preference = EXCLUDED.dietary_preference,
        sleep_target = EXCLUDED.sleep_target`
      [
        userId,
        age,
        gender,
        weight,
        height,
        fitness_goal,
        activity_level,
        target_weight,
        preferred_workout_type,
        dietary_preference,
        sleep_target
      ]
    );

    res.status(200).json({ message: 'Profile saved successfully' });
  } catch (error) {
    console.error('Profile route error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;