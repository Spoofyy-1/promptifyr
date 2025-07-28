import express, { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import Challenge from '../models/Challenge';
import PromptVersion from '../models/PromptVersion';
import User from '../models/User';
import { protect } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { generateResponse, evaluatePrompt, generatePromptSuggestions, generateQuizQuestions } from '../services/openai';
import mongoose from 'mongoose';

const router = express.Router();

// @desc    Get all challenges
// @route   GET /api/challenges
// @access  Public
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { difficulty, category } = req.query;
    const filter: any = { isActive: true };

    if (difficulty) filter.difficulty = difficulty;
    if (category) filter.category = category;

    const challenges = await Challenge.find(filter)
      .sort({ difficulty: 1, order: 1 })
      .select('-flawedPromptExample'); // Don't expose flawed examples in list

    res.status(200).json({
      success: true,
      count: challenges.length,
      data: {
        challenges
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get single challenge
// @route   GET /api/challenges/:id
// @access  Public
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      const error: AppError = new Error('Challenge not found');
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      data: {
        challenge
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Submit prompt for challenge
// @route   POST /api/challenges/:id/submit
// @access  Private
router.post('/:id/submit', protect, [
  body('prompt')
    .trim()
    .notEmpty()
    .withMessage('Prompt is required')
    .isLength({ min: 10, max: 5000 })
    .withMessage('Prompt must be between 10 and 5000 characters')
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error: AppError = new Error('Validation failed');
      error.statusCode = 400;
      return next(error);
    }

    const { prompt } = req.body;
    const challengeId = req.params.id;
    const userId = req.user?._id;

    if (!userId) {
      const error: AppError = new Error('User not found');
      error.statusCode = 401;
      return next(error);
    }

    // Get challenge
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      const error: AppError = new Error('Challenge not found');
      error.statusCode = 404;
      return next(error);
    }

    // Generate AI response using user's prompt
    const aiResponse = await generateResponse(prompt, challenge.inputContent);

    // Get next version number for this user and challenge
    const lastVersion = await PromptVersion.findOne({ 
      userId, 
      challengeId 
    }).sort({ version: -1 });

    const version = lastVersion ? lastVersion.version + 1 : 1;

    // Evaluate the prompt and response
    const evaluation = await evaluatePrompt(challenge, prompt, aiResponse);

    // Create new prompt version
    const promptVersion = await PromptVersion.create({
      userId,
      challengeId,
      promptText: prompt,
      version,
      response: evaluation.response,
      score: evaluation.score,
      feedback: evaluation.feedback,
      hallucinationFlags: evaluation.hallucinationFlags,
      isSubmitted: true
    });

    // Check if this is the user's first completion of this challenge
    const previousSubmissions = await PromptVersion.findOne({
      userId,
      challengeId,
      isSubmitted: true,
      _id: { $ne: promptVersion._id }
    });

    // Update user progress if this is their first successful submission
    if (!previousSubmissions && evaluation.score.total >= 60) {
      const user = await User.findById(userId);
      if (user) {
        // Add challenge to completed challenges if not already there
        const challengeObjectId = new mongoose.Types.ObjectId(challengeId);
        if (!user.challengesCompleted.includes(challengeObjectId)) {
          user.challengesCompleted.push(challengeObjectId);
          user.points += challenge.points;

          // Award badges based on progress
          await checkAndAwardBadges(user);
          await user.save();
        }
      }
    }

    // Generate suggestions if score is below 80
    let suggestions: string[] = [];
    if (evaluation.score.total < 80) {
      suggestions = await generatePromptSuggestions(challenge, prompt, evaluation.score.total);
    }

    res.status(201).json({
      success: true,
      data: {
        promptVersion,
        suggestions
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get user's prompt versions for a challenge
// @route   GET /api/challenges/:id/versions
// @access  Private
router.get('/:id/versions', protect, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const challengeId = req.params.id;
    const userId = req.user?._id;

    const versions = await PromptVersion.find({
      userId,
      challengeId
    }).sort({ version: -1 });

    res.status(200).json({
      success: true,
      count: versions.length,
      data: {
        versions
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get hallucination simulator quiz
// @route   GET /api/challenges/:id/quiz
// @access  Private
router.get('/:id/quiz', protect, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge || !challenge.flawedPromptExample) {
      const error: AppError = new Error('Quiz not available for this challenge');
      error.statusCode = 404;
      return next(error);
    }

    const quiz = await generateQuizQuestions(challenge, challenge.flawedPromptExample);

    res.status(200).json({
      success: true,
      data: {
        quiz,
        flawedPrompt: challenge.flawedPromptExample
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Test prompt without submitting
// @route   POST /api/challenges/:id/test
// @access  Private
router.post('/:id/test', protect, [
  body('prompt')
    .trim()
    .notEmpty()
    .withMessage('Prompt is required')
    .isLength({ min: 10, max: 5000 })
    .withMessage('Prompt must be between 10 and 5000 characters')
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error: AppError = new Error('Validation failed');
      error.statusCode = 400;
      return next(error);
    }

    const { prompt } = req.body;
    const challengeId = req.params.id;
    const userId = req.user?._id;

    // Get challenge
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      const error: AppError = new Error('Challenge not found');
      error.statusCode = 404;
      return next(error);
    }

    // Generate AI response using user's prompt
    const aiResponse = await generateResponse(prompt, challenge.inputContent);

    // Get next version number for this user and challenge
    const lastVersion = await PromptVersion.findOne({ 
      userId, 
      challengeId 
    }).sort({ version: -1 });

    const version = lastVersion ? lastVersion.version + 1 : 1;

    // Save as draft (not submitted)
    const promptVersion = await PromptVersion.create({
      userId,
      challengeId,
      promptText: prompt,
      version,
      response: aiResponse,
      isSubmitted: false
    });

    res.status(200).json({
      success: true,
      data: {
        response: aiResponse,
        version: promptVersion.version
      }
    });
  } catch (error) {
    next(error);
  }
});

// Helper function to check and award badges
async function checkAndAwardBadges(user: any) {
  const completedCount = user.challengesCompleted.length;
  
  // Prompt Novice - Complete first challenge
  if (completedCount >= 1 && !user.badges.includes('prompt_novice')) {
    user.badges.push('prompt_novice');
    user.points += 10;
  }

  // Get user's high-scoring submissions for badge criteria
  const highScoreSubmissions = await PromptVersion.find({
    userId: user._id,
    isSubmitted: true,
    'score.total': { $gte: 80 }
  });

  const excellentSubmissions = await PromptVersion.find({
    userId: user._id,
    isSubmitted: true,
    'score.total': { $gte: 90 }
  });

  // Prompt Adept - 5 challenges with 80%+ score
  if (highScoreSubmissions.length >= 5 && !user.badges.includes('prompt_adept')) {
    user.badges.push('prompt_adept');
    user.points += 50;
  }

  // Promptifyr Pro - 10 challenges with 90%+ score
  if (excellentSubmissions.length >= 10 && !user.badges.includes('promptifyr_pro')) {
    user.badges.push('promptifyr_pro');
    user.points += 100;
  }

  // Version Master - Create 10 prompt iterations
  const totalVersions = await PromptVersion.countDocuments({ userId: user._id });
  if (totalVersions >= 10 && !user.badges.includes('version_master')) {
    user.badges.push('version_master');
    user.points += 25;
  }
}

export default router; 