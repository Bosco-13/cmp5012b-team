const express = require('express');
const router = express.Router();
const pool = require('../db');

// dietplan.html
router.get('/dietplan', async (req,res) => {
    try{
        const result = await pool.query(
            `SELECT d.dish_id, di.food_title, d.date_logged 
            FROM healthsystem.dishes d 
            INNER JOIN healthsystem.dishinfo di
            ON d.dish_id = di.dish_id
            WHERE d.user_id = $1`,
            [req.session.userId]
        )
        if (result.rows.length == 0){
            return res.json({
                message: "No record of diet plan",
                records: [],
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
        console.error(error);
        res.status(500).json({
            message: "Server error"
        });
    }
})

// nutrition.html
router.get("/nutrition/:dishid", async(req, res) => {
    try{
        const dish = await pool.query(`
            SELECT food_title, calories, carbs, fat, protein, receipe, ingridient
            FROM healthsystem.dishinfo
            WHERE dish_id = $1`,
            [req.params.dishid]
        )
        return res.json({message: "Reord found", record: dish.rows})
    }
    catch(error){
        console.error("Nutrition route error:", error);
        return res.status(500).json({
            message: "Server error",
            records: null,
        });
    }
})

module.exports = router;