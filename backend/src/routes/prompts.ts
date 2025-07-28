import express, { Request, Response, NextFunction } from 'express';
import PromptVersion from '../models/PromptVersion';
import { protect } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = express.Router();

// @desc    Get user's prompt versions for a challenge
// @route   GET /api/prompts/:challengeId
// @access  Private
router.get('/:challengeId', protect, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { challengeId } = req.params;
    const userId = req.user?._id;

    const versions = await PromptVersion.find({
      userId,
      challengeId
    })
      .populate('challengeId', 'title icon')
      .sort({ version: -1 });

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

// @desc    Get specific prompt version
// @route   GET /api/prompts/:challengeId/:version
// @access  Private
router.get('/:challengeId/:version', protect, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { challengeId, version } = req.params;
    const userId = req.user?._id;

    if (!version) {
      const error: AppError = new Error('Version parameter is required');
      error.statusCode = 400;
      return next(error);
    }

    const promptVersion = await PromptVersion.findOne({
      userId,
      challengeId,
      version: parseInt(version)
    }).populate('challengeId', 'title icon expectedOutput');

    if (!promptVersion) {
      const error: AppError = new Error('Prompt version not found');
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      data: {
        promptVersion
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router; 