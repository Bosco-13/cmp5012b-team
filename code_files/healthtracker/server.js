const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);

const pool = require('./db');

const loginRoutes = require('./routes/login');
const signupRoutes = require('./routes/signup');
const formRoutes = require('./routes/form');
const sleepRoutes = require('./routes/sleep');
// const goalRoutes = require('./routes/goals');
<<<<<<< HEAD
const dietPlanRoutes = require('./routes/dietPlan');
//const dashboardRoutes = require('./routes/dashboard');
const pageRoutes = require('./routes/pages');
const debugRoutes = require('./routes/debug');
=======
// const dietPlanRoutes = require('./routes/dietPlan');
// const dashboardRoutes = require('./routes/dashboard');
>>>>>>> a7595b56950b86ced0920b87b6ee4d2a82f996eb

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
app.use((req, res, next) => {
  console.log('--- Request ---');
  console.log(req.method, req.url);
  console.log('Session ID:', req.sessionID);
  console.log('Session userId:', req.session?.userId || null);
  next();
});

<<<<<<< HEAD
//app.use(pageRoutes);
app.use(express.static(publicPath));
=======

app.use(express.static(path.join(__dirname, 'public')));
>>>>>>> a7595b56950b86ced0920b87b6ee4d2a82f996eb

app.use(loginRoutes);
app.use(signupRoutes);
app.use(formRoutes);
<<<<<<< HEAD
app.use(sleepRoutes);
// app.use(goalRoutes);
app.use(dietPlanRoutes);
//app.use(dashboardRoutes);

=======
// app.use(workoutRoutes);
// app.use(sleepRoutes);
// app.use(goalRoutes);
// app.use(dietPlanRoutes);
// app.use(dashboardRoutes);

//js debugging routes 
app.get('/me', (req, res) => {
  res.json({ userId: req.session.userId || null });
});

app.get('/debug/headers', (req, res) => {
  res.json({
    cookieHeader: req.headers.cookie || null,
    sessionID: req.sessionID,
    session: req.session
  });
});

app.get('/debug/profile', async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({
        message: 'No logged in user in session'
      });
    }

    const result = await pool.query(
      'SELECT * FROM profiles WHERE user_id = $1',
      [userId]
    );

    res.json({
      sessionUserId: userId,
      profile: result.rows[0] || null
    });
  } catch (error) {
    console.error('Debug profile route error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
>>>>>>> a7595b56950b86ced0920b87b6ee4d2a82f996eb


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});