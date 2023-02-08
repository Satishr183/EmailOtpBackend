const express = require('express')
const router = express.Router()
const {userControl, userOtp, userLogin} = require('../controllers/userController')

router.post('/user/register',userControl)
router.post('/user/otp',userOtp)
router.post("/user/login",userLogin);


module.exports = router