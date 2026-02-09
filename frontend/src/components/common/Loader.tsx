"use client";

import React from "react";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  message?: string;
}

export const Loader: React.FC<LoaderProps> = ({ size = "md", message }) => {
  const sizeStyles = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-3",
    lg: "w-16 h-16 border-4",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`spinner ${sizeStyles[size]}`}></div>
      {message && (
        <p className="text-white/80 text-sm animate-pulse">{message}</p>
      )}
    </div>
  );
};
