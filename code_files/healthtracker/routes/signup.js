const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/signup', async (req, res) => {
    const { real_name, email, password } = req.body;

    if (!real_name || !email || !password) {
        return res.status(400).json({
            message: 'All fields are required.'
        });
    }

    try {
        const existingUser = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                message: 'Email or username already exists.'
            });
        }

        await pool.query(
            'INSERT INTO users (real_name, email, password) VALUES ($1, $2, $3)',
            [real_name, email, password]
        );

        res.status(201).json({
            message: 'Account created successfully.'
        });
    } catch (error) {
        console.error('Signup route error:', error);
        res.status(500).json({
            message: 'Server error.'
        });
    }
});

module.exports = router;