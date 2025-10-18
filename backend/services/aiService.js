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

        **RESPONSE FORMAT (STRICT JSON):**
        \`\`\`json
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
          "graphData": null
        }
        \`\`\`

        For graphing problems (only when explicitly requested):
        \`\`\`json
        {
          "graphData": {
            "type": "line|parabola|circle|linear",
            "equation": "The equation to plot",
            "points": [{"x": 0, "y": 0}, {"x": 1, "y": 1}],
            "domain": {"min": -10, "max": 10},
            "range": {"min": -10, "max": 10}
          }
        }
        \`\`\`

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
        10. ONLY provide graph data if the question explicitly asks for graphing, plotting, or showing points/curves
        11. If no graphing is requested, set graphData.type to "none" and omit other graphData fields
        12. For graphing problems, provide 20-50 coordinate points with detailed plotting instructions
        13. Use proper mathematical notation and formatting
        14. Be encouraging and educational
        15. ALWAYS respond with valid JSON only
        16. ALWAYS GIVE JSON FORMAT WITHOUT ANY EXTRA TEXT AND PROPERLY FORMATTED
        17. If unsure about the final answer, state your assumptions clearly
        18. NEVER OMIT any of the specified fields in the JSON response
        19. Assume your student is 10 years old, explain to understand him all of this
        20. Always give BEST Mathematical output`,
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
      // Extract JSON from markdown code blocks if present
      const jsonMatch =
        content.match(/```json\n([\s\S]*?)\n```/) ||
        content.match(/```\n([\s\S]*?)\n```/);

      const jsonString = jsonMatch ? jsonMatch[1] : content;
      const parsed = JSON.parse(jsonString.trim());

      // Validate structure
      if (
        !parsed.finalAnswer ||
        !parsed.steps ||
        !Array.isArray(parsed.steps)
      ) {
        throw new Error("Invalid response structure");
      }

      return parsed;
    } catch (error) {
      console.error("Parse Error:", error);
      // Fallback response
      return {
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
    }
  }
}

export const createAIService = (provider, apiKey, modelName) => {
  return new AIService(provider, apiKey, modelName);
};
