const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/sleep', async(req, res) => {
    try{
        const result = await pool.query(
            `SELECT sleep_id, start_time, end_time, (end_time - start_time) AS duration
             FROM healthsystem.sleep
             WHERE user_id = $1`,
            [req.session.userId]
        )
        const target = await pool.query(
            `SELECT target_sleep_hour, target_sleep_minitues, sleep_streak
            FROM healthsystem.profiles
            WHERE user_id = $1`,
            [req.session.userId]
        )
        return res.json({
            message: "Record found: " + result.rows.length + " records",
            records: result.rows,
            target: target.rows
        })
        
    }
    catch(error){
        console.error("Sleep route error:", error);
        return res.status(500).json({
            message: "Server error: " + error.message,
        });
    }
})

router.post('/sleep', async (req, res) => {
    try {
        const { hours, minutes } = req.body;

        if (hours == null || minutes == null || hours < 0 || minutes < 0 || minutes > 59) {
            return res.status(400).json({ message: 'Invalid hours or minutes.' });
        }

        const profileResult = await pool.query(
            `SELECT target_sleep_hour, target_sleep_minitues, sleep_streak
             FROM healthsystem.profiles WHERE user_id = $1`,
            [req.session.userId]
        );

        if (profileResult.rows.length === 0) {
            return res.status(400).json({ message: 'No profile found.' });
        }

        const { target_sleep_hour, target_sleep_minitues, sleep_streak } = profileResult.rows[0];

        if (target_sleep_hour == null || target_sleep_minitues == null) {
            return res.status(400).json({ message: 'Sleep goal not set. Please set one in Settings.' });
        }

        const loggedMins = Number(hours) * 60 + Number(minutes);
        const goalMins = Number(target_sleep_hour) * 60 + Number(target_sleep_minitues);
        const metGoal = loggedMins >= goalMins;
        const newStreak = metGoal ? (Number(sleep_streak) || 0) + 1 : 0;

        await pool.query(
            `UPDATE healthsystem.profiles SET sleep_streak = $1 WHERE user_id = $2`,
            [newStreak, req.session.userId]
        );

        const endTime = new Date();
        const startTime = new Date(endTime.getTime() - (Number(hours) * 3600000 + Number(minutes) * 60000));
        await pool.query(
            `INSERT INTO healthsystem.sleep (user_id, start_time, end_time) VALUES ($1, $2, $3)`,
            [req.session.userId, startTime, endTime]
        );

        return res.json({ streak: newStreak, met_goal: metGoal });
    } catch (error) {
        console.error('Sleep POST error:', error);
        return res.status(500).json({ message: 'Server error: ' + error.message });
    }
});

module.exports = router;