const express = require("express");
const homeController = require('../Controllers/home')
const auth = require('../Middleware/auth')
const router = express.Router();

router.get('/',auth,homeController.getHomepage);
router.post('/usersearch',auth,homeController.userSearch);
router.get('/sort',auth,homeController.getSortedData)

module.exports = router ;