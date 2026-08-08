import Link from "next/link";
import { redirect } from "next/navigation";

import { getStaffSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminCompetitionsPage() {
  const session = await getStaffSession();

  if (!session) {
    redirect("/admin/login");
  }

  const competitions = await prisma.competition.findMany({
    include: {
      eventEdition: {
        include: {
          event: true,
        },
      },
      _count: {
        select: {
          entries: true,
          fixtures: true,
        },
      },
    },
    orderBy: [
      {
        eventEdition: {
          year: "desc",
        },
      },
      {
        name: "asc",
      },
    ],
  });

  return (
    <main className="min-h-screen bg-[var(--canvas)] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="mb-4 inline-block text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            ← Administration
          </Link>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
                TSDW Sports
              </p>

              <h1 className="text-3xl font-bold text-[var(--text-primary)] sm:text-4xl">
                Competitions
              </h1>

              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Manage competition configuration across TSDW Sports events.
              </p>
            </div>

            <div className="text-sm text-[var(--text-secondary)]">
              {competitions.length}{" "}
              {competitions.length === 1 ? "competition" : "competitions"}
            </div>
          </div>
        </div>

        {/* Empty state */}
        {competitions.length === 0 && (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8">
            <p className="font-semibold text-[var(--text-primary)]">
              No competitions found
            </p>

            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Competitions will appear here once they are added to an event
              edition.
            </p>
          </div>
        )}

        {/* Competition list */}
        {competitions.length > 0 && (
          <div className="space-y-4">
            {competitions.map((competition) => {
              const event = competition.eventEdition.event;
              const edition = competition.eventEdition;

              const playerRange =
                competition.minPlayers === null &&
                competition.maxPlayers === null
                  ? "TBD"
                  : competition.minPlayers === competition.maxPlayers
                    ? `${competition.minPlayers ?? competition.maxPlayers}`
                    : `${competition.minPlayers ?? "?"}–${
                        competition.maxPlayers ?? "?"
                      }`;

              return (
                <article
                  key={competition.id}
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                          {event.name} {edition.year}
                        </span>

                        <span className="text-[var(--text-muted)]">•</span>

                        <CompetitionStatus status={competition.status} />
                      </div>

                      <h2 className="text-xl font-bold text-[var(--text-primary)] sm:text-2xl">
                        {competition.name}
                      </h2>

                      <p className="mt-1 font-mono text-xs text-[var(--text-muted)]">
                        /{competition.slug}
                      </p>

                      <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-6">
                        <CompetitionDetail
                          label="Format"
                          value={formatLabel(competition.format)}
                        />

                        <CompetitionDetail
                          label="Entry"
                          value={formatLabel(competition.entryType)}
                        />

                        <CompetitionDetail
                          label="Players"
                          value={playerRange}
                        />

                        <CompetitionDetail
                          label="Entry Fee"
                          value={
                            competition.entryFee === null
                              ? "TBD"
                              : competition.entryFee === 0
                                ? "Free"
                                : `₹${competition.entryFee}`
                          }
                        />

                        <CompetitionDetail
                          label="Entries"
                          value={String(competition._count.entries)}
                        />

                        <CompetitionDetail
                          label="Fixtures"
                          value={String(competition._count.fixtures)}
                        />
                      </div>

                      {(competition.platform || competition.venue) && (
                        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-[var(--border)] pt-4 text-sm text-[var(--text-secondary)]">
                          {competition.platform && (
                            <span>
                              <span className="text-[var(--text-muted)]">
                                Platform:
                              </span>{" "}
                              {competition.platform}
                            </span>
                          )}

                          {competition.venue && (
                            <span>
                              <span className="text-[var(--text-muted)]">
                                Venue:
                              </span>{" "}
                              {competition.venue}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex shrink-0">
                      <Link
                        href={`/admin/competitions/${competition.id}`}
                        className="inline-flex items-center justify-center rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-hover)]"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

function CompetitionDetail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
        {label}
      </p>

      <p className="text-sm font-semibold text-[var(--text-primary)]">
        {value}
      </p>
    </div>
  );
}

function CompetitionStatus({
  status,
}: {
  status: "UPCOMING" | "LIVE" | "COMPLETED" | "CANCELLED";
}) {
  return (
    <span className="inline-flex w-fit rounded-full border border-[var(--border)] px-2.5 py-1 text-xs font-semibold text-[var(--text-secondary)]">
      {status}
    </span>
  );
}

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}