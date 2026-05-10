const API = "https://wellness-answers.vercel.app/api/admin/generate";
const KEY = "d1ac51ca809f6854bde89c6d78bd064e42f86d302255d10cf3a3b4a30e88520b";

const ARTICLES = [
  // Nutrition
  { topic: "Understanding macronutrients — a simple guide to proteins fats and carbs", category: "nutrition", keywords: ["macronutrients", "protein", "carbs", "healthy fats"] },
  { topic: "How to read food labels — what to look for and what to ignore", category: "nutrition", keywords: ["food labels", "nutrition facts", "healthy shopping"] },
  { topic: "7 nutrient-dense foods to consider adding to your diet", category: "nutrition", keywords: ["nutrient dense foods", "superfoods", "healthy eating"] },

  // Menopause
  { topic: "What to expect during perimenopause — a practical overview", category: "menopause", keywords: ["perimenopause", "menopause symptoms", "hormonal changes"] },
  { topic: "Lifestyle changes that may support well-being during menopause", category: "menopause", keywords: ["menopause lifestyle", "menopause diet", "menopause exercise"] },
  { topic: "How exercise is associated with managing menopause symptoms", category: "menopause", keywords: ["menopause exercise", "hot flashes", "menopause fitness"] },

  // Stress
  { topic: "5 breathing techniques that may help reduce everyday stress", category: "stress", keywords: ["breathing techniques", "stress relief", "relaxation"] },
  { topic: "How journaling is associated with better stress management", category: "stress", keywords: ["journaling", "stress management", "mental health journaling"] },
  { topic: "Simple workplace habits that may help lower daily stress levels", category: "stress", keywords: ["workplace stress", "work life balance", "office wellness"] },

  // Healthy Ageing
  { topic: "Lifestyle factors research suggests may support healthy ageing", category: "healthy-ageing", keywords: ["healthy ageing", "longevity", "ageing well"] },
  { topic: "Why staying socially active is associated with better ageing outcomes", category: "healthy-ageing", keywords: ["social connection", "ageing", "loneliness prevention"] },
  { topic: "Simple balance and mobility exercises for adults over 50", category: "healthy-ageing", keywords: ["balance exercises", "over 50 fitness", "fall prevention"] },

  // Habits
  { topic: "The science of habit formation — how long it really takes to build a habit", category: "habits", keywords: ["habit formation", "building habits", "21 days myth"] },
  { topic: "5 morning habits that may set you up for a better day", category: "habits", keywords: ["morning routine", "morning habits", "daily routine"] },
  { topic: "How to break a bad habit — practical strategies that research supports", category: "habits", keywords: ["break bad habits", "habit change", "behaviour change"] },

  // Family Wellness
  { topic: "Simple ways to encourage healthy eating habits in children", category: "family-wellness", keywords: ["kids nutrition", "healthy eating children", "family meals"] },
  { topic: "How family meals are associated with better child well-being", category: "family-wellness", keywords: ["family dinner", "eating together", "child health"] },
  { topic: "Screen time guidelines for children — what the research suggests", category: "family-wellness", keywords: ["screen time kids", "children technology", "digital wellness"] },

  // Mental Wellness
  { topic: "5 daily self-care practices that may support emotional well-being", category: "mental-wellness", keywords: ["self care", "emotional well-being", "mental health tips"] },
  { topic: "How regular exercise is associated with better mental health", category: "mental-wellness", keywords: ["exercise mental health", "mood exercise", "anxiety exercise"] },
  { topic: "Understanding burnout — signs causes and what may help", category: "mental-wellness", keywords: ["burnout", "burnout recovery", "work exhaustion"] },

  // Productivity
  { topic: "Time blocking — a simple method that may boost your focus and output", category: "productivity", keywords: ["time blocking", "focus", "time management"] },
  { topic: "Why multitasking is associated with lower productivity and what to do instead", category: "productivity", keywords: ["multitasking", "single tasking", "focus techniques"] },
  { topic: "5 simple organisation tools and methods that may help you stay on track", category: "productivity", keywords: ["organisation tools", "productivity apps", "getting things done"] },

  // Health Calculators
  { topic: "Understanding BMI — what it measures its limitations and when to use it", category: "health-calculators", keywords: ["BMI calculator", "body mass index", "healthy weight"] },
  { topic: "How much water should you drink daily — a practical hydration guide", category: "health-calculators", keywords: ["daily water intake", "hydration", "water calculator"] },
  { topic: "How much sleep do you really need — age-based recommendations from research", category: "health-calculators", keywords: ["sleep calculator", "hours of sleep", "sleep recommendations"] },
];

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generate(article: typeof ARTICLES[0], index: number): Promise<string> {
  const label = `[${index + 1}/${ARTICLES.length}] ${article.category}`;
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": KEY },
      body: JSON.stringify(article),
    });
    const data = await res.json();
    if (data.title) return `OK  ${label}: ${data.title}`;
    return `ERR ${label}: ${data.error || JSON.stringify(data)}`;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return `ERR ${label}: ${msg}`;
  }
}

async function main() {
  console.log(`Generating ${ARTICLES.length} remaining articles...\n`);

  // Run one at a time with 5s delay to avoid rate limits
  for (let i = 0; i < ARTICLES.length; i++) {
    const result = await generate(ARTICLES[i], i);
    console.log(result);
    if (i < ARTICLES.length - 1) await sleep(5000);
  }

  console.log("\nDone!");
}

main();
