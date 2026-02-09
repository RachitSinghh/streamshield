"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getVideos } from "@/src/api/video.api";
import { VideoCard } from "@/src/components/video/VideoCard";
import { Loader } from "@/src/components/common/Loader";
import type { Video } from "@/src/api/video.api";

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchVideos = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getVideos(statusFilter || undefined, page, 12);
      setVideos(response.data.videos);
      setTotalPages(response.data.pagination.pages);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load videos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [statusFilter, page]);

  return (
    <div className="space-y-6 animate-fade-in px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Video Library</h1>
          <p className="text-white/70">Manage and view all your videos</p>
        </div>
        <Link
          href="/upload"
          className="glass-button bg-indigo-500/30 hover:bg-indigo-500/40 text-white border-indigo-400/50 px-6 py-3 font-medium"
        >
          + Upload Video
        </Link>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-white/80 font-medium">Filter by status:</span>
          <button
            onClick={() => setStatusFilter("")}
            className={`px-4 py-2 rounded-lg transition-all ${
              statusFilter === ""
                ? "bg-white/30 text-white"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            All
          </button>
          {["uploaded", "processing", "safe", "flagged", "failed"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg transition-all capitalize ${
                  statusFilter === status
                    ? "bg-white/30 text-white"
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                }`}
              >
                {status}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader size="lg" message="Loading videos..." />
        </div>
      ) : error ? (
        <div className="glass-card p-8 text-center">
          <p className="text-red-300 mb-4">{error}</p>
          <button
            onClick={fetchVideos}
            className="glass-button bg-white/20 hover:bg-white/30 text-white px-6 py-2"
          >
            Try Again
          </button>
        </div>
      ) : videos.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="text-6xl mb-4">📹</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No videos found
          </h3>
          <p className="text-white/70 mb-6">
            {statusFilter
              ? `No videos with status "${statusFilter}"`
              : "Upload your first video to get started"}
          </p>
          <Link
            href="/upload"
            className="glass-button bg-indigo-500/30 hover:bg-indigo-500/40 text-white border-indigo-400/50 px-6 py-3 inline-block"
          >
            Upload Video
          </Link>
        </div>
      ) : (
        <>
          {/* Video Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="glass-button px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-white/80 px-4">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="glass-button px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
