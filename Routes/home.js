const express = require("express");
const homeController = require('../Controllers/home')
const auth = require('../Middleware/auth')
const router = express.Router();

router.get('/');

module.exports = router ;