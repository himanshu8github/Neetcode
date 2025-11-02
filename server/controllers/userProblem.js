const { getLanguageById, submitBatch, submitToken } = require("../utils/problemUtility");
const Problem = require("../models/problemModel");

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



module.exports = {createProblem, updateProblem, deleteProblem, fetchProblemById, fetchAllProblem};