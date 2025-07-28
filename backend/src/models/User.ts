import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  avatar?: string;
  level: number;
  points: number;
  badges: string[];
  challengesCompleted: mongoose.Types.ObjectId[];
  joinedAt: Date;
  lastActive: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
  points: number;
}

// Define available badges
export const BADGES: IBadge[] = [
  {
    id: 'prompt_novice',
    name: 'Prompt Novice',
    description: 'Complete your first challenge',
    icon: '🌱',
    requirement: 'Complete 1 challenge',
    points: 10
  },
  {
    id: 'prompt_adept',
    name: 'Prompt Adept',
    description: 'Complete 5 challenges with 80%+ score',
    icon: '⚡',
    requirement: 'Complete 5 challenges with 80%+ score',
    points: 50
  },
  {
    id: 'promptifyr_pro',
    name: 'Promptifyr Pro',
    description: 'Complete 10 challenges with 90%+ score',
    icon: '🏆',
    requirement: 'Complete 10 challenges with 90%+ score',
    points: 100
  },
  {
    id: 'hallucination_hunter',
    name: 'Hallucination Hunter',
    description: 'Identify 5 problematic prompts',
    icon: '🔍',
    requirement: 'Identify 5 hallucination issues',
    points: 30
  },
  {
    id: 'version_master',
    name: 'Version Master',
    description: 'Create 10 prompt iterations',
    icon: '🔄',
    requirement: 'Create 10 prompt versions',
    points: 25
  },
  {
    id: 'consistency_champion',
    name: 'Consistency Champion',
    description: 'Complete challenges 5 days in a row',
    icon: '📅',
    requirement: 'Daily streak of 5 days',
    points: 40
  }
];

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  avatar: {
    type: String,
    default: null
  },
  level: {
    type: Number,
    default: 1,
    min: 1,
    max: 100
  },
  points: {
    type: Number,
    default: 0,
    min: 0
  },
  badges: [{
    type: String,
    enum: BADGES.map(badge => badge.id)
  }],
  challengesCompleted: [{
    type: Schema.Types.ObjectId,
    ref: 'Challenge'
  }],
  joinedAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for user's current level based on points
UserSchema.virtual('currentLevel').get(function() {
  if (this.points < 101) return 1;
  if (this.points < 301) return 2;
  if (this.points < 601) return 3;
  if (this.points < 1001) return 4;
  return 5;
});

// Virtual for points needed for next level
UserSchema.virtual('pointsToNextLevel').get(function(this: any) {
  const currentLevel = this.level || 1;
  const levelThresholds = [0, 101, 301, 601, 1001];
  
  if (currentLevel >= 5) return 0;
  return Math.max(0, levelThresholds[currentLevel] - (this.points || 0));
});

// Pre-save middleware to hash password
UserSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Update last active timestamp on login
UserSchema.methods.updateLastActive = function() {
  this.lastActive = new Date();
  return this.save();
};

// Method to award badge
UserSchema.methods.awardBadge = function(badgeId: string) {
  if (!this.badges.includes(badgeId)) {
    this.badges.push(badgeId);
    const badge = BADGES.find(b => b.id === badgeId);
    if (badge) {
      this.points += badge.points;
    }
  }
  return this.save();
};

// Index for performance
UserSchema.index({ email: 1 });
UserSchema.index({ points: -1 }); // For leaderboard
UserSchema.index({ lastActive: -1 });

export default mongoose.model<IUser>('User', UserSchema); 