const express = require("express");
const router = express.Router();

const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const pool = require("../db");

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const result = await pool.query(
      "SELECT * FROM healthsystem.users WHERE email = $1",
      [email],
    );

    const user = result.rows[0];

    if (!user) {
      return res.json({
        message: "Email not found",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    const expiry = Date.now() + 1000 * 60 * 15;

    await pool.query(
      `UPDATE healthsystem.users
       SET reset_token = $1,
           reset_token_expiry = $2
       WHERE email = $3`,
      [token, expiry, email],
    );

    const resetLink = `http://localhost:3000/passwordChange.html?token=${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Password",
      html: `
        <h2>Password Reset</h2>

        <a href="${resetLink}">
          Reset Password
        </a>
      `,
    });

    res.json({
      message: "Reset email sent",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error while sending email",
    });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    const result = await pool.query(
      `SELECT *
       FROM healthsystem.users
       WHERE reset_token = $1`,
      [token],
    );

    const user = result.rows[0];

    if (!user) {
      return res.json({
        message: "Invalid token",
      });
    }

    if (new Date(user.reset_token_expiry).getTime() < Date.now()) {
      return res.json({
        message: "Token expired",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `UPDATE healthsystem.users
       SET password_hash = $1,
         reset_token = NULL,
         reset_token_expiry = NULL
       WHERE reset_token = $2`,
      [hashedPassword, token],
    );

    res.json({
      message: "Password updated",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;
