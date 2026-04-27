const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/index', (req,res) => {
    try{
        const result = pool.query(
            `SELECT calories_burned,  `
        )
    }
    catch(error){

    }
})

module.exports = router;