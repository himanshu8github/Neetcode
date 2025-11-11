const Problem = require("../models/problemModel");
const Submission = require("../models/codeSubmission");
const User = require("../models/userModel");
const {getLanguageById,submitBatch,submitToken} = require("../utils/problemUtility");

const decodeBase64 = (str) => {
    if (!str) return '';
    try {
        return Buffer.from(str, 'base64').toString('utf-8');
    } catch (err) {
        return str;
    }
};

const userCodeSubmit = async (req, res) => {
    try{
         const userId = req.user?._id;
if (!userId) return res.status(401).send("Login required");

         const problemId = req.params.id;

         let {code, language} = req.body;

         if(!userId || !code || !problemId || !language)
             return res.status(400).send("Some field missing");
      
         if(language === 'cpp')
             language = 'c++';

         // Fetch the problem from database
         const problem = await Problem.findById(problemId);
         
         if(!problem)
             return res.status(404).send("Problem not found");

         // Create submission record
         const submittedResult = await Submission.create({
             userId,
             problemId,
             code,
             language,
             status: 'pending',
             testCasesTotal: problem.hiddenTestCases.length
         });

         // Submit code to JUDGE0
           console.log("Language:", language);
         const languageId = getLanguageById(language);
         console.log("Language ID:", languageId);
         
         // FIX: Use code from request, not undefined completeCode
         const actualCode = code;

         // FIX: Use problem.visibleTestCases, not undefined visibleTestCases
        const submissions = problem.visibleTestCases.map(testcase => ({
    source_code: Buffer.from(actualCode).toString("base64"),
    language_id: languageId,
   stdin: Buffer.from(testcase.input.replace(/ /g, "\n")).toString("base64"),

    expected_output: Buffer.from(testcase.output).toString("base64")
}));


    //         console.log("Submissions array:", submissions);
    // console.log("Submissions length:", submissions.length);

         const submitResult = await submitBatch(submissions);
 if (!submitResult || submitResult.error) {
    console.error("Judge0 Error:", submitResult);
    return res.status(500).send("Judge0 API Error");
}
         const resultToken = submitResult.map((value) => value.token);
         const testResult = await submitToken(resultToken);

         
  
    console.log("Submit result:", submitResult);

         // Process results
         let testCasesPassed = 0;
         let runtime = 0;
         let memory = 0;
         let status = 'accepted';
         let errorMessage = null;

         for(const test of testResult){
             if(test.status_id == 3){
                 testCasesPassed++;
                 runtime = runtime + parseFloat(test.time);
                 memory = Math.max(memory, test.memory);
             } else {
                 if(test.status_id == 4){
                     status = 'error';
                     errorMessage = test.stderr;
                 } else {
                     status = 'wrong';
                     errorMessage = test.stderr;
                 }
             }
         }

         // Update submission in DB
         submittedResult.status = status;
         submittedResult.testCasesPassed = testCasesPassed;
         submittedResult.errorMessage = errorMessage;
         submittedResult.runtime = runtime;
         submittedResult.memory = memory;

         await submittedResult.save();

         // Update user's solved problems
         if(!req.user.problemSolved.includes(problemId)){
             req.user.problemSolved.push(problemId);
             await req.user.save();
         }
    
         const accepted = (status == 'accepted');
         res.status(201).json({
             accepted,
             totalTestCases: submittedResult.testCasesTotal,
             passedTestCases: testCasesPassed,
             runtime,
             memory
         });
    } catch(err){
         console.error("FULL ERROR DETAILS:", err.message);
    console.error("Error stack:", err.stack);
    res.status(500).send("Error: " + err.message);
    }
};

const runCode = async(req, res) => {
    try{
         const userId = req.user?._id;
if (!userId) return res.status(401).send("Login required");

         const problemId = req.params.id;

         let {code, language} = req.body;

         if(!userId || !code || !problemId || !language)
             return res.status(400).send("Some field missing");

         // Fetch the problem from database
         const problem = await Problem.findById(problemId);
         
         if(!problem)
             return res.status(404).send("Problem not found");

         if(language === 'cpp')
             language = 'c++';

         // Submit code to Judge0
           console.log("Language:", language);
         const languageId = getLanguageById(language);
         console.log("Language ID:", languageId);

         // FIX: Use code from request, not undefined completeCode
         const actualCode = code;

         // FIX: Use problem.visibleTestCases, not undefined visibleTestCases
         const submissions = problem.visibleTestCases.map(testcase => ({
    source_code: Buffer.from(actualCode).toString("base64"),
    language_id: languageId,
    stdin: Buffer.from(testcase.input.replace(/ /g, "\n")).toString("base64"),

    expected_output: Buffer.from(testcase.output).toString("base64")
}));


           console.log("Submissions array:", submissions);
    console.log("Submissions length:", submissions.length);
    console.log("About to submit to Judge0");
console.log("Submissions:", JSON.stringify(submissions, null, 2));


         const submitResult = await submitBatch(submissions);
 if (!submitResult || submitResult.error) {
    console.error("Judge0 Error:", submitResult);
    return res.status(500).send("Judge0 API Error");
}
         const resultToken = submitResult.map((value) => value.token);
         const testResult = await submitToken(resultToken);

         

    console.log("Submit result:", submitResult);

         // Process results
         let testCasesPassed = 0;
         let runtime = 0;
         let memory = 0;
         let status = true;
         let errorMessage = null;

         for(const test of testResult){
             if(test.status_id == 3){
                 testCasesPassed++;
                 runtime = runtime + parseFloat(test.time);
                 memory = Math.max(memory, test.memory);
             } else {
                 if(test.status_id == 4){
                     status = false;
                     errorMessage = test.stderr;
                 } else {
                     status = false;
                     errorMessage = test.stderr;
                 }
             }
         }

         res.status(201).json({
             success: status,
            testCases: testResult.map(tc => ({
    stdout: tc.stdout ? decodeBase64(tc.stdout) : '',
    status_id: tc.status_id
})),
             runtime,
             memory
         });
    } catch(err){
         console.error("FULL ERROR DETAILS:", err.message);
    console.error("Error stack:", err.stack);
    res.status(500).send("Error: " + err.message);
    }
};

module.exports = {userCodeSubmit, runCode};