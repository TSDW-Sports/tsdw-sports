"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getStaffSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  CompetitionFormat,
  CompetitionStatus,
  EntryType,
} from "@/generated/prisma/client";

const VALID_FORMATS = [
  "KNOCKOUT",
  "LEAGUE",
  "GROUP",
  "GROUP_KNOCKOUT",
  "MULTI_PARTICIPANT",
  "LEADERBOARD",
  "TBD",
] as const;

const VALID_ENTRY_TYPES = ["INDIVIDUAL", "TEAM"] as const;

const VALID_STATUSES = ["UPCOMING", "LIVE", "COMPLETED", "CANCELLED"] as const;

function optionalString(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

function optionalInteger(value: FormDataEntryValue | null, minimum: number) {
  if (typeof value !== "string" || value.trim() === "") {
    return null;
  }

  const number = Number(value);

  if (!Number.isInteger(number) || number < minimum) {
    throw new Error("Invalid numeric value.");
  }

  return number;
}

export async function updateCompetition(formData: FormData) {
  const session = await getStaffSession();

  if (!session) {
    redirect("/admin/login");
  }

  const competitionId = formData.get("competitionId");

  if (typeof competitionId !== "string" || !competitionId) {
    throw new Error("Competition ID is required.");
  }

  const existingCompetition = await prisma.competition.findUnique({
    where: {
      id: competitionId,
    },
    include: {
      eventEdition: {
        include: {
          event: true,
        },
      },
    },
  });

  if (!existingCompetition) {
    throw new Error("Competition not found.");
  }

  const name = optionalString(formData.get("name"));

  if (!name) {
    throw new Error("Competition name is required.");
  }

  const formatValue = formData.get("format");
  const entryTypeValue = formData.get("entryType");
  const statusValue = formData.get("status");

  if (
    typeof formatValue !== "string" ||
    !VALID_FORMATS.includes(formatValue as (typeof VALID_FORMATS)[number])
  ) {
    throw new Error("Invalid competition format.");
  }

  if (
    typeof entryTypeValue !== "string" ||
    !VALID_ENTRY_TYPES.includes(
      entryTypeValue as (typeof VALID_ENTRY_TYPES)[number],
    )
  ) {
    throw new Error("Invalid entry type.");
  }

  if (
    typeof statusValue !== "string" ||
    !VALID_STATUSES.includes(statusValue as (typeof VALID_STATUSES)[number])
  ) {
    throw new Error("Invalid competition status.");
  }

  const format = formatValue as CompetitionFormat;
  const entryType = entryTypeValue as EntryType;
  const status = statusValue as CompetitionStatus;

  const minPlayers = optionalInteger(formData.get("minPlayers"), 1);

  const maxPlayers = optionalInteger(formData.get("maxPlayers"), 1);

  const entryFee = optionalInteger(formData.get("entryFee"), 0);

  if (minPlayers !== null && maxPlayers !== null && minPlayers > maxPlayers) {
    throw new Error("Minimum players cannot be greater than maximum players.");
  }

  const platform = optionalString(formData.get("platform"));
  const venue = optionalString(formData.get("venue"));
  const rules = optionalString(formData.get("rules"));

  await prisma.competition.update({
    where: {
      id: competitionId,
    },

    data: {
      name,
      format,
      entryType,
      status,
      minPlayers,
      maxPlayers,
      entryFee,
      platform,
      venue,
      rules,
    },
  });

  const eventSlug = existingCompetition.eventEdition.event.slug;

  const editionYear = existingCompetition.eventEdition.year;

  revalidatePath("/admin/competitions");
  revalidatePath(`/admin/competitions/${competitionId}`);

  revalidatePath(`/events/${eventSlug}/${editionYear}`);

  revalidatePath(
    `/events/${eventSlug}/${editionYear}/${existingCompetition.slug}`,
  );

  redirect("/admin/competitions");
}
