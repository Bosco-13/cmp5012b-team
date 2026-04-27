function requireLogin(req, res, next) {
  console.log('REQUIRE LOGIN');
  console.log('sessionID:', req.sessionID);
  console.log('session object:', req.session);
  console.log('session userId:', req.session?.userId || null);

  if (!req.session || !req.session.userId) {
    console.log('REQUIRE LOGIN FAILED');
    return res.status(401).json({ message: 'You must be logged in' });
  }

  console.log('REQUIRE LOGIN PASSED');
  next();
}

module.exports = requireLogin;