const express = require('express');
const router = express.Router();
const pool = require('../db');
const requireLogin = require('../middleware/requireLogin');

router.get('/goals', requireLogin, async (req, res) => {
    try {
        const profileResult = await pool.query(
            `SELECT 
                u.real_name, 
                p.age, 
                p.fitness_goal, 
                p.target_sleep_hour, 
                p.target_sleep_minitues, 
                p.sleep_streak
             FROM healthsystem.users u
             JOIN healthsystem.profiles p 
             ON u.id = p.user_id
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

        const sleepGoalsResult = await pool.query(
            `SELECT goal_id, goal_category, goal_type, target_value
             FROM healthsystem.goals
             WHERE user_id = $1
             AND goal_category = 'sleep'
             ORDER BY goal_id`,
            [req.session.userId]
        );

        const latestSleepResult = await pool.query(
            `SELECT start_time, end_time
             FROM healthsystem.sleep
             WHERE user_id = $1
             AND start_time IS NOT NULL
             AND end_time IS NOT NULL
             ORDER BY end_time DESC
             LIMIT 1`,
            [req.session.userId]
        );

        const profile = profileResult.rows.length > 0 ? profileResult.rows[0] : {};
        const workoutDates = workoutResult.rows.map(r => r.workout_date);

        const sleepStreak = Number(profile.sleep_streak) || 0;
        const sleepScore = calculateSleepScore(profile, latestSleepResult.rows[0]);

        return res.json({
            profile,
            workout_dates: workoutDates,
            sleep_goals: sleepGoalsResult.rows,
            sleep_metrics: {
                sleep_streak: sleepStreak,
                sleep_score: sleepScore
            }
        });

    } catch (error) {
        console.error('Goals GET error:', error);
        return res.status(500).json({ message: 'Server error: ' + error.message });
    }
});

router.post('/goals/sleep', requireLogin, async (req, res) => {
    try {
        const goalType = req.body.goal_type;
        const targetValue = Number(req.body.target_value);

        const allowedGoalTypes = ['sleep_streak', 'sleep_score'];

        if (!allowedGoalTypes.includes(goalType)) {
            return res.status(400).json({
                message: 'Invalid sleep goal type.'
            });
        }

        if (!Number.isInteger(targetValue) || targetValue <= 0) {
            return res.status(400).json({
                message: 'Target must be a positive whole number.'
            });
        }

        if (goalType === 'sleep_score' && targetValue > 100) {
            return res.status(400).json({
                message: 'Sleep score target cannot be above 100.'
            });
        }

        const result = await pool.query(
            `INSERT INTO healthsystem.goals 
                (user_id, goal_category, goal_type, target_value)
             VALUES 
                ($1, 'sleep', $2, $3)
             ON CONFLICT (user_id, goal_type)
             DO UPDATE SET
                target_value = EXCLUDED.target_value,
                updated_at = CURRENT_TIMESTAMP
             RETURNING goal_id, goal_category, goal_type, target_value`,
            [req.session.userId, goalType, targetValue]
        );

        return res.json({
            message: 'Sleep goal saved.',
            goal: result.rows[0]
        });

    } catch (error) {
        console.error('Sleep goal POST error:', error);
        return res.status(500).json({ message: 'Server error: ' + error.message });
    }
});

function calculateSleepScore(profile, latestSleep) {
    if (!latestSleep || !latestSleep.start_time || !latestSleep.end_time) {
        return 0;
    }

    const start = new Date(latestSleep.start_time);
    const end = new Date(latestSleep.end_time);

    const durationMs = end - start;
    const durationHours = durationMs / 1000 / 60 / 60;

    if (durationHours <= 0) {
        return 0;
    }

    const targetHour = Number(profile.target_sleep_hour);
    const targetMinutes = Number(profile.target_sleep_minitues);

    let targetSleepHours = 8;

    if (!Number.isNaN(targetHour) && targetHour > 0) {
        targetSleepHours = targetHour + ((Number.isNaN(targetMinutes) ? 0 : targetMinutes) / 60);
    }

    const score = Math.round((durationHours / targetSleepHours) * 100);

    return Math.max(0, Math.min(score, 100));
}

module.exports = router;