import { redirect } from "next/navigation";

import { LoginForm } from "./LoginForm";
import { getStaffSession } from "@/lib/auth";

export default async function AdminLoginPage() {
  const session = await getStaffSession();

  if (session) {
    redirect("/admin");
  }

  return (
    <main className="min-h-screen bg-[var(--canvas)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--text-secondary)] mb-2">
            TSDW Sports
          </p>

          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            Staff Login
          </h1>

          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Sign in to access sports administration.
          </p>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}