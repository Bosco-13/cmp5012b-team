const express = require('express');
const router = express.Router();
const pool = require('../db');
const requireLogin = require('../middleware/requireLogin');

router.get('/dashboard', requireLogin, async (req, res) => {
    try {
        const userId = req.session.userId;

        const workoutResult = await pool.query(
            `SELECT duration_hours FROM healthsystem.workouts WHERE user_id = $1`,
            [userId]
        );
        const workouts = workoutResult.rows;
        const totalWorkouts = workouts.length;
        const totalHours = workouts.reduce((sum, w) => sum + parseFloat(w.duration_hours || 0), 0);
        const caloriesBurned = Math.round(totalHours * 348);

        const sleepResult = await pool.query(
            `SELECT start_time, end_time FROM healthsystem.sleep WHERE user_id = $1 ORDER BY start_time ASC`,
            [userId]
        );
        const sleepRecords = sleepResult.rows;

        let avgSleepHours = 0;
        let latestSleepScore = 0;

        if (sleepRecords.length > 0) {
            const durations = sleepRecords.map(r => (new Date(r.end_time) - new Date(r.start_time)) / (1000 * 60 * 60));
            avgSleepHours = parseFloat((durations.reduce((a, b) => a + b, 0) / durations.length).toFixed(1));

            const profileResult = await pool.query(
                `SELECT target_sleep_hour, target_sleep_minitues FROM healthsystem.profiles WHERE user_id = $1`,
                [userId]
            );
            if (profileResult.rows.length > 0) {
                const p = profileResult.rows[0];
                const targetHour = Number(p.target_sleep_hour);
                const targetMin = Number(p.target_sleep_minitues);
                if (!Number.isNaN(targetHour) && targetHour > 0) {
                    const targetMins = targetHour * 60 + (Number.isNaN(targetMin) ? 0 : targetMin);
                    const latest = sleepRecords[sleepRecords.length - 1];
                    const latestMins = (new Date(latest.end_time) - new Date(latest.start_time)) / (1000 * 60);
                    let score;
                    if (latestMins <= targetMins) {
                        score = (latestMins / targetMins) * 100;
                    } else {
                        score = 100 - ((latestMins - targetMins) / targetMins) * 50;
                    }
                    latestSleepScore = Math.round(Math.max(0, Math.min(score, 100)));
                }
            }
        }

        const goalsResult = await pool.query(
            `SELECT COUNT(*) AS count FROM healthsystem.goals WHERE user_id = $1`,
            [userId]
        );
        const activeGoals = Number(goalsResult.rows[0].count);

        const today = new Date().toISOString().slice(0, 10);
        const dietResult = await pool.query(
            `SELECT COALESCE(SUM(di.calories), 0) AS total_calories
             FROM healthsystem.dishes d
             INNER JOIN healthsystem.dishinfo di ON d.dish_id = di.dish_id
             WHERE d.user_id = $1 AND d.date_logged = $2`,
            [userId, today]
        );
        const todayCalories = Number(dietResult.rows[0].total_calories);

        return res.json({
            workouts: { completed: totalWorkouts, hours: parseFloat(totalHours.toFixed(1)), calories: caloriesBurned },
            sleep: { avgHours: avgSleepHours, score: latestSleepScore },
            goals: { active: activeGoals },
            diet: { todayCalories }
        });

    } catch (error) {
        console.error('Dashboard GET error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
