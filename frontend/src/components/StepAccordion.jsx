import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, Circle } from 'lucide-react';

const StepAccordion = ({ steps }) => {
  const [openSteps, setOpenSteps] = useState([0]); // First step open by default

  const toggleStep = (index) => {
    setOpenSteps(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const toggleAll = () => {
    if (openSteps.length === steps.length) {
      setOpenSteps([]);
    } else {
      setOpenSteps(steps.map((_, i) => i));
    }
  };

  return (
    <div className="glass-effect rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-accent-blue" />
          <span>Step-by-Step Solution</span>
        </h2>
        <button
          onClick={toggleAll}
          className="btn-secondary px-4 py-2 rounded-lg text-sm"
        >
          {openSteps.length === steps.length ? 'Collapse All' : 'Expand All'}
        </button>
      </div>

      <div className="space-y-3">
        {steps.map((step, index) => (
          <div
            key={index}
            className="step-card overflow-hidden"
          >
            <button
              onClick={() => toggleStep(index)}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <div className="flex items-center space-x-3 flex-1">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  openSteps.includes(index) 
                    ? 'bg-accent-purple text-white' 
                    : 'bg-dark-card border border-dark-border text-gray-400'
                }`}>
                  {index + 1}
                </div>
                <h3 className="font-semibold text-lg">{step.title}</h3>
              </div>
              {openSteps.includes(index) ? (
                <ChevronUp className="w-5 h-5 text-accent-purple flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
              )}
            </button>

            {openSteps.includes(index) && (
              <div className="px-4 pb-4 space-y-4 animate-in slide-in-from-top">
                {step.explanation && (
                  <div className="pl-11">
                    <p className="text-gray-300 leading-relaxed">{step.explanation}</p>
                  </div>
                )}

                {step.formula && (
                  <div className="pl-11">
                    <div className="bg-dark-card border border-accent-blue/30 rounded-lg p-4">
                      <p className="text-xs text-accent-blue mb-1">Formula:</p>
                      <code className="text-accent-blue font-mono text-sm">{step.formula}</code>
                    </div>
                  </div>
                )}

                {step.calculation && (
                  <div className="pl-11">
                    <div className="bg-dark-card border border-accent-green/30 rounded-lg p-4">
                      <p className="text-xs text-accent-green mb-1">Calculation:</p>
                      <code className="text-gray-100 font-mono text-sm whitespace-pre-wrap">{step.calculation}</code>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepAccordion;