import express from "express";
import multer from "multer";
import { createAIService, processImageWithOCR } from "../services/aiService.js";
import { authenticateToken } from "./auth.js";
import User from "../models/User.js";
import Calculation from "../models/Calculation.js";

const router = express.Router();

// Configure multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// Function to cleanup old calculations, keeping only the 1000 most recent
const cleanupOldCalculations = async () => {
  try {
    // Count total calculations
    const totalCalculations = await Calculation.countDocuments();

    if (totalCalculations > 5000) {
      // Find calculations to delete (oldest ones beyond the 1000 limit)
      const calculationsToDelete = await Calculation.find()
        .sort({ createdAt: -1 }) // Sort by newest first
        .skip(1000) // Skip the first 1000 (most recent)
        .select("_id"); // Only get IDs for deletion

      if (calculationsToDelete.length > 0) {
        const idsToDelete = calculationsToDelete.map((calc) => calc._id);

        // Delete the old calculations
        const deleteResult = await Calculation.deleteMany({
          _id: { $in: idsToDelete },
        });

        // Also clean up references in User documents
        await User.updateMany(
          { calculations: { $in: idsToDelete } },
          { $pull: { calculations: { $in: idsToDelete } } }
        );

        console.log(
          `🧹 Cleaned up ${
            deleteResult.deletedCount
          } old calculations. Total remaining: ${
            totalCalculations - deleteResult.deletedCount
          }`
        );
      }
    }
  } catch (error) {
    console.error("Error during calculation cleanup:", error);
    // Don't throw error to avoid breaking the main flow
  }
};

router.post("/", authenticateToken, upload.single('image'), async (req, res) => {
  try {
    let { question, provider, modelName } = req.body;

    // Handle image upload
    if (req.file) {
      const ocrApiKey = process.env.OCR_SPACE_API_KEY;
      if (!ocrApiKey) {
        return res.status(400).json({
          success: false,
          error: "OCR API Key not configured",
        });
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

    // Use environment variables for API configuration
    const aiProvider = provider || process.env.AI_PROVIDER || "openrouter";
    const aiApiKey = process.env.API_KEY;
    const aiModel =
      (modelName && modelName !== 'undefined') ? modelName : (process.env.MODEL_NAME || "nvidia/nemotron-nano-9b-v2:free");

    if (!aiApiKey) {
      return res.status(400).json({
        success: false,
        error: "API Key not configured",
      });
    }

    const aiService = createAIService(aiProvider, aiApiKey, aiModel);
    const solution = await aiService.solveMath(question);

    // Save calculation to database
    const calculation = new Calculation({
      user: req.user.userId,
      question,
      solution,
      provider: aiProvider,
      modelName: aiModel,
    });

    await calculation.save();

    // Add to user's recent calculations
    const user = await User.findById(req.user.userId);
    user.addCalculation(calculation._id);
    await user.save();

    // Cleanup old calculations to maintain 1000 limit (run in background)
    cleanupOldCalculations().catch((error) => {
      console.error("Background cleanup failed:", error);
    });

    res.json({
      success: true,
      data: solution,
    });
  } catch (error) {
    console.error("Solve Route Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to solve the problem",
    });
  }
});

export default router;
