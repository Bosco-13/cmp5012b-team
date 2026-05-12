const express = require('express');
const path = require('path');
const router = express.Router();

const publicPath = path.join(__dirname, '..', 'public');

function sendProtectedPage(fileName) {
  return (req, res) => {
    if (!req.session || !req.session.userId) {
      return res.redirect('/login.html');
    }

    return res.sendFile(path.join(publicPath, fileName));
  };
}

router.get('/', (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.redirect('/login.html');
  }

  return res.redirect('/index.html');
});

router.get('/index.html', sendProtectedPage('index.html'));
router.get('/form.html', sendProtectedPage('form.html'));
router.get('/workout.html', sendProtectedPage('workout.html'));
router.get('/dietplan.html', sendProtectedPage('dietplan.html'));
router.get('/Sleep_Monitoring.html', sendProtectedPage('Sleep_Monitoring.html'));
router.get('/Goal_Management.html', sendProtectedPage('Goal_Management.html'));
router.get('/editplan.html', sendProtectedPage('editplan.html'));
router.get('/settings.html', sendProtectedPage('settings.html'));

module.exports = router;