# MathMagic — AI-Powered Math Problem Solver

A full-stack web application designed to help students and developers solve mathematical problems step-by-step with structured reasoning, interactive function graphing, and OCR-based image input.

Built with **React**, **Node.js/Express**, **MongoDB**, and powered by **OpenRouter API**.

---

## 🌟 Key Highlights & Features

- **Step-by-Step Educational Solutions**: Breaks down mathematical problems across Algebra, Calculus, Trigonometry, and Geometry into intuitive steps with formulas and calculations.
- **Accurate Mathematical Graphing**: Parses equations and evaluates coordinate points mathematically on the backend across four quadrants, rendered interactively using Recharts when requested.
- **Engaging Loading Screen**: Features rotating inspirational math quotes and trivia while problems are being solved.
- **Image Upload with Crop & OCR**: Allows users to take photos of handwritten or printed math problems, crop the equation area, and automatically extract text using OCR.
- **Secure JWT Authentication**: User registration and login with bcrypt password hashing and token-based session persistence.
- **Persistent User History**: Saves recent calculations to MongoDB with one-click recalculation.
- **Production-Ready Security**: Implements Express rate limiting, Helmet security headers, and CORS whitelisting.

---

## 🏗️ Architecture & Tech Stack

```
                                      ┌────────────────────────┐
                                      │   React + Vite Client  │
                                      │  (Tailwind, Recharts)  │
                                      └───────────┬────────────┘
                                                  │ HTTP / JSON
                                                  ▼
                                      ┌────────────────────────┐
                                      │   Node.js / Express    │
                                      │      REST Backend      │
                                      └─────┬────────────┬─────┘
                                            │            │
                      ┌─────────────────────┴──┐       ┌─┴────────────────────┐
                      ▼                        ▼       ▼                      ▼
               ┌──────────────┐      ┌────────────┐ ┌─────────────┐     ┌───────────────┐
               │ MongoDB Atlas│      │ OpenRouter │ │  OCR.space  │     │ Math Evaluator│
               │  (Mongoose)  │      │   AI API   │ │  (Image OCR)│     │ (Graph Gen)   │
               └──────────────┘      └────────────┘ └─────────────┘     └───────────────┘
```

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS (Dark theme with clean glassmorphism accents)
- **Data Visualization**: Recharts (Dynamic line and scatter charts)
- **State & Routing**: React Router v6, React Context API
- **Utilities**: Axios, Lucide React, React Image Crop, React Hot Toast

### Backend
- **Runtime**: Node.js with Express (ES Modules)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (`jsonwebtoken`) & `bcryptjs`
- **AI Integration**: OpenRouter API (`meta-llama/llama-3.3-70b-instruct:free`, `deepseek/deepseek-r1:free`, etc.)
- **Image Handling**: Multer (In-memory buffer) + OCR.space API
- **Security**: `helmet`, `express-rate-limit`, `cors`, `dotenv`

---

## 📐 Engineering Highlights

1. **Deterministic Graph Point Computation**: Rather than relying on LLM hallucinated coordinates, the backend prompts the AI for the raw mathematical equation, cleans and compiles it into a safe JavaScript function (`toJSExpression`), and evaluates 100 evenly-spaced points across the domain.
2. **On-Demand Graph Triggering**: Graph data is only evaluated and generated when the user's prompt explicitly requests visualization (e.g. `plot`, `draw graph`), reducing unnecessary computations.
3. **Robust Response Sanitization**: A custom `cleanText()` pipeline strips unwanted markdown wrappers, embedded JSON fragments, and escape artifacts so the client always receives pristine, readable text.
4. **In-Memory Image Pipeline**: Uploaded math images are processed in-memory using Multer buffers and forwarded directly to OCR, preventing unneeded disk I/O and temporary file buildup.

---

## 📁 Project Structure

```text
MATHMAGIC/
├── backend/
│   ├── config/             # AI provider configuration (OpenRouter)
│   ├── models/             # Mongoose schemas (User, Calculation)
│   ├── routes/             # Express route controllers (auth, solve)
│   ├── services/           # AI service & OCR handling
│   ├── .env.example        # Backend environment template
│   ├── package.json
│   └── server.js           # Server entry point & middleware setup
├── frontend/
│   ├── public/
│   │   └── favicon.svg     # Application logo & favicon
│   ├── src/
│   │   ├── components/     # MathSolver, GraphVisualizer, StepAccordion, etc.
│   │   ├── contexts/       # AuthContext for global session state
│   │   ├── App.jsx         # Routing & primary layout
│   │   ├── index.css       # Core design system & utilities
│   │   └── main.jsx        # React root entry
│   ├── .env.example        # Frontend environment template
│   ├── package.json
│   └── vite.config.js      # Vite build configuration & proxy
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started Locally

### Prerequisites
- **Node.js** (v18 or higher)
- **npm**
- **MongoDB Atlas** account (free cluster)
- **OpenRouter API Key** ([OpenRouter Keys](https://openrouter.ai/keys) — free models available)

---

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/mathmagic?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here

AI_PROVIDER=openrouter
API_KEY=your_openrouter_api_key_here
MODEL_NAME=your_openrouter_model_name
# Optional: For image upload OCR (get from https://ocr.space/ocrapi)
OCR_SPACE_API_KEY=your_ocr_key
```

Start the backend development server:
```bash
npm run dev
```
> Server runs on `http://localhost:5000`

---

### 2. Frontend Setup

In a new terminal window:

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory (optional for local dev):

```env
VITE_BACKEND_URL=http://localhost:5000
```

Start the Vite development server:
```bash
npm run dev
```
> Application will be live at `http://localhost:5173`

---

## 🔌 API Reference

### System Endpoints
- `GET /health` — Check server status, active AI provider, and model

### Auth Endpoints (`/api/auth`)
- `POST /api/auth/signup` — Create user account & receive JWT token
- `POST /api/auth/signin` — Authenticate user & receive JWT token
- `GET /api/auth/profile` — Fetch current user profile (Protected)
- `PUT /api/auth/profile` — Update name or email (Protected)
- `PUT /api/auth/change-password` — Update user password (Protected)
- `GET /api/auth/history` — Fetch recent calculations (Protected)

### Solve Endpoints (`/api/solve`)
- `POST /api/solve` — Submit math problem via text or image (multipart/form-data) (Protected)

---

## 👤 Author

**Akshay Mishra**
- GitHub: [@akshaymishra-0](https://github.com/akshaymishra-0)

---

## 📄 License

This project is licensed under the MIT License.