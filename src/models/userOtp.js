const mongoose = require('mongoose')

const otpSchema = new mongoose.Schema({
    email:{
        type : String,
        unique : true
    },
    otp:{
        type : String,
        required : true
    }
})

module.exports = mongoose.model('Otp',otpSchema)