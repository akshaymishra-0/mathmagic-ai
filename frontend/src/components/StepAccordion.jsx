import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const StepAccordion = ({ steps }) => {
  const safeSteps = Array.isArray(steps) ? steps : [];
  const [openSteps, setOpenSteps] = useState([0]); // First step open by default

  const toggleStep = (index) => {
    setOpenSteps((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const toggleAll = () => {
    if (openSteps.length === safeSteps.length) {
      setOpenSteps([]);
    } else {
      setOpenSteps(safeSteps.map((_, i) => i));
    }
  };

  // Handle cases where a field might be an object instead of a string
  const renderContent = (content) => {
    if (typeof content === "string") return content;
    if (content === null || content === undefined) return "";
    if (Array.isArray(content)) return content.join("\n");
    if (typeof content === "object") {
      if (content.lines && Array.isArray(content.lines)) return content.lines.join("\n");
      try {
        return JSON.stringify(content, null, 2);
      } catch {
        return String(content);
      }
    }
    return String(content);
  };

  return (
    <div className="glass-effect rounded-2xl p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Step-by-Step Solution</h2>
        <button onClick={toggleAll} className="btn-secondary px-4 py-2 rounded-lg text-sm">
          {openSteps.length === safeSteps.length ? "Collapse All" : "Expand All"}
        </button>
      </div>

      <div className="space-y-2">
        {safeSteps.map((step, index) => {
          if (!step || typeof step !== "object") return null;

          return (
            <div key={index} className="step-card overflow-hidden">
              <button
                onClick={() => toggleStep(index)}
                className="w-full flex items-center justify-between p-3 text-left"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                      openSteps.includes(index)
                        ? "bg-accent-purple text-white"
                        : "bg-dark-card border border-dark-border text-gray-400"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <h3 className="font-medium">{step.title || `Step ${index + 1}`}</h3>
                </div>
                {openSteps.includes(index) ? (
                  <ChevronUp className="w-5 h-5 text-accent-purple flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </button>

              {openSteps.includes(index) && (
                <div className="px-4 pb-4 space-y-3 pl-14">
                  {step.explanation && (
                    <p className="text-gray-300 leading-relaxed">
                      {renderContent(step.explanation)}
                    </p>
                  )}
                  {step.formula && (
                    <div className="bg-dark-card border border-accent-blue/30 rounded-lg p-3">
                      <p className="text-xs text-accent-blue mb-1">Formula:</p>
                      <code className="text-accent-blue font-mono text-sm">
                        {renderContent(step.formula)}
                      </code>
                    </div>
                  )}
                  {step.calculation && (
                    <div className="bg-dark-card border border-accent-green/30 rounded-lg p-3">
                      <p className="text-xs text-accent-green mb-1">Calculation:</p>
                      <code className="text-gray-100 font-mono text-sm whitespace-pre-wrap">
                        {renderContent(step.calculation)}
                      </code>
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
