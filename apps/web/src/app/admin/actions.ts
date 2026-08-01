"use server";

import { redirect } from "next/navigation";

import { deleteStaffSession } from "@/lib/auth";

export async function logoutStaff() {
  await deleteStaffSession();

  redirect("/admin/login");
}