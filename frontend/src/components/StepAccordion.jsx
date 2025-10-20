import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, Circle } from 'lucide-react';

const StepAccordion = ({ steps }) => {
  const [openSteps, setOpenSteps] = useState([0]); // First step open by default

  // Ensure steps is an array
  const safeSteps = Array.isArray(steps) ? steps : [];

  const toggleStep = (index) => {
    setOpenSteps(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const toggleAll = () => {
    if (openSteps.length === safeSteps.length) {
      setOpenSteps([]);
    } else {
      setOpenSteps(safeSteps.map((_, i) => i));
    }
  };

  // Helper function to safely render content that might be an object
  const renderContent = (content) => {
    if (typeof content === 'string') {
      return content;
    }
    if (typeof content === 'object' && content !== null) {
      // If it's an object with a 'lines' property (array), join them
      if (content.lines && Array.isArray(content.lines)) {
        return content.lines.join('\n');
      }
      // If it's any other object, try to stringify it safely
      try {
        return JSON.stringify(content, null, 2);
      } catch {
        return String(content);
      }
    }
    return String(content || '');
  };

  return (
    <div className="glass-effect rounded-2xl p-3 md:p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-xl font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-accent-blue" />
          <span>Step-by-Step Solution</span>
        </h2>
        <button
          onClick={toggleAll}
          className="btn-secondary px-4 py-2 rounded-lg text-sm"
        >
          {openSteps.length === safeSteps.length ? 'Collapse All' : 'Expand All'}
        </button>
      </div>

      <div className="space-y-2 md:space-y-3">
        {safeSteps.map((step, index) => {
          // Ensure step is a valid object
          if (!step || typeof step !== 'object') {
            return null;
          }

          return (
          <div
            key={index}
            className="step-card overflow-hidden"
          >
            <button
              onClick={() => toggleStep(index)}
              className="w-full flex items-center justify-between p-3 md:p-4 text-left"
            >
              <div className="flex items-center space-x-3 flex-1">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  openSteps.includes(index) 
                    ? 'bg-accent-purple text-white' 
                    : 'bg-dark-card border border-dark-border text-gray-400'
                }`}>
                  {index + 1}
                </div>
                <h3 className="font-semibold text-lg">{step.title || `Step ${index + 1}`}</h3>
              </div>
              {openSteps.includes(index) ? (
                <ChevronUp className="w-5 h-5 text-accent-purple flex-shrink-0 ml-2" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
              )}
            </button>

            {openSteps.includes(index) && (
              <div className="px-3 md:px-4 pb-3 md:pb-4 space-y-3 md:space-y-4 animate-in slide-in-from-top">
                  {step.explanation && (
                    <div className="pl-8 md:pl-11">
                      <p className="text-gray-300 leading-relaxed">{renderContent(step.explanation)}</p>
                    </div>
                  )}                {step.formula && (
                  <div className="pl-8 md:pl-11">
                    <div className="bg-dark-card border border-accent-blue/30 rounded-lg p-3 md:p-4">
                      <p className="text-xs text-accent-blue mb-1">Formula:</p>
                      <code className="text-accent-blue font-mono text-sm">{renderContent(step.formula)}</code>
                    </div>
                  </div>
                )}

                {step.calculation && (
                  <div className="pl-8 md:pl-11">
                    <div className="bg-dark-card border border-accent-green/30 rounded-lg p-3 md:p-4">
                      <p className="text-xs text-accent-green mb-1">Calculation:</p>
                      <code className="text-gray-100 font-mono text-sm whitespace-pre-wrap">{renderContent(step.calculation)}</code>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepAccordion;