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

// Clean a string that might contain embedded JSON, markdown, or LaTeX macros
// so it is rendered as clean, human-readable plain text.
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
      // Not valid JSON — proceed
    }
  }

  // Convert LaTeX fractions: \frac{a}{b} -> (a)/(b)
  text = text.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "($1)/($2)");

  // Convert LaTeX square roots: \sqrt{x} -> √(x)
  text = text.replace(/\\sqrt\{([^{}]+)\}/g, "√($1)");

  // Convert common LaTeX math symbols to clean Unicode
  text = text
    .replace(/\\times\b/g, " × ")
    .replace(/\\cdot\b/g, " · ")
    .replace(/\\div\b/g, " ÷ ")
    .replace(/\\pm\b/g, " ± ")
    .replace(/\\approx\b/g, " ≈ ")
    .replace(/\\neq\b/g, " ≠ ")
    .replace(/\\leq?\b/g, " ≤ ")
    .replace(/\\geq?\b/g, " ≥ ")
    .replace(/\\infty\b/g, " ∞ ")
    .replace(/\\pi\b/g, "π")
    .replace(/\\theta\b/g, "θ")
    .replace(/\\alpha\b/g, "α")
    .replace(/\\beta\b/g, "β")
    .replace(/\\Delta\b/g, "Δ")
    .replace(/\\int\b/g, "∫")
    .replace(/\\sum\b/g, "∑")
    .replace(/\\text\{([^{}]+)\}/g, "$1")
    .replace(/\\mathbf\{([^{}]+)\}/g, "$1")
    .replace(/\\mathrm\{([^{}]+)\}/g, "$1")
    .replace(/\\left|\\right/g, "")
    .replace(/\\quad|\\qquad/g, "  ");

  // Remove LaTeX inline and display math delimiters: \( \), \[ \], $$, $
  text = text
    .replace(/\\\[([\s\S]*?)\\\]/g, "$1")
    .replace(/\\\(([\s\S]*?)\\\)/g, "$1")
    .replace(/\$\$([\s\S]*?)\$\$/g, "$1")
    .replace(/\$([^$\n]+)\$/g, "$1");

  // Strip markdown formatting & special characters
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
    .replace(/\n{3,}/g, "\n\n")         // Collapse multiple consecutive blank lines
    .trim();

  return text;
}

// Helper to check if the user specifically asked for a graph/plot
function isGraphRequested(question) {
  if (!question || typeof question !== "string") return false;
  return /\b(graph|plot|draw|sketch|visualize|chart|curve)\b/i.test(question);
}

// ------------------------------------------------------------------

export class AIService {
  constructor(provider, apiKey, modelName) {
    this.providerName = provider || "openrouter";
    this.apiKey = apiKey;
    this.modelName = modelName;
    this.provider = getProvider(this.providerName);
  }

  createMathPrompt(question) {
    const graphAsked = isGraphRequested(question);

    return [
      {
        role: "system",
        content: `You are an expert mathematics tutor AI. Solve math problems with clear, detailed, highly educational explanations in clean, readable notation.

        **IMPORTANT: Respond ONLY with valid JSON. No conversational text before or after. No markdown fences.**

        **RESPONSE FORMAT (JSON only):**
        {
          "topic": "Branch of mathematics (e.g., Calculus, Algebra, Geometry, Trigonometry, Arithmetic)",
          "finalAnswer": "Clear, concise final answer with appropriate units if applicable",
          "steps": [
            {
              "title": "Step 1: Description of what this step does",
              "explanation": "Clear step explanation in simple, easy-to-understand language",
              "formula": "Formula used (optional, in readable notation like 'a² + b² = c²')",
              "calculation": "Vertical or breakdown calculation lines (optional)"
            }
          ],
          "graphData": ${
            graphAsked
              ? `{
            "type": "line",
            "equation": "Standard math expression using x as variable (e.g. x^2, 2*x + 3, sin(x), sqrt(x))",
            "domain": {"min": -10, "max": 10}
          }`
              : `null`
          }
        }

        **GRAPH RULES:**
        - ONLY provide "graphData" if the user EXPLICITLY asked to graph, plot, draw, sketch, or visualize a function/equation.
        - For all standard calculations, algebra equations, word problems, derivatives, integrals, or questions without graphing keywords, "graphData" MUST BE null.

        IMPORTANT FORMATTING & MATH RULES:
        1. Always use clean, human-readable math notation (use ×, ÷, √, ², ³, π, θ, / instead of complex LaTeX macros).
        2. Break every problem down into intuitive, sequential steps.
        3. Explain each step clearly so a beginner student can follow easily.
        4. In the calculation field, display multi-step computations line by line.
        5. Double check arithmetic and final answer for 100% accuracy.
        6. If asked about yourself, say you are MathMagic, an AI math tutor developed by Akshay Mishra.
        7. Respond with valid JSON only.`,
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
      const provider = this.provider;
      const requestBody = provider.formatRequest(this.modelName, messages);

      const response = await axios.post(provider.baseURL, requestBody, {
        headers: provider.headers(this.apiKey),
      });

      const content = response.data.choices?.[0]?.message?.content || "";
      return this.parseResponse(content, question);
    } catch (error) {
      let errMsg =
        error.response?.data?.error?.message ||
        error.response?.data?.error ||
        error.message;

      if (error.response?.status === 401 || errMsg === "User not found.") {
        errMsg = "Invalid API Key. Please verify your API key in backend/.env.";
      } else if (error.response?.status === 429) {
        errMsg = "Rate limit reached for this AI model. Please wait a minute and try again.";
      }

      console.error("AI Service Error:", errMsg);
      throw new Error(errMsg);
    }
  }

  parseResponse(content, question) {
    try {
      let cleanContent = (content || "").trim();

      // Strip thinking tags if any (e.g. DeepSeek-R1 on OpenRouter)
      cleanContent = cleanContent.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

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
        }, question);
      }

      return this.formatParsed(parsed, question);
    } catch (error) {
      console.error("Parse Error:", error);
      return this.formatParsed({
        topic: "Mathematics",
        finalAnswer: content,
        steps: [{ title: "Solution", explanation: content, formula: "", calculation: "" }],
        graphData: null,
      }, question);
    }
  }

  // Normalize the AI response for frontend consumption.
  formatParsed(parsed, question) {
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

    // Build graph data — only if the user explicitly asked for a graph
    if (obj.graphData && obj.graphData.equation && isGraphRequested(question)) {
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
