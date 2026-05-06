document.addEventListener('DOMContentLoaded', () => {
  loadWorkoutPage();
});

async function loadWorkoutPage() {
  await loadCalendarAndRecentWorkouts();
  setupModal();
  setupExerciseForm();
}

async function loadCalendarAndRecentWorkouts() {
  try {
    const data = await getJson('/workouts');
    const workouts = data.workouts || [];

    const workoutMap = new Map();

    workouts.forEach((workout) => {
      const dateKey = workout.workout_date.toString().slice(0, 10);
      workoutMap.set(dateKey, workout);
    });

    buildCalendar(workoutMap);
    renderRecentWorkouts(workouts);
  } catch (error) {
    console.error('Workout load error:', error);
  }
}

function buildCalendar(workoutMap) {
  const grid = document.getElementById('calendar-grid');
  if (!grid) return;

  grid.innerHTML = '';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dayOfWeek = today.getDay() === 0 ? 6 : today.getDay() - 1;

  const monday = new Date(today);
  monday.setDate(today.getDate() - dayOfWeek - 21);

  for (let week = 0; week < 4; week++) {
    const weekStart = new Date(monday);
    weekStart.setDate(monday.getDate() + week * 7);

    const label = weekStart.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short'
    });

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
      const workout = workoutMap.get(dateKey);

      const isTrained = workoutMap.has(dateKey);
      const isFuture = date > today;

      const box = document.createElement('div');
      box.className = 'record__schedule_row-box';

      if (isFuture) {
        box.classList.add('box-future');
      } else if (isTrained) {
        box.classList.add('box-trained');
        box.style.cursor = 'pointer';
        box.title = workout.workout_name;

        box.addEventListener('click', () => {
          openWorkoutDetails(workout.workout_id);
        });
      } else {
        box.classList.add('box-color');
      }

      row.appendChild(box);
    }

    grid.appendChild(row);
  }
}

function renderRecentWorkouts(workouts) {
  const recentContainer = document.getElementById('recent-workouts');
  if (!recentContainer) return;

  recentContainer.innerHTML = '';

  if (workouts.length === 0) {
    recentContainer.textContent = 'No workouts logged yet.';
    return;
  }

  workouts.slice(0, 5).forEach((workout) => {
    const item = document.createElement('div');
    item.className = 'workout-item';

    const date = new Date(workout.workout_date);

    const formattedDate = date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    item.textContent = `${workout.workout_name} - ${formattedDate}`;
    item.style.cursor = 'pointer';

    item.addEventListener('click', () => {
      openWorkoutDetails(workout.workout_id);
    });

    recentContainer.appendChild(item);
  });
}

async function openWorkoutDetails(workoutId) {
  try {
    const response = await fetch(`/workouts/${workoutId}`, {
      credentials: 'same-origin'
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || 'Could not load workout details');
      return;
    }

    const workout = data.workout;
    const exercises = data.exercises || [];

    openModalWithDetails(workout, exercises);
  } catch (error) {
    console.error('Workout detail error:', error);
    alert('Server error');
  }
}

function openModalWithDetails(workout, exercises) {
  const modal = document.getElementById('workout-modal');
  const exerciseBox = document.getElementById('modal-exercises');

  if (!modal || !exerciseBox) return;

  const date = new Date(workout.workout_date);

  const formattedDate = date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  document.getElementById('modal-date').textContent = formattedDate;
  document.getElementById('modal-name').textContent = workout.workout_name;
  document.getElementById('modal-detail').textContent = `Duration: ${workout.duration_hours}h`;

  exerciseBox.innerHTML = '';

  if (exercises.length === 0) {
    exerciseBox.textContent = 'No exercises recorded.';
  } else {
    const title = document.createElement('h4');
    title.textContent = 'Exercises';
    exerciseBox.appendChild(title);

    const list = document.createElement('ul');

    exercises.forEach((exercise) => {
      const item = document.createElement('li');
      item.textContent = `${exercise.exercise_name}: ${exercise.sets} sets x ${exercise.reps} reps`;
      list.appendChild(item);
    });

    exerciseBox.appendChild(list);
  }

  modal.classList.add('active');
}

function setupModal() {
  const modal = document.getElementById('workout-modal');
  const closeBtn = document.getElementById('modal-close');

  if (!modal || !closeBtn) return;

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.classList.remove('active');
    }
  });
}

function setupExerciseForm() {
  const exerciseList = document.getElementById('exercise-list');
  const addExerciseBtn = document.getElementById('add-exercise-btn');
  const saveWorkoutBtn = document.getElementById('save-workout-btn');

  if (addExerciseBtn && exerciseList) {
    addExerciseBtn.addEventListener('click', () => {
      exerciseList.appendChild(createExerciseRow());
    });
  }

  document.querySelectorAll('.workout-row').forEach((row) => {
    attachDeleteHandler(row);
  });

  if (saveWorkoutBtn) {
    saveWorkoutBtn.addEventListener('click', saveWorkout);
  }
}

function attachDeleteHandler(row) {
  const deleteBtn = row.querySelector('.ex-del');

  if (!deleteBtn) return;

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

async function saveWorkout() {
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
}