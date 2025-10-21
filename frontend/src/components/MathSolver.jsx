import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Send, Loader2, BookOpen, Lightbulb, TrendingUp, Calculator, RotateCcw } from 'lucide-react';
import StepAccordion from './StepAccordion';
import GraphVisualizer from './GraphVisualizer';

const EXAMPLE_QUESTIONS = [
  "Solve the quadratic equation: x² - 5x + 6 = 0",
  "Find the derivative of: f(x) = 3x³ - 2x² + 5x - 1",
  "Draw the graph of the function: y = 2x + 3",
  "Solve the system: 2x + y = 7 and x - y = 2",
];

const MathSolver = ({ apiConfig }) => {
  const location = useLocation();
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [solution, setSolution] = useState(null);

  // Check for question from navigation state (from history)
  useEffect(() => {
    if (location.state?.question) {
      setQuestion(location.state.question);
      // Clear the navigation state to prevent re-triggering
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleSolve = async (e) => {
    e.preventDefault();
    
    if (!question.trim()) {
      toast.error('Please enter a math question');
      return;
    }

    setLoading(true);
    setSolution(null);

    try {
      const response = await axios.post('/api/solve', {
        question: question.trim(),
        provider: apiConfig.provider,
        modelName: apiConfig.modelName
      });

      if (response.data.success) {
        setSolution(response.data.data);
        toast.success('Problem solved successfully!');
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.error || 'Failed to solve the problem');
    } finally {
      setLoading(false);
    }
  };

  const loadExample = (example) => {
    setQuestion(example);
    setSolution(null);
  };

  const clearAll = () => {
    setQuestion('');
    setSolution(null);
    setLoading(false);
  };

  const getTopicColor = (topic) => {
    const colors = {
      'Calculus': 'from-purple-500 to-pink-500',
      'Algebra': 'from-blue-500 to-cyan-500',
      'Geometry': 'from-green-500 to-emerald-500',
      'Trigonometry': 'from-orange-500 to-red-500',
      'Probability': 'from-yellow-500 to-orange-500',
      'default': 'from-accent-purple to-accent-blue'
    };
    return colors[topic] || colors.default;
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Input Section */}
      <div className="glass-effect rounded-2xl p-4 md:p-6 shadow-2xl">
        <div className="flex items-center space-x-2 mb-4">
          <BookOpen className="w-5 h-5 text-accent-purple" />
          <h2 className="text-xl font-semibold">Ask Your Question</h2>
        </div>

        <form onSubmit={handleSolve} className="space-y-4">
          <div>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter any math problem..."
              rows="4"
              className="input-dark w-full rounded-xl p-4 resize-none"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="btn-primary w-full py-2 md:py-3 rounded-xl flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Solving...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Solve Problem</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={clearAll}
            disabled={loading || (!question.trim() && !solution)}
            className="btn-secondary w-full py-2 md:py-3 rounded-xl flex items-center justify-center space-x-2 mt-3"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Clear All</span>
          </button>
        </form>

        {/* Example Questions */}
        <div className="mt-6">
          <div className="flex items-center space-x-2 mb-3">
            <Lightbulb className="w-4 h-4 text-accent-orange" />
            <p className="text-sm text-gray-400">Try these examples:</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_QUESTIONS.map((example, index) => (
              <button
                key={index}
                onClick={() => loadExample(example)}
                className="btn-secondary px-3 py-1.5 rounded-lg text-xs"
                disabled={loading}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="glass-effect rounded-2xl p-8 md:p-12 text-center">
          <div className="inline-block p-4 bg-accent-purple/20 rounded-full mb-4">
            <Loader2 className="w-12 h-12 text-accent-purple animate-spin" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Analyzing your problem...</h3>
          <p className="text-gray-400">Our AI is working on the solution</p>
        </div>
      )}

      {/* Solution Display */}
      {solution && !loading && (
        <div className="space-y-4 md:space-y-6">
          {/* Topic Badge and Final Answer */}
          <div className="glass-effect rounded-2xl p-4 md:p-6 shadow-2xl">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-accent-green" />
                <h2 className="text-xl font-semibold">Solution</h2>
              </div>
              {solution.topic && (
                <span className={`topic-badge ${getTopicColor(solution.topic)}`}>
                  {solution.topic}
                </span>
              )}
            </div>

            <div className="bg-gradient-to-r from-accent-green/10 to-accent-blue/10 border border-accent-green/30 rounded-xl p-4 md:p-6">
              <p className="text-sm text-gray-400 mb-2">Final Answer:</p>
              <p className="text-lg md:text-2xl font-bold text-accent-green">{solution.finalAnswer}</p>
            </div>
          </div>

          {/* Step-by-Step Solution */}
          {solution.steps && solution.steps.length > 0 && (
            <StepAccordion steps={solution.steps} />
          )}

          {/* Graph Visualization */}
          {solution.graphData && solution.graphData.type !== 'none' && (
            <GraphVisualizer graphData={solution.graphData} />
          )}
        </div>
      )}

      {/* Empty State */}
      {!solution && !loading && (
        <div className="glass-effect rounded-2xl p-8 md:p-12 text-center">
          <div className="inline-block p-4 bg-accent-purple/20 rounded-full mb-4">
            <Calculator className="w-12 h-12 text-accent-purple" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Ready to solve any math problem!</h3>
          <p className="text-gray-400">Enter a question above or try one of the examples</p>
        </div>
      )}
    </div>
  );
};

export default MathSolver;