const dotenv = require('dotenv').config()
const path = require('path')
const bcrypt = require('bcryptjs')
const jsonWebTokens = require('jsonwebtoken')
const userModel = require('../Models/users.js')
const auth = require('../Middleware/auth.js')
const Cryptr = require('cryptr')
const AWS = require('aws-sdk')

const postSignup = async (req,res) => {

    try{
        const S3 = new AWS.S3({
            accessKeyId : 'ASIARLOHTBV6ZALPNZFC',
            secretAccessKey: 'wLC3T7n2J0u5yssxIn5awHCZw3U5iKfl9A933uhG',
            sessionToken: 'FwoGZXIvYXdzENf//////////wEaDEOXVYVyRB+6ArwRLCLGAQ0neRTeqIYWApH1GpMEe36KZy2fJ0cIqk9hJGyrCJNahL/D7XMziivEYYv9QuUxov3/+Kpp358iqlIdI6jtQCMoIh/oBesN2Ajsx2B/mB73afr3DRt35xhRpwxEDcKjCPs3GMDiMkCHfHCR/14ElDmi2Nuj0B1Aohc/NMb6OTnlEkzoBjAq972zqVBRH7HG1w4K0G08h3kVyBarc9XhhcUwUTFzp5TksXYXFeKEGr92VXU8WwRfBDOwRYbX1b762/hh6g0vdCiGkfCGBjItPIJeCtLaakwj4BbIGrdh7Ab2RoiUZ4CSLfdm/w8HR1VfuXzYHiaiSew2J8Ny'
        })
        
        const params = {
            Bucket: 'prcts3',
            Key : req.body.username+'_profile_pic.jpg',
            Body: req.file.buffer,
            ContentType: 'image/jpg'
        }
       
        S3.upload(params, async (err,data)=>{
            if(err){
                console.log(err)
                return res.send("Can not post picture , please try again with a different one ...")
            }
            else{
                bcrypt.hash(req.body.password,12).then(async (password)=>{
                    let username = req.body.username
                    let email = req.body.email
                    
                    
                    const user = new userModel({
                        username : username,
                        email: email,
                        password : password,
                        imageURL : data.Location
                    })
                    await user.save().then(result => {
                        console.log('Created user : ',result);
                      })
                      .catch(err => {
                        console.log(err);
                      });
            
                    res.redirect('/')
            
                })
                
            }
        })
    }
    catch(e){
        res.send("error while signing up , try again after some time")
    }    
}

const cryptr = new Cryptr("superNova")

const generateToken = async function(user){

    const token = jsonWebTokens.sign({_id:user._id.toString() },"abcd",{expiresIn:'30m'})
    const encryptedToken = cryptr.encrypt(token).toString()
    
    return encryptedToken
}

const postLogin = async (req,res) => {
    if(req.user){
        res.redirect('/home')
    }
    else{

        userModel.findOne({ email: req.body.email })
        .then(user => {
        if (!user) {
            return res.redirect('/');
        }
        bcrypt
            .compare(req.body.password, user.password)
            .then(async (doMatch) => {
            if (doMatch) {
                const token = await generateToken(user)
                res.cookie('token',token,{httpOnly:true})
                console.log("loggedin")
                console.log("success")
                res.redirect('/home');
            }
            else{
                res.redirect('/')
            }
            
            })
            .catch(err => {
            console.log(err);
            res.redirect('/login');
            });
        })
        .catch(err => console.log(err));

    }
}

const loginWithGoogle = async (req,res) => {

    

}

module.exports = { postSignup, postLogin, loginWithGoogle}