const {getLanguageById , submitBatch} = require("../utils/problemUtility");
const Problem = require("../models/problemModel")

const createProblem = async (req, res) => {

    const {title, description, difficulty, tags, visibleTestCases, hiddenTestCases, 
        startCode, referenceSolution, problemCreator
    } = req.body;


   try{

    // WE WILL iterate on array from ref solution schema(DB)
    // like we consider refrenceSolution is an array

    for(const {language, completeCode} of referenceSolution){

        // source_code
        // language_id
        // stdInput
        // expected_output

        const languageId = getLanguageById(language);


        // here we create batch submission , like we send code and all multiple cases together
        const submissions = visibleTestCases.map((testcase) => ({
            source_code : completeCode,
            language_id: languageId,
            stdin : testcase.input,
            expected_ouput : testcase.output
        }));

        // creating function for submission (in utils folder)
        const submitResult = await submitBatch(submissions);

        // it will create array for tokens
        // [{"token" : "acdcvcvhjcbqacbnjqkwcnw"},
        //   {"token " : "jchbwhjcbwcjhbechjbhc"}
        // ]
        // then it have only values ("lkdbejcbehkjc", 'dhGXHJACBHJ)
        const resultToken = submitResult.map((value) => value.token);
        
        const testResult = await submitToken(resultToken);

        for(const test of testResult){
            if(test.status_id != 3){
                return res.status(400).send("Error Occuured");
            }
        }


    }

    // now we will store it in DB
    const userProblem = await Problem.create({
        ...req.body,
        problemCreator: req.result._id
    })

   }catch(err){

   }

}