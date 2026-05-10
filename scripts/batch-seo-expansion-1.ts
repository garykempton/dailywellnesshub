/**
 * SEO Expansion Batch 1 — Monetisation-focused evergreen content
 *
 * Targets: long-tail keywords, affiliate opportunities, low-medium competition.
 * Categories: sleep, fitness, healthy-ageing, stress, menopause, habits
 *
 * Usage: npx tsx scripts/batch-seo-expansion-1.ts
 *        npx tsx scripts/batch-seo-expansion-1.ts --offset=20 --limit=10
 */

import "dotenv/config";
import { prisma } from "../src/lib/db";
import {
  buildSystemPrompt,
  buildUserPrompt,
  parseAiResponse,
  validateArticle,
  buildArticleMetadata,
  injectInternalLinks,
  findRelatedArticles,
  estimateQualityScore,
} from "../src/lib/content-pipeline";
import type { ArticlePromptInput, ExistingArticle } from "../src/lib/content-pipeline";

const AI_MODEL = "claude-sonnet-4-6";
const DELAY_MS = 10000;

interface TopicInput {
  topic: string;
  category: string;
  keywords: string[];
  relatedTools: string[];
  relatedArticles: string[];
}

// ═══════════════════════════════════════════════════════════════════════
// TOPIC DEFINITIONS — 50 articles across 15 focus niches
// ═══════════════════════════════════════════════════════════════════════

const TOPICS: TopicInput[] = [
  // ─── SLEEP (6 articles) ───────────────────────────────────────────
  {
    topic: "Best Magnesium for Sleep: Types, Dosages, and What Research Suggests",
    category: "sleep",
    keywords: ["best magnesium for sleep", "magnesium glycinate sleep", "magnesium supplements sleep", "magnesium dosage sleep", "magnesium before bed"],
    relatedTools: ["sleep-calculator"],
    relatedArticles: ["natural-approaches-fall-asleep-faster", "bedtime-routine-improve-sleep-quality", "how-much-deep-sleep-do-you-need"],
  },
  {
    topic: "Sleep Supplements That May Help: A Research-Based Guide to Melatonin, Glycine, and L-Theanine",
    category: "sleep",
    keywords: ["sleep supplements", "melatonin alternatives", "glycine for sleep", "l-theanine sleep", "natural sleep aids that work"],
    relatedTools: ["sleep-calculator"],
    relatedArticles: ["natural-approaches-fall-asleep-faster", "caffeine-and-sleep-how-long-before-bed", "how-much-deep-sleep-do-you-need"],
  },
  {
    topic: "Best White Noise Machines for Sleep: What to Look for and How They May Help",
    category: "sleep",
    keywords: ["best white noise machine", "white noise for sleep", "sound machine sleep", "pink noise vs white noise", "noise machine for adults"],
    relatedTools: ["sleep-calculator"],
    relatedArticles: ["sleep-hygiene-checklist-printable", "bedtime-routine-improve-sleep-quality", "natural-approaches-fall-asleep-faster"],
  },
  {
    topic: "Weighted Blankets for Sleep and Anxiety: Do They Work and How to Choose One",
    category: "sleep",
    keywords: ["weighted blanket for sleep", "weighted blanket anxiety", "best weighted blanket", "do weighted blankets work", "weighted blanket benefits"],
    relatedTools: ["sleep-calculator"],
    relatedArticles: ["natural-approaches-fall-asleep-faster", "bedtime-routine-improve-sleep-quality", "sleep-hygiene-checklist-printable"],
  },
  {
    topic: "How to Create the Perfect Sleep Environment: Temperature, Light, and Sound",
    category: "sleep",
    keywords: ["perfect sleep environment", "best bedroom temperature sleep", "blackout curtains sleep", "sleep environment tips", "bedroom setup better sleep"],
    relatedTools: ["sleep-calculator"],
    relatedArticles: ["sleep-hygiene-checklist-printable", "bedtime-routine-improve-sleep-quality", "how-much-deep-sleep-do-you-need"],
  },
  {
    topic: "Sleep Trackers: Are They Worth It and Which Ones Are Most Accurate",
    category: "sleep",
    keywords: ["best sleep tracker", "sleep tracker accuracy", "are sleep trackers worth it", "sleep tracking ring", "wearable sleep monitor"],
    relatedTools: ["sleep-calculator"],
    relatedArticles: ["how-much-deep-sleep-do-you-need", "sleep-hygiene-checklist-printable", "weekend-sleep-catch-up-does-it-work"],
  },

  // ─── MOBILITY & FLEXIBILITY (5 articles) ──────────────────────────
  {
    topic: "Hip Mobility Exercises for People Who Sit All Day: A Complete Routine",
    category: "fitness",
    keywords: ["hip mobility exercises", "hip mobility routine", "hip flexor stretches sitting", "tight hips from sitting", "hip opener exercises"],
    relatedTools: ["heart-rate-calculator"],
    relatedArticles: ["daily-mobility-routine-15-minutes-to-better-movement", "desk-exercises-office-workers-no-equipment", "stretching-routines-improve-flexibility-mobility"],
  },
  {
    topic: "Thoracic Spine Mobility: Exercises to Fix Upper Back Stiffness and Posture",
    category: "fitness",
    keywords: ["thoracic spine mobility", "upper back stiffness exercises", "thoracic mobility routine", "fix rounded shoulders", "t-spine exercises"],
    relatedTools: ["heart-rate-calculator"],
    relatedArticles: ["daily-mobility-routine-15-minutes-to-better-movement", "desk-exercises-office-workers-no-equipment", "10-minute-morning-stretch-routine-beginners"],
  },
  {
    topic: "Ankle Mobility: Why It Matters and Simple Exercises to Improve It",
    category: "fitness",
    keywords: ["ankle mobility exercises", "improve ankle mobility", "ankle dorsiflexion", "ankle mobility for squats", "stiff ankles exercises"],
    relatedTools: ["heart-rate-calculator"],
    relatedArticles: ["daily-mobility-routine-15-minutes-to-better-movement", "flexibility-training-improve-your-range-of-motion-at-any-age", "balance-mobility-exercises-over-50"],
  },
  {
    topic: "Foam Rolling for Recovery: A Beginner's Guide to Self-Myofascial Release",
    category: "fitness",
    keywords: ["foam rolling for beginners", "foam roller exercises", "self myofascial release", "best foam roller", "foam rolling benefits"],
    relatedTools: ["heart-rate-calculator"],
    relatedArticles: ["exercise-recovery-science-backed-strategies-to-recover-faster", "daily-mobility-routine-15-minutes-to-better-movement", "stretching-routines-improve-flexibility-mobility"],
  },
  {
    topic: "Morning Mobility Flow: A 10-Minute Routine to Start Your Day Without Stiffness",
    category: "fitness",
    keywords: ["morning mobility routine", "morning movement routine", "wake up mobility flow", "morning stiffness exercises", "joint mobility morning"],
    relatedTools: ["heart-rate-calculator"],
    relatedArticles: ["10-minute-morning-stretch-routine-beginners", "daily-mobility-routine-15-minutes-to-better-movement", "flexibility-training-improve-your-range-of-motion-at-any-age"],
  },

  // ─── RECOVERY (4 articles) ────────────────────────────────────────
  {
    topic: "Cold Water Immersion for Recovery: What the Research Actually Says",
    category: "fitness",
    keywords: ["cold water immersion recovery", "ice bath benefits", "cold plunge recovery", "cold exposure after exercise", "cold water therapy"],
    relatedTools: ["heart-rate-calculator"],
    relatedArticles: ["exercise-recovery-science-backed-strategies-to-recover-faster", "daily-mobility-routine-15-minutes-to-better-movement"],
  },
  {
    topic: "Active Recovery Days: What to Do on Rest Days to Recover Faster",
    category: "fitness",
    keywords: ["active recovery day", "what to do on rest days", "active recovery exercises", "light exercise recovery", "rest day activities"],
    relatedTools: ["heart-rate-calculator", "calorie-calculator"],
    relatedArticles: ["exercise-recovery-science-backed-strategies-to-recover-faster", "how-to-start-walking-for-fitness-plan", "stretching-routines-improve-flexibility-mobility"],
  },
  {
    topic: "Massage Guns for Recovery: Are They Worth It and How to Use One Properly",
    category: "fitness",
    keywords: ["massage gun for recovery", "percussion massager benefits", "best massage gun", "how to use massage gun", "massage gun vs foam roller"],
    relatedTools: [],
    relatedArticles: ["exercise-recovery-science-backed-strategies-to-recover-faster", "daily-mobility-routine-15-minutes-to-better-movement"],
  },
  {
    topic: "Sleep and Muscle Recovery: How Rest Affects Training Results",
    category: "fitness",
    keywords: ["sleep muscle recovery", "sleep and exercise recovery", "how sleep affects gains", "rest and muscle growth", "sleep for athletes"],
    relatedTools: ["sleep-calculator"],
    relatedArticles: ["exercise-recovery-science-backed-strategies-to-recover-faster", "how-much-deep-sleep-do-you-need", "strength-training-after-40-build-muscle-safely"],
  },

  // ─── HEALTHY AGEING & MEN'S HEALTH AFTER 40 (6 articles) ─────────
  {
    topic: "Exercise After 50: A Practical Guide to Staying Strong and Mobile",
    category: "healthy-ageing",
    keywords: ["exercise after 50", "fitness over 50", "strength training over 50", "staying active after 50", "workout plan over 50"],
    relatedTools: ["heart-rate-calculator", "bmi-calculator"],
    relatedArticles: ["balance-mobility-exercises-over-50", "strength-training-after-40-build-muscle-safely", "exercise-for-healthy-ageing-activity-longevity-vitality"],
  },
  {
    topic: "Testosterone and Ageing: Natural Lifestyle Factors That May Support Healthy Levels",
    category: "healthy-ageing",
    keywords: ["natural testosterone support", "testosterone after 40", "low testosterone lifestyle", "boost testosterone naturally", "testosterone and ageing"],
    relatedTools: ["bmi-calculator"],
    relatedArticles: ["strength-training-after-40-build-muscle-safely", "exercise-for-healthy-ageing-activity-longevity-vitality", "how-much-deep-sleep-do-you-need"],
  },
  {
    topic: "Joint Health After 40: Supplements, Exercises, and Lifestyle Changes That May Help",
    category: "healthy-ageing",
    keywords: ["joint health after 40", "joint supplements", "glucosamine chondroitin", "joint pain exercise", "healthy joints ageing"],
    relatedTools: ["bmi-calculator"],
    relatedArticles: ["balance-mobility-exercises-over-50", "daily-mobility-routine-15-minutes-to-better-movement", "flexibility-training-improve-your-range-of-motion-at-any-age"],
  },
  {
    topic: "Grip Strength and Longevity: Why It Matters and How to Improve It",
    category: "healthy-ageing",
    keywords: ["grip strength longevity", "improve grip strength", "grip strength health", "grip strength exercises", "grip strength and ageing"],
    relatedTools: [],
    relatedArticles: ["strength-training-after-40-build-muscle-safely", "balance-mobility-exercises-over-50", "exercise-for-healthy-ageing-activity-longevity-vitality"],
  },
  {
    topic: "Maintaining Muscle Mass After 40: Evidence-Based Strategies for Preventing Sarcopenia",
    category: "healthy-ageing",
    keywords: ["muscle mass after 40", "prevent sarcopenia", "muscle loss ageing", "protein for muscle over 40", "resistance training ageing"],
    relatedTools: ["calorie-calculator", "bmi-calculator"],
    relatedArticles: ["strength-training-after-40-build-muscle-safely", "progressive-overload-explained-key-to-fitness-gains", "exercise-for-healthy-ageing-activity-longevity-vitality"],
  },
  {
    topic: "Balance Training for Fall Prevention: Simple Exercises You Can Do at Home",
    category: "healthy-ageing",
    keywords: ["balance training fall prevention", "balance exercises elderly", "fall prevention exercises home", "improve balance older adults", "proprioception exercises"],
    relatedTools: [],
    relatedArticles: ["balance-mobility-exercises-over-50", "exercise-for-healthy-ageing-activity-longevity-vitality", "daily-mobility-routine-15-minutes-to-better-movement"],
  },

  // ─── STRESS REDUCTION & BREATHING (5 articles) ────────────────────
  {
    topic: "Box Breathing Technique: A Step-by-Step Guide Used by Navy SEALs and Athletes",
    category: "stress",
    keywords: ["box breathing technique", "box breathing benefits", "4-4-4-4 breathing", "tactical breathing", "breathing for anxiety"],
    relatedTools: [],
    relatedArticles: ["breathing-techniques-reduce-stress", "workplace-habits-lower-daily-stress", "daily-self-care-practices-emotional-well-being"],
  },
  {
    topic: "Vagus Nerve Stimulation: Natural Techniques That May Calm Your Nervous System",
    category: "stress",
    keywords: ["vagus nerve stimulation natural", "vagus nerve exercises", "activate vagus nerve", "vagal tone", "parasympathetic nervous system"],
    relatedTools: [],
    relatedArticles: ["breathing-techniques-reduce-stress", "daily-self-care-practices-emotional-well-being", "journaling-better-stress-management"],
  },
  {
    topic: "Progressive Muscle Relaxation: A Complete Guide to This Evidence-Based Technique",
    category: "stress",
    keywords: ["progressive muscle relaxation", "PMR technique", "muscle relaxation for anxiety", "relaxation techniques for sleep", "body scan relaxation"],
    relatedTools: ["sleep-calculator"],
    relatedArticles: ["breathing-techniques-reduce-stress", "natural-approaches-fall-asleep-faster", "daily-self-care-practices-emotional-well-being"],
  },
  {
    topic: "Physiological Sigh: The Fastest Science-Backed Way to Reduce Stress in Real Time",
    category: "stress",
    keywords: ["physiological sigh", "double inhale exhale", "fastest way to calm down", "stress relief breathing", "huberman breathing technique"],
    relatedTools: [],
    relatedArticles: ["breathing-techniques-reduce-stress", "workplace-habits-lower-daily-stress", "daily-self-care-practices-emotional-well-being"],
  },
  {
    topic: "Nature Walks for Stress: How Forest Bathing and Green Exercise May Reduce Cortisol",
    category: "stress",
    keywords: ["nature walks stress relief", "forest bathing benefits", "shinrin yoku", "green exercise", "walking in nature mental health"],
    relatedTools: [],
    relatedArticles: ["breathing-techniques-reduce-stress", "how-to-start-walking-for-fitness-plan", "daily-self-care-practices-emotional-well-being"],
  },

  // ─── MENOPAUSE SUPPORT (5 articles) ───────────────────────────────
  {
    topic: "Best Supplements for Menopause Symptoms: What the Evidence Says About Relief Options",
    category: "menopause",
    keywords: ["menopause supplements", "best supplements menopause", "black cohosh menopause", "menopause relief natural", "supplements hot flashes"],
    relatedTools: [],
    relatedArticles: ["perimenopause-practical-overview", "lifestyle-changes-menopause-well-being", "exercise-menopause-symptoms"],
  },
  {
    topic: "Menopause and Sleep Problems: Why They Happen and Strategies That May Help",
    category: "menopause",
    keywords: ["menopause sleep problems", "menopause insomnia", "night sweats sleep", "perimenopause sleep", "menopause sleep remedies"],
    relatedTools: ["sleep-calculator"],
    relatedArticles: ["perimenopause-practical-overview", "lifestyle-changes-menopause-well-being", "natural-approaches-fall-asleep-faster"],
  },
  {
    topic: "Strength Training During Menopause: Why Lifting Weights May Be the Best Thing You Do",
    category: "menopause",
    keywords: ["strength training menopause", "weight lifting menopause", "resistance training menopause", "menopause bone density", "menopause exercise plan"],
    relatedTools: ["calorie-calculator", "heart-rate-calculator"],
    relatedArticles: ["exercise-menopause-symptoms", "lifestyle-changes-menopause-well-being", "strength-training-after-40-build-muscle-safely"],
  },
  {
    topic: "Menopause Weight Gain: Why It Happens and Evidence-Based Approaches to Managing It",
    category: "menopause",
    keywords: ["menopause weight gain", "weight gain perimenopause", "menopause belly fat", "lose weight menopause", "menopause metabolism"],
    relatedTools: ["calorie-calculator", "bmi-calculator"],
    relatedArticles: ["lifestyle-changes-menopause-well-being", "exercise-menopause-symptoms", "perimenopause-practical-overview"],
  },
  {
    topic: "Menopause and Joint Pain: Causes, Relief Options, and When to Seek Help",
    category: "menopause",
    keywords: ["menopause joint pain", "perimenopause joint stiffness", "menopause aches and pains", "estrogen joint pain", "menopause arthritis"],
    relatedTools: [],
    relatedArticles: ["perimenopause-practical-overview", "lifestyle-changes-menopause-well-being", "daily-mobility-routine-15-minutes-to-better-movement"],
  },

  // ─── MARTIAL ARTS & JIU JITSU (4 articles) ────────────────────────
  {
    topic: "Martial Arts for Fitness After 40: Which Styles Are Best for Older Beginners",
    category: "fitness",
    keywords: ["martial arts after 40", "martial arts for older beginners", "martial arts fitness adults", "start martial arts late", "best martial art for fitness"],
    relatedTools: ["heart-rate-calculator", "calorie-calculator"],
    relatedArticles: ["japanese-jiu-jitsu-for-beginners-what-to-expect", "strength-training-after-40-build-muscle-safely", "exercise-for-healthy-ageing-activity-longevity-vitality"],
  },
  {
    topic: "Japanese Jiu Jitsu vs Brazilian Jiu Jitsu: Key Differences for Beginners",
    category: "fitness",
    keywords: ["japanese jiu jitsu vs brazilian", "JJJ vs BJJ", "difference jiu jitsu styles", "which jiu jitsu to learn", "traditional jiu jitsu"],
    relatedTools: [],
    relatedArticles: ["japanese-jiu-jitsu-for-beginners-what-to-expect", "strength-training-after-40-build-muscle-safely", "warm-up-and-cool-down-why-they-matter-and-how-to-do-them-properly"],
  },
  {
    topic: "How to Choose a Martial Arts Gi: A Buying Guide for Beginners",
    category: "fitness",
    keywords: ["martial arts gi buying guide", "best jiu jitsu gi beginners", "how to choose a gi", "judo gi vs jiu jitsu gi", "gi size guide"],
    relatedTools: [],
    relatedArticles: ["japanese-jiu-jitsu-for-beginners-what-to-expect", "warm-up-and-cool-down-why-they-matter-and-how-to-do-them-properly"],
  },
  {
    topic: "Conditioning for Martial Arts: A Bodyweight Programme to Build Fight Fitness",
    category: "fitness",
    keywords: ["martial arts conditioning", "fight fitness training", "martial arts bodyweight workout", "grappling conditioning", "combat sport fitness"],
    relatedTools: ["heart-rate-calculator", "calorie-calculator"],
    relatedArticles: ["japanese-jiu-jitsu-for-beginners-what-to-expect", "beginner-calisthenics-a-12-week-bodyweight-programme", "progressive-overload-explained-key-to-fitness-gains"],
  },

  // ─── TAI CHI & MINDFUL MOVEMENT (3 articles) ─────────────────────
  {
    topic: "Tai Chi for Beginners: Health Benefits, What to Expect, and How to Start",
    category: "fitness",
    keywords: ["tai chi for beginners", "tai chi benefits", "start tai chi", "tai chi health", "tai chi exercises beginners"],
    relatedTools: ["heart-rate-calculator"],
    relatedArticles: ["yoga-for-beginners-first-10-poses", "balance-mobility-exercises-over-50", "exercise-for-healthy-ageing-activity-longevity-vitality"],
  },
  {
    topic: "Tai Chi for Balance and Fall Prevention: What Research Says About This Gentle Practice",
    category: "fitness",
    keywords: ["tai chi balance", "tai chi fall prevention", "tai chi elderly benefits", "tai chi for seniors", "tai chi proprioception"],
    relatedTools: [],
    relatedArticles: ["balance-mobility-exercises-over-50", "exercise-for-healthy-ageing-activity-longevity-vitality", "yoga-for-beginners-first-10-poses"],
  },
  {
    topic: "Qigong vs Tai Chi: Differences, Benefits, and Which to Choose as a Beginner",
    category: "fitness",
    keywords: ["qigong vs tai chi", "difference qigong tai chi", "qigong for beginners", "tai chi or qigong", "qigong health benefits"],
    relatedTools: [],
    relatedArticles: ["yoga-for-beginners-first-10-poses", "breathing-techniques-reduce-stress", "balance-mobility-exercises-over-50"],
  },

  // ─── WALKING & LOW-IMPACT (4 articles) ────────────────────────────
  {
    topic: "Rucking for Fitness: How Walking with a Weighted Pack Builds Strength and Endurance",
    category: "fitness",
    keywords: ["rucking for fitness", "rucking benefits", "weighted walking", "ruck march exercise", "rucking for beginners", "rucksack walking"],
    relatedTools: ["calorie-calculator", "heart-rate-calculator"],
    relatedArticles: ["how-to-start-walking-for-fitness-plan", "how-many-steps-per-day-by-age", "exercise-for-healthy-ageing-activity-longevity-vitality"],
  },
  {
    topic: "Best Walking Shoes for Fitness Walking: What to Look for by Foot Type",
    category: "fitness",
    keywords: ["best walking shoes fitness", "walking shoes for exercise", "supportive walking shoes", "walking shoes flat feet", "comfortable walking shoes"],
    relatedTools: [],
    relatedArticles: ["how-to-start-walking-for-fitness-plan", "how-many-steps-per-day-by-age", "daily-walking-weight-management"],
  },
  {
    topic: "Walking for Weight Management: How Many Steps and What Pace Actually Matters",
    category: "fitness",
    keywords: ["walking for weight loss", "steps for weight loss", "brisk walking calories", "walking pace weight management", "daily walking fat loss"],
    relatedTools: ["calorie-calculator", "bmi-calculator"],
    relatedArticles: ["daily-walking-weight-management", "how-many-steps-per-day-by-age", "how-to-start-walking-for-fitness-plan"],
  },
  {
    topic: "Low Impact Exercise for Bad Knees: Effective Workouts That Protect Your Joints",
    category: "fitness",
    keywords: ["low impact exercise bad knees", "exercise for bad knees", "knee friendly workout", "low impact cardio", "joint safe exercises"],
    relatedTools: ["heart-rate-calculator"],
    relatedArticles: ["how-to-start-walking-for-fitness-plan", "daily-mobility-routine-15-minutes-to-better-movement", "balance-mobility-exercises-over-50"],
  },

  // ─── BEGINNER CALISTHENICS (3 articles) ───────────────────────────
  {
    topic: "Pull-Up Progression: How to Go from Zero to Your First Pull-Up",
    category: "fitness",
    keywords: ["pull up progression", "how to do first pull up", "pull up for beginners", "pull up alternatives", "can't do pull ups"],
    relatedTools: ["calorie-calculator"],
    relatedArticles: ["beginner-calisthenics-a-12-week-bodyweight-programme", "progressive-overload-explained-key-to-fitness-gains", "strength-training-after-40-build-muscle-safely"],
  },
  {
    topic: "Best Calisthenics Equipment for a Home Setup: Essential Gear Under 100 Pounds",
    category: "fitness",
    keywords: ["calisthenics equipment home", "best pull up bar home", "parallettes", "calisthenics home gym", "bodyweight training equipment"],
    relatedTools: [],
    relatedArticles: ["beginner-calisthenics-a-12-week-bodyweight-programme", "bodyweight-workout-plan-4-weeks-printable", "strength-training-home-no-equipment-beginners"],
  },
  {
    topic: "Calisthenics vs Gym: Pros, Cons, and Which Is Better for Your Goals",
    category: "fitness",
    keywords: ["calisthenics vs gym", "bodyweight vs weights", "calisthenics or weight training", "calisthenics build muscle", "gym vs calisthenics beginners"],
    relatedTools: ["calorie-calculator"],
    relatedArticles: ["beginner-calisthenics-a-12-week-bodyweight-programme", "progressive-overload-explained-key-to-fitness-gains", "strength-training-after-40-build-muscle-safely"],
  },

  // ─── DISCIPLINE & CONSISTENCY (4 articles) ────────────────────────
  {
    topic: "The Two-Minute Rule: How to Use It to Build Exercise Habits That Stick",
    category: "habits",
    keywords: ["two minute rule exercise", "2 minute rule habits", "atomic habits exercise", "start small exercise habit", "minimum viable workout"],
    relatedTools: [],
    relatedArticles: ["building-discipline-and-consistency-in-your-fitness-routine", "habit-formation-science-how-long-build-habit", "habit-stacking-how-to-guide-examples"],
  },
  {
    topic: "Never Miss Twice: A Simple Rule for Maintaining Fitness Consistency",
    category: "habits",
    keywords: ["never miss twice rule", "fitness consistency", "workout consistency tips", "getting back on track fitness", "exercise after missed days"],
    relatedTools: [],
    relatedArticles: ["building-discipline-and-consistency-in-your-fitness-routine", "habit-formation-science-how-long-build-habit", "one-percent-better-daily-improvement-guide"],
  },
  {
    topic: "How to Build a Training Log: Why Tracking Your Workouts Accelerates Progress",
    category: "habits",
    keywords: ["training log", "workout journal", "track workouts", "exercise diary benefits", "training log template"],
    relatedTools: [],
    relatedArticles: ["how-to-build-a-habit-tracker-template", "building-discipline-and-consistency-in-your-fitness-routine", "progressive-overload-explained-key-to-fitness-gains"],
  },
  {
    topic: "Identity-Based Habits for Fitness: How Changing Your Self-Image Changes Your Behaviour",
    category: "habits",
    keywords: ["identity based habits", "fitness identity", "become an exerciser", "habit identity change", "athletic identity"],
    relatedTools: [],
    relatedArticles: ["habit-formation-science-how-long-build-habit", "building-discipline-and-consistency-in-your-fitness-routine", "one-percent-better-daily-improvement-guide"],
  },
];

// ═══════════════════════════════════════════════════════════════════════
// GENERATION ENGINE
// ═══════════════════════════════════════════════════════════════════════

function parseArgs() {
  const args = process.argv.slice(2);
  const opts: Record<string, string> = {};
  for (const arg of args) {
    if (arg.startsWith("--")) {
      const [key, val] = arg.slice(2).split("=");
      opts[key] = val ?? "true";
    }
  }
  return {
    limit: parseInt(opts["limit"] || String(TOPICS.length), 10),
    offset: parseInt(opts["offset"] || "0", 10),
    dryRun: opts["dry-run"] === "true",
  };
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function getExistingArticles(): Promise<ExistingArticle[]> {
  const articles = await prisma.article.findMany({
    where: { status: { in: ["PUBLISHED", "DRAFT", "APPROVED"] } },
    select: { slug: true, categorySlug: true, title: true, keywords: true },
  });
  return articles.map((a) => ({
    slug: a.slug,
    categorySlug: a.categorySlug,
    title: a.title,
    keywords: a.keywords as string[],
  }));
}

async function generateOne(
  topic: TopicInput,
  existingArticles: ExistingArticle[],
): Promise<{ success: boolean; slug?: string; error?: string }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");

  const existingSlugs = existingArticles.map((a) => a.slug);
  const systemPrompt = buildSystemPrompt(topic.category);
  const promptInput: ArticlePromptInput = {
    topic: topic.topic,
    category: topic.category,
    keywords: topic.keywords,
    relatedTools: topic.relatedTools,
    relatedArticles: topic.relatedArticles,
    existingSlugs,
  };
  const userPrompt = buildUserPrompt(promptInput);

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: AI_MODEL,
      max_tokens: 8192,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    return { success: false, error: `API ${response.status}: ${errText.slice(0, 200)}` };
  }

  const aiResponse = await response.json();
  const textContent = aiResponse.content?.[0]?.text || "";

  let articleData;
  try {
    articleData = parseAiResponse(textContent);
  } catch (e) {
    return { success: false, error: `Parse: ${e instanceof Error ? e.message : String(e)}` };
  }

  const validation = validateArticle(articleData, topic.category);
  if (!validation.valid) {
    return { success: false, error: `Validation: ${validation.errors.join("; ")}` };
  }

  articleData.body = injectInternalLinks(articleData.body, articleData.internalLinks, existingArticles);

  if (articleData.relatedArticles.length < 3) {
    const suggested = findRelatedArticles(articleData.keywords, topic.category, existingArticles, 5);
    const existing = new Set(articleData.relatedArticles);
    for (const slug of suggested) {
      if (!existing.has(slug)) {
        articleData.relatedArticles.push(slug);
        existing.add(slug);
      }
      if (articleData.relatedArticles.length >= 5) break;
    }
  }

  const metadata = buildArticleMetadata(articleData, topic.category, AI_MODEL, userPrompt);
  const qualityScore = estimateQualityScore(articleData, topic.category);

  const tagRecords = [];
  for (const tagName of metadata.tags) {
    const tagSlug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const tag = await prisma.tag.upsert({
      where: { slug: tagSlug },
      update: {},
      create: { name: tagName, slug: tagSlug },
    });
    tagRecords.push(tag);
  }

  // Handle slug collision
  const existingSlug = await prisma.article.findFirst({ where: { slug: metadata.slug } });
  if (existingSlug) {
    metadata.slug = `${metadata.slug}-guide`;
    const secondCheck = await prisma.article.findFirst({ where: { slug: metadata.slug } });
    if (secondCheck) metadata.slug = `${metadata.slug}-${Date.now()}`;
  }

  const article = await prisma.article.create({
    data: {
      slug: metadata.slug,
      title: metadata.title,
      metaTitle: metadata.metaTitle,
      metaDesc: metadata.metaDesc,
      excerpt: metadata.excerpt,
      summary: metadata.summary,
      body: metadata.body,
      categorySlug: metadata.categorySlug,
      keywords: metadata.keywords,
      faqSection: metadata.faqSection,
      sourceNotes: metadata.sourceNotes,
      internalLinks: metadata.internalLinks,
      relatedTools: metadata.relatedTools,
      relatedArticles: metadata.relatedArticles,
      wordCount: metadata.wordCount,
      readTime: metadata.readTime,
      healthSensitive: metadata.healthSensitive,
      aiGenerated: metadata.aiGenerated,
      aiModel: metadata.aiModel,
      aiPrompt: metadata.aiPrompt,
      status: metadata.status,
      tags: { connect: tagRecords.map((t) => ({ id: t.id })) },
    },
  });

  await prisma.contentJob.create({
    data: {
      topic: topic.topic,
      category: topic.category,
      keywords: topic.keywords,
      status: "COMPLETED",
      articleId: article.id,
      targetSlug: article.slug,
      completedAt: new Date(),
    },
  });

  console.log(`  Score: ${qualityScore}/100 | ${metadata.wordCount} words | ${metadata.readTime}min read`);
  if (validation.warnings.length > 0) {
    console.log(`  Warnings: ${validation.warnings.slice(0, 2).join("; ")}`);
  }

  return { success: true, slug: article.slug };
}

async function main() {
  const opts = parseArgs();
  const topics = TOPICS.slice(opts.offset, opts.offset + opts.limit);

  console.log("═══════════════════════════════════════════════════════════");
  console.log("  SEO EXPANSION BATCH 1 — Monetisation-Focused Content");
  console.log("═══════════════════════════════════════════════════════════");
  console.log(`Model: ${AI_MODEL} | Delay: ${DELAY_MS}ms`);
  console.log(`Topics: ${topics.length} (offset ${opts.offset}, limit ${opts.limit})`);
  console.log(`Dry run: ${opts.dryRun}\n`);

  if (opts.dryRun) {
    for (let i = 0; i < topics.length; i++) {
      const t = topics[i];
      console.log(`[${i + 1}] ${t.category} | ${t.topic}`);
      console.log(`    KW: ${t.keywords.slice(0, 3).join(", ")}...`);
    }
    console.log(`\nTotal: ${topics.length} articles ready to generate.`);
    await prisma.$disconnect();
    return;
  }

  const existingArticles = await getExistingArticles();
  console.log(`Existing articles in DB: ${existingArticles.length}\n`);

  let successCount = 0;
  let failCount = 0;
  const failed: { topic: string; error: string }[] = [];

  for (let i = 0; i < topics.length; i++) {
    const topic = topics[i];
    const label = `[${opts.offset + i + 1}/${TOPICS.length}]`;
    process.stdout.write(`${label} ${topic.category}/${topic.topic.slice(0, 55)}... `);

    try {
      const result = await generateOne(topic, existingArticles);
      if (result.success) {
        console.log(`OK -> ${result.slug}`);
        successCount++;
        existingArticles.push({
          slug: result.slug!,
          categorySlug: topic.category,
          title: topic.topic,
          keywords: topic.keywords,
        });
      } else {
        console.log(`FAIL`);
        console.log(`  ${result.error}`);
        failCount++;
        failed.push({ topic: topic.topic, error: result.error || "unknown" });
      }
    } catch (err) {
      console.log(`FAIL`);
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`  ${msg}`);
      failCount++;
      failed.push({ topic: topic.topic, error: msg });
    }

    if (i < topics.length - 1) await sleep(DELAY_MS);
  }

  console.log("\n═══════════════════════════════════════════════════════════");
  console.log(`  RESULTS: ${successCount} success | ${failCount} failed | ${topics.length} total`);
  console.log("═══════════════════════════════════════════════════════════");

  if (failed.length > 0) {
    console.log("\nFailed:");
    for (const f of failed) {
      console.log(`  - ${f.topic.slice(0, 60)}: ${f.error.slice(0, 100)}`);
    }
  }

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
