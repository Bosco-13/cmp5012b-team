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
            `SELECT (target_hour * 60 * 60 * 1000 + target_minutes * 60* 1000) AS target
            FROM healthsystem.profiles
            WHERE user_id = $1`,
            [req.session.userId]
        )
        if (result.rows.length == 0){
            return res.json({
                message: "No record of sleep",
                records: null,
                target: null
            })
            
        }
        res.json({
            message: "Record found: " + result.rows.length + " records",
            records: result.rows,
            target: target.rows[0].target
        })
        
    }
    catch(error){
        console.error("Sleep route error:", error);
        return res.status(500).json({
            message: "Server error",
            records: null,
            target: null
        });
    }
})

module.exports = router;