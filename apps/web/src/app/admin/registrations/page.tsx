import Link from "next/link";
import { redirect } from "next/navigation";

import { getStaffSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { approveRegistration, rejectRegistration } from "./actions";

export default async function AdminRegistrationsPage() {
  const session = await getStaffSession();

  if (!session) {
    redirect("/admin/login");
  }

  const registrations = await prisma.competitionEntry.findMany({
    include: {
      competition: {
        include: {
          eventEdition: {
            include: {
              event: true,
            },
          },
        },
      },

      department: true,

      members: {
        include: {
          participant: {
            include: {
              department: true,
            },
          },
        },
        orderBy: {
          isCaptain: "desc",
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  const pendingCount = registrations.filter(
    (registration) => registration.status === "PENDING",
  ).length;

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
                Registrations
              </h1>

              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Review competition registrations submitted by participants.
              </p>
            </div>

            <div className="text-sm text-[var(--text-secondary)]">
              {pendingCount} pending
            </div>
          </div>
        </div>

        {/* Empty state */}
        {registrations.length === 0 && (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8">
            <p className="font-semibold text-[var(--text-primary)]">
              No registrations found
            </p>

            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Submitted competition registrations will appear here.
            </p>
          </div>
        )}

        {/* Registration list */}
        {registrations.length > 0 && (
          <div className="space-y-4">
            {registrations.map((registration) => {
              const captain = registration.members.find(
                (member) => member.isCaptain,
              );

              const event = registration.competition.eventEdition.event;

              const edition = registration.competition.eventEdition;

              return (
                <article
                  key={registration.id}
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                          {event.name} {edition.year}
                        </span>

                        <span className="text-[var(--text-muted)]">•</span>

                        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                          {registration.competition.name}
                        </span>
                      </div>

                      <h2 className="text-xl font-bold text-[var(--text-primary)]">
                        {registration.name}
                      </h2>

                      <p className="mt-1 text-sm text-[var(--text-secondary)]">
                        {registration.department?.code ?? "No department"}
                      </p>
                    </div>

                    <RegistrationStatus status={registration.status} />
                  </div>

                  <div className="my-5 border-t border-[var(--border)]" />

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                        Primary contact
                      </p>

                      {captain ? (
                        <div className="space-y-1 text-sm">
                          <p className="font-semibold text-[var(--text-primary)]">
                            {captain.participant.name}
                          </p>

                          <p className="text-[var(--text-secondary)]">
                            {captain.participant.studentCode ?? "No student ID"}
                          </p>

                          {captain.participant.email && (
                            <p className="text-[var(--text-secondary)]">
                              {captain.participant.email}
                            </p>
                          )}

                          {captain.participant.phone && (
                            <p className="text-[var(--text-secondary)]">
                              {captain.participant.phone}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-[var(--text-secondary)]">
                          Individual registration
                        </p>
                      )}
                    </div>

                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                        Participants
                      </p>

                      <div className="space-y-2">
                        {registration.members.map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center justify-between gap-4 text-sm"
                          >
                            <div>
                              <span className="font-medium text-[var(--text-primary)]">
                                {member.participant.name}
                              </span>

                              {member.isCaptain && (
                                <span className="ml-2 text-xs text-[var(--text-muted)]">
                                  Captain
                                </span>
                              )}
                            </div>

                            <span className="text-[var(--text-secondary)]">
                              {member.participant.studentCode ?? "—"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {registration.status === "PENDING" && (
                    <div className="mt-5 flex flex-wrap gap-3 border-t border-[var(--border)] pt-5">
                      <form action={approveRegistration}>
                        <input
                          type="hidden"
                          name="registrationId"
                          value={registration.id}
                        />

                        <button
                          type="submit"
                          className="rounded-lg bg-[var(--text-primary)] px-4 py-2 text-sm font-semibold text-[var(--canvas)] transition-opacity hover:opacity-90"
                        >
                          Approve
                        </button>
                      </form>

                      <form action={rejectRegistration}>
                        <input
                          type="hidden"
                          name="registrationId"
                          value={registration.id}
                        />

                        <button
                          type="submit"
                          className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-hover)]"
                        >
                          Reject
                        </button>
                      </form>
                    </div>
                  )}

                  <div className="mt-5 border-t border-[var(--border)] pt-4">
                    <p className="text-xs text-[var(--text-muted)]">
                      Submitted {registration.createdAt.toLocaleString("en-IN")}
                    </p>
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

function RegistrationStatus({
  status,
}: {
  status: "PENDING" | "APPROVED" | "REJECTED" | "DISQUALIFIED" | "WITHDRAWN";
}) {
  return (
    <span className="inline-flex w-fit rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold text-[var(--text-secondary)]">
      {status}
    </span>
  );
}
