const exerciseList = document.getElementById('exercise-list');
const addExerciseBtn = document.getElementById('add-exercise-btn');
const saveWorkoutBtn = document.getElementById('save-workout-btn');

function attachDeleteHandler(row) {
  const deleteBtn = row.querySelector('.ex-del');

  deleteBtn.addEventListener('click', () => {
    const allRows = document.querySelectorAll('.workout-row');

    if (allRows.length > 1) {
      row.remove();
    } else {
      row.querySelector('.exercise-name').value = '';
      row.querySelector('.exercise-sets').value = '';
      row.querySelector('.exercise-reps').value = '';
    }
  });
}

function createExerciseRow() {
  const row = document.createElement('div');
  row.className = 'record__log_inputs workout-row';

  row.innerHTML = `
    <input type="text" class="record__log_inputs-ipt exercise-name" placeholder="Exercise">
    <input type="number" class="record__log_inputs-ipt exercise-sets" placeholder="Number of sets" min="1">
    <input type="number" class="record__log_inputs-ipt exercise-reps" placeholder="Number of reps" min="1">
    <div class="ex-del">✕</div>
  `;

  attachDeleteHandler(row);
  return row;
}

if (addExerciseBtn) {
  addExerciseBtn.addEventListener('click', () => {
    exerciseList.appendChild(createExerciseRow());
  });
}

document.querySelectorAll('.workout-row').forEach((row) => {
  attachDeleteHandler(row);
});

if (saveWorkoutBtn) {
  saveWorkoutBtn.addEventListener('click', async () => {
    const workoutName = document.getElementById('name').value.trim();
    const duration = document.getElementById('duration').value.trim();
    const workoutDate = document.getElementById('workout-date').value;

    const exerciseRows = document.querySelectorAll('.workout-row');
    const exercises = [];

    for (const row of exerciseRows) {
      const exerciseName = row.querySelector('.exercise-name').value.trim();
      const sets = row.querySelector('.exercise-sets').value.trim();
      const reps = row.querySelector('.exercise-reps').value.trim();

      if (exerciseName || sets || reps) {
        if (!exerciseName || !sets || !reps) {
          alert('Each exercise row must have an exercise name, sets and reps.');
          return;
        }

        exercises.push({
          exercise_name: exerciseName,
          sets: parseInt(sets, 10),
          reps: parseInt(reps, 10)
        });
      }
    }

    if (!workoutName) {
      alert('Please enter a workout name.');
      return;
    }

    if (!duration) {
      alert('Please enter the workout duration.');
      return;
    }

    if (!workoutDate) {
      alert('Please select the workout date.');
      return;
    }

    if (exercises.length === 0) {
      alert('Please add at least one exercise.');
      return;
    }

    try {
      const response = await fetch('/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          workout_name: workoutName,
          duration_hours: parseFloat(duration),
          workout_date: workoutDate,
          exercises: exercises
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Failed to save workout');
        return;
      }

      alert('Workout saved successfully');
      window.location.reload();
    } catch (error) {
      console.error('Workout save error:', error);
      alert('Server error');
    }
  });
}