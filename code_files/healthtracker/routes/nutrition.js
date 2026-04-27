const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get("/nutrition/:dishid", async(req, res) => {
    try{
        const dish = await pool.query(`
            SELECT food_title, calories, fat, protein, receipe, ingridient
            FROM dishinfo
            WHERE dish_id = $1`,
            [req.params.dishid]
        )
    }
    catch(error){
        console.error("Nutrition route error:", error);
        return res.status(500).json({
            message: "Server error",
            records: null,
            target: null
        });
    }
})

module.exports = router;