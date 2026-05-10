const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/sleep', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({
        message: 'Not logged in.'
      });
    }

    const sleepResult = await pool.query(
      `SELECT sleep_id, start_time, end_time
       FROM healthsystem.sleep
       WHERE user_id = $1
       ORDER BY start_time ASC`,
      [req.session.userId]
    );

    const targetResult = await pool.query(
      `SELECT target_sleep_hour, target_sleep_minitues, sleep_streak
       FROM healthsystem.profiles
       WHERE user_id = $1`,
      [req.session.userId]
    );

    return res.json({
      message: `Record found: ${sleepResult.rows.length} records`,
      records: sleepResult.rows,
      target: targetResult.rows
    });

  } catch (error) {
    console.error('Sleep GET error:', error);

    return res.status(500).json({
      message: 'Server error: ' + error.message
    });
  }
});

router.post('/sleep', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({
        message: 'Not logged in.'
      });
    }

    const { hours, minutes } = req.body;

    const sleepHours = Number(hours);
    const sleepMinutes = Number(minutes);

    if (
      Number.isNaN(sleepHours) ||
      Number.isNaN(sleepMinutes) ||
      sleepHours < 0 ||
      sleepHours > 24 ||
      sleepMinutes < 0 ||
      sleepMinutes > 59 ||
      (sleepHours === 24 && sleepMinutes > 0)
    ) {
      return res.status(400).json({
        message: 'Invalid hours or minutes.'
      });
    }

    const profileResult = await pool.query(
      `SELECT target_sleep_hour, target_sleep_minitues, sleep_streak
       FROM healthsystem.profiles
       WHERE user_id = $1`,
      [req.session.userId]
    );

    if (profileResult.rows.length === 0) {
      return res.status(400).json({
        message: 'No profile found. Please complete your profile first.'
      });
    }

    const profile = profileResult.rows[0];

    if (
      profile.target_sleep_hour == null ||
      profile.target_sleep_minitues == null
    ) {
      return res.status(400).json({
        message: 'Sleep goal not set. Please set one in your profile.'
      });
    }

    const loggedMinutes = sleepHours * 60 + sleepMinutes;
    const targetMinutes =
      Number(profile.target_sleep_hour) * 60 +
      Number(profile.target_sleep_minitues);

    const metGoal = loggedMinutes >= targetMinutes;
    const currentStreak = Number(profile.sleep_streak) || 0;
    const newStreak = metGoal ? currentStreak + 1 : 0;

    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - loggedMinutes * 60000);

    await pool.query(
      `INSERT INTO healthsystem.sleep (user_id, start_time, end_time)
       VALUES ($1, $2, $3)`,
      [req.session.userId, startTime, endTime]
    );

    await pool.query(
      `UPDATE healthsystem.profiles
       SET sleep_streak = $1
       WHERE user_id = $2`,
      [newStreak, req.session.userId]
    );

    return res.json({
      message: 'Sleep logged successfully.',
      streak: newStreak,
      met_goal: metGoal
    });

  } catch (error) {
    console.error('Sleep POST error:', error);

    return res.status(500).json({
      message: 'Server error: ' + error.message
    });
  }
});

module.exports = router;