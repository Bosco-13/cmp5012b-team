const express = require('express');
const router = express.Router();
const pool = require('../db');
const requireLogin = require('../middleware/requireLogin');

router.get('/goals', requireLogin, async (req, res) => {
    try {
        const profileResult = await pool.query(
            `SELECT u.real_name, p.age, p.fitness_goal, p.target_sleep_hour, p.target_sleep_minitues, p.sleep_streak
             FROM healthsystem.users u
             JOIN healthsystem.profiles p ON u.id = p.user_id
             WHERE u.id = $1`,
            [req.session.userId]
        );

        const workoutResult = await pool.query(
            `SELECT DISTINCT workout_date
             FROM healthsystem.workouts
             WHERE user_id = $1
             ORDER BY workout_date DESC`,
            [req.session.userId]
        );

        const profile = profileResult.rows.length > 0 ? profileResult.rows[0] : {};
        const workoutDates = workoutResult.rows.map(r => r.workout_date);

        return res.json({ profile, workout_dates: workoutDates });
    } catch (error) {
        console.error('Goals GET error:', error);
        return res.status(500).json({ message: 'Server error: ' + error.message });
    }
});

module.exports = router;
