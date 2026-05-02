document.addEventListener('DOMContentLoaded', () => {
    loadGoals();
});

async function loadGoals() {
    try {
        const data = await getJson('/goals');
        updateProfile(data.profile);
        updateWorkoutStreak(data.workout_dates);
    } catch (err) {
        console.error('Failed to load goals:', err);
    }
}

function updateProfile(profile) {
    const nameEl = byId('profile-name');
    const infoEl = byId('profile-info');

    if (nameEl) nameEl.textContent = profile.real_name || 'Unknown';

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

    // normalize to date-only strings (YYYY-MM-DD) for comparison
    const unique = [...new Set(dates.map(d => d.toString().slice(0, 10)))].sort().reverse();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streak = 0;
    let expected = new Date(today);

    // allow streak to start from today or yesterday
    const mostRecent = new Date(unique[0]);
    const diffFromToday = Math.round((today - mostRecent) / 86400000);
    if (diffFromToday > 1) {
        el.textContent = '0 days';
        return;
    }

    expected = mostRecent;

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
