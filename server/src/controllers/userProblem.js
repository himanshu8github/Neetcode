const getLanguageById = require("../utils/problemUtility");

const createProblem = async (req, res) => {

    const {title, description, difficulty, tags, visibleTestCases, hiddenTestCases, 
        startCode, referenceSolution, problemCreator
    } = req.body;


   try{

    for(const {language, completeCode} of referenceSolution){

        // source_code
        // language_id
        // stdInput
        // expected_output

        const languageId = getLanguageById(language);

    }

   }catch(err){

   }

}