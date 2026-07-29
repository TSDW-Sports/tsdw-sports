import React from "react";
import Link from "next/link";
import { StatusBadge } from "./StatusBadge";
import type { Competition } from "@/lib/mock-data";

interface CompetitionCardProps {
  competition: Competition;
  eventEditionId: string;
}

export function CompetitionCard({
  competition,
  eventEditionId,
}: CompetitionCardProps) {
  const competitionSlug = competition.name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[&']/g, "");

  const liveFixtures = competition.fixtures.filter(
    (f) => f.status === "LIVE"
  ).length;
  const completedFixtures = competition.fixtures.filter(
    (f) => f.status === "COMPLETED" || f.status === "WALKOVER"
  ).length;

  return (
    <Link
      href={`/events/${eventEditionId}/${competitionSlug}`}
      className="block border border-[var(--border)] rounded-lg p-4 sm:p-6 bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-all hover:border-[var(--border-strong)]"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-[var(--text-primary)] mb-1 truncate">
            {competition.name}
          </h3>
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <span>{competition.category === "OUTDOOR" ? "Outdoor" : "Indoor"}</span>
            <span>•</span>
            <span>{competition.format === "KNOCKOUT" ? "Knockout" : competition.format === "LEAGUE" ? "League" : "Group"}</span>
          </div>
        </div>
        <div className="flex-shrink-0">
          <StatusBadge status={competition.status} />
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[var(--text-muted)]">{competition.entrants.length} teams</span>
          {liveFixtures > 0 && (
            <span className="font-semibold text-[var(--live)]">{liveFixtures} live</span>
          )}
        </div>
        {completedFixtures > 0 && (
          <div className="text-xs text-[var(--text-muted)]">
            {completedFixtures} completed
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {competition.entrants.slice(0, 4).map((team) => (
          <span
            key={team.id}
            className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-[var(--surface-hover)] text-[var(--text-secondary)] border border-[var(--border)]"
          >
            {team.code}
          </span>
        ))}
        {competition.entrants.length > 4 && (
          <span className="inline-flex items-center px-2 py-1 text-xs font-semibold text-[var(--text-muted)]">
            +{competition.entrants.length - 4}
          </span>
        )}
      </div>
    </Link>
  );
}
