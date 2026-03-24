const express = require('express');
const path = require('path');
const cors = require('cors');

const authRoutes = require('./routes/auth');
//const profileRoutes = require('./routes/profile');
//const workoutRoutes = require('./routes/workouts');
//const sleepRoutes = require('./routes/sleep');
//const goalRoutes = require('./routes/goals');
//const dietPlanRoutes = require('./routes/dietPlan');
//const dashboardRoutes = require('./routes/dashboard');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(authRoutes);
//app.use(profileRoutes);
//app.use(workoutRoutes);
//app.use(sleepRoutes);
//app.use(goalRoutes);
//app.use(dietPlanRoutes);
//app.use(dashboardRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});