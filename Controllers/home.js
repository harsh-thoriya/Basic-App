const dotenv = require('dotenv').config()
const path = require('path')
const bcrypt = require('bcryptjs')
const jsonWebTokens = require('jsonwebtoken')
const userModel = require('../Models/users.js')
const auth = require('../Middleware/auth.js')
const mongoose = require('mongoose')
const Cryptr = require('cryptr')
const AWS = require('aws-sdk')

const getHomepage = async (req,res) => {
    const users = await userModel.find({})
    res.render('home.ejs',{users:users})
}
const userSearch = async (req,res) => {
    const user = await userModel.find({username:req.body.username})
    res.render('home.ejs',{users:user})
}
const getSortedData = async (req,res) => {
    await userModel.find().sort({username : -1}).exec((err,users) => {
        res.render('home.ejs',{users:users})
      });
}

module.exports = { getHomepage, userSearch, getSortedData}