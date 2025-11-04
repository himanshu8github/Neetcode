npm install bcryptjs jsonwebtoken validator\
npm install nodemailer
npm install redis
npm install --save-dev nodemon
 npm i bcrypt



Flow of project
Backend =>
Type of User = normal user / admin(have access to create problem )
We Required API For - 
1.User Authentication
2.For Problems creation
3.Code submission
4.DSA problem


1. Build User Auth System(API)
Register
Login
Logout
OTP verification
Google Signup
Github fetch of user
Email verify
reset pass
forgot pass

/**Email-Verification**/
-> it send https/GET request to backend with a token , then 

/**MongoDB-Schema**/
1. User Schema/Admin Schema
(firstname, lastname, role(user/admin), email, pass, solveed problems),images
2.Problem Schema ->
 problem ID, title, Runtestcases, hiddentestcases, initial code(with language),
accepted sol, real sol, hiddenouputTestcases, videoSol
3.SubmitProblemSchema->
userSol, ProbID, Sol(accepted/rejected)

/**Auth sysytem (login, signup, )**/
1. UserAuthentication

create route folder => defines routes with func(register,login,logout,getProfile),
then create another file in controller where define those function,
then in that file first we import Schema,
then we write async function and implement try{}.catch{}.block..., where we require user schema from req.body,
then create another file in utils named with validator.js,
where we validate the input(so we have to install the library first) =>
 (npm i validator),
 then we write some code and use .every() func
 then we install bcrypt lib to convert org pass to hashed pass to store it on DB
 then we instal ( npm i jsonwebtoken) => use jwt.sign, define what we store like emailid only , then we have secretkey, also i define in how much time will the token expire, 
 then we use a jwt secret key  (node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
also we dont have to check that user is exisit or not because we already define it in schema where we marked email:unique

=> now we implement logout feature
first i create another file name userMiddleware where I,
 get token from cookies,
then VERIFY jwt token,
then find user by id,
then we use another lib Redis,
npm install redis, then we implement logout feature, where we first get token from body , then  Block the token using Redis, then clear the cookies, then we check all routes with the help of Postman, ALL Set

=> implement a feature in /register route that if anyone come with this route then always that person be a user
=> also create another route admin/register => throgh this the admin registered another admin using adminMiddleware 
=> aftewr this we define another schema for problem,
then we create another file for route for problem where we define routes for 
// routes for => // create //fetch // update //delete , 





/// JUDEG-0
// when we submit code with test cases, it return token , then when we 
// send token then we recieve status id with like
 1-queue, 2-processing, 3- accepted


 //problem body
 //
 {
  "title": "Add Two Numbers",
  "description": "Write a program that takes two integers as input and returns their sum.",
  "difficulty": "easy",
  "tags": "array",
  "visibleTestCases": [
    { "input": "2 3", "output": "5", "explanation": "2 + 3 equals 5" },
    { "input": "-1 5", "output": "4", "explanation": "-1 + 5 equals 4" }
  ],
  "hiddenTestCases": [
    { "input": "10 20", "output": "30" },
    { "input": "100 250", "output": "350" }
  ],
  "startCode": [
    {
      "language": "C++",
      "initialCode": "#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    // Read input here\n    cout << a + b;\n    return 0;\n}"
    },
    {
      "language": "Java",
      "initialCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Read input here\n    }\n}"
    },
    {
      "language": "JavaScript",
      "initialCode": "const input = require('fs').readFileSync(0, 'utf-8').trim();\nconst [a, b] = input.split(' ').map(Number);\n\n// Write your code here"
    }
  ],
  "referenceSolution": [
    {
      "language": "C++",
      "completeCode": "#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << a + b;\n    return 0;\n}"
    },
    {
      "language": "Java",
      "completeCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        System.out.println(a + b);\n    }\n}"
    },
    {
      "language": "JavaScript",
      "completeCode": "const input = require('fs').readFileSync(0, 'utf-8').trim();\nconst [a, b] = input.split(' ').map(Number);\nconsole.log(a + b);"
    }
  ]
}
//

Now after testing all route 
problem create sucessfully
now moving to other routes of problem like update, delete etc..

--> building route for update problem with id in (controller -> userProblem)

// pagination
await problem.find().skip().limit(10) 
//const page = 2;
const limit = 10;
const skip =(page - 1) * limit;





/**********************
{
    "firstName" : "Himanshu kakran",
    "emailId" : "himanshuadmin10@example.com",
    "password" : "AdminPass@123"
}


// **************************   sum of array
{
  "title": "Sum of Array",
  "description": "Write a program that takes an array of integers as input and returns the sum of all elements in the array.",
  "difficulty": "easy",
  "tags": "array",
  "visibleTestCases": [
    { "input": "1 2 3 4 5", "output": "15", "explanation": "1+2+3+4+5 = 15" },
    { "input": "10 20 30", "output": "60", "explanation": "10+20+30 = 60" }
  ],
  "hiddenTestCases": [
    { "input": "5 5 5 5", "output": "20" },
    { "input": "100 200 300", "output": "600" }
  ],
  "startCode": [
    {
      "language": "C++",
      "initialCode": "#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    int sum = 0;\n    \n    while(cin >> n) {\n        sum += n;\n    }\n    \n    cout << sum;\n    return 0;\n}"
    },
    {
      "language": "Java",
      "initialCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int sum = 0;\n        \n        while(sc.hasNextInt()) {\n            sum += sc.nextInt();\n        }\n        \n        System.out.println(sum);\n    }\n}"
    },
    {
      "language": "JavaScript",
      "initialCode": "const input = require('fs').readFileSync(0, 'utf-8').trim();\nconst numbers = input.split(' ').map(Number);\nlet sum = 0;\n\nfor(let i = 0; i < numbers.length; i++) {\n    sum += numbers[i];\n}\n\nconsole.log(sum);"
    }
  ],
  "referenceSolution": [
    {
      "language": "C++",
      "completeCode": "#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    int sum = 0;\n    \n    while(cin >> n) {\n        sum += n;\n    }\n    \n    cout << sum;\n    return 0;\n}"
    },
    {
      "language": "Java",
      "completeCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int sum = 0;\n        \n        while(sc.hasNextInt()) {\n            sum += sc.nextInt();\n        }\n        \n        System.out.println(sum);\n    }\n}"
    },
    {
      "language": "JavaScript",
      "completeCode": "const input = require('fs').readFileSync(0, 'utf-8').trim();\nconst numbers = input.split(' ').map(Number);\nlet sum = 0;\n\nfor(let i = 0; i < numbers.length; i++) {\n    sum += numbers[i];\n}\n\nconsole.log(sum);"
    }
  ]
}

///////////


/**********
if we want to get some data from DB but some specific anot all then we use
  const getProblem = await Problem.findById(id).select('_id title description difficulty tags visibleTestCases startCode');
  ********/

/ ***********
about submisiion code status in DB , wrong, accepted, 
at this time etc.. --> we store every info when user submit code whether is is wrong, correct whatever b***/

when user click on run button only visible test cases will run 
but when user click on submit button then hidden cases also run and rsult store in DB---> we store only after submit button not after run button
when user run code it store in db as pending state and when judge0 return the ouput we update the status in our DB

***********
for fetch all submission of a particular problem by a usr we use indexing in DB for optimix=zation and fast



















/***********                 FRONTEND                ****************/

- Install react with Vite