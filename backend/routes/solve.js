import express from 'express';
import { createAIService } from '../services/aiService.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { question, provider, modelName } = req.body;

    if (!question || question.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Question is required'
      });
    }

    // Use environment variables for API configuration
    const aiProvider = provider || process.env.AI_PROVIDER || 'openrouter';
    const aiApiKey = process.env.API_KEY;
    const aiModel = modelName || process.env.MODEL_NAME || 'nvidia/nemotron-nano-9b-v2:free';

    if (!aiApiKey) {
      return res.status(400).json({
        success: false,
        error: 'API Key not configured'
      });
    }

    const aiService = createAIService(aiProvider, aiApiKey, aiModel);
    const solution = await aiService.solveMath(question);

    res.json({
      success: true,
      data: solution
    });

  } catch (error) {
    console.error('Solve Route Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to solve the problem'
    });
  }
});

export default router;