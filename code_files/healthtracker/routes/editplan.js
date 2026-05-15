const express = require('express');
const router = express.Router();
const pool = require('../db');
const requireLogin = require('../middleware/requireLogin');

router.post('/editplan', requireLogin, async(req, res) => {
    console.log("Editplan Route session user id: " + req.session.userId);
    data = req.body;
    console.log(data)
    const { diet, 
            type, 
            calories 
    } = data;
    try{
        let results;
        if(calories){
            results = await pool.query(
            `SELECT * FROM healthsystem.dishinfo
            WHERE meal_type = $1 
            AND diet = $2
            AND calories <= $3` ,
            [type, diet, calories]
        );
        }
        else{
            results = await pool.query(
            `SELECT * FROM healthsystem.dishinfo
            WHERE meal_type = $1 
            AND diet = $2` ,
            [type, diet])
        }
        
        if (results.rows.length == 0){
            return res.json({
                message: "No record of diet plan",
                records: []
            })
        }
        res.json({
            message: "Record found: " + results.rows.length + " records",
            records: results.rows
        })
    }
    catch(error){
        console.error(error);
        res.status(500).json({
            message: "Server error" + error,
            records: null
        });
    }
})

router.post('/adddietplan', requireLogin, async(req, res)=>{
    try{console.log("Editplan Route session user id: " + req.session.userId);
    const{
        dish_id,
        log_date
    } = req.body;
    console.log(dish_id);
    console.log(log_date)
    await pool.query(
      'INSERT INTO healthsystem.dishes ( user_id, dish_id, date_logged) VALUES($1, $2, $3)',
      [req.session.userId, dish_id, log_date]
    );
    return res.status(200).json({ message: 'diet plan added' }
    )}
    catch(error){
        res.status(500).json({
            message: "Server error" + error,
            records: null
        });
    }
})





module.exports = router;