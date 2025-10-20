import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import MathSolver from './components/MathSolver';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import ConfirmationModal from './components/ConfirmationModal';
import axios from 'axios';
import { Calculator, Github, Sparkles, ArrowRight, BookOpen, Zap, Users, ArrowLeft, LogOut, User, RotateCcw } from 'lucide-react';

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const location = useLocation();
  const isHomepage = location.pathname === '/';
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
  };

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-accent-purple/10 to-transparent rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-accent-blue/10 to-transparent rounded-full blur-3xl animate-pulse-slow" />

        {/* Animated Geometrical Shapes and Math Icons */}
        {/* Circle */}
        <div className="hidden md:block absolute top-40 left-24 w-24 h-24 bg-gradient-to-br from-blue-400/25 to-cyan-400/15 rounded-full animate-float2 shape-glow-blue" />

        {/* Square */}
        <div className="hidden md:block absolute bottom-24 left-48 w-20 h-20 bg-gradient-to-br from-green-400/20 to-emerald-500/10 animate-float3 shape-glow-green" />

        {/* Rectangle */}
        <div className="hidden md:block absolute top-1/2 right-32 w-32 h-16 bg-gradient-to-br from-purple-400/25 to-indigo-400/15 animate-float4 shape-glow-purple" />

        {/* Math Icons */}
        {/* Plus */}
        <div className="flex items-center justify-center absolute bottom-32 right-16 w-16 h-8 text-2xl font-bold text-yellow-400/60 animate-pulse-slow icon-glow-yellow">+</div>

        {/* Division */}
        <div className="flex items-center justify-center absolute bottom-32 right-80 w-16 h-16 text-4xl font-bold text-teal-400/70 animate-pulse-slow icon-glow-teal">÷</div>

        {/* Pi */}
        <div className="flex items-center justify-center absolute top-24 left-1/4 w-10 h-10 text-3xl font-bold text-blue-400/50 animate-bounce-slow icon-glow-blue">π</div>

        {/* Sigma */}
        <div className="flex items-center justify-center absolute bottom-16 left-1/2 w-12 h-12 text-4xl font-bold text-green-400/40 animate-pulse-slow icon-glow-green">∑</div>

        {/* Integral */}
        <div className="flex items-center justify-center absolute top-2/4 right-1/4 w-10 h-10 text-3xl font-bold text-purple-400/50 animate-bounce-slow icon-glow-purple">∫</div>

        {/* Square Root */}
        <div className="flex items-center justify-center absolute top-1/3 right-2/3 w-12 h-12 text-3xl font-bold text-orange-400/45 animate-pulse-slow icon-glow-orange">√</div>

        {/* Multiplication */}
        <div className="flex items-center justify-center absolute bottom-1/3 left-20 w-8 h-8 text-2xl font-bold text-red-400/60 animate-bounce-slow icon-glow-red">×</div>

        {/* Advanced Math Equations - Only show on homepage */}
        {isHomepage && (
          <>
            {/* Quadratic Equation */}
            <div className="hidden md:flex md:items-center md:justify-center absolute top-40 right-32 w-auto h-8 text-xl font-mono text-cyan-400/70 animate-up-down whitespace-nowrap equation-glow-cyan">
              x² + 2x + 1 = 0
            </div>

            {/* Integral */}
            <div className="hidden md:flex md:items-center md:justify-center absolute top-1/3 right-72 w-auto h-8 text-xl font-mono text-green-400/70 animate-up-down whitespace-nowrap equation-glow-green">
              ∫ sin(x) dx = -cos(x) + C
            </div>

            {/* Limit */}
            <div className="hidden md:flex md:items-center md:justify-center absolute bottom-96 left-64 w-auto h-8 text-2xl font-mono text-yellow-400/70 animate-fade-in-out whitespace-nowrap equation-glow-yellow">
              lim(x→0) sin(x)/x = 1
            </div>
          </>
        )}
      </div>

      {/* Header */}
      <header className="relative border-b border-dark-border glass-effect">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-1 md:p-2 bg-gradient-to-br from-accent-purple to-accent-blue rounded-xl">
                <Calculator className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-accent-purple to-accent-blue bg-clip-text text-transparent">
                  MathMagic
                </h1>
                <p className="text-xs text-gray-400">Powered by AI</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <p className="hidden md:inline text-sm font-medium text-gray-400">Visit Me on GitHub</p>
              <a
                href="https://github.com/akshaymishra-0"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline p-2 rounded-lg bg-dark-hover hover:bg-dark-border transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-300">
                    <User className="w-4 h-4" />
                    <span>{user.name}</span>
                  </div>
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="p-2 rounded-lg bg-dark-hover hover:bg-red-600/20 hover:text-red-400 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4 md:space-x-6">
                  <a
                    href="/login"
                    className="px-1 py-1 text-sm font-medium text-accent-purple hover:text-accent-purple transition-colors"
                  >
                    Sign In
                  </a>
                  <a
                    href="/signup"
                    className="px-2 md:px-4 py-2 text-sm font-medium text-white hover:text-white bg-gradient-to-r from-accent-purple to-accent-blue rounded-lg hover:from-accent-purple/90 hover:to-accent-blue/90 transition-all shadow-lg hover:shadow-xl"
                  >
                    Sign Up
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/solve" element={<ProtectedSolver />} />
        </Routes>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-dark-border glass-effect">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Sparkles className="w-4 h-4 text-accent-purple" />
              <span>Made with ❤️ by Akshay Mishra</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Sign Out"
        message="Are you sure you want to sign out of your MathMagic account?"
        confirmText="Sign Out"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}

const Homepage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      setHistoryLoading(true);
      const response = await axios.get('/api/auth/history');
      setHistory(response.data.data.calculations || []);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleGetStarted = () => {
    if (user) {
      navigate('/solve');
    } else {
      navigate('/login');
    }
  };

  return (
    <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center py-16 md:py-24">
        <div className="inline-block p-3 md:p-4 bg-gradient-to-br from-accent-purple/20 to-accent-blue/20 rounded-full mb-6 md:mb-8">
          <Calculator className="w-10 h-10 md:w-16 md:h-16 text-accent-purple" />
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
          <span className="bg-gradient-to-r from-accent-purple via-accent-blue to-accent-purple bg-clip-text text-transparent">
            MathMagic
          </span>
        </h1>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400 mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-accent-green rounded-full"></div>
            <span>Step-by-Step Solutions</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-accent-blue rounded-full"></div>
            <span>Interactive Graphs</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-accent-purple rounded-full"></div>
            <span>All Math Branches</span>
          </div>
        </div>
        <button
          onClick={handleGetStarted}
          className="inline-flex items-center px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-accent-purple to-accent-blue text-white font-semibold rounded-xl hover:from-accent-purple/90 hover:to-accent-blue/90 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          {user ? 'Continue Solving' : 'Get Started'}
          <ArrowRight className="ml-2 w-5 h-5" />
        </button>
      </div>

      {/* History Section - Only for logged-in users */}
      {user && (
        <div className="py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-accent-purple to-accent-blue bg-clip-text text-transparent">
              Your Recent Calculations
            </h2>
            <div className="bg-gradient-to-br from-dark-card/50 to-dark-card/30 backdrop-blur-sm rounded-2xl border border-dark-border/50 p-6">
              {historyLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-purple mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading your history...</p>
                </div>
              ) : history.length > 0 ? (
                <div className="space-y-4">
                  {history.map((calc, index) => (
                    <div
                      key={calc.id}
                      className="flex flex-col space-y-3 p-4 bg-dark-hover/50 rounded-xl border border-dark-border/30 hover:border-accent-purple/30 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex-1 min-w-0 mb-2 md:mb-0">
                          <p className="text-white font-medium break-words">
                            {calc.question}
                          </p>
                        </div>
                        <div className="text-sm text-gray-400 md:text-right">
                          {new Date(calc.createdAt).toLocaleDateString()} at {new Date(calc.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => navigate('/solve', { state: { question: calc.question } })}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-accent-purple/20 text-accent-purple border border-accent-purple/30 hover:bg-accent-purple/30 hover:border-accent-purple/50 transition-all duration-200"
                          title="Recalculate this problem"
                        >
                          <RotateCcw className="w-4 h-4 mr-1" /> Recalculate
                        </button>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent-purple/20 text-accent-purple border border-accent-purple/30">
                          #{history.length - index}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calculator className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-300 mb-2">No calculations yet</h3>
                  <p className="text-gray-400 mb-6">Start solving math problems to see your history here!</p>
                  <button
                    onClick={() => navigate('/solve')}
                    className="inline-flex items-center px-5 py-2 md:px-6 md:py-3 bg-gradient-to-r from-accent-purple to-accent-blue text-white font-semibold rounded-xl hover:from-accent-purple/90 hover:to-accent-blue/90 transition-all duration-300"
                  >
                    Solve Your First Problem
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* App Details Section */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-16 bg-gradient-to-r from-accent-purple via-accent-blue to-accent-purple bg-clip-text text-transparent drop-shadow-lg leading-[1.2] md:leading-[1.2] lg:leading-[1.1] pb-2">
            Why Choose MathMagic?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group text-center p-4 md:p-8 bg-gradient-to-br from-dark-card/50 to-dark-card/30 backdrop-blur-sm rounded-2xl border border-dark-border/50 hover:border-accent-purple/50 hover:shadow-2xl hover:shadow-accent-purple/10 transition-all duration-500 hover:-translate-y-2">
              <div className="p-3 md:p-4 bg-accent-purple/10 rounded-full w-fit mx-auto mb-4 md:mb-6 group-hover:bg-accent-purple/20 transition-colors duration-300">
                <BookOpen className="w-8 h-8 md:w-12 md:h-12 text-accent-purple" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-3 text-white group-hover:text-accent-purple transition-colors duration-300">Comprehensive Coverage</h3>
              <p className="text-gray-400 leading-relaxed">Solve problems across all math branches - algebra, calculus, geometry, statistics, and more with detailed step-by-step explanations.</p>
            </div>
            <div className="group text-center p-4 md:p-8 bg-gradient-to-br from-dark-card/50 to-dark-card/30 backdrop-blur-sm rounded-2xl border border-dark-border/50 hover:border-accent-blue/50 hover:shadow-2xl hover:shadow-accent-blue/10 transition-all duration-500 hover:-translate-y-2">
              <div className="p-3 md:p-4 bg-accent-blue/10 rounded-full w-fit mx-auto mb-4 md:mb-6 group-hover:bg-accent-blue/20 transition-colors duration-300">
                <Zap className="w-8 h-8 md:w-12 md:h-12 text-accent-blue" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-3 text-white group-hover:text-accent-blue transition-colors duration-300">AI-Powered Solutions</h3>
              <p className="text-gray-400 leading-relaxed">Leveraging advanced AI models to provide accurate, instant solutions with interactive visualizations and graphs.</p>
            </div>
            <div className="group text-center p-4 md:p-8 bg-gradient-to-br from-dark-card/50 to-dark-card/30 backdrop-blur-sm rounded-2xl border border-dark-border/50 hover:border-accent-green/50 hover:shadow-2xl hover:shadow-accent-green/10 transition-all duration-500 hover:-translate-y-2">
              <div className="p-3 md:p-4 bg-accent-green/10 rounded-full w-fit mx-auto mb-4 md:mb-6 group-hover:bg-accent-green/20 transition-colors duration-300">
                <Users className="w-8 h-8 md:w-12 md:h-12 text-accent-green" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-3 text-white group-hover:text-accent-green transition-colors duration-300">For Students & Learners</h3>
              <p className="text-gray-400 leading-relaxed">Designed specifically for students, educators, and anyone looking to master mathematics with an intuitive, modern interface.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Developer Quote */}
      <div className="py-16">
        <div className="max-w-2xl mx-auto text-center">
          <blockquote className="text-lg md:text-2xl lg:text-3xl font-light italic text-gray-300 mb-6">
            "Mathematics is not about numbers, equations, computations, or algorithms: it is about understanding."
          </blockquote>
          <cite className="text-lg text-accent-purple font-semibold">- Akshay Mishra, Developer</cite>
        </div>
      </div>
    </main>
  );
};

const ProtectedSolver = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-purple mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  const apiConfig = {
    provider: 'openrouter'
    // modelName will be determined by backend environment variable
  };

  return (
    <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-4">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center px-6 py-3 text-white font-semibold hover:text-accent-purple transition-colors duration-300"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Home
        </button>
      </div>
      <MathSolver apiConfig={apiConfig} />
    </main>
  );
};export default App;