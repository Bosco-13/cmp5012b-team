const express = require('express');
const bcrypt = require('bcrypt');
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
            'SELECT id FROM users WHERE email = $1',
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                message: 'Email already exists.'
            });
        }

        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const result = await pool.query(
            `INSERT INTO users (real_name, email, password_hash)
             VALUES ($1, $2, $3)
             RETURNING id, real_name, email`,
            [real_name, email, passwordHash]
        );

        req.session.userId = result.rows[0].id;

        res.status(201).json({
            message: 'Account created successfully.',
            user: result.rows[0]
        });
    } catch (error) {
        console.error('Signup route error:', error);
        res.status(500).json({
            message: 'Server error.'
        });
    }
});

module.exports = router;