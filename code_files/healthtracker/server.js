const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);

const pool = require('./db');

const loginRoutes = require('./routes/login');
const signupRoutes = require('./routes/signup');
const formRoutes = require('./routes/form');
// const workoutRoutes = require('./routes/workouts');
// const sleepRoutes = require('./routes/sleep');
// const goalRoutes = require('./routes/goals');
// const dietPlanRoutes = require('./routes/dietPlan');
// const dashboardRoutes = require('./routes/dashboard');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  store: new pgSession({
    pool: pool,
    tableName: 'session',
    createTableIfMissing: true
  }),
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24
  }
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(loginRoutes);
app.use(signupRoutes);
app.use(formRoutes);
// app.use(workoutRoutes);
// app.use(sleepRoutes);
// app.use(goalRoutes);
// app.use(dietPlanRoutes);
// app.use(dashboardRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});