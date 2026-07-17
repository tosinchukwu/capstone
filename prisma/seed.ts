import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const tipsData = [
  // Daily Routine
  { title: "Drink 8 Glasses of Water Daily", content: "Staying hydrated boosts energy, supports digestion, and improves skin health. Carry a reusable bottle to track your intake.", category: "Daily Routine" },
  { title: "Get 7-8 Hours of Quality Sleep", content: "Sleep is essential for memory consolidation, immune function, and emotional well-being. Maintain a consistent sleep schedule.", category: "Daily Routine" },
  { title: "Start Your Day with Stretching", content: "A 5‑minute morning stretch improves flexibility, reduces muscle tension, and wakes up your body.", category: "Daily Routine" },
  { title: "Practice Deep Breathing", content: "Take 5 deep breaths (in for 4, hold for 4, out for 4) to calm your nervous system and reduce stress.", category: "Daily Routine" },
  { title: "Limit Screen Time Before Bed", content: "Avoid screens 30 minutes before sleep. The blue light disrupts melatonin production and harms sleep quality.", category: "Daily Routine" },
  { title: "Keep a Consistent Sleep Schedule", content: "Go to bed and wake up at the same time every day, even on weekends.", category: "Daily Routine" },
  { title: "Create a Restful Environment", content: "Keep your bedroom cool, dark, and quiet. Use blackout curtains and white noise if needed.", category: "Daily Routine" },

  // Nutrition
  { title: "Eat a Rainbow of Vegetables", content: "Different colours provide different nutrients. Aim for at least 5 portions of fruits and vegetables daily.", category: "Nutrition" },
  { title: "Include Healthy Fats", content: "Avocados, nuts, and olive oil support brain health and reduce inflammation. Add a handful of nuts to your snacks.", category: "Nutrition" },
  { title: "Stay Away from Added Sugars", content: "Excess sugar leads to energy crashes and weight gain. Check food labels for hidden sugars.", category: "Nutrition" },
  { title: "Eat Fermented Foods", content: "Yogurt, kefir, and sauerkraut boost gut health with probiotics.", category: "Nutrition" },
  { title: "Plan Your Meals", content: "Meal prepping helps you make healthier choices and saves time during busy weekdays.", category: "Nutrition" },
  { title: "Add Flavour to Your Water", content: "Add lemon, cucumber, or mint to make water more appealing and increase intake.", category: "Nutrition" },

  // Mental Health
  { title: "Practice Gratitude", content: "Write down three things you're grateful for each day. This rewires your brain for positivity.", category: "Mental Health" },
  { title: "Take a Digital Detox", content: "Spend one hour without your phone each day. Use that time to read, walk, or meditate.", category: "Mental Health" },
  { title: "Connect with Loved Ones", content: "Social connections are vital for mental health. Call a friend or family member today.", category: "Mental Health" },
  { title: "Set Boundaries", content: "Learn to say no to things that drain your energy. Protect your time and mental space.", category: "Mental Health" },
  { title: "Practice Mindfulness", content: "Try a guided meditation app for 5 minutes daily to reduce anxiety and improve focus.", category: "Mental Health" },
  { title: "Practice Positive Affirmations", content: "Start your day by saying: 'I am healthy, strong, and capable.'", category: "Mental Health" },

  // Fitness
  { title: "Walk 10,000 Steps Daily", content: "Walking improves cardiovascular health and burns calories. Use a pedometer to track your steps.", category: "Fitness" },
  { title: "Incorporate Strength Training", content: "Lifting weights or bodyweight exercises 2‑3 times a week builds muscle and bone density.", category: "Fitness" },
  { title: "Try Yoga for Flexibility", content: "Yoga combines stretching with breath control, reducing stress and improving balance.", category: "Fitness" },
  { title: "Take the Stairs", content: "Skip the elevator – climbing stairs is an easy way to increase your daily activity.", category: "Fitness" },
  { title: "Schedule Active Breaks", content: "Every 45 minutes, stand up, stretch, or do a quick exercise to reset your body.", category: "Fitness" },
  { title: "Join a Community Group", content: "Being part of a group (book club, fitness class) improves mental and social well-being.", category: "Fitness" },

  // Preventive Care
  { title: "Get Annual Check-ups", content: "Regular health screenings can detect issues early. Don't skip your yearly physical.", category: "Preventive Care" },
  { title: "Wear Sunscreen Daily", content: "UV rays damage skin even on cloudy days. Apply SPF 30 or higher every morning.", category: "Preventive Care" },
  { title: "Stay Up‑to‑Date on Vaccinations", content: "Vaccines protect you and your community from preventable diseases. Check your records.", category: "Preventive Care" },
  { title: "Monitor Your Blood Pressure", content: "High blood pressure is a silent killer. Get it checked regularly, especially if you have risk factors.", category: "Preventive Care" },
  { title: "Practice Good Hand Hygiene", content: "Wash hands frequently with soap and water for at least 20 seconds to prevent infections.", category: "Preventive Care" },
  { title: "Don't Skip Dental Check-ups", content: "Oral health is linked to heart health. Visit your dentist twice a year.", category: "Preventive Care" },

  // Sleep
  { title: "Avoid Caffeine After 2 PM", content: "Caffeine has a half‑life of 6 hours – it can disrupt your sleep if taken too late.", category: "Sleep" },
  { title: "Wind Down with a Book", content: "Reading a physical book before bed helps your brain shift into sleep mode.", category: "Sleep" },
  { title: "Limit Alcohol Before Bed", content: "Alcohol may help you fall asleep, but it disrupts deep sleep and reduces quality.", category: "Sleep" },
  { title: "Keep a Consistent Sleep Schedule", content: "Go to bed and wake up at the same time every day, even on weekends.", category: "Sleep" },
  { title: "Create a Restful Environment", content: "Keep your bedroom cool, dark, and quiet. Use blackout curtains and white noise if needed.", category: "Sleep" },

  // Hydration
  { title: "Drink a Glass of Water Upon Waking", content: "After 8 hours of sleep, your body is dehydrated. Drink water first thing.", category: "Hydration" },
  { title: "Set Hydration Reminders", content: "Use a water tracking app or set alarms to remind you to drink every hour.", category: "Hydration" },
  { title: "Replace Sugary Drinks with Water", content: "Swap soda and juice for water or herbal tea to cut calories and stay hydrated.", category: "Hydration" },
  { title: "Eat Water-Rich Foods", content: "Cucumbers, watermelon, and oranges are high in water content and contribute to hydration.", category: "Hydration" },

  // General Wellness
  { title: "Laugh More", content: "Laughter boosts immunity, reduces stress hormones, and releases endorphins.", category: "General Wellness" },
  { title: "Practice Self-Care", content: "Set aside time for hobbies, relaxation, or pampering – you deserve it.", category: "General Wellness" },
  { title: "Learn Something New", content: "Challenge your brain by learning a new skill or language. It keeps your mind sharp.", category: "General Wellness" },
  { title: "Take a Nature Walk", content: "Spending time in nature reduces stress and improves mood. Try a walk in a park or forest.", category: "General Wellness" },
  { title: "Clean Your Living Space", content: "A tidy environment reduces anxiety and increases productivity. Declutter today.", category: "General Wellness" },
  { title: "Listen to Your Body", content: "Pay attention to hunger, fatigue, and pain signals. Rest when you need to.", category: "General Wellness" },
];

async function main() {
  await prisma.tip.deleteMany({});
  await prisma.tip.createMany({ data: tipsData });
  console.log(`✅ Seeded ${tipsData.length} health tips.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
