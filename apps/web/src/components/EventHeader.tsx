import React from "react";
import { StatusBadge } from "./StatusBadge";
import type { EventEdition } from "@/lib/mock-data";

interface EventHeaderProps {
  edition: EventEdition;
}

export function EventHeader({ edition }: EventHeaderProps) {
  const formatDateRange = (start: Date, end: Date) => {
    const startMonth = start.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const endMonth = end.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return `${startMonth} – ${endMonth}`;
  };

  return (
    <div className="border-b border-[var(--border)] pb-6 mb-8">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[var(--text-primary)] mb-2">
            {edition.name}
          </h1>
          <p className="text-lg text-[var(--text-secondary)]">
            {edition.startDate && edition.endDate
              ? formatDateRange(edition.startDate, edition.endDate)
              : "Dates to be announced"}
          </p>
        </div>
        <StatusBadge status={edition.status} />
      </div>

      <div className="text-sm text-[var(--text-secondary)] space-y-1">
        <div>
          {edition.competitions.length} competitions
          {edition.competitions.filter((c) => c.status === "LIVE").length >
            0 && (
            <span className="ml-2 text-[var(--live)] font-semibold">
              • {edition.competitions.filter((c) => c.status === "LIVE").length}{" "}
              live now
            </span>
          )}
        </div>
        <div>
          {
            edition.competitions
              .flatMap((c) => c.fixtures)
              .filter((f) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);
                const fixtureDate = f.scheduledTime || new Date();
                return (
                  (f.status === "COMPLETED" || f.status === "WALKOVER") &&
                  fixtureDate >= today &&
                  fixtureDate < tomorrow
                );
              }).length
          }{" "}
          completed today
        </div>
      </div>
    </div>
  );
}
