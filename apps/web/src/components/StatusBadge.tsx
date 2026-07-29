import React from "react";
import type { FixtureStatus } from "@/lib/mock-data";

interface StatusBadgeProps {
  status: FixtureStatus | string;
  className?: string;
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "LIVE":
        return "bg-[#2a0a0a] text-[var(--live)] border-[#4a1010]";
      case "COMPLETED":
      case "FINAL":
        return "bg-[var(--surface-elevated)] text-[var(--text-secondary)] border-[var(--border)]";
      case "SCHEDULED":
      case "UPCOMING":
        return "bg-[var(--surface-elevated)] text-[var(--text-secondary)] border-[var(--border)]";
      case "WALKOVER":
        return "bg-[var(--surface-elevated)] text-[var(--text-secondary)] border-[var(--border)]";
      case "POSTPONED":
        return "bg-[#2a1a0a] text-[#d97706] border-[#4a2a0a]";
      case "CANCELLED":
        return "bg-[#2a0a0a] text-[#ef4444] border-[#4a1010]";
      case "ACTIVE":
        return "bg-[#0a2a0a] text-[var(--success)] border-[#1a4a1a]";
      case "UPCOMING":
        return "bg-[var(--surface-elevated)] text-[var(--text-secondary)] border-[var(--border)]";
      default:
        return "bg-[var(--surface-elevated)] text-[var(--text-secondary)] border-[var(--border)]";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "LIVE":
        return "LIVE";
      case "COMPLETED":
        return "FT";
      case "SCHEDULED":
        return "SCHEDULED";
      case "UPCOMING":
        return "UPCOMING";
      case "ACTIVE":
        return "ACTIVE";
      case "WALKOVER":
        return "W/O";
      case "POSTPONED":
        return "PPD";
      case "CANCELLED":
        return "CANCELLED";
      default:
        return status;
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold border ${getStatusStyles(status)} ${className}`}
    >
      {status === "LIVE" && <span className="w-1.5 h-1.5 bg-[var(--live)] rounded-full mr-1.5 animate-pulse"></span>}
      {getStatusLabel(status)}
    </span>
  );
}
