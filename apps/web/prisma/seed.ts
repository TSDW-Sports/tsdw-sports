import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined.");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("Seeding TSDW Sports database...");

  // --------------------------------------------------
  // Departments
  // --------------------------------------------------

  const departments = [
    { code: "COMP", name: "Computer" },
    { code: "IT", name: "IT" },
    { code: "EXTC", name: "EXTC" },
    { code: "ECS", name: "ECS" },
    { code: "MECH", name: "Mechanical" },
    { code: "CIVIL", name: "Civil" },
    { code: "AIML", name: "AI & ML" },
    { code: "AI&DS", name: "AI & DS" },
    { code: "IOT", name: "IoT" },
    { code: "CSE-CS", name: "CSE-CS" },
    { code: "MME", name: "MME" },
    { code: "BVOC", name: "BVOC" },
    { code: "BCA", name: "BCA" },
    { code: "BBA", name: "BBA" },
    { code: "MBA", name: "MBA" },
  ];

  for (const department of departments) {
    await prisma.department.upsert({
      where: {
        code: department.code,
      },
      update: {
        name: department.name,
      },
      create: department,
    });
  }

  console.log(`Seeded ${departments.length} departments.`);

  // --------------------------------------------------
  // REFLEX Event
  // --------------------------------------------------

  const reflexEvent = await prisma.event.upsert({
    where: {
      slug: "reflex",
    },
    update: {
      name: "REFLEX",
    },
    create: {
      name: "REFLEX",
      slug: "reflex",
    },
  });

  // --------------------------------------------------
  // REFLEX 2026 Edition
  // --------------------------------------------------

  const reflexEdition = await prisma.eventEdition.upsert({
    where: {
      eventId_year: {
        eventId: reflexEvent.id,
        year: 2026,
      },
    },
    update: {
      name: "REFLEX 2026",
      status: "UPCOMING",

      // Keep these null until confirmed.
      startDate: null,
      endDate: null,
      venue: null,
    },
    create: {
      name: "REFLEX 2026",
      year: 2026,
      status: "UPCOMING",

      startDate: null,
      endDate: null,
      venue: null,

      eventId: reflexEvent.id,
    },
  });

  console.log("Seeded REFLEX 2026.");

  // --------------------------------------------------
  // REFLEX Competitions
  // --------------------------------------------------

  const competitions = [
    {
      name: "Valorant",
      slug: "valorant",
      format: "KNOCKOUT" as const,
      entryType: "TEAM" as const,
    },
    {
      name: "Rocket League",
      slug: "rocket-league",
      format: "TBD" as const,
      entryType: "TEAM" as const,
    },
    {
      name: "FIFA",
      slug: "fifa",
      format: "KNOCKOUT" as const,
      entryType: "INDIVIDUAL" as const,
    },
    {
      name: "Cricket Auction",
      slug: "cricket-auction",
      format: "TBD" as const,
      entryType: "TEAM" as const,
    },
    {
      name: "BGMI",
      slug: "bgmi",
      format: "TBD" as const,
      entryType: "TEAM" as const,
    },
    {
      name: "CODM",
      slug: "codm",
      format: "TBD" as const,
      entryType: "TEAM" as const,
    },
    {
      name: "Stumble Guys",
      slug: "stumble-guys",
      format: "TBD" as const,
      entryType: "INDIVIDUAL" as const,
    },
    {
      name: "Clash Royale",
      slug: "clash-royale",
      format: "KNOCKOUT" as const,
      entryType: "INDIVIDUAL" as const,
    },
    {
      name: "Chess.com",
      slug: "chess-com",
      format: "TBD" as const,
      entryType: "INDIVIDUAL" as const,
    },
    {
      name: "E-Football (PES)",
      slug: "e-football-pes",
      format: "TBD" as const,
      entryType: "INDIVIDUAL" as const,
    },
    {
      name: "Mortal Kombat",
      slug: "mortal-kombat",
      format: "TBD" as const,
      entryType: "INDIVIDUAL" as const,
    },
    {
      name: "Tekken",
      slug: "tekken",
      format: "TBD" as const,
      entryType: "INDIVIDUAL" as const,
    },
    {
      name: "F1",
      slug: "f1",
      format: "TBD" as const,
      entryType: "INDIVIDUAL" as const,
    },
  ];

  for (const competition of competitions) {
    await prisma.competition.upsert({
      where: {
        eventEditionId_slug: {
          eventEditionId: reflexEdition.id,
          slug: competition.slug,
        },
      },

      update: {
        name: competition.name,
        format: competition.format,
        entryType: competition.entryType,
        status: "UPCOMING",
        entryFee: 0,
      },

      create: {
        name: competition.name,
        slug: competition.slug,

        format: competition.format,
        entryType: competition.entryType,
        status: "UPCOMING",

        // Free registration.
        entryFee: 0,

        // To be decided later.
        minPlayers: null,
        maxPlayers: null,
        platform: null,
        venue: null,
        rules: null,

        eventEditionId: reflexEdition.id,
      },
    });
  }

  console.log(`Seeded ${competitions.length} REFLEX competitions.`);

  console.log("--------------------------------");
  console.log("Database seed completed.");
  console.log("--------------------------------");
}

main()
  .catch((error) => {
    console.error("Seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
