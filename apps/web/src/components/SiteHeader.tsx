import React from "react";
import Link from "next/link";

interface SiteHeaderProps {
  activeNavigation?: string;
}

export function SiteHeader({ activeNavigation }: SiteHeaderProps) {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--surface)] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5">
            <div className="inline-flex items-baseline gap-1">
              <span className="text-base font-bold tracking-tight text-[var(--text-primary)]">
                TSDW
              </span>
              <span className="text-xs font-semibold tracking-widest text-[var(--text-secondary)]">
                SPORTS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                activeNavigation === "home"
                  ? "text-[var(--text-primary)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              Home
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Events
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Teams
            </Link>
          </nav>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <button 
              className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              aria-label="Menu"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
