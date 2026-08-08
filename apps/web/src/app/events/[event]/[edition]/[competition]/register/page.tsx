import Link from "next/link";
import { notFound } from "next/navigation";

import { RegistrationForm } from "./RegistrationForm";
import { SiteHeader } from "@/components/SiteHeader";
import { prisma } from "@/lib/prisma";

interface PageProps {
  params: Promise<{
    event: string;
    edition: string;
    competition: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { competition } = await params;

  const competitionName = competition
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return {
    title: `Register for ${competitionName} | TSDW Sports`,
  };
}

export default async function RegistrationPage({ params }: PageProps) {
  const { event, edition, competition: competitionSlug } = await params;

  /*
   * Registration is currently being built for REFLEX only.
   */
  if (event.toLowerCase() !== "reflex") {
    notFound();
  }

  const year = Number(edition);

  if (!Number.isInteger(year)) {
    notFound();
  }

  const competition = await prisma.competition.findFirst({
    where: {
      slug: competitionSlug.toLowerCase(),
      eventEdition: {
        year,
        event: {
          slug: event.toLowerCase(),
        },
      },
    },
    include: {
      eventEdition: {
        include: {
          event: true,
        },
      },
    },
  });

  if (!competition) {
    notFound();
  }

  const departments = await prisma.department.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const isTeam = competition.entryType === "TEAM";

  return (
    <div className="min-h-screen flex flex-col bg-[var(--canvas)]">
      <SiteHeader activeNavigation="competition" />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-[var(--text-secondary)]">
          <Link href="/" className="hover:text-[var(--text-primary)]">
            Home
          </Link>

          {" / "}

          <Link
            href={`/events/${event}/${edition}`}
            className="hover:text-[var(--text-primary)]"
          >
            {competition.eventEdition.name}
          </Link>

          {" / "}

          <Link
            href={`/events/${event}/${edition}/${competition.slug}`}
            className="hover:text-[var(--text-primary)]"
          >
            {competition.name}
          </Link>

          {" / "}

          <span className="text-[var(--text-primary)]">Register</span>
        </div>

        {/* Heading */}
        <div className="mb-8">
          <div className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
            {competition.eventEdition.name}
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-3">
            Register for {competition.name}
          </h1>

          <p className="text-[var(--text-secondary)]">
            {isTeam
              ? "Register your team for this competition."
              : "Register yourself for this competition."}
          </p>
        </div>

        {/* Registration information */}
        <div className="grid sm:grid-cols-3 gap-3 mb-8">
          <div className="border border-[var(--border)] rounded-lg p-4 bg-[var(--surface)]">
            <div className="text-xs uppercase text-[var(--text-muted)] mb-1">
              Entry
            </div>

            <div className="font-semibold text-[var(--text-primary)]">
              {isTeam ? "Team" : "Individual"}
            </div>
          </div>

          <div className="border border-[var(--border)] rounded-lg p-4 bg-[var(--surface)]">
            <div className="text-xs uppercase text-[var(--text-muted)] mb-1">
              Entry Fee
            </div>

            <div className="font-semibold text-[var(--text-primary)]">
              {competition.entryFee === null
                ? "Free"
                : `₹${competition.entryFee}`}
            </div>
          </div>

          <div className="border border-[var(--border)] rounded-lg p-4 bg-[var(--surface)]">
            <div className="text-xs uppercase text-[var(--text-muted)] mb-1">
              Platform
            </div>

            <div className="font-semibold text-[var(--text-primary)]">
              {competition.platform || "TBD"}
            </div>
          </div>
        </div>

        {/* Form */}
        <RegistrationForm
          competitionId={competition.id}
          isTeam={competition.entryType === "TEAM"}
          departments={departments}
          minPlayers={competition.minPlayers}
          maxPlayers={competition.maxPlayers}
        />
      </main>
    </div>
  );
}
