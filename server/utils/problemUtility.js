const axios = require('axios');

const getLanguageById = (lang) => {
    const language = {
        "c++": 54,
        "java": 62,
        "javascript": 63
    };

    return language[lang.toLowerCase()];
};

// POST
const submitBatch = async (submissions) => {
    const options = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
        params: {
            base64_encoded: 'false'
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

    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error('Error in submitBatch:', error);
        throw error;
    }
};


const waiting = async (timer) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(1);
        }, timer);
    });
};

// GET 
const submitToken = async (resultToken) => {
    const options = {
        method: 'GET',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
        params: {
            tokens: resultToken.join(","),
            base64_encoded: 'false',
            fields: '*'
        },
        headers: {
            'x-rapidapi-key': 'acb8a6167amshe2d92ed24b22f3fp11f788jsn1c5acdfc8e9e',
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
        }
    };

    while (true) {
        try {
            const result = await axios.request(options);
            
            // Log to see actual structure
            console.log("submitToken response:", result.data);

            // Handle both array and object responses
            const submissions = Array.isArray(result.data) ? result.data : result.data.submissions;

            if (!submissions || submissions.length === 0) {
                console.log("No submissions in response, retrying...");
                await waiting(1000);
                continue;
            }

            const isResultObtained = submissions.every((r) => r.status_id > 2);

            if (isResultObtained) {
                return submissions;
            }

            await waiting(1000);
        } catch (error) {
            console.error('Error in submitToken:', error);
            throw error;
        }
    }
};

module.exports = { getLanguageById, submitBatch, submitToken };