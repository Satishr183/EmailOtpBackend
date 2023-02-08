const userModel = require('../models/userModel')
const otpModel = require('../models/userOtp')
const nodemailer = require('nodemailer')


const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL,
        pass:process.env.PASSWORD
    }
})

const userControl = async function(req, res){
   const {name, email, mobile, password} =req.body
    if(!name || !email || !mobile || !password){
        res.status(400).json({error:'Please enter all required inputs'})
    }
   const preUser = await userModel.findOne({email:email})
   if(preUser){
    res.status(400).json({error:'This user is already exist'})
   }
   else{
    const userregister = new userModel({
        name, email, mobile, password
    })
    const storeData = await userregister.save();
   res.send(storeData)
   }
}

const userOtp = async function(req, res){
    const {email} = req.body
    console.log(email)

    if(!email){
         res.status(400).json({error:"Please provide your email"})
    }
    try{
        const preuser = await userModel.findOne({email:email})
        if(preuser){
            const OTP = Math.floor(10000+Math.random()*90000)

            const existEmail = await otpModel.findOne({email:email})

            if(existEmail){
                const updateData = await otpModel.findByIdAndUpdate({_id:existEmail._id},{otp:OTP},{new:true})

                await updateData.save()

                const mailOption = {
                    from:process.env.EMAIL,
                    to:email,
                    subject:"Send mail for OTP validation",
                    text:`OTP :- ${OTP}`
                }
                transporter.sendMail(mailOption,(error,info)=>{
                    if(error){
                        res.status(400).json({error:'Email not send'})
                    }else{
                        console.log("email sent ",info.response)
                        res.status(200).json({message:'Email sent successfully'})
                    }
                })
            }else{
                const saveOtpData = new otpModel({
                    email,otp:OTP
                })
                await saveOtpData.save();
                const mailOptions = {
                    from: process.env.EMAIL,
                    to: email,
                    subject: "Sending Eamil For Otp Validation",
                    text: `OTP:- ${OTP}`
                }
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log("error", error);
                        res.status(400).json({ error: "email not send" })
                    } else {
                        console.log("Email sent", info.response);
                        res.status(200).json({ message: "Email sent Successfully" })
                    }
                })
                // await saveOtpData.save()
            }
        }else{
            res.status(400).json({error:'This user not exist. Register'})
        }
    }catch(err){
        res.status(400).json({error:"Invalid Details",err:err.message})
    }
}

const userLogin = async(req,res)=>{
    const {email,otp} = req.body;
    console.log(email)

    if(!otp || !email){
        res.status(400).json({ error: "Please Enter Your OTP and email" })
    }

    try {
        const otpverification = await otpModel.findOne({email:email});

        if(otpverification.otp === otp){
            const preuser = await userModel.findOne({email:email});

            // token generate
            const token = await preuser.generateAuthtoken();
           res.status(200).json({message:"User Login Succesfully Done",userToken:token});

        }else{
            res.status(400).json({error:"Invalid Otp"})
        }
    } catch (error) {
        res.status(400).json({ error: "Invalid Details", error })
    }
}

module.exports = {userControl, userOtp, userLogin}









