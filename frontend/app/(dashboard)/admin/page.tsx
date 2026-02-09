"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";
import { getUsers, updateUserRole } from "@/src/api/user.api";
import { Loader } from "@/src/components/common/Loader";
import { Button } from "@/src/components/common/Button";
import type { User } from "@/src/api/user.api";

export default function AdminPage() {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  // Check if user is admin
  useEffect(() => {
    if (currentUser && currentUser.role !== "admin") {
      router.push("/videos");
    }
  }, [currentUser, router]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        setUsers(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.role === "admin") {
      fetchUsers();
    }
  }, [currentUser]);

  const handleRoleChange = async (
    userId: string,
    newRole: "viewer" | "editor" | "admin",
  ) => {
    setUpdatingUserId(userId);
    try {
      await updateUserRole(userId, newRole);

      // Update local state
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u)),
      );
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update user role");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-500/20 text-purple-100 border-purple-400/30";
      case "editor":
        return "bg-blue-500/20 text-blue-100 border-blue-400/30";
      case "viewer":
        return "bg-gray-500/20 text-gray-100 border-gray-400/30";
      default:
        return "bg-white/20 text-white border-white/30";
    }
  };

  if (currentUser?.role !== "admin") {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader size="lg" message="Loading users..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in px-4">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
        <p className="text-white/70">Manage user roles and permissions</p>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-6">
          <div className="text-white/60 text-sm mb-1">Total Users</div>
          <div className="text-3xl font-bold text-white">{users.length}</div>
        </div>
        <div className="glass-card p-6">
          <div className="text-white/60 text-sm mb-1">Admins</div>
          <div className="text-3xl font-bold text-purple-300">
            {users.filter((u) => u.role === "admin").length}
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="text-white/60 text-sm mb-1">Editors</div>
          <div className="text-3xl font-bold text-blue-300">
            {users.filter((u) => u.role === "editor").length}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">
                  Joined
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">
                        {user.email}
                      </span>
                      {user._id === currentUser?.id && (
                        <span className="text-xs bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded">
                          You
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRoleBadgeColor(
                        user.role,
                      )}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white/70 text-sm">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    {user._id !== currentUser?.id && (
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(
                            user._id,
                            e.target.value as "viewer" | "editor" | "admin",
                          )
                        }
                        disabled={updatingUserId === user._id}
                        className="glass-input px-3 py-1 text-sm text-white disabled:opacity-50"
                      >
                        <option value="viewer">Viewer</option>
                        <option value="editor">Editor</option>
                        <option value="admin">Admin</option>
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {users.length === 0 && (
        <div className="glass-card p-12 text-center">
          <p className="text-white/70">No users found</p>
        </div>
      )}
    </div>
  );
}
