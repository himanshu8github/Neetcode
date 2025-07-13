const express = require('express');
const adminRegisterMiddleware = require("../middleware/adminMiddleware");

const problemRouter = express.Router();


// routes for => // create //fetch // update //delete

// require admin access here
problemRouter.post("/create",adminRegisterMiddleware, createPropblem);
problemRouter.patch("/:id",updateProblem);
problemRouter.delete("/:id", deleteProblem);

problemRouter.get("/:id", getProblemById);
problemRouter.get("/", getAllProblem);
problemRouter.get('/user', solvedAllProblemByUser);





