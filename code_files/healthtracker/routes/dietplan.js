const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/dietplan', (req,res) => {
    res.sendFile(path.join(__dirname, "/dietplan.html"));
    try{
        const result = pool.query(
            `SELECT food_title, date_logged 
            FROM dishes 
            WHERE user_id = $1`,
            [res.session.userId]
        )
        if (result.rows.length == 0){
            return res.json({
                message: "No record of diet plan",
                records: null,
                active_date: new Date()
            })
        }
        res.json({
            message: "Record found: " + result.rows.length + " records",
            records: result.rows,
            active_date: new Date()
        })
    }
    catch(error){

    }
})

router.get('./routes/dietplan/:date', (req,res) => {
    res.sendFile(path.join(__dirname, "/dietplan.html"));
    try{
        const result = pool.query(
            `SELECT food_title, calories, fat, protein, date_logged 
            FROM dishes 
            WHERE user_id = $1`,
            [res.session.userId]
        )
        if (result.rows.length == 0){
            return res.json({
                message: "No record of diet plan",
                records: null,
                active_date: req.params.date.getDate()
            })
        }
        res.json({
            message: "Record found: " + result.rows.length + " records",
            records: result.rows,
            active_date: req.params.date.getDate()
        })
    }
    catch(error){

    }
})

module.exports = router;