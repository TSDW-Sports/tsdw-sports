// import { SiteHeader } from "@/components/SiteHeader";
// import { SectionHeader } from "@/components/SectionHeader";
// import { FixtureCard } from "@/components/FixtureCard";
// import { CompetitionCard } from "@/components/CompetitionCard";
// import { StatusBadge } from "@/components/StatusBadge";
// import {
//   mockEventEdition,
//   getLiveFixtures,
//   getTodayFixtures,
//   getRecentResults,
//   getUpcomingFixtures,
// } from "@/lib/mock-data";

// export const metadata = {
//   title: "TSDW Sports | Live College Sports",
//   description:
//     "Follow live fixtures, results, and tournaments at TCET. TSpark 2027 is live now.",
// };

// export default function Home() {
//   const liveFixtures = getLiveFixtures(mockEventEdition);
//   const todayFixtures = getTodayFixtures(mockEventEdition);
//   const recentResults = getRecentResults(mockEventEdition, 4);
//   const upcomingFixtures = getUpcomingFixtures(mockEventEdition, 3);

//   const hasLiveFixtures = liveFixtures.length > 0;
//   // const liveCompetitions = mockEventEdition.competitions.filter(
//   //   (c) => c.status === "LIVE"
//   // );

//   const completedToday = mockEventEdition.competitions
//     .flatMap((c) => c.fixtures)
//     .filter((f) => {
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
//       const tomorrow = new Date(today);
//       tomorrow.setDate(tomorrow.getDate() + 1);
//       const fixtureDate = f.scheduledTime || new Date();
//       return (
//         (f.status === "COMPLETED" || f.status === "WALKOVER") &&
//         fixtureDate >= today &&
//         fixtureDate < tomorrow
//       );
//     }).length;

//   return (
//     <div className="min-h-screen flex flex-col bg-[var(--canvas)]">
//       <SiteHeader activeNavigation="home" />

//       <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-14">
//         {/* Compact Event Header */}
//         <div className="mb-8">
//           <div className="mb-4">
//             <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-2">
//               TSDW SPORTS
//             </h1>
//             <p className="text-lg text-[var(--text-secondary)]">
//               {mockEventEdition.name}
//             </p>
//           </div>

//           <div className="flex flex-wrap items-center gap-4 text-sm">
//             <StatusBadge status={mockEventEdition.status} />
//             <span className="text-[var(--text-muted)]">
//               {mockEventEdition.startDate && mockEventEdition.endDate
//                 ? `${mockEventEdition.startDate.toLocaleDateString("en-US", {
//                     month: "short",
//                     day: "numeric",
//                   })}–${mockEventEdition.endDate.toLocaleDateString("en-US", {
//                     month: "short",
//                     day: "numeric",
//                   })}`
//                 : "Dates to be announced"}
//             </span>
//             {hasLiveFixtures && (
//               <span className="text-[var(--live)] font-semibold">
//                 {liveFixtures.length} live now
//               </span>
//             )}
//             {completedToday > 0 && (
//               <span className="text-[var(--text-secondary)]">
//                 {completedToday} completed today
//               </span>
//             )}
//           </div>
//         </div>

//         {/* Live Fixtures */}
//         {hasLiveFixtures && (
//           <section className="mb-12">
//             <SectionHeader
//               title="Live Now"
//               subtitle={`${liveFixtures.length} match${liveFixtures.length > 1 ? "es" : ""} in progress`}
//               action={{
//                 label: "View Event",
//                 href: "/events/tspark/2027",
//               }}
//             />
//             <div className="grid sm:grid-cols-2 gap-4">
//               {liveFixtures.map((fixture) => (
//                 <FixtureCard key={fixture.id} fixture={fixture} compact />
//               ))}
//             </div>
//           </section>
//         )}

//         {/* Today's Fixtures */}
//         {todayFixtures.length > 0 && (
//           <section className="mb-12">
//             <SectionHeader
//               title="Today's Fixtures"
//               subtitle={`${todayFixtures.length} match${todayFixtures.length > 1 ? "es" : ""}`}
//               action={{
//                 label: "Full Schedule",
//                 href: "/events/tspark/2027",
//               }}
//             />
//             <div className="grid sm:grid-cols-2 gap-4">
//               {todayFixtures.slice(0, 4).map((fixture) => (
//                 <FixtureCard key={fixture.id} fixture={fixture} compact />
//               ))}
//             </div>
//           </section>
//         )}

//         {/* Up Next */}
//         {upcomingFixtures.length > 0 && (
//           <section className="mb-10">
//             <h2 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-4">
//               Up Next
//             </h2>
//             <div className="space-y-2">
//               {upcomingFixtures.map((fixture) => (
//                 <div
//                   key={fixture.id}
//                   className="border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-colors px-4 py-3"
//                 >
//                   <div className="flex items-center justify-between gap-3">
//                     <div className="flex-1 min-w-0">
//                       <div className="text-xs font-semibold text-[var(--text-secondary)] uppercase mb-0.5">
//                         {fixture.scheduledTime?.toLocaleTimeString("en-US", {
//                           hour: "2-digit",
//                           minute: "2-digit",
//                         })}
//                       </div>
//                       <div className="text-xs text-[var(--text-muted)] truncate">
//                         {fixture.team1?.code} vs {fixture.team2?.code}
//                       </div>
//                     </div>
//                     <div className="text-right text-xs text-[var(--text-muted)] flex-shrink-0">
//                       {fixture.venue}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section>
//         )}

//         {/* Recent Results */}
//         {recentResults.length > 0 && (
//           <section className="mb-12">
//             <SectionHeader
//               title="Recent Results"
//               subtitle={`${recentResults.length} result${recentResults.length > 1 ? "s" : ""}`}
//               action={{
//                 label: "All Results",
//                 href: "/events/tspark/2027",
//               }}
//             />
//             <div className="grid sm:grid-cols-2 gap-4">
//               {recentResults.map((fixture) => (
//                 <FixtureCard key={fixture.id} fixture={fixture} compact />
//               ))}
//             </div>
//           </section>
//         )}

//         {/* Competitions */}
//         <section className="mb-12">
//           <SectionHeader
//             title="Competitions"
//             subtitle={`${mockEventEdition.competitions.length} sports`}
//           />
//           <div className="grid sm:grid-cols-2 gap-4">
//             {mockEventEdition.competitions.map((competition) => (
//               <CompetitionCard
//                 key={competition.id}
//                 competition={competition}
//                 eventEditionId="tspark/2027"
//               />
//             ))}
//           </div>
//         </section>
//       </main>

//       {/* Footer */}
//       <footer className="border-t border-[var(--border)] bg-[var(--surface)] mt-12">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
//           <div className="text-sm text-[var(--text-secondary)]">
//             <p className="mb-2">TSDW Sports Platform • TSpark 2027</p>
//             <p className="text-xs text-[var(--text-muted)]">
//               © 2027 TSDW Sports Committee, TCET
//             </p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

//  COMING SOON PAGE OVERLAY
// import Link from "next/link";

// export default function HomePage() {
//   return (
//     <main className="relative min-h-screen overflow-hidden bg-[var(--canvas)] text-[var(--text-primary)]">
//       {/* Background grid */}
//       <div
//         className="pointer-events-none absolute inset-0 opacity-[0.035]"
//         style={{
//           backgroundImage: `
//             linear-gradient(to right, currentColor 1px, transparent 1px),
//             linear-gradient(to bottom, currentColor 1px, transparent 1px)
//           `,
//           backgroundSize: "64px 64px",
//         }}
//       />

//       {/* Background typography */}
//       <div
//         aria-hidden="true"
//         className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-[28vw] font-black leading-none tracking-[-0.08em] text-[var(--text-primary)] opacity-[0.018]"
//       >
//         REFLEX
//       </div>

//       <div className="relative z-10 flex min-h-screen flex-col">
//         {/* Header */}
//         <header className="flex items-center justify-between px-5 py-6 sm:px-8 lg:px-12">
//           <div>
//             <p className="text-sm font-bold tracking-[0.22em]">
//               TSDW SPORTS
//             </p>
//           </div>

//           <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">
//             <span className="h-2 w-2 rounded-full bg-[var(--live)]" />
//             2026
//           </div>
//         </header>

//         {/* Main content */}
//         <section className="flex flex-1 items-center px-5 py-16 sm:px-8 lg:px-12">
//           <div className="mx-auto w-full max-w-7xl">
//             <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--text-secondary)] sm:text-sm">
//               Thakur College of Engineering & Technology
//             </p>

//             <h1 className="max-w-6xl text-[17vw] font-black leading-[0.78] tracking-[-0.075em] sm:text-[13vw] lg:text-[10rem]">
//               REFLEX
//               <span className="block text-[0.42em] tracking-[0.2em] text-[var(--text-secondary)]">
//                 2026
//               </span>
//             </h1>

//             <div className="mt-12 grid gap-10 border-t border-[var(--border)] pt-8 md:grid-cols-[1fr_auto] md:items-end">
//               <div>
//                 <p className="max-w-xl text-xl font-semibold leading-relaxed sm:text-2xl">
//                   The arena is almost ready.
//                 </p>

//                 <p className="mt-3 max-w-lg text-sm leading-6 text-[var(--text-secondary)] sm:text-base">
//                   Fixtures, results, live scores and everything REFLEX —
//                   coming together in one place.
//                 </p>
//               </div>

//               <div className="md:text-right">
//                 <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--text-muted)]">
//                   Status
//                 </p>

//                 <p className="text-lg font-bold uppercase tracking-[0.12em]">
//                   Coming Soon
//                 </p>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Footer */}
//         <footer className="flex flex-col gap-4 border-t border-[var(--border)] px-5 py-6 text-xs text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
//           <p>TSDW Sports Committee · TCET</p>

//           <Link
//             href="/events/reflex/2026"
//             className="w-fit text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
//           >
//             REFLEX 2026 →
//           </Link>
//         </footer>
//       </div>
//     </main>
//   );
// }

// V3 HOMEPAGE
// import type { Metadata } from "next";
// import { ReflexLanding } from "@/components/ReflexLanding";

// export const metadata: Metadata = {
//   title: "REFLEX 2026 | TSDW Sports — Coming Soon",
//   description:
//     "REFLEX 2026 by TSDW Sports Committee, TCET. Fixtures, results and live scores — the arena is almost ready.",
// };

// export default function HomePage() {
//   return <ReflexLanding />;
// }


// V4
import type { Metadata } from "next";
import { ReflexLanding } from "@/components/ReflexLanding";

export const metadata: Metadata = {
  title: "REFLEX 2026 | TSDW Sports — Coming Soon",
  description:
    "REFLEX 2026 by TSDW Sports Committee, TCET. Fixtures, results and live scores — the arena is almost ready.",
};

export default function HomePage() {
  return <ReflexLanding />;
}
