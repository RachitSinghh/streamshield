import apiClient from "./axios";

export interface User {
  _id: string;
  email: string;
  role: "viewer" | "editor" | "admin";
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface UsersResponse {
  success: boolean;
  data: User[];
}

/**
 * Get all users (Admin only)
 */
export const getUsers = async (): Promise<UsersResponse> => {
  const response = await apiClient.get<UsersResponse>("/users");
  return response.data;
};

/**
 * Update user role (Admin only)
 */
export const updateUserRole = async (
  userId: string,
  role: "viewer" | "editor" | "admin",
): Promise<{ success: boolean; message: string; data: User }> => {
  const response = await apiClient.patch(`/users/${userId}/role`, { role });
  return response.data;
};
