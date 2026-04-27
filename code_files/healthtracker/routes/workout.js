const express = require('express');
const router = express.Router();
const pool = require('../db');
const requireLogin = require('../middleware/requireLogin');

router.post('/workouts', requireLogin, async (req, res) => {
  const userId = req.session.userId;

  const {
    workout_name,
    duration_hours,
    workout_date,
    exercises
  } = req.body;

  if (
    !workout_name || workout_name.trim() === '' ||
    !duration_hours ||
    !workout_date ||
    !Array.isArray(exercises) ||
    exercises.length === 0
  ) {
    return res.status(400).json({
      message: 'Missing required workout fields'
    });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const workoutResult = await client.query(
      `INSERT INTO healthsystem.workouts (
        user_id,
        workout_name,
        duration_hours,
        workout_date
      )
      VALUES ($1, $2, $3, $4)
      RETURNING workout_id`,
      [
        userId,
        workout_name.trim(),
        duration_hours,
        workout_date
      ]
    );

    const workoutId = workoutResult.rows[0].workout_id;

    for (const exercise of exercises) {
      if (
        !exercise.exercise_name || exercise.exercise_name.trim() === '' ||
        !exercise.sets ||
        !exercise.reps
      ) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          message: 'Each exercise must include name, sets and reps'
        });
      }

      await client.query(
        `INSERT INTO healthsystem.workout_exercises (
          workout_id,
          exercise_name,
          sets,
          reps
        )
        VALUES ($1, $2, $3, $4)`,
        [
          workoutId,
          exercise.exercise_name.trim(),
          exercise.sets,
          exercise.reps
        ]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Workout saved successfully',
      workoutId: workoutId
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Workout route error:', error);
    res.status(500).json({
      message: 'Server error'
    });
  } finally {
    client.release();
  }
});

module.exports = router;