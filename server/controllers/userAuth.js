const userSchema = require("../models/userModel")
const validator = require("../utils/validator")
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis');
const SubmissionCodeSchema = require("../models/codeSubmission")
const admin = require("../config/firebaseAdmin");



const firebaseRegister = async (req, res) => {
    try {
        const { uid, firstName, emailId, photoURL, idToken } = req.body;

       if (!uid || !emailId || !idToken) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Verify idToken with Firebase Admin to prevent spoofing
        let decodedToken;
        try {
          decodedToken = await admin.auth().verifyIdToken(idToken);
        } catch (err) {
          return res.status(401).json({ message: 'Invalid Firebase ID token' });
        }
        // Ensure token uid matches provided uid and email matches
        if (decodedToken.uid !== uid || (decodedToken.email && decodedToken.email !== emailId)) {
          return res.status(401).json({ message: 'ID token verification failed (uid/email mismatch)' });
        }

        // Check if user already exists
        const existingUser = await userSchema.findOne({ emailId });
        if (existingUser) {
            const token = jwt.sign(
                { _id: existingUser._id, emailId: emailId, role: existingUser.role },
                process.env.JWT_KEY,
                { expiresIn: 60 * 60 }
            );

            res.cookie('token', token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 60 * 60 * 1000,
                path: "/"
            });

            return res.status(200).json({
                user: {
                    firstName: existingUser.firstName,
                    emailId: existingUser.emailId,
                    _id: existingUser._id,
                    role: existingUser.role
                },
                message: "User already exists, logged in successfully"
            });
        }

        // Create new user from Firebase
        const newUser = await userSchema.create({
            firstName: firstName || 'User',
            emailId,
            firebaseUid: uid,
             authMethod: 'firebase',
            photoURL: photoURL || null,
            password: null,
            role: 'user',
            problemSolved: []
        });

        const token = jwt.sign(
            { _id: newUser._id, emailId: emailId, role: newUser.role },
            process.env.JWT_KEY,
            { expiresIn: 60 * 60 }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 60 * 60 * 1000,
            path: "/"
        });

        res.status(201).json({
            user: {
                firstName: newUser.firstName,
                emailId: newUser.emailId,
                _id: newUser._id,
                role: newUser.role
            },
            message: "User created via Firebase successfully"
        });
    } catch (err) {
        res.status(400).json({ message: 'Error: ' + err.message });
    }
};





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
     

  res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 60 * 60 * 1000,
  path: "/"
});
 // in milisec
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

if (user.authMethod !== "manual") {
    throw new Error("Use Google Sign in");
}


    const match = await bcrypt.compare(password, user.password);
    
    if (!match) throw new Error("Invalid Credentials");

    const reply = {
        firstName : user.firstName,
        emailId : user.emailId,
        _id : user._id,
           role: user.role
    }
     
       const token = jwt.sign({_id:user._id, emailId:emailId, role: user.role }, process.env.JWT_KEY , {expiresIn: 60*60}) // sec
     res.cookie("token", token, {
  httpOnly: true,
  secure: true,     // required for https
  sameSite: "none", // required for cross-site cookies
  maxAge: 60 * 60 * 1000,
  path: "/"
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
         if (!token) {
          return res.status(400).send('No token provided');
        }
        const payload = jwt.decode(token);

        if (!payload || !payload.exp) {
          // Still clear cookie
          res.cookie("token", null, {expires: new Date(Date.now())});
          return res.send("Logout successfully");
        }

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
          const users = await userSchema.find({}, '-password -firebaseUid -__v');
        
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
    await userSchema.findByIdAndDelete(userId);

    // Delete all submissions made by this user
    await SubmissionCodeSchema.deleteMany({ userId });

         res.status(200).send("Profile Deleted sucessfully");

    }catch(err){
        console.error("Error deleting user profile:", err);
    res.status(500).send("Internal Server Error: " + err.message);

    }
}


module.exports = {register, login, logout, adminRegister, firstAdminRegister, deleteUser, getAllUsers, deleteUserProfile, firebaseRegister};