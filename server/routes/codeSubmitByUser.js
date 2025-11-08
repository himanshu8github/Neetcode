const express = require('express');
const submitCodeRouter = express.Router();
const userMiddleware = require("../middleware/userMiddleware");
const {userCodeSubmit, runCode} = require("../controllers/userCodeSubmission")


submitCodeRouter.post("/submit/:id", userMiddleware, userCodeSubmit );
submitCodeRouter.post("/run/:id", userMiddleware,  runCode);


module.exports = submitCodeRouter;