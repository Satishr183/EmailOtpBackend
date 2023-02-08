const mongoose = require('mongoose')
const jwt = require("jsonwebtoken");
const SECRECT_KEY= "123456789satish"

const userSchema = new mongoose.Schema({
    name:{
        type : String,
        required : true,
        trim : true
    },
    email:{
        type : String,
        required : true,
        unique : true
    },
    mobile:{
        type : Number,
        required : true,
        unique : true
    },
    password:{ 
        type : String,
        required : true,
        minlength : 6
},
tokens: [
    {
        token: {
            type: String,
            required: true,
        }
    }
]
},{timestamps:true})

userSchema.methods.generateAuthtoken = async function(){
    try {
        let newtoken = jwt.sign({_id:this._id},SECRECT_KEY,{
            expiresIn:"1d"
        });

        this.tokens = this.tokens.concat({token:newtoken});
        await this.save();
        return newtoken;
    } catch (error) {
        res.status(400).json(error)
    }
}

module.exports = mongoose.model('Client',userSchema)