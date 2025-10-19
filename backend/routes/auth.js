import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Calculation from '../models/Calculation.js';

const router = express.Router();

// Middleware to verify JWT token
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access token required'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }
    req.user = user;
    next();
  });
};

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, and name are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    // Create new user
    const user = new User({
      email: email.toLowerCase(),
      password,
      name
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name
        },
        token
      }
    });

  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create account'
    });
  }
});

// Signin route
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name
        },
        token
      }
    });

  } catch (error) {
    console.error('Signin Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to sign in'
    });
  }
});

// Get user profile with recent calculations
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate({
        path: 'calculations',
        options: { sort: { createdAt: -1 } }
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          calculations: user.calculations
        }
      }
    });

  } catch (error) {
    console.error('Profile Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get profile'
    });
  }
});

// Get user calculation history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate({
        path: 'calculations',
        options: { sort: { createdAt: -1 } }
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        calculations: user.calculations.map(calc => ({
          id: calc._id,
          question: calc.question,
          createdAt: calc.createdAt,
          provider: calc.provider,
          modelName: calc.modelName
        }))
      }
    });

  } catch (error) {
    console.error('History Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get calculation history'
    });
  }
});

export default router;