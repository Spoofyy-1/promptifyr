import mongoose, { Document, Schema } from 'mongoose';

export interface IPromptVersion extends Document {
  userId: mongoose.Types.ObjectId;
  challengeId: mongoose.Types.ObjectId;
  promptText: string;
  version: number;
  response: string;
  score: {
    total: number;
    clarity: number;
    correctness: number;
    hallucinationFree: number;
  };
  feedback: string;
  hallucinationFlags: string[];
  isSubmitted: boolean;
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PromptVersionSchema = new Schema<IPromptVersion>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  challengeId: {
    type: Schema.Types.ObjectId,
    ref: 'Challenge',
    required: [true, 'Challenge ID is required']
  },
  promptText: {
    type: String,
    required: [true, 'Prompt text is required'],
    trim: true,
    maxlength: [5000, 'Prompt cannot exceed 5000 characters']
  },
  version: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  response: {
    type: String,
    required: [true, 'AI response is required']
  },
  score: {
    total: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    clarity: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    correctness: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    hallucinationFree: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },
  feedback: {
    type: String,
    trim: true
  },
  hallucinationFlags: [{
    type: String,
    trim: true
  }],
  isSubmitted: {
    type: Boolean,
    default: false
  },
  submittedAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for grade letter
PromptVersionSchema.virtual('gradeLetter').get(function() {
  const score = this.score.total;
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
});

// Virtual for performance level
PromptVersionSchema.virtual('performanceLevel').get(function() {
  const score = this.score.total;
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Good';
  if (score >= 70) return 'Fair';
  if (score >= 60) return 'Poor';
  return 'Needs Improvement';
});

// Pre-save middleware to set submitted timestamp
PromptVersionSchema.pre('save', function(next) {
  if (this.isSubmitted && !this.submittedAt) {
    this.submittedAt = new Date();
  }
  next();
});

// Compound index for efficient queries
PromptVersionSchema.index({ userId: 1, challengeId: 1, version: -1 });
PromptVersionSchema.index({ userId: 1, isSubmitted: 1 });
PromptVersionSchema.index({ challengeId: 1, 'score.total': -1 });

export default mongoose.model<IPromptVersion>('PromptVersion', PromptVersionSchema); 