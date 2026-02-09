import apiClient from "./axios";

export interface Video {
  _id: string;
  title: string;
  description: string;
  filename: string;
  filepath: string;
  filesize: number;
  mimetype: string;
  uploadedBy: {
    _id: string;
    email: string;
    role?: string;
  };
  tenantId: string;
  status: "uploaded" | "processing" | "safe" | "flagged" | "failed";
  processingProgress: number;
  sensitivityScore?: number;
  uploadDate: string;
  processedDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VideosResponse {
  success: boolean;
  data: {
    videos: Video[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface VideoResponse {
  success: boolean;
  data: Video;
}

/**
 * Upload a video
 */
export const uploadVideo = async (
  file: File,
  title: string,
  description?: string,
  onProgress?: (progress: number) => void,
): Promise<VideoResponse> => {
  const formData = new FormData();
  formData.append("video", file);
  formData.append("title", title);
  if (description) {
    formData.append("description", description);
  }

  const response = await apiClient.post<VideoResponse>(
    "/videos/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          onProgress(percentCompleted);
        }
      },
    },
  );

  return response.data;
};

/**
 * Get all videos
 */
export const getVideos = async (
  status?: string,
  page: number = 1,
  limit: number = 10,
): Promise<VideosResponse> => {
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  const response = await apiClient.get<VideosResponse>(
    `/videos?${params.toString()}`,
  );
  return response.data;
};

/**
 * Get video by ID
 */
export const getVideoById = async (id: string): Promise<VideoResponse> => {
  const response = await apiClient.get<VideoResponse>(`/videos/${id}`);
  return response.data;
};

/**
 * Update video
 */
export const updateVideo = async (
  id: string,
  data: { title?: string; description?: string },
): Promise<VideoResponse> => {
  const response = await apiClient.patch<VideoResponse>(`/videos/${id}`, data);
  return response.data;
};

/**
 * Delete video
 */
export const deleteVideo = async (
  id: string,
): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.delete(`/videos/${id}`);
  return response.data;
};

/**
 * Get stream URL for video
 */
export const getStreamUrl = (id: string): string => {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return `${API_URL}/videos/${id}/stream${token ? `?token=${token}` : ""}`;
};
