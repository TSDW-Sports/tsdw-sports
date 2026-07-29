import type { Fixture, Competition } from "@/lib/mock-data";

interface BracketViewProps {
  competition: Competition;
}

type BracketRound = [string, Fixture[]];

function FixtureBox({ fixture }: { fixture: Fixture }) {
  const isLive = fixture.status === "LIVE";
  const isCompleted = fixture.status === "COMPLETED";
  const isWalkover = fixture.status === "WALKOVER";

  return (
    <div
      className={`border text-xs ${
        isLive
          ? "border-[var(--live)] bg-[#2a0a0a]"
          : "border-[var(--border)] bg-[var(--surface)]"
      }`}
    >
      <div className="px-3 py-2">
        {/* Team 1 */}
        <div className="mb-1 flex items-baseline justify-between gap-2">
          <span
            className={`truncate font-semibold ${
              isCompleted &&
              !isWalkover &&
              fixture.winner === fixture.team1?.id
                ? "text-[var(--success)]"
                : "text-[var(--text-primary)]"
            }`}
          >
            {fixture.team1?.code || "TBD"}
          </span>

          {(isLive || isCompleted) && !isWalkover && (
            <span className="font-bold text-[var(--text-primary)]">
              {fixture.score1 ?? "—"}
            </span>
          )}

          {isWalkover && fixture.team1?.id === fixture.winner && (
            <span className="font-bold text-[var(--success)]">W/O</span>
          )}
        </div>

        {/* Divider */}
        <div className="my-1 border-t border-[var(--border)]" />

        {/* Team 2 */}
        <div className="flex items-baseline justify-between gap-2">
          <span
            className={`truncate font-semibold ${
              isCompleted &&
              !isWalkover &&
              fixture.winner === fixture.team2?.id
                ? "text-[var(--success)]"
                : "text-[var(--text-primary)]"
            }`}
          >
            {fixture.team2?.code || "TBD"}
          </span>

          {(isLive || isCompleted) && !isWalkover && (
            <span className="font-bold text-[var(--text-primary)]">
              {fixture.score2 ?? "—"}
            </span>
          )}

          {isWalkover && fixture.team2?.id === fixture.winner && (
            <span className="font-bold text-[var(--success)]">W/O</span>
          )}
        </div>

        {/* Penalty result */}
        {fixture.penaltyResult && (
          <div className="mt-1 border-t border-[var(--border)] pt-1 text-xs text-[var(--text-muted)]">
            PEN: {fixture.penaltyResult.score1}–{fixture.penaltyResult.score2}
          </div>
        )}
      </div>
    </div>
  );
}

function MobileView({ rounds }: { rounds: BracketRound[] }) {
  return (
    <div className="space-y-8">
      {rounds.map(([roundName, fixtures]) => (
        <div key={roundName}>
          <h3 className="mb-3 px-1 text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">
            {roundName}
          </h3>

          <div className="space-y-2">
            {fixtures.map((fixture, index) => (
              <div key={fixture.id}>
                <FixtureBox fixture={fixture} />

                {index < fixtures.length - 1 && (
                  <div className="py-1 text-center text-xs text-[var(--text-muted)]">
                    ↓
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function DesktopView({ rounds }: { rounds: BracketRound[] }) {
  return (
    <div className="overflow-x-auto">
      <div className="inline-flex min-w-full gap-10 px-2 py-4">
        {rounds.map(([roundName, fixtures]) => (
          <div key={roundName} className="flex-shrink-0">
            <h4 className="mb-4 whitespace-nowrap px-1 text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">
              {roundName}
            </h4>

            <div className="space-y-4">
              {fixtures.map((fixture) => (
                <div key={fixture.id} className="w-44">
                  <FixtureBox fixture={fixture} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BracketView({ competition }: BracketViewProps) {
  const rounds = new Map<string, Fixture[]>();

  competition.fixtures.forEach((fixture) => {
    if (!rounds.has(fixture.round)) {
      rounds.set(fixture.round, []);
    }

    rounds.get(fixture.round)!.push(fixture);
  });

  const roundOrder = [
    "Quarter Final",
    "Semi Final",
    "Final",
    "League",
    "Group",
  ];

  const sortedRounds = Array.from(rounds.entries()).sort(
    ([roundA], [roundB]) => {
      const indexA = roundOrder.indexOf(roundA);
      const indexB = roundOrder.indexOf(roundB);

      if (indexA === -1) return 1;
      if (indexB === -1) return -1;

      return indexA - indexB;
    },
  );

  return (
    <div>
      <div className="md:hidden">
        <MobileView rounds={sortedRounds} />
      </div>

      <div className="hidden md:block">
        <DesktopView rounds={sortedRounds} />
      </div>
    </div>
  );
}