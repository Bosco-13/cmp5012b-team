const express = require('express');
const router = express.Router();
const pool = require('../db');

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