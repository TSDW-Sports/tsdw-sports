import React from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    href?: string;
  };
}

export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-1">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-[var(--text-secondary)]">{subtitle}</p>
        )}
      </div>
      {action && (
        <a
          href={action.href}
          className="text-sm font-semibold text-[var(--info)] hover:text-blue-300 transition-colors whitespace-nowrap"
        >
          {action.label} →
        </a>
      )}
    </div>
  );
}
