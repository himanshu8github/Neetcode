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

module.exports = createProblem;