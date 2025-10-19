import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import MathSolver from './components/MathSolver';
import { Calculator, Github, Sparkles, ArrowRight, BookOpen, Zap, Users, ArrowLeft } from 'lucide-react';

function App() {
  const location = useLocation();
  const isHomepage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-accent-purple/10 to-transparent rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-accent-blue/10 to-transparent rounded-full blur-3xl animate-pulse-slow" />

        {/* Animated Geometrical Shapes and Math Icons */}
        {/* Triangle */}
        <div className="hidden md:block absolute top-32 left-12 w-16 h-16 bg-gradient-to-br from-red-400/30 to-pink-400/20 animate-float1"
             style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}} />

        {/* Circle */}
        <div className="hidden md:block absolute top-32 right-16 w-16 h-16 bg-gradient-to-br from-blue-400/25 to-cyan-400/15 rounded-full animate-float2" />

        {/* Square */}
        <div className="hidden md:block absolute bottom-40 left-16 w-14 h-14 bg-gradient-to-br from-green-400/20 to-emerald-400/10 animate-float3" />

        {/* Rectangle */}
        <div className="hidden md:block absolute top-1/2 right-12 w-20 h-10 bg-gradient-to-br from-purple-400/25 to-indigo-400/15 animate-float4" />

        {/* Trapezium */}
        <div className="hidden md:block absolute bottom-20 right-32 w-18 h-12 bg-gradient-to-br from-orange-400/20 to-yellow-400/10 animate-float5"
             style={{clipPath: 'polygon(25% 0%, 75% 0%, 100% 100%, 0% 100%)'}} />

        {/* Pentagon */}
        <div className="hidden md:block absolute top-36 right-1/3 w-14 h-14 bg-gradient-to-br from-pink-400/25 to-rose-400/15 animate-float7"
             style={{clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)'}} />

        {/* Math Icons */}
        {/* Plus */}
        <div className="hidden md:flex md:items-center md:justify-center absolute bottom-32 right-16 w-16 h-8 text-2xl font-bold text-yellow-400/60 animate-pulse-slow">+</div>

        {/* Division */}
        <div className="hidden md:flex md:items-center md:justify-center absolute bottom-32 right-80 w-16 h-16 text-4xl font-bold text-teal-400/70 animate-pulse-slow">÷</div>

        {/* Pi */}
        <div className="hidden md:flex md:items-center md:justify-center absolute top-40 left-1/3 w-10 h-10 text-3xl font-bold text-blue-400/50 animate-bounce-slow">π</div>

        {/* Sigma */}
        <div className="hidden md:flex md:items-center md:justify-center absolute bottom-16 left-1/2 w-12 h-12 text-4xl font-bold text-green-400/40 animate-pulse-slow">∑</div>

        {/* Integral */}
        <div className="hidden md:flex md:items-center md:justify-center absolute top-2/3 right-1/4 w-10 h-10 text-3xl font-bold text-purple-400/50 animate-bounce-slow">∫</div>

        {/* Square Root */}
        <div className="hidden md:flex md:items-center md:justify-center absolute top-1/3 right-2/3 w-12 h-12 text-3xl font-bold text-orange-400/45 animate-pulse-slow">√</div>

        {/* Multiplication */}
        <div className="hidden md:flex md:items-center md:justify-center absolute bottom-1/3 left-20 w-8 h-8 text-2xl font-bold text-red-400/60 animate-bounce-slow">×</div>

        {/* Advanced Math Equations - Only show on homepage */}
        {isHomepage && (
          <>
            {/* Quadratic Equation */}
            <div className="hidden md:flex md:items-center md:justify-center absolute top-52 left-48 w-auto h-8 text-xl font-mono text-cyan-400/70 animate-up-down whitespace-nowrap">
              x² + 2x + 1 = 0
            </div>

            {/* Integral */}
            <div className="hidden md:flex md:items-center md:justify-center absolute top-1/3 right-72 w-auto h-8 text-xl font-mono text-green-400/70 animate-up-down whitespace-nowrap">
              ∫ sin(x) dx = -cos(x) + C
            </div>

            {/* Limit */}
            <div className="hidden md:flex md:items-center md:justify-center absolute bottom-96 left-64 w-auto h-8 text-2xl font-mono text-yellow-400/70 animate-fade-in-out whitespace-nowrap">
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
              <div className="p-2 bg-gradient-to-br from-accent-purple to-accent-blue rounded-xl">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-accent-purple to-accent-blue bg-clip-text text-transparent">
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
                className="p-2 rounded-lg bg-dark-hover hover:bg-dark-border transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/solve" element={<Solver />} />
        </Routes>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-dark-border glass-effect">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Sparkles className="w-4 h-4 text-accent-purple" />
              <span>Made with ❤️ by Akshay Mishra for Students & Learners</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center py-16 md:py-24">
        <div className="inline-block p-4 bg-gradient-to-br from-accent-purple/20 to-accent-blue/20 rounded-full mb-8">
          <Calculator className="w-16 h-16 md:w-20 md:h-20 text-accent-purple" />
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
          onClick={() => navigate('/solve')}
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-accent-purple to-accent-blue text-white font-semibold rounded-xl hover:from-accent-purple/90 hover:to-accent-blue/90 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Get Started
          <ArrowRight className="ml-2 w-5 h-5" />
        </button>
      </div>

      {/* App Details Section */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-16 bg-gradient-to-r from-accent-purple via-accent-blue to-accent-purple bg-clip-text text-transparent drop-shadow-lg leading-[1.2] md:leading-[1.2] lg:leading-[1.1] pb-2">
            Why Choose MathMagic?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group text-center p-8 bg-gradient-to-br from-dark-card/50 to-dark-card/30 backdrop-blur-sm rounded-2xl border border-dark-border/50 hover:border-accent-purple/50 hover:shadow-2xl hover:shadow-accent-purple/10 transition-all duration-500 hover:-translate-y-2">
              <div className="p-4 bg-accent-purple/10 rounded-full w-fit mx-auto mb-6 group-hover:bg-accent-purple/20 transition-colors duration-300">
                <BookOpen className="w-12 h-12 text-accent-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-accent-purple transition-colors duration-300">Comprehensive Coverage</h3>
              <p className="text-gray-400 leading-relaxed">Solve problems across all math branches - algebra, calculus, geometry, statistics, and more with detailed step-by-step explanations.</p>
            </div>
            <div className="group text-center p-8 bg-gradient-to-br from-dark-card/50 to-dark-card/30 backdrop-blur-sm rounded-2xl border border-dark-border/50 hover:border-accent-blue/50 hover:shadow-2xl hover:shadow-accent-blue/10 transition-all duration-500 hover:-translate-y-2">
              <div className="p-4 bg-accent-blue/10 rounded-full w-fit mx-auto mb-6 group-hover:bg-accent-blue/20 transition-colors duration-300">
                <Zap className="w-12 h-12 text-accent-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-accent-blue transition-colors duration-300">AI-Powered Solutions</h3>
              <p className="text-gray-400 leading-relaxed">Leveraging advanced AI models to provide accurate, instant solutions with interactive visualizations and graphs.</p>
            </div>
            <div className="group text-center p-8 bg-gradient-to-br from-dark-card/50 to-dark-card/30 backdrop-blur-sm rounded-2xl border border-dark-border/50 hover:border-accent-green/50 hover:shadow-2xl hover:shadow-accent-green/10 transition-all duration-500 hover:-translate-y-2">
              <div className="p-4 bg-accent-green/10 rounded-full w-fit mx-auto mb-6 group-hover:bg-accent-green/20 transition-colors duration-300">
                <Users className="w-12 h-12 text-accent-green" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-accent-green transition-colors duration-300">For Students & Learners</h3>
              <p className="text-gray-400 leading-relaxed">Designed specifically for students, educators, and anyone looking to master mathematics with an intuitive, modern interface.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Developer Quote */}
      <div className="py-16">
        <div className="max-w-2xl mx-auto text-center">
          <blockquote className="text-2xl md:text-3xl font-light italic text-gray-300 mb-6">
            "Mathematics is not about numbers, equations, computations, or algorithms: it is about understanding."
          </blockquote>
          <cite className="text-lg text-accent-purple font-semibold">- Akshay Mishra, Developer</cite>
        </div>
      </div>
    </main>
  );
};

const Solver = () => {
  const navigate = useNavigate();

  const apiConfig = {
    provider: 'openrouter',
    modelName: 'nvidia/nemotron-nano-9b-v2:free'
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