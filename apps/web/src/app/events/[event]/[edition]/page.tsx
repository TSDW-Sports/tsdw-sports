import { SiteHeader } from "@/components/SiteHeader";
import { EventHeader } from "@/components/EventHeader";
import { SectionHeader } from "@/components/SectionHeader";
import { FixtureCard } from "@/components/FixtureCard";
import { CompetitionCard } from "@/components/CompetitionCard";
import {
  mockEventEdition,
  getLiveFixtures,
  getTodayFixtures,
  getRecentResults,
} from "@/lib/mock-data";

interface PageProps {
  params: Promise<{
    event: string;
    edition: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { edition } = await params;
  const editionName = edition.replace(/-/g, " ").toUpperCase();

  return {
    title: `${editionName} | TSDW Sports`,
    description: `Follow ${editionName} live scores, fixtures, results, and standings.`,
  };
}

export default function EventEditionPage() {
  const liveFixtures = getLiveFixtures(mockEventEdition);
  const todayFixtures = getTodayFixtures(mockEventEdition);
  const recentResults = getRecentResults(mockEventEdition);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "live", label: "Live", active: liveFixtures.length > 0 },
    { id: "schedule", label: "Schedule" },
    { id: "competitions", label: "Competitions" },
    { id: "results", label: "Results" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--canvas)]">
      <SiteHeader activeNavigation="events" />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Event Header */}
        <EventHeader edition={mockEventEdition} />

        {/* Navigation Tabs */}
        <div className="mb-8 border-b border-[var(--border)]">
          <nav className="flex gap-6 overflow-x-auto scrollbar-hidden">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`pb-3 text-sm font-semibold whitespace-nowrap transition-colors relative ${
                  tab.active
                    ? "text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {tab.label}

                {tab.active && (
                  <>
                    <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-[var(--text-primary)]" />
                    <span className="ml-2 inline-block w-2 h-2 rounded-full bg-[var(--live)] animate-pulse" />
                  </>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Live Fixtures */}
        {liveFixtures.length > 0 && (
          <section className="mb-12">
            <SectionHeader
              title="Live Now"
              subtitle={`${liveFixtures.length} fixture${
                liveFixtures.length > 1 ? "s" : ""
              } in progress`}
            />

            <div className="grid sm:grid-cols-2 gap-6">
              {liveFixtures.map((fixture) => (
                <FixtureCard key={fixture.id} fixture={fixture} />
              ))}
            </div>
          </section>
        )}

        {/* Today's Schedule */}
        {todayFixtures.length > 0 && (
          <section className="mb-12">
            <SectionHeader
              title="Today's Schedule"
              subtitle={`${todayFixtures.length} match${
                todayFixtures.length > 1 ? "es" : ""
              }`}
            />

            <div className="space-y-3">
              {todayFixtures.map((fixture) => (
                <div
                  key={fixture.id}
                  className="border border-[var(--border)] rounded-lg p-4 bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-[var(--text-secondary)] uppercase mb-1">
                        {fixture.scheduledTime?.toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>

                      <div className="text-sm font-semibold text-[var(--text-primary)]">
                        {fixture.competition} • {fixture.round}
                      </div>

                      <div className="text-sm text-[var(--text-muted)]">
                        {fixture.team1?.code} vs {fixture.team2?.code}
                      </div>
                    </div>

                    <div className="text-right text-xs text-[var(--text-muted)]">
                      {fixture.venue}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Competitions */}
        <section className="mb-12">
          <SectionHeader
            title="Competitions"
            subtitle={`${mockEventEdition.competitions.length} sports`}
          />

          <div className="grid sm:grid-cols-2 gap-4">
            {mockEventEdition.competitions.map((competition) => (
              <CompetitionCard
                key={competition.id}
                competition={competition}
                eventEditionId="tspark/2027"
              />
            ))}
          </div>
        </section>

        {/* Recent Results */}
        {recentResults.length > 0 && (
          <section className="mb-12">
            <SectionHeader
              title="Recent Results"
              subtitle={`${recentResults.length} completed match${
                recentResults.length > 1 ? "es" : ""
              }`}
            />

            <div className="grid sm:grid-cols-2 gap-4">
              {recentResults.map((fixture) => (
                <FixtureCard key={fixture.id} fixture={fixture} compact />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] bg-[var(--surface)] mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="text-sm text-[var(--text-secondary)]">
            <p className="mb-2">TSDW Sports Platform</p>

            <p className="text-xs text-[var(--text-muted)]">
              © 2027 TSDW Sports Committee, TCET
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}