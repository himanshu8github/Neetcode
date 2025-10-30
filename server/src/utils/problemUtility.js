const axios = require('axios');

const getLanguageById = (lang) => {

    const language ={
        "c++":54,
        "java":62,
        "javascript":63
    }

    return language[lang.tolowercase()];''
}


// POST
const submitBatch = async (submissions) => {

   

const options = {
  method: 'POST',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    base64_encoded: 'true'
  },
  headers: {
    'x-rapidapi-key': 'acb8a6167amshe2d92ed24b22f3fp11f788jsn1c5acdfc8e9e',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
    'Content-Type': 'application/json'
  },
  data: {
    submissions
    
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		return response.data;
	} catch (error) {
		console.error(error);
	}
}

return await fetchData();
}


const waiting = async(timer) => {

    setTimeout(() => {
        return 1;
    }, timer);
}

// GET 
const submitToken = async (resultToken) => {


const options = {
  method: 'GET',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    tokens: resultToken.join(","),
    base64_encoded: 'true',
    fields: '*'
  },
  headers: {
    'x-rapidapi-key': 'acb8a6167amshe2d92ed24b22f3fp11f788jsn1c5acdfc8e9e',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		return response.data;
	} catch (error) {
		console.error(error);
	}
}

while (true){
   const result = await fetchData();

   const IsResultObtained = result.submissions.every((r) => r.status_id>2);

   if(IsResultObtained)
    return result.submissions;

   await waiting(1000);
}}

module.exports = {getLanguageById, submitBatch, submitToken};