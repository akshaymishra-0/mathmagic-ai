import express from "express";
import multer from "multer";
import { createAIService, processImageWithOCR } from "../services/aiService.js";
import { authenticateToken } from "./auth.js";
import User from "../models/User.js";
import Calculation from "../models/Calculation.js";

const router = express.Router();

// Store uploaded images in memory (no disk writes needed)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

router.post("/", authenticateToken, upload.single("image"), async (req, res) => {
  try {
    let { question, provider, modelName } = req.body;

    // If image was uploaded, extract text via OCR
    if (req.file) {
      const ocrApiKey = process.env.OCR_SPACE_API_KEY;
      if (!ocrApiKey) {
        return res.status(400).json({ success: false, error: "OCR API Key not configured" });
      }

      try {
        question = await processImageWithOCR(req.file.buffer, ocrApiKey);
      } catch (ocrError) {
        return res.status(400).json({
          success: false,
          error: `Failed to process image: ${ocrError.message}`,
        });
      }
    }

    if (!question || question.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Question is required (provide text or upload an image)",
      });
    }

    const aiProvider = process.env.AI_PROVIDER || provider || "openrouter";
    const aiApiKey = process.env.API_KEY;
    const aiModel =
      process.env.MODEL_NAME ||
      (modelName && modelName !== "undefined" ? modelName : "nemotron-3-ultra-550b-a55b:free");

    if (!aiApiKey) {
      return res.status(400).json({ success: false, error: "API Key not configured" });
    }

    const aiService = createAIService(aiProvider, aiApiKey, aiModel);
    const solution = await aiService.solveMath(question);

    // Save to database
    const calculation = new Calculation({
      user: req.user.userId,
      question,
      solution,
      provider: aiProvider,
      modelName: aiModel,
    });

    await calculation.save();

    // Add to user's recent calculations (capped at 5 in the User model)
    const user = await User.findById(req.user.userId);
    user.addCalculation(calculation._id);
    await user.save();

    res.json({ success: true, data: solution });
  } catch (error) {
    console.error("Solve Route Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to solve the problem",
    });
  }
});

export default router;
