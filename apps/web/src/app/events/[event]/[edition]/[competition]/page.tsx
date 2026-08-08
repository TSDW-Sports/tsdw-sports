import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteHeader } from "@/components/SiteHeader";
import { SectionHeader } from "@/components/SectionHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { FixtureCard } from "@/components/FixtureCard";
import { BracketView } from "@/components/BracketView";

import { prisma } from "@/lib/prisma";

import {
  getEventEdition,
  getRecentResults,
  type EventEdition,
  type Competition,
} from "@/lib/mock-data";

interface PageProps {
  params: Promise<{
    event: string;
    edition: string;
    competition: string;
  }>;
}

function createCompetitionSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[&']/g, "");
}

async function loadCompetitionPage(
  eventSlug: string,
  editionSlug: string,
  competitionSlug: string,
): Promise<
  | {
      eventEdition: EventEdition;
      competition: Competition;
      settings?: {
        slug: string;
        entryType: "INDIVIDUAL" | "TEAM";
        minPlayers: number | null;
        maxPlayers: number | null;
        entryFee: number | null;
        platform: string | null;
        venue: string | null;
        rules: string | null;
      };
    }
  | undefined
> {
  /*
   * Keep existing mock-backed events such as TSpark working.
   */
  if (eventSlug.toLowerCase() !== "reflex") {
    const eventEdition = getEventEdition(eventSlug, editionSlug);

    if (!eventEdition) {
      return undefined;
    }

    const competition = eventEdition.competitions.find(
      (item) =>
        createCompetitionSlug(item.name) === competitionSlug.toLowerCase(),
    );

    if (!competition) {
      return undefined;
    }

    return {
      eventEdition,
      competition,
    };
  }

  /*
   * REFLEX is database-backed.
   */
  const year = Number(editionSlug);

  if (!Number.isInteger(year)) {
    return undefined;
  }

  const dbEdition = await prisma.eventEdition.findFirst({
    where: {
      year,
      event: {
        slug: eventSlug.toLowerCase(),
      },
    },
    include: {
      event: true,
    },
  });

  if (!dbEdition) {
    return undefined;
  }

  const dbCompetition = await prisma.competition.findFirst({
    where: {
      eventEditionId: dbEdition.id,
      slug: competitionSlug.toLowerCase(),
    },
    include: {
      entries: {
        where: {
          status: "APPROVED",
        },
        include: {
          department: true,
        },
        orderBy: {
          name: "asc",
        },
      },
      fixtures: {
        include: {
          sides: {
            include: {
              entry: {
                include: {
                  department: true,
                },
              },
            },
            orderBy: {
              position: "asc",
            },
          },
        },
        orderBy: {
          scheduledAt: "asc",
        },
      },
    },
  });

  if (!dbCompetition) {
    return undefined;
  }

  const entrants = dbCompetition.entries.map((entry) => ({
    id: entry.id,
    name: entry.name,
    code: entry.department?.code || entry.name,
  }));

  const fixtures = dbCompetition.fixtures.map((fixture) => {
    const side1 = fixture.sides.find((side) => side.position === 1);
    const side2 = fixture.sides.find((side) => side.position === 2);

    const team1 = side1?.entry
      ? {
          id: side1.entry.id,
          name: side1.entry.name,
          code: side1.entry.department?.code || side1.entry.name,
        }
      : undefined;

    const team2 = side2?.entry
      ? {
          id: side2.entry.id,
          name: side2.entry.name,
          code: side2.entry.department?.code || side2.entry.name,
        }
      : undefined;

    return {
      id: fixture.id,
      competition: dbCompetition.id,
      round: fixture.round || "TBD",
      team1,
      team2,
      score1: side1?.score ?? undefined,
      score2: side2?.score ?? undefined,
      status:
        fixture.status === "CANCELLED"
          ? ("POSTPONED" as const)
          : fixture.status,
      scheduledTime: fixture.scheduledAt ?? undefined,
      venue: fixture.venue ?? undefined,
      winner: fixture.winnerEntryId ?? undefined,
    };
  });

  const competition: Competition = {
    id: dbCompetition.id,
    eventEditionId: dbEdition.id,
    name: dbCompetition.name,
    format: dbCompetition.format,
    category:
      dbCompetition.name === "Cricket Auction" ? "FUN_GAMES" : "ESPORTS",
    status:
      dbCompetition.status === "CANCELLED" ? "UPCOMING" : dbCompetition.status,
    entrants,
    fixtures,
    winner: dbCompetition.winnerEntryId ?? undefined,
  };

  const eventEdition: EventEdition = {
    id: dbEdition.id,
    name: dbEdition.name,
    eventId: dbEdition.event.slug,
    startDate: dbEdition.startDate ?? undefined,
    endDate: dbEdition.endDate ?? undefined,
    status: dbEdition.status === "CANCELLED" ? "UPCOMING" : dbEdition.status,
    competitions: [competition],
  };

  return {
    eventEdition,
    competition,
    settings: {
      slug: dbCompetition.slug,
      entryType: dbCompetition.entryType,
      minPlayers: dbCompetition.minPlayers,
      maxPlayers: dbCompetition.maxPlayers,
      entryFee: dbCompetition.entryFee,
      platform: dbCompetition.platform,
      venue: dbCompetition.venue,
      rules: dbCompetition.rules,
    },
  };
}

export async function generateMetadata({ params }: PageProps) {
  const { event, edition, competition: competitionParam } = await params;

  const data = await loadCompetitionPage(event, edition, competitionParam);

  if (!data) {
    return {
      title: "Competition | TSDW Sports",
    };
  }

  return {
    title: `${data.competition.name} | ${data.eventEdition.name} | TSDW Sports`,
    description: `Follow ${data.competition.name} fixtures, results, and competition updates at ${data.eventEdition.name}.`,
  };
}

export default async function CompetitionPage({ params }: PageProps) {
  const { event, edition, competition: competitionParam } = await params;

  const data = await loadCompetitionPage(event, edition, competitionParam);

  if (!data) {
    notFound();
  }

  const { eventEdition, competition, settings } = data;

  const completedFixtures = competition.fixtures.filter(
    (fixture) =>
      fixture.status === "COMPLETED" || fixture.status === "WALKOVER",
  );

  const competitionResults = getRecentResults(eventEdition, 100).filter(
    (fixture) => fixture.competition === competition.id,
  );

  const hasBracket =
    competition.format === "KNOCKOUT" ||
    competition.format === "GROUP_KNOCKOUT";

  return (
    <div className="min-h-screen flex flex-col bg-[var(--canvas)]">
      <SiteHeader activeNavigation="competition" />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-[var(--text-secondary)]">
          <Link href="/" className="hover:text-[var(--text-primary)]">
            Home
          </Link>

          {" / "}

          <Link
            href={`/events/${event}/${edition}`}
            className="hover:text-[var(--text-primary)]"
          >
            {eventEdition.name}
          </Link>

          {" / "}

          <span className="text-[var(--text-primary)]">{competition.name}</span>
        </div>

        {/* Competition Header */}
        <div className="border-b border-[var(--border)] pb-6 mb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="text-sm font-semibold text-[var(--text-secondary)] uppercase mb-2">
                {eventEdition.name}
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold text-[var(--text-primary)] mb-3">
                {competition.name}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--text-secondary)]">
                <span className="capitalize">
                  {competition.category.toLowerCase().replace(/_/g, " ")}
                </span>

                <span>•</span>

                <span className="capitalize">
                  {competition.format.toLowerCase().replace(/_/g, " ")}
                </span>
              </div>
            </div>

            <StatusBadge status={competition.status} />
          </div>

          {competition.winner && (
            <div className="mt-6 bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4">
              <div className="text-xs font-semibold text-[var(--success)] uppercase tracking-widest mb-2">
                Winner
              </div>

              <div className="text-2xl font-bold text-[var(--text-primary)]">
                {competition.entrants.find(
                  (entrant) => entrant.id === competition.winner,
                )?.code || competition.winner}
              </div>
            </div>
          )}
        </div>

        {settings && (
          <section className="mb-12">
            <SectionHeader
              title="Competition Details"
              subtitle="Registration and tournament information"
            />

            <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)]">
              <div className="grid grid-cols-2 gap-px bg-[var(--border)] sm:grid-cols-3 lg:grid-cols-6">
                <CompetitionDetail
                  label="Entry Type"
                  value={settings.entryType === "TEAM" ? "Team" : "Individual"}
                />

                <CompetitionDetail
                  label="Players"
                  value={formatPlayerRange(
                    settings.minPlayers,
                    settings.maxPlayers,
                    settings.entryType,
                  )}
                />

                <CompetitionDetail
                  label="Entry Fee"
                  value={
                    settings.entryFee === null
                      ? "TBD"
                      : settings.entryFee === 0
                        ? "Free"
                        : `₹${settings.entryFee}`
                  }
                />

                <CompetitionDetail
                  label="Platform"
                  value={settings.platform ?? "TBD"}
                />

                <CompetitionDetail
                  label="Venue"
                  value={settings.venue ?? "TBD"}
                />

                <CompetitionDetail
                  label="Format"
                  value={formatDisplayValue(competition.format)}
                />
              </div>

              <div className="border-t border-[var(--border)] p-5 sm:p-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                  Rules
                </p>

                {settings.rules ? (
                  <p className="whitespace-pre-wrap text-sm leading-6 text-[var(--text-secondary)]">
                    {settings.rules}
                  </p>
                ) : (
                  <p className="text-sm text-[var(--text-secondary)]">
                    Competition rules will be published soon.
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-3 border-t border-[var(--border)] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">
                    Ready to compete?
                  </p>

                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    Submit your registration for {competition.name}.
                  </p>
                </div>

                <Link
                  href={`/events/${event}/${edition}/${settings.slug}/register`}
                  className="inline-flex items-center justify-center rounded-lg bg-[var(--text-primary)] px-5 py-2.5 text-sm font-semibold text-[var(--canvas)] transition-opacity hover:opacity-90"
                >
                  Register
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Empty state */}
        {competition.fixtures.length === 0 &&
          competition.entrants.length === 0 && (
            <section className="mb-12">
              <div className="border border-[var(--border)] rounded-lg p-6 sm:p-8 bg-[var(--surface)]">
                <p className="text-sm font-semibold text-[var(--text-primary)] mb-2">
                  Competition details coming soon
                </p>

                <p className="text-sm text-[var(--text-secondary)]">
                  Fixtures, participants, schedule, and tournament details will
                  be published once they are finalized.
                </p>
              </div>
            </section>
          )}

        {/* Bracket */}
        {hasBracket && competition.fixtures.length > 0 && (
          <section className="mb-12">
            <SectionHeader title="Bracket" />

            <div className="border border-[var(--border)] rounded-lg p-6 bg-[var(--surface)]">
              <BracketView competition={competition} />
            </div>
          </section>
        )}

        {/* Fixtures */}
        {competition.fixtures.length > 0 && (
          <section className="mb-12">
            <SectionHeader
              title="Fixtures"
              subtitle={`${competition.fixtures.length} match${
                competition.fixtures.length === 1 ? "" : "es"
              }`}
            />

            <div className="grid sm:grid-cols-2 gap-4">
              {competition.fixtures.map((fixture) => (
                <FixtureCard key={fixture.id} fixture={fixture} compact />
              ))}
            </div>
          </section>
        )}

        {/* Entrants */}
        {competition.entrants.length > 0 && (
          <section className="mb-12">
            <SectionHeader
              title="Participants"
              subtitle={`${competition.entrants.length} registered`}
            />

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {competition.entrants.map((entrant) => (
                <div
                  key={entrant.id}
                  className="border border-[var(--border)] rounded-lg p-4 bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-colors"
                >
                  <div className="font-semibold text-[var(--text-primary)]">
                    {entrant.code}
                  </div>

                  <div className="text-sm text-[var(--text-secondary)]">
                    {entrant.name}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Results */}
        {completedFixtures.length > 0 && (
          <section className="mb-12">
            <SectionHeader
              title="Results"
              subtitle={`${completedFixtures.length} completed match${
                completedFixtures.length === 1 ? "" : "es"
              }`}
            />

            <div className="grid sm:grid-cols-2 gap-4">
              {competitionResults.map((fixture) => (
                <FixtureCard key={fixture.id} fixture={fixture} compact />
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-[var(--border)] bg-[var(--surface)] mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="text-sm text-[var(--text-secondary)]">
            <p className="mb-2">TSDW Sports Platform • {eventEdition.name}</p>

            <p className="text-xs text-[var(--text-muted)]">
              TSDW Sports Committee, TCET
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function CompetitionDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[var(--surface)] p-4 sm:p-5">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
        {label}
      </p>

      <p className="text-sm font-semibold text-[var(--text-primary)]">
        {value}
      </p>
    </div>
  );
}

function formatPlayerRange(
  minPlayers: number | null,
  maxPlayers: number | null,
  entryType: "INDIVIDUAL" | "TEAM",
) {
  if (entryType === "INDIVIDUAL") {
    return "1";
  }

  if (minPlayers === null && maxPlayers === null) {
    return "TBD";
  }

  if (minPlayers !== null && maxPlayers !== null && minPlayers === maxPlayers) {
    return String(minPlayers);
  }

  if (minPlayers !== null && maxPlayers !== null) {
    return `${minPlayers}–${maxPlayers}`;
  }

  if (minPlayers !== null) {
    return `${minPlayers}+`;
  }

  return `Up to ${maxPlayers}`;
}

function formatDisplayValue(value: string) {
  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}
