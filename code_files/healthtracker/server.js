const express = require('express');
const path = require('path');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);

const pool = require('./db');

const loginRoutes = require('./routes/login');
const signupRoutes = require('./routes/signup');
const workoutRoutes = require('./routes/workout');
const formRoutes = require('./routes/form');
const pageRoutes = require('./routes/pages');
const debugRoutes = require('./routes/debug');
// const sleepRoutes = require('./routes/sleep');
// const goalRoutes = require('./routes/goals');

// const dietPlanRoutes = require('./routes/dietPlan');
// const dashboardRoutes = require('./routes/dashboard');


const app = express();
const PORT = 3000;
const publicPath = path.join(__dirname, 'public');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  store: new pgSession({
    pool: pool,
    tableName: 'session',
    createTableIfMissing: true
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24
  }
}));

app.use((req, res, next) => {
  console.log('--- Request ---');
  console.log(req.method, req.url);
  console.log('Session ID:', req.sessionID);
  console.log('Session userId:', req.session?.userId || null);
  console.log('Cookie header:', req.headers.cookie || null);
  next();
});

app.use(pageRoutes);
app.use(express.static(publicPath));

app.use(loginRoutes);
app.use(signupRoutes);
app.use(workoutRoutes);
app.use(formRoutes);
// <<<<<<< HEAD
// app.use(sleepRoutes);
// // app.use(goalRoutes);
// app.use(dietPlanRoutes);
// //app.use(dashboardRoutes);

// =======
// app.use(workoutRoutes);
//app.use(sleepRoutes);
// app.use(goalRoutes);
//app.use(dietPlanRoutes);
//app.use(dashboardRoutes);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});