const dotenv = require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const multer = require('multer')
const cookieParser = require('cookie-parser')
const AWS = require('aws-sdk')
const uuid = require('uuid')
const path = require('path')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const index = require('./Routes/index')
const home = require('./Routes/home')

mongoose.connect(process.env.MONGODBURL ,{useNewUrlParser:true,useFindAndModify:false, useCreateIndex:true, useUnifiedTopology:true}).then((resolved)=>{
    console.log("Database Connected");
}).catch((rejected)=>{
    console.log("Database connection unsuccessful");
});

const app = express();
const port = process.env.PORT;

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.json());
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'Public','html')));

const storage = multer.memoryStorage({
    destination: function(req, file, callback) {
        callback(null, '')
    }
})
  
const filefilter = (req,file,callback)=>{
  if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
    callback(null,true)
  }
  else{
    callback(null,false)
  }
}
  
app.use(multer({storage : storage, filefilter : filefilter}).single('profilePic'))

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

app.use(passport.initialize());
app.use(passport.session());

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/loginwithgoogle/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }
));

app.use(index)
app.use('/home',home)

app.listen(port,() => {
    console.log("Server Established");
});