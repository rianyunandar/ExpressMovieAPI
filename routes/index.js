var express = require('express');
var router = express.Router();

const { CekAuth, forwardAuth } = require('../config/auth');

/* GET welcome page */
router.get('/', forwardAuth, function(req, res, next) {
  res.render('welcome', { title: 'Welcome Page' });
});

router.get('/dashboard', CekAuth, (req, res, next) => {
  res.render('dashboard', { title: 'Dashboard Page' });
});

module.exports = router;
