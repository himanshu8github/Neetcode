const express = require('express');
const submitCodeRouter = express.Router();
const userMiddleware = require("../middleware/userMiddleware");
const userCodeSubmission = require("../controllers/userCodeSubmission")

submitCodeRouter.post("/submit/:id", userMiddleware, userCodeSubmission );