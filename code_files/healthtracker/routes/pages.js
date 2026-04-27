const express = require('express');
const path = require('path');
const router = express.Router();

const publicPath = path.join(__dirname, '..', 'public');

function sendProtectedPage(fileName) {
  return (req, res) => {
    if (!req.session.userId) {
      return res.redirect('/login.html');
    }

    res.sendFile(path.join(publicPath, fileName));
  };
}

router.get('/form.html', sendProtectedPage('form.html'));
router.get('/index.html', sendProtectedPage('index.html'));

module.exports = router;