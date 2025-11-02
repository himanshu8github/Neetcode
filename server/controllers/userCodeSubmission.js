const Problem = require("../models/problem");
const Submission = require("../models/submission");
const User = require("../models/user");
const {getLanguageById,submitBatch,submitToken} = require("../utils/problemUtility");

const userCodeSubmission = async (req, res) => {

    try{

         const userId = req.result._id;
       const problemId = req.params.id;

       let {code,language} = req.body;

      if(!userId||!code||!problemId||!language)
        return res.status(400).send("Some field missing");
      

      if(language==='cpp')
        language='c++'
      
      console.log(language);

       //    Fetch the problem from database
       const problem =  await Problem.findById(problemId);
    //    we get testcases(Hidden) from this
    
   // when user run code it store in db as pending state and when judge0 //\\return the ouput we update the status in our DB
    const submittedResult = await Submission.create({
          userId,
          problemId,
          code,
          language,
          status:'pending',
          testCasesTotal:problem.hiddenTestCases.length
     })

       //  submit code to JUDGE0
    
    const languageId = getLanguageById(language);
   
    const submissions = problem.hiddenTestCases.map((testcase)=>({
        source_code:code,
        language_id: languageId,
        stdin: testcase.input,
        expected_output: testcase.output
    }));

      const submitResult = await submitBatch(submissions);
    
    const resultToken = submitResult.map((value)=> value.token);

    const testResult = await submitToken(resultToken);
    

    // now we submittedResult in our DB
    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = 'accepted';
    let errorMessage = null;


        for(const test of testResult){
        if(test.status_id==3){
           testCasesPassed++;
           runtime = runtime+parseFloat(test.time)
           memory = Math.max(memory,test.memory);
        }else{
          if(test.status_id==4){
            status = 'error'
            errorMessage = test.stderr
          }
          else{
            status = 'wrong'
            errorMessage = test.stderr
          }
        }
    }

 // Store the result in Database in Submission
    submittedResult.status   = status;
    submittedResult.testCasesPassed = testCasesPassed;
    submittedResult.errorMessage = errorMessage;
    submittedResult.runtime = runtime;
    submittedResult.memory = memory;

    await submittedResult.save();
    
    // ProblemId ko insert karenge userSchema ke problemSolved mein if it is not persent there.
    
    // req.result == user Information

    if(!req.result.problemSolved.includes(problemId)){
      req.result.problemSolved.push(problemId);
      await req.result.save();
    }
    
    const accepted = (status == 'accepted')
    res.status(201).json({
      accepted,
      totalTestCases: submittedResult.testCasesTotal,
      passedTestCases: testCasesPassed,
      runtime,
      memory
    });
       

    }catch(err){
 res.status(500).send("Internal Server Error "+ err);
    }

}

module.exports = userCodeSubmission;