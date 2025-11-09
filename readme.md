# CodeMatrix

A comprehensive DSA (Data Structures & Algorithms) learning platform with AI-powered guidance, similar to LeetCode. Built with modern web technologies to provide an interactive coding environment with real-time feedback and intelligent tutoring.

## 🌟 Features

### User Features
- **User Authentication**: Secure signup, login, and JWT-based authentication
- **Problem Solving**: View, attempt, and submit solutions for DSA problems
- **AI-Powered Assistance**: Chat with AI bot for hints, explanations, and guidance
- **Multiple Languages**: Write and submit code in C++, Java, and JavaScript
- **Submission History**: Track all submissions with detailed results
- **Test Case Validation**: Run code against visible and hidden test cases
- **Complexity Analysis**: Get time and space complexity explanations

### Admin Features
- **Problem Management**: Create, update, and delete coding problems
- **Test Case Management**: Add visible and hidden test cases for problems
- **Code Templates**: Set initial code and reference solutions for multiple languages
- **Problem Analytics**: View problem statistics and submission data

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library with hooks and state management
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Component library built on Tailwind
- **React Hook Form** - Form management and validation
- **Zod** - TypeScript-first schema validation
- **Redux** - State management for authentication
- **Axios** - HTTP client for API calls
- **Monaco Editor** - Advanced code editor with syntax highlighting
- **Lucide React** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database for data persistence
- **Mongoose** - MongoDB ODM
- **JWT (JSON Web Tokens)** - Secure authentication
- **bcrypt** - Password hashing
- **dotenv** - Environment variable management

### AI & Code Execution
- **Groq API** - AI-powered chat and code assistance (Claude integration)
- **Judge0 API** - Online code execution and compilation


### Session Management & Performance
- **Redis** - Session management and token blacklisting
- **Cookie Parser** - HTTP cookie parsing
- **CORS** - Cross-origin resource sharing

## 🤖 AI Integration

CodeMatrix uses the **Groq API** to provide intelligent assistance:

- Real-time chat support for problem-solving
- Hints without spoilers
- Complexity analysis explanations
- Multiple approach suggestions
- Code review and debugging assistance

## ⚙️ Code Execution

**Judge0 API** is used for secure code execution:

- Supports C++, Java, and JavaScript
- Runs code in sandboxed environments
- Returns execution results with runtime metrics
- Handles compilation errors gracefully

## 🔄 Session Management

**Redis** is used for:

- Storing blacklisted JWT tokens on logout
- Session caching
- Rate limiting
- Performance optimization

## 🎨 UI/UX Features

- **Dark Theme**: Professional dark interface with sky-blue accents
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Real-time Feedback**: Instant code execution results
- **Smooth Animations**: Polished user experience with CSS transitions
- **Syntax Highlighting**: Monaco editor with language-specific highlighting
- **Status Indicators**: Visual feedback for accepted/rejected submissions
