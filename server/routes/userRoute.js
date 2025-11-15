const express = require('express');
const userMiddleware = require("../middleware/userMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const authRouter = express.Router();
const { register, login, logout, adminRegister, 
    firstAdminRegister, deleteUser 
    ,getAllUsers, deleteUserProfile, firebaseRegister} = require('../controllers/userAuth')


authRouter.get('/all',  getAllUsers);
// User Registration (anyone can register as ordinary user)
authRouter.post("/register", register);

// User login (both users and admins)
authRouter.post("/login", login);

//delete user profile

authRouter.delete('/deleteuserProfile', userMiddleware, deleteUserProfile);
// authRouter.delete('/deleteUser', userMiddleware, deleteUser);

// User logout (requires valid token)
authRouter.post("/logout", userMiddleware, logout);

// First admin registration (no middleware - creates the FIRST admin only)
authRouter.post('/admin/register/first', firstAdminRegister);

// Register new admins (only existing admins can do this - requires admin middleware)
authRouter.post('/admin/register', adminMiddleware, adminRegister);

authRouter.post('/firebase-register', firebaseRegister);

authRouter.get('/check',userMiddleware,(req,res)=>{

    const reply = {
        firstName: req.user.firstName,
        emailId: req.user.emailId,
        _id:req.user._id,
        role:req.user.role,
    }

    res.status(200).json({
        user:reply,
        message:"Valid User"
    });
})

module.exports = authRouter;