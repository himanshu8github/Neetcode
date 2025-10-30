const userSchema = require("../models/userModel")
const validator = require("../utils/validator")
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis');


const register = async(req, res) => {
    
    try{
        //validate the data

        validator(req.body);

       const {firstName, password, emailId} = req.body;
       
       req.body.password = await bcrypt.hash(password, 10);
       
       req.body.role = 'user'
 
           const user = await userSchema.create(req.body);

           // we send token here like when user register then user can 
           //access the website no need to login after registration.

       const token = jwt.sign({_id:user._id, emailId:emailId, role:'user'}, process.env.JWT_KEY , {expiresIn: 60*60}) // sec

       res.cookie('token', token, {maxAge: 60*60*1000}); // in milisec
       res.status(201).send('user registered sucessfully');

  

    }
    catch(err){
        res.status(400).send('Error : ' + err);
    }

    
}

const login = async (req, res) => {

    try{

        const { emailId, password} = req.body ;

          if(!emailId) 
            throw new Error("Invalid Credentials");
        if(!password)
            throw new Error("Invalid Credentials");   

       const user = await userSchema.findOne({ emailId });
    if (!user) throw new Error("User not found");

    const match = await bcrypt.compare(password, user.password);
    
    if (!match) throw new Error("Invalid Credentials");
     

    

       const token = jwt.sign({_id:user._id, emailId:emailId, role: user.role }, process.env.JWT_KEY , {expiresIn: 60*60}) // sec
       res.cookie('token', token, {maxAge: 60*60*1000}); // in milisec\
       res.status(200).send("Logged in successfully");



    }catch(err){
        res.status(401).send("Error : " + err)

    }
}

const logout = async (req, res) => {

    try{
       
        const {token} = req.cookies;
        const payload = jwt.decode(token);

         // Block the token using Redis
        await redisClient.set(`token:${token}`, "Blocked");
        await redisClient.expireAt(`token:${token}`, payload.exp);


           // Clear the cookie
        res.cookie("token", null, {expires: new Date(Date.now())});
        res.send("Logout successfully");



    }catch(err){
          res.status(503).send('Error: ' + err)
    }
}

const adminRegister = async (req, res) => {
      
    try{
     
        validator(req.body);

       const {firstName, password, emailId} = req.body;
       
       req.body.password = await bcrypt.hash(password, 10);
    //    req.body.role = 'admin';
 
           const user = await userSchema.create(req.body);

       const token = jwt.sign({_id:user._id, emailId:emailId, role: user.role}, process.env.JWT_KEY , {expiresIn: 60*60}) // sec

       res.cookie('token', token, {maxAge: 60*60*1000}); 
       res.status(201).send('user registered sucessfully');

  

    }
    catch(err){
        res.status(400).send('Error : ' + err);
    }

}

module.exports = {register, login, logout, adminRegister}