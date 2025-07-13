const express = require('express');
const userMiddleware = require("../middleware/userMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const authRouter = express.Router();
const {register, login, logout, adminRegister} = require('../controllers/userAuth')

// user Registration
// user login
//logout
// get profile

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", userMiddleware, logout);
authRouter.post('/admin/register', adminMiddleware, adminRegister);
// authRouter.get("/getprofile", getProfile);


module.exports = authRouter;