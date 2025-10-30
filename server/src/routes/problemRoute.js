const express = require('express');
const adminRegisterMiddleware = require("../middleware/adminMiddleware");

const problemRouter = express.Router();


// routes for => // create //fetch // update //delete

// require admin access here
// create , update, delete problem
problemRouter.post("/create",adminRegisterMiddleware, createPropblem);
problemRouter.patch("/:id",updateProblem);
problemRouter.delete("/:id", deleteProblem);

// access problem
problemRouter.get("/:id", fetchProblemById);
problemRouter.get("/", fetchAllProblem);
problemRouter.get('/user', solvedAllProblemByUser);





