const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const redisClient = require('./config/redis');
const authRouter = require("./routes/userRoute")


const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/user', authRouter)


const initialiseConnection = async () => {


    try{

      await Promise.all([connectDB(), redisClient.connect()]);
    app.listen(process.env.PORT, () => {
      console.log("Server is running on port " + process.env.PORT);
      console.log("DB & Redis Connected");
    });
  } catch (err) {
    console.error("Error from index.js db function:", err);
  }
};

initialiseConnection();


