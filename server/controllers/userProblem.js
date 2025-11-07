const { getLanguageById, submitBatch, submitToken } = require("../utils/problemUtility");
const Problem = require("../models/problemModel");
const User = require("../models/userModel");
const Submission = require("../models/codeSubmission")

const createProblem = async (req, res) => {
    const { title, description, difficulty, tags, visibleTestCases, hiddenTestCases, 
        startCode, referenceSolution
    } = req.body;

    try {
      
        // Iterate through each reference solution
        for (const { language, completeCode } of referenceSolution) {
            // Get language ID for Judge0
            const languageId = getLanguageById(language);

            if (!languageId) {
                return res.status(400).send(`Unsupported language: ${language}`);
            }

            //  const decodedCode = completeCode.replace(/\\n/g, '\n');

              const actualCode = completeCode.replace(/\\n/g, '\n');

            // Create batch submission with all visible test cases
            // const submissions = visibleTestCases.map((testcase) => ({
            //  source_code: actualCode,   
             
            //     language_id: languageId,
            //     stdin: testcase.input,
            //     expected_output: testcase.output  
            // }));
            // FIXED CODE
const submissions = visibleTestCases.map((testcase) => ({
    source_code: Buffer.from(actualCode).toString('base64'),
    language_id: languageId,
    stdin: Buffer.from(testcase.input).toString('base64'),
    expected_output: Buffer.from(testcase.output).toString('base64')
}));

            // Submit batch to Judge0
            const submitResult = await submitBatch(submissions);

            if (!submitResult) {
                return res.status(400).send("Failed to submit batch");
            }

            // console.log(submitResult);
            // Extract tokens from submission results
            const resultToken = submitResult.map((value) => value.token);

            // Wait for results and get test output
            const testResult = await submitToken(resultToken);

            // console.log(testResult);
            // Verify all tests passed (status_id 3 = accepted)
            for (const test of testResult) {
                if (test.status_id !== 3) {
                    return res.status(400).send(`Test failed for language ${language}. Status: ${test.status_id}`);
                }
            }
        }


    //     console.log("req.user:", req.user);
    //   console.log("req.user._id:", req.user?._id);
        // All tests passed, save problem to database
        const userProblem = await Problem.create({
            title,
            description,
            difficulty,
            tags,
            visibleTestCases,
            hiddenTestCases,
            startCode,
            referenceSolution,
            problemCreator: req.user._id  
        });

        res.status(201).json({
            message: "Problem saved successfully",
            problemId: userProblem._id
        });

    } catch (err) {
        console.error("Error in createProblem:", err);
        res.status(400).send("Error from userProblem file of createProblem function: " + err.message);
    }
};

// const createProblem = async (req, res) => {
//     const { title, description, difficulty, tags, visibleTestCases, hiddenTestCases, 
//         startCode, referenceSolution
//     } = req.body;

//     try {
//         // Just validate the data
//         if (!title || !description || !difficulty || !tags) {
//             return res.status(400).json({ error: "Missing required fields" });
//         }

//         if (!visibleTestCases?.length || !hiddenTestCases?.length) {
//             return res.status(400).json({ error: "Test cases required" });
//         }

//         if (!startCode?.length === 3 || !referenceSolution?.length === 3) {
//             return res.status(400).json({ error: "Code for all 3 languages required" });
//         }

//         // Save directly - no Judge0
//         const userProblem = await Problem.create({
//             title,
//             description,
//             difficulty,
//             tags,
//             visibleTestCases,
//             hiddenTestCases,
//             startCode,
//             referenceSolution,
//             problemCreator: req.user._id  
//         });

//         res.status(201).json({
//             message: "Problem saved successfully",
//             problemId: userProblem._id
//         });

//     } catch (err) {
//         console.error("Error:", err.message);
//         res.status(400).json({ error: err.message });
//     }
// };


// for updating problem using id
const updateProblem = async (req, res) => {

    const {id} = req.params;

       const { title, description, difficulty, tags, visibleTestCases, hiddenTestCases, 
        startCode, referenceSolution
    } = req.body;

    try{

        if(!id){
            return res.status(400).send("Missing ID Field");
        }

        const DsaProblem = await Problem.findById(id);

        if(!DsaProblem) {
            return res.status(404).send("ID is not present in server");
        }

         // Iterate through each reference solution
        for (const { language, completeCode } of referenceSolution) {
            // Get language ID for Judge0
            const languageId = getLanguageById(language);

            if (!languageId) {
                return res.status(400).send(`Unsupported language: ${language}`);
            }

          
            // Create batch submission with all visible test cases
            const submissions = visibleTestCases.map((testcase) => ({
                source_code: completeCode,
             
                language_id: languageId,
                stdin: testcase.input,
                expected_output: testcase.output  
            }));

            // Submit batch to Judge0
            const submitResult = await submitBatch(submissions);

            if (!submitResult) {
                return res.status(400).send("Failed to submit batch");
            }

            // console.log(submitResult);
            // Extract tokens from submission results
            const resultToken = submitResult.map((value) => value.token);

            // Wait for results and get test output
            const testResult = await submitToken(resultToken);

            // console.log(testResult);
            // Verify all tests passed (status_id 3 = accepted)
            for (const test of testResult) {
                if (test.status_id !== 3) {
                    return res.status(400).send(`Test failed for language ${language}. Status: ${test.status_id}`);
                }
            }
        }


        // now we update this in out data
       const newUpdatedProblem = await Problem.findByIdAndUpdate(id, {...req.body}, {runValidators: true, new:true});
       res.status(200).send(newUpdatedProblem);


    }catch(err){
        res.status(400).send("Error from userProblem file and updateProblem function : " + err);

    }

}

//for delete dsa problem using id by admin

const deleteProblem = async (req, res) => {

    const {id} = req.params;

    try{

        
        if(!id){
            return res.status(400).send("Missing ID Field");
        }

        const deletedProblem = await Problem.findByIdAndDelete(id);

        if(!deletedProblem){
            return res.status(400).send("Problem is missing");
        }

    res.status(200).send("Problem sucessfully Deleted");

    }
    catch(err){
      res.status(400).send("Error from userProblem File from deleteProblem Function : " + err); 
    }
}

// for getting DSA Problem by ID
const fetchProblemById = async (req, res) => {

    const {id} = req.params;



    try {

        if(!id){
            return res.status(400).send("ID is Missing");
        }

        const getProblem = await Problem.findById(id).select('_id title description difficulty tags visibleTestCases startCode');

        if(!getProblem){
            return res.status(404).send("Problem is Missing");
        }

        res.status(200).send(getProblem);
        
    } catch (err) {
          res.status(400).send("Error from userProblem File from fetchProblemById Function : " + err); 
    }
}


// for getting all DSA problem
const fetchAllProblem = async (req, res) => {


    try {

        const getProblem = await Problem.find({}).select('_id title difficulty tags');

        if(getProblem.length == 0 ){
            return res.status(404).send("Problem is Missing");
        }

        res.status(200).send(getProblem);
        
    } catch (err) {
          res.status(400).send("Error from userProblem File from fetchAllProblem Function : " + err); 
    }

}

// fetch all DSA problem solved by USER
const solvedAllProblemByUser = async (req, res) => {


    try {

     const userId = req.user._id;
     const allSolvedProblem = await User.findById(userId).populate({
        path : "problemSolved",
        select : "_id title difficulty tags"
     });

        res.status(200).send(allSolvedProblem.problemSolved);
        
    } catch (err) {
        res.status(500).send("Server error" + err);
    }
}

const submittedProblem = async (req, res) => {
     try{
     
    const userId = req.user._id;
    const problemId = req.params.pid;

   const ans = await Submission.find({userId,problemId});
  
  if(ans.length==0)
    res.status(200).send("No Submission is persent");

  res.status(200).send(ans);

  }
  catch(err){
     res.status(500).send("Internal Server Error");
  }
}

module.exports = {createProblem, updateProblem, deleteProblem, fetchProblemById, fetchAllProblem, solvedAllProblemByUser, submittedProblem};