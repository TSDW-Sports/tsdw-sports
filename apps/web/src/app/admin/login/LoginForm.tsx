"use client";

import { useActionState } from "react";

import {
  loginStaff,
  type LoginState,
} from "./actions";

const initialState: LoginState = {
  success: false,
  message: "",
};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(
    loginStaff,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-semibold text-[var(--text-primary)] mb-2"
        >
          Email
        </label>

        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--canvas)] px-4 py-3 text-[var(--text-primary)] outline-none focus:border-[var(--text-secondary)]"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-semibold text-[var(--text-primary)] mb-2"
        >
          Password
        </label>

        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--canvas)] px-4 py-3 text-[var(--text-primary)] outline-none focus:border-[var(--text-secondary)]"
        />
      </div>

      {state.message && (
        <div
          className="rounded-lg border border-[var(--border)] bg-[var(--canvas)] p-3 text-sm text-[var(--text-secondary)]"
          role="alert"
        >
          {state.message}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-[var(--text-primary)] px-4 py-3 text-sm font-semibold text-[var(--canvas)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}