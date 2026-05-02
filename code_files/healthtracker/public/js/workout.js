document.addEventListener('DOMContentLoaded', () => {
    loadCalendar();
});

async function loadCalendar() {
    const data = await getJson('/workouts');
    const workouts = data.workouts || [];

    const workoutMap = new Map();
    workouts.forEach(w => {
        const dateKey = w.workout_date.toString().slice(0, 10);
        workoutMap.set(dateKey, w);
    });

    buildCalendar(workoutMap);
    setupModal();
}

function buildCalendar(workoutMap) {
    const grid = document.getElementById('calendar-grid');
    if (!grid) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dayOfWeek = today.getDay() === 0 ? 6 : today.getDay() - 1;
    const monday = new Date(today);
    monday.setDate(today.getDate() - dayOfWeek - 21);

    for (let week = 0; week < 4; week++) {
        const weekStart = new Date(monday);
        weekStart.setDate(monday.getDate() + week * 7);

        const label = weekStart.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

        const row = document.createElement('div');
        row.className = 'record__schedule_row';

        const lbl = document.createElement('label');
        lbl.className = 'record__schedule_row-lbl';
        lbl.textContent = label;
        row.appendChild(lbl);

        for (let day = 0; day < 7; day++) {
            const date = new Date(weekStart);
            date.setDate(weekStart.getDate() + day);

            const dateKey = date.toISOString().slice(0, 10);
            const isTrained = workoutMap.has(dateKey);
            const isFuture = date > today;

            const box = document.createElement('div');
            box.className = 'record__schedule_row-box';

            if (isFuture) {
                box.classList.add('box-future');
            } else if (isTrained) {
                box.classList.add('box-trained');
                box.style.cursor = 'pointer';
                box.title = workoutMap.get(dateKey).workout_name;
                box.addEventListener('click', () => openModal(workoutMap.get(dateKey)));
            } else {
                box.classList.add('box-color');
            }

            row.appendChild(box);
        }

        grid.appendChild(row);
    }
}

function openModal(workout) {
    const modal = document.getElementById('workout-modal');
    const date = new Date(workout.workout_date);
    const formatted = date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

    document.getElementById('modal-date').textContent = formatted;
    document.getElementById('modal-name').textContent = workout.workout_name;
    document.getElementById('modal-detail').textContent = `Duration: ${workout.duration_hours}h`;

    modal.classList.add('active');
}

function setupModal() {
    const modal = document.getElementById('workout-modal');
    const closeBtn = document.getElementById('modal-close');
    if (!modal) return;

    closeBtn.addEventListener('click', () => modal.classList.remove('active'));

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });
}

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