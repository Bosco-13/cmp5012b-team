document.addEventListener('DOMContentLoaded', () => {
    loadGoals();

    const sleepGoalForm = byId('sleep-goal-form');
    if (sleepGoalForm) {
        sleepGoalForm.addEventListener('submit', saveSleepGoal);
    }

    const workoutGoalForm = byId('workout-goal-form');
    if (workoutGoalForm) {
        workoutGoalForm.addEventListener('submit', saveWorkoutGoal);
    }
});

async function loadGoals() {
    try {
        const data = await getJson('/goals');

        updateProfile(data.profile);
        updateWorkoutStreak(data.workout_dates);
        updateSleepGoals(data.sleep_goals, data.sleep_metrics);
        updateWorkoutGoals(data.workout_goals, data.workout_metrics);

    } catch (err) {
        console.error('Failed to load goals:', err);
    }
}

function updateProfile(profile) {
    const nameEl = byId('profile-name');
    const infoEl = byId('profile-info');

    if (!profile) return;

    if (nameEl) {
        nameEl.textContent = profile.real_name || 'Unknown';
    }

    if (infoEl) {
        const age = profile.age ? `Age: ${profile.age}` : '';
        const goal = profile.fitness_goal || '';
        infoEl.textContent = [age, goal].filter(Boolean).join(' - ') || 'No profile info';
    }
}

function updateWorkoutStreak(dates) {
    const el = byId('active-streak');
    if (!el) return;

    if (!dates || dates.length === 0) {
        el.textContent = '0 days';
        return;
    }

    const dateStrings = dates.map(d => d.toString().slice(0, 10));
    const unique = [...new Set(dateStrings)].sort().reverse();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const mostRecent = new Date(unique[0]);
    const diffFromToday = Math.round((today - mostRecent) / 86400000);

    if (diffFromToday > 1) {
        el.textContent = '0 days';
        return;
    }

    let streak = 0;
    let expected = new Date(mostRecent);

    for (let i = 0; i < unique.length; i++) {
        const d = new Date(unique[i]);
        const diff = Math.round((expected - d) / 86400000);

        if (diff === 0) {
            streak++;
            expected = new Date(d);
            expected.setDate(expected.getDate() - 1);
        } else {
            break;
        }
    }

    el.textContent = `${streak} day${streak === 1 ? '' : 's'}`;
}

function updateSleepGoals(sleepGoals, sleepMetrics) {
    const listEl = byId('sleep-goals-list');

    if (!listEl) return;

    listEl.innerHTML = '';

    if (!sleepGoals || sleepGoals.length === 0) {
        listEl.innerHTML = `
            <p class="goal-sub">No sleep goals set yet.</p>
        `;
        return;
    }

    sleepGoals.forEach(goal => {
        const currentValue = getCurrentSleepValue(goal.goal_type, sleepMetrics);
        const targetValue = Number(goal.target_value);
        const progress = targetValue > 0
            ? Math.min(Math.round((currentValue / targetValue) * 100), 100)
            : 0;

        const title = getSleepGoalTitle(goal.goal_type);
        const unit = getSleepGoalUnit(goal.goal_type);

        const goalCard = document.createElement('div');
        goalCard.className = 'goal-item';

        goalCard.innerHTML = `
            <p>${title}</p>

            <div class="progress-bar">
                <div class="progress" style="width: ${progress}%;"></div>
            </div>

            <p class="goal-sub">
                ${currentValue} / ${targetValue}${unit}
            </p>

            <p class="goal-sub">
                ${getSleepGoalMessage(currentValue, targetValue, unit)}
            </p>
        `;

        listEl.appendChild(goalCard);
    });
}

function getCurrentSleepValue(goalType, sleepMetrics) {
    if (!sleepMetrics) return 0;

    if (goalType === 'sleep_streak') {
        return Number(sleepMetrics.sleep_streak) || 0;
    }

    if (goalType === 'sleep_score') {
        return Number(sleepMetrics.sleep_score) || 0;
    }

    return 0;
}

function getSleepGoalTitle(goalType) {
    if (goalType === 'sleep_streak') {
        return 'Build Sleep Streak';
    }

    if (goalType === 'sleep_score') {
        return 'Improve Sleep Score';
    }

    return 'Sleep Goal';
}

function getSleepGoalUnit(goalType) {
    if (goalType === 'sleep_streak') {
        return ' days';
    }

    if (goalType === 'sleep_score') {
        return ' score';
    }

    return '';
}

function getSleepGoalMessage(currentValue, targetValue, unit) {
    if (currentValue >= targetValue) {
        return 'Goal achieved.';
    }

    const remaining = targetValue - currentValue;

    return `${remaining}${unit} remaining.`;
}

function updateWorkoutGoals(workoutGoals, workoutMetrics) {
    const listEl = byId('workout-goals-list');

    if (!listEl) return;

    listEl.innerHTML = '';

    if (!workoutGoals || workoutGoals.length === 0) {
        listEl.innerHTML = `
            <p class="goal-sub">No workout goals set yet.</p>
        `;
        return;
    }

    workoutGoals.forEach(goal => {
        const currentValue = getCurrentWorkoutValue(goal.goal_type, workoutMetrics);
        const targetValue = Number(goal.target_value);
        const progress = targetValue > 0
            ? Math.min(Math.round((currentValue / targetValue) * 100), 100)
            : 0;

        const title = getWorkoutGoalTitle(goal.goal_type);
        const unit = getWorkoutGoalUnit(goal.goal_type);

        const goalCard = document.createElement('div');
        goalCard.className = 'goal-item';

        goalCard.innerHTML = `
            <p>${title}</p>

            <div class="progress-bar">
                <div class="progress" style="width: ${progress}%;"></div>
            </div>

            <p class="goal-sub">
                ${currentValue} / ${targetValue}${unit}
            </p>

            <p class="goal-sub">
                ${getWorkoutGoalMessage(currentValue, targetValue, unit)}
            </p>
        `;

        listEl.appendChild(goalCard);
    });
}

function getCurrentWorkoutValue(goalType, workoutMetrics) {
    if (!workoutMetrics) return 0;

    if (goalType === 'weekly_workouts') {
        return Number(workoutMetrics.weekly_workouts) || 0;
    }

    if (goalType === 'total_workouts') {
        return Number(workoutMetrics.total_workouts) || 0;
    }

    return 0;
}

function getWorkoutGoalTitle(goalType) {
    if (goalType === 'weekly_workouts') {
        return 'Work Out Weekly';
    }

    if (goalType === 'total_workouts') {
        return 'Total Workouts Logged';
    }

    return 'Workout Goal';
}

function getWorkoutGoalUnit(goalType) {
    if (goalType === 'weekly_workouts') {
        return ' per week';
    }

    if (goalType === 'total_workouts') {
        return ' workouts';
    }

    return '';
}

function getWorkoutGoalMessage(currentValue, targetValue, unit) {
    if (currentValue >= targetValue) {
        return 'Goal achieved.';
    }

    const remaining = targetValue - currentValue;

    return `${remaining}${unit} remaining.`;
}

async function saveWorkoutGoal(event) {
    event.preventDefault();

    const goalTypeInput = byId('workout-goal-type');
    const targetInput = byId('workout-goal-target');
    const messageEl = byId('workout-goal-message');

    if (!goalTypeInput || !targetInput) return;

    const goalType = goalTypeInput.value;
    const targetValue = Number(targetInput.value);

    if (!goalType) {
        if (messageEl) messageEl.textContent = 'Choose a workout goal type.';
        return;
    }

    if (!Number.isInteger(targetValue) || targetValue <= 0) {
        if (messageEl) messageEl.textContent = 'Enter a positive whole number.';
        return;
    }

    if (goalType === 'weekly_workouts' && targetValue > 7) {
        if (messageEl) messageEl.textContent = 'Weekly workouts target cannot be more than 7.';
        return;
    }

    try {
        const { response, result } = await postJson('/goals/workout', {
            goal_type: goalType,
            target_value: targetValue
        });

        if (!response.ok) {
            if (messageEl) messageEl.textContent = result.message || 'Failed to save workout goal.';
            return;
        }

        if (messageEl) messageEl.textContent = 'Workout goal saved.';

        targetInput.value = '';

        loadGoals();

    } catch (err) {
        console.error('Failed to save workout goal:', err);

        if (messageEl) messageEl.textContent = 'Failed to save workout goal.';
    }
}

async function saveSleepGoal(event) {
    event.preventDefault();

    const goalTypeInput = byId('sleep-goal-type');
    const targetInput = byId('sleep-goal-target');
    const messageEl = byId('sleep-goal-message');

    if (!goalTypeInput || !targetInput) return;

    const goalType = goalTypeInput.value;
    const targetValue = Number(targetInput.value);

    if (!goalType) {
        if (messageEl) {
            messageEl.textContent = 'Choose a sleep goal type.';
        }
        return;
    }

    if (!Number.isInteger(targetValue) || targetValue <= 0) {
        if (messageEl) {
            messageEl.textContent = 'Enter a positive whole number.';
        }
        return;
    }

    if (goalType === 'sleep_score' && targetValue > 100) {
        if (messageEl) {
            messageEl.textContent = 'Sleep score target cannot be above 100.';
        }
        return;
    }

    try {
        const { response, result } = await postJson('/goals/sleep', {
            goal_type: goalType,
            target_value: targetValue
        });

        if (!response.ok) {
            if (messageEl) {
                messageEl.textContent = result.message || 'Failed to save sleep goal.';
            }
            return;
        }

        if (messageEl) {
            messageEl.textContent = 'Sleep goal saved.';
        }

        targetInput.value = '';

        loadGoals();

    } catch (err) {
        console.error('Failed to save sleep goal:', err);

        if (messageEl) {
            messageEl.textContent = 'Failed to save sleep goal.';
        }
    }
}