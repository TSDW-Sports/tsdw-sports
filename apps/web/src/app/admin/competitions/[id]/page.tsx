import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { getStaffSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateCompetition } from "./actions";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminCompetitionEditPage({ params }: PageProps) {
  const session = await getStaffSession();

  if (!session) {
    redirect("/admin/login");
  }

  const { id } = await params;

  const competition = await prisma.competition.findUnique({
    where: {
      id,
    },
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
  });

  if (!competition) {
    notFound();
  }

  const event = competition.eventEdition.event;
  const edition = competition.eventEdition;

  return (
    <main className="min-h-screen bg-[var(--canvas)] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-4xl">
        {/* Navigation */}
        <div className="mb-8">
          <Link
            href="/admin/competitions"
            className="mb-4 inline-block text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            ← Competitions
          </Link>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
                {event.name} {edition.year}
              </p>

              <h1 className="text-3xl font-bold text-[var(--text-primary)] sm:text-4xl">
                {competition.name}
              </h1>

              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Manage competition settings and tournament configuration.
              </p>
            </div>

            <span className="inline-flex w-fit rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold text-[var(--text-secondary)]">
              {competition.status}
            </span>
          </div>
        </div>

        {/* Summary */}
        <section className="mb-6 grid gap-3 sm:grid-cols-3">
          <SummaryCard
            label="Registrations"
            value={String(competition._count.entries)}
          />

          <SummaryCard
            label="Fixtures"
            value={String(competition._count.fixtures)}
          />

          <SummaryCard label="Competition ID" value={competition.id} mono />
        </section>

        {/* Settings form */}
        <form action={updateCompetition} className="space-y-6">
          <input type="hidden" name="competitionId" value={competition.id} />
          {/* Basic information */}
          <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
            <SectionTitle
              title="Basic Information"
              description="Public identity and URL configuration for this competition."
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Competition Name">
                <input
                  type="text"
                  name="name"
                  defaultValue={competition.name}
                  required
                  className={inputClassName}
                />
              </Field>

              <Field label="Slug">
                <input
                  type="text"
                  value={competition.slug}
                  readOnly
                  className={`${inputClassName} cursor-not-allowed opacity-60`}
                />

                <p className="mt-2 text-xs text-[var(--text-muted)]">
                  Structural identifier. Can only be changed by a developer.
                </p>
              </Field>
            </div>
          </section>

          {/* Tournament configuration */}
          <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
            <SectionTitle
              title="Tournament Configuration"
              description="Configure how this competition is structured and entered."
            />

            <div className="grid gap-5 sm:grid-cols-3">
              <Field label="Format">
                <select
                  name="format"
                  defaultValue={competition.format}
                  className={inputClassName}
                >
                  <option value="TBD">TBD</option>
                  <option value="KNOCKOUT">Knockout</option>
                  <option value="LEAGUE">League</option>
                  <option value="GROUP">Group</option>
                  <option value="GROUP_KNOCKOUT">Group + Knockout</option>
                  <option value="MULTI_PARTICIPANT">Multi Participant</option>
                  <option value="LEADERBOARD">Leaderboard</option>
                </select>
              </Field>

              <Field label="Entry Type">
                <select
                  name="entryType"
                  defaultValue={competition.entryType}
                  className={inputClassName}
                >
                  <option value="INDIVIDUAL">Individual</option>
                  <option value="TEAM">Team</option>
                </select>
              </Field>

              <Field label="Status">
                <select
                  name="status"
                  defaultValue={competition.status}
                  className={inputClassName}
                >
                  <option value="UPCOMING">Upcoming</option>
                  <option value="LIVE">Live</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </Field>
            </div>
          </section>

          {/* Registration */}
          <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
            <SectionTitle
              title="Registration"
              description="Player limits and entry fee configuration."
            />

            <div className="grid gap-5 sm:grid-cols-3">
              <Field label="Minimum Players">
                <input
                  type="number"
                  name="minPlayers"
                  min="1"
                  defaultValue={competition.minPlayers ?? ""}
                  placeholder="TBD"
                  className={inputClassName}
                />
              </Field>

              <Field label="Maximum Players">
                <input
                  type="number"
                  name="maxPlayers"
                  min="1"
                  defaultValue={competition.maxPlayers ?? ""}
                  placeholder="TBD"
                  className={inputClassName}
                />
              </Field>

              <Field label="Entry Fee (₹)">
                <input
                  type="number"
                  name="entryFee"
                  min="0"
                  defaultValue={competition.entryFee ?? ""}
                  placeholder="0"
                  className={inputClassName}
                />
              </Field>
            </div>
          </section>

          {/* Logistics */}
          <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
            <SectionTitle
              title="Logistics"
              description="Platform and venue information displayed for organizers and participants."
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Platform">
                <input
                  type="text"
                  name="platform"
                  defaultValue={competition.platform ?? ""}
                  placeholder="PC, Mobile, Console..."
                  className={inputClassName}
                />
              </Field>

              <Field label="Venue">
                <input
                  type="text"
                  name="venue"
                  defaultValue={competition.venue ?? ""}
                  placeholder="Venue TBD"
                  className={inputClassName}
                />
              </Field>
            </div>
          </section>

          {/* Rules */}
          <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
            <SectionTitle
              title="Rules"
              description="Competition-specific rules and participant requirements."
            />

            <Field label="Rules">
              <textarea
                name="rules"
                defaultValue={competition.rules ?? ""}
                rows={10}
                placeholder="Enter competition rules..."
                className={`${inputClassName} resize-y`}
              />
            </Field>
          </section>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-[var(--border)] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href={`/events/${event.slug}/${edition.year}/${competition.slug}`}
              target="_blank"
              className="text-center text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              View public page ↗
            </Link>

            <div className="flex gap-3">
              <Link
                href="/admin/competitions"
                className="inline-flex items-center justify-center rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-hover)]"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="rounded-lg bg-[var(--text-primary)] px-5 py-2.5 text-sm font-semibold text-[var(--canvas)] transition-opacity hover:opacity-90"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

function SectionTitle({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-5 border-b border-[var(--border)] pb-4">
      <h2 className="text-lg font-bold text-[var(--text-primary)]">{title}</h2>

      <p className="mt-1 text-sm text-[var(--text-secondary)]">{description}</p>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
        {label}
      </span>

      {children}
    </label>
  );
}

function SummaryCard({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
        {label}
      </p>

      <p
        className={`truncate text-sm font-semibold text-[var(--text-primary)] ${
          mono ? "font-mono text-xs" : ""
        }`}
        title={value}
      >
        {value}
      </p>
    </div>
  );
}

const inputClassName =
  "w-full rounded-lg border border-[var(--border)] bg-[var(--canvas)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--border-strong)]";
