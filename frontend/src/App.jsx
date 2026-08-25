import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import MathSolver from "./components/MathSolver";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Profile from "./components/Profile";
import ConfirmationModal from "./components/ConfirmationModal";
import axios from "axios";
import { ArrowRight, ArrowLeft, LogOut, User, RotateCcw } from "lucide-react";

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
  };

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col">
      {/* Header */}
      <header className="border-b border-dark-border bg-dark-card/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div
              className="cursor-pointer"
              onClick={() => navigate("/")}
            >
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-accent-purple to-accent-blue bg-clip-text text-transparent">
                MathMagic
              </h1>
              <p className="text-xs text-gray-400">AI-powered math solver</p>
            </div>

            <div className="flex items-center space-x-3">
              <a
                href="https://github.com/akshaymishra-0"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline text-sm text-gray-400 hover:text-white transition-colors"
              >
                GitHub
              </a>
              {user ? (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigate("/profile")}
                    className="px-3 py-1.5 text-sm rounded-lg bg-dark-hover hover:bg-dark-border transition-colors"
                    title="Profile"
                  >
                    <User className="w-4 h-4 inline mr-1" />
                    Profile
                  </button>
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="px-3 py-1.5 text-sm rounded-lg bg-dark-hover hover:bg-red-600/20 hover:text-red-400 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4 inline" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <a
                    href="/login"
                    className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                  >
                    Sign In
                  </a>
                  <a
                    href="/signup"
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-accent-purple to-accent-blue rounded-lg hover:opacity-90 transition-all"
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
          <Route path="/profile" element={<Profile />} />
          <Route path="/solve" element={<ProtectedSolver />} />
        </Routes>
      </div>

      {/* Footer */}
      <footer className="border-t border-dark-border bg-dark-card/50">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-sm text-gray-400">
          Made with ❤️ by Akshay Mishra
        </div>
      </footer>

      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Sign Out"
        message="Are you sure you want to sign out?"
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
      const response = await axios.get("/api/auth/history");
      setHistory(response.data.data.calculations || []);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleGetStarted = () => {
    if (user) {
      navigate("/solve");
    } else {
      navigate("/login");
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="text-center py-16 md:py-24">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          <span className="bg-gradient-to-r from-accent-purple to-accent-blue bg-clip-text text-transparent">
            MathMagic
          </span>
        </h1>
        <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
          Solve any math problem step-by-step with AI. Supports algebra,
          calculus, geometry, and more — with graphs.
        </p>
        <button
          onClick={handleGetStarted}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-accent-purple to-accent-blue text-white font-semibold rounded-xl hover:opacity-90 transition-all"
        >
          {user ? "Continue Solving" : "Get Started"}
          <ArrowRight className="ml-2 w-5 h-5" />
        </button>
      </div>

      {/* Recent Calculations — only for logged-in users */}
      {user && (
        <div className="pb-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-white">
            Recent Calculations
          </h2>
          <div className="bg-dark-card border border-dark-border rounded-xl p-6">
            {historyLoading ? (
              <p className="text-gray-400 text-center py-6">Loading...</p>
            ) : history.length > 0 ? (
              <div className="space-y-3">
                {history.map((calc, index) => (
                  <div
                    key={calc.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-dark-hover rounded-lg border border-dark-border gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium break-words">
                        {calc.question}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(calc.createdAt).toLocaleDateString()} at{" "}
                        {new Date(calc.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        navigate("/solve", {
                          state: { question: calc.question },
                        })
                      }
                      className="w-fit self-start sm:self-auto flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-sm font-medium rounded-lg bg-accent-purple/20 text-accent-purple border border-accent-purple/30 hover:bg-accent-purple/30 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Recalculate
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-400 mb-4">No calculations yet.</p>
                <button
                  onClick={() => navigate("/solve")}
                  className="inline-flex items-center px-5 py-2 bg-gradient-to-r from-accent-purple to-accent-blue text-white font-semibold rounded-xl hover:opacity-90 transition-all"
                >
                  Solve Your First Problem
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Features */}
      <div className="pb-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-white text-center">
          What MathMagic Can Do
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-accent-purple/40 transition-colors">
            <h3 className="font-semibold text-white mb-2">Step-by-Step Solutions</h3>
            <p className="text-gray-400 text-sm">
              Every problem is broken down into detailed steps so you actually understand the solution.
            </p>
          </div>
          <div className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-accent-blue/40 transition-colors">
            <h3 className="font-semibold text-white mb-2">Interactive Graphs</h3>
            <p className="text-gray-400 text-sm">
              Problems involving functions or equations get visualized as interactive charts.
            </p>
          </div>
          <div className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-accent-green/40 transition-colors">
            <h3 className="font-semibold text-white mb-2">Image Upload</h3>
            <p className="text-gray-400 text-sm">
              Take a photo of a handwritten problem and upload it directly — no typing needed.
            </p>
          </div>
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
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-4">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="mr-1.5 w-4 h-4" />
          Back to Home
        </button>
      </div>
      <MathSolver />
    </main>
  );
};

export default App;
