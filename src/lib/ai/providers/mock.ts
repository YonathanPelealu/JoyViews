import {
  AIProvider,
  ReviewRequest,
  ReviewResult,
} from "./base";

const MOCK_ROASTS = [
  "I've seen better code written by a mass of caffeinated monkeys.",
  "This code is like a horror movie - I'm afraid to scroll down.",
  "Did you write this with your eyes closed? Because it looks like it.",
  "This function is so long, it needs its own zip code.",
  "I'm not saying this code is bad, but even Stack Overflow would reject it.",
  "Your variable names are so cryptic, even the NSA gave up decoding them.",
  "This code has more red flags than a communist parade.",
  "I've seen spaghetti more organized than this codebase.",
];

const MOCK_VERDICTS = [
  "I sentence this code to mass refactoring.",
  "This code is guilty of crimes against readability.",
  "The only thing this code is good for is a 'what not to do' tutorial.",
  "I'm calling the code police. This is a felony.",
  "This code needs therapy, not a code review.",
];

const MOCK_ISSUES = [
  {
    type: "error" as const,
    title: "This function is committing war crimes",
    description: "I don't even know where to start. This function does 47 things and none of them well.",
    lineStart: 1,
    lineEnd: 5,
    suggestion: "Try breaking this into smaller functions. You know, like a normal person would.",
  },
  {
    type: "warning" as const,
    title: "Variable naming from the shadow realm",
    description: "What is 'x'? What is 'temp2'? Are you writing code or playing Scrabble with leftover tiles?",
    lineStart: 3,
    lineEnd: 3,
    suggestion: "Use descriptive names. 'userEmail' is better than 'e'. Revolutionary, I know.",
  },
  {
    type: "suggestion" as const,
    title: "Copy-paste detected (poorly)",
    description: "I see you've discovered Ctrl+C and Ctrl+V. Unfortunately, you forgot about functions.",
    lineStart: 10,
    lineEnd: 20,
    suggestion: "Ever heard of DRY? Don't Repeat Yourself. Google it.",
  },
  {
    type: "info" as const,
    title: "Missing error handling",
    description: "What happens when this fails? Oh right, nothing. It just crashes. Magnificent.",
    lineStart: 7,
    lineEnd: 7,
    suggestion: "Add try-catch. Your users will thank you. Your future self will thank you.",
  },
];

function getRandomItems<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const mockProvider: AIProvider = {
  name: "Mock (Development)",
  models: [
    { id: "mock-roaster", name: "Mock Roaster", description: "Fake responses for testing" },
  ],

  async review(request: ReviewRequest): Promise<ReviewResult> {
    // Simulate API delay
    await delay(1500 + Math.random() * 1000);

    const score = Math.floor(Math.random() * 60) + 20; // 20-80
    const numIssues = Math.min(request.code.split('\n').length, 4);

    return {
      summary: `Oh boy, where do I even begin? This ${request.language || 'code'} looks like it was written during a earthquake while blindfolded. I've seen better structure in a bowl of alphabet soup. But hey, at least it... exists? That's about the nicest thing I can say.`,
      issues: getRandomItems(MOCK_ISSUES, numIssues),
      roasts: getRandomItems(MOCK_ROASTS, 4),
      improvements: [
        "Maybe try using a linter? It's like spell-check but for your code crimes.",
        "Consider adding comments. Future you will hate present you otherwise.",
        "Have you considered reading the documentation? Revolutionary concept, I know.",
        "Perhaps run your code before committing? Just a thought.",
      ],
      positives: score > 50
        ? ["At least the syntax is valid. The bar was on the floor and you barely cleared it."]
        : ["Well... the file extension is correct. That's something."],
      score,
      verdict: getRandomItems(MOCK_VERDICTS, 1)[0],
      provider: "mock",
      model: "mock-roaster",
    };
  },
};
