import { PrismaClient } from "@prisma/client/index";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Admin user
  const adminPass = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@traveloop.com" },
    update: {},
    create: {
      email: "admin@traveloop.com",
      name: "Traveloop Admin",
      password: adminPass,
      role: "ADMIN",
    },
  });

  // Demo user
  const demoPass = await bcrypt.hash("demo123", 12);
  const user = await prisma.user.upsert({
    where: { email: "demo@traveloop.com" },
    update: {},
    create: {
      email: "demo@traveloop.com",
      name: "Demo Traveler",
      password: demoPass,
      role: "USER",
    },
  });

  // Cities
  const cities = [
    { name: "Paris", country: "France", region: "Europe", description: "The City of Light." },
    { name: "Tokyo", country: "Japan", region: "Asia", description: "A neon-lit metropolis." },
    { name: "Rome", country: "Italy", region: "Europe", description: "The Eternal City." },
    { name: "New York", country: "USA", region: "North America", description: "The Big Apple." },
    { name: "London", country: "UK", region: "Europe", description: "Historic capital on the Thames." },
    { name: "Barcelona", country: "Spain", region: "Europe", description: "Art and architecture." },
    { name: "Dubai", country: "UAE", region: "Middle East", description: "Luxury and modernism." },
    { name: "Singapore", country: "Singapore", region: "Asia", description: "Garden city-state." },
    { name: "Sydney", country: "Australia", region: "Oceania", description: "Harbor city down under." },
    { name: "Cairo", country: "Egypt", region: "Africa", description: "Gateway to the Pyramids." },
  ];

  for (const c of cities) {
    await prisma.city.upsert({
      where: { name: c.name } as any,
      update: {},
      create: c,
    });
  }

  // Activities
  const createdCities = await prisma.city.findMany();
  for (const city of createdCities) {
    const activities = [
      { name: "Museum Tour", description: "Discover local art and history.", cost: 25.0, type: "CULTURE" },
      { name: "City Walking Tour", description: "Explore the streets with a guide.", cost: 15.0, type: "OUTDOOR" },
      { name: "Local Food Tasting", description: "Sample authentic regional dishes.", cost: 45.0, type: "FOOD" },
      { name: "Skyline View", description: "Stunning panoramic vistas.", cost: 30.0, type: "SIGHTSEEING" },
    ];

    for (const act of activities) {
      await prisma.activity.create({
        data: {
          ...act,
          cityId: city.id,
        },
      });
    }
  }

  // Sample Trip
  const rome = await prisma.city.findFirst({ where: { name: "Rome" } });
  const paris = await prisma.city.findFirst({ where: { name: "Paris" } });

  if (rome && paris) {
    const trip = await prisma.trip.create({
      data: {
        userId: user.id,
        name: "Mediterranean Dream",
        description: "A summer journey through Europe.",
        startDate: new Date("2026-07-01"),
        endDate: new Date("2026-07-15"),
        isPublic: true,
        shareToken: "demo-trip-2026",
        stops: {
          create: [
            {
              cityId: rome.id,
              order: 1,
              startDate: new Date("2026-07-01"),
              endDate: new Date("2026-07-05"),
            },
            {
              cityId: paris.id,
              order: 2,
              startDate: new Date("2026-07-06"),
              endDate: new Date("2026-07-10"),
            },
          ],
        },
        packingItems: {
          create: [
            { name: "Sunscreen", category: "Toiletries" },
            { name: "Camera", category: "Electronics" },
            { name: "Walking Shoes", category: "Clothing" },
          ],
        },
        expenses: {
          create: [
            { amount: 1200, category: "Flights", description: "International flight" },
            { amount: 500, category: "Food", description: "Dining budget" },
          ],
        },
      },
    });
    console.log(`✅ Created demo trip: ${trip.name}`);
  }

  console.log("✨ Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
