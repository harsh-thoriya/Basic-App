const express = require("express");
const indexController = require('../Controllers/index')
const auth = require('../Middleware/auth')
const router = express.Router();

router.get('/',);
router.post('/login',indexController.postLogin);
router.post('/signup',indexController.postSignup);

module.exports = router ;