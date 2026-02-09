"use client";

import React from "react";
import Link from "next/link";
import { StatusBadge } from "./StatusBadge";
import type { Video } from "../../api/video.api";

interface VideoCardProps {
  video: Video;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <Link href={`/videos/${video._id}`}>
      <div className="glass-card p-5 hover:bg-white/15 transition-all duration-300 cursor-pointer group animate-fade-in">
        {/* Thumbnail placeholder */}
        <div className="w-full h-40 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg mb-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
          <svg
            className="w-16 h-16 text-white/40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Video info */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white truncate group-hover:text-indigo-300 transition-colors">
            {video.title}
          </h3>

          {video.description && (
            <p className="text-sm text-white/70 line-clamp-2">
              {video.description}
            </p>
          )}

          <div className="flex items-center justify-between pt-2">
            <StatusBadge
              status={video.status}
              progress={video.processingProgress}
            />
            <span className="text-xs text-white/50">
              {formatFileSize(video.filesize)}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-white/50 pt-1">
            <span>{formatDate(video.uploadDate)}</span>
            <span className="truncate max-w-[150px]">
              {video.uploadedBy.email}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
