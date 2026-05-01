const express = require('express');
const router = express.Router();
const pool = require('../db');
const requireLogin = require('../middleware/requireLogin');

router.get('/goals', requireLogin, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT target_sleep_hour, target_sleep_minitues, sleep_streak
             FROM healthsystem.profiles
             WHERE user_id = $1`,
            [req.session.userId]
        );
        if (result.rows.length === 0) {
            return res.json({ target_sleep_hour: null, target_sleep_minitues: null, sleep_streak: 0 });
        }
        return res.json(result.rows[0]);
    } catch (error) {
        console.error('Goals GET error:', error);
        return res.status(500).json({ message: 'Server error: ' + error.message });
    }
});

module.exports = router;
