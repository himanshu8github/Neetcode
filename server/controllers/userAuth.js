const userSchema = require("../models/userModel")
const validator = require("../utils/validator")
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis');
const SubmissionCodeSchema = require("../models/codeSubmission")


const register = async(req, res) => {
    
    try{
        //validate the data

          if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).send('Error: Request body is empty');
        }

        validator(req.body);

       const {firstName, password, emailId} = req.body;
       
       req.body.password = await bcrypt.hash(password, 10);
       
       req.body.role = 'user'
 
           const user = await userSchema.create(req.body);

           // we send token here like when user register then user can 
           //access the website no need to login after registration.

        // Token is automatically sent after registration
        const token = jwt.sign(
            {_id:user._id, emailId:emailId, role:'user'}, 
            process.env.JWT_KEY, 
            {expiresIn: 60*60}
        );

           const reply = {
        firstName : user.firstName,
        emailId : user.emailId,
        _id : user._id
    }
     

       res.cookie('token', token, {maxAge: 60*60*1000}); // in milisec
        res.status(200).json({
        user : reply,
        message : "User Registered sucessfully"
       })

  

    }
    catch(err){
        res.status(400).send('Error : ' + err);
    }

    
}

const login = async (req, res) => {
      console.log(req.body);

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

    const reply = {
        firstName : user.firstName,
        emailId : user.emailId,
        _id : user._id
    }
     
       const token = jwt.sign({_id:user._id, emailId:emailId, role: user.role }, process.env.JWT_KEY , {expiresIn: 60*60}) // sec
      res.cookie('token', token, {
    maxAge: 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax',
    secure: false
});

       res.status(200).json({
        user : reply,
        message : "Login sucessfully"
       })


    }catch(err){
      res.status(401).json({ message: err.message });


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

// REGISTER FIRST ADMIN (no token needed - creates the very first admin)
const firstAdminRegister = async (req, res) => {
    try {
        // Check if admin already exists

          if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).send('Error: Request body is empty');
        }
        const adminExists = await userSchema.findOne({ role: 'admin' });
        if (adminExists) {
            throw new Error("Admin already exists. Cannot create another admin this way.");
        }

        validator(req.body);
        const {firstName, password, emailId} = req.body;
        
        req.body.password = await bcrypt.hash(password, 10);
        req.body.role = 'admin'; //  admin role
 
        const user = await userSchema.create(req.body);

        const token = jwt.sign(
            {_id:user._id, emailId:emailId, role:'admin'}, 
            process.env.JWT_KEY, 
            {expiresIn: 60*60}
        );

        res.cookie('token', token, {maxAge: 60*60*1000});
        res.status(201).send('First admin registered successfully');
    }
    catch(err){
        res.status(400).send('Error : ' + err);
    }
}

const adminRegister = async (req, res) => {
      
    try{

          if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).send('Error: Request body is empty');
        }
     
        validator(req.body);

       const {firstName, password, emailId} = req.body;
       
       req.body.password = await bcrypt.hash(password, 10);
       req.body.role = 'admin';
 
           const user = await userSchema.create(req.body);

       const token = jwt.sign({_id:user._id, emailId:emailId, role: user.role}, process.env.JWT_KEY , {expiresIn: 60*60}) // sec

       res.cookie('token', token, {maxAge: 60*60*1000}); 
       res.status(201).send('user registered sucessfully');

  

    }
    catch(err){
        res.status(400).send('Error : ' + err);
    }

}


const deleteUser = async (req, res) => {
    try {
        const { emailId } = req.body;

        if (!emailId) {
            throw new Error("Email is required");
        }

        // Find and delete user (admin or ordinary)
        const user = await userSchema.findOneAndDelete({ emailId });
        
        if (!user) {
            throw new Error("User not found");
        }

        res.status(200).send("User deleted successfully");
    } 
    catch(err) {
        res.status(400).send('Error : ' + err.message);
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await userSchema.find({});
        
        if (users.length === 0) {
            return res.status(200).send({
                message: "No users found",
                users: []
            });
        }

        res.status(200).send({
            message: "All users fetched successfully",
            totalUsers: users.length,
            users: users
        });
    } 
    catch(err) {
        res.status(400).send('Error : ' + err);
    }
}

// delete user Profile (also the submission details all info)
const deleteUserProfile = async (req, res) => {


    try{

        const userId = req.user._id;
        
      // Delete the user first
    await User.findByIdAndDelete(userId);

    // Delete all submissions made by this user
    await Submission.deleteMany({ userId });

         res.status(200).send("Profile Deleted sucessfully");

    }catch(err){
        console.error("Error deleting user profile:", err);
    res.status(500).send("Internal Server Error: " + err.message);

    }
}


module.exports = {register, login, logout, adminRegister, firstAdminRegister, deleteUser, getAllUsers, deleteUserProfile};