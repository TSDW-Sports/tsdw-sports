import Link from "next/link";
import { redirect } from "next/navigation";

import { getStaffSession } from "@/lib/auth";
import { logoutStaff } from "./actions";

export default async function AdminPage() {
  const session = await getStaffSession();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-[var(--canvas)] px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-[var(--text-secondary)] mb-2">
              TSDW Sports
            </p>

            <h1 className="text-4xl font-bold text-[var(--text-primary)]">
              Administration
            </h1>
          </div>

          <form action={logoutStaff}>
            <button
              type="submit"
              className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-hover)]"
            >
              Sign out
            </button>
          </form>
        </div>

        <div className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <p className="text-sm text-[var(--text-secondary)]">Signed in as</p>

          <div className="mt-6">
            <Link
              href="/admin/registrations"
              className="block rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-colors hover:bg-[var(--surface-hover)]"
            >
              <div className="text-lg font-semibold text-[var(--text-primary)]">
                Registrations
              </div>

              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Review and manage competition registrations.
              </p>
            </Link>
          </div>

          <p className="mt-1 font-semibold text-[var(--text-primary)]">
            {session.email}
          </p>

          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Role: {session.role}
          </p>
        </div>
      </div>
    </main>
  );
}
