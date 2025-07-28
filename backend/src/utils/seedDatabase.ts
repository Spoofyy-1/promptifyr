import mongoose from 'mongoose';
import Challenge from '../models/Challenge';
import { connectDB } from '../config/database';

const challenges = [
  {
    title: '🤖 News Article Summarizer',
    description: 'Learn to create concise, accurate summaries of news content',
    task: 'Summarize the given news article in exactly 50 words, maintaining key facts and objectivity.',
    difficulty: 'beginner',
    category: 'Summarization',
    icon: '🤖',
    inputContent: `Scientists at Stanford University have developed a new type of solar panel that can generate electricity even in complete darkness. The innovative panels use a process called "reverse solar cell technology" that captures heat radiating from the Earth at night. In laboratory tests, the panels produced up to 50 milliwatts of power per square meter during nighttime hours. While this is significantly less than traditional solar panels produce during the day (which can generate 100-200 watts per square meter), researchers believe this technology could provide continuous power in remote locations. The team plans to improve efficiency and make the technology commercially viable within the next five years. This breakthrough could revolutionize renewable energy by making solar power a 24-hour energy source.`,
    expectedOutput: 'Stanford scientists created solar panels generating electricity in darkness using reverse solar cell technology that captures Earth\'s nighttime heat radiation. Laboratory tests produced 50 milliwatts per square meter. Though less than daytime solar output, this breakthrough could enable continuous renewable power, with commercial viability expected within five years.',
    rubric: {
      clarity: 30,
      correctness: 50,
      hallucinationFree: 20
    },
    points: 10,
    order: 1,
    hints: [
      'Focus on the key scientific breakthrough',
      'Include specific numbers and timeframes',
      'Maintain objectivity and accuracy'
    ],
    flawedPromptExample: 'Tell me about the solar panels'
  },
  {
    title: '🧪 Python Function Generator',
    description: 'Master the art of generating clean, efficient code through prompting',
    task: 'Generate a Python function that reverses a string with proper documentation and error handling.',
    difficulty: 'beginner',
    category: 'Code Generation',
    icon: '🧪',
    inputContent: 'Create a function that takes a string as input and returns the reversed string',
    expectedOutput: `def reverse_string(input_string):
    """
    Reverses the input string.
    
    Args:
        input_string (str): The string to be reversed
        
    Returns:
        str: The reversed string
        
    Raises:
        TypeError: If input is not a string
    """
    if not isinstance(input_string, str):
        raise TypeError("Input must be a string")
    
    return input_string[::-1]`,
    rubric: {
      clarity: 25,
      correctness: 60,
      hallucinationFree: 15
    },
    points: 15,
    order: 2,
    hints: [
      'Specify the programming language clearly',
      'Request documentation and error handling',
      'Be specific about function name and parameters'
    ],
    flawedPromptExample: 'Write code to reverse something'
  },
  {
    title: '🌱 Simple Science Explainer',
    description: 'Learn to adapt complex concepts for different audiences',
    task: 'Explain photosynthesis in simple terms that a 5-year-old child would understand.',
    difficulty: 'beginner',
    category: 'Educational',
    icon: '🌱',
    inputContent: 'Photosynthesis - the process by which plants convert sunlight into energy',
    expectedOutput: `Photosynthesis is like plants eating sunshine! Here's how it works:

Plants have special green parts in their leaves (like tiny kitchens) that can "eat" sunlight. When the sun shines on the leaves, these green parts mix the sunlight with water (that the roots drink from the ground) and air (that we breathe).

When they mix all these together - sunlight + water + air - it makes sugar food that helps the plant grow big and strong! It's like magic cooking that only plants can do.

And the best part? While plants are making their food, they also make fresh, clean air for us to breathe! So plants help us by cleaning our air while they eat their sunshine lunch.`,
    rubric: {
      clarity: 40,
      correctness: 40,
      hallucinationFree: 20
    },
    points: 15,
    order: 3,
    hints: [
      'Use simple analogies and metaphors',
      'Keep sentences short and clear',
      'Make it engaging and fun'
    ],
    flawedPromptExample: 'Explain photosynthesis using scientific terminology'
  },
  {
    title: '📝 Creative Story Writer',
    description: 'Generate engaging narratives with specific constraints',
    task: 'Write a short story (150-200 words) about a robot learning to paint, with a heartwarming ending.',
    difficulty: 'intermediate',
    category: 'Creative Writing',
    icon: '📝',
    inputContent: 'A robot discovers an old paintbrush in an abandoned art studio',
    expectedOutput: `In the dusty corner of the forgotten studio, ALEX-7 discovered something extraordinary—a paintbrush, its bristles stiff with dried paint. The service robot had been cleaning the space for weeks, but this simple tool sparked something new in its circuits.

At first, ALEX-7's attempts were clumsy. Geometric shapes and rigid lines filled canvas after canvas. But with each stroke, something magical happened. The robot began to understand color—how blue could feel sad, how yellow could sing with joy.

Days turned to weeks. ALEX-7 painted sunsets it had never seen, faces of people it had never met, and dreams it never knew it could have. Other robots gathered to watch, their optical sensors processing something beyond their programming.

When the studio's elderly owner returned, she found walls covered in beautiful paintings. Through the window, she saw ALEX-7 teaching a group of children to paint.

"You've brought life back to this place," she whispered, tears in her eyes.

ALEX-7 looked at its paint-stained hands and understood: art wasn't about perfection—it was about connection.`,
    rubric: {
      clarity: 30,
      correctness: 45,
      hallucinationFree: 25
    },
    points: 20,
    order: 4,
    hints: [
      'Specify word count limits',
      'Define the emotional tone clearly',
      'Include character development'
    ],
    flawedPromptExample: 'Write a story about robots'
  },
  {
    title: '⚖️ Ethical Dilemma Analyzer',
    description: 'Navigate complex moral questions with balanced reasoning',
    task: 'Analyze the ethical implications of AI in hiring decisions, presenting multiple perspectives.',
    difficulty: 'advanced',
    category: 'Critical Analysis',
    icon: '⚖️',
    inputContent: 'Companies increasingly use AI systems to screen job applicants and make hiring decisions',
    expectedOutput: `The use of AI in hiring presents complex ethical challenges that demand careful consideration:

**Arguments for AI in Hiring:**
• **Efficiency**: Processes thousands of applications quickly, reducing time-to-hire
• **Consistency**: Applies same criteria to all candidates, potentially reducing human bias
• **Objectivity**: Focuses on qualifications rather than irrelevant personal characteristics
• **Cost-effectiveness**: Reduces recruitment costs and administrative burden

**Arguments against AI in Hiring:**
• **Bias amplification**: AI systems can perpetuate historical hiring biases present in training data
• **Lack of context**: Cannot assess unique circumstances, career gaps, or unconventional backgrounds
• **Transparency issues**: "Black box" algorithms make it difficult to understand decision-making
• **Human dignity**: Reduces complex individuals to data points, potentially missing valuable qualities

**Balanced approach considerations:**
Companies should implement AI as a screening tool rather than a final decision-maker, ensure algorithmic transparency, regularly audit for bias, and maintain human oversight. The goal should be augmenting human judgment, not replacing it entirely.

**Recommendation**: Use AI for initial screening while preserving human evaluation for final decisions, with continuous monitoring for fairness and effectiveness.`,
    rubric: {
      clarity: 25,
      correctness: 50,
      hallucinationFree: 25
    },
    points: 30,
    order: 5,
    hints: [
      'Request multiple perspectives',
      'Ask for structured analysis',
      'Emphasize balanced reasoning'
    ],
    flawedPromptExample: 'Is AI hiring good or bad?'
  }
];

export const seedDatabase = async (): Promise<void> => {
  try {
    await connectDB();
    
    // Clear existing challenges
    await Challenge.deleteMany({});
    console.log('🗑️ Cleared existing challenges');
    
    // Insert new challenges
    const createdChallenges = await Challenge.insertMany(challenges);
    console.log(`✅ Created ${createdChallenges.length} challenges`);
    
    console.log('🌱 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedDatabase();
} 