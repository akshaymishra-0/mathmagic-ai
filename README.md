# 🎓 AI-Powered Mathematics Solver

A modern, intelligent web application that provides comprehensive step-by-step solutions to mathematics problems across all branches, powered by advanced AI technology.

![Math Solver Demo](https://via.placeholder.com/800x400/1a1a24/646cff?text=AI+Math+Solver+Demo)

## ✨ Key Features

### 🧮 Comprehensive Math Coverage
- **Algebra**: Equations, inequalities, polynomials, matrices
- **Calculus**: Derivatives, integrals, limits, series
- **Geometry**: Shapes, areas, volumes, coordinate geometry
- **Trigonometry**: Identities, functions, triangles
- **Statistics & Probability**: Distributions, hypothesis testing
- **Arithmetic**: All basic operations and concepts

### 📚 Educational Excellence
- **Detailed Step-by-Step Solutions**: From basic concepts to final answers
- **Interactive Learning**: Collapsible steps for better understanding
- **Formula Explanations**: Every formula used is explained
- **Progressive Difficulty**: Builds understanding from fundamentals
- **Student-Friendly**: Assumes 10-year-old level knowledge

### 🎨 Modern User Experience
- **Dark Theme**: Beautiful, eye-friendly interface
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Feedback**: Loading states and success notifications
- **Interactive Elements**: Hover effects and smooth animations
- **Accessibility**: Proper contrast and keyboard navigation

### 📊 Smart Graph Visualization
- **Conditional Display**: Graphs only when explicitly requested
- **Multiple Chart Types**: Line graphs, parabolas, circles, scatter plots
- **High Precision**: 20-50 data points for accuracy
- **Interactive Controls**: Zoom, pan, and detailed coordinates

### 🔧 Advanced Features
- **Clear All Function**: Reset interface with one click
- **Example Library**: Pre-built math problems for testing
- **Error Handling**: Comprehensive error messages and recovery
- **Rate Limiting**: Built-in protection against abuse
- **Security**: Helmet.js integration and input validation

## 🛠️ Technology Stack

### Frontend Architecture
- **React 18**: Modern component-based UI framework
- **Vite**: Lightning-fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: Declarative charting library for graphs
- **Lucide React**: Beautiful, consistent icon system
- **Axios**: HTTP client for API communication
- **React Hot Toast**: Elegant notification system

### Backend Infrastructure
- **Node.js**: Runtime environment
- **Express.js**: Web application framework
- **OpenRouter AI**: Primary AI provider integration
- **CORS**: Cross-origin resource sharing
- **Helmet.js**: Security middleware
- **Express Rate Limit**: API rate limiting
- **Environment Configuration**: Secure credential management

### Development Tools
- **ESLint**: Code linting and quality
- **Nodemon**: Auto-restart for development
- **Concurrently**: Run multiple processes
- **Cross-env**: Cross-platform environment variables

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher (comes with Node.js)
- **OpenRouter API Key** (get from [openrouter.ai](https://openrouter.ai))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/math-solver-ai.git
   cd math-solver-ai
   ```

2. **Install all dependencies**
   ```bash
   npm run setup
   ```
   This command will install dependencies for root, backend, and frontend.

3. **Environment Setup**
   ```bash
   cd backend
   cp .env.example .env
   ```

   Edit `.env` file:
   ```env
   PORT=5000
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   NODE_ENV=development
   ```

4. **Start Development Servers**
   ```bash
   # From project root
   npm run dev
   ```

   This starts both backend (port 5000) and frontend (port 5173) simultaneously.

5. **Open in Browser**
   ```
   http://localhost:5173
   ```

## 📖 Usage Guide

### Solving Math Problems

1. **Enter Your Question**: Type any math problem in the text area
2. **Submit**: Click "Solve Problem" or press Enter
3. **View Solution**: Expand steps to see detailed explanations
4. **Clear**: Use "Clear All" to reset the interface

### Example Problems
The app includes pre-built examples:
- Quadratic equations: `x² - 5x + 6 = 0`
- Derivatives: `d/dx(3x³ - 2x² + 5x - 1)`
- Integrals: `∫(4x³ + 2x)dx`
- Graphing: `y = 2x + 3` (when requesting graphs)

### Graph Visualization
To see graphs, include keywords like:
- "graph", "plot", "draw", "show the curve"
- "points", "coordinates"

Example: `"Graph the function y = sin(x)"`

## 🔒 Security

See [SECURITY.md](SECURITY.md) for detailed security information, best practices, and reporting guidelines.

## 🏗️ Project Structure

```
math-solver-ai/
├── backend/                    # Express.js API server
│   ├── config/
│   │   └── aiProviders.js     # AI provider configurations
│   ├── routes/
│   │   └── solve.js          # Math solving endpoint
│   ├── services/
│   │   └── aiService.js      # AI integration logic
│   ├── server.js             # Main server file
│   ├── package.json
│   └── .env                  # Environment variables
├── frontend/                  # React application
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── MathSolver.jsx    # Main solver component
│   │   │   ├── StepAccordion.jsx # Step display component
│   │   │   └── GraphVisualizer.jsx # Chart component
│   │   ├── App.jsx           # Main app component
│   │   ├── main.jsx          # React entry point
│   │   ├── index.css         # Global styles
│   │   └── App.css           # Component styles
│   ├── package.json
│   └── vite.config.js        # Vite configuration
├── package.json              # Root package.json
└── README.md                 # This file
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

### Solve Math Problem
**Endpoint**: `POST /api/solve`

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

## 🧪 Testing

### Health Check
```bash
npm run test
```
Tests backend connectivity on `http://localhost:5000/health`

### Manual Testing
1. Start the application: `npm run dev`
2. Test various math problems
3. Verify graph generation with plotting requests
4. Test clear functionality

## 🚀 Deployment

### Production Build
```bash
# Build frontend
npm run build

# Start production servers
npm run start
```

### Environment Setup for Production
- Set `NODE_ENV=production`
- Configure production API keys
- Set up reverse proxy (nginx recommended)
- Enable HTTPS

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

- **OpenRouter** for AI model access
- **React & Vite** communities
- **Tailwind CSS** for styling
- **Lucide** for icons
- **Recharts** for visualization

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Check the troubleshooting section below

## � Security

### Environment Variables
- **Never commit** `.env` files to version control
- Use `.env.example` as a template for required variables
- API keys are stored server-side only

### Security Features
- **Helmet.js**: Security headers and XSS protection
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configured for allowed origins only
- **Input Validation**: Request size limits (10MB)
- **No API Keys in Frontend**: All sensitive data handled server-side

### Best Practices
- Keep dependencies updated
- Use HTTPS in production
- Monitor rate limits and error logs
- Regular security audits recommended

## �🔍 Troubleshooting

### Common Issues

**Frontend won't start**
```bash
# Clear node_modules and reinstall
npm run clean && npm run setup
```

**API Key Issues**
- Verify your OpenRouter API key
- Check `.env` file configuration
- Ensure key has sufficient credits

**Graph not displaying**
- Include graphing keywords in your question
- Check browser console for errors

**Slow responses**
- Free models have rate limits
- Consider upgrading to paid models

---

**Made with ❤️ by Akshay Mishra for students and educators worldwide**