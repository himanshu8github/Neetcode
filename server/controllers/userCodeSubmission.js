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

    }catch(err){

    }

}

module.exports = userCodeSubmission;