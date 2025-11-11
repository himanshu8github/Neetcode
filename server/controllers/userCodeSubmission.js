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

         const userId = req.user._id;
      

       const problemId = req.params.id;

       let {code,language} = req.body;

      if(!userId||!code||!problemId||!language)
        return res.status(400).send("Some field missing");
      

      if(language==='cpp')
        language='c++'
      
      // console.log(language);

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
   
  const actualCode = completeCode.replace(/\\n/g, '\n');

const submissions = visibleTestCases.map((testcase) => ({
    source_code: Buffer.from(actualCode).toString("base64"),
    language_id: languageId,
    stdin: Buffer.from(testcase.input).toString("base64"),
    expected_output: Buffer.from(testcase.output).toString("base64")
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
    

    if(!req.user.problemSolved.includes(problemId)){
      req.user.problemSolved.push(problemId);
      await req.user.save();
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

const runCode = async(req,res)=>{
    
     // 
     try{
      const userId = req.user._id;
      const problemId = req.params.id;

      let {code,language} = req.body;

     if(!userId||!code||!problemId||!language)
       return res.status(400).send("Some field missing");

   //    Fetch the problem from database
      const problem =  await Problem.findById(problemId);
   //    testcases(Hidden)
      if(language==='cpp')
        language='c++'

   //    Judge0 code ko submit karna hai

   const languageId = getLanguageById(language);

  const actualCode = completeCode.replace(/\\n/g, '\n');

const submissions = visibleTestCases.map((testcase) => ({
    source_code: Buffer.from(actualCode).toString("base64"),
    language_id: languageId,
    stdin: Buffer.from(testcase.input).toString("base64"),
    expected_output: Buffer.from(testcase.output).toString("base64")
}));



   const submitResult = await submitBatch(submissions);
   
   const resultToken = submitResult.map((value)=> value.token);

   const testResult = await submitToken(resultToken);

    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = true;
    let errorMessage = null;

    for(const test of testResult){
        if(test.status_id==3){
           testCasesPassed++;
           runtime = runtime+parseFloat(test.time)
           memory = Math.max(memory,test.memory);
        }else{
          if(test.status_id==4){
            status = false
            errorMessage = test.stderr
          }
          else{
            status = false
            errorMessage = test.stderr
          }
        }
    }

   
  
 res.status(201).json({
    success:status,
    testCases: testResult.map(tc => ({
        stdin: decodeBase64(tc.stdin),
        expected_output: decodeBase64(tc.expected_output),
        stdout: tc.stdout ? decodeBase64(tc.stdout) : '',
        status_id: tc.status_id
    })),
    runtime,
    memory
   });
      
   }
   catch(err){
     res.status(500).send("Internal Server Error "+ err);
   }
}

module.exports = {userCodeSubmit, runCode};