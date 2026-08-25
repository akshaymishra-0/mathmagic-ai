import axios from "axios";
import FormData from "form-data";
import { getProvider } from "../config/aiProviders.js";

// ------------------------------------------------------------------
// Graph point generation — we calculate points ourselves so the
// graph is always mathematically correct (AI-generated points are
// unreliable).
// ------------------------------------------------------------------

// Convert a human-readable math expression into something JavaScript
// can evaluate. Handles common notation like x^2, 2x, sin(x), etc.
function toJSExpression(expr) {
  return expr
    .replace(/\^/g, "**")                    // x^2  -> x**2
    .replace(/(\d)(x)/gi, "$1*$2")            // 2x   -> 2*x
    .replace(/(\d)\(/g, "$1*(")               // 2(x) -> 2*(x)
    .replace(/\bsin\b/g, "Math.sin")
    .replace(/\bcos\b/g, "Math.cos")
    .replace(/\btan\b/g, "Math.tan")
    .replace(/\bsqrt\b/g, "Math.sqrt")
    .replace(/\babs\b/g, "Math.abs")
    .replace(/\bln\b/g, "Math.log")
    .replace(/\blog\b/g, "Math.log10")
    .replace(/\bpi\b/gi, "Math.PI")
    .replace(/\be\b/g, "Math.E");
}

// Evaluate f(x) for a given equation string. Returns NaN if invalid.
function evalAt(expr, x) {
  try {
    const jsExpr = toJSExpression(expr);
    // eslint-disable-next-line no-new-func
    const y = new Function("x", `return (${jsExpr})`)(x);
    return typeof y === "number" && isFinite(y) ? y : NaN;
  } catch {
    return NaN;
  }
}

// Generate 100 evenly-spaced points across the domain for the equation.
function generateGraphPoints(equation, domain) {
  const min = domain?.min ?? -10;
  const max = domain?.max ?? 10;
  const steps = 100;
  const step = (max - min) / steps;

  const points = [];
  for (let i = 0; i <= steps; i++) {
    const x = min + i * step;
    const y = evalAt(equation, x);
    if (!isNaN(y)) {
      points.push({
        x: Math.round(x * 1000) / 1000,
        y: Math.round(y * 1000) / 1000,
      });
    }
  }
  return points;
}

// ------------------------------------------------------------------

// Clean a string that might contain embedded JSON or markdown so it's
// readable plain text.
function cleanText(str) {
  if (!str || typeof str !== "string") return str || "";

  let text = str.trim();

  // If the whole value is a JSON object/array, try to extract the main text from it
  if (
    (text.startsWith("{") && text.endsWith("}")) ||
    (text.startsWith("[") && text.endsWith("]"))
  ) {
    try {
      const parsed = JSON.parse(text);
      if (typeof parsed === "object" && !Array.isArray(parsed)) {
        // Pick the most likely prose field
        const prose =
          parsed.text ||
          parsed.value ||
          parsed.content ||
          parsed.explanation ||
          parsed.answer ||
          parsed.result ||
          parsed.message;
        if (typeof prose === "string") {
          text = prose.trim();
        } else {
          // Fall back: join all string values
          text = Object.values(parsed)
            .filter((v) => typeof v === "string")
            .join("\n")
            .trim();
        }
      } else if (Array.isArray(parsed)) {
        text = parsed
          .map((item) => (typeof item === "string" ? item : JSON.stringify(item)))
          .join("\n")
          .trim();
      }
    } catch {
      // Not valid JSON — leave as-is
    }
  }

  // Strip markdown formatting
  text = text
    .replace(/\*\*(.+?)\*\*/gs, "$1")  // **bold** -> bold
    .replace(/\*(.+?)\*/gs, "$1")        // *italic* -> italic
    .replace(/_{2}(.+?)_{2}/gs, "$1")   // __bold__ -> bold
    .replace(/_(.+?)_/gs, "$1")          // _italic_ -> italic
    .replace(/#{1,6}\s*/g, "")            // ## Heading -> Heading
    .replace(/`{3}[\s\S]*?`{3}/g, "")   // ```code blocks``` -> removed
    .replace(/`([^`]+)`/g, "$1")         // `inline code` -> inline code
    .replace(/\\n/g, "\n")              // literal \n -> actual newline
    .replace(/\\t/g, "  ")              // literal \t -> spaces
    .replace(/\\r/g, "")                // literal \r -> removed
    .trim();

  return text;
}

// ------------------------------------------------------------------

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
        content: `You are an expert mathematics tutor AI. Solve math problems with clear, detailed, educational explanations.

        **IMPORTANT: Respond ONLY with valid JSON. No text before or after. No markdown code blocks.**

        **RESPONSE FORMAT (JSON only):**
        {
          "topic": "Branch of mathematics (e.g., Calculus, Algebra, Geometry)",
          "finalAnswer": "Clear, concise final answer",
          "steps": [
            {
              "title": "Step title",
              "explanation": "Detailed explanation of this step",
              "formula": "Any formula used (optional)",
              "calculation": "The actual calculation broken down (optional)"
            }
          ],
          "graphData": {
            "type": "line",
            "equation": "The math expression using x as the variable. Use standard notation: x^2, sin(x), 2*x+3, sqrt(x), etc.",
            "domain": {"min": number, "max": number}
          }
        }

        For non-graphing problems, set "graphData": null.

        IMPORTANT GRAPH RULES:
        - Only set graphData if the problem explicitly asks to graph, plot, or visualize a function.
        - The "equation" must be a valid mathematical expression with x as the variable.
        - Choose domain min/max to show the full shape of the graph (include negative values when relevant).
        - Do NOT include "points" or "range" — those are computed automatically.
        - Use "line" for continuous functions.

        Solve this problem: ${question}

        **RULES:**
        1. Break every problem into as many detailed steps as possible.
        2. Start from basics and build understanding step by step.
        3. Show calculations vertically, not horizontally.
        4. Explain the reasoning behind each step.
        5. Show all intermediate calculations with proper notation.
        6. Use numbered step titles (Step 1, Step 2, etc.).
        7. Be thorough and educational — assume the student is 10 years old.
        8. Set graphData to null if the problem doesn't involve graphing.
        9. ALWAYS respond with valid JSON only.
        10. Double-check your calculations and final answer.
        11. If asked about yourself, say you are MathMagic, an AI math tutor developed by Akshay Mishra.`,
      },
      {
        role: "user",
        content: `Solve this math problem step by step:\n\n${question}\n\nRespond in the exact JSON format specified.`,
      },
    ];
  }

  async solveMath(question) {
    try {
      const messages = this.createMathPrompt(question);

      if (this.providerName === "gemini") {
        return await this.solveWithGemini(messages);
      } else {
        return await this.solveWithOpenRouter(messages);
      }
    } catch (error) {
      const errMsg =
        error.response?.data?.error?.message ||
        error.response?.data?.error ||
        error.message;
      console.error("AI Service Error:", errMsg);
      throw new Error(`Failed to solve problem: ${errMsg}`);
    }
  }

  // Call Google Gemini API directly
  // Gemini uses a different URL and request format from OpenAI-compatible APIs
  async solveWithGemini(messages) {
    const systemPrompt = messages[0].content;
    const userMessage = messages[1].content;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:generateContent?key=${this.apiKey}`;

    const response = await axios.post(url, {
      system_instruction: {
        parts: [{ text: systemPrompt }],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: userMessage }],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 8192,
      },
    });

    const candidate = response.data?.candidates?.[0];
    if (!candidate || !candidate.content?.parts) {
      throw new Error("No response generated by Gemini model");
    }

    const content = candidate.content.parts.map((p) => p.text || "").join("");
    return this.parseResponse(content);
  }

  // Call OpenRouter API (OpenAI-compatible format)
  async solveWithOpenRouter(messages) {
    const provider = this.provider;
    const requestBody = provider.formatRequest(this.modelName, messages);
    const response = await axios.post(provider.baseURL, requestBody, {
      headers: provider.headers(this.apiKey),
    });
    const content = response.data.choices[0].message.content;
    return this.parseResponse(content);
  }

  parseResponse(content) {
    try {
      let cleanContent = content.trim();

      // Strip markdown code fences if present
      cleanContent = cleanContent.replace(/^[\s\S]*?```(?:json)?\s*\n?/, "");
      cleanContent = cleanContent.replace(/\n?```\s*[\s\S]*$/, "");

      // Extract the outermost JSON object
      const startIndex = cleanContent.indexOf("{");
      const lastIndex = cleanContent.lastIndexOf("}");
      if (startIndex !== -1 && lastIndex !== -1 && lastIndex > startIndex) {
        cleanContent = cleanContent.substring(startIndex, lastIndex + 1);
      }

      const parsed = JSON.parse(cleanContent);

      if (!parsed || typeof parsed !== "object") {
        throw new Error("Response is not a valid object");
      }

      if (!parsed.finalAnswer && !parsed.topic) {
        return this.formatParsed({
          topic: "Mathematics",
          finalAnswer: content,
          steps: [{ title: "Solution", explanation: content, formula: "", calculation: "" }],
          graphData: null,
        });
      }

      return this.formatParsed(parsed);
    } catch (error) {
      console.error("Parse Error:", error);
      return this.formatParsed({
        topic: "Mathematics",
        finalAnswer: content,
        steps: [{ title: "Solution", explanation: content, formula: "", calculation: "" }],
        graphData: null,
      });
    }
  }

  // Normalize the AI response for frontend consumption.
  formatParsed(parsed) {
    let obj;
    try {
      obj = JSON.parse(JSON.stringify(parsed));
    } catch {
      obj = Object.assign({}, parsed);
    }

    const toReadable = (val) => {
      if (val === null || val === undefined) return "";
      if (typeof val === "string") return val;
      if (typeof val === "number" || typeof val === "boolean") return String(val);
      if (Array.isArray(val)) {
        if (val.length > 0 && typeof val[0] === "object" && "x" in val[0] && "y" in val[0]) {
          return val.map((p) => `x: ${p.x}, y: ${p.y}`).join("\n");
        }
        return val.map((item) => toReadable(item)).join("\n");
      }
      if (typeof val === "object") {
        if (Array.isArray(val.lines)) return val.lines.join("\n");
        if ("x" in val && "y" in val) return `x: ${val.x}, y: ${val.y}`;
        try {
          return Object.entries(val).map(([k, v]) => `${k}: ${toReadable(v)}`).join("\n");
        } catch {
          return String(val);
        }
      }
      return String(val);
    };

    obj.finalAnswer = cleanText(toReadable(obj.finalAnswer || obj.answer || ""));

    if (Array.isArray(obj.steps)) {
      obj.steps = obj.steps.map((step, idx) => {
        const s = step && typeof step === "object" ? Object.assign({}, step) : { explanation: step };
        s.title = cleanText(toReadable(s.title || `Step ${idx + 1}`));
        s.explanation = cleanText(toReadable(s.explanation || ""));
        s.formula = cleanText(toReadable(s.formula || ""));
        s.calculation = cleanText(toReadable(s.calculation || ""));
        return s;
      });
    } else {
      obj.steps = obj.steps
        ? [{ title: "Solution", explanation: toReadable(obj.steps), formula: "", calculation: "" }]
        : [];
    }

    // Build graph data — always compute points ourselves for accuracy.
    if (obj.graphData && obj.graphData.equation) {
      const equation = String(obj.graphData.equation);
      const domain = obj.graphData.domain || { min: -10, max: 10 };

      const points = generateGraphPoints(equation, domain);

      if (points.length > 0) {
        const ys = points.map((p) => p.y);
        obj.graphData = {
          type: obj.graphData.type || "line",
          equation,
          points,
          domain: {
            min: Math.round(domain.min),
            max: Math.round(domain.max),
          },
          range: {
            min: Math.round(Math.min(...ys)),
            max: Math.round(Math.max(...ys)),
          },
        };
      } else {
        // Equation couldn't be evaluated — skip graph
        obj.graphData = null;
      }
    } else {
      obj.graphData = null;
    }

    return obj;
  }
}

// Process an image with OCR.space API to extract text
export const processImageWithOCR = async (imageBuffer, apiKey) => {
  try {
    const formData = new FormData();
    formData.append("file", imageBuffer, { filename: "image.jpg", contentType: "image/jpeg" });
    formData.append("language", "eng");
    formData.append("isOverlayRequired", "false");
    formData.append("iscreatesearchablepdf", "false");
    formData.append("issearchablepdfhidetextlayer", "false");

    const response = await axios.post("https://api.ocr.space/parse/image", formData, {
      headers: { ...formData.getHeaders(), apikey: apiKey },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    if (response.data.IsErroredOnProcessing) {
      throw new Error(response.data.ErrorMessage || "OCR processing failed");
    }

    const extractedText = response.data.ParsedResults.map((r) => r.ParsedText).join(" ").trim();

    if (!extractedText) {
      throw new Error("No text could be extracted from the image");
    }

    return extractedText;
  } catch (error) {
    console.error("OCR Error:", error);
    throw new Error(`OCR processing failed: ${error.message}`);
  }
};

export const createAIService = (provider, apiKey, modelName) => {
  return new AIService(provider, apiKey, modelName);
};
