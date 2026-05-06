const express = require('express');
const router = express.Router();
const pool = require('../db');
const requireLogin = require('../middleware/requireLogin');


router.get('/workouts', requireLogin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT workout_id, workout_name, workout_date, duration_hours
       FROM healthsystem.workouts
       WHERE user_id = $1
       ORDER BY workout_date DESC`,
      [req.session.userId]
    );

    return res.json({ workouts: result.rows });
  } catch (error) {
    console.error('Workout GET error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});


router.get('/workouts/:id', requireLogin, async (req, res) => {
  const workoutId = req.params.id;
  const userId = req.session.userId;

  try {
    const workoutResult = await pool.query(
      `SELECT workout_id, workout_name, workout_date, duration_hours
       FROM healthsystem.workouts
       WHERE workout_id = $1 AND user_id = $2`,
      [workoutId, userId]
    );

    if (workoutResult.rows.length === 0) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    const exerciseResult = await pool.query(
      `SELECT exercise_name, sets, reps
       FROM healthsystem.workout_exercises
       WHERE workout_id = $1
       ORDER BY exercise_id ASC`,
      [workoutId]
    );

    return res.json({
      workout: workoutResult.rows[0],
      exercises: exerciseResult.rows
    });
  } catch (error) {
    console.error('Workout detail GET error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});


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

    return res.status(201).json({
      message: 'Workout saved successfully',
      workoutId: workoutId
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Workout route error:', error);

    return res.status(500).json({
      message: 'Server error'
    });
  } finally {
    client.release();
  }
});

module.exports = router;