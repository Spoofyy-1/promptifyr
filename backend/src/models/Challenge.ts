import mongoose, { Document, Schema } from 'mongoose';

export interface IRubric {
  clarity: number;      // 0-100
  correctness: number;  // 0-100
  hallucinationFree: number; // 0-100
}

export interface IChallenge extends Document {
  title: string;
  description: string;
  task: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  icon: string;
  inputContent: string;
  expectedOutput: string;
  rubric: IRubric;
  points: number;
  isActive: boolean;
  order: number;
  hints: string[];
  flawedPromptExample?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ChallengeSchema = new Schema<IChallenge>({
  title: {
    type: String,
    required: [true, 'Challenge title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Challenge description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  task: {
    type: String,
    required: [true, 'Challenge task is required'],
    trim: true
  },
  difficulty: {
    type: String,
    required: [true, 'Difficulty level is required'],
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  icon: {
    type: String,
    required: [true, 'Icon is required'],
    default: '🎯'
  },
  inputContent: {
    type: String,
    required: [true, 'Input content is required']
  },
  expectedOutput: {
    type: String,
    required: [true, 'Expected output is required']
  },
  rubric: {
    clarity: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 30
    },
    correctness: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 50
    },
    hallucinationFree: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 20
    }
  },
  points: {
    type: Number,
    required: true,
    min: 1,
    default: function() {
      switch (this.difficulty) {
        case 'beginner': return 10;
        case 'intermediate': return 20;
        case 'advanced': return 30;
        default: return 10;
      }
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    required: true,
    default: 0
  },
  hints: [{
    type: String,
    trim: true
  }],
  flawedPromptExample: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for difficulty color
ChallengeSchema.virtual('difficultyColor').get(function() {
  switch (this.difficulty) {
    case 'beginner': return '#10B981';
    case 'intermediate': return '#F59E0B';
    case 'advanced': return '#EF4444';
    default: return '#6B7280';
  }
});

// Index for performance
ChallengeSchema.index({ difficulty: 1, order: 1 });
ChallengeSchema.index({ isActive: 1 });
ChallengeSchema.index({ category: 1 });

export default mongoose.model<IChallenge>('Challenge', ChallengeSchema); 