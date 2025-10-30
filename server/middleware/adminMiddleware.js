const jwt = require("jsonwebtoken");
const redisClient = require('../config/redis');
const userSchemaa = require("../models/userModel");

const adminRegisterMiddleware = async (req, res, next) => {

    try{

        req.body.role = 'admin'

        const{token} = req.cookies;

        if(!token) throw new Error ("Token is not Present");

         const payload = jwt.verify(token , process.env.JWT_KEY);
       const {_id} = payload;

       
       if(!_id) throw new Error ("Invalid Token Payload")

        
        const user = await userSchemaa.findById(_id);

        // for admin role
           if(payload.role != 'admin') throw new Error ("User Doesn't exist")

         if (!user) throw new Error("User doesn't exist");

          // Check if token is blacklisted
    const isBlocked = await redisClient.exists(`token:${token}`);
    if (isBlocked) throw new Error("Token is blacklisted");
    
       req.user = user;
       next();


    }catch(err){
        res.status(401).send("Error " + err.message);

    }
}

module.exports = adminRegisterMiddleware;