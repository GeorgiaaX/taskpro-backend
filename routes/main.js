//require modules
const express = require('express')
const router = express.Router()
const ticketsController = require("../controllers/ticket")
const authController = require("../controllers/auth")
// const { ensureGuest, ensureAuth } = require('../middleware/auth')

//@desc get user profile once logged in
//@router /profile
router.get('/profile', ticketsController.getProfile)

//@desc post user login
//@router /login
router.post('/login', authController.postLogin)

//@desc logout user
//@router /logout
router.post('/logout', authController.postLogout)


//@desc post user signup
//@router /signup
router.post('/signUp', authController.postSignup)


module.exports = router
