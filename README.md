# 🎓 MathMagic - AI-Powered Mathematics Solver

<div align="center">
  <img src="https://via.placeholder.com/800x400/1a1a24/9333ea?text=MathMagic+AI+Solver" alt="MathMagic Demo" width="800" height="400">

  **An intelligent, modern web application that provides comprehensive step-by-step solutions to mathematics problems across all branches, powered by advanced AI technology with a stunning animated interface.**

  ![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react)
  ![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js)
  ![MongoDB](https://img.shields.io/badge/MongoDB-8.19.1-47A248?style=flat-square&logo=mongodb)
  ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.6-38B2AC?style=flat-square&logo=tailwind-css)
  ![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

  [🚀 Live Demo](#) • [📖 Documentation](#) • [🛠️ Installation](#installation)
</div>

## ✨ Key Features

### 🧮 **Comprehensive Math Coverage**
- **Algebra**: Equations, inequalities, polynomials, matrices, quadratic formulas
- **Calculus**: Derivatives, integrals, limits, series, differential equations
- **Geometry**: Shapes, areas, volumes, coordinate geometry, theorems
- **Trigonometry**: Identities, functions, triangles, trigonometric equations
- **Statistics & Probability**: Distributions, hypothesis testing, permutations
- **Arithmetic**: All basic operations, fractions, decimals, percentages

### 🎨 **Modern Animated Interface**
- **Dark Glassmorphism Theme**: Beautiful, eye-friendly dark interface with glass effects
- **Animated Background**: Floating geometric shapes (circle, square, rectangle, trapezium) with glowing effects
- **Mathematical Symbols**: Animated plus, division, pi, sigma, integral, square root, and multiplication symbols
- **Responsive Animations**: Smooth floating, pulsing, and rotation animations
- **Interactive Elements**: Hover effects, smooth transitions, and loading states

### 🔐 **User Authentication System**
- **Secure Registration**: User signup with email and password validation
- **JWT Authentication**: Secure login with JSON Web Tokens
- **Protected Routes**: Math solver accessible only to authenticated users
- **Session Management**: Automatic logout and session handling
- **User Dashboard**: Personalized experience with calculation history

### 📚 **Educational Excellence**
- **Detailed Step-by-Step Solutions**: From basic concepts to final answers with explanations
- **Interactive Learning**: Collapsible accordion steps for better understanding
- **Formula Explanations**: Every mathematical formula used is clearly explained
- **Progressive Difficulty**: Builds understanding from fundamentals to advanced concepts
- **Student-Friendly**: Designed for students from middle school to university level

### 📊 **Smart Graph Visualization**
- **Conditional Display**: Graphs appear only when explicitly requested in questions
- **Multiple Chart Types**: Line graphs, parabolas, circles, scatter plots, functions
- **High Precision**: 20-50 data points for mathematical accuracy
- **Interactive Controls**: Zoom, pan, and detailed coordinate display
- **Responsive Charts**: Optimized for both desktop and mobile viewing

### � **Calculation History**
- **Persistent Storage**: All solved problems saved to MongoDB database
- **Organized Display**: Chronological history with question numbers
- **Quick Recalculation**: One-click to solve the same problem again
- **Responsive Layout**: Optimized display for mobile and desktop
- **Date Tracking**: Timestamp for each calculation with formatted dates

### 🛡️ **Advanced Security & Performance**
- **Rate Limiting**: Built-in protection against API abuse (100 requests/15min)
- **Helmet.js Integration**: Security headers and XSS protection
- **Input Validation**: Comprehensive validation and sanitization
- **CORS Configuration**: Secure cross-origin resource sharing
- **Environment Security**: Sensitive data stored server-side only

## 🛠️ Technology Stack

### 🎨 **Frontend**
- **React 18.3.1**: Modern React with hooks and concurrent features
- **Vite 5.4.8**: Lightning-fast build tool and development server
- **Tailwind CSS 3.4.14**: Utility-first CSS framework with custom dark theme
- **React Router DOM 6.28.0**: Client-side routing for single-page application
- **Axios 1.7.7**: HTTP client for API communication
- **Recharts 2.13.0**: Composable charting library for data visualization
- **Lucide React 0.451.0**: Beautiful & consistent icon library
- **React Hot Toast 2.4.1**: Toast notifications for user feedback

### ⚙️ **Backend**
- **Node.js 20.x**: JavaScript runtime for server-side development
- **Express.js 4.21.1**: Fast, unopinionated web framework
- **MongoDB 8.7.0**: NoSQL database for flexible data storage
- **Mongoose 8.8.0**: Elegant MongoDB object modeling for Node.js
- **JWT (jsonwebtoken 9.0.2)**: Secure token-based authentication
- **bcryptjs 2.4.3**: Password hashing for security
- **Helmet.js 8.0.0**: Security middleware for Express applications
- **CORS 2.8.5**: Cross-origin resource sharing configuration

### 🤖 **AI & External Services**
- **OpenRouter API**: Advanced AI models for mathematical problem solving
- **Multiple AI Models**: Access to GPT-4, Claude, Gemini, and other models
- **Intelligent Routing**: Automatic model selection based on problem complexity

### 🛡️ **Security & Performance**
- **Helmet.js**: Security headers and XSS protection
- **Rate Limiting**: API abuse prevention (100 requests per 15 minutes)
- **Input Validation**: Comprehensive data sanitization
- **JWT Authentication**: Secure stateless authentication
- **Password Hashing**: bcryptjs for secure password storage
- **CORS Configuration**: Secure cross-origin policies

### 📦 **Development Tools**
- **ESLint**: Code linting and style enforcement
- **PostCSS**: CSS processing and optimization
- **Autoprefixer**: CSS vendor prefixing for cross-browser compatibility
- **Vite Dev Server**: Fast hot module replacement during development
- **npm**: Package management and script running

## 🚀 Quick Start

### Prerequisites
- **Node.js** 20.x or higher
- **npm** 10.x or higher (comes with Node.js)
- **MongoDB** (local installation or MongoDB Atlas account)
- **OpenRouter API Key** (get from [openrouter.ai](https://openrouter.ai))
- **Git** for cloning the repository

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mathmagic.git
   cd mathmagic
   ```

2. **Install all dependencies**
   ```bash
   npm run setup
   ```
   This command will install dependencies for root, backend, and frontend.

3. **Database Setup**
   - **Option A: MongoDB Atlas (Recommended)**
     - Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
     - Create a new cluster (free tier available)
     - Create database user with read/write permissions
     - Get connection string

   - **Option B: Local MongoDB**
     ```bash
     # Install MongoDB locally
     # Ubuntu/Debian:
     sudo apt-get install mongodb

     # macOS with Homebrew:
     brew install mongodb-community

     # Windows: Download from mongodb.com
     ```

4. **Environment Setup**
   ```bash
   cd backend
   cp .env.example .env
   ```

   Edit `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/mathmagic_dev
   # OR for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mathmagic_dev
   JWT_SECRET=your_super_secure_jwt_secret_here
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   FRONTEND_URL=http://localhost:5173
   ```

5. **Start Development Servers**
   ```bash
   # From project root
   npm run dev
   ```

   This starts both backend (port 5000) and frontend (port 5173) simultaneously.

6. **Open in Browser**
   ```
   http://localhost:5173
   ```

   **First Time Setup**: Create an account through the signup page to access the math solver.

## 📖 Usage Guide

### Getting Started

1. **Create Account**: Click "Sign Up" to create a new account with email and password
2. **Login**: Use your credentials to log into the application
3. **Access Solver**: Once authenticated, you can access the math solver

### Solving Math Problems

1. **Enter Your Question**: Type any math problem in the text area
2. **Submit**: Click "Solve Problem" or press Enter
3. **View Solution**: Expand steps to see detailed explanations with formulas
4. **View Graphs**: If applicable, graphs will appear automatically
5. **Clear**: Use "Clear All" to reset the interface

### Calculation History

- **View History**: All solved problems are automatically saved and displayed
- **Re-solve Problems**: Click on any previous question to solve it again
- **Organized Display**: Problems are numbered and timestamped
- **Persistent Storage**: History is saved to your account across sessions

### Example Problems
The app can solve problems across all mathematical branches:

**Algebra**: `Solve x² - 5x + 6 = 0` → `x = 2 or x = 3`

**Calculus**: `Find d/dx(3x³ - 2x² + 5x - 1)` → `9x² - 4x + 5`

**Geometry**: `Find area of circle with radius 5` → `Area = 25π`

**Trigonometry**: `Solve sin(x) = 0.5 for x ∈ [0, 2π]` → `x = π/6 or x = 5π/6`

### Graph Visualization
To see graphs, include keywords like:
- "graph", "plot", "draw", "show the curve"
- "points", "coordinates"

Example: `"Graph the function y = sin(x) from x = 0 to x = 2π"`

### Animated Interface Features

- **Floating Shapes**: Enjoy the animated geometric shapes in the background
- **Glowing Effects**: Mathematical symbols with smooth animations
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Dark Theme**: Eye-friendly interface with glassmorphism effects

## 🔒 Security

### Authentication & Authorization
- **JWT Authentication**: Secure token-based authentication with expiration
- **Password Hashing**: bcryptjs with salt rounds for secure password storage
- **Protected Routes**: All math solving endpoints require authentication
- **Session Management**: Automatic logout and token refresh handling

### API Security
- **Rate Limiting**: 100 requests per 15 minutes per IP address
- **Helmet.js**: Security headers including XSS protection, CSRF prevention
- **CORS Configuration**: Restricted cross-origin resource sharing
- **Input Validation**: Comprehensive sanitization and validation
- **Error Handling**: Secure error responses without sensitive data leakage

### Data Protection
- **Server-side API Keys**: OpenRouter keys stored securely on backend only
- **Environment Variables**: Sensitive configuration never exposed to frontend
- **MongoDB Security**: Authentication required, connection encryption
- **No Plain Text Storage**: All sensitive data properly encrypted/hashed

### Security Best Practices
- **HTTPS Only**: All production deployments use SSL/TLS encryption
- **Regular Updates**: Dependencies kept up-to-date with security patches
- **Audit Logging**: User actions and API usage tracked
- **Secure Headers**: Comprehensive security headers configuration

### Reporting Security Issues
If you discover a security vulnerability, please email security@mathmagic.com instead of creating a public issue.

See [SECURITY.md](SECURITY.md) for detailed security information and best practices.

## 🏗️ Project Structure

## 🏗️ Project Structure

```
mathmagic/
├── backend/                          # Express.js API server
│   ├── config/
│   │   └── aiProviders.js           # AI provider configurations
│   ├── models/
│   │   ├── User.js                  # User data model (MongoDB)
│   │   └── Calculation.js           # Calculation history model
│   ├── routes/
│   │   ├── auth.js                  # Authentication endpoints
│   │   └── solve.js                 # Math solving endpoint
│   ├── services/
│   │   └── aiService.js             # AI integration logic
│   ├── server.js                    # Main server file
│   ├── package.json
│   └── .env                         # Environment variables
├── frontend/                         # React application
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx        # User login component
│   │   │   │   └── Signup.jsx       # User registration component
│   │   │   ├── ConfirmationModal.jsx # Confirmation dialogs
│   │   │   ├── GraphVisualizer.jsx  # Chart component
│   │   │   ├── MathSolver.jsx       # Main solver component
│   │   │   └── StepAccordion.jsx    # Step display component
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx      # Authentication context
│   │   ├── App.jsx                  # Main app component
│   │   ├── App.css                  # Component styles
│   │   ├── index.css                # Global styles with animations
│   │   └── main.jsx                 # React entry point
│   ├── eslint.config.js             # ESLint configuration
│   ├── package.json
│   ├── postcss.config.js            # PostCSS configuration
│   ├── tailwind.config.js           # Tailwind CSS configuration
│   └── vite.config.js               # Vite configuration
├── package.json                     # Root package.json with scripts
└── README.md                        # This file
```

## 🔧 Configuration

### AI Provider Setup
Currently configured for **OpenRouter** with these models:
- `nvidia/nemotron-nano-9b-v2:free` (default)
- Access to 100+ models via OpenRouter

### Environment Variables
```env
# Backend Configuration
PORT=5000
OPENROUTER_API_KEY=your_api_key
NODE_ENV=development

# Optional: Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

## 📊 API Documentation

### Authentication Endpoints

#### User Registration
**Endpoint**: `POST /api/auth/signup`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "email": "user@example.com"
  }
}
```

#### User Login
**Endpoint**: `POST /api/auth/login`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com"
  }
}
```

### Math Solving Endpoint

#### Solve Math Problem
**Endpoint**: `POST /api/solve`

**Headers**:
```
Authorization: Bearer jwt_token_here
```

**Request Body**:
```json
{
  "question": "Solve x² - 4 = 0",
  "provider": "openrouter",
  "modelName": "nvidia/nemotron-nano-9b-v2:free"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "topic": "Algebra",
    "finalAnswer": "x = 2 or x = -2",
    "steps": [
      {
        "title": "Step 1: Understanding the equation",
        "explanation": "This is a quadratic equation in the form ax² + bx + c = 0",
        "formula": "ax² + bx + c = 0",
        "calculation": "1x² + 0x - 4 = 0"
      }
    ],
    "graphData": null
  }
}
```

### Rate Limiting
- **100 requests per 15 minutes** per IP address
- Applied to all API endpoints
- Returns `429 Too Many Requests` when exceeded

## 🧪 Testing

### Automated Testing
```bash
npm run test
```
Tests backend connectivity on `http://localhost:5000/health`

### Manual Testing Checklist

#### Authentication Testing
1. **User Registration**:
   - Test signup with valid email/password
   - Test validation errors (weak password, invalid email)
   - Verify duplicate email prevention

2. **User Login**:
   - Test login with correct credentials
   - Test login with incorrect credentials
   - Test JWT token generation and validation

3. **Protected Routes**:
   - Verify math solver requires authentication
   - Test token expiration handling
   - Test logout functionality

#### Math Solver Testing
1. **Basic Functionality**:
   - Test various math problems (algebra, calculus, geometry)
   - Verify step-by-step solutions
   - Test graph generation when requested

2. **Calculation History**:
   - Verify problems are saved after solving
   - Test history display and formatting
   - Test re-solving previous problems

3. **UI/UX Testing**:
   - Test responsive design on different screen sizes
   - Verify animated background elements
   - Test dark theme and glassmorphism effects
   - Test loading states and error handling

#### API Testing
1. **Rate Limiting**:
   - Test 100+ requests within 15 minutes
   - Verify 429 status code response

2. **Security Headers**:
   - Check Helmet.js security headers
   - Verify CORS configuration
   - Test input validation and sanitization

### Performance Testing
- Test concurrent user sessions
- Verify MongoDB connection pooling
- Check memory usage during heavy load
- Test API response times

## 🚀 Deployment

> 📖 **Detailed Deployment Guide**: See [DEPLOYMENT.md](DEPLOYMENT.md) for comprehensive step-by-step instructions

This application is designed to be deployed with the frontend on Vercel and the backend on Render.

### Frontend Deployment (Vercel)

1. **Connect Repository**:
   - Go to [Vercel](https://vercel.com) and sign in
   - Click "New Project" and import your GitHub repository
   - Configure the project:
     - **Framework Preset**: Vite
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`

2. **Environment Variables**:
   - Add `VITE_BACKEND_URL` with your Render backend URL (e.g., `https://your-backend.onrender.com`)

3. **Deploy**:
   - Vercel will automatically build and deploy your frontend
   - Note the deployment URL for CORS configuration

### Backend Deployment (Render)

1. **Connect Repository**:
   - Go to [Render](https://render.com) and sign in
   - Click "New +" and select "Web Service"
   - Connect your GitHub repository
   - Configure the service:
     - **Runtime**: Node
     - **Build Command**: (leave empty or `npm install`)
     - **Start Command**: `npm start`
     - **Root Directory**: `backend`

2. **Environment Variables**:
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (or any available port)
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random string
   - `AI_PROVIDER`: `openrouter`
   - `API_KEY`: Your OpenRouter API key
   - `MODEL_NAME`: `nvidia/nemotron-nano-9b-v2:free` (or your preferred model)
   - `FRONTEND_URL`: Your Vercel frontend URL (e.g., `https://your-app.vercel.app`)

3. **Database Setup**:
   - Use MongoDB Atlas for production database
   - Create a cluster and get the connection string
   - Add your Render service IP to MongoDB Atlas whitelist (or use 0.0.0.0/0 for testing)

4. **Deploy**:
   - Render will build and deploy your backend
   - Note the service URL for frontend configuration

### Environment Configuration

#### Backend (.env)
```env
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-vercel-app.vercel.app
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mathmagic_prod
JWT_SECRET=your_super_secure_jwt_secret_here
AI_PROVIDER=openrouter
API_KEY=your_openrouter_api_key
MODEL_NAME=nvidia/nemotron-nano-9b-v2:free
```

#### Frontend (.env)
```env
VITE_BACKEND_URL=https://your-render-backend.onrender.com
```

### Deployment Checklist

- [ ] MongoDB Atlas database created and connection string obtained
- [ ] OpenRouter API key obtained
- [ ] JWT secret generated (use a strong random string)
- [ ] Frontend deployed on Vercel
- [ ] Backend deployed on Render
- [ ] Environment variables configured in both services
- [ ] CORS origin updated in backend with Vercel URL
- [ ] Frontend VITE_BACKEND_URL updated with Render URL
- [ ] Test authentication and math solving functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow ESLint configuration
- Write clear commit messages
- Test thoroughly before submitting
- Update documentation for new features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenRouter** for providing access to advanced AI models
- **React & Vite** communities for excellent development tools
- **Tailwind CSS** for the beautiful utility-first styling framework
- **MongoDB** for reliable NoSQL database solutions
- **JWT.io** for secure token-based authentication
- **Lucide React** for consistent and beautiful icons
- **Recharts** for powerful data visualization components
- **Express.js** for robust backend framework
- **Mongoose** for elegant MongoDB object modeling

## 📞 Support

For questions, issues, or contributions:
- 📧 **Email**: akshay@example.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/mathmagic/issues)
- 📖 **Documentation**: Check this README and inline code comments
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yourusername/mathmagic/discussions)

## 🔍 Troubleshooting

### Common Issues

**Application won't start**
```bash
# Clear all caches and reinstall
npm run clean && npm run setup

# Check MongoDB connection
cd backend && node -e "require('mongoose').connect(process.env.MONGODB_URI).then(() => console.log('MongoDB connected')).catch(console.error)"
```

**Authentication problems**
- Verify JWT_SECRET is set in `.env`
- Check MongoDB connection for user storage
- Clear browser localStorage and try again

**API Key Issues**
- Verify your OpenRouter API key is valid
- Check `.env` file configuration
- Ensure key has sufficient credits/quota

**Graph not displaying**
- Include graphing keywords: "graph", "plot", "draw", "show"
- Check browser console for JavaScript errors
- Verify Recharts library is loading properly

**Slow responses or rate limiting**
- Free models have rate limits (100 requests/15min)
- Consider upgrading to paid OpenRouter models
- Check network connectivity

**Database connection errors**
- Verify MONGODB_URI format
- For MongoDB Atlas: whitelist your IP
- For local MongoDB: ensure service is running

---

<div align="center">

**Made with ❤️ by [Akshay Mishra](https://github.com/yourusername)**

*Empowering students and educators worldwide with AI-powered mathematics*

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=flat&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.7.0-47A248?style=flat&logo=mongodb)](https://mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.14-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

</div>