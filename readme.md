# 🚀 CodeMatrix

> Master Data Structures & Algorithms with AI-powered guidance, real-time code execution, and intelligent feedback.

A modern, interactive coding platform designed to make learning DSA engaging, efficient, and fun. Write code, get instant feedback, receive AI-powered hints, and track your progress—all in one beautiful interface.

---

## ✨ Key Features

### 💡 For Problem Solvers
- **Write & Execute Code** - Solve problems in C++, Java, or JavaScript with syntax highlighting
- **Real-Time Testing** - Run your code against test cases instantly and see results
- **Smart Feedback** - Submit solutions and get detailed feedback on correctness
- **AI Tutor** - Chat with an intelligent AI bot for hints, guidance, and explanations
- **Track Progress** - View your submission history with runtime metrics and complexity analysis
- **Learn Better** - Get hints without spoilers, understand multiple approaches, and improve problem-solving skills

### 🔐 Authentication & Security
- **Secure Login/Signup** - JWT-based authentication with password hashing
- **Token Management** - Redis-powered session handling and token blacklisting
- **Safe Submissions** - Secure code execution in sandboxed environments

### 👨‍💼 For Administrators
- **Create Problems** - Add new DSA problems with descriptions and examples
- **Manage Test Cases** - Set visible and hidden test cases for validation
- **Provide Templates** - Upload starter code and reference solutions in multiple languages
- **Track Analytics** - Monitor problem difficulty, submission rates, and user progress

---

## 🛠️ Technology Stack

### Frontend 
React.js • Tailwind CSS • DaisyUI • Monaco Editor • Redux • React Hook Form • Axios • Lucide Icons

### Backend Power
Node.js • Express.js • MongoDB • Mongoose • JWT • bcrypt

### AI & Execution
Groq API • Judge0 API • Redis


### MongoDB & Redis
Stores user data, problems, submissions, and manages sessions efficiently.

---

## 🌟 Why CodeMatrix?

✅ **Clean, Modern UI** - Dark theme with intuitive navigation  
✅ **Multi-Language Support** - C++, Java, JavaScript  
✅ **AI-Powered Mentoring** - Get personalized guidance without spoilers  
✅ **Fast Code Execution** - Judge0 integration for instant results  
✅ **Production Ready** - Fully deployed and scalable  
✅ **Mobile Friendly** - Practice coding anywhere, anytime  

---

## 🚀 Getting Started

### Prerequisites
Before you begin, ensure you have installed:
- Git
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Redis (local or cloud)

### Quick Setup

**Step 1: Clone the Repository**
```bash
git clone https://github.com/yourusername/codematrix.git
cd codematrix
```

**Step 2: Setup Backend**
```bash
cd server
npm install
```

Create a `.env` file in the server directory with:
```
MONGODB_URI=your_mongodb_connection_string
REDIS_URL=your_redis_connection_string
JWT_KEY=your_jwt_secret_key
JUDGE0_API_KEY=your_judge0_api_key
GROQ_API_KEY=your_groq_api_key
PORT=5000
```

Start the backend:
```bash
npm start
```

**Step 3: Setup Frontend**
```bash
cd client
npm install
```

Create a `.env.local` file:
```
VITE_BACKEND_URL=http://localhost:5000
```

Start the frontend:
```bash
npm run dev
```

Your app is now running on `http://localhost:5173`

---

## 📋 Environment Variables

### Backend (.env)
- `MONGODB_URI` - MongoDB connection string
- `REDIS_URL` - Redis connection URL
- `JWT_KEY` - Secret key for JWT tokens
- `JUDGE0_API_KEY` - RapidAPI Judge0 key
- `GROQ_API_KEY` - Groq API key for AI features
- `PORT` - Server port (default: 5000)

### Frontend (.env.local)
- `VITE_BACKEND_URL` - Backend API URL

---

## 🎮 How to Use

1. **Sign Up** - Create an account with your email
2. **Browse Problems** - Explore DSA problems by difficulty level
3. **Solve Problems** - Write your solution in the code editor
4. **Test Your Code** - Click "Run" to test against visible test cases
5. **Get AI Help** - Chat with the AI bot for hints and guidance
6. **Submit Solution** - Submit to test against hidden test cases
7. **Review Results** - Check your submissions and track progress

---

## 🔄 Deployment

### Deploy to Vercel (Frontend)

### Deploy Backend (Render/Railway)



## 💡 API Integration

### Judge0 API
Handles secure code execution for multiple programming languages with real-time results.

### Groq API
Powers intelligent AI tutoring with context-aware hints and explanations based on the current problem.

### MongoDB & Redis
Stores user data, problems, submissions, and manages sessions efficiently.

---




## 📈 Features Coming Soon

- Live coding interviews
- Live coding room
- Discussion forums
- Community contests
- Advanced filtering and search
- Problem difficulty ratings by users
- Video tutorials integration

---



## 💬 Support

Have questions or found a bug? reach out to the me himanshukakran8@gmail.com

---

** 🎉 Master DSA with CodeMatrix.**