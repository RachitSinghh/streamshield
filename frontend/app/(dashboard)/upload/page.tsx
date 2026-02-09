"use client";

import { useState, useRef, DragEvent } from "react";
import { useRouter } from "next/navigation";
import { uploadVideo } from "@/src/api/video.api";
import { Button } from "@/src/components/common/Button";

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    // Validate file type
    const validTypes = [
      "video/mp4",
      "video/webm",
      "video/ogg",
      "video/quicktime",
    ];
    if (!validTypes.includes(selectedFile.type)) {
      setError(
        "Invalid file type. Please upload a video file (MP4, WebM, OGG, MOV)",
      );
      return;
    }

    // Validate file size (100MB)
    const maxSize = 100 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setError("File too large. Maximum size is 100MB");
      return;
    }

    setFile(selectedFile);
    setError("");

    // Auto-fill title from filename
    if (!title) {
      const filename = selectedFile.name.replace(/\.[^/.]+$/, "");
      setTitle(filename);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a video file");
      return;
    }

    if (!title.trim()) {
      setError("Please enter a title");
      return;
    }

    setUploading(true);
    setError("");
    setUploadProgress(0);

    try {
      await uploadVideo(file, title, description || undefined, (progress) =>
        setUploadProgress(progress),
      );

      // Redirect to videos page
      router.push("/videos");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Upload failed. Please try again.",
      );
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in px-4">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Upload Video</h1>
        <p className="text-white/70">
          Upload a video for processing and moderation
        </p>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload Area */}
        <div className="glass-card p-8">
          <div
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
              dragActive
                ? "border-indigo-400 bg-indigo-500/10"
                : "border-white/30 hover:border-white/50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {file ? (
              <div className="space-y-4">
                <div className="text-6xl">🎬</div>
                <div>
                  <p className="text-white font-semibold text-lg">
                    {file.name}
                  </p>
                  <p className="text-white/60 text-sm">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-red-300 hover:text-red-200 text-sm underline"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-6xl">📤</div>
                <div>
                  <p className="text-white text-lg mb-2">
                    Drag and drop your video here
                  </p>
                  <p className="text-white/60 text-sm mb-4">or</p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="glass-button bg-indigo-500/30 hover:bg-indigo-500/40 text-white border-indigo-400/50 px-6 py-2"
                  >
                    Browse Files
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </div>
                <p className="text-white/50 text-xs">
                  Supported formats: MP4, WebM, OGG, MOV (Max 100MB)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Video Details */}
        {file && (
          <div className="glass-card p-6 space-y-4 animate-fade-in">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-white/90 mb-2"
              >
                Title *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="glass-input w-full px-4 py-2 text-white placeholder-white/50"
                placeholder="Enter video title"
                required
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-white/90 mb-2"
              >
                Description (Optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="glass-input w-full px-4 py-2 text-white placeholder-white/50 min-h-[100px]"
                placeholder="Enter video description"
                rows={4}
              />
            </div>
          </div>
        )}

        {/* Upload Progress */}
        {uploading && (
          <div className="glass-card p-6 animate-fade-in">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-white/80">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-white/60 text-sm text-center">
                Please don't close this page while uploading
              </p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        {file && !uploading && (
          <div className="flex gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push("/videos")}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              Upload Video
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
