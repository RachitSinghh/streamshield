"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getVideoById, deleteVideo, getStreamUrl } from "@/src/api/video.api";
import { useSocket } from "@/src/hooks/useSocket";
import { useAuth } from "@/src/hooks/useAuth";
import { StatusBadge } from "@/src/components/video/StatusBadge";
import { Loader } from "@/src/components/common/Loader";
import { Button } from "@/src/components/common/Button";
import { Modal } from "@/src/components/common/Modal";
import type { Video } from "@/src/api/video.api";

export default function VideoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { socket, connected } = useSocket();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const videoId = params.id as string;

  // Fetch video details
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await getVideoById(videoId);
        setVideo(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load video");
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoId]);

  // Socket.io real-time updates
  useEffect(() => {
    if (!socket || !connected) return;

    // Join video room
    socket.emit("join:video", videoId);

    // Listen for processing updates
    socket.on("processing:progress", (data) => {
      if (data.videoId === videoId) {
        setVideo((prev) =>
          prev
            ? {
                ...prev,
                processingProgress: data.progress,
                status: data.status,
              }
            : null,
        );
      }
    });

    socket.on("processing:complete", (data) => {
      if (data.videoId === videoId) {
        setVideo((prev) =>
          prev
            ? {
                ...prev,
                status: data.status,
                processingProgress: 100,
                sensitivityScore: data.sensitivityScore,
              }
            : null,
        );
      }
    });

    socket.on("processing:error", (data) => {
      if (data.videoId === videoId) {
        setVideo((prev) =>
          prev
            ? {
                ...prev,
                status: "failed",
                processingProgress: 0,
              }
            : null,
        );
      }
    });

    // Cleanup
    return () => {
      socket.emit("leave:video", videoId);
      socket.off("processing:progress");
      socket.off("processing:complete");
      socket.off("processing:error");
    };
  }, [socket, connected, videoId]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteVideo(videoId);
      router.push("/videos");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete video");
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const canEdit = user?.role === "admin" || video?.uploadedBy._id === user?.id;

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader size="lg" message="Loading video..." />
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-red-300 mb-4">{error || "Video not found"}</p>
        <Link
          href="/videos"
          className="glass-button bg-white/20 hover:bg-white/30 text-white px-6 py-2 inline-block"
        >
          Back to Videos
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in px-4">
      {/* Back Button */}
      <Link
        href="/videos"
        className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
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
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Videos
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Player */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card p-6">
            {video.status === "safe" ? (
              <video
                ref={videoRef}
                controls
                className="w-full rounded-lg"
                src={getStreamUrl(videoId)}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="aspect-video bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg flex flex-col items-center justify-center">
                <svg
                  className="w-24 h-24 text-white/40 mb-4"
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
                <p className="text-white/80 text-lg mb-2">
                  Video not available for streaming
                </p>
                <p className="text-white/60 text-sm">Status: {video.status}</p>
                {video.status === "processing" && (
                  <div className="mt-4 w-64">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${video.processingProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-white/70 text-sm text-center mt-2">
                      Processing: {video.processingProgress}%
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Video Info */}
          <div className="glass-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white mb-2">
                  {video.title}
                </h1>
                {video.description && (
                  <p className="text-white/70">{video.description}</p>
                )}
              </div>
              <StatusBadge
                status={video.status}
                progress={video.processingProgress}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-white/60">Uploaded by:</span>
                <p className="text-white font-medium">
                  {video.uploadedBy.email}
                </p>
              </div>
              <div>
                <span className="text-white/60">Upload date:</span>
                <p className="text-white font-medium">
                  {formatDate(video.uploadDate)}
                </p>
              </div>
              <div>
                <span className="text-white/60">File size:</span>
                <p className="text-white font-medium">
                  {formatFileSize(video.filesize)}
                </p>
              </div>
              <div>
                <span className="text-white/60">Format:</span>
                <p className="text-white font-medium">{video.mimetype}</p>
              </div>
              {video.sensitivityScore !== undefined && (
                <div>
                  <span className="text-white/60">Sensitivity score:</span>
                  <p className="text-white font-medium">
                    {video.sensitivityScore}/100
                  </p>
                </div>
              )}
              {video.processedDate && (
                <div>
                  <span className="text-white/60">Processed:</span>
                  <p className="text-white font-medium">
                    {formatDate(video.processedDate)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions Sidebar */}
        <div className="space-y-4">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
            <div className="space-y-3">
              {video.status === "safe" && (
                <a
                  href={getStreamUrl(videoId)}
                  download
                  className="glass-button w-full text-center bg-indigo-500/30 hover:bg-indigo-500/40 text-white border-indigo-400/50 px-4 py-2 block"
                >
                  Download Video
                </a>
              )}
              {canEdit && (
                <Button
                  variant="danger"
                  className="w-full"
                  onClick={() => setDeleteModalOpen(true)}
                >
                  Delete Video
                </Button>
              )}
            </div>
          </div>

          {/* Real-time Status */}
          {connected && (
            <div className="glass-card p-4">
              <div className="flex items-center gap-2 text-green-300">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm">Real-time updates active</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Video"
      >
        <p className="text-white/80 mb-6">
          Are you sure you want to delete "{video.title}"? This action cannot be
          undone.
        </p>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => setDeleteModalOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            loading={deleting}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
