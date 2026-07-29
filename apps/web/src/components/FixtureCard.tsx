import React from "react";
import { StatusBadge } from "./StatusBadge";
import type { Fixture } from "@/lib/mock-data";

interface FixtureCardProps {
  fixture: Fixture;
  compact?: boolean;
  highlightWinner?: boolean;
}

export function FixtureCard({ fixture, compact = false, highlightWinner = true }: FixtureCardProps) {
  const isLive = fixture.status === "LIVE";
  const isCompleted = fixture.status === "COMPLETED";
  const isWalkover = fixture.status === "WALKOVER";
  const isScheduled = fixture.status === "SCHEDULED";

  const formatTime = (date?: Date) => {
    if (!date) return "";
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  const getCompetitionDisplayName = (competitionId: string) => {
    const competitionMap: Record<string, string> = {
      "mens-football-2027": "Men's Football",
      "womens-volleyball-2027": "Women's Volleyball",
      "chess-2027": "Chess",
    };
    return competitionMap[competitionId] || competitionId;
  };

  if (compact) {
    return (
      <div className="border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border)]">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
              {fixture.round}
            </span>
          </div>
          <StatusBadge status={fixture.status} />
        </div>

        {/* Content */}
        <div className="px-4 py-3">
          <div className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">
            {getCompetitionDisplayName(fixture.competition)}
          </div>

          {isLive && (
            <div className="flex justify-between items-end gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <div className="text-xs text-[var(--text-secondary)] truncate">
                  {fixture.team1?.code}
                </div>
                <div className="text-3xl font-bold text-[var(--text-primary)] leading-none">
                  {fixture.score1 ?? "-"}
                </div>
              </div>
              <div className="text-xs text-[var(--text-muted)] font-semibold">–</div>
              <div className="flex-1 min-w-0 text-right">
                <div className="text-xs text-[var(--text-secondary)] truncate">
                  {fixture.team2?.code}
                </div>
                <div className="text-3xl font-bold text-[var(--text-primary)] leading-none">
                  {fixture.score2 ?? "-"}
                </div>
              </div>
            </div>
          )}

          {isCompleted && (
            <div className="space-y-1">
              <div className="flex justify-between items-end gap-2">
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-[var(--text-secondary)] truncate">
                    {fixture.team1?.code}
                  </div>
                  <div
                    className={`text-3xl font-bold leading-none ${
                      highlightWinner && fixture.winner === fixture.team1?.id
                        ? "text-[var(--success)]"
                        : "text-[var(--text-primary)]"
                    }`}
                  >
                    {fixture.score1 ?? "—"}
                  </div>
                </div>
                <div className="text-xs text-[var(--text-muted)] font-semibold">–</div>
                <div className="flex-1 min-w-0 text-right">
                  <div className="text-xs text-[var(--text-secondary)] truncate">
                    {fixture.team2?.code}
                  </div>
                  <div
                    className={`text-3xl font-bold leading-none ${
                      highlightWinner && fixture.winner === fixture.team2?.id
                        ? "text-[var(--success)]"
                        : "text-[var(--text-primary)]"
                    }`}
                  >
                    {fixture.score2 ?? "—"}
                  </div>
                </div>
              </div>
              {fixture.penaltyResult && (
                <div className="text-xs text-[var(--text-muted)] pt-1.5 border-t border-[var(--border)]">
                  <span className="font-semibold text-[var(--text-secondary)]">PEN:</span> {fixture.penaltyResult.score1}–{fixture.penaltyResult.score2}
                </div>
              )}
            </div>
          )}

          {isWalkover && (
            <div className="space-y-1">
              <div className="flex justify-between items-center gap-2">
                <div className="flex-1">
                  <div className="text-xs text-[var(--text-secondary)] truncate">
                    {fixture.team1?.code}
                  </div>
                  <div className="text-2xl font-bold text-[var(--success)]">W/O</div>
                </div>
                <div className="text-xs text-[var(--text-muted)]">vs</div>
                <div className="flex-1 text-right">
                  <div className="text-xs text-[var(--text-secondary)] truncate">
                    {fixture.team2?.code}
                  </div>
                  <div className="text-2xl font-bold text-[var(--text-muted)]">—</div>
                </div>
              </div>
            </div>
          )}

          {isScheduled && (
            <div className="space-y-1">
              <div className="flex justify-between items-center gap-2">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[var(--text-primary)] truncate">
                    {fixture.team1?.code}
                  </div>
                </div>
                <div className="text-sm text-[var(--text-muted)]">vs</div>
                <div className="flex-1 min-w-0 text-right">
                  <div className="text-sm font-semibold text-[var(--text-primary)] truncate">
                    {fixture.team2?.code}
                  </div>
                </div>
              </div>
              {fixture.scheduledTime && (
                <div className="text-xs text-[var(--text-muted)]">
                  {formatTime(fixture.scheduledTime)}
                </div>
              )}
            </div>
          )}

          {fixture.venue && (
            <div className="text-xs text-[var(--text-muted)] mt-2 pt-2 border-t border-[var(--border)]">
              {fixture.venue}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Full-size card variant
  return (
    <div className="border border-[var(--border)] rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-colors overflow-hidden">
      <div className="px-5 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
            {fixture.round}
          </span>
          <StatusBadge status={fixture.status} />
        </div>

        {isLive && (
          <div className="space-y-2">
            <div className="flex justify-between items-end gap-4">
              <div className="flex-1">
                <div className="text-sm text-[var(--text-secondary)] mb-1">{fixture.team1?.code}</div>
                <div className="text-4xl font-bold text-[var(--text-primary)]">{fixture.score1 ?? "—"}</div>
              </div>
              <div className="text-lg font-semibold text-[var(--text-muted)]">–</div>
              <div className="flex-1 text-right">
                <div className="text-sm text-[var(--text-secondary)] mb-1">{fixture.team2?.code}</div>
                <div className="text-4xl font-bold text-[var(--text-primary)]">{fixture.score2 ?? "—"}</div>
              </div>
            </div>
          </div>
        )}

        {isCompleted && (
          <div className="space-y-2">
            <div className="flex justify-between items-end gap-4">
              <div className="flex-1">
                <div className="text-sm text-[var(--text-secondary)] mb-1">{fixture.team1?.code}</div>
                <div
                  className={`text-4xl font-bold ${
                    highlightWinner && fixture.winner === fixture.team1?.id
                      ? "text-[var(--success)]"
                      : "text-[var(--text-primary)]"
                  }`}
                >
                  {fixture.score1 ?? "—"}
                </div>
              </div>
              <div className="text-lg font-semibold text-[var(--text-muted)]">–</div>
              <div className="flex-1 text-right">
                <div className="text-sm text-[var(--text-secondary)] mb-1">{fixture.team2?.code}</div>
                <div
                  className={`text-4xl font-bold ${
                    highlightWinner && fixture.winner === fixture.team2?.id
                      ? "text-[var(--success)]"
                      : "text-[var(--text-primary)]"
                  }`}
                >
                  {fixture.score2 ?? "—"}
                </div>
              </div>
            </div>
            {fixture.penaltyResult && (
              <div className="text-xs text-[var(--text-muted)] pt-2 border-t border-[var(--border)]">
                <span className="font-semibold text-[var(--text-secondary)]">Penalties:</span> {fixture.penaltyResult.score1}–{fixture.penaltyResult.score2}
              </div>
            )}
          </div>
        )}

        {isWalkover && (
          <div className="space-y-1">
            <div className="flex justify-between items-center gap-4">
              <div className="flex-1">
                <div className="text-sm text-[var(--text-secondary)] mb-1">{fixture.team1?.code}</div>
                <div className="text-2xl font-bold text-[var(--success)]">Walkover Winner</div>
              </div>
              <div className="flex-1 text-right">
                <div className="text-sm text-[var(--text-secondary)] mb-1">{fixture.team2?.code}</div>
                <div className="text-2xl font-bold text-[var(--text-muted)]">—</div>
              </div>
            </div>
          </div>
        )}

        {isScheduled && (
          <div className="space-y-1">
            <div className="flex justify-between items-center gap-4">
              <div className="flex-1">
                <div className="text-base font-semibold text-[var(--text-primary)]">{fixture.team1?.code}</div>
              </div>
              <div className="text-base font-semibold text-[var(--text-secondary)]">vs</div>
              <div className="flex-1 text-right">
                <div className="text-base font-semibold text-[var(--text-primary)]">{fixture.team2?.code}</div>
              </div>
            </div>
          </div>
        )}

        {fixture.scheduledTime && (
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] pt-2 border-t border-[var(--border)]">
            <span>{formatTime(fixture.scheduledTime)}</span>
            {fixture.venue && <span>{fixture.venue}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
