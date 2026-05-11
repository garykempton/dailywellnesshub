import { SITE_URL, SITE_NAME } from "./constants";
import type { FaqItem } from "./seo";

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
    category: "fitness",
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
    category: "fitness",
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
    category: "fitness",
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
    category: "fitness",
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
];

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

/** Build SoftwareApplication + FAQPage JSON-LD for a tool page */
export function toolJsonLd(tool: ToolDefinition) {
  const schemas: object[] = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: tool.name,
      description: tool.description,
      url: `${SITE_URL}/tools/${tool.slug}`,
      applicationCategory: "HealthApplication",
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

  schemas.push({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Tools", item: `${SITE_URL}/tools` },
      {
        "@type": "ListItem",
        position: 3,
        name: tool.shortName,
        item: `${SITE_URL}/tools/${tool.slug}`,
      },
    ],
  });

  return schemas;
}
