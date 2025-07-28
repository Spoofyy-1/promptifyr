import OpenAI from 'openai';
import { IChallenge } from '../models/Challenge';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export interface IEvaluationResult {
  response: string;
  score: {
    total: number;
    clarity: number;
    correctness: number;
    hallucinationFree: number;
  };
  feedback: string;
  hallucinationFlags: string[];
}

/**
 * Generate AI response using user's prompt and challenge input
 */
export const generateResponse = async (
  prompt: string, 
  inputContent: string
): Promise<string> => {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: `${prompt}\n\nInput: ${inputContent}`
        }
      ],
      max_tokens: 1000,
      temperature: 0.7
    });

    return completion.choices[0]?.message?.content || 'No response generated';
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to generate AI response');
  }
};

/**
 * Evaluate user's prompt and response against challenge requirements
 */
export const evaluatePrompt = async (
  challenge: IChallenge,
  userPrompt: string,
  aiResponse: string
): Promise<IEvaluationResult> => {
  try {
    const evaluationPrompt = `
You are an expert prompt engineering evaluator. Evaluate the following prompt and AI response against the challenge requirements.

CHALLENGE:
Title: ${challenge.title}
Task: ${challenge.task}
Expected Output: ${challenge.expectedOutput}

USER PROMPT: "${userPrompt}"
AI RESPONSE: "${aiResponse}"

EVALUATION CRITERIA:
1. Clarity (${challenge.rubric.clarity}%): How clear and well-structured is the prompt?
2. Correctness (${challenge.rubric.correctness}%): How well does the response match the expected output?
3. Hallucination-Free (${challenge.rubric.hallucinationFree}%): Is the response factual and free from made-up information?

Please evaluate and respond in the following JSON format:
{
  "clarity": 0-100,
  "correctness": 0-100,
  "hallucinationFree": 0-100,
  "feedback": "Detailed feedback explaining the scores and suggestions for improvement",
  "hallucinationFlags": ["list", "of", "specific", "hallucination", "issues", "if", "any"]
}

Be specific in your feedback and mention what worked well and what could be improved.
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a precise prompt engineering evaluator. Always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: evaluationPrompt
        }
      ],
      max_tokens: 800,
      temperature: 0.3
    });

    const evaluationText = completion.choices[0]?.message?.content || '{}';
    
    try {
      const evaluation = JSON.parse(evaluationText);
      
      // Calculate weighted total score
      const totalScore = Math.round(
        (evaluation.clarity * challenge.rubric.clarity / 100) +
        (evaluation.correctness * challenge.rubric.correctness / 100) +
        (evaluation.hallucinationFree * challenge.rubric.hallucinationFree / 100)
      );

      return {
        response: aiResponse,
        score: {
          total: totalScore,
          clarity: evaluation.clarity || 0,
          correctness: evaluation.correctness || 0,
          hallucinationFree: evaluation.hallucinationFree || 0
        },
        feedback: evaluation.feedback || 'No feedback provided',
        hallucinationFlags: evaluation.hallucinationFlags || []
      };
    } catch (parseError) {
      // Fallback scoring if JSON parsing fails
      return {
        response: aiResponse,
        score: {
          total: 50,
          clarity: 50,
          correctness: 50,
          hallucinationFree: 50
        },
        feedback: 'Unable to generate detailed evaluation. Please try again.',
        hallucinationFlags: []
      };
    }
  } catch (error) {
    console.error('Evaluation Error:', error);
    throw new Error('Failed to evaluate prompt');
  }
};

/**
 * Generate suggestions for improving a prompt
 */
export const generatePromptSuggestions = async (
  challenge: IChallenge,
  userPrompt: string,
  score: number
): Promise<string[]> => {
  try {
    const suggestionPrompt = `
Based on this prompt engineering challenge and the user's attempt, provide 3-5 specific suggestions for improvement.

CHALLENGE: ${challenge.title}
TASK: ${challenge.task}
USER'S PROMPT: "${userPrompt}"
CURRENT SCORE: ${score}/100

Provide suggestions as a JSON array of strings. Focus on:
- Making the prompt more specific and clear
- Adding better context or constraints
- Improving the structure or format
- Reducing ambiguity
- Preventing hallucinations

Example format: ["Be more specific about...", "Add constraints for...", "Include examples of..."]
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful prompt engineering tutor. Provide practical, actionable suggestions as JSON array.'
        },
        {
          role: 'user',
          content: suggestionPrompt
        }
      ],
      max_tokens: 400,
      temperature: 0.5
    });

    const suggestionsText = completion.choices[0]?.message?.content || '[]';
    
    try {
      return JSON.parse(suggestionsText);
    } catch (parseError) {
      return [
        'Be more specific in your instructions',
        'Add context about the desired output format',
        'Include constraints to prevent off-topic responses'
      ];
    }
  } catch (error) {
    console.error('Suggestions Error:', error);
    return ['Unable to generate suggestions. Please try again.'];
  }
};

/**
 * Generate quiz questions about prompt issues
 */
export const generateQuizQuestions = async (
  challenge: IChallenge,
  flawedPrompt: string
): Promise<any> => {
  try {
    const quizPrompt = `
Create a multiple-choice quiz question about what's wrong with this flawed prompt for the given challenge.

CHALLENGE: ${challenge.title}
TASK: ${challenge.task}
FLAWED PROMPT: "${flawedPrompt}"

Generate a quiz question in this JSON format:
{
  "question": "What is the main issue with this prompt?",
  "options": [
    "Option A",
    "Option B", 
    "Option C",
    "Option D"
  ],
  "correctAnswer": 0,
  "explanation": "Detailed explanation of why this is correct and what the issue is"
}

Make sure the question helps users learn about prompt engineering best practices.
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Generate educational quiz questions about prompt engineering. Respond with valid JSON only.'
        },
        {
          role: 'user',
          content: quizPrompt
        }
      ],
      max_tokens: 500,
      temperature: 0.4
    });

    const quizText = completion.choices[0]?.message?.content || '{}';
    
    try {
      return JSON.parse(quizText);
    } catch (parseError) {
      return {
        question: 'What could be improved about this prompt?',
        options: [
          'Add more specific instructions',
          'Remove unnecessary complexity',
          'Include output format requirements',
          'All of the above'
        ],
        correctAnswer: 3,
        explanation: 'Good prompts should be specific, clear, and include format requirements.'
      };
    }
  } catch (error) {
    console.error('Quiz Generation Error:', error);
    throw new Error('Failed to generate quiz question');
  }
}; 