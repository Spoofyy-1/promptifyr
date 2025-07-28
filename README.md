# 🚀 Promptifyr

**Level‑up your prompting skills**

An engaging, gamified web platform that helps users learn prompt engineering through real-world challenges, feedback, and progress tracking.

## 🎯 Features

- **Interactive Prompt Challenges**: Graded challenges from beginner to advanced
- **Real-time Feedback**: AI-powered evaluation with detailed scoring
- **Gamification**: Points, badges, levels, and leaderboards
- **Version Control**: Track prompt iterations and improvements
- **Hallucination Detection**: Learn to identify and fix problematic prompts
- **Progress Tracking**: Comprehensive dashboard with analytics

## 🏗️ Tech Stack

- **Frontend**: React 18 + Material-UI + TypeScript
- **Backend**: Node.js + Express + TypeScript
- **Database**: MongoDB with Mongoose
- **AI Integration**: OpenAI GPT-4 API
- **Authentication**: JWT-based email authentication
- **Deployment**: Vercel (Frontend) + Railway (Backend)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- OpenAI API key

### Step 1: Clone and Setup

```bash
git clone <your-repo-url>
cd promptifyr
```

### Step 2: Backend Setup

```bash
cd backend
npm install
```

Create environment file:
```bash
cp env.example .env
```

Edit `.env` with your values:
```bash
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/promptifyr
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
OPENAI_API_KEY=your-openai-api-key-here
CORS_ORIGIN=http://localhost:3000
```

Seed the database:
```bash
npm run seed
```

Start the backend:
```bash
npm run dev
```

### Step 3: Frontend Setup

```bash
cd frontend
npm install --legacy-peer-deps
```

Create environment file:
```bash
cp env.local.example .env.local
```

Edit `.env.local`:
```bash
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_APP_NAME=Promptifyr
REACT_APP_VERSION=1.0.0
```

Start the frontend:
```bash
npm start
```

### Step 4: Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: mongodb://localhost:27017/promptifyr

## 🎮 Using Promptifyr

### Getting Started
1. **Register**: Create an account on the landing page
2. **Dashboard**: View your progress and recent challenges
3. **Challenges**: Browse and attempt prompt engineering challenges
4. **Learn**: Get real-time AI feedback on your prompts
5. **Progress**: Earn points, badges, and level up!

### Starter Challenges

1. **🤖 News Article Summarizer**: Learn to create concise, accurate summaries
2. **🧪 Python Function Generator**: Master code generation through prompting
3. **🌱 Simple Science Explainer**: Practice adapting content for different audiences
4. **📝 Creative Story Writer**: Generate engaging narratives with constraints
5. **⚖️ Ethical Dilemma Analyzer**: Navigate complex topics with balanced reasoning

### Gamification System

#### Badges
- **Prompt Novice**: Complete first challenge
- **Prompt Adept**: Complete 5 challenges with 80%+ score
- **Promptifyr Pro**: Complete 10 challenges with 90%+ score
- **Hallucination Hunter**: Identify 5 problematic prompts
- **Version Master**: Create 10 prompt iterations
- **Consistency Champion**: Complete challenges 5 days in a row

#### Levels
- **Level 1**: 0-100 points
- **Level 2**: 101-300 points
- **Level 3**: 301-600 points
- **Level 4**: 601-1000 points
- **Level 5**: 1001+ points

## 📁 Project Structure

```
promptifyr/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   │   ├── User.ts           # User model with gamification
│   │   │   ├── Challenge.ts      # Challenge model with rubrics
│   │   │   └── PromptVersion.ts  # Version control for prompts
│   │   ├── routes/
│   │   │   ├── auth.ts          # Authentication routes
│   │   │   ├── challenges.ts    # Challenge management
│   │   ├── middleware/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── utils/
│   │   └── types/
│   ├── package.json
│   └── .env.local.example
└── README.md
```

## 🚢 Deployment

### Backend (Railway)
1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push to main

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set build command: `cd frontend && npm run build`
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push to main

## 🎨 Color Palette

- **Primary**: #6366F1 (Indigo)
- **Secondary**: #EC4899 (Pink)
- **Success**: #10B981 (Emerald)
- **Warning**: #F59E0B (Amber)
- **Error**: #EF4444 (Red)
- **Background**: #F8FAFC (Slate)
- **Surface**: #FFFFFF (White)

## 📝 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Challenges
- `GET /api/challenges` - Get all challenges
- `GET /api/challenges/:id` - Get specific challenge
- `POST /api/challenges/:id/submit` - Submit prompt for evaluation

### User Progress
- `GET /api/users/profile` - Get user profile
- `GET /api/users/progress` - Get user progress
- `GET /api/users/leaderboard` - Get leaderboard

### Prompt Versions
- `GET /api/prompts/:challengeId`