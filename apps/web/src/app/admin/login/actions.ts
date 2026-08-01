"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { createStaffSession } from "@/lib/auth";

export interface LoginState {
  success: boolean;
  message: string;
}

export async function loginStaff(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(
    formData.get("email") ?? "",
  )
    .trim()
    .toLowerCase();

  const password = String(
    formData.get("password") ?? "",
  );

  if (!email || !password) {
    return {
      success: false,
      message: "Email and password are required.",
    };
  }

  const staffUser = await prisma.staffUser.findUnique({
    where: {
      email,
    },
  });

  if (!staffUser || !staffUser.active) {
    return {
      success: false,
      message: "Invalid email or password.",
    };
  }

  const passwordMatches = await bcrypt.compare(
    password,
    staffUser.passwordHash,
  );

  if (!passwordMatches) {
    return {
      success: false,
      message: "Invalid email or password.",
    };
  }

  await createStaffSession({
    staffUserId: staffUser.id,
    email: staffUser.email,
    role: staffUser.role,
  });

  redirect("/admin");
}