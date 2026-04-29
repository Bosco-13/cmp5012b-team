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
            `SELECT target_sleep_hour, target_sleep_minitues
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

module.exports = router;