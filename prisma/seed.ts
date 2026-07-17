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
  { title: "Practice Gratitude", content: "Write down three things you are grateful for each day. This rewires your brain for positivity.", category: "Mental Health" },
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
  { title: "Get Annual Check-ups", content: "Regular health screenings can detect issues early. Do not skip your yearly physical.", category: "Preventive Care" },
  { title: "Wear Sunscreen Daily", content: "UV rays damage skin even on cloudy days. Apply SPF 30 or higher every morning.", category: "Preventive Care" },
  { title: "Stay Up‑to‑Date on Vaccinations", content: "Vaccines protect you and your community from preventable diseases. Check your records.", category: "Preventive Care" },
  { title: "Monitor Your Blood Pressure", content: "High blood pressure is a silent killer. Get it checked regularly, especially if you have risk factors.", category: "Preventive Care" },
  { title: "Practice Good Hand Hygiene", content: "Wash hands frequently with soap and water for at least 20 seconds to prevent infections.", category: "Preventive Care" },
  { title: "Do Not Skip Dental Check-ups", content: "Oral health is linked to heart health. Visit your dentist twice a year.", category: "Preventive Care" },

  // Sleep
  { title: "Avoid Caffeine After 2 PM", content: "Caffeine has a half‑life of 6 hours – it can disrupt your sleep if taken too late.", category: "Sleep" },
  { title: "Wind Down with a Book", content: "Reading a physical book before bed helps your brain shift into sleep mode.", category: "Sleep" },
  { title: "Limit Alcohol Before Bed", content: "Alcohol may help you fall asleep, but it disrupts deep sleep and reduces quality.", category: "Sleep" },

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

const doctorsData = [
  {
    name: "Dr. Grace Adeyemi",
    email: "grace.adeyemi@hospital.com",
    wallet: "0x1234567890abcdef1234567890abcdef12345678",
    role: "DOCTOR",
    specialty: "Cardiology",
    hospital: "Lagos General Hospital",
    location: "Lagos, Nigeria",
    bio: "Experienced cardiologist with 15 years of practice. Specializes in heart disease prevention and treatment.",
    yearsExperience: 15,
    rating: 4.9,
    isActive: true,
  },
  {
    name: "Dr. Samuel Okafor",
    email: "samuel.okafor@hospital.com",
    wallet: "0x2345678901abcdef2345678901abcdef23456789",
    role: "DOCTOR",
    specialty: "Pediatrics",
    hospital: "Abuja Children's Hospital",
    location: "Abuja, Nigeria",
    bio: "Passionate about children's health. Expert in pediatric infectious diseases and vaccination.",
    yearsExperience: 10,
    rating: 4.8,
    isActive: true,
  },
  {
    name: "Dr. Amina Bello",
    email: "amina.bello@hospital.com",
    wallet: "0x3456789012abcdef3456789012abcdef34567890",
    role: "DOCTOR",
    specialty: "Gynecology",
    hospital: "Kano Women's Clinic",
    location: "Kano, Nigeria",
    bio: "Specialist in women's health with 12 years of experience. Offers comprehensive gynecological care.",
    yearsExperience: 12,
    rating: 4.7,
    isActive: true,
  },
  {
    name: "Dr. Femi Adebayo",
    email: "femi.adebayo@hospital.com",
    wallet: "0x4567890123abcdef4567890123abcdef45678901",
    role: "DOCTOR",
    specialty: "Orthopedics",
    hospital: "Ibadan Orthopedic Center",
    location: "Ibadan, Nigeria",
    bio: "Expert in bone and joint health. Specializes in sports injuries and joint replacement.",
    yearsExperience: 8,
    rating: 4.6,
    isActive: true,
  },
  {
    name: "Dr. Ngozi Eze",
    email: "ngozi.eze@hospital.com",
    wallet: "0x5678901234abcdef5678901234abcdef56789012",
    role: "DOCTOR",
    specialty: "Dermatology",
    hospital: "Enugu Skin Clinic",
    location: "Enugu, Nigeria",
    bio: "Dedicated dermatologist with 9 years of experience. Treats skin conditions and cosmetic concerns.",
    yearsExperience: 9,
    rating: 4.5,
    isActive: true,
  },
];

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing data
  console.log("🗑️  Clearing existing data...");
  await prisma.tip.deleteMany({});
  await prisma.user.deleteMany({ where: { role: "DOCTOR" } });

  // Seed tips
  console.log(`📝 Seeding ${tipsData.length} health tips...`);
  await prisma.tip.createMany({ data: tipsData });
  console.log(`✅ Seeded ${tipsData.length} health tips.`);

  // Seed doctors
  console.log(`👨‍⚕️ Seeding ${doctorsData.length} doctors...`);
  for (const doc of doctorsData) {
    await prisma.user.create({ data: doc });
  }
  console.log(`✅ Seeded ${doctorsData.length} doctors.`);

  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
