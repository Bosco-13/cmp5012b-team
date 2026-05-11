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
    real_name,
    age,
    gender,
    weight,
    height,
    fitness_goal,
    activity_level,
    target_weight,
    preferred_workout_type,
    dietary_preference,
    target_sleep_hour,
    target_sleep_minitues
  } = req.body;

  if (
    age == null || age === '' ||
    gender == null || gender === '' ||
    weight == null || weight === '' ||
    height == null || height === '' ||
    fitness_goal == null || fitness_goal === '' ||
    activity_level == null || activity_level === '' ||
    target_sleep_hour == null || target_sleep_hour === '' ||
    target_sleep_minitues == null || target_sleep_minitues === ''
  ) {
    return res.status(400).json({ message: 'Please fill in all required fields' });
  }

  const sleepHourNumber = Number(target_sleep_hour);
  const sleepMinutesNumber = Number(target_sleep_minitues);

  if (
    Number.isNaN(sleepHourNumber) ||
    Number.isNaN(sleepMinutesNumber) ||
    sleepHourNumber < 0 ||
    sleepHourNumber > 23 ||
    sleepMinutesNumber < 0 ||
    sleepMinutesNumber > 59
  ) {
    return res.status(400).json({ message: 'Invalid sleep target' });
  }

  try {
    if (real_name != null && real_name.trim() !== '') {
      await pool.query(
        `UPDATE healthsystem.users
         SET real_name = $1
         WHERE id = $2`,
        [real_name.trim(), userId]
      );
    }

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
        target_sleep_hour,
        target_sleep_minitues
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
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
        target_sleep_hour = EXCLUDED.target_sleep_hour,
        target_sleep_minitues = EXCLUDED.target_sleep_minitues`,
      [
        userId,
        age,
        gender,
        weight,
        height,
        fitness_goal,
        activity_level,
        target_weight || null,
        preferred_workout_type || null,
        dietary_preference || null,
        sleepHourNumber,
        sleepMinutesNumber
      ]
    );

    return res.status(200).json({ message: 'Profile saved successfully' });

  } catch (error) {
    console.error('Profile route error:', error);
    return res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

module.exports = router;