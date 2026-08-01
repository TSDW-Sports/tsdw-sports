"use server";

import { revalidatePath } from "next/cache";

import { getStaffSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getStaffSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  if (session.role !== "ADMIN") {
    throw new Error("Forbidden");
  }

  return session;
}

export async function approveRegistration(formData: FormData) {
  await requireAdmin();

  const registrationId = String(
    formData.get("registrationId") ?? "",
  ).trim();

  if (!registrationId) {
    throw new Error("Registration ID is required.");
  }

  const registration =
    await prisma.competitionEntry.findUnique({
      where: {
        id: registrationId,
      },
      select: {
        id: true,
        status: true,
      },
    });

  if (!registration) {
    throw new Error("Registration not found.");
  }

  if (registration.status !== "PENDING") {
    throw new Error(
      "Only pending registrations can be approved.",
    );
  }

  await prisma.competitionEntry.update({
    where: {
      id: registrationId,
    },
    data: {
      status: "APPROVED",
    },
  });

  revalidatePath("/admin/registrations");
}

export async function rejectRegistration(formData: FormData) {
  await requireAdmin();

  const registrationId = String(
    formData.get("registrationId") ?? "",
  ).trim();

  if (!registrationId) {
    throw new Error("Registration ID is required.");
  }

  const registration =
    await prisma.competitionEntry.findUnique({
      where: {
        id: registrationId,
      },
      select: {
        id: true,
        status: true,
      },
    });

  if (!registration) {
    throw new Error("Registration not found.");
  }

  if (registration.status !== "PENDING") {
    throw new Error(
      "Only pending registrations can be rejected.",
    );
  }

  await prisma.competitionEntry.update({
    where: {
      id: registrationId,
    },
    data: {
      status: "REJECTED",
    },
  });

  revalidatePath("/admin/registrations");
}