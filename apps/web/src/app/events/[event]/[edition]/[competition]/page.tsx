import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SectionHeader } from "@/components/SectionHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { FixtureCard } from "@/components/FixtureCard";
import { BracketView } from "@/components/BracketView";
import {
  mockEventEdition,
  getRecentResults,
} from "@/lib/mock-data";

interface PageProps {
  params: Promise<{
    event: string;
    edition: string;
    competition: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { competition } = await params;
  const competitionName = (competition || "")
    .replace(/-/g, " ")
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    title: `${competitionName} | TSpark 2027 | TSDW Sports`,
    description: `Follow ${competitionName} fixtures, bracket, results, and standings at TSpark 2027.`,
  };
}

export default async function CompetitionPage({ params }: PageProps) {
  const { competition: competitionParam } = await params;
  // Find the competition by slug
  const competitionSlug = (competitionParam || "").toLowerCase();
  const competition = mockEventEdition.competitions.find((c) => {
    const slug = c.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[&']/g, "");
    return slug === competitionSlug;
  });

  if (!competition) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--canvas)]">
        <SiteHeader />
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-12 text-center">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
            Competition not found
          </h1>
          <Link
            href="/events/tspark/2027"
            className="text-[var(--info)] hover:text-blue-300"
          >
            Back to TSpark 2027
          </Link>
        </main>
      </div>
    );
  }

  const completedFixtures = competition.fixtures.filter(
    (f) => f.status === "COMPLETED" || f.status === "WALKOVER"
  );

  const allCompetitionResults = getRecentResults(mockEventEdition, 100).filter(
    (f) => f.competition === competition.id
  );

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
          <Link href="/events/tspark/2027" className="hover:text-[var(--text-primary)]">
            TSpark 2027
          </Link>
          {" / "}
          <span className="text-[var(--text-primary)]">{competition.name}</span>
        </div>

        {/* Competition Header */}
        <div className="border-b border-[var(--border)] pb-6 mb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="text-sm font-semibold text-[var(--text-secondary)] uppercase mb-2">
                TSpark 2027
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-[var(--text-primary)] mb-3">
                {competition.name}
              </h1>
              <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                <span className="capitalize">
                  {competition.category.toLowerCase()}
                </span>
                <span>•</span>
                <span className="capitalize">
                  {competition.format.toLowerCase()}
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
                {competition.entrants.find((t) => t.id === competition.winner)
                  ?.code || competition.winner}
              </div>
            </div>
          )}
        </div>

        {/* Tournament Bracket */}
        <section className="mb-12">
          <SectionHeader title="Bracket" />
          <div className="border border-[var(--border)] rounded-lg p-6 bg-[var(--surface)]">
            <BracketView competition={competition} />
          </div>
        </section>

        {/* Fixtures */}
        <section className="mb-12">
          <SectionHeader
            title="Fixtures"
            subtitle={`${competition.fixtures.length} match${competition.fixtures.length > 1 ? "es" : ""}`}
          />
          <div className="grid sm:grid-cols-2 gap-4">
            {competition.fixtures.map((fixture) => (
              <FixtureCard key={fixture.id} fixture={fixture} compact />
            ))}
          </div>
        </section>

        {/* Entrants */}
        <section className="mb-12">
          <SectionHeader
            title="Participating Teams"
            subtitle={`${competition.entrants.length} department${competition.entrants.length > 1 ? "s" : ""}`}
          />
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {competition.entrants.map((team) => (
              <div
                key={team.id}
                className="border border-[var(--border)] rounded-lg p-4 bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-colors"
              >
                <div className="font-semibold text-[var(--text-primary)]">
                  {team.code}
                </div>
                <div className="text-sm text-[var(--text-secondary)]">
                  {team.name}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Results */}
        {completedFixtures.length > 0 && (
          <section className="mb-12">
            <SectionHeader
              title="Results"
              subtitle={`${completedFixtures.length} completed match${completedFixtures.length > 1 ? "es" : ""}`}
            />
            <div className="grid sm:grid-cols-2 gap-4">
              {allCompetitionResults.map((fixture) => (
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
            <p className="mb-2">TSDW Sports Platform • TSpark 2027</p>
            <p className="text-xs text-[var(--text-muted)]">
              © 2027 TSDW Sports Committee, TCET
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
