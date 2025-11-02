const jwt = require("jsonwebtoken");
const redisClient = require('../config/redis');
const userSchema = require("../models/userModel");

const adminMiddleware = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).send("Token is not present");
        }

        // Verify JWT token
        const payload = jwt.verify(token, process.env.JWT_KEY);
        const { _id } = payload;

        if (!_id) {
            return res.status(401).send("Invalid token payload");
        }

        // Check if token is blacklisted
        const isBlocked = await redisClient.exists(`token:${token}`);
        if (isBlocked) {
            return res.status(401).send("Token is blacklisted");
        }

        // Fetch user from database
        const user = await userSchema.findById(_id);

        if (!user) {
            return res.status(404).send("User doesn't exist");
        }

        // Check user role in database (not in token)
        if (user.role !== 'admin') {
            return res.status(403).send("Only admins can perform this action");
        }

        // Set req.user with user data from database
        req.user = user;
        next();

    } catch (err) {
        res.status(401).send("Authentication error: " + err.message);
    }
};

module.exports = adminMiddleware;