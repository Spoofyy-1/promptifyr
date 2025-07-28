import express, { Request, Response, NextFunction } from 'express';
import User, { BADGES } from '../models/User';
import PromptVersion from '../models/PromptVersion';
import Challenge from '../models/Challenge';
import { protect } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = express.Router();

// @desc    Get user profile with detailed stats
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;

    const user = await User.findById(userId)
      .populate('challengesCompleted', 'title difficulty points category')
      .select('-password');

    if (!user) {
      const error: AppError = new Error('User not found');
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get leaderboard
// @route   GET /api/users/leaderboard
// @access  Private
router.get('/leaderboard', protect, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const topUsers = await User.find()
      .select('name points level badges challengesCompleted')
      .sort({ points: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      data: { leaderboard: topUsers }
    });
  } catch (error) {
    next(error);
  }
});

export default router; 