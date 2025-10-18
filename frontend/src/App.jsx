import React from 'react';
import MathSolver from './components/MathSolver';
import { Calculator, Github, Sparkles } from 'lucide-react';

function App() {
  const apiConfig = {
    provider: 'openrouter',
    modelName: 'nvidia/nemotron-nano-9b-v2:free'
  };

  return (
    <div className="min-h-screen bg-dark-bg">
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

        {/* Hexagon */}
        <div className="hidden md:block absolute top-3/4 left-1/4 w-16 h-16 bg-gradient-to-br from-teal-400/20 to-cyan-400/10 animate-float6"
             style={{clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'}} />

        {/* Pentagon */}
        <div className="hidden md:block absolute top-36 right-1/3 w-14 h-14 bg-gradient-to-br from-pink-400/25 to-rose-400/15 animate-float7"
             style={{clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)'}} />

        {/* Math Icons */}
        {/* Plus */}
        <div className="hidden md:flex md:items-center md:justify-center absolute bottom-32 right-16 w-16 h-8 text-2xl font-bold text-yellow-400/60 animate-pulse-slow">+</div>

        {/* Pi */}
        <div className="hidden md:flex md:items-center md:justify-center absolute top-40 left-1/3 w-10 h-10 text-3xl font-bold text-blue-400/50 animate-bounce-slow">π</div>

        {/* Sigma */}
        <div className="hidden md:flex md:items-center md:justify-center absolute bottom-16 left-1/2 w-12 h-12 text-4xl font-bold text-green-400/40 animate-pulse-slow">∑</div>

        {/* Integral */}
        <div className="hidden md:flex md:items-center md:justify-center absolute top-2/3 right-1/4 w-10 h-10 text-3xl font-bold text-purple-400/50 animate-bounce-slow">∫</div>

        {/* Square Root */}
        <div className="hidden md:flex md:items-center md:justify-center absolute top-1/4 right-2/3 w-12 h-12 text-3xl font-bold text-orange-400/45 animate-pulse-slow">√</div>

        {/* Multiplication */}
        <div className="hidden md:flex md:items-center md:justify-center absolute bottom-1/3 left-20 w-8 h-8 text-2xl font-bold text-red-400/60 animate-bounce-slow">×</div>
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

      {/* Main Content */}
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
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
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
        </div>

        <MathSolver apiConfig={apiConfig} />
      </main>

      {/* Footer */}
      <footer className="relative border-t border-dark-border glass-effect mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
            <Sparkles className="w-4 h-4 text-accent-purple" />
            <span>Made with ❤️ by Akshay Mishra for Students & Learners</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;