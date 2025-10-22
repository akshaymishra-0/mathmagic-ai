import axios from "axios";
import { getProvider } from "../config/aiProviders.js";

export class AIService {
  constructor(provider, apiKey, modelName) {
    this.providerName = provider;
    this.apiKey = apiKey;
    this.modelName = modelName;
    this.provider = getProvider(provider);
  }

  createMathPrompt(question) {
    return [
      {
        role: "system",
        content: `You are an expert mathematics tutor AI. Your task is to solve math problems with exceptional clarity and educational value.

        **IMPORTANT: Respond ONLY with valid JSON. Do not include any text before or after the JSON. Do not use markdown code blocks.**

        **RESPONSE FORMAT (JSON only):**
        {
          "topic": "Branch of mathematics (e.g., Calculus, Algebra, Geometry)",
          "finalAnswer": "Clear, concise final answer",
          "steps": [
            {
              "title": "Step title",
              "explanation": "Detailed explanation of this step with full reasoning",
              "formula": "Any formula used (optional)",
              "calculation": "The actual calculation broken down step by step (optional)"
            }
          ],
          "graphData": {
            "type": "line|scatter|bar",
            "equation": "The equation to plot (for graphing problems only)",
            "points": [
              {"x": number, "y": number},
              ... (20-50 points covering the domain)
            ],
            "domain": {"min": number, "max": number},
            "range": {"min": number, "max": number}
          }
        }

        For non-graphing problems, set "graphData": null.

        Solve this math problem: ${question}

        IMPORTANT: For all graphs, ensure the domain and range ALWAYS include 0 and extend to show all 4 quadrants. Calculate appropriate min/max values that include both positive and negative values, with 0 in the center.

        **RULES:**
        1. Break down every problem into as many detailed steps as possible
        2. Start from the absolute basics and build up understanding and Calculate Each step.
        3. REMEMBER ALWAYS SHOW THE CALCULATION STEPS VERTICALLY IN DETAILED MANNER NOT HORIZONTALLY
        4. Explain the reasoning behind each step clearly
        5. Show all intermediate calculations with proper mathematical notation
        6. Include formulas and their explanations
        7. For each calculation, show the step-by-step process
        8. Use numbered steps (Step 1, Step 2, etc.) in titles
        9. Be thorough and educational - assume the student knows very little
        10. ALWAYS provide graph data for problems that ask to graph, plot, or visualize functions/equations
        11. For graphing problems, provide 20-50 coordinate points with x values evenly spaced across the domain
        12. Set graphData to null only if the problem doesn't involve any visual representation
        13. Use "line" type for continuous functions and "scatter" type for discrete data points
        14. CRITICAL: Domain and range MUST include 0 and show all 4 quadrants (positive and negative x/y values)
        14. Be encouraging and educational
        15. ALWAYS respond with valid JSON only
        16. ALWAYS CONVERT TO PROPER READABLE FORMAT FROM JSON FORMAT WITHOUT ANY EXTRA TEXT AND KEEP PROPERLY FORMATTED
        17. If unsure about the final answer, state your assumptions clearly
        18. NEVER OMIT any of the specified fields in the JSON response
        19. Assume your student is 10 years old, explain to understand him all of this
        20. Always give BEST Mathematical output
        21. ALWAYS SHOW CORRECT GRAPH DATA IF REQUESTED, GIVE CORRECT VISUALIZATION
        22. ALWAYS FOCUS ON THE EDUCATIONAL ASPECT AND TEACHING THE CONCEPTS CLEARLY
        23. ALWAYS ENSURE THE JSON IS VALID AND WELL-FORMATTED
        24. ALWAYS DOUBLE CHECK YOUR CALCULATIONS AND FINAL ANSWER FOR ACCURACY
        25. IF USER ASK ABOUT YOURSELF THEN TELL THEM THAT, YOU ARE MATHMAGIC, AN AI-POWERED MATHEMATICS TUTOR DEVELOPED BY AKSHAY MISHRA, TO HELP STUDENTS LEARN AND UNDERSTAND MATH CONCEPTS CLEARLY AND THOROUGHLY.`,
      },
      {
        role: "user",
        content: `Solve this math problem step by step:\n\n${question}\n\nProvide the response in the exact JSON format specified.`,
      },
    ];
  }

  async solveMath(question) {
    try {
      const messages = this.createMathPrompt(question);
      const provider = this.provider;

      let response;

      if (this.providerName === "gemini") {
        // Special handling for Gemini
        const url = provider.baseURL(this.apiKey, this.modelName);
        const requestBody = provider.formatRequest(this.modelName, messages);

        response = await axios.post(url, requestBody, {
          headers: provider.headers(),
        });

        const content = response.data.candidates[0].content.parts[0].text;
        return this.parseResponse(content);
      } else if (this.providerName === "claude") {
        // Special handling for Claude
        const requestBody = provider.formatRequest(this.modelName, messages);

        response = await axios.post(provider.baseURL, requestBody, {
          headers: provider.headers(this.apiKey),
        });

        const content = response.data.content[0].text;
        return this.parseResponse(content);
      } else {
        // Standard OpenAI-compatible APIs (OpenRouter, Deepseek, etc.)
        const requestBody = provider.formatRequest(this.modelName, messages);

        response = await axios.post(provider.baseURL, requestBody, {
          headers: provider.headers(this.apiKey),
        });

        const content = response.data.choices[0].message.content;
        return this.parseResponse(content);
      }
    } catch (error) {
      console.error("AI Service Error:", error.response?.data || error.message);
      throw new Error(`Failed to solve problem: ${error.message}`);
    }
  }

  parseResponse(content) {
    try {
      // Clean the content first
      let cleanContent = content.trim();

      // Remove any leading/trailing markdown or text
      cleanContent = cleanContent.replace(/^[\s\S]*?```(?:json)?\s*\n?/, "");
      cleanContent = cleanContent.replace(/\n?```\s*[\s\S]*$/, "");

      // Try to find JSON object boundaries
      const startIndex = cleanContent.indexOf("{");
      const lastIndex = cleanContent.lastIndexOf("}");

      if (startIndex !== -1 && lastIndex !== -1 && lastIndex > startIndex) {
        cleanContent = cleanContent.substring(startIndex, lastIndex + 1);
      }

      // Try to parse as JSON
      const parsed = JSON.parse(cleanContent);

      // Validate structure
      if (!parsed || typeof parsed !== "object") {
        throw new Error("Response is not a valid object");
      }

      // Ensure required fields exist — if not, fallback to treating whole content as the answer
      if (!parsed.finalAnswer && !parsed.topic) {
        const fallback = {
          topic: "Mathematics",
          finalAnswer: content,
          steps: [
            {
              title: "Solution",
              explanation: content,
              formula: "",
              calculation: "",
            },
          ],
          graphData: null,
        };

        return this.formatParsed(fallback);
      }

      // Normalize & format the parsed response for frontend consumption
      return this.formatParsed(parsed);
    } catch (error) {
      console.error("Parse Error:", error);
      console.error("Raw content:", content);

      // Fallback response
      const fallback = {
        topic: "Mathematics",
        finalAnswer: content,
        steps: [
          {
            title: "Solution",
            explanation: content,
            formula: "",
            calculation: "",
          },
        ],
        graphData: null,
      };

      return this.formatParsed(fallback);
    }
  }

  // Convert parsed AI JSON into frontend-friendly, human readable fields.
  // - Ensures strings for explanation/formula/calculation
  // - Joins arrays into newline-separated strings
  // - Converts graph point values to numbers when possible
  formatParsed(parsed) {
    // Deep clone to avoid mutating original
    let obj;
    try {
      obj = JSON.parse(JSON.stringify(parsed));
    } catch (e) {
      obj = Object.assign({}, parsed);
    }

    const toReadable = (val) => {
      if (val === null || val === undefined) return "";
      if (typeof val === "string") return val;
      if (typeof val === "number" || typeof val === "boolean")
        return String(val);
      if (Array.isArray(val)) {
        // If array of points like {x,y}, format them nicely
        if (
          val.length > 0 &&
          typeof val[0] === "object" &&
          "x" in val[0] &&
          "y" in val[0]
        ) {
          return val.map((p) => `x: ${p.x}, y: ${p.y}`).join("\n");
        }

        // If array of primitives or strings, join with newlines
        return val.map((item) => toReadable(item)).join("\n");
      }
      if (typeof val === "object") {
        // If object has lines array, join those
        if (Array.isArray(val.lines)) return val.lines.join("\n");

        // If it's a point-like object
        if ("x" in val && "y" in val) return `x: ${val.x}, y: ${val.y}`;

        // Otherwise, convert key: value pairs into lines
        try {
          return Object.entries(val)
            .map(([k, v]) => `${k}: ${toReadable(v)}`)
            .join("\n");
        } catch (e) {
          return String(val);
        }
      }

      return String(val);
    };

    // Normalize finalAnswer
    obj.finalAnswer = toReadable(obj.finalAnswer || obj.answer || "");

    // Normalize steps
    if (Array.isArray(obj.steps)) {
      obj.steps = obj.steps.map((step, idx) => {
        const safeStep =
          step && typeof step === "object"
            ? Object.assign({}, step)
            : { explanation: step };

        safeStep.title = toReadable(safeStep.title || `Step ${idx + 1}`);
        safeStep.explanation = toReadable(safeStep.explanation || "");
        safeStep.formula = toReadable(safeStep.formula || "");
        safeStep.calculation = toReadable(safeStep.calculation || "");

        return safeStep;
      });
    } else {
      // If steps is a single string/object, coerce into array
      if (obj.steps) {
        obj.steps = [
          {
            title: "Solution",
            explanation: toReadable(obj.steps),
            formula: "",
            calculation: "",
          },
        ];
      } else {
        obj.steps = [];
      }
    }

    // Normalize graphData
    if (obj.graphData) {
      const gd = Object.assign({}, obj.graphData);

      // Ensure type
      gd.type = gd.type || "none";

      // Equation
      gd.equation = toReadable(gd.equation || "");

      // Points: try to coerce x/y to numbers where possible
      if (Array.isArray(gd.points)) {
        gd.points = gd.points.map((p) => {
          if (p && typeof p === "object") {
            const nx = typeof p.x === "number" ? p.x : Number(p.x) || 0;
            const ny = typeof p.y === "number" ? p.y : Number(p.y) || 0;
            return { x: nx, y: ny };
          }
          return p;
        });
      } else {
        gd.points = [];
      }

      // Domain & range ensure numeric min/max
      if (gd.domain && typeof gd.domain === "object") {
        gd.domain = {
          min: Number(gd.domain.min) || 0,
          max: Number(gd.domain.max) || 0,
        };
      }
      if (gd.range && typeof gd.range === "object") {
        gd.range = {
          min: Number(gd.range.min) || 0,
          max: Number(gd.range.max) || 0,
        };
      }

      obj.graphData = gd;
    } else {
      obj.graphData = null;
    }

    return obj;
  }
}

export const createAIService = (provider, apiKey, modelName) => {
  return new AIService(provider, apiKey, modelName);
};
