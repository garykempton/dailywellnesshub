/**
 * SEO Expansion Batch 2 — Long-tail, low-competition wellness content
 *
 * Targets: realistic search intent, medium/low competition keywords,
 * advertiser-value niches, tool-integrated content.
 *
 * Focus areas: over-50 fitness, martial arts, Tai Chi, breathing/sleep,
 * stress management, flexibility/mobility, beginner calisthenics, recovery.
 *
 * Usage: npx tsx scripts/batch-seo-expansion-2.ts --dry-run
 *        npx tsx scripts/batch-seo-expansion-2.ts --limit=5
 *        npx tsx scripts/batch-seo-expansion-2.ts --offset=10 --limit=10
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
// TOPIC DEFINITIONS — 48 articles targeting long-tail, low-competition KWs
// ═══════════════════════════════════════════════════════════════════════

const TOPICS: TopicInput[] = [
  // ─── FLEXIBILITY & MOBILITY FOR OLDER ADULTS (6 articles) ─────────
  {
    topic: "Best Stretches for Stiff Hips After 50: A Gentle Daily Routine",
    category: "healthy-ageing",
    keywords: [
      "best stretches for stiff hips after 50",
      "hip stretches for over 50",
      "hip flexibility exercises older adults",
      "stiff hips morning routine",
      "hip pain stretches seniors",
      "seated hip stretches elderly",
    ],
    relatedTools: ["flexibility-tracker", "mobility-assessment"],
    relatedArticles: [
      "balance-mobility-exercises-over-50",
      "daily-mobility-routine-15-minutes-to-better-movement",
      "flexibility-training-improve-your-range-of-motion-at-any-age",
    ],
  },
  {
    topic: "Flexibility Training for Older Adults: Safe Stretches That Actually Improve Range of Motion",
    category: "healthy-ageing",
    keywords: [
      "flexibility training for older adults",
      "stretching over 60",
      "safe stretches for seniors",
      "improve flexibility after 50",
      "gentle stretching routine elderly",
      "range of motion exercises older adults",
    ],
    relatedTools: ["flexibility-tracker", "mobility-assessment"],
    relatedArticles: [
      "balance-mobility-exercises-over-50",
      "flexibility-training-improve-your-range-of-motion-at-any-age",
      "exercise-for-healthy-ageing-activity-longevity-vitality",
    ],
  },
  {
    topic: "How to Improve Balance After Menopause: Exercises, Tips, and What Research Shows",
    category: "menopause",
    keywords: [
      "how to improve balance after menopause",
      "menopause balance problems",
      "balance exercises menopause",
      "dizziness menopause",
      "fall risk menopause",
      "proprioception perimenopause",
    ],
    relatedTools: ["mobility-assessment", "flexibility-tracker"],
    relatedArticles: [
      "balance-mobility-exercises-over-50",
      "exercise-menopause-symptoms",
      "lifestyle-changes-menopause-well-being",
    ],
  },
  {
    topic: "Chair Yoga for Seniors: 15 Seated Poses to Improve Flexibility and Reduce Pain",
    category: "healthy-ageing",
    keywords: [
      "chair yoga for seniors",
      "seated yoga exercises elderly",
      "chair yoga for flexibility",
      "gentle yoga for older adults",
      "chair yoga for arthritis",
      "seated stretches for stiffness",
    ],
    relatedTools: ["flexibility-tracker", "breathing-timer"],
    relatedArticles: [
      "yoga-for-beginners-first-10-poses",
      "balance-mobility-exercises-over-50",
      "flexibility-training-improve-your-range-of-motion-at-any-age",
    ],
  },
  {
    topic: "Morning Stiffness After 50: Why It Happens and a 10-Minute Routine That May Help",
    category: "healthy-ageing",
    keywords: [
      "morning stiffness after 50",
      "stiff joints in the morning over 50",
      "morning mobility routine seniors",
      "why am I so stiff in the morning",
      "reduce morning stiffness naturally",
    ],
    relatedTools: ["mobility-assessment", "flexibility-tracker"],
    relatedArticles: [
      "daily-mobility-routine-15-minutes-to-better-movement",
      "10-minute-morning-stretch-routine-beginners",
      "balance-mobility-exercises-over-50",
    ],
  },
  {
    topic: "Healthy Habits for Men Over 50: A Practical Daily Checklist",
    category: "healthy-ageing",
    keywords: [
      "healthy habits for men over 50",
      "men's health after 50",
      "daily health routine men 50+",
      "fitness checklist men over 50",
      "wellness tips men over 50",
      "men over 50 exercise routine",
    ],
    relatedTools: ["habit-tracker", "recovery-tracker", "calorie-calculator"],
    relatedArticles: [
      "strength-training-after-40-build-muscle-safely",
      "exercise-for-healthy-ageing-activity-longevity-vitality",
      "balance-mobility-exercises-over-50",
    ],
  },

  // ─── BEGINNER CALISTHENICS & BODYWEIGHT (5 articles) ──────────────
  {
    topic: "Beginner Calisthenics for Overweight Men: How to Start Bodyweight Training Safely",
    category: "fitness",
    keywords: [
      "beginner calisthenics for overweight men",
      "bodyweight exercises for heavy people",
      "calisthenics overweight beginners",
      "modified push ups for heavy people",
      "start calisthenics when overweight",
      "bodyweight workout for obese beginners",
    ],
    relatedTools: ["calorie-calculator", "recovery-tracker"],
    relatedArticles: [
      "beginner-calisthenics-a-12-week-bodyweight-programme",
      "strength-training-home-no-equipment-beginners",
      "bodyweight-workout-plan-4-weeks-printable",
    ],
  },
  {
    topic: "Wall Push-Ups to Full Push-Ups: A 6-Week Progression for Complete Beginners",
    category: "fitness",
    keywords: [
      "wall push ups to full push ups",
      "push up progression for beginners",
      "can't do a push up",
      "push up progression plan",
      "push ups for overweight beginners",
      "how to work up to push ups",
    ],
    relatedTools: ["recovery-tracker", "habit-tracker"],
    relatedArticles: [
      "beginner-calisthenics-a-12-week-bodyweight-programme",
      "progressive-overload-explained-key-to-fitness-gains",
      "strength-training-home-no-equipment-beginners",
    ],
  },
  {
    topic: "Bodyweight Squats for Beginners: Proper Form, Common Mistakes, and Progressions",
    category: "fitness",
    keywords: [
      "bodyweight squats for beginners",
      "how to do a proper squat",
      "squat form for beginners",
      "squat mistakes beginners",
      "squat progression bodyweight",
      "can't do a full squat",
    ],
    relatedTools: ["mobility-assessment", "flexibility-tracker"],
    relatedArticles: [
      "beginner-calisthenics-a-12-week-bodyweight-programme",
      "bodyweight-workout-plan-4-weeks-printable",
      "strength-training-home-no-equipment-beginners",
    ],
  },
  {
    topic: "Resistance Band Exercises for Beginners Over 50: A Full-Body Home Workout",
    category: "healthy-ageing",
    keywords: [
      "resistance band exercises for beginners over 50",
      "resistance bands for seniors",
      "elastic band workout older adults",
      "resistance band full body workout over 50",
      "best resistance bands for seniors",
    ],
    relatedTools: ["recovery-tracker", "flexibility-tracker"],
    relatedArticles: [
      "strength-training-after-40-build-muscle-safely",
      "strength-training-home-no-equipment-beginners",
      "exercise-for-healthy-ageing-activity-longevity-vitality",
    ],
  },
  {
    topic: "How to Start Exercising When You Haven't Worked Out in Years",
    category: "fitness",
    keywords: [
      "how to start exercising again after years",
      "getting back into exercise after long break",
      "exercise for out of shape beginners",
      "start working out again at 40",
      "fitness comeback plan",
      "starting exercise from zero",
    ],
    relatedTools: ["recovery-tracker", "calorie-calculator", "habit-tracker"],
    relatedArticles: [
      "how-to-start-walking-for-fitness-plan",
      "beginner-calisthenics-a-12-week-bodyweight-programme",
      "strength-training-home-no-equipment-beginners",
    ],
  },

  // ─── MARTIAL ARTS & JIU JITSU (6 articles) ───────────────────────
  {
    topic: "Japanese Jiu Jitsu After 40: Is It Safe, What to Expect, and How to Start",
    category: "fitness",
    keywords: [
      "Japanese Jiu Jitsu after 40",
      "jiu jitsu over 40",
      "martial arts after 40 beginners",
      "is jiu jitsu safe for older adults",
      "start jiu jitsu at 40",
      "JJJ for older beginners",
    ],
    relatedTools: ["recovery-tracker", "martial-arts-conditioning-planner", "flexibility-tracker"],
    relatedArticles: [
      "japanese-jiu-jitsu-for-beginners-what-to-expect",
      "strength-training-after-40-build-muscle-safely",
      "exercise-for-healthy-ageing-activity-longevity-vitality",
    ],
  },
  {
    topic: "Mobility Exercises for Martial Artists: A Pre-Training Routine for Injury Prevention",
    category: "fitness",
    keywords: [
      "mobility exercises for martial artists",
      "martial arts warm up routine",
      "martial arts flexibility",
      "injury prevention martial arts",
      "hip mobility for kicking",
      "shoulder mobility for grappling",
    ],
    relatedTools: ["mobility-assessment", "martial-arts-conditioning-planner", "flexibility-tracker"],
    relatedArticles: [
      "japanese-jiu-jitsu-for-beginners-what-to-expect",
      "daily-mobility-routine-15-minutes-to-better-movement",
      "warm-up-and-cool-down-why-they-matter-and-how-to-do-them-properly",
    ],
  },
  {
    topic: "Recovery After Martial Arts Training: How to Reduce Soreness and Prevent Overtraining",
    category: "fitness",
    keywords: [
      "recovery after martial arts training",
      "martial arts recovery tips",
      "sore after martial arts",
      "BJJ recovery routine",
      "martial arts overtraining",
      "post training recovery combat sports",
    ],
    relatedTools: ["recovery-tracker", "martial-arts-conditioning-planner", "sleep-calculator"],
    relatedArticles: [
      "exercise-recovery-science-backed-strategies-to-recover-faster",
      "japanese-jiu-jitsu-for-beginners-what-to-expect",
      "stretching-routines-improve-flexibility-mobility",
    ],
  },
  {
    topic: "Grip Strength for Martial Arts: Exercises That Improve Your Hold for Grappling and Judo",
    category: "fitness",
    keywords: [
      "grip strength martial arts",
      "grip strength for judo",
      "grappling grip exercises",
      "improve grip strength for BJJ",
      "gi grip training",
      "forearm exercises for martial arts",
    ],
    relatedTools: ["martial-arts-conditioning-planner", "recovery-tracker"],
    relatedArticles: [
      "japanese-jiu-jitsu-for-beginners-what-to-expect",
      "strength-training-after-40-build-muscle-safely",
      "progressive-overload-explained-key-to-fitness-gains",
    ],
  },
  {
    topic: "Martial Arts for Stress Relief: How Combat Training May Help You Manage Anxiety and Tension",
    category: "stress",
    keywords: [
      "martial arts for stress relief",
      "martial arts anxiety",
      "boxing for stress",
      "martial arts mental health benefits",
      "combat sports stress management",
      "punching bag stress relief",
    ],
    relatedTools: ["stress-reduction-checklist", "martial-arts-conditioning-planner", "breathing-timer"],
    relatedArticles: [
      "japanese-jiu-jitsu-for-beginners-what-to-expect",
      "breathing-techniques-reduce-stress",
      "daily-self-care-practices-emotional-well-being",
    ],
  },
  {
    topic: "What to Eat Before and After Martial Arts Training: Nutrition Timing for Combat Athletes",
    category: "nutrition",
    keywords: [
      "what to eat before martial arts training",
      "martial arts nutrition",
      "pre workout meal martial arts",
      "post training nutrition combat sports",
      "BJJ diet tips",
      "martial arts meal plan",
    ],
    relatedTools: ["calorie-calculator", "macro-calculator", "hydration-calculator"],
    relatedArticles: [
      "japanese-jiu-jitsu-for-beginners-what-to-expect",
      "exercise-recovery-science-backed-strategies-to-recover-faster",
    ],
  },

  // ─── TAI CHI & MINDFUL MOVEMENT (5 articles) ─────────────────────
  {
    topic: "Does Tai Chi Help Anxiety? What the Research Says About This Gentle Practice",
    category: "stress",
    keywords: [
      "does Tai Chi help anxiety",
      "Tai Chi for anxiety",
      "Tai Chi mental health",
      "Tai Chi stress relief",
      "Tai Chi vs meditation for anxiety",
      "Tai Chi calming benefits",
    ],
    relatedTools: ["tai-chi-breathing-timer", "stress-reduction-checklist", "breathing-timer"],
    relatedArticles: [
      "breathing-techniques-reduce-stress",
      "daily-self-care-practices-emotional-well-being",
      "yoga-for-beginners-first-10-poses",
    ],
  },
  {
    topic: "Tai Chi Breathing Exercises for Beginners: How to Coordinate Breath and Movement",
    category: "fitness",
    keywords: [
      "Tai Chi breathing exercises beginners",
      "Tai Chi breathing techniques",
      "how to breathe during Tai Chi",
      "Tai Chi diaphragmatic breathing",
      "Tai Chi breath coordination",
      "Qigong breathing for beginners",
    ],
    relatedTools: ["tai-chi-breathing-timer", "breathing-timer"],
    relatedArticles: [
      "yoga-for-beginners-first-10-poses",
      "breathing-techniques-reduce-stress",
      "10-minute-morning-stretch-routine-beginners",
    ],
  },
  {
    topic: "Tai Chi for Arthritis: Gentle Movements That May Ease Joint Pain and Stiffness",
    category: "healthy-ageing",
    keywords: [
      "Tai Chi for arthritis",
      "Tai Chi joint pain",
      "gentle exercise for arthritis",
      "Tai Chi rheumatoid arthritis",
      "Tai Chi osteoarthritis",
      "Tai Chi for stiff joints",
    ],
    relatedTools: ["tai-chi-breathing-timer", "flexibility-tracker", "mobility-assessment"],
    relatedArticles: [
      "balance-mobility-exercises-over-50",
      "flexibility-training-improve-your-range-of-motion-at-any-age",
      "exercise-for-healthy-ageing-activity-longevity-vitality",
    ],
  },
  {
    topic: "Tai Chi vs Yoga: Which Is Better for Balance, Flexibility, and Stress?",
    category: "fitness",
    keywords: [
      "Tai Chi vs yoga",
      "Tai Chi or yoga for balance",
      "Tai Chi vs yoga for seniors",
      "Tai Chi vs yoga for stress",
      "yoga or Tai Chi for flexibility",
      "difference between Tai Chi and yoga",
    ],
    relatedTools: ["tai-chi-breathing-timer", "flexibility-tracker", "stress-reduction-checklist"],
    relatedArticles: [
      "yoga-for-beginners-first-10-poses",
      "balance-mobility-exercises-over-50",
      "breathing-techniques-reduce-stress",
    ],
  },
  {
    topic: "5 Simple Tai Chi Moves for Beginners You Can Practise at Home",
    category: "fitness",
    keywords: [
      "simple Tai Chi moves beginners",
      "Tai Chi at home",
      "easy Tai Chi exercises",
      "Tai Chi for beginners at home",
      "basic Tai Chi forms",
      "learn Tai Chi at home",
    ],
    relatedTools: ["tai-chi-breathing-timer", "flexibility-tracker"],
    relatedArticles: [
      "yoga-for-beginners-first-10-poses",
      "10-minute-morning-stretch-routine-beginners",
      "balance-mobility-exercises-over-50",
    ],
  },

  // ─── BREATHING & SLEEP (5 articles) ───────────────────────────────
  {
    topic: "Breathing Exercises Before Sleep: 5 Techniques That May Help You Fall Asleep Faster",
    category: "sleep",
    keywords: [
      "breathing exercises before sleep",
      "breathing exercises to fall asleep",
      "4-7-8 breathing for sleep",
      "bedtime breathing routine",
      "relaxation breathing for insomnia",
      "breathing techniques sleep anxiety",
    ],
    relatedTools: ["breathing-timer", "sleep-calculator"],
    relatedArticles: [
      "natural-approaches-fall-asleep-faster",
      "breathing-techniques-reduce-stress",
      "bedtime-routine-improve-sleep-quality",
    ],
  },
  {
    topic: "Box Breathing for Sleep: How the 4-4-4-4 Technique May Calm a Racing Mind at Night",
    category: "sleep",
    keywords: [
      "box breathing for sleep",
      "4-4-4-4 breathing sleep",
      "box breathing before bed",
      "box breathing insomnia",
      "breathing for racing mind at night",
      "tactical breathing for sleep",
    ],
    relatedTools: ["breathing-timer", "sleep-calculator"],
    relatedArticles: [
      "natural-approaches-fall-asleep-faster",
      "breathing-techniques-reduce-stress",
      "bedtime-routine-improve-sleep-quality",
    ],
  },
  {
    topic: "Why You Wake Up at 3am: Common Causes and What May Help You Sleep Through",
    category: "sleep",
    keywords: [
      "why do I wake up at 3am",
      "waking up at 3am every night",
      "middle of night waking causes",
      "how to stop waking up at 3am",
      "sleep maintenance insomnia",
      "waking up too early",
    ],
    relatedTools: ["sleep-calculator", "breathing-timer"],
    relatedArticles: [
      "natural-approaches-fall-asleep-faster",
      "how-much-deep-sleep-do-you-need",
      "bedtime-routine-improve-sleep-quality",
    ],
  },
  {
    topic: "Best Sleep Position for Back Pain: What Research Suggests and How to Adjust",
    category: "sleep",
    keywords: [
      "best sleep position for back pain",
      "sleeping position lower back pain",
      "how to sleep with back pain",
      "pillow placement for back pain sleep",
      "side sleeping back pain",
      "sleep posture and spine health",
    ],
    relatedTools: ["sleep-calculator", "recovery-tracker"],
    relatedArticles: [
      "natural-approaches-fall-asleep-faster",
      "bedtime-routine-improve-sleep-quality",
      "how-much-deep-sleep-do-you-need",
    ],
  },
  {
    topic: "Sleep Hygiene for Shift Workers: How to Sleep Better on an Irregular Schedule",
    category: "sleep",
    keywords: [
      "sleep hygiene for shift workers",
      "how to sleep as a shift worker",
      "night shift sleep tips",
      "rotating shift sleep schedule",
      "sleep after night shift",
      "shift work sleep disorder",
    ],
    relatedTools: ["sleep-calculator", "habit-tracker"],
    relatedArticles: [
      "sleep-hygiene-checklist-printable",
      "natural-approaches-fall-asleep-faster",
      "how-much-deep-sleep-do-you-need",
    ],
  },

  // ─── WALKING & STRESS REDUCTION (5 articles) ─────────────────────
  {
    topic: "Walking and Stress Reduction: How a Daily Walk May Lower Cortisol and Improve Your Mood",
    category: "stress",
    keywords: [
      "walking and stress reduction",
      "walking for stress relief",
      "walking lowers cortisol",
      "daily walk mental health",
      "walking for anxiety",
      "stress relief walking routine",
    ],
    relatedTools: ["walking-calorie-calculator", "stress-reduction-checklist", "habit-tracker"],
    relatedArticles: [
      "how-to-start-walking-for-fitness-plan",
      "breathing-techniques-reduce-stress",
      "daily-self-care-practices-emotional-well-being",
    ],
  },
  {
    topic: "Walking After Dinner for Blood Sugar: Does a Post-Meal Walk Actually Help?",
    category: "nutrition",
    keywords: [
      "walking after dinner blood sugar",
      "post meal walk benefits",
      "walking after eating glucose",
      "post prandial walking",
      "evening walk health benefits",
      "walking for blood sugar control",
    ],
    relatedTools: ["walking-calorie-calculator", "habit-tracker"],
    relatedArticles: [
      "how-to-start-walking-for-fitness-plan",
      "daily-walking-weight-management",
      "how-many-steps-per-day-by-age",
    ],
  },
  {
    topic: "How to Make Walking More Interesting: 12 Ideas to Stay Motivated on Daily Walks",
    category: "fitness",
    keywords: [
      "how to make walking more interesting",
      "walking motivation tips",
      "bored of walking",
      "fun walking ideas",
      "walking podcast audiobook",
      "walking challenge ideas",
    ],
    relatedTools: ["walking-calorie-calculator", "habit-tracker"],
    relatedArticles: [
      "how-to-start-walking-for-fitness-plan",
      "how-many-steps-per-day-by-age",
      "building-discipline-and-consistency-in-your-fitness-routine",
    ],
  },
  {
    topic: "Stress Management for Working Parents: Realistic Strategies That Fit a Busy Schedule",
    category: "stress",
    keywords: [
      "stress management for working parents",
      "stress relief busy parents",
      "working parent burnout",
      "quick stress relief for parents",
      "work life balance stress tips",
      "parental stress coping strategies",
    ],
    relatedTools: ["stress-reduction-checklist", "breathing-timer", "habit-tracker"],
    relatedArticles: [
      "breathing-techniques-reduce-stress",
      "workplace-habits-lower-daily-stress",
      "daily-self-care-practices-emotional-well-being",
    ],
  },
  {
    topic: "10-Minute Stress Relief Routine You Can Do at Your Desk",
    category: "stress",
    keywords: [
      "10 minute stress relief routine",
      "desk stress relief",
      "office stress exercises",
      "quick stress relief at work",
      "desk stretches for stress",
      "workplace anxiety relief",
    ],
    relatedTools: ["breathing-timer", "stress-reduction-checklist"],
    relatedArticles: [
      "workplace-habits-lower-daily-stress",
      "breathing-techniques-reduce-stress",
      "desk-exercises-office-workers-no-equipment",
    ],
  },

  // ─── NUTRITION & FASTING (5 articles) ─────────────────────────────
  {
    topic: "Intermittent Fasting for Beginners Over 40: A Safe Approach to 16:8",
    category: "nutrition",
    keywords: [
      "intermittent fasting for beginners over 40",
      "16:8 fasting over 40",
      "intermittent fasting middle aged",
      "IF for men over 40",
      "intermittent fasting safety older adults",
      "start intermittent fasting at 40",
    ],
    relatedTools: ["fasting-tracker", "calorie-calculator", "hydration-calculator"],
    relatedArticles: [
      "strength-training-after-40-build-muscle-safely",
      "exercise-for-healthy-ageing-activity-longevity-vitality",
    ],
  },
  {
    topic: "High-Protein Breakfast Ideas for Weight Loss: 10 Quick Meals Under 400 Calories",
    category: "nutrition",
    keywords: [
      "high protein breakfast for weight loss",
      "protein breakfast ideas",
      "high protein low calorie breakfast",
      "quick protein breakfast",
      "breakfast ideas under 400 calories",
      "protein breakfast meal prep",
    ],
    relatedTools: ["calorie-calculator", "macro-calculator"],
    relatedArticles: [],
  },
  {
    topic: "How Much Protein Do You Need After 50? A Practical Guide to Preventing Muscle Loss",
    category: "nutrition",
    keywords: [
      "how much protein after 50",
      "protein for older adults",
      "protein requirements over 50",
      "protein for muscle loss prevention",
      "best protein sources for seniors",
      "protein and sarcopenia",
    ],
    relatedTools: ["macro-calculator", "calorie-calculator"],
    relatedArticles: [
      "strength-training-after-40-build-muscle-safely",
      "exercise-for-healthy-ageing-activity-longevity-vitality",
    ],
  },
  {
    topic: "Anti-Inflammatory Foods: A Practical Shopping List for Reducing Chronic Inflammation",
    category: "nutrition",
    keywords: [
      "anti-inflammatory foods list",
      "anti-inflammatory diet shopping list",
      "foods that reduce inflammation",
      "anti-inflammatory meal plan",
      "inflammation fighting foods",
      "best anti-inflammatory foods",
    ],
    relatedTools: ["habit-tracker", "macro-calculator"],
    relatedArticles: [],
  },
  {
    topic: "Meal Prep for One: Weekly Prep Strategies for Single Adults Who Want to Eat Better",
    category: "nutrition",
    keywords: [
      "meal prep for one person",
      "meal prep single adult",
      "easy meal prep for one",
      "weekly meal prep for singles",
      "cooking for one healthy",
      "batch cooking for one",
    ],
    relatedTools: ["calorie-calculator", "macro-calculator"],
    relatedArticles: [],
  },

  // ─── HABITS & CONSISTENCY (5 articles) ────────────────────────────
  {
    topic: "How to Build a Morning Routine That Sticks: A Step-by-Step Habit Stacking Guide",
    category: "habits",
    keywords: [
      "how to build a morning routine",
      "morning routine habit stacking",
      "morning routine that sticks",
      "create a morning routine",
      "morning habits for success",
      "simple morning routine",
    ],
    relatedTools: ["habit-tracker", "breathing-timer"],
    relatedArticles: [
      "habit-stacking-how-to-guide-examples",
      "habit-formation-science-how-long-build-habit",
      "building-discipline-and-consistency-in-your-fitness-routine",
    ],
  },
  {
    topic: "Habit Tracking for Beginners: Why It Works and How to Start Without Overcomplicating It",
    category: "habits",
    keywords: [
      "habit tracking for beginners",
      "how to track habits",
      "simple habit tracker",
      "habit tracking benefits",
      "daily habit tracking",
      "beginner habit tracker template",
    ],
    relatedTools: ["habit-tracker"],
    relatedArticles: [
      "how-to-build-a-habit-tracker-template",
      "habit-formation-science-how-long-build-habit",
      "one-percent-better-daily-improvement-guide",
    ],
  },
  {
    topic: "The 5-Minute Rule for Exercise: How Micro-Workouts Build Long-Term Fitness Habits",
    category: "habits",
    keywords: [
      "5 minute rule exercise",
      "micro workouts",
      "short workouts effective",
      "exercise snacking",
      "minimum viable workout",
      "5 minute workout habit",
    ],
    relatedTools: ["habit-tracker", "recovery-tracker"],
    relatedArticles: [
      "building-discipline-and-consistency-in-your-fitness-routine",
      "habit-stacking-how-to-guide-examples",
      "habit-formation-science-how-long-build-habit",
    ],
  },
  {
    topic: "Evening Routine for Better Sleep and Less Stress: A Wind-Down Checklist",
    category: "habits",
    keywords: [
      "evening routine for better sleep",
      "wind down routine before bed",
      "nighttime routine checklist",
      "evening habits for stress",
      "bedtime routine adults",
      "relaxing evening routine",
    ],
    relatedTools: ["sleep-calculator", "breathing-timer", "habit-tracker"],
    relatedArticles: [
      "bedtime-routine-improve-sleep-quality",
      "natural-approaches-fall-asleep-faster",
      "breathing-techniques-reduce-stress",
    ],
  },
  {
    topic: "How to Stop Sitting All Day: Practical Movement Breaks for Desk-Bound Workers",
    category: "habits",
    keywords: [
      "how to stop sitting all day",
      "movement breaks for desk workers",
      "sitting too much health risks",
      "desk movement routine",
      "break up sitting time",
      "sedentary lifestyle solutions",
    ],
    relatedTools: ["habit-tracker", "flexibility-tracker"],
    relatedArticles: [
      "desk-exercises-office-workers-no-equipment",
      "building-discipline-and-consistency-in-your-fitness-routine",
      "daily-mobility-routine-15-minutes-to-better-movement",
    ],
  },

  // ─── RECOVERY & INJURY PREVENTION (5 articles) ────────────────────
  {
    topic: "How to Prevent Running Injuries: A Beginner's Guide to Training Smart",
    category: "fitness",
    keywords: [
      "how to prevent running injuries",
      "running injury prevention beginners",
      "common running injuries",
      "running too much too soon",
      "beginner running injury tips",
      "shin splints prevention",
    ],
    relatedTools: ["recovery-tracker", "flexibility-tracker", "walking-calorie-calculator"],
    relatedArticles: [
      "warm-up-and-cool-down-why-they-matter-and-how-to-do-them-properly",
      "stretching-routines-improve-flexibility-mobility",
      "how-to-start-walking-for-fitness-plan",
    ],
  },
  {
    topic: "Foam Rolling for Beginners: A Complete Guide to Self-Massage for Recovery",
    category: "fitness",
    keywords: [
      "foam rolling for beginners",
      "how to foam roll",
      "foam roller exercises for back",
      "foam rolling benefits recovery",
      "best foam roller for beginners",
      "self myofascial release guide",
    ],
    relatedTools: ["recovery-tracker", "flexibility-tracker"],
    relatedArticles: [
      "exercise-recovery-science-backed-strategies-to-recover-faster",
      "stretching-routines-improve-flexibility-mobility",
      "daily-mobility-routine-15-minutes-to-better-movement",
    ],
  },
  {
    topic: "Knee Pain When Squatting: Common Causes and How to Fix Your Form",
    category: "fitness",
    keywords: [
      "knee pain when squatting",
      "squatting knee pain fix",
      "why do my knees hurt when I squat",
      "squat form knee pain",
      "knee friendly squat alternatives",
      "squatting with bad knees",
    ],
    relatedTools: ["mobility-assessment", "flexibility-tracker"],
    relatedArticles: [
      "beginner-calisthenics-a-12-week-bodyweight-programme",
      "daily-mobility-routine-15-minutes-to-better-movement",
      "strength-training-after-40-build-muscle-safely",
    ],
  },
  {
    topic: "How Long Should You Rest Between Workouts? A Guide to Recovery by Exercise Type",
    category: "fitness",
    keywords: [
      "how long to rest between workouts",
      "rest days between workouts",
      "recovery time between exercise",
      "how many rest days per week",
      "muscle recovery time by body part",
      "overtraining vs under-recovery",
    ],
    relatedTools: ["recovery-tracker", "martial-arts-conditioning-planner"],
    relatedArticles: [
      "exercise-recovery-science-backed-strategies-to-recover-faster",
      "progressive-overload-explained-key-to-fitness-gains",
      "strength-training-after-40-build-muscle-safely",
    ],
  },
  {
    topic: "Stretching Before Bed: A 10-Minute Routine for Better Sleep and Less Muscle Tension",
    category: "sleep",
    keywords: [
      "stretching before bed",
      "bedtime stretching routine",
      "stretches for better sleep",
      "night time stretches",
      "stretching for muscle tension sleep",
      "pre-sleep stretching routine",
    ],
    relatedTools: ["sleep-calculator", "flexibility-tracker", "breathing-timer"],
    relatedArticles: [
      "natural-approaches-fall-asleep-faster",
      "bedtime-routine-improve-sleep-quality",
      "stretching-routines-improve-flexibility-mobility",
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════
// GENERATION ENGINE (identical to batch-seo-expansion-1)
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
  console.log("  SEO EXPANSION BATCH 2 — Long-Tail Low-Competition Content");
  console.log("═══════════════════════════════════════════════════════════");
  console.log(`Model: ${AI_MODEL} | Delay: ${DELAY_MS}ms`);
  console.log(`Topics: ${topics.length} (offset ${opts.offset}, limit ${opts.limit})`);
  console.log(`Dry run: ${opts.dryRun}\n`);

  if (opts.dryRun) {
    for (let i = 0; i < topics.length; i++) {
      const t = topics[i];
      console.log(`[${opts.offset + i + 1}] ${t.category} | ${t.topic}`);
      console.log(`    KW: ${t.keywords.slice(0, 3).join(", ")}...`);
      console.log(`    Tools: ${t.relatedTools.join(", ") || "none"}`);
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
