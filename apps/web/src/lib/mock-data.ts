export type FixtureStatus = "SCHEDULED" | "LIVE" | "COMPLETED" | "POSTPONED" | "CANCELLED" | "WALKOVER";
export type CompetitionFormat = "KNOCKOUT" | "LEAGUE" | "GROUP";
export type CompetitionCategory = "OUTDOOR" | "INDOOR";

export interface Team {
  id: string;
  name: string;
  code: string;
}

export interface PenaltyResult {
  type: "PENALTIES";
  score1: number;
  score2: number;
}

export interface WalkoverResult {
  type: "WALKOVER";
  reason?: string;
}

export interface Fixture {
  id: string;
  competition: string;
  round: string;
  team1?: Team;
  team2?: Team;
  score1?: number;
  score2?: number;
  penaltyResult?: PenaltyResult;
  walkoverResult?: WalkoverResult;
  status: FixtureStatus;
  scheduledTime?: Date;
  venue?: string;
  winner?: string;
}

export interface Competition {
  id: string;
  eventEditionId: string;
  name: string;
  format: CompetitionFormat;
  category: CompetitionCategory;
  status: "UPCOMING" | "LIVE" | "COMPLETED";
  entrants: Team[];
  fixtures: Fixture[];
  winner?: string;
}

export interface EventEdition {
  id: string;
  name: string;
  eventId: string;
  startDate: Date;
  endDate: Date;
  status: "UPCOMING" | "ACTIVE" | "COMPLETED";
  competitions: Competition[];
}

export const TEAMS: Record<string, Team> = {
  COMP: { id: "comp", name: "Computer", code: "COMP" },
  IT: { id: "it", name: "IT", code: "IT" },
  EXTC: { id: "extc", name: "EXTC", code: "EXTC" },
  ECS: { id: "ecs", name: "ECS", code: "ECS" },
  MECH: { id: "mech", name: "Mechanical", code: "MECH" },
  CIVIL: { id: "civil", name: "Civil", code: "CIVIL" },
  AIML: { id: "aiml", name: "AI & ML", code: "AIML" },
  "AI&DS": { id: "ai-ds", name: "AI & DS", code: "AI&DS" },
  IOT: { id: "iot", name: "IoT", code: "IOT" },
  "CSE-CS": { id: "cse-cs", name: "CSE-CS", code: "CSE-CS" },
  MME: { id: "mme", name: "MME", code: "MME" },
  BVOC: { id: "bvoc", name: "BVOC", code: "BVOC" },
  BCA: { id: "bca", name: "BCA", code: "BCA" },
  BBA: { id: "bba", name: "BBA", code: "BBA" },
  MBA: { id: "mba", name: "MBA", code: "MBA" },
};

export const mockEventEdition: EventEdition = {
  id: "tspark-2027",
  name: "TSpark 2027",
  eventId: "tspark",
  startDate: new Date(2027, 0, 2),
  endDate: new Date(2027, 0, 4),
  status: "ACTIVE",
  competitions: [
    {
      id: "mens-football-2027",
      eventEditionId: "tspark-2027",
      name: "Men's Football",
      format: "KNOCKOUT",
      category: "OUTDOOR",
      status: "LIVE",
      entrants: [
        TEAMS.COMP,
        TEAMS.IT,
        TEAMS.MECH,
        TEAMS.AIML,
        TEAMS.ECS,
        TEAMS.EXTC,
        TEAMS.CIVIL,
        TEAMS.BCA,
      ],
      fixtures: [
        {
          id: "qf1-2027",
          competition: "mens-football-2027",
          round: "Quarter Final",
          team1: TEAMS.COMP,
          team2: TEAMS.IT,
          score1: 2,
          score2: 1,
          status: "COMPLETED",
          scheduledTime: new Date(2027, 0, 2, 9, 0),
          venue: "Football Ground",
          winner: "comp",
        },
        {
          id: "qf2-2027",
          competition: "mens-football-2027",
          round: "Quarter Final",
          team1: TEAMS.MECH,
          team2: TEAMS.AIML,
          score1: 1,
          score2: 1,
          penaltyResult: { type: "PENALTIES", score1: 4, score2: 3 },
          status: "COMPLETED",
          scheduledTime: new Date(2027, 0, 2, 10, 30),
          venue: "Football Ground",
          winner: "mech",
        },
        {
          id: "qf3-2027",
          competition: "mens-football-2027",
          round: "Quarter Final",
          team1: TEAMS.ECS,
          team2: TEAMS.CIVIL,
          walkoverResult: { type: "WALKOVER", reason: "CIVIL did not field a team" },
          status: "WALKOVER",
          scheduledTime: new Date(2027, 0, 2, 12, 0),
          venue: "Football Ground",
          winner: "ecs",
        },
        {
          id: "qf4-2027",
          competition: "mens-football-2027",
          round: "Quarter Final",
          team1: TEAMS.EXTC,
          team2: TEAMS.BCA,
          status: "COMPLETED",
          score1: 3,
          score2: 0,
          scheduledTime: new Date(2027, 0, 2, 13, 30),
          venue: "Football Ground",
          winner: "extc",
        },
        {
          id: "sf1-2027",
          competition: "mens-football-2027",
          round: "Semi Final",
          team1: TEAMS.COMP,
          team2: TEAMS.MECH,
          score1: 2,
          score2: 0,
          status: "LIVE",
          scheduledTime: new Date(2027, 0, 3, 10, 0),
          venue: "Football Ground",
          winner: "comp",
        },
        {
          id: "sf2-2027",
          competition: "mens-football-2027",
          round: "Semi Final",
          team1: TEAMS.CIVIL,
          team2: TEAMS.EXTC,
          status: "SCHEDULED",
          scheduledTime: new Date(2027, 0, 3, 12, 0),
          venue: "Football Ground",
        },
        {
          id: "final-2027",
          competition: "mens-football-2027",
          round: "Final",
          status: "SCHEDULED",
          scheduledTime: new Date(2027, 0, 4, 15, 0),
          venue: "Football Ground",
        },
      ],
      winner: undefined,
    },
    {
      id: "womens-volleyball-2027",
      eventEditionId: "tspark-2027",
      name: "Women's Volleyball",
      format: "LEAGUE",
      category: "OUTDOOR",
      status: "LIVE",
      entrants: [TEAMS.IT, TEAMS.AIML, TEAMS.EXTC, TEAMS.ECS, TEAMS.COMP],
      fixtures: [
        {
          id: "vb1-2027",
          competition: "womens-volleyball-2027",
          round: "League",
          team1: TEAMS.AIML,
          team2: TEAMS.EXTC,
          score1: 1,
          score2: 1,
          status: "LIVE",
          scheduledTime: new Date(2027, 0, 3, 11, 0),
          venue: "Volleyball Court",
        },
        {
          id: "vb2-2027",
          competition: "womens-volleyball-2027",
          round: "League",
          team1: TEAMS.IT,
          team2: TEAMS.COMP,
          score1: 2,
          score2: 0,
          status: "COMPLETED",
          scheduledTime: new Date(2027, 0, 3, 9, 0),
          venue: "Volleyball Court",
          winner: "it",
        },
      ],
      winner: undefined,
    },
    {
      id: "chess-2027",
      eventEditionId: "tspark-2027",
      name: "Chess",
      format: "KNOCKOUT",
      category: "INDOOR",
      status: "UPCOMING",
      entrants: [TEAMS.COMP, TEAMS.IT, TEAMS.AIML, TEAMS.MECH],
      fixtures: [
        {
          id: "chess-qf1-2027",
          competition: "chess-2027",
          round: "Quarter Final",
          team1: TEAMS.COMP,
          team2: TEAMS.MECH,
          status: "SCHEDULED",
          scheduledTime: new Date(2027, 0, 3, 14, 0),
          venue: "Main Hall",
        },
        {
          id: "chess-qf2-2027",
          competition: "chess-2027",
          round: "Quarter Final",
          team1: TEAMS.IT,
          team2: TEAMS.AIML,
          status: "SCHEDULED",
          scheduledTime: new Date(2027, 0, 3, 14, 0),
          venue: "Main Hall",
        },
      ],
      winner: undefined,
    },
  ],
};

export function getLiveFixtures(edition: EventEdition): Fixture[] {
  return edition.competitions
    .flatMap((comp) => comp.fixtures)
    .filter((fixture) => fixture.status === "LIVE")
    .sort(
      (a, b) =>
        (b.scheduledTime?.getTime() || 0) - (a.scheduledTime?.getTime() || 0)
    );
}

export function getTodayFixtures(edition: EventEdition): Fixture[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return edition.competitions
    .flatMap((comp) => comp.fixtures)
    .filter((fixture) => {
      const fixtureDate = fixture.scheduledTime || new Date();
      return (
        fixtureDate >= today &&
        fixtureDate < tomorrow &&
        (fixture.status === "SCHEDULED" || fixture.status === "LIVE")
      );
    })
    .sort((a, b) => {
      const timeA = a.scheduledTime?.getTime() || 0;
      const timeB = b.scheduledTime?.getTime() || 0;
      return timeA - timeB;
    });
}

export function getRecentResults(edition: EventEdition, limit: number = 5): Fixture[] {
  return edition.competitions
    .flatMap((comp) => comp.fixtures)
    .filter((fixture) => fixture.status === "COMPLETED" || fixture.status === "WALKOVER")
    .sort(
      (a, b) =>
        (b.scheduledTime?.getTime() || 0) - (a.scheduledTime?.getTime() || 0)
    )
    .slice(0, limit);
}

export function getUpcomingFixtures(
  edition: EventEdition,
  limit: number = 3
): Fixture[] {
  const now = new Date();
  return edition.competitions
    .flatMap((comp) => comp.fixtures)
    .filter(
      (fixture) =>
        fixture.status === "SCHEDULED" &&
        fixture.scheduledTime &&
        fixture.scheduledTime > now
    )
    .sort((a, b) => {
      const timeA = a.scheduledTime?.getTime() || 0;
      const timeB = b.scheduledTime?.getTime() || 0;
      return timeA - timeB;
    })
    .slice(0, limit);
}
