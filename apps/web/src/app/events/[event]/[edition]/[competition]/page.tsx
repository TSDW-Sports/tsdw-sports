import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteHeader } from "@/components/SiteHeader";
import { SectionHeader } from "@/components/SectionHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { FixtureCard } from "@/components/FixtureCard";
import { BracketView } from "@/components/BracketView";

import {
  getEventEdition,
  getRecentResults,
} from "@/lib/mock-data";

interface PageProps {
  params: Promise<{
    event: string;
    edition: string;
    competition: string;
  }>;
}

function createCompetitionSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[&']/g, "");
}

export async function generateMetadata({ params }: PageProps) {
  const {
    event,
    edition,
    competition: competitionParam,
  } = await params;

  const eventEdition = getEventEdition(event, edition);

  if (!eventEdition) {
    return {
      title: "Competition | TSDW Sports",
    };
  }

  const competition = eventEdition.competitions.find(
    (item) => createCompetitionSlug(item.name) === competitionParam.toLowerCase()
  );

  if (!competition) {
    return {
      title: `Competition | ${eventEdition.name} | TSDW Sports`,
    };
  }

  return {
    title: `${competition.name} | ${eventEdition.name} | TSDW Sports`,
    description: `Follow ${competition.name} fixtures, results, and competition updates at ${eventEdition.name}.`,
  };
}

export default async function CompetitionPage({ params }: PageProps) {
  const {
    event,
    edition,
    competition: competitionParam,
  } = await params;

  const eventEdition = getEventEdition(event, edition);

  if (!eventEdition) {
    notFound();
  }

  const competition = eventEdition.competitions.find(
    (item) => createCompetitionSlug(item.name) === competitionParam.toLowerCase()
  );

  if (!competition) {
    notFound();
  }

  const completedFixtures = competition.fixtures.filter(
    (fixture) =>
      fixture.status === "COMPLETED" ||
      fixture.status === "WALKOVER"
  );

  const competitionResults = getRecentResults(eventEdition, 100).filter(
    (fixture) => fixture.competition === competition.id
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
          <Link
            href="/"
            className="hover:text-[var(--text-primary)]"
          >
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

          <span className="text-[var(--text-primary)]">
            {competition.name}
          </span>
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
                  {competition.category
                    .toLowerCase()
                    .replace(/_/g, " ")}
                </span>

                <span>•</span>

                <span className="capitalize">
                  {competition.format
                    .toLowerCase()
                    .replace(/_/g, " ")}
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
                  (entrant) => entrant.id === competition.winner
                )?.code || competition.winner}
              </div>
            </div>
          )}
        </div>

        {/* Competition information unavailable */}
        {competition.fixtures.length === 0 &&
          competition.entrants.length === 0 && (
            <section className="mb-12">
              <div className="border border-[var(--border)] rounded-lg p-6 sm:p-8 bg-[var(--surface)]">
                <p className="text-sm font-semibold text-[var(--text-primary)] mb-2">
                  Competition details coming soon
                </p>

                <p className="text-sm text-[var(--text-secondary)]">
                  Fixtures, participants, schedule, and tournament details
                  will be published once they are finalized.
                </p>
              </div>
            </section>
          )}

        {/* Tournament Bracket */}
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
                <FixtureCard
                  key={fixture.id}
                  fixture={fixture}
                  compact
                />
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
                <FixtureCard
                  key={fixture.id}
                  fixture={fixture}
                  compact
                />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] bg-[var(--surface)] mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="text-sm text-[var(--text-secondary)]">
            <p className="mb-2">
              TSDW Sports Platform • {eventEdition.name}
            </p>

            <p className="text-xs text-[var(--text-muted)]">
              © 2026 TSDW Sports Committee, TCET
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}