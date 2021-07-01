const express = require("express");
const homeController = require('../Controllers/home')
const auth = require('../Middleware/auth')
const router = express.Router();

router.get('/',homeController.getHomepage);
router.post('/usersearch',homeController.userSearch);
router.get('/sort',homeController.getSortedData)

module.exports = router ;