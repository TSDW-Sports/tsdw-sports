// V1
// "use client";

// import Link from "next/link";
// import { useCallback, useEffect, useRef, useState } from "react";

// const COMPETITIONS = [
//   "BGMI",
//   "CODM",
//   "VALORANT",
//   "STUMBLE GUYS",
//   "CLASH ROYALE",
//   "FIFA",
//   "FOOTBALL",
//   "CRICKET AUCTION",
// ] as const;

// const TICKER_ITEMS = [...COMPETITIONS];

// export function ReflexLanding() {
//   const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
//   const [interactionsEnabled, setInteractionsEnabled] = useState(false);
//   const frameRequested = useRef(false);
//   const pendingPosition = useRef({ x: 0.5, y: 0.5 });

//   const handleMouseMove = useCallback((event: MouseEvent) => {
//     pendingPosition.current = {
//       x: event.clientX / window.innerWidth,
//       y: event.clientY / window.innerHeight,
//     };

//     if (!frameRequested.current) {
//       frameRequested.current = true;
//       requestAnimationFrame(() => {
//         setMouse(pendingPosition.current);
//         frameRequested.current = false;
//       });
//     }
//   }, []);

//   useEffect(() => {
//     const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
//     const prefersReducedMotion = window.matchMedia(
//       "(prefers-reduced-motion: reduce)"
//     ).matches;

//     if (isCoarsePointer || prefersReducedMotion) {
//       return;
//     }

//     setInteractionsEnabled(true);
//     window.addEventListener("mousemove", handleMouseMove);
//     return () => window.removeEventListener("mousemove", handleMouseMove);
//   }, [handleMouseMove]);

//   const parallaxX = interactionsEnabled ? (mouse.x - 0.5) * 24 : 0;
//   const parallaxY = interactionsEnabled ? (mouse.y - 0.5) * 14 : 0;

//   return (
//     <main
//       className="relative min-h-screen overflow-x-clip bg-[var(--canvas)] text-[var(--text-primary)]"
//       style={
//         {
//           "--px": `${parallaxX}px`,
//           "--py": `${parallaxY}px`,
//         } as React.CSSProperties
//       }
//     >
//       {/* Structural grid texture */}
//       <div
//         aria-hidden="true"
//         className="pointer-events-none absolute inset-0 opacity-[0.035]"
//         style={{
//           backgroundImage: `
//             linear-gradient(to right, currentColor 1px, transparent 1px),
//             linear-gradient(to bottom, currentColor 1px, transparent 1px)
//           `,
//           backgroundSize: "64px 64px",
//         }}
//       />

//       {/* Thin arena sightlines */}
//       <div
//         aria-hidden="true"
//         className="pointer-events-none absolute inset-0 opacity-[0.05]"
//         style={{
//           backgroundImage: `
//             linear-gradient(115deg, transparent 48%, currentColor 48.3%, currentColor 48.5%, transparent 48.8%),
//             linear-gradient(115deg, transparent 68%, currentColor 68.3%, currentColor 68.5%, transparent 68.8%)
//           `,
//         }}
//       />

//       {/* Cursor spotlight */}
//       {interactionsEnabled && (
//         <div
//           aria-hidden="true"
//           className="pointer-events-none fixed inset-0 z-0"
//           style={{
//             background: `radial-gradient(680px circle at ${mouse.x * 100}% ${
//               mouse.y * 100
//             }%, rgba(245,245,245,0.06), transparent 42%)`,
//           }}
//         />
//       )}

//       {/* Oversized watermark */}
//       <div
//         aria-hidden="true"
//         className="reflex-watermark reflex-animate-watermark pointer-events-none absolute left-1/2 top-1/2 select-none whitespace-nowrap text-[28vw] font-black leading-none tracking-[-0.08em] text-[var(--text-primary)]"
//         style={{
//           transform:
//             "translate(calc(-50% + var(--px)), calc(-50% + var(--py)))",
//         }}
//       >
//         REFLEX
//       </div>

//       <div className="relative z-10 flex min-h-screen flex-col">
//         {/* Header */}
//         <header className="flex items-center justify-between px-5 py-6 sm:px-8 lg:px-12">
//           <p className="reflex-animate text-sm font-bold tracking-[0.22em]">
//             TSDW SPORTS
//           </p>

//           <div
//             className="reflex-animate flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]"
//             style={{ animationDelay: "60ms" }}
//           >
//             <span className="h-2 w-2 rounded-full bg-[var(--live)]" />
//             2026
//           </div>
//         </header>

//         {/* Hero */}
//         <section className="flex flex-1 items-center px-5 py-16 sm:px-8 lg:px-12">
//           <div className="mx-auto w-full max-w-7xl">
//             <p
//               className="reflex-animate mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--text-secondary)] sm:text-sm"
//               style={{ animationDelay: "80ms" }}
//             >
//               TCET Presents
//             </p>

//             <h1
//               className="reflex-animate max-w-6xl text-[17vw] font-black leading-[0.78] tracking-[-0.075em] sm:text-[13vw] lg:text-[10rem]"
//               style={{ animationDelay: "140ms" }}
//             >
//               REFLEX
//               <span className="block text-[0.42em] tracking-[0.2em] text-[var(--text-secondary)]">
//                 2026
//               </span>
//             </h1>

//             <div className="mt-12 grid gap-10 border-t border-[var(--border)] pt-8 md:grid-cols-[1fr_auto] md:items-end">
//               <div>
//                 <p
//                   className="reflex-animate max-w-xl text-xl font-bold uppercase leading-tight tracking-tight sm:text-3xl"
//                   style={{ animationDelay: "220ms" }}
//                 >
//                   The arena is almost ready.
//                 </p>

//                 <p
//                   className="reflex-animate mt-3 max-w-lg text-sm leading-6 text-[var(--text-secondary)] sm:text-base"
//                   style={{ animationDelay: "280ms" }}
//                 >
//                   Fixtures. Results. Live scores. One arena.
//                 </p>

//                 <div
//                   className="reflex-animate mt-8"
//                   style={{ animationDelay: "340ms" }}
//                 >
//                   <Link
//                     href="/events/reflex/2026"
//                     className="group relative inline-flex items-center gap-3 overflow-hidden border border-[var(--text-primary)] px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] transition-colors duration-300 hover:text-[var(--canvas)]"
//                   >
//                     <span className="absolute inset-0 -translate-x-full bg-[var(--text-primary)] transition-transform duration-300 ease-out group-hover:translate-x-0" />
//                     <span className="relative">Enter the Arena</span>
//                     <span className="relative transition-transform duration-300 ease-out group-hover:translate-x-1.5">
//                       →
//                     </span>
//                   </Link>
//                 </div>
//               </div>

//               <div
//                 className="reflex-animate md:text-right"
//                 style={{ animationDelay: "260ms" }}
//               >
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

//         {/* Ticker */}
//         <div
//           className="reflex-animate overflow-hidden border-y border-[var(--border)] bg-[var(--surface)] py-3"
//           style={{ animationDelay: "400ms" }}
//           aria-hidden="true"
//         >
//           <div className="reflex-ticker-track flex w-max whitespace-nowrap">
//             {[0, 1].map((copy) => (
//               <div
//                 key={copy}
//                 className="flex items-center gap-6 pr-6 text-xs font-bold uppercase tracking-[0.22em] text-[var(--text-secondary)] sm:text-sm"
//               >
//                 {TICKER_ITEMS.map((item) => (
//                   <span key={item} className="flex items-center gap-6">
//                     {item}
//                     <span className="text-[var(--text-muted)]">◆</span>
//                   </span>
//                 ))}
//               </div>
//             ))}
//           </div>
//         </div>
//         <span className="sr-only">
//           Competitions: {COMPETITIONS.join(", ")}
//         </span>

//         {/* Competition list */}
//         <section
//           aria-label="Competitions"
//           className="border-b border-[var(--border)] px-5 py-16 sm:px-8 lg:px-12"
//         >
//           <div className="mx-auto w-full max-w-7xl">
//             <p className="reflex-animate mb-8 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--text-secondary)]">
//               Competitions
//             </p>

//             <ul>
//               {COMPETITIONS.map((name, index) => {
//                 const isEven = index % 2 === 0;
//                 return (
//                   <li
//                     key={name}
//                     className="group border-t border-[var(--border)] py-4 last:border-b sm:py-5"
//                   >
//                     <div
//                       className={`flex items-baseline gap-4 sm:gap-6 ${
//                         isEven ? "justify-start" : "justify-end text-right"
//                       }`}
//                     >
//                       <span className="text-xs font-semibold text-[var(--text-muted)] sm:text-sm">
//                         {String(index + 1).padStart(2, "0")}
//                       </span>
//                       <span className="text-[9.5vw] font-black uppercase leading-none tracking-[-0.03em] text-[var(--text-primary)] transition-colors duration-300 group-hover:text-[var(--text-secondary)] sm:text-[5vw] lg:text-[4rem]">
//                         {name}
//                       </span>
//                     </div>
//                   </li>
//                 );
//               })}
//             </ul>
//           </div>
//         </section>

//         {/* Footer */}
//         <footer className="flex flex-col gap-4 px-5 py-6 text-xs text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
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

// V2
"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

const TICKER_ITEMS = [
  "BGMI",
  "CODM",
  "VALORANT",
  "STUMBLE GUYS",
  "CLASH ROYALE",
  "FIFA",
  "FOOTBALL",
  "CRICKET AUCTION",
] as const;

type CompetitionItem = {
  name: string;
  accent: string;
  wash: string;
  sizeClass: string;
  gridClass: string;
  alignClass: string;
};

const COMPETITIONS: CompetitionItem[] = [
  {
    name: "BGMI",
    accent: "#ffb020",
    wash: "#ffb02033",
    sizeClass: "text-[clamp(2.75rem,6vw,5.25rem)]",
    gridClass: "lg:col-start-1 lg:col-span-4 lg:row-start-1",
    alignClass: "text-left",
  },
  {
    name: "VALORANT",
    accent: "#ff3358",
    wash: "#ff335833",
    sizeClass: "text-[clamp(2.75rem,6.5vw,5.75rem)]",
    gridClass: "lg:col-start-8 lg:col-span-5 lg:row-start-1",
    alignClass: "lg:text-right",
  },
  {
    name: "FOOTBALL",
    accent: "#3ddc84",
    wash: "#3ddc8433",
    sizeClass: "text-[clamp(3rem,7.5vw,6.75rem)]",
    gridClass: "lg:col-start-4 lg:col-span-5 lg:row-start-2",
    alignClass: "text-left",
  },
  {
    name: "CODM",
    accent: "#ffd23f",
    wash: "#ffd23f33",
    sizeClass: "text-[clamp(2.25rem,5vw,4rem)]",
    gridClass: "lg:col-start-1 lg:col-span-3 lg:row-start-3",
    alignClass: "text-left",
  },
  {
    name: "FIFA",
    accent: "#b6ff3c",
    wash: "#b6ff3c33",
    sizeClass: "text-[clamp(2.25rem,5vw,4.25rem)]",
    gridClass: "lg:col-start-9 lg:col-span-4 lg:row-start-3",
    alignClass: "lg:text-right",
  },
  {
    name: "CLASH ROYALE",
    accent: "#3b5bff",
    wash: "#3b5bff33",
    sizeClass: "text-[clamp(2.25rem,5.5vw,4.25rem)]",
    gridClass: "lg:col-start-3 lg:col-span-6 lg:row-start-4",
    alignClass: "text-left",
  },
  {
    name: "STUMBLE GUYS",
    accent: "#22e6d0",
    wash: "#22e6d033",
    sizeClass: "text-[clamp(2rem,4.5vw,3.5rem)]",
    gridClass: "lg:col-start-1 lg:col-span-4 lg:row-start-5",
    alignClass: "text-left",
  },
  {
    name: "CRICKET AUCTION",
    accent: "#ff5a3c",
    wash: "#ff5a3c33",
    sizeClass: "text-[clamp(2rem,4.5vw,3.5rem)]",
    gridClass: "lg:col-start-7 lg:col-span-6 lg:row-start-5",
    alignClass: "lg:text-right",
  },
];

const LERP = 0.12;

export function ReflexLanding() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const targetPos = useRef({ x: 0.5, y: 0.5 });
  const currentPos = useRef({ x: 0.5, y: 0.5 });
  const rafId = useRef<number | null>(null);

  const [interactionsEnabled, setInteractionsEnabled] = useState(false);

  const animate = useCallback(() => {
    const current = currentPos.current;
    const target = targetPos.current;

    current.x += (target.x - current.x) * LERP;
    current.y += (target.y - current.y) * LERP;

    const node = rootRef.current;
    if (node) {
      node.style.setProperty("--mx", `${(current.x * 100).toFixed(2)}%`);
      node.style.setProperty("--my", `${(current.y * 100).toFixed(2)}%`);
      node.style.setProperty(
        "--px",
        `${((current.x - 0.5) * 24).toFixed(2)}px`,
      );
      node.style.setProperty(
        "--py",
        `${((current.y - 0.5) * 14).toFixed(2)}px`,
      );
    }

    rafId.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (isCoarsePointer || prefersReducedMotion) {
      return;
    }

    setInteractionsEnabled(true);

    const handleMouseMove = (event: MouseEvent) => {
      targetPos.current = {
        x: event.clientX / window.innerWidth,
        y: event.clientY / window.innerHeight,
      };
    };

    window.addEventListener("mousemove", handleMouseMove);
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [animate]);

  const handleAccentEnter = (wash: string) => {
    rootRef.current?.style.setProperty("--hover-accent", wash);
  };

  const handleAccentLeave = () => {
    rootRef.current?.style.removeProperty("--hover-accent");
  };

  return (
    <div
      ref={rootRef}
      className="relative min-h-screen overflow-x-clip bg-[var(--canvas)] text-[var(--text-primary)]"
      style={
        {
          "--mx": "50%",
          "--my": "50%",
          "--px": "0px",
          "--py": "0px",
        } as CSSProperties
      }
    >
      {/* Arena light washes — directional, not centered blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(1100px circle at 6% -6%, var(--reflex-blue-wash), transparent 55%),
            radial-gradient(1100px circle at 96% 106%, var(--reflex-orange-wash), transparent 55%)
          `,
        }}
      />

      {/* Structural grid texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Tinted sightlines catching the arena light */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(115deg, transparent 18%, var(--reflex-blue-wash) 18.4%, var(--reflex-blue-wash) 18.7%, transparent 19%),
            linear-gradient(115deg, transparent 78%, var(--reflex-orange-wash) 78.4%, var(--reflex-orange-wash) 78.7%, transparent 79%)
          `,
        }}
      />

      {/* Arena cursor light — desktop only, pointer loop writes CSS vars directly */}
      {interactionsEnabled && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0"
          style={{
            background: `
              radial-gradient(520px circle at var(--mx) var(--my), var(--hover-accent, var(--reflex-orange-wash)), transparent 45%),
              radial-gradient(900px circle at var(--mx) var(--my), var(--reflex-blue-wash), transparent 60%)
            `,
          }}
        />
      )}

      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-5 py-6 sm:px-8 lg:px-12">
          <p className="reflex-animate text-sm font-bold tracking-[0.22em]">
            TSDW SPORTS
          </p>

          <div
            className="reflex-animate flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]"
            style={{ animationDelay: "60ms" }}
          >
            <span className="reflex-pulse h-2 w-2 rounded-full bg-[var(--reflex-green)]" />
            2026
          </div>
        </header>

        {/* Hero */}
        <section className="flex flex-1 items-center px-5 py-16 sm:px-8 lg:px-12">
          <div className="mx-auto w-full max-w-7xl">
            <div
              className="reflex-animate mb-6 flex items-center gap-3"
              style={{ animationDelay: "80ms" }}
            >
              <span className="reflex-pulse h-1.5 w-1.5 rounded-full bg-[var(--reflex-green)]" />
              <span className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--reflex-green)]">
                Status / Preparing
              </span>
            </div>

            <p
              className="reflex-animate mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--text-secondary)] sm:text-sm"
              style={{ animationDelay: "120ms" }}
            >
              TCET Presents
            </p>

            <h1
              className="reflex-animate max-w-6xl text-[17vw] font-black leading-[0.78] tracking-[-0.075em] sm:text-[13vw] lg:text-[10rem]"
              style={{
                animationDelay: "160ms",
                transform: "translate3d(var(--px), var(--py), 0)",
                textShadow:
                  "-3px 0 0 var(--reflex-blue-wash), 3px 0 0 var(--reflex-orange-wash)",
              }}
            >
              REFLEX
              <span className="reflex-stroke block text-[0.42em] tracking-[0.2em]">
                2026
              </span>
            </h1>

            <div className="mt-12 grid gap-10 border-t border-[var(--border)] pt-8 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <p
                  className="reflex-animate max-w-xl text-xl font-bold uppercase leading-tight tracking-tight sm:text-3xl"
                  style={{ animationDelay: "220ms" }}
                >
                  The arena is almost ready.
                </p>

                <p
                  className="reflex-animate mt-3 max-w-lg text-sm leading-6 text-[var(--text-secondary)] sm:text-base"
                  style={{ animationDelay: "280ms" }}
                >
                  Fixtures. Results. Live scores. One arena.
                </p>

                <div
                  className="reflex-animate mt-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--reflex-blue)]"
                  style={{ animationDelay: "320ms" }}
                >
                  <span>08 Competitions</span>
                  <span className="h-3 w-px bg-[var(--reflex-blue)]/40" />
                  <span>01 Arena</span>
                </div>

                <div
                  className="reflex-animate mt-8"
                  style={{ animationDelay: "360ms" }}
                >
                  <Link
                    href="/events/reflex/2026"
                    className="group inline-flex items-center gap-3 border-2 border-[var(--reflex-green)] bg-transparent px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-[var(--reflex-green)] transition-all duration-150 ease-[cubic-bezier(0.65,0,0.35,1)] hover:bg-[var(--reflex-green)] hover:text-[#050505] focus-visible:bg-[var(--reflex-green)] focus-visible:text-[#050505] focus-visible:outline-none"
                  >
                    <span>Enter the Arena</span>
                    <span className="transition-transform duration-150 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:translate-x-1.5">
                      →
                    </span>
                  </Link>
                </div>
              </div>

              <div
                className="reflex-animate md:text-right"
                style={{ animationDelay: "300ms" }}
              >
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--text-muted)]">
                  System
                </p>
                <p className="text-lg font-bold uppercase tracking-[0.12em] text-[var(--reflex-green)]">
                  Online
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Ticker */}
        <div
          className="reflex-animate overflow-hidden border-y border-[var(--border)] bg-[var(--surface)] py-3"
          style={{ animationDelay: "420ms" }}
          aria-hidden="true"
        >
          <div className="flex items-center">
            <div className="relative z-20 flex shrink-0 items-center gap-3 bg-[var(--canvas)] px-5 sm:px-8">
              <span
                className="h-2 w-2 shrink-0 rounded-full bg-[#a3ff12] reflex-status-dot"
                aria-hidden="true"
              />

              <span className="whitespace-nowrap text-xs font-bold uppercase tracking-[0.22em] text-[var(--text-primary)]">
                REFLEX / 2026
              </span>

              <span className="ml-1 h-5 w-px bg-[#ff5a1f]" aria-hidden="true" />
            </div>

            <div className="reflex-ticker-track flex w-max flex-shrink-0 whitespace-nowrap pl-6">
              {[0, 1].map((copy) => (
                <div
                  key={copy}
                  className="flex items-center gap-6 pr-6 text-xs font-bold uppercase tracking-[0.22em] text-[var(--text-primary)] sm:text-sm"
                >
                  {TICKER_ITEMS.map((item) => (
                    <span key={item} className="flex items-center gap-6">
                      {item}
                      <span className="text-[var(--reflex-orange)]">◆</span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        <span className="sr-only">Competitions: {TICKER_ITEMS.join(", ")}</span>

        {/* Competition Arena Wall */}
        <section
          aria-label="Competitions"
          className="border-b border-[var(--border)] px-5 py-20 sm:px-8 lg:px-12"
        >
          <div className="mx-auto w-full max-w-7xl">
            <p className="reflex-animate mb-10 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--text-secondary)]">
              Competitions
            </p>

            <ul className="grid grid-cols-1 gap-y-10 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-12">
              {COMPETITIONS.map((item, index) => (
                <li
                  key={item.name}
                  className={`group relative ${item.gridClass} ${item.alignClass}`}
                  style={{ "--item-accent": item.accent } as CSSProperties}
                  onMouseEnter={() => handleAccentEnter(item.wash)}
                  onMouseLeave={handleAccentLeave}
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-8 -z-10 rounded-full opacity-0 blur-2xl transition-opacity duration-150 group-hover:opacity-40"
                    style={{ background: item.wash }}
                  />

                  <div className="relative inline-block">
                    <span className="mr-3 align-top text-xs font-semibold text-[var(--text-muted)] transition-colors duration-150 group-hover:text-[var(--item-accent)] sm:text-sm">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span
                      className={`relative font-black uppercase leading-[0.9] tracking-tight text-[var(--text-primary)] transition-colors duration-150 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:text-[var(--item-accent)] ${item.sizeClass}`}
                    >
                      {item.name}
                    </span>

                    <span
                      aria-hidden="true"
                      className="absolute -bottom-1 left-0 h-[3px] w-full origin-left scale-x-0 transition-transform duration-150 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-x-100"
                      style={{ background: item.accent }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Footer */}
        <footer className="flex flex-col gap-4 px-5 py-6 text-xs text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
              TSDW Sports Committee · TCET
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs uppercase tracking-[0.16em]">
              <span className="text-[var(--text-muted)]">
                Build /{" "}
                <span className="text-[var(--text-secondary)]">
                  Hitesh Prajapati
                </span>
              </span>

              <a
                href="https://github.com/autistickyrios"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-secondary)] hover:text-[#a3ff12] transition-colors"
              >
                GitHub ↗
              </a>

              <a
                href="https://www.linkedin.com/in/levenine/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-secondary)] hover:text-[#a3ff12] transition-colors"
              >
                LinkedIn ↗
              </a>
            </div>
          </div>

          <Link
            href="/events/reflex/2026"
            className="w-fit text-[var(--text-secondary)] transition-colors hover:text-[var(--reflex-green)]"
          >
            REFLEX 2026 →
          </Link>
        </footer>
      </div>
    </div>
  );
}
