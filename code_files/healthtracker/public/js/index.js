document.addEventListener('DOMContentLoaded', () => {
    loadDashboardStats();
    setupDashboardButtons();
});

function setupDashboardButtons() {
    const map = [
        ['.workouts-card .dash__btn', 'workout.html'],
        ['.sleep-card .dash__btn',    'Sleep_Monitoring.html'],
        ['.goal-card .dash__btn',     'Goal_Management.html'],
        ['.diet-card .dash__btn',     'dietplan.html']
    ];
    map.forEach(([selector, url]) => {
        const btn = document.querySelector(selector);
        if (btn) btn.addEventListener('click', () => goTo(url));
    });
}

async function loadDashboardStats() {
    try {
        const data = await getJson('/dashboard');

        const el = id => document.getElementById(id);

        if (el('workoutCompleted')) el('workoutCompleted').textContent = data.workouts.completed;
        if (el('hours')) el('hours').textContent = data.workouts.hours;
        if (el('calories')) el('calories').textContent = data.workouts.calories;

        if (el('sleepHours')) el('sleepHours').textContent = data.sleep.avgHours;
        if (el('sleepScore')) el('sleepScore').textContent = data.sleep.score + '%';

        if (el('goals')) el('goals').textContent = data.goals.active;

        if (el('todayCalories')) el('todayCalories').textContent = data.diet.todayCalories;
    } catch (error) {
        console.error('Dashboard stats error:', error);
    }
}
