"use client";

import React from "react";

interface StatusBadgeProps {
  status: "uploaded" | "processing" | "safe" | "flagged" | "failed";
  progress?: number;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  progress,
}) => {
  const statusConfig = {
    uploaded: {
      label: "Uploaded",
      icon: "📤",
      className: "status-uploaded",
    },
    processing: {
      label: progress !== undefined ? `Processing ${progress}%` : "Processing",
      icon: "⚙️",
      className: "status-processing",
    },
    safe: {
      label: "Safe",
      icon: "✅",
      className: "status-safe",
    },
    flagged: {
      label: "Flagged",
      icon: "⚠️",
      className: "status-flagged",
    },
    failed: {
      label: "Failed",
      icon: "❌",
      className: "status-failed",
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${config.className}`}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
};
