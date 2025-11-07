const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const redisClient = require('./config/redis');
const authRouter = require("./routes/userRoute");
const problemRouter = require('./routes/problemRoute')
const submitRouter = require("./routes/codeSubmitByUser");
const cors = require('cors');


const app = express();
app.use(express.json());
app.use(cookieParser());


app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true 
}))

//routes
app.use('/user', authRouter);
app.use('/problem', problemRouter);
app.use('/codeSubmission', submitRouter);

const initialiseConnection = async () => {
    try {
        await Promise.all([connectDB(), redisClient.connect()]);
        
        app.listen(process.env.PORT || 3000, () => {
            console.log("Server is running on port " + (process.env.PORT || 3000));
            console.log("DB & Redis Connected");
        });
    } catch (err) {
        console.error("Error from index.js db function:", err);
       
    }
};

initialiseConnection();