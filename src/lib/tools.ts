import { SITE_URL, SITE_NAME } from "./constants";
import type { FaqItem } from "./seo";

// ─── Tool Category System ───────────────────────────────────────────

export interface ToolCategoryDef {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  longDescription: string;
  icon: string;
  emoji: string;
  keywords: string[];
  /** Slug of the matching article category (for cross-linking) */
  articleCategory?: string;
  affiliateHeading?: string;
  affiliateText?: string;
  pinterestDescription?: string;
}

export const TOOL_CATEGORIES: ToolCategoryDef[] = [
  {
    slug: "sleep",
    name: "Sleep & Rest Tools",
    shortName: "Sleep",
    description:
      "Free sleep calculators and rest optimisation tools. Find your ideal bedtime, plan the perfect nap, and track caffeine to protect your sleep quality.",
    longDescription:
      "Quality sleep is the foundation of every wellness goal. Our free sleep tools help you align your schedule with your natural sleep cycles, time naps for maximum benefit without grogginess, and understand how caffeine affects your rest. Use these tools regularly to build a sleep routine that supports your energy, mood, and long-term health.",
    icon: "moon",
    emoji: "🌙",
    keywords: [
      "sleep calculator", "bedtime calculator", "nap calculator", "sleep cycle calculator",
      "caffeine and sleep", "sleep tools", "how much sleep do I need", "sleep optimisation",
    ],
    articleCategory: "sleep",
    affiliateHeading: "Sleep Better Tonight",
    affiliateText: "Weighted blankets, blue-light glasses, white noise machines, and sleep trackers to support deeper, more restorative sleep.",
    pinterestDescription: "Free sleep tools: calculate your ideal bedtime, plan power naps, and find your caffeine cutoff time. Pin for better sleep tonight!",
  },
  {
    slug: "recovery",
    name: "Recovery & Mobility Tools",
    shortName: "Recovery",
    description:
      "Free recovery trackers and mobility assessments. Monitor post-workout recovery, track flexibility progress, and test joint mobility across 8 key areas.",
    longDescription:
      "Recovery is where fitness gains are made. Whether you are tracking soreness after a tough workout, working on your hamstring flexibility, or assessing joint mobility limitations, these tools help you make smarter training decisions. Consistent tracking reveals patterns that prevent overtraining and keep you moving pain-free as you age.",
    icon: "heart-pulse",
    emoji: "💓",
    keywords: [
      "recovery tracker", "mobility assessment", "flexibility tracker", "post-workout recovery",
      "mobility test", "range of motion tracker", "stretching progress", "joint mobility",
    ],
    articleCategory: "fitness",
    affiliateHeading: "Recovery Essentials",
    affiliateText: "Foam rollers, massage guns, resistance bands, and compression gear for faster recovery between workouts.",
    pinterestDescription: "Track your recovery, test your mobility, and monitor flexibility progress with these free wellness tools. Pin to stay on top of your recovery!",
  },
  {
    slug: "fitness",
    name: "Fitness & Strength Tools",
    shortName: "Fitness",
    description:
      "Free fitness calculators for strength training, heart rate zones, and body metrics. Estimate your one-rep max, calculate training zones, and plan conditioning workouts.",
    longDescription:
      "Whether you lift weights, train martial arts, or simply want to understand your fitness metrics, these tools give you the data you need to train smarter. Calculate your one-rep max to programme effective workouts, find your heart rate training zones for optimal cardio, and build structured conditioning plans for any discipline.",
    icon: "barbell",
    emoji: "🏋️",
    keywords: [
      "one rep max calculator", "heart rate zones calculator", "BMI calculator",
      "martial arts conditioning", "fitness calculator", "strength calculator",
      "training zones", "workout planner",
    ],
    articleCategory: "fitness",
    affiliateHeading: "Strength Training Gear",
    affiliateText: "Lifting belts, wrist wraps, heart rate monitors, and training journals to level up your fitness.",
    pinterestDescription: "Calculate your 1RM, find your heart rate zones, and plan conditioning workouts with these free fitness tools. Pin for your next gym session!",
  },
  {
    slug: "nutrition",
    name: "Nutrition & Diet Tools",
    shortName: "Nutrition",
    description:
      "Free nutrition calculators for calories, macros, protein, hydration, and fasting. Get personalised daily targets based on your body and goals.",
    longDescription:
      "Nutrition is personal. Our free calculators help you find your daily calorie needs using the Mifflin-St Jeor equation, split macros for your specific goal, calculate protein requirements by activity level, estimate hydration needs, and track intermittent fasting windows. Science-based formulas, no guesswork.",
    icon: "flame",
    emoji: "🔥",
    keywords: [
      "calorie calculator", "macro calculator", "protein calculator", "TDEE calculator",
      "water intake calculator", "fasting tracker", "nutrition calculator", "how many calories",
    ],
    articleCategory: "nutrition",
    affiliateHeading: "Nutrition Essentials",
    affiliateText: "Digital food scales, meal prep containers, protein supplements, and hydration bottles to hit your daily nutrition targets.",
    pinterestDescription: "Calculate your calories, macros, protein needs, and hydration targets with these free nutrition tools. Pin to bookmark for meal planning!",
  },
  {
    slug: "body-composition",
    name: "Body Composition Tools",
    shortName: "Body Composition",
    description:
      "Free body composition calculators: body fat percentage, ideal weight, lean body mass, and waist-to-hip ratio. Understand your body beyond the scale.",
    longDescription:
      "The number on the scale tells you very little about your health. These tools help you understand what your body is actually made of — how much is fat versus lean mass, whether your weight is in a healthy range for your height, and whether your body fat distribution puts you at cardiovascular risk. Track changes over time to see real progress.",
    icon: "ruler",
    emoji: "📏",
    keywords: [
      "body fat calculator", "ideal weight calculator", "lean body mass calculator",
      "waist to hip ratio", "body composition", "body fat percentage",
      "healthy weight calculator", "fat free mass",
    ],
    articleCategory: "weight-loss",
    affiliateHeading: "Body Composition Tools",
    affiliateText: "Body fat callipers, smart scales with composition analysis, and measuring tapes for accurate at-home tracking.",
    pinterestDescription: "Measure your body fat, find your ideal weight, and assess health risks with these free body composition tools. Pin to track your progress!",
  },
  {
    slug: "cardio",
    name: "Cardio & Endurance Tools",
    shortName: "Cardio",
    description:
      "Free running, cycling, swimming, and walking calorie calculators. Calculate your pace, estimate VO2 max, convert steps to calories, and plan endurance training.",
    longDescription:
      "From couch to marathon, these tools support every stage of your cardio journey. Calculate your running pace and get race projections, estimate your VO2 max to track aerobic fitness, and see exactly how many calories your runs, rides, swims, and walks burn. Whether you are a beginner counting steps or an athlete optimising training, these tools deliver the data you need.",
    icon: "running",
    emoji: "🏃‍♂️",
    keywords: [
      "running pace calculator", "calories burned running", "VO2 max calculator",
      "cycling calorie calculator", "swimming calorie calculator", "walking calorie calculator",
      "steps to calories", "cardio calculator",
    ],
    articleCategory: "fitness",
    affiliateHeading: "Cardio & Running Gear",
    affiliateText: "GPS running watches, cycling computers, swim trackers, and heart rate monitors for tracking your cardio training.",
    pinterestDescription: "Calculate your running pace, calories burned, and VO2 max with these free cardio tools. Pin for your next training session!",
  },
  {
    slug: "stress",
    name: "Stress & Mindfulness Tools",
    shortName: "Stress",
    description:
      "Free breathing timers, guided breathwork, and stress management checklists. Reduce stress, lower anxiety, and build a daily mindfulness practice.",
    longDescription:
      "Chronic stress undermines every aspect of health. These tools give you practical, evidence-based techniques to activate your parasympathetic nervous system and calm your body in minutes. Follow guided box breathing or 4-7-8 patterns, explore Tai Chi breathwork, and use our daily checklist to build a comprehensive stress management routine.",
    icon: "wind",
    emoji: "🌬️",
    keywords: [
      "breathing timer", "box breathing", "4-7-8 breathing", "stress reduction",
      "guided breathing", "mindfulness tools", "anxiety relief", "stress management checklist",
    ],
    articleCategory: "stress",
    affiliateHeading: "Stress Relief Products",
    affiliateText: "Meditation cushions, aromatherapy diffusers, weighted blankets, and mindfulness journals to support your practice.",
    pinterestDescription: "Guided breathing exercises, Tai Chi breathwork, and stress management checklists. Pin these free tools for instant calm!",
  },
  {
    slug: "habits",
    name: "Habits & Lifestyle Tools",
    shortName: "Habits",
    description:
      "Free habit trackers and lifestyle planning tools. Build daily routines with streak tracking, and plan key life milestones with our due date calculator.",
    longDescription:
      "Lasting health improvements come from consistent daily habits, not dramatic overhauls. Our habit tracker helps you build and maintain up to 10 daily habits with visual streak counters that keep you motivated. We also offer practical lifestyle planning tools like our pregnancy due date calculator for key life moments.",
    icon: "check-square",
    emoji: "✅",
    keywords: [
      "habit tracker", "daily habit tracker", "habit streak counter", "routine tracker",
      "pregnancy due date calculator", "due date calculator", "habit building",
      "daily routine planner",
    ],
    articleCategory: "habits",
    affiliateHeading: "Habit-Building Essentials",
    affiliateText: "Journals, planners, habit-tracking notebooks, and prenatal vitamins to support your daily routines and life milestones.",
    pinterestDescription: "Build better daily habits with streak tracking and plan life milestones. Pin these free tools to start your journey!",
  },
];

export type ToolCategorySlug = (typeof TOOL_CATEGORIES)[number]["slug"];

// ─── Tool Definitions ───────────────────────────────────────────────

export interface ToolDefinition {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  longDescription: string;
  icon: string;
  category: string;
  keywords: string[];
  faqs: FaqItem[];
  relatedTools: string[];
  relatedArticles: { title: string; href: string }[];
  affiliateHeading?: string;
  affiliateText?: string;
}

export const TOOLS_REGISTRY: ToolDefinition[] = [
  {
    slug: "sleep-calculator",
    name: "Sleep Calculator - Find Your Ideal Bedtime & Wake Time",
    shortName: "Sleep Calculator",
    description:
      "Calculate optimal bedtimes and wake-up times based on 90-minute sleep cycles. Align your schedule to wake between cycles and feel more rested every morning.",
    longDescription:
      "Our free sleep calculator uses the science of 90-minute sleep cycles to help you find the best time to go to bed or wake up. Most adults cycle through light sleep, deep sleep, and REM sleep roughly every 90 minutes. Waking at the end of a complete cycle — rather than mid-cycle — can help you feel more alert and less groggy.",
    icon: "moon",
    category: "sleep",
    keywords: [
      "sleep calculator",
      "bedtime calculator",
      "sleep cycle calculator",
      "when to go to bed",
      "optimal wake time",
      "sleep schedule calculator",
      "90 minute sleep cycle",
      "how much sleep do I need",
    ],
    faqs: [
      {
        question: "How does the sleep calculator work?",
        answer:
          "The calculator uses 90-minute sleep cycles to suggest optimal bedtimes or wake times. It also adds 15 minutes for the average time it takes to fall asleep. By waking at the end of a cycle you avoid interrupting deep sleep, which can cause grogginess.",
      },
      {
        question: "How many sleep cycles do I need per night?",
        answer:
          "Most adults need 4 to 6 complete sleep cycles, which is roughly 6 to 9 hours. Five cycles (7.5 hours) is the most common recommendation for healthy adults.",
      },
      {
        question: "Is 6 hours of sleep enough?",
        answer:
          "Six hours equals four 90-minute cycles, which is on the low end. While some people function adequately on 6 hours, most sleep research suggests 7-9 hours for optimal health, mood, and cognitive performance.",
      },
      {
        question: "What is the best time to go to bed?",
        answer:
          "The best bedtime depends on when you need to wake up. Use the calculator to work backwards from your alarm time. For a 7 AM wake-up, ideal bedtimes are around 9:45 PM, 11:15 PM, or 12:45 AM.",
      },
      {
        question: "Can naps replace lost night-time sleep?",
        answer:
          "Short naps (20-30 minutes) can temporarily boost alertness, but they do not fully replace deep sleep and REM sleep that occur during longer overnight sleep periods.",
      },
    ],
    relatedTools: [
      "hydration-calculator",
      "calorie-calculator",
      "breathing-timer",
      "recovery-tracker",
    ],
    relatedArticles: [
      { title: "How Sleep Cycles Affect Your Energy Levels", href: "/sleep/how-sleep-cycles-affect-energy" },
      { title: "Evening Routines for Better Sleep", href: "/sleep/evening-routines-for-better-sleep" },
      { title: "10 Habits That Ruin Your Sleep Quality", href: "/sleep/habits-that-ruin-sleep-quality" },
    ],
    affiliateHeading: "Sleep Better Tonight",
    affiliateText:
      "Looking for products to support better sleep? From weighted blankets to blue-light-blocking glasses, these picks can complement your sleep schedule.",
  },
  {
    slug: "hydration-calculator",
    name: "Water Intake Calculator - Daily Hydration Guide",
    shortName: "Water Intake Calculator",
    description:
      "Calculate how much water you should drink daily based on your weight, activity level, and climate. Get a personalised hydration target in litres and glasses.",
    longDescription:
      "Proper hydration supports energy, digestion, skin health, and cognitive function. Our free water intake calculator estimates your ideal daily fluid intake using your body weight, physical activity level, and local climate conditions.",
    icon: "droplets",
    category: "nutrition",
    keywords: [
      "water intake calculator",
      "how much water should I drink",
      "daily water calculator",
      "hydration calculator",
      "water per day",
      "daily fluid intake",
      "hydration tracker",
    ],
    faqs: [
      {
        question: "How much water should I drink per day?",
        answer:
          "A common baseline is approximately 33ml per kilogram of body weight. For a 70 kg person, that is about 2.3 litres. This increases with exercise, hot weather, and other factors.",
      },
      {
        question: "Does coffee count towards daily water intake?",
        answer:
          "Yes, moderate coffee and tea consumption contributes to your daily fluid intake. While caffeine has a mild diuretic effect, the net hydration from these beverages is still positive.",
      },
      {
        question: "What are signs of dehydration?",
        answer:
          "Common signs include dark yellow urine, fatigue, headache, dry mouth, dizziness, and reduced concentration. Pale straw-coloured urine generally indicates adequate hydration.",
      },
      {
        question: "Should I drink more water when exercising?",
        answer:
          "Yes. The American College of Sports Medicine recommends an additional 350-700ml of water per hour of exercise, depending on intensity and sweat rate.",
      },
      {
        question: "Can you drink too much water?",
        answer:
          "Yes, excessive water intake (hyponatraemia) can dangerously dilute blood sodium levels. Stick to recommended amounts and drink when thirsty rather than forcing excessive intake.",
      },
    ],
    relatedTools: [
      "calorie-calculator",
      "macro-calculator",
      "recovery-tracker",
      "walking-calorie-calculator",
    ],
    relatedArticles: [
      { title: "Signs You're Not Drinking Enough Water", href: "/nutrition/signs-not-drinking-enough-water" },
      { title: "Hydration and Exercise Performance", href: "/fitness/hydration-exercise-performance" },
    ],
    affiliateHeading: "Stay Hydrated Effortlessly",
    affiliateText:
      "From smart water bottles that track your intake to electrolyte supplements for active days, these products help you hit your hydration goals.",
  },
  {
    slug: "calorie-calculator",
    name: "Calorie & TDEE Calculator - Daily Energy Expenditure",
    shortName: "Calorie Calculator",
    description:
      "Calculate your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) using the Mifflin-St Jeor equation. Get calorie targets for weight loss, maintenance, and gain.",
    longDescription:
      "Understanding how many calories your body needs each day is the foundation of any nutrition plan. Our calorie calculator uses the Mifflin-St Jeor equation — considered the most accurate BMR formula for most adults — to estimate your resting energy needs, then adjusts for your activity level to give you a practical daily target.",
    icon: "flame",
    category: "nutrition",
    keywords: [
      "calorie calculator",
      "TDEE calculator",
      "BMR calculator",
      "daily calorie needs",
      "how many calories do I need",
      "maintenance calories",
      "calorie deficit calculator",
      "Mifflin-St Jeor calculator",
    ],
    faqs: [
      {
        question: "What is TDEE?",
        answer:
          "TDEE stands for Total Daily Energy Expenditure. It is the total number of calories your body burns in a day, including your basal metabolic rate, physical activity, and the thermic effect of food.",
      },
      {
        question: "What is the Mifflin-St Jeor equation?",
        answer:
          "The Mifflin-St Jeor equation is a formula used to estimate Basal Metabolic Rate. For men: BMR = 10 x weight(kg) + 6.25 x height(cm) - 5 x age - 5. For women: BMR = 10 x weight(kg) + 6.25 x height(cm) - 5 x age - 161.",
      },
      {
        question: "How accurate are calorie calculators?",
        answer:
          "Calorie calculators provide estimates within about 10% accuracy for most people. Individual factors like genetics, muscle mass, hormones, and metabolic adaptation can cause your actual needs to differ from the estimate.",
      },
      {
        question: "What calorie deficit is safe for weight loss?",
        answer:
          "A deficit of 500 calories per day (roughly 0.5 kg or 1 lb per week) is generally considered safe and sustainable. Extreme deficits below 1,200 calories (women) or 1,500 calories (men) are not recommended without medical supervision.",
      },
      {
        question: "Should I eat back exercise calories?",
        answer:
          "It depends on your goals. If you are already in a moderate calorie deficit, eating back some exercise calories can prevent excessive restriction. If your TDEE already accounts for your activity level, additional adjustments may not be needed.",
      },
    ],
    relatedTools: [
      "macro-calculator",
      "walking-calorie-calculator",
      "hydration-calculator",
      "fasting-tracker",
    ],
    relatedArticles: [
      { title: "Understanding Your Metabolism", href: "/nutrition/understanding-metabolism" },
      { title: "How to Count Calories Without Obsessing", href: "/weight-loss/count-calories-without-obsessing" },
    ],
    affiliateHeading: "Tools for Tracking Nutrition",
    affiliateText:
      "From digital food scales to meal prep containers, these tools make calorie tracking more convenient and accurate.",
  },
  {
    slug: "walking-calorie-calculator",
    name: "Walking Calorie Calculator - Calories Burned Walking",
    shortName: "Walking Calorie Calculator",
    description:
      "Calculate how many calories you burn walking based on distance, duration, speed, weight, and terrain. Covers flat walking, incline, and hiking.",
    longDescription:
      "Walking is one of the most accessible forms of exercise. Whether you take a brisk morning walk or a long weekend hike, our walking calorie calculator estimates your energy expenditure using MET (Metabolic Equivalent of Task) values adjusted for your speed, weight, and terrain.",
    icon: "footprints",
    category: "cardio",
    keywords: [
      "walking calorie calculator",
      "calories burned walking",
      "how many calories does walking burn",
      "walking for weight loss",
      "steps to calories",
      "hiking calorie calculator",
      "calories per mile walking",
    ],
    faqs: [
      {
        question: "How many calories does walking 10,000 steps burn?",
        answer:
          "For an average person weighing 70 kg, 10,000 steps (roughly 8 km) burns approximately 350-450 calories, depending on walking speed and terrain.",
      },
      {
        question: "Does walking speed affect calories burned?",
        answer:
          "Yes. Walking at a brisk pace (5-6 km/h) burns significantly more calories than a slow stroll (3 km/h). Faster walking increases the MET value, meaning your body uses more energy per minute.",
      },
      {
        question: "Is walking effective for weight loss?",
        answer:
          "Walking is an effective and sustainable way to support weight loss, especially when combined with a moderate calorie deficit. Regular brisk walking can burn 200-400 calories per session.",
      },
      {
        question: "How does body weight affect calories burned while walking?",
        answer:
          "Heavier individuals burn more calories for the same walk because their bodies require more energy to move. A 90 kg person burns roughly 30% more calories than a 70 kg person over the same distance.",
      },
      {
        question: "Does walking uphill burn more calories?",
        answer:
          "Yes, walking on an incline substantially increases calorie burn. A moderate uphill grade can increase energy expenditure by 50-100% compared to flat terrain at the same speed.",
      },
    ],
    relatedTools: [
      "calorie-calculator",
      "macro-calculator",
      "hydration-calculator",
      "habit-tracker",
    ],
    relatedArticles: [
      { title: "Walking for Weight Loss: A Complete Guide", href: "/fitness/walking-for-weight-loss" },
      { title: "How to Start a Daily Walking Habit", href: "/habits/start-daily-walking-habit" },
    ],
    affiliateHeading: "Gear Up for Your Walk",
    affiliateText:
      "From fitness trackers that count your steps to supportive walking shoes, these products can help you get the most from your daily walks.",
  },
  {
    slug: "flexibility-tracker",
    name: "Flexibility Tracker - Track Your Stretching Progress",
    shortName: "Flexibility Tracker",
    description:
      "Track your flexibility progress across key body areas. Log stretching sessions, monitor range of motion improvements, and build a consistent stretching routine.",
    longDescription:
      "Improving flexibility takes consistency. Our free flexibility tracker helps you log stretching sessions for key muscle groups, rate your range of motion over time, and stay motivated with a visual progress log. Whether you are working on hamstring flexibility, hip mobility, or shoulder range, this tool keeps you accountable.",
    icon: "stretch",
    category: "recovery",
    keywords: [
      "flexibility tracker",
      "stretching tracker",
      "flexibility progress",
      "range of motion tracker",
      "stretching log",
      "flexibility test",
      "how to improve flexibility",
    ],
    faqs: [
      {
        question: "How often should I stretch to improve flexibility?",
        answer:
          "Research suggests stretching at least 3-5 times per week for each muscle group. Consistency matters more than intensity. Holding static stretches for 30-60 seconds is generally recommended.",
      },
      {
        question: "How long does it take to see flexibility improvements?",
        answer:
          "Most people notice measurable improvements within 4-6 weeks of consistent daily stretching. Significant gains may take 3-6 months depending on your starting point and the muscle groups involved.",
      },
      {
        question: "Is it better to stretch before or after exercise?",
        answer:
          "Dynamic stretching (leg swings, arm circles) is recommended before exercise. Static stretching (holding positions) is best performed after exercise when muscles are warm.",
      },
      {
        question: "Can you be too flexible?",
        answer:
          "Yes, hypermobility (excessive flexibility) can increase the risk of joint instability and injury. Flexibility training should be balanced with strength training to maintain joint stability.",
      },
    ],
    relatedTools: [
      "mobility-assessment",
      "recovery-tracker",
      "tai-chi-breathing-timer",
      "martial-arts-conditioning-planner",
    ],
    relatedArticles: [
      { title: "Best Stretches for Desk Workers", href: "/fitness/stretches-for-desk-workers" },
      { title: "How Flexibility Supports Healthy Ageing", href: "/healthy-ageing/flexibility-supports-healthy-ageing" },
    ],
    affiliateHeading: "Stretch Further",
    affiliateText:
      "Resistance bands, yoga mats, and foam rollers to support your flexibility routine.",
  },
  {
    slug: "mobility-assessment",
    name: "Mobility Assessment Tool - Test Your Joint Mobility",
    shortName: "Mobility Assessment",
    description:
      "Assess your joint mobility across 8 key areas with guided self-tests. Identify limitations, get a mobility score, and receive personalised improvement suggestions.",
    longDescription:
      "Good mobility is the foundation of pain-free movement. This free mobility assessment guides you through simple self-tests for your ankles, hips, thoracic spine, shoulders, and more. Rate each area and receive an overall mobility score along with targeted suggestions to address any limitations.",
    icon: "activity",
    category: "recovery",
    keywords: [
      "mobility assessment",
      "joint mobility test",
      "mobility score",
      "movement assessment",
      "functional movement screen",
      "hip mobility test",
      "shoulder mobility test",
      "ankle mobility test",
    ],
    faqs: [
      {
        question: "What is the difference between mobility and flexibility?",
        answer:
          "Flexibility refers to the passive range of motion of a muscle, while mobility refers to the active, controlled range of motion around a joint. Good mobility requires both flexibility and the strength to control that range.",
      },
      {
        question: "How do I know if I have poor mobility?",
        answer:
          "Signs of poor mobility include difficulty performing basic movements like a deep squat, reaching overhead, or touching your toes. Joint stiffness, compensatory movement patterns, and recurring aches can also indicate mobility limitations.",
      },
      {
        question: "How often should I do mobility work?",
        answer:
          "Ideally, incorporate 10-15 minutes of mobility work daily, especially targeting areas where you scored lowest. Mobility can also be integrated into warm-ups before exercise.",
      },
      {
        question: "Can mobility exercises help with back pain?",
        answer:
          "Poor hip and thoracic spine mobility are common contributors to lower back pain. Improving mobility in these areas can reduce compensatory stress on the lumbar spine. Always consult a professional for persistent pain.",
      },
    ],
    relatedTools: [
      "flexibility-tracker",
      "recovery-tracker",
      "martial-arts-conditioning-planner",
      "tai-chi-breathing-timer",
    ],
    relatedArticles: [
      { title: "Why Mobility Matters More Than Flexibility", href: "/fitness/mobility-vs-flexibility" },
      { title: "5 Minute Morning Mobility Routine", href: "/fitness/morning-mobility-routine" },
    ],
    affiliateHeading: "Mobility Tools",
    affiliateText:
      "Lacrosse balls, mobility sticks, and foam rollers to support your joint health and movement quality.",
  },
  {
    slug: "recovery-tracker",
    name: "Recovery Tracker - Monitor Your Post-Workout Recovery",
    shortName: "Recovery Tracker",
    description:
      "Track your daily recovery score based on sleep quality, soreness, energy, mood, and heart rate. Optimise your training by knowing when to push hard and when to rest.",
    longDescription:
      "Recovery is where fitness gains are made. Our free recovery tracker helps you log daily metrics — sleep quality, muscle soreness, energy levels, mood, and resting heart rate — to generate a recovery score. Use it to decide whether to train hard, do active recovery, or take a full rest day.",
    icon: "heart-pulse",
    category: "recovery",
    keywords: [
      "recovery tracker",
      "workout recovery",
      "recovery score",
      "rest day calculator",
      "muscle recovery tracker",
      "training recovery",
      "overtraining signs",
      "post workout recovery",
    ],
    faqs: [
      {
        question: "How do I know if I'm recovered enough to train?",
        answer:
          "Key indicators include good sleep quality, low muscle soreness, stable or low resting heart rate, positive mood, and adequate energy levels. A recovery score above 70% generally suggests readiness for intense training.",
      },
      {
        question: "How long does muscle recovery take?",
        answer:
          "Most muscle groups need 48-72 hours to recover from intense resistance training. Lighter activities like walking or yoga may require only 24 hours. Recovery time varies with training intensity, nutrition, sleep, and individual factors.",
      },
      {
        question: "What are signs of overtraining?",
        answer:
          "Persistent fatigue, declining performance, increased resting heart rate, frequent illness, mood disturbances, poor sleep, and prolonged muscle soreness are common signs of overtraining or under-recovery.",
      },
      {
        question: "Does sleep affect recovery?",
        answer:
          "Sleep is the single most important recovery factor. During deep sleep, your body releases growth hormone, repairs tissue, and consolidates motor learning. Poor sleep significantly impairs physical recovery.",
      },
    ],
    relatedTools: [
      "sleep-calculator",
      "flexibility-tracker",
      "mobility-assessment",
      "breathing-timer",
    ],
    relatedArticles: [
      { title: "Active Recovery: What to Do on Rest Days", href: "/fitness/active-recovery-rest-days" },
      { title: "How Sleep Fuels Muscle Recovery", href: "/sleep/sleep-fuels-muscle-recovery" },
    ],
    affiliateHeading: "Recovery Essentials",
    affiliateText:
      "Massage guns, foam rollers, and compression gear to support faster recovery between workouts.",
  },
  {
    slug: "breathing-timer",
    name: "Breathing Timer - Guided Breathing Exercises",
    shortName: "Breathing Timer",
    description:
      "Follow guided breathing patterns including box breathing, 4-7-8, and deep belly breathing. Reduce stress, lower heart rate, and improve focus with timed sessions.",
    longDescription:
      "Controlled breathing is one of the fastest ways to activate your parasympathetic nervous system and reduce stress. Our free breathing timer guides you through popular techniques — box breathing (used by Navy SEALs), the 4-7-8 method, and deep belly breathing — with visual cues and adjustable session lengths.",
    icon: "wind",
    category: "stress",
    keywords: [
      "breathing timer",
      "box breathing",
      "4-7-8 breathing",
      "guided breathing exercise",
      "deep breathing timer",
      "breathing for anxiety",
      "breathing for sleep",
      "stress breathing technique",
      "breathing exercise app",
    ],
    faqs: [
      {
        question: "What is box breathing?",
        answer:
          "Box breathing is a technique where you breathe in for 4 seconds, hold for 4 seconds, breathe out for 4 seconds, and hold for 4 seconds. It is used by military personnel and athletes to manage stress and improve focus.",
      },
      {
        question: "What is the 4-7-8 breathing technique?",
        answer:
          "The 4-7-8 technique involves inhaling for 4 seconds, holding for 7 seconds, and exhaling for 8 seconds. Developed by Dr. Andrew Weil, it is designed to promote relaxation and help with falling asleep.",
      },
      {
        question: "How long should I do breathing exercises?",
        answer:
          "Even 2-3 minutes of focused breathing can produce measurable reductions in heart rate and stress hormones. For deeper relaxation, aim for 5-10 minute sessions. Consistency matters more than session length.",
      },
      {
        question: "Can breathing exercises help with anxiety?",
        answer:
          "Yes. Slow, controlled breathing activates the vagus nerve and shifts your nervous system from fight-or-flight (sympathetic) to rest-and-digest (parasympathetic) mode, which can reduce anxiety symptoms.",
      },
      {
        question: "When is the best time to do breathing exercises?",
        answer:
          "Breathing exercises are beneficial any time but are especially helpful first thing in the morning, before stressful events, during work breaks, and before bed to promote sleep.",
      },
    ],
    relatedTools: [
      "tai-chi-breathing-timer",
      "stress-reduction-checklist",
      "sleep-calculator",
      "recovery-tracker",
    ],
    relatedArticles: [
      { title: "Box Breathing: The Navy SEAL Stress Technique", href: "/stress/box-breathing-technique" },
      { title: "Breathing Exercises for Better Sleep", href: "/sleep/breathing-exercises-for-sleep" },
    ],
    affiliateHeading: "Enhance Your Practice",
    affiliateText:
      "Meditation cushions, essential oil diffusers, and calming sound machines to create the perfect environment for breathwork.",
  },
  {
    slug: "habit-tracker",
    name: "Habit Tracker - Build Better Daily Routines",
    shortName: "Habit Tracker",
    description:
      "Track up to 10 daily habits with a visual streak counter. Build consistency, monitor your longest streaks, and develop healthier routines over time.",
    longDescription:
      "Building lasting habits requires consistency and visibility. Our free habit tracker lets you define up to 10 daily habits, check them off each day, and visualise your streaks. Research shows that tracking your habits significantly increases the likelihood of maintaining them.",
    icon: "check-square",
    category: "habits",
    keywords: [
      "habit tracker",
      "daily habit tracker",
      "habit streak counter",
      "habit building",
      "routine tracker",
      "21 day habit tracker",
      "habit tracker online",
      "daily routine planner",
    ],
    faqs: [
      {
        question: "How long does it take to form a habit?",
        answer:
          "Research from University College London suggests it takes an average of 66 days to form an automatic habit, though this ranges from 18 to 254 days depending on the complexity of the behaviour and individual factors.",
      },
      {
        question: "How many habits should I track at once?",
        answer:
          "Start with 3-5 habits. Tracking too many habits at once can feel overwhelming and reduce adherence. Once your initial habits feel automatic, you can gradually add more.",
      },
      {
        question: "What happens if I break my streak?",
        answer:
          "Missing one day has minimal impact on long-term habit formation. Research shows that missing a single day does not significantly affect the automaticity of a habit. The key is to resume immediately rather than abandoning the habit.",
      },
      {
        question: "What are the best habits to track?",
        answer:
          "Start with foundational habits that cascade into other improvements: drinking enough water, sleeping 7+ hours, exercising for 30 minutes, eating a vegetable with each meal, and spending 10 minutes on mindfulness.",
      },
    ],
    relatedTools: [
      "fasting-tracker",
      "hydration-calculator",
      "sleep-calculator",
      "stress-reduction-checklist",
    ],
    relatedArticles: [
      { title: "The Science of Habit Formation", href: "/habits/science-of-habit-formation" },
      { title: "Morning Routines That Actually Stick", href: "/habits/morning-routines-that-stick" },
    ],
    affiliateHeading: "Habit-Building Essentials",
    affiliateText:
      "Journals, planners, and habit-tracking notebooks to complement your digital tracking.",
  },
  {
    slug: "fasting-tracker",
    name: "Fasting Tracker - Intermittent Fasting Timer",
    shortName: "Fasting Tracker",
    description:
      "Track your intermittent fasting windows with a visual countdown timer. Supports 16:8, 18:6, 20:4, and custom fasting schedules.",
    longDescription:
      "Whether you follow 16:8, 18:6, 20:4, or a custom intermittent fasting schedule, our free fasting tracker helps you stay on track. Set your fasting window, start the timer, and see exactly where you are in your fast with a visual progress indicator and countdown.",
    icon: "timer",
    category: "nutrition",
    keywords: [
      "fasting tracker",
      "intermittent fasting timer",
      "16:8 fasting",
      "fasting app",
      "fasting window tracker",
      "intermittent fasting schedule",
      "when to eat intermittent fasting",
      "IF timer",
    ],
    faqs: [
      {
        question: "What is 16:8 intermittent fasting?",
        answer:
          "The 16:8 method involves fasting for 16 hours and eating within an 8-hour window each day. For example, eating between 12 PM and 8 PM, and fasting from 8 PM to 12 PM the next day.",
      },
      {
        question: "What can I drink during a fast?",
        answer:
          "Water, black coffee, and unsweetened tea are generally considered acceptable during a fast as they contain no significant calories. Anything with calories, including milk or sugar, breaks a fast.",
      },
      {
        question: "Is intermittent fasting safe?",
        answer:
          "For most healthy adults, intermittent fasting is considered safe. However, it is not recommended for pregnant or breastfeeding women, people with eating disorders, children, or those with certain medical conditions. Always consult your doctor before starting.",
      },
      {
        question: "Which fasting schedule is best for beginners?",
        answer:
          "The 16:8 method is the most popular starting point because it aligns with many people's natural eating patterns. Simply skip breakfast and eat between noon and 8 PM. Gradually extend the fasting window if desired.",
      },
      {
        question: "Does intermittent fasting help with weight loss?",
        answer:
          "Intermittent fasting can support weight loss primarily by reducing overall calorie intake. Some research also suggests benefits for insulin sensitivity and metabolic health, though results vary by individual.",
      },
    ],
    relatedTools: [
      "calorie-calculator",
      "macro-calculator",
      "habit-tracker",
      "hydration-calculator",
    ],
    relatedArticles: [
      { title: "Beginner's Guide to Intermittent Fasting", href: "/nutrition/beginners-guide-intermittent-fasting" },
      { title: "What Breaks a Fast?", href: "/nutrition/what-breaks-a-fast" },
    ],
    affiliateHeading: "Fasting Support",
    affiliateText:
      "Electrolyte supplements, herbal teas, and meal prep containers to support your fasting lifestyle.",
  },
  {
    slug: "macro-calculator",
    name: "Macro Calculator - Protein, Carbs & Fat Breakdown",
    shortName: "Macro Calculator",
    description:
      "Calculate your daily macronutrient targets (protein, carbs, fat) based on your TDEE and fitness goals. Supports weight loss, maintenance, and muscle gain presets.",
    longDescription:
      "Macronutrients — protein, carbohydrates, and fat — each play a distinct role in your body. Our free macro calculator takes your TDEE (total daily energy expenditure) and distributes it across macros based on your goal: weight loss, maintenance, or muscle building. Get gram-level targets for each macronutrient.",
    icon: "pie-chart",
    category: "nutrition",
    keywords: [
      "macro calculator",
      "macronutrient calculator",
      "protein calculator",
      "how much protein do I need",
      "macro split calculator",
      "carbs fat protein calculator",
      "IIFYM calculator",
      "flexible dieting calculator",
    ],
    faqs: [
      {
        question: "What are macronutrients?",
        answer:
          "Macronutrients are the three nutrients your body needs in large amounts: protein (4 kcal/g), carbohydrates (4 kcal/g), and fat (9 kcal/g). Each plays different roles in energy production, muscle repair, and bodily functions.",
      },
      {
        question: "What is a good macro split for weight loss?",
        answer:
          "A common weight loss macro split is 40% protein, 30% carbohydrates, and 30% fat. Higher protein helps preserve muscle mass during a calorie deficit. Adjust based on your preferences and how you feel.",
      },
      {
        question: "How much protein do I need per day?",
        answer:
          "For general health, 0.8g per kg of body weight is the minimum recommendation. For active individuals or those building muscle, 1.6-2.2g per kg is commonly recommended. This calculator adjusts based on your goal.",
      },
      {
        question: "Do I need to track macros exactly?",
        answer:
          "Perfect tracking is not necessary. Aiming within 10% of your targets each day is sufficient for most goals. Consistency over weeks matters more than hitting exact numbers daily.",
      },
    ],
    relatedTools: [
      "calorie-calculator",
      "walking-calorie-calculator",
      "fasting-tracker",
      "hydration-calculator",
    ],
    relatedArticles: [
      { title: "How to Count Macros: A Beginner's Guide", href: "/nutrition/how-to-count-macros" },
      { title: "High-Protein Meal Ideas", href: "/nutrition/high-protein-meal-ideas" },
    ],
    affiliateHeading: "Macro-Friendly Kitchen",
    affiliateText:
      "Digital food scales, meal prep containers, and protein supplements to help you hit your macro targets.",
  },
  {
    slug: "martial-arts-conditioning-planner",
    name: "Martial Arts Conditioning Planner - Training Program Builder",
    shortName: "Martial Arts Conditioning",
    description:
      "Build a personalised martial arts conditioning program. Select your discipline, experience level, and goals to get a structured weekly training plan.",
    longDescription:
      "Martial arts conditioning demands a unique blend of strength, endurance, flexibility, and explosiveness. Our free planner generates a structured weekly program tailored to your discipline — whether boxing, BJJ, Muay Thai, karate, or MMA — your experience level, and your specific conditioning goals.",
    icon: "swords",
    category: "fitness",
    keywords: [
      "martial arts conditioning",
      "martial arts training plan",
      "boxing conditioning workout",
      "MMA workout plan",
      "BJJ conditioning",
      "martial arts strength training",
      "fight conditioning program",
      "combat sports training",
    ],
    faqs: [
      {
        question: "How often should martial artists do conditioning?",
        answer:
          "Most martial artists benefit from 2-4 dedicated conditioning sessions per week in addition to their technical training. The exact frequency depends on competition schedules, experience level, and recovery capacity.",
      },
      {
        question: "What are the key components of martial arts conditioning?",
        answer:
          "Key components include cardiovascular endurance (aerobic and anaerobic), muscular strength, power and explosiveness, grip strength, core stability, flexibility, and sport-specific movement patterns.",
      },
      {
        question: "Should I lift weights for martial arts?",
        answer:
          "Yes, resistance training improves striking power, grappling strength, and injury resilience. Focus on compound movements (squats, deadlifts, pull-ups, presses) and explosive exercises (plyometrics, medicine ball throws).",
      },
      {
        question: "How do I avoid overtraining in martial arts?",
        answer:
          "Monitor your recovery, periodise your training (varying intensity throughout the week), ensure adequate sleep and nutrition, and include at least 1-2 full rest days per week.",
      },
    ],
    relatedTools: [
      "recovery-tracker",
      "flexibility-tracker",
      "mobility-assessment",
      "tai-chi-breathing-timer",
    ],
    relatedArticles: [
      { title: "Strength Training for Martial Artists", href: "/fitness/strength-training-martial-artists" },
      { title: "Recovery Tips for Combat Athletes", href: "/fitness/recovery-tips-combat-athletes" },
    ],
    affiliateHeading: "Training Gear",
    affiliateText:
      "Resistance bands, heavy bags, skipping ropes, and conditioning equipment for martial artists.",
  },
  {
    slug: "tai-chi-breathing-timer",
    name: "Tai Chi Breathing Timer - Guided Breathwork for Tai Chi",
    shortName: "Tai Chi Breathing Timer",
    description:
      "Follow guided Tai Chi breathing patterns with adjustable pace. Practice diaphragmatic breathing, reverse breathing, and flowing breath sequences for your Tai Chi practice.",
    longDescription:
      "Breathing is the foundation of Tai Chi practice. Our specialised Tai Chi breathing timer guides you through traditional breathing techniques — natural diaphragmatic breathing, reverse abdominal breathing, and flowing breath coordination — with adjustable tempos that match common Tai Chi form speeds.",
    icon: "leaf",
    category: "stress",
    keywords: [
      "Tai Chi breathing",
      "Tai Chi breathing timer",
      "qigong breathing",
      "diaphragmatic breathing",
      "reverse breathing",
      "Tai Chi meditation",
      "Tai Chi for beginners",
      "Chinese breathing exercises",
    ],
    faqs: [
      {
        question: "What is Tai Chi breathing?",
        answer:
          "Tai Chi breathing typically involves slow, deep diaphragmatic breaths coordinated with movement. Inhale during opening or rising movements and exhale during closing or sinking movements. The pace is much slower than normal breathing.",
      },
      {
        question: "What is reverse breathing in Tai Chi?",
        answer:
          "Reverse breathing (also called Taoist breathing) involves contracting the abdomen on the inhale and expanding it on the exhale — the opposite of natural diaphragmatic breathing. It is an advanced technique used in some Tai Chi and Qigong practices.",
      },
      {
        question: "How long should Tai Chi breathing sessions last?",
        answer:
          "Beginners should start with 5-10 minutes and gradually work up to 15-20 minutes. The focus should be on quality and relaxation rather than duration. Even a few minutes of conscious breathing can be beneficial.",
      },
      {
        question: "Can I practice Tai Chi breathing without doing the forms?",
        answer:
          "Yes, Tai Chi breathing exercises (sometimes called standing Qigong or Zhan Zhuang) can be practised on their own. They are excellent for stress reduction, improving lung capacity, and developing body awareness.",
      },
    ],
    relatedTools: [
      "breathing-timer",
      "stress-reduction-checklist",
      "flexibility-tracker",
      "mobility-assessment",
    ],
    relatedArticles: [
      { title: "Tai Chi for Beginners: Getting Started", href: "/stress/tai-chi-for-beginners" },
      { title: "Benefits of Tai Chi for Stress Reduction", href: "/stress/tai-chi-stress-reduction-benefits" },
    ],
    affiliateHeading: "Tai Chi Practice Essentials",
    affiliateText:
      "Tai Chi shoes, meditation cushions, and instructional books to deepen your practice.",
  },
  {
    slug: "stress-reduction-checklist",
    name: "Stress Reduction Checklist - Daily Stress Management Plan",
    shortName: "Stress Reduction Checklist",
    description:
      "Work through a science-backed daily stress reduction checklist. Track which stress management techniques you use and build a personalised anti-stress routine.",
    longDescription:
      "Managing stress is not about one big intervention — it is about consistently applying small, evidence-based techniques throughout your day. Our interactive stress reduction checklist covers physical, mental, social, and environmental strategies. Check off what you do each day and build a stress management routine that works for you.",
    icon: "shield-check",
    category: "stress",
    keywords: [
      "stress reduction checklist",
      "stress management techniques",
      "how to reduce stress",
      "daily stress relief",
      "stress reduction plan",
      "stress management checklist",
      "anxiety relief techniques",
      "stress coping strategies",
    ],
    faqs: [
      {
        question: "What are the most effective stress reduction techniques?",
        answer:
          "Research consistently supports regular exercise, adequate sleep, mindfulness meditation, deep breathing, social connection, and time in nature as the most effective stress management strategies. The best technique is one you will actually do consistently.",
      },
      {
        question: "How long does it take for stress management techniques to work?",
        answer:
          "Some techniques, like deep breathing, produce immediate physiological changes within 1-2 minutes. Others, like regular exercise and meditation, show significant cumulative benefits over 4-8 weeks of consistent practice.",
      },
      {
        question: "Can stress cause physical symptoms?",
        answer:
          "Yes, chronic stress can cause headaches, muscle tension, digestive issues, elevated blood pressure, weakened immunity, sleep problems, and fatigue. These physical symptoms often improve when stress is managed effectively.",
      },
      {
        question: "How many stress management activities should I do daily?",
        answer:
          "Aim for at least 3-5 activities from the checklist each day. You do not need to do everything. Focus on a mix of physical (exercise, breathing), mental (mindfulness, gratitude), and social (connection, support) strategies.",
      },
    ],
    relatedTools: [
      "breathing-timer",
      "tai-chi-breathing-timer",
      "habit-tracker",
      "sleep-calculator",
    ],
    relatedArticles: [
      { title: "10 Evidence-Based Ways to Lower Cortisol", href: "/stress/evidence-based-lower-cortisol" },
      { title: "How Chronic Stress Affects Your Health", href: "/stress/chronic-stress-health-effects" },
    ],
    affiliateHeading: "Stress Relief Products",
    affiliateText:
      "Aromatherapy diffusers, weighted blankets, and mindfulness journals to support your stress management routine.",
  },

  // ─── Body Composition Tools ───────────────────────────────────────────

  {
    slug: "body-fat-calculator",
    name: "Body Fat Calculator - US Navy & Tape Measure Method",
    shortName: "Body Fat Calculator",
    description:
      "Estimate your body fat percentage using the US Navy circumference method. Measure your neck, waist, and hips with a tape measure to get an accurate body fat estimate.",
    longDescription:
      "Body fat percentage is a far better indicator of health and fitness than weight alone. Our free body fat calculator uses the US Navy circumference method — a formula validated against hydrostatic weighing — to estimate your body fat from simple tape measurements. No equipment needed beyond a flexible tape measure.",
    icon: "ruler",
    category: "body-composition",
    keywords: [
      "body fat calculator",
      "body fat percentage calculator",
      "navy body fat calculator",
      "how to measure body fat",
      "body fat percentage",
      "tape measure body fat",
      "body composition calculator",
      "US Navy body fat formula",
    ],
    faqs: [
      {
        question: "How accurate is the US Navy body fat method?",
        answer:
          "The US Navy circumference method is accurate to within 3-4% of body fat compared to hydrostatic weighing for most people. It is more reliable than BMI and is used by the US military for fitness assessments.",
      },
      {
        question: "What is a healthy body fat percentage?",
        answer:
          "For men, 10-20% is generally considered healthy, with 14-17% being the fitness range. For women, 18-28% is healthy, with 21-24% being the fitness range. Essential fat is about 2-5% for men and 10-13% for women.",
      },
      {
        question: "Where do I measure for the Navy body fat formula?",
        answer:
          "Measure your neck circumference just below the larynx, your waist at the narrowest point (navel level for men), and your hips at the widest point (women only). Use a flexible tape measure pulled snug but not compressing the skin.",
      },
      {
        question: "Why is body fat percentage better than BMI?",
        answer:
          "BMI does not distinguish between muscle and fat. A muscular athlete may have a high BMI but low body fat, while a sedentary person may have a normal BMI but high body fat. Body fat percentage directly measures adiposity.",
      },
      {
        question: "How often should I measure body fat?",
        answer:
          "Measure every 2-4 weeks to track trends. Measure at the same time of day (morning is best) under consistent conditions. Focus on trends over weeks rather than day-to-day fluctuations.",
      },
    ],
    relatedTools: [
      "bmi-calculator",
      "ideal-weight-calculator",
      "lean-body-mass-calculator",
      "waist-hip-ratio-calculator",
    ],
    relatedArticles: [
      { title: "Body Fat vs BMI: Which Matters More?", href: "/fitness/body-fat-vs-bmi" },
      { title: "How to Accurately Measure Body Fat at Home", href: "/fitness/measure-body-fat-at-home" },
    ],
    affiliateHeading: "Body Composition Tools",
    affiliateText:
      "Body fat callipers, smart scales with body composition analysis, and flexible measuring tapes for accurate at-home tracking.",
  },
  {
    slug: "ideal-weight-calculator",
    name: "Ideal Weight Calculator - Multiple Medical Formulas",
    shortName: "Ideal Weight Calculator",
    description:
      "Calculate your ideal body weight using four established medical formulas: Devine, Robinson, Miller, and Hamwi. Compare results and find a healthy weight range for your height.",
    longDescription:
      "There is no single 'ideal' weight, but medical formulas can provide useful reference ranges. Our calculator computes ideal weight using four well-known formulas — Devine (1974), Robinson (1983), Miller (1983), and Hamwi (1964) — and shows you the range. Use this as a starting point, not a definitive answer.",
    icon: "target",
    category: "body-composition",
    keywords: [
      "ideal weight calculator",
      "ideal body weight",
      "how much should I weigh",
      "healthy weight calculator",
      "ideal weight for height",
      "IBW calculator",
      "Devine formula",
      "healthy weight range",
    ],
    faqs: [
      {
        question: "What is the most accurate ideal weight formula?",
        answer:
          "No single formula is universally accurate. The Devine formula is the most commonly used in clinical settings (including drug dosing). The range across all four formulas gives a more useful picture than any single number.",
      },
      {
        question: "How much should I weigh for my height?",
        answer:
          "Ideal weight depends on height, sex, body frame, muscle mass, and age. For example, a 5'10\" male has an ideal weight range of roughly 66-73 kg (145-160 lbs) across the four formulas, but individual variation is normal.",
      },
      {
        question: "Do ideal weight formulas account for muscle mass?",
        answer:
          "No. These formulas use only height and sex. If you have above-average muscle mass (athletes, strength trainees), your healthy weight will likely be higher than these estimates. Body fat percentage is a better metric in that case.",
      },
      {
        question: "Should I aim for my ideal weight?",
        answer:
          "Use ideal weight ranges as a general reference, not a strict target. Health markers like blood pressure, blood sugar, energy levels, and body fat percentage are more meaningful indicators of health than weight alone.",
      },
    ],
    relatedTools: [
      "bmi-calculator",
      "body-fat-calculator",
      "calorie-calculator",
      "lean-body-mass-calculator",
    ],
    relatedArticles: [
      { title: "Understanding Your Healthy Weight Range", href: "/weight-loss/healthy-weight-range" },
      { title: "Why the Scale Doesn't Tell the Whole Story", href: "/fitness/scale-doesnt-tell-whole-story" },
    ],
    affiliateHeading: "Weight Management Essentials",
    affiliateText:
      "High-quality digital scales, body composition monitors, and nutrition guides to support your health goals.",
  },
  {
    slug: "lean-body-mass-calculator",
    name: "Lean Body Mass Calculator - Multiple Formulas",
    shortName: "Lean Body Mass Calculator",
    description:
      "Calculate your lean body mass (fat-free mass) using the Boer, James, and Hume formulas. Understand how much of your body weight is muscle, bone, and organs versus fat.",
    longDescription:
      "Lean body mass (LBM) is your total body weight minus all fat weight. Knowing your LBM helps you set better nutrition targets, track muscle gain during a cut, and understand your body composition beyond the scale. Our calculator uses three validated formulas to estimate your fat-free mass.",
    icon: "dumbbell",
    category: "body-composition",
    keywords: [
      "lean body mass calculator",
      "LBM calculator",
      "fat free mass calculator",
      "lean mass calculator",
      "how much muscle do I have",
      "body composition calculator",
      "Boer formula",
      "fat free body weight",
    ],
    faqs: [
      {
        question: "What is lean body mass?",
        answer:
          "Lean body mass (LBM) is everything in your body that is not fat: muscle, bone, organs, water, and connective tissue. For most men, LBM is 75-85% of total weight. For women, it is typically 65-75%.",
      },
      {
        question: "Why does lean body mass matter?",
        answer:
          "LBM determines your basal metabolic rate more accurately than total weight. It is also essential for calculating protein needs (many recommendations are based on grams per kg of lean mass) and tracking whether weight changes are from fat or muscle.",
      },
      {
        question: "Which lean body mass formula is most accurate?",
        answer:
          "The Boer formula is generally considered the most accurate for adults. However, all estimation formulas have limitations. For the most precise measurement, DEXA scanning or hydrostatic weighing are the gold standard.",
      },
      {
        question: "How can I increase my lean body mass?",
        answer:
          "Resistance training (lifting weights) combined with adequate protein intake (1.6-2.2g per kg of body weight) and a slight caloric surplus is the most effective strategy. Progressive overload and consistency are key.",
      },
    ],
    relatedTools: [
      "body-fat-calculator",
      "bmi-calculator",
      "ideal-weight-calculator",
      "protein-calculator",
    ],
    relatedArticles: [
      { title: "How to Build Lean Muscle Mass", href: "/fitness/build-lean-muscle" },
      { title: "Protein Needs for Muscle Growth", href: "/nutrition/protein-needs-muscle-growth" },
    ],
    affiliateHeading: "Build Lean Mass",
    affiliateText:
      "Protein supplements, resistance bands, and body composition scales to support muscle building and tracking.",
  },
  {
    slug: "waist-hip-ratio-calculator",
    name: "Waist-to-Hip Ratio Calculator - Health Risk Assessment",
    shortName: "Waist-to-Hip Ratio",
    description:
      "Calculate your waist-to-hip ratio (WHR) and assess your health risk level. WHR is a simple, evidence-based screening tool for cardiovascular and metabolic disease risk.",
    longDescription:
      "The waist-to-hip ratio (WHR) is endorsed by the World Health Organization as a measure of abdominal obesity and associated health risks. It is a better predictor of cardiovascular disease than BMI alone. Simply measure your waist and hip circumference to get your ratio and risk classification.",
    icon: "tape-measure",
    category: "body-composition",
    keywords: [
      "waist to hip ratio calculator",
      "WHR calculator",
      "waist hip ratio",
      "abdominal obesity",
      "visceral fat risk",
      "body shape calculator",
      "apple vs pear body shape",
      "cardiovascular risk calculator",
    ],
    faqs: [
      {
        question: "What is a healthy waist-to-hip ratio?",
        answer:
          "The WHO defines low health risk as below 0.90 for men and below 0.85 for women. Ratios above 1.0 for men and 0.85 for women indicate substantially increased cardiovascular and metabolic disease risk.",
      },
      {
        question: "How do I measure my waist and hips correctly?",
        answer:
          "Measure your waist at the narrowest point between your ribs and hip bones (usually at or just above the navel). Measure your hips at the widest point of your buttocks. Stand relaxed, breathe normally, and do not pull the tape tight.",
      },
      {
        question: "Is waist-to-hip ratio better than BMI?",
        answer:
          "For assessing cardiovascular risk, yes. WHR specifically measures abdominal fat distribution, which is more strongly linked to heart disease, type 2 diabetes, and metabolic syndrome than overall weight. Many experts recommend using both measures together.",
      },
      {
        question: "Can I change my waist-to-hip ratio?",
        answer:
          "Yes. Regular aerobic exercise, reducing refined carbohydrates and added sugars, strength training, stress management, and adequate sleep all help reduce abdominal fat and improve WHR over time.",
      },
    ],
    relatedTools: [
      "bmi-calculator",
      "body-fat-calculator",
      "ideal-weight-calculator",
      "calorie-calculator",
    ],
    relatedArticles: [
      { title: "Why Belly Fat Is the Most Dangerous Kind", href: "/fitness/belly-fat-health-risks" },
      { title: "How to Reduce Visceral Fat Naturally", href: "/fitness/reduce-visceral-fat" },
    ],
    affiliateHeading: "Measurement Tools",
    affiliateText:
      "Body measuring tapes, smart scales, and health screening tools for tracking your body composition changes.",
  },

  // ─── Cardio & Running Tools ───────────────────────────────────────────

  {
    slug: "running-pace-calculator",
    name: "Running Pace Calculator - Pace, Distance & Time Converter",
    shortName: "Running Pace Calculator",
    description:
      "Calculate your running pace, finish time, or distance. Convert between min/km and min/mile. Get pace splits for 5K, 10K, half marathon, and marathon distances.",
    longDescription:
      "Whether you are training for your first 5K or targeting a marathon PB, pace is everything. Our free running pace calculator lets you enter any two of pace, distance, and time to solve for the third. It also shows projected finish times for common race distances and displays per-kilometre and per-mile splits.",
    icon: "running",
    category: "cardio",
    keywords: [
      "running pace calculator",
      "pace calculator",
      "running speed calculator",
      "marathon pace calculator",
      "5K pace calculator",
      "min per km to min per mile",
      "race pace calculator",
      "running time calculator",
    ],
    faqs: [
      {
        question: "What is a good running pace for beginners?",
        answer:
          "A comfortable beginner pace is typically 7:00-8:30 min/km (11:00-13:30 min/mile). The best beginner pace is one where you can hold a conversation. Speed will improve naturally with consistent training.",
      },
      {
        question: "How do I calculate my running pace?",
        answer:
          "Divide your total time by the distance. For example, a 30-minute 5K is 30/5 = 6:00 min/km. To convert to min/mile, multiply by 1.609. So 6:00 min/km is approximately 9:39 min/mile.",
      },
      {
        question: "What pace do I need for a sub-4-hour marathon?",
        answer:
          "A sub-4-hour marathon requires an average pace of 5:41 min/km (9:09 min/mile) or faster over 42.195 km. This is a common goal for recreational runners and requires consistent training.",
      },
      {
        question: "Should I run at the same pace every day?",
        answer:
          "No. Most training plans include easy runs (60-70% of max HR), tempo runs (around lactate threshold), and intervals (above threshold). Running every session at the same pace limits improvement and increases injury risk.",
      },
      {
        question: "How can I improve my running pace?",
        answer:
          "Include interval training and tempo runs in your weekly plan, build mileage gradually (10% per week rule), improve running form, strengthen your core and legs, and ensure adequate recovery between hard sessions.",
      },
    ],
    relatedTools: [
      "running-calorie-calculator",
      "vo2-max-calculator",
      "heart-rate-calculator",
      "walking-calorie-calculator",
    ],
    relatedArticles: [
      { title: "How to Find Your Ideal Training Pace", href: "/fitness/ideal-training-pace" },
      { title: "Beginner's Guide to Running Your First 5K", href: "/fitness/beginners-guide-first-5k" },
    ],
    affiliateHeading: "Running Essentials",
    affiliateText:
      "GPS running watches, running shoes, and training plans to help you hit your pace targets.",
  },
  {
    slug: "vo2-max-calculator",
    name: "VO2 Max Calculator - Estimate Your Aerobic Fitness",
    shortName: "VO2 Max Estimator",
    description:
      "Estimate your VO2 max using the Cooper 12-minute run test or the Rockport walk test. VO2 max is the gold standard measure of cardiovascular fitness and aerobic endurance.",
    longDescription:
      "VO2 max represents the maximum volume of oxygen your body can use during intense exercise. It is the single best predictor of cardiovascular fitness and is increasingly recognised as a key longevity biomarker. Our calculator estimates your VO2 max from two popular field tests — no lab required.",
    icon: "lungs",
    category: "cardio",
    keywords: [
      "VO2 max calculator",
      "VO2 max test",
      "aerobic fitness test",
      "Cooper test calculator",
      "Rockport walk test",
      "cardiovascular fitness",
      "VO2 max by age",
      "how to measure VO2 max",
    ],
    faqs: [
      {
        question: "What is a good VO2 max?",
        answer:
          "VO2 max varies by age and sex. For men aged 30-39, an 'excellent' VO2 max is above 48 ml/kg/min, 'good' is 40-48, and 'average' is 34-40. For women of the same age, 'excellent' is above 41, 'good' is 34-41, and 'average' is 28-34.",
      },
      {
        question: "How does the Cooper 12-minute run test work?",
        answer:
          "Run as far as you can in exactly 12 minutes on a flat surface, then measure the distance covered. The formula VO2max = (distance in metres - 504.9) / 44.73 converts your distance to an estimated VO2 max.",
      },
      {
        question: "Can I improve my VO2 max?",
        answer:
          "Yes. High-intensity interval training (HIIT), tempo runs, and progressive overload in aerobic exercise can improve VO2 max by 10-20% in untrained individuals. Genetics set your ceiling, but most people have significant room for improvement.",
      },
      {
        question: "Why does VO2 max matter for longevity?",
        answer:
          "Research published in JAMA shows that higher VO2 max is associated with significantly lower all-cause mortality. Moving from a 'low' to 'moderate' fitness level reduces mortality risk more than quitting smoking. It is one of the strongest predictors of long-term health.",
      },
      {
        question: "What is the Rockport walk test?",
        answer:
          "Walk 1 mile (1.609 km) as fast as you can, then record your time and heart rate immediately after finishing. The Rockport formula estimates VO2 max using your time, heart rate, age, sex, and weight. It is ideal for people who cannot run.",
      },
    ],
    relatedTools: [
      "heart-rate-calculator",
      "running-pace-calculator",
      "running-calorie-calculator",
      "recovery-tracker",
    ],
    relatedArticles: [
      { title: "VO2 Max and Longevity: What the Research Shows", href: "/fitness/vo2-max-longevity" },
      { title: "How to Improve Your VO2 Max at Any Age", href: "/fitness/improve-vo2-max" },
    ],
    affiliateHeading: "Cardio Fitness Gear",
    affiliateText:
      "Heart rate monitors, GPS watches, and fitness trackers that measure estimated VO2 max during your workouts.",
  },
  {
    slug: "running-calorie-calculator",
    name: "Running Calorie Calculator - Calories Burned Running",
    shortName: "Running Calorie Calculator",
    description:
      "Calculate how many calories you burn running based on your weight, distance, pace, and terrain. Uses MET values from the Compendium of Physical Activities.",
    longDescription:
      "Running is one of the most efficient calorie-burning activities. Our calculator uses MET (Metabolic Equivalent of Task) values from the Compendium of Physical Activities to estimate energy expenditure based on your weight, speed, distance, and terrain. Get accurate calorie burn estimates for any run.",
    icon: "shoe",
    category: "cardio",
    keywords: [
      "running calorie calculator",
      "calories burned running",
      "how many calories does running burn",
      "jogging calorie calculator",
      "running for weight loss",
      "calories per mile running",
      "calories per km running",
      "running energy expenditure",
    ],
    faqs: [
      {
        question: "How many calories does running burn per mile?",
        answer:
          "A rough estimate is about 100 calories per mile for a 70 kg (154 lb) person. However, this varies with body weight, speed, and terrain. Heavier runners burn more, and faster paces have slightly higher per-mile calorie costs.",
      },
      {
        question: "Does running faster burn more calories?",
        answer:
          "Per minute, yes — faster running has a higher MET value and burns more calories per minute. Per mile, the difference is smaller. The biggest factor in total calories burned is distance covered and body weight.",
      },
      {
        question: "Does running burn more calories than walking the same distance?",
        answer:
          "Yes, but not as much as you might think. Running burns roughly 20-30% more calories per mile than walking the same distance, primarily because running involves more vertical oscillation and muscle engagement.",
      },
      {
        question: "How much running do I need to do to lose weight?",
        answer:
          "A 500-calorie daily deficit leads to approximately 0.5 kg (1 lb) per week of fat loss. Running 5 km burns roughly 300-400 calories for most people. Combine running with moderate dietary changes for sustainable weight loss.",
      },
    ],
    relatedTools: [
      "running-pace-calculator",
      "walking-calorie-calculator",
      "calorie-calculator",
      "cycling-calorie-calculator",
    ],
    relatedArticles: [
      { title: "Running for Weight Loss: A Complete Guide", href: "/fitness/running-for-weight-loss" },
      { title: "How to Start Running as a Beginner", href: "/fitness/start-running-beginner" },
    ],
    affiliateHeading: "Running Gear",
    affiliateText:
      "Running shoes, GPS watches, and hydration vests to support your running routine.",
  },
  {
    slug: "cycling-calorie-calculator",
    name: "Cycling Calorie Calculator - Calories Burned Cycling",
    shortName: "Cycling Calorie Calculator",
    description:
      "Calculate calories burned cycling based on your weight, speed, duration, and terrain. Covers road cycling, mountain biking, indoor cycling, and commuting.",
    longDescription:
      "Cycling is an excellent low-impact cardio exercise that burns significant calories while being easy on the joints. Our calculator uses MET values to estimate your energy expenditure based on cycling type, speed, duration, and body weight. Whether you ride a road bike, mountain bike, or stationary bike, get an accurate calorie estimate.",
    icon: "bike",
    category: "cardio",
    keywords: [
      "cycling calorie calculator",
      "calories burned cycling",
      "calories burned biking",
      "cycling for weight loss",
      "stationary bike calories",
      "indoor cycling calories",
      "mountain biking calories",
      "cycling energy expenditure",
    ],
    faqs: [
      {
        question: "How many calories does cycling burn per hour?",
        answer:
          "A 70 kg person burns approximately 400-600 calories per hour of moderate cycling (16-20 km/h). Vigorous cycling (25+ km/h) can burn 700-1000+ calories per hour. Body weight and intensity are the biggest factors.",
      },
      {
        question: "Does cycling burn more calories than running?",
        answer:
          "Per unit of time, running generally burns more calories at equivalent effort levels. However, most people can cycle for longer without fatigue, potentially burning more total calories per session. Cycling is also lower impact on joints.",
      },
      {
        question: "Does indoor cycling burn as many calories as outdoor cycling?",
        answer:
          "Indoor cycling can match outdoor cycling calorie burn if the intensity is similar. However, outdoor cycling often involves wind resistance, hills, and terrain variations that increase energy expenditure. Increase indoor resistance to compensate.",
      },
      {
        question: "Is cycling good for weight loss?",
        answer:
          "Yes. Cycling is excellent for weight loss because it burns substantial calories, is low-impact (sustainable long-term), can be integrated into daily commuting, and is enjoyable enough that people stick with it.",
      },
    ],
    relatedTools: [
      "running-calorie-calculator",
      "walking-calorie-calculator",
      "calorie-calculator",
      "heart-rate-calculator",
    ],
    relatedArticles: [
      { title: "Cycling for Fitness: Getting Started", href: "/fitness/cycling-for-fitness" },
      { title: "Indoor vs Outdoor Cycling: Pros and Cons", href: "/fitness/indoor-vs-outdoor-cycling" },
    ],
    affiliateHeading: "Cycling Essentials",
    affiliateText:
      "Bike computers, indoor trainers, cycling shorts, and heart rate monitors for tracking your rides.",
  },
  {
    slug: "swimming-calorie-calculator",
    name: "Swimming Calorie Calculator - Calories Burned Swimming",
    shortName: "Swimming Calorie Calculator",
    description:
      "Calculate calories burned swimming based on stroke type, duration, intensity, and body weight. Covers freestyle, backstroke, breaststroke, butterfly, and treading water.",
    longDescription:
      "Swimming is a full-body workout that burns significant calories while being gentle on joints and ideal for all fitness levels. Our calculator uses MET values specific to each swimming stroke and intensity to give you an accurate calorie burn estimate. Great for tracking pool workouts.",
    icon: "waves",
    category: "cardio",
    keywords: [
      "swimming calorie calculator",
      "calories burned swimming",
      "swimming for weight loss",
      "freestyle calorie burn",
      "pool workout calories",
      "swimming laps calories",
      "breaststroke calories",
      "swimming exercise calories",
    ],
    faqs: [
      {
        question: "How many calories does swimming burn per hour?",
        answer:
          "A 70 kg person burns roughly 400-700 calories per hour of swimming, depending on stroke and intensity. Butterfly burns the most (around 700 kcal/hr), followed by freestyle (500-600), backstroke (400-500), and breaststroke (400-500).",
      },
      {
        question: "Which swimming stroke burns the most calories?",
        answer:
          "Butterfly burns the most calories per minute due to its intense full-body demands. However, most swimmers cannot sustain butterfly for long. For a full workout, moderate-pace freestyle typically results in the highest total calorie burn.",
      },
      {
        question: "Is swimming good for weight loss?",
        answer:
          "Swimming is excellent for weight loss: it burns significant calories, works every major muscle group, is low-impact (no joint stress), and can be maintained into old age. Some research suggests cold water may slightly boost metabolic rate.",
      },
      {
        question: "Does body fat affect swimming calorie burn?",
        answer:
          "Body fat provides buoyancy, meaning leaner swimmers may expend slightly more energy to stay afloat. However, heavier individuals burn more total calories due to the greater energy cost of moving more mass through water.",
      },
    ],
    relatedTools: [
      "running-calorie-calculator",
      "cycling-calorie-calculator",
      "walking-calorie-calculator",
      "calorie-calculator",
    ],
    relatedArticles: [
      { title: "Swimming for Fitness: A Beginner's Guide", href: "/fitness/swimming-fitness-beginners" },
      { title: "Best Pool Workouts for Weight Loss", href: "/fitness/pool-workouts-weight-loss" },
    ],
    affiliateHeading: "Swimming Gear",
    affiliateText:
      "Swim goggles, waterproof fitness trackers, training paddles, and swim fins for better pool workouts.",
  },
  {
    slug: "steps-to-calories-calculator",
    name: "Steps to Calories Calculator - Convert Step Count to Calories",
    shortName: "Steps to Calories Calculator",
    description:
      "Convert your daily step count into calories burned. Enter your steps, weight, and stride length to get an accurate calorie estimate from your walking activity.",
    longDescription:
      "Wondering how many calories your daily steps burn? Our steps-to-calories calculator converts your step count into estimated energy expenditure based on your body weight and stride length. Whether you are tracking 5,000 or 15,000 steps a day, see exactly what your walking activity contributes to your daily calorie burn.",
    icon: "footprints",
    category: "cardio",
    keywords: [
      "steps to calories calculator",
      "how many calories do 10000 steps burn",
      "step counter calories",
      "steps to kcal",
      "walking steps calories",
      "10000 steps calories",
      "pedometer calorie calculator",
      "daily steps calorie burn",
    ],
    faqs: [
      {
        question: "How many calories do 10,000 steps burn?",
        answer:
          "For a 70 kg person with an average stride length, 10,000 steps burns approximately 350-450 calories. The exact number depends on your weight, walking speed, terrain, and stride length.",
      },
      {
        question: "How many steps do I need to burn 500 calories?",
        answer:
          "For a 70 kg person, approximately 12,000-14,000 steps burns around 500 calories. Heavier individuals will need fewer steps, and lighter individuals will need more steps to reach the same calorie target.",
      },
      {
        question: "Are all steps equal in terms of calorie burn?",
        answer:
          "No. Brisk walking burns more calories per step than a slow stroll. Walking uphill, on uneven terrain, or carrying weight also increases per-step calorie expenditure. Step counters do not usually account for these differences.",
      },
      {
        question: "How do I find my stride length?",
        answer:
          "Walk 10 steps at your normal pace, measure the total distance, and divide by 10. Average stride length is about 0.74 metres (2.4 feet) for men and 0.67 metres (2.2 feet) for women. Our calculator uses these defaults if you do not enter your own.",
      },
    ],
    relatedTools: [
      "walking-calorie-calculator",
      "running-calorie-calculator",
      "calorie-calculator",
      "habit-tracker",
    ],
    relatedArticles: [
      { title: "Do You Really Need 10,000 Steps a Day?", href: "/fitness/do-you-need-10000-steps" },
      { title: "How to Increase Your Daily Step Count", href: "/habits/increase-daily-step-count" },
    ],
    affiliateHeading: "Step Tracking Gear",
    affiliateText:
      "Fitness trackers, pedometers, and smartwatches to accurately count your daily steps and monitor activity.",
  },

  // ─── Strength & Fitness Tools ─────────────────────────────────────────

  {
    slug: "one-rep-max-calculator",
    name: "One Rep Max (1RM) Calculator - Estimate Your Max Lift",
    shortName: "One Rep Max Calculator",
    description:
      "Estimate your one-rep max for any lift using Epley, Brzycki, and Lombardi formulas. Enter the weight and reps you completed to get your estimated 1RM and percentage chart.",
    longDescription:
      "Your one-rep max (1RM) is the maximum weight you can lift for a single repetition. Knowing your 1RM helps you plan training percentages, track strength progress, and programme exercises effectively. Our calculator uses three validated formulas to estimate your 1RM without needing to test it directly — which is safer and more practical.",
    icon: "barbell",
    category: "fitness",
    keywords: [
      "one rep max calculator",
      "1RM calculator",
      "bench press max calculator",
      "squat max calculator",
      "deadlift max calculator",
      "one rep max formula",
      "Epley formula",
      "Brzycki formula",
      "max lift calculator",
    ],
    faqs: [
      {
        question: "What is a one rep max (1RM)?",
        answer:
          "Your 1RM is the maximum weight you can lift for a single repetition with proper form. It is the standard measure of absolute strength for a given exercise and is used to calculate training loads.",
      },
      {
        question: "How accurate are 1RM calculator formulas?",
        answer:
          "1RM formulas are most accurate when using sets of 2-6 reps. Accuracy decreases with higher rep counts (10+). For most people, the Epley and Brzycki formulas are accurate within 5% when using 3-5 rep sets.",
      },
      {
        question: "Which 1RM formula is the best?",
        answer:
          "The Epley formula (1RM = weight x (1 + reps/30)) and Brzycki formula (1RM = weight x 36/(37 - reps)) are the most commonly used and generally give similar results. Using the average of multiple formulas provides the best estimate.",
      },
      {
        question: "How should I use my 1RM for training?",
        answer:
          "Common training percentages: strength (85-100% 1RM, 1-5 reps), hypertrophy (65-85% 1RM, 6-12 reps), endurance (50-65% 1RM, 15+ reps). The percentage chart provided with your results makes programming easy.",
      },
      {
        question: "How often should I test or recalculate my 1RM?",
        answer:
          "Recalculate every 4-8 weeks during a training programme, or whenever you notice your working sets feel significantly easier. Avoid actual 1RM testing too frequently as it is taxing on the nervous system.",
      },
    ],
    relatedTools: [
      "calorie-calculator",
      "protein-calculator",
      "recovery-tracker",
      "macro-calculator",
    ],
    relatedArticles: [
      { title: "How to Use Training Percentages", href: "/fitness/training-percentages-guide" },
      { title: "Progressive Overload: The Key to Getting Stronger", href: "/fitness/progressive-overload" },
    ],
    affiliateHeading: "Strength Training Gear",
    affiliateText:
      "Lifting belts, wrist wraps, chalk, and training logs to support your strength training.",
  },

  // ─── Nutrition Tools ──────────────────────────────────────────────────

  {
    slug: "protein-calculator",
    name: "Protein Intake Calculator - Daily Protein Needs",
    shortName: "Protein Calculator",
    description:
      "Calculate how much protein you need per day based on your weight, activity level, and fitness goals. Get gram-level targets for muscle building, weight loss, or maintenance.",
    longDescription:
      "Protein is the most important macronutrient for muscle repair, satiety, and metabolic health. Our free protein calculator provides personalised daily protein targets based on your body weight, activity level, and specific goals — from sedentary maintenance to intense muscle building. Get science-backed recommendations, not guesswork.",
    icon: "egg",
    category: "nutrition",
    keywords: [
      "protein calculator",
      "how much protein do I need",
      "daily protein intake",
      "protein per day",
      "protein for muscle building",
      "protein intake calculator",
      "protein requirements",
      "grams of protein per kg",
    ],
    faqs: [
      {
        question: "How much protein do I need per day?",
        answer:
          "The minimum recommendation is 0.8g per kg of body weight for sedentary adults. Active individuals should aim for 1.2-1.6g/kg, and those building muscle or losing weight benefit from 1.6-2.2g/kg. Our calculator personalises this based on your goals.",
      },
      {
        question: "Can I eat too much protein?",
        answer:
          "For healthy adults, protein intakes up to 2.2-3.0g/kg appear safe. Higher intakes are not harmful to kidney function in healthy individuals, contrary to popular myth. However, there are diminishing returns for muscle building above 2.2g/kg.",
      },
      {
        question: "When should I eat protein?",
        answer:
          "Distribute protein evenly across 3-5 meals (20-40g per meal) for optimal muscle protein synthesis. Post-workout protein is beneficial but the 'anabolic window' is wider than previously thought — within 2-3 hours is fine.",
      },
      {
        question: "Do I need more protein as I age?",
        answer:
          "Yes. Older adults (50+) have higher protein needs due to anabolic resistance — the body becomes less efficient at using protein for muscle repair. Experts recommend 1.2-1.5g/kg for adults over 50 to prevent sarcopenia (age-related muscle loss).",
      },
      {
        question: "What are the best sources of protein?",
        answer:
          "High-quality sources include eggs, chicken, fish, Greek yoghurt, cottage cheese, lean beef, tofu, tempeh, lentils, and whey protein. Aim for a mix of animal and plant sources for a complete amino acid profile.",
      },
    ],
    relatedTools: [
      "macro-calculator",
      "calorie-calculator",
      "lean-body-mass-calculator",
      "one-rep-max-calculator",
    ],
    relatedArticles: [
      { title: "How Much Protein Do You Really Need?", href: "/nutrition/how-much-protein-do-you-need" },
      { title: "Best High-Protein Foods for Every Diet", href: "/nutrition/best-high-protein-foods" },
    ],
    affiliateHeading: "Protein Essentials",
    affiliateText:
      "Whey protein, plant-based protein powders, protein bars, and shaker bottles to help you hit your daily target.",
  },

  // ─── Sleep Tools ──────────────────────────────────────────────────────

  {
    slug: "nap-calculator",
    name: "Nap Calculator - Find Your Ideal Nap Duration & Timing",
    shortName: "Nap Calculator",
    description:
      "Calculate the best nap duration and timing for your schedule. Power naps, recovery naps, and full-cycle naps — find the right nap to boost alertness without grogginess.",
    longDescription:
      "Not all naps are created equal. A 20-minute power nap boosts alertness, while a 90-minute nap includes a full sleep cycle with REM. Timing matters too — nap too late and you will disrupt your night-time sleep. Our nap calculator recommends the ideal nap type, duration, and latest safe nap time based on your schedule.",
    icon: "nap",
    category: "sleep",
    keywords: [
      "nap calculator",
      "how long should I nap",
      "best nap duration",
      "power nap time",
      "nap schedule",
      "when to nap",
      "nap timer",
      "afternoon nap calculator",
      "optimal nap length",
    ],
    faqs: [
      {
        question: "How long should a power nap be?",
        answer:
          "A power nap should be 15-20 minutes. This keeps you in light sleep (stages 1-2), which boosts alertness and mood without causing sleep inertia (grogginess). Set an alarm to avoid sleeping longer.",
      },
      {
        question: "Why do I feel groggy after napping?",
        answer:
          "Grogginess after a nap (sleep inertia) usually means you woke up during deep sleep (stage 3). This happens with naps of 30-60 minutes. Either nap for 20 minutes (before deep sleep) or 90 minutes (a full cycle that ends in light sleep).",
      },
      {
        question: "What is the best time to take a nap?",
        answer:
          "The best time to nap is between 1:00 PM and 3:00 PM, when your circadian rhythm naturally dips. Napping after 3:00 PM can interfere with your ability to fall asleep at night.",
      },
      {
        question: "Are naps good for you?",
        answer:
          "Short naps (20-30 minutes) improve alertness, mood, reaction time, and memory consolidation. However, frequent long naps or napping due to chronic daytime sleepiness may indicate an underlying sleep disorder. Naps should complement, not replace, adequate night-time sleep.",
      },
      {
        question: "Can a nap replace lost sleep?",
        answer:
          "A nap can temporarily reduce sleepiness and improve performance, but it cannot fully replace the deep sleep and REM cycles lost from a short night. Consistent night-time sleep of 7-9 hours remains the priority.",
      },
    ],
    relatedTools: [
      "sleep-calculator",
      "caffeine-calculator",
      "recovery-tracker",
      "breathing-timer",
    ],
    relatedArticles: [
      { title: "The Science of Power Napping", href: "/sleep/science-of-power-napping" },
      { title: "How Naps Affect Night-Time Sleep", href: "/sleep/naps-affect-night-sleep" },
    ],
    affiliateHeading: "Nap Accessories",
    affiliateText:
      "Sleep masks, white noise machines, and travel pillows for the perfect nap anywhere.",
  },

  // ─── Lifestyle & Wellness Tools ───────────────────────────────────────

  {
    slug: "caffeine-calculator",
    name: "Caffeine Calculator - Half-Life & Daily Limit Tracker",
    shortName: "Caffeine Calculator",
    description:
      "Calculate how long caffeine stays in your system and find the latest time to drink coffee without affecting sleep. Track daily caffeine intake against recommended limits.",
    longDescription:
      "Caffeine has an average half-life of 5-6 hours, meaning half the caffeine from your afternoon coffee is still in your system at bedtime. Our caffeine calculator shows you exactly when caffeine from each drink clears your system, tracks your total daily intake, and tells you the latest safe time for your last caffeinated drink based on your bedtime.",
    icon: "coffee",
    category: "sleep",
    keywords: [
      "caffeine calculator",
      "caffeine half life calculator",
      "how long does caffeine last",
      "caffeine and sleep",
      "when to stop drinking coffee",
      "daily caffeine limit",
      "caffeine intake calculator",
      "coffee before bed calculator",
    ],
    faqs: [
      {
        question: "How long does caffeine stay in your system?",
        answer:
          "Caffeine has an average half-life of 5-6 hours, meaning half the caffeine is eliminated every 5-6 hours. A 200mg coffee at 2 PM still has ~100mg active at 8 PM and ~50mg at 2 AM. Full clearance takes about 12 hours.",
      },
      {
        question: "How much caffeine is too much?",
        answer:
          "The FDA and EFSA recommend no more than 400mg of caffeine per day for healthy adults (roughly 4 cups of brewed coffee). Pregnant women should limit intake to 200mg. Sensitivity varies significantly between individuals.",
      },
      {
        question: "When should I stop drinking coffee to sleep well?",
        answer:
          "Stop consuming caffeine at least 6-8 hours before bedtime for most people. If you go to bed at 10 PM, your last coffee should be by 2 PM at the latest. People who metabolise caffeine slowly should allow even more time.",
      },
      {
        question: "How much caffeine is in common drinks?",
        answer:
          "Brewed coffee: 80-100mg per cup. Espresso: 60-75mg per shot. Black tea: 40-70mg. Green tea: 25-45mg. Cola: 30-40mg per can. Energy drinks: 70-200mg per can. Decaf coffee: 2-7mg per cup.",
      },
      {
        question: "Does caffeine tolerance build up?",
        answer:
          "Yes. Regular caffeine consumers develop tolerance, meaning the same dose has less effect on alertness. However, caffeine continues to affect sleep architecture even in habitual users, disrupting deep sleep even when you feel you can fall asleep fine.",
      },
    ],
    relatedTools: [
      "sleep-calculator",
      "nap-calculator",
      "hydration-calculator",
      "stress-reduction-checklist",
    ],
    relatedArticles: [
      { title: "How Caffeine Affects Your Sleep Quality", href: "/sleep/caffeine-affects-sleep-quality" },
      { title: "Caffeine Detox: How to Reset Your Tolerance", href: "/nutrition/caffeine-detox-reset-tolerance" },
    ],
    affiliateHeading: "Better Coffee Habits",
    affiliateText:
      "Low-caffeine alternatives, quality decaf coffee, caffeine-tracking apps, and herbal teas for the evening.",
  },
  {
    slug: "pregnancy-due-date-calculator",
    name: "Pregnancy Due Date Calculator - Estimated Delivery Date",
    shortName: "Due Date Calculator",
    description:
      "Calculate your estimated due date using Naegele's rule based on your last menstrual period or conception date. View your trimester timeline and key pregnancy milestones.",
    longDescription:
      "Knowing your estimated due date helps you plan prenatal care and prepare for your baby's arrival. Our due date calculator uses Naegele's rule — the standard method used by healthcare providers — to estimate your delivery date based on the first day of your last menstrual period (LMP) or your estimated conception date. It also shows your trimester breakdown and pregnancy week.",
    icon: "baby",
    category: "habits",
    keywords: [
      "due date calculator",
      "pregnancy due date calculator",
      "when is my baby due",
      "pregnancy calculator",
      "estimated delivery date",
      "conception date calculator",
      "pregnancy week calculator",
      "Naegele rule calculator",
      "how far along am I",
    ],
    faqs: [
      {
        question: "How is a due date calculated?",
        answer:
          "Naegele's rule calculates the due date by adding 280 days (40 weeks) to the first day of your last menstrual period (LMP). This assumes a 28-day cycle and ovulation on day 14. The calculator adjusts for different cycle lengths.",
      },
      {
        question: "How accurate are due date calculators?",
        answer:
          "Only about 5% of babies are born on their estimated due date. Most births occur within 2 weeks of the due date (38-42 weeks). An early ultrasound (before 12 weeks) provides the most accurate dating. This calculator gives an estimate based on LMP.",
      },
      {
        question: "What are the three trimesters?",
        answer:
          "First trimester: weeks 1-12 (major organ development). Second trimester: weeks 13-27 (fastest growth, movements felt). Third trimester: weeks 28-40 (final development, preparation for birth).",
      },
      {
        question: "Can my due date change?",
        answer:
          "Yes. Your healthcare provider may adjust your due date after an early ultrasound measurement. Ultrasound dating is most accurate in the first trimester and may differ from LMP-based calculations, especially if your cycles are irregular.",
      },
      {
        question: "How do I calculate my due date from conception?",
        answer:
          "If you know your conception date, add 266 days (38 weeks) to get your estimated due date. This is because Naegele's rule adds 280 days from LMP, which includes roughly 14 days before conception.",
      },
    ],
    relatedTools: [
      "calorie-calculator",
      "hydration-calculator",
      "sleep-calculator",
      "stress-reduction-checklist",
    ],
    relatedArticles: [
      { title: "First Trimester: What to Expect", href: "/wellness/first-trimester-guide" },
      { title: "Nutrition During Pregnancy", href: "/nutrition/nutrition-during-pregnancy" },
    ],
    affiliateHeading: "Pregnancy Essentials",
    affiliateText:
      "Prenatal vitamins, pregnancy journals, and comfortable maternity products for every trimester.",
  },
  {
    slug: "period-calculator",
    name: "Period Calculator - Predict Your Next Menstrual Cycle",
    shortName: "Period Calculator",
    description:
      "Predict your next period, fertile window, and ovulation date based on your cycle history. View a 6-month menstrual cycle forecast.",
    longDescription:
      "Understanding your menstrual cycle helps you plan ahead and recognise changes in your health. Enter the first day of your last period and your average cycle length to get predictions for the next 6 months, including expected period start dates, fertile windows, and estimated ovulation days.",
    icon: "calendar",
    category: "habits",
    keywords: [
      "period calculator",
      "menstrual cycle calculator",
      "next period predictor",
      "when is my next period",
      "menstrual cycle tracker",
      "period date calculator",
      "cycle length calculator",
    ],
    faqs: [
      {
        question: "How is my next period calculated?",
        answer:
          "Your next period is estimated by adding your average cycle length (in days) to the first day of your last period. The average cycle length is 28 days, but normal cycles range from 21 to 35 days.",
      },
      {
        question: "What is a normal menstrual cycle length?",
        answer:
          "Normal menstrual cycles range from 21 to 35 days, with the average being 28 days. Cycles can vary from month to month. Consistently irregular cycles should be discussed with a healthcare provider.",
      },
      {
        question: "When is my fertile window?",
        answer:
          "Your fertile window is typically the 5 days before ovulation and the day of ovulation itself. Ovulation usually occurs about 14 days before your next expected period, not 14 days after your last period started.",
      },
      {
        question: "Can stress affect my cycle?",
        answer:
          "Yes. Stress, significant weight changes, intense exercise, illness, and travel can all affect your menstrual cycle timing. This calculator provides estimates based on your average cycle — actual dates may vary.",
      },
    ],
    relatedTools: [
      "ovulation-calculator",
      "pregnancy-due-date-calculator",
      "sleep-calculator",
    ],
    relatedArticles: [
      { title: "Understanding Your Menstrual Cycle", href: "/wellness/menstrual-cycle-guide" },
    ],
    affiliateHeading: "Cycle Tracking Essentials",
    affiliateText:
      "Period tracking apps, menstrual cups, heating pads, and supplements to support your cycle.",
  },
  {
    slug: "ovulation-calculator",
    name: "Ovulation Calculator - Find Your Fertile Window",
    shortName: "Ovulation Calculator",
    description:
      "Estimate your ovulation date and fertile window based on your menstrual cycle. View a 6-month fertility forecast to help you plan.",
    longDescription:
      "Knowing when you ovulate is key to understanding your fertility. This calculator estimates your ovulation date and most fertile days based on your cycle length and last period date. View predictions for the next 6 months to identify your best chances of conception — or to better understand your body's natural rhythm.",
    icon: "flower",
    category: "habits",
    keywords: [
      "ovulation calculator",
      "fertility calculator",
      "when do I ovulate",
      "fertile window calculator",
      "ovulation predictor",
      "best time to conceive",
      "fertility window",
      "ovulation date calculator",
    ],
    faqs: [
      {
        question: "How is ovulation date calculated?",
        answer:
          "Ovulation is estimated by subtracting 14 days from your expected next period date. This is based on the luteal phase (the time between ovulation and your period) typically being about 14 days, though it can range from 12-16 days.",
      },
      {
        question: "What is the fertile window?",
        answer:
          "The fertile window spans approximately 6 days: the 5 days before ovulation and the day of ovulation itself. Sperm can survive in the reproductive tract for up to 5 days, while an egg is viable for 12-24 hours after release.",
      },
      {
        question: "How accurate is an ovulation calculator?",
        answer:
          "Ovulation calculators provide estimates based on average cycle patterns. Actual ovulation can vary. For more precise tracking, combine calendar predictions with ovulation predictor kits (OPKs), basal body temperature charting, or cervical mucus monitoring.",
      },
      {
        question: "Can I ovulate at different times each cycle?",
        answer:
          "Yes. Ovulation timing can vary from cycle to cycle due to stress, illness, travel, weight changes, and hormonal fluctuations. Cycles with irregular ovulation are common and normal.",
      },
    ],
    relatedTools: [
      "period-calculator",
      "pregnancy-due-date-calculator",
      "stress-reduction-checklist",
    ],
    relatedArticles: [
      { title: "Understanding Ovulation and Fertility", href: "/wellness/ovulation-fertility-guide" },
    ],
    affiliateHeading: "Fertility Planning",
    affiliateText:
      "Ovulation predictor kits, basal thermometers, fertility supplements, and tracking tools.",
  },
  {
    slug: "blood-pressure-checker",
    name: "Blood Pressure Checker - Understand Your Reading",
    shortName: "Blood Pressure Checker",
    description:
      "Enter your blood pressure reading to see which category it falls into (normal, elevated, or high) based on AHA guidelines, with lifestyle recommendations.",
    longDescription:
      "Understanding your blood pressure numbers is one of the most important things you can do for your heart health. Enter your systolic (top) and diastolic (bottom) numbers to see how your reading compares to American Heart Association guidelines. Get personalised lifestyle recommendations based on your category.",
    icon: "stethoscope",
    category: "habits",
    keywords: [
      "blood pressure checker",
      "blood pressure chart",
      "is my blood pressure normal",
      "blood pressure categories",
      "blood pressure calculator",
      "high blood pressure check",
      "blood pressure reading",
      "what does my blood pressure mean",
    ],
    faqs: [
      {
        question: "What is a normal blood pressure reading?",
        answer:
          "A normal blood pressure reading is below 120/80 mmHg according to the American Heart Association. The top number (systolic) measures pressure when your heart beats; the bottom number (diastolic) measures pressure when your heart rests between beats.",
      },
      {
        question: "What are the blood pressure categories?",
        answer:
          "The AHA defines five categories: Normal (less than 120/80), Elevated (120-129/less than 80), High Blood Pressure Stage 1 (130-139 or 80-89), High Blood Pressure Stage 2 (140+ or 90+), and Hypertensive Crisis (higher than 180/120).",
      },
      {
        question: "When should I check my blood pressure?",
        answer:
          "Check at the same time each day, ideally in the morning before eating or taking medication and again in the evening. Sit quietly for 5 minutes before measuring. Take 2-3 readings one minute apart and record the average.",
      },
      {
        question: "Can lifestyle changes lower blood pressure?",
        answer:
          "Yes. Regular exercise, reducing sodium intake, maintaining a healthy weight, limiting alcohol, managing stress, and eating a diet rich in fruits, vegetables, and whole grains (like the DASH diet) can all help lower blood pressure.",
      },
    ],
    relatedTools: [
      "heart-rate-calculator",
      "calorie-calculator",
      "stress-reduction-checklist",
    ],
    relatedArticles: [
      { title: "Understanding Blood Pressure", href: "/wellness/blood-pressure-guide" },
    ],
    affiliateHeading: "Blood Pressure Monitoring",
    affiliateText:
      "Home blood pressure monitors, wrist cuffs, tracking logs, and heart-healthy supplements.",
  },
  {
    slug: "calorie-deficit-calculator",
    name: "Calorie Deficit Calculator - How Much to Eat to Lose Weight",
    shortName: "Calorie Deficit Calculator",
    description:
      "Calculate your daily calorie target for safe, sustainable weight loss. See how long it will take to reach your goal weight with different deficit sizes.",
    longDescription:
      "Losing weight requires eating fewer calories than your body burns — a calorie deficit. This calculator estimates your maintenance calories using the Mifflin-St Jeor equation, then shows you daily calorie targets for different deficit levels (mild, moderate, aggressive). See your projected timeline to reach your goal weight safely.",
    icon: "chart-down",
    category: "nutrition",
    keywords: [
      "calorie deficit calculator",
      "how many calories to lose weight",
      "weight loss calorie calculator",
      "calorie deficit for weight loss",
      "how much should I eat to lose weight",
      "safe calorie deficit",
      "weight loss calculator",
    ],
    faqs: [
      {
        question: "What is a calorie deficit?",
        answer:
          "A calorie deficit means consuming fewer calories than your body burns in a day. A deficit of about 500 calories per day leads to roughly 1 pound (0.45 kg) of weight loss per week, since one pound of body fat contains approximately 3,500 calories.",
      },
      {
        question: "What is a safe rate of weight loss?",
        answer:
          "Most health organisations recommend losing 0.5 to 1 kg (1-2 lbs) per week. Faster weight loss can lead to muscle loss, nutritional deficiencies, gallstones, and metabolic slowdown. Very low calorie diets should only be followed under medical supervision.",
      },
      {
        question: "Should I eat back exercise calories?",
        answer:
          "It depends on your approach. If your TDEE already accounts for your activity level, you don't need to eat back exercise calories. If you calculated your deficit from your BMR or sedentary TDEE, you may want to eat back a portion (about 50-75%) of exercise calories to avoid too large a deficit.",
      },
      {
        question: "What is the minimum safe calorie intake?",
        answer:
          "General guidelines suggest women should not eat below 1,200 calories and men should not eat below 1,500 calories per day without medical supervision. Eating too few calories can slow metabolism, cause nutrient deficiencies, and lead to muscle loss.",
      },
    ],
    relatedTools: [
      "calorie-calculator",
      "macro-calculator",
      "protein-calculator",
      "walking-calorie-calculator",
    ],
    relatedArticles: [
      { title: "Sustainable Weight Loss Guide", href: "/weight-loss/sustainable-weight-loss" },
    ],
    affiliateHeading: "Weight Loss Support",
    affiliateText:
      "Food scales, meal prep containers, calorie tracking apps, and portion control plates.",
  },
  {
    slug: "alcohol-unit-calculator",
    name: "Alcohol Unit Calculator - Track Your Drinking",
    shortName: "Alcohol Unit Calculator",
    description:
      "Calculate alcohol units, calories, and estimated metabolism time for your drinks. Compare your intake to recommended weekly limits.",
    longDescription:
      "Understanding how many units of alcohol you consume helps you make informed decisions about your drinking. Enter your drinks to see total units, calories, and how long your body needs to process the alcohol. Compare your weekly intake to UK Chief Medical Officers' guidelines (14 units per week).",
    icon: "wine",
    category: "nutrition",
    keywords: [
      "alcohol unit calculator",
      "units in a pint",
      "alcohol units calculator",
      "how many units in wine",
      "alcohol calorie calculator",
      "drink units calculator",
      "weekly alcohol units",
    ],
    faqs: [
      {
        question: "How is an alcohol unit calculated?",
        answer:
          "One UK alcohol unit equals 10ml (8g) of pure alcohol. The formula is: units = (volume in ml × ABV%) ÷ 1,000. For example, a pint (568ml) of 4% beer = (568 × 4) ÷ 1,000 = 2.3 units.",
      },
      {
        question: "What is the recommended weekly limit?",
        answer:
          "The UK Chief Medical Officers recommend no more than 14 units per week for both men and women, spread over 3 or more days with several drink-free days. This is roughly equivalent to 6 pints of 4% beer or 6 medium glasses of 13% wine.",
      },
      {
        question: "How long does it take to process alcohol?",
        answer:
          "Your body processes approximately 1 unit of alcohol per hour. This rate cannot be sped up by coffee, cold showers, or food. A heavy night of drinking (12 units) could mean alcohol is still in your system 12+ hours later.",
      },
      {
        question: "How many calories are in alcohol?",
        answer:
          "Alcohol contains 7 calories per gram — nearly as much as fat (9 cal/g). A pint of 4% beer has about 180 calories, a medium glass of wine about 160 calories, and a single spirit with mixer about 100-120 calories.",
      },
    ],
    relatedTools: [
      "calorie-calculator",
      "hydration-calculator",
      "sleep-calculator",
    ],
    relatedArticles: [
      { title: "Alcohol and Wellness", href: "/wellness/alcohol-health-guide" },
    ],
    affiliateHeading: "Mindful Drinking",
    affiliateText:
      "Non-alcoholic alternatives, alcohol-free spirits, drink tracking journals, and wellness books.",
  },
  {
    slug: "body-type-calculator",
    name: "Body Type Calculator - Ectomorph, Mesomorph, or Endomorph",
    shortName: "Body Type Calculator",
    description:
      "Determine your somatotype (ectomorph, mesomorph, or endomorph) based on your measurements. Get training and nutrition recommendations for your body type.",
    longDescription:
      "Understanding your body type (somatotype) can help guide your training and nutrition strategy. Answer questions about your bone structure, natural build, and body tendencies to find out whether you lean toward ectomorph (naturally lean), mesomorph (muscular build), or endomorph (stockier build). Most people are a blend of types.",
    icon: "body-type",
    category: "body-composition",
    keywords: [
      "body type calculator",
      "what body type am I",
      "ectomorph mesomorph endomorph",
      "somatotype calculator",
      "body type quiz",
      "body type test",
      "am I an ectomorph",
    ],
    faqs: [
      {
        question: "What are the three body types?",
        answer:
          "Ectomorph: naturally lean, narrow shoulders and hips, fast metabolism, finds it hard to gain weight. Mesomorph: naturally muscular, medium frame, gains muscle easily. Endomorph: wider build, stores fat more easily, strong but may struggle to lose weight.",
      },
      {
        question: "Can your body type change?",
        answer:
          "Your underlying skeletal structure doesn't change, but your body composition (muscle and fat) absolutely can. Training and nutrition can significantly alter how your body looks and performs regardless of your somatotype classification.",
      },
      {
        question: "How should different body types train?",
        answer:
          "Ectomorphs often benefit from heavy compound lifts with fewer reps and more calories. Mesomorphs respond well to varied training. Endomorphs may benefit from combining strength training with cardio and paying closer attention to calorie intake. However, individual variation matters more than body type labels.",
      },
      {
        question: "Is the body type system scientifically accurate?",
        answer:
          "Somatotyping was developed by psychologist William Sheldon in the 1940s. While the strict categories are an oversimplification, the general concept that people have different natural builds, metabolic tendencies, and responses to training is well-supported. Most people are a blend of all three types.",
      },
    ],
    relatedTools: [
      "body-fat-calculator",
      "ideal-weight-calculator",
      "calorie-calculator",
      "protein-calculator",
    ],
    relatedArticles: [
      { title: "Training for Your Body Type", href: "/fitness/body-type-training" },
    ],
    affiliateHeading: "Training Gear",
    affiliateText:
      "Adjustable dumbbells, resistance bands, body composition scales, and training programs for your body type.",
  },
  {
    slug: "hiit-timer",
    name: "HIIT Timer - Interval Training Workout Timer",
    shortName: "HIIT Timer",
    description:
      "Customisable HIIT interval timer with work/rest periods, round counter, warmup, and cooldown. Visual and audio cues keep you on track.",
    longDescription:
      "High-Intensity Interval Training (HIIT) is one of the most effective training methods for burning calories and improving cardiovascular fitness. Set your work and rest intervals, number of rounds, and optional warmup/cooldown periods. The timer provides clear visual countdowns and phase indicators so you can focus on your workout.",
    icon: "stopwatch",
    category: "fitness",
    keywords: [
      "HIIT timer",
      "interval timer",
      "tabata timer",
      "workout timer",
      "interval training timer",
      "HIIT workout timer",
      "exercise timer",
      "circuit training timer",
    ],
    faqs: [
      {
        question: "What is HIIT?",
        answer:
          "High-Intensity Interval Training (HIIT) alternates between short bursts of intense exercise and brief recovery periods. A typical session lasts 15-30 minutes and can burn as many calories as a longer moderate-intensity workout.",
      },
      {
        question: "What are good HIIT work/rest ratios?",
        answer:
          "Common ratios include 1:1 (e.g. 30s work/30s rest) for beginners, 2:1 (e.g. 40s work/20s rest) for intermediate, and Tabata-style 20s work/10s rest for advanced. Start with longer rest periods and progress as your fitness improves.",
      },
      {
        question: "How often should I do HIIT?",
        answer:
          "Most experts recommend 2-3 HIIT sessions per week with at least 48 hours between sessions. HIIT places significant stress on your body and nervous system, so adequate recovery is essential to avoid overtraining and injury.",
      },
      {
        question: "What is Tabata training?",
        answer:
          "Tabata is a specific HIIT protocol: 20 seconds of maximum-effort exercise followed by 10 seconds of rest, repeated for 8 rounds (4 minutes total). It was developed by Japanese researcher Dr. Izumi Tabata and is extremely demanding.",
      },
    ],
    relatedTools: [
      "running-calorie-calculator",
      "heart-rate-calculator",
      "recovery-tracker",
      "calories-calculator",
    ],
    relatedArticles: [
      { title: "HIIT for Beginners", href: "/fitness/hiit-beginners-guide" },
    ],
    affiliateHeading: "HIIT Equipment",
    affiliateText:
      "Jump ropes, kettlebells, resistance bands, exercise mats, and heart rate monitors for HIIT training.",
  },
  {
    slug: "meditation-timer",
    name: "Meditation Timer - Guided Session Timer with Interval Bells",
    shortName: "Meditation Timer",
    description:
      "Simple meditation timer with customisable duration, interval bells, and ambient sound options. Track your practice with session summaries.",
    longDescription:
      "A distraction-free meditation timer to support your mindfulness practice. Set your session length, choose optional interval bells to gently mark time, and select from calming ambient sounds. The minimal interface lets you focus entirely on your meditation without watching the clock.",
    icon: "lotus",
    category: "stress",
    keywords: [
      "meditation timer",
      "mindfulness timer",
      "meditation bell timer",
      "zen timer",
      "meditation clock",
      "guided meditation timer",
      "mindfulness practice timer",
      "meditation session timer",
    ],
    faqs: [
      {
        question: "How long should I meditate?",
        answer:
          "Start with 5 minutes and gradually increase. Research shows benefits from as little as 10 minutes daily. Experienced meditators typically sit for 20-45 minutes. Consistency matters more than duration — daily 10-minute sessions are better than occasional longer ones.",
      },
      {
        question: "What are interval bells used for?",
        answer:
          "Interval bells gently sound at set intervals during your meditation. They can help you stay present, mark transitions between different practices (e.g. body scan then breath focus), or simply reassure you that time is passing so you don't need to check the clock.",
      },
      {
        question: "When is the best time to meditate?",
        answer:
          "Morning meditation sets a calm tone for the day. However, the best time is whenever you can do it consistently. Some people prefer meditating before bed to improve sleep quality, while others use a midday session to manage stress.",
      },
      {
        question: "What are the proven benefits of meditation?",
        answer:
          "Research shows regular meditation can reduce stress and anxiety, lower blood pressure, improve focus and concentration, enhance emotional regulation, improve sleep quality, and even change brain structure in areas related to attention and emotional processing.",
      },
    ],
    relatedTools: [
      "breathing-timer",
      "stress-reduction-checklist",
      "sleep-calculator",
      "nap-calculator",
    ],
    relatedArticles: [
      { title: "Meditation for Beginners", href: "/wellness/meditation-beginners-guide" },
    ],
    affiliateHeading: "Meditation Essentials",
    affiliateText:
      "Meditation cushions, singing bowls, eye masks, incense, and mindfulness journals.",
  },
  {
    slug: "workout-split-generator",
    name: "Workout Split Generator - Weekly Training Plan Builder",
    shortName: "Workout Split Generator",
    description:
      "Generate a weekly workout split based on your training days, experience level, and goals. Get muscle group assignments and exercise suggestions for each day.",
    longDescription:
      "Your workout split — how you organise muscle groups across training days — is one of the biggest factors in your results. Tell us how many days you can train, your experience level, and your primary goal, and we'll generate an optimised weekly split with muscle group assignments and suggested exercises for each session.",
    icon: "clipboard",
    category: "fitness",
    keywords: [
      "workout split",
      "workout split generator",
      "push pull legs",
      "training split",
      "workout plan generator",
      "gym split",
      "bro split",
      "upper lower split",
      "workout schedule",
    ],
    faqs: [
      {
        question: "What is a workout split?",
        answer:
          "A workout split is how you divide your training across the week. Common splits include Push/Pull/Legs (PPL), Upper/Lower, Full Body, and the traditional 'bro split' (one muscle group per day). The best split depends on your schedule, experience, and goals.",
      },
      {
        question: "How many days per week should I train?",
        answer:
          "Beginners benefit from 3-4 days. Intermediate lifters typically train 4-5 days. Advanced lifters may train 5-6 days. More isn't always better — recovery is when muscle growth happens. Each muscle group needs roughly 48-72 hours of recovery.",
      },
      {
        question: "What is the Push/Pull/Legs split?",
        answer:
          "PPL divides workouts into push movements (chest, shoulders, triceps), pull movements (back, biceps, rear delts), and legs (quads, hamstrings, glutes, calves). It can be run 3 days/week or 6 days/week (each twice). It's popular because it provides good volume with logical groupings.",
      },
      {
        question: "Should beginners do full body or split routines?",
        answer:
          "Most evidence supports full-body routines for beginners (3 days/week). They allow higher training frequency per muscle group, are more time-efficient, and provide ample recovery. As you advance and need more volume per muscle group, splits become more practical.",
      },
    ],
    relatedTools: [
      "one-rep-max-calculator",
      "protein-calculator",
      "recovery-tracker",
      "muscle-recovery-calculator",
    ],
    relatedArticles: [
      { title: "Choosing the Right Workout Split", href: "/fitness/workout-split-guide" },
    ],
    affiliateHeading: "Strength Training Gear",
    affiliateText:
      "Lifting belts, wrist wraps, resistance bands, workout journals, and adjustable dumbbells.",
  },
  {
    slug: "pace-converter",
    name: "Pace Converter - Running Pace & Speed Calculator",
    shortName: "Pace Converter",
    description:
      "Convert running pace between min/km and min/mile. See your speed in km/h and mph, plus estimated finish times for common race distances.",
    longDescription:
      "Quickly convert your running pace between metric and imperial units. Enter a pace in minutes per kilometre or minutes per mile to see the conversion, your speed in both km/h and mph, and estimated finish times for 5K, 10K, half marathon, and full marathon distances.",
    icon: "arrows",
    category: "cardio",
    keywords: [
      "pace converter",
      "running pace converter",
      "min/km to min/mile",
      "pace calculator km to miles",
      "running speed calculator",
      "pace conversion chart",
      "km pace to mile pace",
    ],
    faqs: [
      {
        question: "How do I convert min/km to min/mile?",
        answer:
          "Multiply your min/km pace by 1.60934. For example, 5:00/km × 1.60934 = 8:03/mile. To convert min/mile to min/km, divide by 1.60934 (or multiply by 0.621371).",
      },
      {
        question: "What is a good running pace?",
        answer:
          "It depends on experience and distance. For recreational runners, a 5K pace of 6:00-7:00/km (9:40-11:15/mile) is common. Competitive runners target 4:00-5:00/km (6:26-8:03/mile). Elite runners run sub-3:00/km (sub-4:50/mile) for 5K.",
      },
      {
        question: "How does pace differ from speed?",
        answer:
          "Pace is time per distance (e.g. 5:30 per km), while speed is distance per time (e.g. 10.9 km/h). Runners typically think in pace because it directly translates to race finish times, but speed is useful for comparing with cycling or other activities.",
      },
    ],
    relatedTools: [
      "running-pace-calculator",
      "running-calorie-calculator",
      "vo2-max-calculator",
    ],
    relatedArticles: [
      { title: "Running Pace Strategy Guide", href: "/fitness/running-pace-strategy" },
    ],
    affiliateHeading: "Running Gear",
    affiliateText:
      "GPS running watches, running shoes, hydration vests, and training plan books.",
  },
  {
    slug: "stretching-routine-generator",
    name: "Stretching Routine Generator - Custom Flexibility Routine",
    shortName: "Stretching Routine",
    description:
      "Generate a personalised stretching routine based on your target areas, available time, and flexibility level. Get an ordered sequence with hold times.",
    longDescription:
      "A good stretching routine improves flexibility, reduces injury risk, and speeds recovery. Select the body areas you want to target, how much time you have, and your current flexibility level. The generator creates an ordered sequence of stretches with recommended hold times and clear instructions.",
    icon: "acrobat",
    category: "recovery",
    keywords: [
      "stretching routine",
      "stretching routine generator",
      "flexibility routine",
      "stretches for beginners",
      "full body stretch routine",
      "post workout stretches",
      "morning stretching routine",
      "daily stretching plan",
    ],
    faqs: [
      {
        question: "How long should I hold a stretch?",
        answer:
          "Hold static stretches for 15-30 seconds for maintenance, or 30-60 seconds to improve flexibility. The American College of Sports Medicine recommends holding each stretch for at least 15 seconds and repeating 2-4 times.",
      },
      {
        question: "Should I stretch before or after exercise?",
        answer:
          "Dynamic stretches (leg swings, arm circles) are best before exercise to warm up muscles. Static stretches (hold positions) are best after exercise when muscles are warm. Stretching cold muscles can increase injury risk.",
      },
      {
        question: "How often should I stretch?",
        answer:
          "For maintaining flexibility, stretch 2-3 times per week. For improving flexibility, daily stretching produces the best results. Even 10 minutes of stretching per day can make a significant difference over several weeks.",
      },
      {
        question: "Why is flexibility important?",
        answer:
          "Good flexibility reduces injury risk, improves posture, enhances athletic performance, reduces muscle soreness, increases range of motion for daily activities, and can help reduce lower back pain. Flexibility naturally decreases with age, making regular stretching increasingly important.",
      },
    ],
    relatedTools: [
      "flexibility-tracker",
      "mobility-assessment",
      "recovery-tracker",
    ],
    relatedArticles: [
      { title: "Flexibility Guide for Beginners", href: "/fitness/flexibility-guide" },
    ],
    affiliateHeading: "Flexibility Equipment",
    affiliateText:
      "Yoga mats, foam rollers, stretching straps, resistance bands, and flexibility training guides.",
  },
  {
    slug: "screen-time-calculator",
    name: "Screen Time Calculator - Understand Your Digital Habits",
    shortName: "Screen Time Calculator",
    description:
      "Enter your daily screen time by category to see weekly, monthly, and yearly totals. Get a health impact assessment and practical reduction tips.",
    longDescription:
      "Most people underestimate how much time they spend on screens. Log your daily hours across work, social media, entertainment, gaming, and other categories to see the true scale of your screen time. The calculator shows weekly, monthly, and yearly projections with a health impact assessment and evidence-based tips for reducing unnecessary screen use.",
    icon: "phone",
    category: "habits",
    keywords: [
      "screen time calculator",
      "how much screen time",
      "screen time tracker",
      "digital wellness",
      "screen time health effects",
      "reduce screen time",
      "daily screen time",
    ],
    faqs: [
      {
        question: "How much screen time is too much?",
        answer:
          "For adults, there's no official limit, but research suggests that recreational screen time over 2 hours per day is associated with poorer health outcomes. Work-related screen time is harder to reduce, but taking regular breaks (20-20-20 rule) helps mitigate effects.",
      },
      {
        question: "What is the 20-20-20 rule?",
        answer:
          "Every 20 minutes of screen use, look at something 20 feet (6 metres) away for at least 20 seconds. This helps reduce digital eye strain, dry eyes, and headaches associated with prolonged screen use.",
      },
      {
        question: "Does screen time affect sleep?",
        answer:
          "Yes. Blue light from screens suppresses melatonin production and can delay sleep onset. Screen use within 1-2 hours of bedtime is associated with poorer sleep quality, shorter sleep duration, and longer time to fall asleep.",
      },
      {
        question: "What health issues are linked to excessive screen time?",
        answer:
          "Research links excessive screen time to digital eye strain, neck and back pain, poor sleep, sedentary behaviour (increasing obesity and cardiovascular risk), increased anxiety and depression symptoms, and reduced social connection quality.",
      },
    ],
    relatedTools: [
      "sleep-calculator",
      "habit-tracker",
      "stress-reduction-checklist",
    ],
    relatedArticles: [
      { title: "Digital Wellness Guide", href: "/wellness/digital-wellness" },
    ],
    affiliateHeading: "Digital Wellness",
    affiliateText:
      "Blue-light glasses, screen time management apps, standing desks, and mindfulness journals.",
  },
  {
    slug: "muscle-recovery-calculator",
    name: "Muscle Recovery Calculator - When to Train Again",
    shortName: "Muscle Recovery Calculator",
    description:
      "Estimate muscle group recovery time based on workout intensity, training experience, and lifestyle factors. Know when each muscle group is ready to train again.",
    longDescription:
      "Training a muscle group before it has recovered can lead to overtraining, plateaus, and injury. This calculator estimates recovery time for each muscle group based on your workout intensity, training experience, sleep quality, nutrition, and stress levels. Plan your training schedule around optimal recovery windows.",
    icon: "muscle-clock",
    category: "recovery",
    keywords: [
      "muscle recovery time",
      "how long do muscles take to recover",
      "muscle recovery calculator",
      "when to train again",
      "rest days between workouts",
      "muscle recovery guide",
      "overtraining recovery",
    ],
    faqs: [
      {
        question: "How long does muscle recovery take?",
        answer:
          "Small muscle groups (biceps, triceps, calves) typically recover in 24-48 hours. Large muscle groups (legs, back, chest) need 48-72 hours. Very intense workouts or training to failure may require 72-96 hours. Individual recovery varies based on fitness level, nutrition, sleep, and stress.",
      },
      {
        question: "What are signs of incomplete recovery?",
        answer:
          "Persistent muscle soreness beyond 72 hours, decreased performance, increased resting heart rate, poor sleep, mood changes, loss of motivation, increased injury frequency, and feeling weaker in subsequent workouts are all signs you may need more recovery time.",
      },
      {
        question: "Does sleep affect muscle recovery?",
        answer:
          "Sleep is the single most important recovery factor. Growth hormone is released primarily during deep sleep, and muscle protein synthesis increases during rest. Research shows that sleeping less than 7 hours significantly impairs recovery, performance, and increases injury risk.",
      },
      {
        question: "Should I train a sore muscle?",
        answer:
          "Mild soreness (DOMS) is okay to train through, but sharp pain or severe soreness means the muscle needs more recovery. Active recovery (light movement, walking, gentle stretching) can help reduce soreness without impeding recovery.",
      },
    ],
    relatedTools: [
      "recovery-tracker",
      "workout-split-generator",
      "sleep-calculator",
      "protein-calculator",
    ],
    relatedArticles: [
      { title: "Muscle Recovery Science", href: "/fitness/muscle-recovery-guide" },
    ],
    affiliateHeading: "Recovery Tools",
    affiliateText:
      "Massage guns, foam rollers, compression garments, BCAA supplements, and sleep aids.",
  },
  {
    slug: "yoga-flow-builder",
    name: "Yoga Flow Builder - Create Your Custom Yoga Sequence",
    shortName: "Yoga Flow Builder",
    description:
      "Build a personalised yoga flow based on your level, time, and focus area. Get an ordered sequence of poses with durations and a guided practice timer.",
    longDescription:
      "Design a yoga sequence tailored to your needs. Choose your experience level, how long you want to practise, and what you want to focus on (flexibility, strength, relaxation, or energy). The flow builder creates an ordered sequence of poses appropriate for your level, with hold times and a built-in practice timer to guide you through the session.",
    icon: "yoga-flow",
    category: "stress",
    keywords: [
      "yoga flow builder",
      "yoga sequence generator",
      "yoga for beginners",
      "yoga routine",
      "yoga flow",
      "custom yoga sequence",
      "yoga pose sequence",
      "yoga practice planner",
    ],
    faqs: [
      {
        question: "How long should a yoga session be?",
        answer:
          "Even 10-15 minutes of yoga provides benefits. A typical class is 60-90 minutes, but 20-30 minute home sessions are effective for building strength, flexibility, and reducing stress. Consistency matters more than duration.",
      },
      {
        question: "What type of yoga is best for beginners?",
        answer:
          "Hatha yoga moves slowly with clear instruction, making it ideal for beginners. Vinyasa (flow) yoga links poses with breath and moves faster. Yin yoga holds poses for 3-5 minutes, focusing on deep tissue flexibility. Start with beginner-level flows and progress gradually.",
      },
      {
        question: "Can yoga build strength?",
        answer:
          "Yes. Yoga builds functional strength, particularly in the core, shoulders, back, and legs. Poses like plank, chaturanga, warrior sequences, and arm balances are challenging strength exercises. Power yoga and vinyasa flows are particularly effective for building muscle.",
      },
      {
        question: "How often should I do yoga?",
        answer:
          "2-3 sessions per week is a good starting point. Many practitioners benefit from daily yoga, even if sessions are short. Listen to your body — yoga should complement your other training, not leave you exhausted or overly sore.",
      },
    ],
    relatedTools: [
      "meditation-timer",
      "breathing-timer",
      "stretching-routine-generator",
      "flexibility-tracker",
    ],
    relatedArticles: [
      { title: "Yoga for Beginners Guide", href: "/fitness/yoga-beginners-guide" },
    ],
    affiliateHeading: "Yoga Essentials",
    affiliateText:
      "Yoga mats, blocks, straps, bolsters, and online yoga class subscriptions.",
  },
  {
    slug: "creatine-calculator",
    name: "Creatine Calculator - Daily Dosage & Loading Protocol",
    shortName: "Creatine Calculator",
    description:
      "Calculate your optimal daily creatine dose based on body weight. See loading and maintenance protocols with timing recommendations.",
    longDescription:
      "Creatine monohydrate is one of the most researched and effective sports supplements. This calculator provides personalised dosing based on your body weight for both the loading phase (rapid saturation) and daily maintenance. Learn the science behind creatine, optimal timing, and what to expect.",
    icon: "pill",
    category: "nutrition",
    keywords: [
      "creatine calculator",
      "creatine dosage calculator",
      "how much creatine should I take",
      "creatine loading phase",
      "creatine dose by weight",
      "creatine maintenance dose",
      "creatine monohydrate dosage",
    ],
    faqs: [
      {
        question: "How much creatine should I take daily?",
        answer:
          "The standard maintenance dose is 3-5 grams per day (approximately 0.03-0.04 g per kg of body weight). An optional loading phase of 0.3 g/kg/day (split into 4 doses) for 5-7 days can saturate muscles faster, but is not required — daily maintenance dosing reaches the same levels in 3-4 weeks.",
      },
      {
        question: "Do I need to do a loading phase?",
        answer:
          "No. A loading phase (20g/day for 5-7 days) saturates muscles faster, but taking 3-5g daily will reach the same creatine levels in about 3-4 weeks. Loading can cause temporary water retention and mild digestive discomfort in some people.",
      },
      {
        question: "When should I take creatine?",
        answer:
          "Timing is not critical — consistency matters more. Some research suggests post-workout may be slightly better due to increased blood flow and nutrient uptake. Taking it with a meal can improve absorption and reduce any digestive discomfort.",
      },
      {
        question: "Is creatine safe?",
        answer:
          "Creatine monohydrate is one of the most studied supplements in sports science. Research consistently shows it is safe for healthy adults when used at recommended doses. It does not cause kidney damage in healthy individuals. Stay well hydrated while supplementing.",
      },
      {
        question: "Does creatine cause water retention?",
        answer:
          "Creatine draws water into muscle cells, which can increase body weight by 1-3 kg, mostly in the first week. This is intracellular water (inside muscles), not subcutaneous water retention, and actually makes muscles appear fuller.",
      },
    ],
    relatedTools: [
      "protein-calculator",
      "one-rep-max-calculator",
      "macro-calculator",
      "muscle-recovery-calculator",
    ],
    relatedArticles: [
      { title: "Creatine Guide: Benefits, Dosing & Safety", href: "/nutrition/creatine-guide" },
    ],
    affiliateHeading: "Supplements",
    affiliateText:
      "Creatine monohydrate, shaker bottles, digital scales, and pre-workout supplements.",
  },
  {
    slug: "sleep-debt-calculator",
    name: "Sleep Debt Calculator - How Much Sleep Do You Owe?",
    shortName: "Sleep Debt Calculator",
    description:
      "Calculate your accumulated sleep debt over the past week. See how much extra sleep you need and get a personalised recovery plan.",
    longDescription:
      "Sleep debt is the difference between the sleep you need and the sleep you actually get. Even small nightly shortfalls accumulate into significant debt that affects cognition, mood, and health. Enter your sleep target and actual hours for the past 7 nights to see your total sleep debt and get a realistic recovery plan.",
    icon: "sleep-debt",
    category: "sleep",
    keywords: [
      "sleep debt calculator", "sleep deficit", "how much sleep do I owe",
      "sleep debt recovery", "accumulated sleep debt", "sleep deprivation calculator",
    ],
    faqs: [
      { question: "What is sleep debt?", answer: "Sleep debt is the cumulative difference between the amount of sleep you need and the amount you actually get. If you need 8 hours but only sleep 6, you accumulate 2 hours of debt per night — 14 hours over a week." },
      { question: "Can you pay back sleep debt?", answer: "Short-term sleep debt (a few days) can be recovered with extra sleep over the following nights. Chronic sleep debt (weeks or months) is harder to recover from and may require consistent, sustained improvements in sleep habits rather than a single long sleep." },
      { question: "How much sleep do adults need?", answer: "The National Sleep Foundation recommends 7-9 hours for adults aged 18-64 and 7-8 hours for those over 65. Individual needs vary — some people genuinely function well on 7 hours while others need 9." },
      { question: "What are the effects of sleep debt?", answer: "Sleep debt impairs concentration, memory, decision-making, reaction time, and emotional regulation. Chronic sleep debt is linked to increased risk of obesity, diabetes, cardiovascular disease, weakened immunity, and mental health issues." },
    ],
    relatedTools: ["sleep-calculator", "nap-calculator", "caffeine-calculator"],
    relatedArticles: [{ title: "Understanding Sleep Debt", href: "/sleep/sleep-debt-guide" }],
    affiliateHeading: "Sleep Better",
    affiliateText: "Sleep trackers, weighted blankets, blackout curtains, and magnesium supplements for deeper rest.",
  },
  {
    slug: "chronotype-quiz",
    name: "Chronotype Quiz - Are You a Lion, Bear, Wolf, or Dolphin?",
    shortName: "Chronotype Quiz",
    description:
      "Discover your sleep chronotype with this quiz based on Dr. Michael Breus's research. Get personalised sleep, productivity, and exercise timing recommendations.",
    longDescription:
      "Your chronotype is your body's natural tendency toward sleeping and waking at certain times. Understanding whether you are a Lion (early riser), Bear (follows the sun), Wolf (night owl), or Dolphin (light sleeper) helps you optimise your daily schedule for peak performance, better sleep, and improved wellbeing.",
    icon: "owl",
    category: "sleep",
    keywords: [
      "chronotype quiz", "sleep chronotype", "am I a night owl or early bird",
      "lion bear wolf dolphin quiz", "chronotype test", "sleep personality quiz",
      "best time to sleep for my body",
    ],
    faqs: [
      { question: "What are the four chronotypes?", answer: "Lion: early risers who peak in the morning (15-20% of people). Bear: follow the solar cycle, most productive mid-morning (50%). Wolf: night owls who peak in the evening (15-20%). Dolphin: light sleepers with irregular patterns (10%)." },
      { question: "Can your chronotype change?", answer: "Chronotype shifts naturally with age — teenagers tend toward Wolf, while older adults shift toward Lion. You can't fundamentally change your chronotype, but you can adjust habits to work better within your natural pattern." },
      { question: "How does chronotype affect productivity?", answer: "Each chronotype has peak focus windows. Lions peak from 8-12pm, Bears from 10am-2pm, Wolves from 5-9pm, and Dolphins in short bursts mid-morning. Scheduling demanding work during your peak window significantly improves output." },
      { question: "Is this quiz scientifically based?", answer: "This quiz is inspired by Dr. Michael Breus's chronotype model, which builds on decades of circadian rhythm research. While simplified, the four-type framework helps people identify their natural patterns and make practical scheduling adjustments." },
    ],
    relatedTools: ["sleep-calculator", "sleep-debt-calculator", "nap-calculator", "caffeine-calculator"],
    relatedArticles: [{ title: "Understanding Your Chronotype", href: "/sleep/chronotype-guide" }],
    affiliateHeading: "Sleep Optimisation",
    affiliateText: "Dawn simulators, blue-light glasses, sleep journals, and chronotype-specific supplements.",
  },
  {
    slug: "cold-plunge-timer",
    name: "Cold Plunge Timer - Ice Bath Duration & Temperature Guide",
    shortName: "Cold Plunge Timer",
    description:
      "Time your cold plunge sessions with recommended durations based on water temperature and experience level. Track your cold exposure practice safely.",
    longDescription:
      "Cold water immersion has gained attention for potential benefits including reduced inflammation, improved mood, and enhanced recovery. This timer helps you build a safe cold plunge practice with duration recommendations based on water temperature and your experience level. Start conservatively and progress gradually.",
    icon: "snowflake",
    category: "recovery",
    keywords: [
      "cold plunge timer", "ice bath timer", "cold water immersion",
      "cold plunge benefits", "how long cold plunge", "ice bath duration",
      "cold exposure timer", "cold plunge for beginners",
    ],
    faqs: [
      { question: "How long should a cold plunge be?", answer: "Beginners should start with 30-60 seconds and work up gradually. Most research uses 2-5 minute exposures. Experienced practitioners may go up to 10-15 minutes in milder temperatures (15°C/59°F). Never exceed your comfort level and exit immediately if you feel unwell." },
      { question: "What temperature should a cold plunge be?", answer: "Most protocols use water between 3-15°C (37-59°F). Beginners should start warmer (12-15°C) and progress to colder temperatures over weeks. Below 5°C is considered advanced and requires experience." },
      { question: "What are the benefits of cold plunges?", answer: "Research suggests cold water immersion may reduce muscle soreness, decrease inflammation, improve mood through dopamine and norepinephrine release, enhance circulation, and build mental resilience. However, more research is needed for many claimed benefits." },
      { question: "Who should avoid cold plunges?", answer: "People with cardiovascular conditions, Raynaud's disease, cold urticaria, uncontrolled blood pressure, or who are pregnant should avoid cold water immersion. Always consult your doctor before starting a cold plunge practice." },
    ],
    relatedTools: ["recovery-tracker", "muscle-recovery-calculator", "breathing-timer", "meditation-timer"],
    relatedArticles: [{ title: "Cold Plunge Guide for Beginners", href: "/recovery/cold-plunge-guide" }],
    affiliateHeading: "Cold Plunge Equipment",
    affiliateText: "Cold plunge tubs, ice bath barrels, waterproof thermometers, and recovery robes.",
  },
  {
    slug: "sauna-timer",
    name: "Sauna Timer - Session Duration & Safety Guide",
    shortName: "Sauna Timer",
    description:
      "Time your sauna sessions with duration and temperature recommendations based on sauna type, experience, and health goals. Includes hydration reminders.",
    longDescription:
      "Regular sauna use is associated with cardiovascular benefits, stress reduction, and improved recovery. This timer helps you structure safe, effective sauna sessions with recommendations based on the type of sauna (traditional, infrared, steam), your experience level, and your goals. Includes hydration tracking and cool-down guidance.",
    icon: "thermometer",
    category: "recovery",
    keywords: [
      "sauna timer", "sauna session length", "how long in sauna",
      "sauna benefits", "infrared sauna timer", "sauna temperature guide",
      "sauna for recovery", "sauna health benefits",
    ],
    faqs: [
      { question: "How long should a sauna session be?", answer: "Beginners should start with 5-10 minutes. Experienced users typically do 15-20 minutes per session. Finnish sauna tradition often involves 2-3 rounds of 10-20 minutes with cool-down breaks. Never exceed 30 minutes in a single session." },
      { question: "What temperature should a sauna be?", answer: "Traditional saunas: 70-100°C (158-212°F). Infrared saunas: 45-65°C (113-149°F). Steam rooms: 40-50°C (104-122°F). Infrared saunas operate at lower temperatures but the infrared radiation heats your body directly." },
      { question: "What are the proven health benefits of sauna?", answer: "A large Finnish study found regular sauna use (4-7 times/week) was associated with significantly reduced risk of cardiovascular death, lower blood pressure, and reduced all-cause mortality. Sauna also triggers heat shock proteins that support cellular repair and immune function." },
      { question: "How much water should I drink during a sauna?", answer: "Drink at least 500ml (16oz) of water before your session and another 500ml-1L after. You can lose 0.5-1kg of water weight per session through sweating. Replace electrolytes if doing extended or multiple sessions." },
    ],
    relatedTools: ["cold-plunge-timer", "recovery-tracker", "hydration-calculator", "muscle-recovery-calculator"],
    relatedArticles: [{ title: "Sauna Benefits and Best Practices", href: "/recovery/sauna-guide" }],
    affiliateHeading: "Sauna Accessories",
    affiliateText: "Sauna thermometers, wooden buckets, essential oils, towels, and portable infrared saunas.",
  },
  {
    slug: "pregnancy-weight-gain-calculator",
    name: "Pregnancy Weight Gain Calculator - Healthy Range by Trimester",
    shortName: "Pregnancy Weight Calculator",
    description:
      "Calculate the recommended weight gain range during pregnancy based on your pre-pregnancy BMI. Track your progress by trimester with IOM guidelines.",
    longDescription:
      "Healthy weight gain during pregnancy supports your baby's growth and your own health. Based on Institute of Medicine (IOM) guidelines, this calculator shows your recommended total weight gain range and expected gain by week and trimester, customised to your pre-pregnancy BMI. Track where you fall relative to the guidelines.",
    icon: "pregnant",
    category: "habits",
    keywords: [
      "pregnancy weight gain calculator", "how much weight should I gain pregnant",
      "pregnancy weight tracker", "healthy pregnancy weight gain",
      "weight gain by trimester", "IOM pregnancy weight gain",
    ],
    faqs: [
      { question: "How much weight should I gain during pregnancy?", answer: "The IOM recommends: Underweight (BMI < 18.5): 12.5-18 kg (28-40 lbs). Normal weight (BMI 18.5-24.9): 11.5-16 kg (25-35 lbs). Overweight (BMI 25-29.9): 7-11.5 kg (15-25 lbs). Obese (BMI ≥ 30): 5-9 kg (11-20 lbs)." },
      { question: "When does most pregnancy weight gain happen?", answer: "Most weight gain occurs in the second and third trimesters. In the first trimester, expect 0.5-2 kg (1-4 lbs) total. From the second trimester onwards, expect roughly 0.4-0.5 kg (about 1 lb) per week for normal-weight women." },
      { question: "What does pregnancy weight gain consist of?", answer: "Baby: 3-4 kg. Placenta: 0.5-1 kg. Amniotic fluid: 1 kg. Uterus growth: 1 kg. Increased blood volume: 1.5-2 kg. Breast tissue: 0.5-1 kg. Fat stores for breastfeeding: 2-4 kg. Increased fluid: 1-2 kg." },
      { question: "Is it safe to lose weight during pregnancy?", answer: "Intentional weight loss during pregnancy is generally not recommended. If you are overweight or obese, your provider may recommend slower weight gain rather than weight loss. Always follow your healthcare provider's personalised guidance." },
    ],
    relatedTools: ["pregnancy-due-date-calculator", "calorie-calculator", "hydration-calculator"],
    relatedArticles: [{ title: "Healthy Pregnancy Weight Guide", href: "/wellness/pregnancy-weight-guide" }],
    affiliateHeading: "Pregnancy Wellness",
    affiliateText: "Pregnancy scales, bump-friendly fitness gear, prenatal vitamins, and pregnancy journals.",
  },
  {
    slug: "biological-age-calculator",
    name: "Biological Age Calculator - How Old Is Your Body Really?",
    shortName: "Biological Age Calculator",
    description:
      "Estimate your biological age based on lifestyle, fitness, sleep, nutrition, and health markers. Compare your biological age to your chronological age.",
    longDescription:
      "Your biological age reflects how well your body is ageing compared to your calendar age. This quiz-style calculator assesses key lifestyle factors — exercise habits, sleep quality, nutrition, stress levels, social connection, and health markers — to estimate whether your body is ageing faster or slower than average. Get personalised recommendations to improve your biological age.",
    icon: "dna",
    category: "habits",
    keywords: [
      "biological age calculator", "biological age test", "how old is my body",
      "real age calculator", "body age calculator", "biological age quiz",
      "am I ageing well", "healthy ageing calculator",
    ],
    faqs: [
      { question: "What is biological age?", answer: "Biological age measures how well your body functions compared to average for your chronological age. Someone who is 50 but exercises regularly, sleeps well, and manages stress might have a biological age of 42, meaning their body functions like a typical 42-year-old." },
      { question: "How accurate is this calculator?", answer: "This is a lifestyle-based estimate, not a clinical measurement. True biological age testing uses biomarkers like DNA methylation, telomere length, or blood panels. This quiz provides a directional estimate based on factors strongly correlated with biological ageing in research." },
      { question: "Can I lower my biological age?", answer: "Yes. Research shows that regular exercise, quality sleep, stress management, a healthy diet, not smoking, moderate alcohol intake, and strong social connections can all slow biological ageing. Some studies show measurable biological age reversal with sustained lifestyle changes." },
      { question: "What factors most affect biological age?", answer: "The biggest modifiable factors are: regular exercise (especially both cardio and strength training), sleep quality and duration, diet quality, stress management, not smoking, and social connection. Genetics play a role but lifestyle factors are highly influential." },
    ],
    relatedTools: ["sleep-calculator", "calorie-calculator", "stress-reduction-checklist", "habit-tracker"],
    relatedArticles: [{ title: "Healthy Ageing Guide", href: "/wellness/healthy-ageing-guide" }],
    affiliateHeading: "Longevity & Ageing",
    affiliateText: "Biological age test kits, longevity supplements, fitness trackers, and healthy ageing books.",
  },
  {
    slug: "meal-timing-calculator",
    name: "Meal Timing Calculator - Optimal Eating Windows",
    shortName: "Meal Timing Calculator",
    description:
      "Calculate optimal meal and snack times based on your wake time, sleep time, workout schedule, and eating pattern. Align nutrition with your daily rhythm.",
    longDescription:
      "When you eat can be as important as what you eat. This calculator generates a personalised meal timing schedule based on your daily routine, workout times, and preferred eating pattern (3 meals, 5 small meals, or intermittent fasting). Align your nutrition with your circadian rhythm and training for better energy, digestion, and performance.",
    icon: "clock-meal",
    category: "nutrition",
    keywords: [
      "meal timing calculator", "when should I eat", "optimal meal times",
      "meal schedule planner", "eating schedule calculator",
      "best time to eat before workout", "nutrient timing",
    ],
    faqs: [
      { question: "Does meal timing matter?", answer: "Research suggests that eating in alignment with your circadian rhythm — more calories earlier in the day — can improve metabolic health, weight management, and sleep quality. Pre- and post-workout nutrition timing also affects performance and recovery." },
      { question: "How long before a workout should I eat?", answer: "A full meal 2-3 hours before exercise is ideal. A lighter snack can be eaten 30-60 minutes before. After exercise, eating within 30-60 minutes helps replenish glycogen and supports muscle recovery, especially if you train hard." },
      { question: "Is it bad to eat late at night?", answer: "Eating close to bedtime can impair sleep quality and may be associated with weight gain. Research suggests finishing your last meal at least 2-3 hours before bed. However, a small protein-rich snack before bed can support overnight muscle recovery." },
      { question: "How many meals per day is optimal?", answer: "There is no single best number. Both 3 meals and 5-6 smaller meals can work well depending on your preferences, schedule, and goals. Total daily intake matters more than meal frequency for most health outcomes. Consistency matters most." },
    ],
    relatedTools: ["calorie-calculator", "macro-calculator", "fasting-tracker", "protein-calculator"],
    relatedArticles: [{ title: "Nutrient Timing Guide", href: "/nutrition/nutrient-timing" }],
    affiliateHeading: "Meal Prep",
    affiliateText: "Meal prep containers, food scales, portion control plates, and timed eating reminder apps.",
  },
  {
    slug: "fiber-calculator",
    name: "Fiber Calculator - Daily Fiber Intake Recommendation",
    shortName: "Fiber Calculator",
    description:
      "Calculate your recommended daily fiber intake based on age and sex. Track your current intake and get high-fiber food suggestions to close the gap.",
    longDescription:
      "Most people consume far less fiber than recommended, which affects digestive health, heart health, and blood sugar control. Enter your age, sex, and estimated current fiber intake to see your recommended target, how much you are falling short, and specific high-fiber food suggestions to bridge the gap.",
    icon: "grain",
    category: "nutrition",
    keywords: [
      "fiber calculator", "how much fiber do I need", "daily fiber intake",
      "fiber recommendation by age", "high fiber foods", "fiber intake calculator",
      "dietary fiber calculator",
    ],
    faqs: [
      { question: "How much fiber do adults need?", answer: "The Academy of Nutrition and Dietetics recommends 25g per day for women and 38g per day for men (14g per 1,000 calories consumed). After age 50, recommendations decrease to 21g for women and 30g for men. Most adults only consume about 15g per day." },
      { question: "What happens if I don't eat enough fiber?", answer: "Insufficient fiber is linked to constipation, poor gut health, higher cholesterol, unstable blood sugar, increased risk of colorectal cancer, and reduced satiety (leading to overeating). Fiber feeds beneficial gut bacteria that support immune function and mental health." },
      { question: "Should I increase fiber intake gradually?", answer: "Yes. Increasing fiber too quickly can cause bloating, gas, and discomfort. Add 3-5 grams per week and drink plenty of water. Your gut microbiome needs time to adapt to higher fiber intake." },
      { question: "What are the best sources of fiber?", answer: "Legumes (lentils, chickpeas, black beans): 12-15g per cup. Whole grains (oats, quinoa, brown rice): 3-8g per serving. Fruits (raspberries, pears, apples with skin): 4-8g each. Vegetables (broccoli, artichoke, Brussels sprouts): 4-10g per cup. Seeds (chia, flax): 5-10g per tablespoon." },
    ],
    relatedTools: ["macro-calculator", "calorie-calculator", "protein-calculator", "hydration-calculator"],
    relatedArticles: [{ title: "Complete Fiber Guide", href: "/nutrition/fiber-guide" }],
    affiliateHeading: "Fiber Supplements",
    affiliateText: "Psyllium husk, chia seeds, fiber supplements, and high-fiber recipe books.",
  },
  {
    slug: "jump-rope-calorie-calculator",
    name: "Jump Rope Calorie Calculator - Calories Burned Skipping",
    shortName: "Jump Rope Calorie Calculator",
    description:
      "Calculate calories burned jumping rope based on your weight, duration, and intensity. Compare jump rope to other cardio exercises.",
    longDescription:
      "Jump rope is one of the most efficient cardio exercises, burning more calories per minute than running, cycling, or swimming at equivalent effort. Enter your weight, session duration, and jumping intensity to see your estimated calorie burn, plus comparisons to other popular cardio activities.",
    icon: "jump-rope",
    category: "cardio",
    keywords: [
      "jump rope calories", "calories burned jump rope", "skipping calories",
      "jump rope calorie calculator", "how many calories does jump rope burn",
      "jump rope for weight loss", "skipping rope calories burned",
    ],
    faqs: [
      { question: "How many calories does jumping rope burn?", answer: "A 70kg (154lb) person burns approximately 10-16 calories per minute jumping rope, depending on intensity. That is 300-480 calories in 30 minutes — comparable to running at 8-10 km/h. Higher intensity (double unders, faster pace) burns significantly more." },
      { question: "Is jump rope better than running for burning calories?", answer: "Minute for minute, jumping rope generally burns more calories than running at a moderate pace. A 10-minute jump rope session is roughly equivalent to running a 8-minute mile. Jump rope also provides more upper body engagement and coordination training." },
      { question: "How long should I jump rope for?", answer: "Beginners should start with 5-10 minute sessions with rest breaks. Intermediate: 15-20 minutes. Advanced: 20-30+ minutes. Even short intervals (1-3 minute rounds) provide excellent cardiovascular benefits when done consistently." },
      { question: "What MET value is used for jump rope?", answer: "MET values: slow pace (< 100 skips/min) = 8.8, moderate pace (100-120 skips/min) = 11.8, fast pace (> 120 skips/min) = 12.3. Double unders and advanced tricks increase to approximately 14.0 METs." },
    ],
    relatedTools: ["running-calorie-calculator", "cycling-calorie-calculator", "steps-to-calories-calculator"],
    relatedArticles: [{ title: "Jump Rope Workout Guide", href: "/fitness/jump-rope-guide" }],
    affiliateHeading: "Jump Rope Gear",
    affiliateText: "Speed ropes, weighted ropes, jump rope mats, and interval timer apps.",
  },
  {
    slug: "stair-climbing-calorie-calculator",
    name: "Stair Climbing Calorie Calculator - Calories Burned on Stairs",
    shortName: "Stair Climbing Calculator",
    description:
      "Calculate calories burned climbing stairs based on your weight, number of floors or minutes, and pace. See how stairs compare to other exercises.",
    longDescription:
      "Climbing stairs is a free, accessible workout that burns significant calories and strengthens your lower body and cardiovascular system. Calculate your calorie burn whether you are taking the stairs at work, doing a stair machine workout, or climbing a specific number of floors. Compare stair climbing to other activities.",
    icon: "stairs",
    category: "cardio",
    keywords: [
      "stair climbing calories", "calories burned climbing stairs",
      "stairs calorie calculator", "stair stepper calories",
      "how many calories climbing stairs", "stair climbing exercise",
    ],
    faqs: [
      { question: "How many calories does climbing stairs burn?", answer: "A 70kg person burns approximately 0.15-0.20 calories per stair step, or roughly 5-10 calories per flight (one storey). Stair climbing burns about 8-11 calories per minute, which is higher than walking (3-5 cal/min) and comparable to jogging." },
      { question: "How many stairs equal a workout?", answer: "Climbing 10-20 flights (about 150-300 steps) provides a meaningful workout for most people. The Empire State Building Run-Up covers 86 floors (1,576 steps). Even 5 flights per day provides measurable cardiovascular and muscular benefits over time." },
      { question: "Is stair climbing good for weight loss?", answer: "Yes. Stair climbing is highly effective for weight loss because it burns significant calories, requires no equipment, and can be incorporated into daily routines. It also builds lower body muscle, which increases resting metabolic rate." },
      { question: "What MET values are used?", answer: "Slow stair climbing = 4.0 METs, moderate pace = 8.8 METs, fast/vigorous = 14.0 METs. Descending stairs = 3.5 METs. Stair machine (general) = 9.0 METs." },
    ],
    relatedTools: ["walking-calorie-calculator", "steps-to-calories-calculator", "running-calorie-calculator"],
    relatedArticles: [{ title: "Stair Climbing for Fitness", href: "/fitness/stair-climbing-guide" }],
    affiliateHeading: "Stair Climbing Gear",
    affiliateText: "Mini steppers, stair climbing machines, knee supports, and activity trackers.",
  },
  {
    slug: "rowing-calorie-calculator",
    name: "Rowing Calorie Calculator - Indoor & Outdoor Rowing Calories",
    shortName: "Rowing Calorie Calculator",
    description:
      "Calculate calories burned rowing based on your weight, duration, intensity, and rowing type. See split times and compare to other cardio exercises.",
    longDescription:
      "Rowing is a full-body exercise that works 86% of your muscles while providing excellent cardiovascular training. Whether you use an indoor rowing machine (ergometer) or row on water, this calculator estimates your calorie burn based on weight, duration, and intensity. See how rowing compares to other cardio activities.",
    icon: "rowing",
    category: "cardio",
    keywords: [
      "rowing calories", "rowing calorie calculator", "calories burned rowing",
      "rowing machine calories", "indoor rowing calories", "concept 2 calories",
      "how many calories does rowing burn", "rowing for weight loss",
    ],
    faqs: [
      { question: "How many calories does rowing burn?", answer: "A 70kg person burns approximately 200-300 calories in 30 minutes of moderate rowing and 350-500 calories during vigorous rowing. Rowing burns more calories than cycling at equivalent effort because it uses both upper and lower body muscles simultaneously." },
      { question: "Is rowing a good full-body workout?", answer: "Yes. Rowing engages approximately 86% of your muscles. The drive phase works legs (60%), back and core (20%), and arms (20%). It develops cardiovascular fitness, muscular endurance, and strength simultaneously — making it one of the most efficient exercises." },
      { question: "What MET values are used for rowing?", answer: "Ergometer (light effort, 50W) = 4.8 METs. Moderate (100W) = 7.0 METs. Vigorous (150W) = 8.5 METs. Very vigorous (200W+) = 12.0 METs. On-water recreational rowing = 5.3 METs, competitive = 12.0 METs." },
      { question: "How does rowing compare to running?", answer: "At moderate intensity, 30 minutes of rowing burns similar calories to 30 minutes of running at 8-9 km/h. Rowing has the advantage of being low-impact (easier on joints) and providing a full-body workout rather than primarily lower body." },
    ],
    relatedTools: ["cycling-calorie-calculator", "swimming-calorie-calculator", "running-calorie-calculator"],
    relatedArticles: [{ title: "Rowing Workout Guide", href: "/fitness/rowing-guide" }],
    affiliateHeading: "Rowing Equipment",
    affiliateText: "Indoor rowing machines, rowing gloves, heart rate monitors, and rowing training plans.",
  },
  {
    slug: "plank-timer",
    name: "Plank Timer - Core Exercise Timer with Progress Tracking",
    shortName: "Plank Timer",
    description:
      "Time your plank holds with a visual countdown, progressive goals, and variation suggestions. Track your progress and build core strength systematically.",
    longDescription:
      "The plank is the most effective bodyweight core exercise, strengthening your abs, back, shoulders, and glutes simultaneously. This timer helps you build plank endurance with customisable durations, multiple plank variations, and progressive goals. Set a target, watch the countdown, and track your improvement over sessions.",
    icon: "plank",
    category: "fitness",
    keywords: [
      "plank timer", "plank hold timer", "plank exercise timer",
      "how long can you plank", "plank challenge timer",
      "core exercise timer", "plank workout",
    ],
    faqs: [
      { question: "How long should I hold a plank?", answer: "Beginners: aim for 20-30 seconds. Intermediate: 45-90 seconds. Advanced: 2-5 minutes. Research suggests that multiple shorter planks (3-4 sets of 30-60 seconds) may be more beneficial than one long hold for building functional core strength." },
      { question: "What muscles does a plank work?", answer: "Planks primarily target the rectus abdominis, transverse abdominis, obliques, and erector spinae. They also engage the shoulders (deltoids), chest (pectorals), glutes, quadriceps, and hip flexors. This makes them a true full-body isometric exercise." },
      { question: "Are planks better than sit-ups?", answer: "For most people, yes. Planks train the core in its functional role (stabilisation) without the spinal flexion of sit-ups, which can strain the lower back. Planks also engage more muscle groups and build the anti-extension strength needed for daily activities and sports." },
      { question: "How often should I plank?", answer: "Planks can be done daily since they are an isometric exercise with minimal muscle damage. However, for progressive overload, 3-4 times per week with rest days allows better adaptation. Vary the plank type to prevent plateaus and target different muscle fibres." },
    ],
    relatedTools: ["hiit-timer", "one-rep-max-calculator", "workout-split-generator"],
    relatedArticles: [{ title: "Core Training Guide", href: "/fitness/core-training-guide" }],
    affiliateHeading: "Core Training",
    affiliateText: "Exercise mats, ab wheels, stability balls, and core training programs.",
  },
  {
    slug: "bac-calculator",
    name: "Blood Alcohol Calculator (BAC) - Estimate Your BAC Level",
    shortName: "BAC Calculator",
    description:
      "Estimate your blood alcohol concentration based on your drinks, weight, sex, and time elapsed. Understand how alcohol affects your body and when you may be sober.",
    longDescription:
      "Blood Alcohol Concentration (BAC) measures the percentage of alcohol in your bloodstream. This calculator uses the Widmark formula to estimate your BAC based on what you have drunk, your body weight, biological sex, and how much time has passed. Understand the effects at different BAC levels and when you may return to zero.",
    icon: "beer",
    category: "habits",
    keywords: [
      "BAC calculator", "blood alcohol calculator", "blood alcohol level",
      "how drunk am I", "alcohol calculator", "BAC estimator",
      "when will I be sober", "blood alcohol concentration calculator",
    ],
    faqs: [
      { question: "How is BAC calculated?", answer: "The Widmark formula estimates BAC: BAC = (grams of alcohol / (body weight in grams × r)) − (0.015 × hours since first drink). The 'r' value (Widmark factor) is 0.68 for males and 0.55 for females, reflecting differences in body water content." },
      { question: "What BAC level is legally drunk?", answer: "Most US states and many countries set the legal driving limit at 0.08% BAC. However, impairment begins well below this level — reaction time and judgment are measurably affected at 0.02-0.03% BAC. Many European countries use a 0.05% limit." },
      { question: "How fast does alcohol leave your system?", answer: "Your body metabolises alcohol at approximately 0.015% BAC per hour (roughly one standard drink per hour). This rate cannot be sped up by coffee, cold showers, food, or exercise. Only time reduces BAC." },
      { question: "Is this calculator accurate for driving decisions?", answer: "No BAC calculator should be used to decide if you are safe to drive. Impairment varies greatly between individuals and can occur at any BAC level. The only safe BAC for driving is 0.00%. This tool is for educational purposes only." },
    ],
    relatedTools: ["alcohol-unit-calculator", "hydration-calculator", "sleep-calculator"],
    relatedArticles: [{ title: "Alcohol and Health", href: "/wellness/alcohol-health-guide" }],
    affiliateHeading: "Responsible Drinking",
    affiliateText: "Personal BAC testers, non-alcoholic alternatives, drink tracking apps, and alcohol-free spirits.",
  },
  {
    slug: "push-up-test",
    name: "Push-Up Test - Assess Your Upper Body Fitness Level",
    shortName: "Push-Up Test",
    description:
      "Assess your upper body strength and endurance with the standardised push-up test. Compare your score to age and sex-based fitness norms.",
    longDescription:
      "The push-up test is a widely used fitness assessment that measures upper body muscular endurance. Perform as many push-ups as you can in one minute (or until failure), enter your count along with your age and sex, and see how you compare to established fitness norms. Track your progress over time and get training recommendations to improve.",
    icon: "pushup",
    category: "fitness",
    keywords: [
      "push up test", "push up fitness test", "how many push ups should I do",
      "push up norms by age", "push up assessment", "upper body fitness test",
      "push up standards", "push up test chart",
    ],
    faqs: [
      { question: "How many push-ups should I be able to do?", answer: "It varies by age and sex. For men aged 20-29: 17-29 is average, 36+ is above average. For women aged 20-29: 6-14 is average, 20+ is above average. These norms decrease with age. Any improvement from your baseline is progress." },
      { question: "How is the push-up test performed?", answer: "Start in a standard push-up position (hands shoulder-width, body straight from head to heels). Lower your chest to the floor (or within a fist's width), then push back up fully. Count the maximum number you can complete with proper form, without resting on the ground." },
      { question: "Do push-ups predict heart health?", answer: "A 2019 Harvard study found that men who could do 40+ push-ups had a 96% lower risk of cardiovascular events compared to those who could do fewer than 10. Push-up capacity is a simple, practical indicator of overall fitness and cardiovascular health." },
      { question: "How can I improve my push-up count?", answer: "Practice push-ups 3-4 times per week using a 'grease the groove' approach (multiple sets throughout the day at sub-max reps). Supplement with bench press, dips, and plank holds. Beginners can start with incline push-ups and progress to standard form." },
    ],
    relatedTools: ["one-rep-max-calculator", "workout-split-generator", "plank-timer"],
    relatedArticles: [{ title: "Upper Body Strength Guide", href: "/fitness/upper-body-guide" }],
    affiliateHeading: "Fitness Testing",
    affiliateText: "Push-up handles, resistance bands, exercise mats, and fitness testing kits.",
  },
  {
    slug: "desk-ergonomics-checker",
    name: "Desk Ergonomics Checker - Optimise Your Workspace Setup",
    shortName: "Desk Ergonomics Checker",
    description:
      "Assess your desk setup with a guided checklist covering chair height, monitor position, keyboard placement, and posture. Get personalised improvement tips.",
    longDescription:
      "Poor desk ergonomics contribute to neck pain, back pain, eye strain, carpal tunnel, and headaches. This guided assessment walks you through every aspect of your workspace — from chair height to monitor distance to keyboard angle — and scores your setup. Get specific, actionable recommendations to reduce pain and improve comfort.",
    icon: "desk",
    category: "habits",
    keywords: [
      "desk ergonomics checker", "ergonomic desk setup", "workstation assessment",
      "desk posture checker", "home office ergonomics", "computer ergonomics",
      "desk setup guide", "ergonomic assessment tool",
    ],
    faqs: [
      { question: "What is the ideal monitor height?", answer: "The top of your screen should be at or slightly below eye level, about an arm's length away (50-70 cm). Your eyes should look slightly downward at a 15-20 degree angle when viewing the centre of the screen. This reduces neck strain and eye fatigue." },
      { question: "How high should my desk chair be?", answer: "Your chair height should allow your feet to rest flat on the floor (or on a footrest) with your knees bent at approximately 90 degrees. Your thighs should be parallel to the floor. Armrests should support your forearms at desk height without raising your shoulders." },
      { question: "How often should I take breaks from sitting?", answer: "Follow the 20-20-20 rule for eyes (every 20 minutes, look 20 feet away for 20 seconds). Stand or walk for 2-5 minutes every 30-60 minutes. Research shows that breaking up prolonged sitting reduces back pain, improves circulation, and increases productivity." },
      { question: "Does a standing desk help?", answer: "Alternating between sitting and standing is better than either alone. Stand for 15-30 minutes per hour. Standing all day can cause its own issues (leg fatigue, varicose veins). A sit-stand desk with an anti-fatigue mat provides the best ergonomic flexibility." },
    ],
    relatedTools: ["screen-time-calculator", "stress-reduction-checklist", "stretching-routine-generator"],
    relatedArticles: [{ title: "Home Office Ergonomics Guide", href: "/wellness/desk-ergonomics-guide" }],
    affiliateHeading: "Ergonomic Essentials",
    affiliateText: "Monitor arms, ergonomic keyboards, lumbar supports, standing desk converters, and footrests.",
  },
];

// ─── Lookup Helpers ─────────────────────────────────────────────────

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return TOOLS_REGISTRY.find((t) => t.slug === slug);
}

export function getRelatedTools(slug: string): ToolDefinition[] {
  const tool = getToolBySlug(slug);
  if (!tool) return [];
  return tool.relatedTools
    .map((s) => getToolBySlug(s))
    .filter((t): t is ToolDefinition => !!t);
}

export function getToolCategory(slug: string): ToolCategoryDef | undefined {
  return TOOL_CATEGORIES.find((c) => c.slug === slug);
}

export function getToolsByCategory(categorySlug: string): ToolDefinition[] {
  return TOOLS_REGISTRY.filter((t) => t.category === categorySlug);
}

export function getToolCategoryForTool(tool: ToolDefinition): ToolCategoryDef | undefined {
  return TOOL_CATEGORIES.find((c) => c.slug === tool.category);
}

// ─── JSON-LD Builders ───────────────────────────────────────────────

/** Build SoftwareApplication + FAQPage + BreadcrumbList JSON-LD for a tool page */
export function toolJsonLd(tool: ToolDefinition) {
  const category = getToolCategoryForTool(tool);
  const schemas: object[] = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: tool.name,
      description: tool.description,
      url: `${SITE_URL}/tools/${tool.slug}`,
      applicationCategory: "HealthApplication",
      applicationSubCategory: category?.name,
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      publisher: {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
      },
    },
  ];

  if (tool.faqs.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: tool.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    });
  }

  const breadcrumbItems = [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Tools", item: `${SITE_URL}/tools` },
  ];
  if (category) {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 3,
      name: category.shortName,
      item: `${SITE_URL}/tools/${category.slug}`,
    });
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 4,
      name: tool.shortName,
      item: `${SITE_URL}/tools/${tool.slug}`,
    });
  } else {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 3,
      name: tool.shortName,
      item: `${SITE_URL}/tools/${tool.slug}`,
    });
  }

  schemas.push({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems,
  });

  return schemas;
}

/** Build CollectionPage JSON-LD for a tool category page */
export function toolCategoryJsonLd(category: ToolCategoryDef) {
  const tools = getToolsByCategory(category.slug);
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name,
    description: category.description,
    url: `${SITE_URL}/tools/${category.slug}`,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: tools.length,
      itemListElement: tools.map((t, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: t.shortName,
        url: `${SITE_URL}/tools/${t.slug}`,
      })),
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Tools", item: `${SITE_URL}/tools` },
        { "@type": "ListItem", position: 3, name: category.shortName, item: `${SITE_URL}/tools/${category.slug}` },
      ],
    },
    inLanguage: "en-US",
  };
}
