const express = require('express');
const adminRegisterMiddleware = require("../middleware/adminMiddleware");
const userMidlleware = require("../middleware/userMiddlware")
const {createProblem, updateProblem, deleteProblem, fetchProblemById, fetchAllProblem} = require("../controllers/userProblem")
const problemRouter = express.Router();



// routes for => // create //fetch // update //delete

// require admin access here
// create , update, delete problem
problemRouter.post("/create", adminRegisterMiddleware, createProblem);
problemRouter.patch("/update/:id",adminRegisterMiddleware, updateProblem);
problemRouter.delete("/delete/:id", adminRegisterMiddleware, deleteProblem);

// access problem
problemRouter.get("/problemById/:id", userMiddleware, fetchProblemById);
problemRouter.get("/getAllProblem",  userMiddleware, fetchAllProblem);
// problemRouter.get('/problemSolvedByUser',  userMiddleware, solvedAllProblemByUser);





module.exports = problemRouter;