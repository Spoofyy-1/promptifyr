import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload as JsonWebTokenPayload } from 'jsonwebtoken';
import User, { IUser } from '../models/User';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

interface JwtPayload extends JsonWebTokenPayload {
  id: string;
}

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token: string | undefined;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Access token is required'
      });
      return;
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

      // Get user from database
      const currentUser = await User.findById(decoded.id);

      if (!currentUser) {
        res.status(401).json({
          success: false,
          error: 'User no longer exists'
        });
        return;
      }

      // Update last active timestamp
      currentUser.lastActive = new Date();
      await currentUser.save();

      // Grant access to protected route
      req.user = currentUser;
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
      return;
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Authentication error'
    });
  }
};

// Generate JWT token
export const signToken = (id: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  
  const payload = { id };
  const options = { expiresIn: process.env.JWT_EXPIRES_IN || '7d' };
  
  return jwt.sign(payload, secret, options);
};

// Create and send token response
export const createSendToken = (user: IUser, statusCode: number, res: Response): void => {
  const token = signToken(String(user._id));

  // Remove password from output
  const userResponse = user.toObject();
  delete userResponse.password;

  res.status(statusCode).json({
    success: true,
    token,
    data: {
      user: userResponse
    }
  });
}; 