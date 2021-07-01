const express = require("express");
const indexController = require('../Controllers/index')
const auth = require('../Middleware/auth')
const router = express.Router();
const passport = require('passport')

router.get('/');
router.post('/login',indexController.postLogin);
router.post('/signup',indexController.postSignup);
router.get('/loginwithgoogle',passport.authenticate('google', { scope : ['profile', 'email'] }))

router.get('/loginwithgoogle/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/home');
  });

module.exports = router ;