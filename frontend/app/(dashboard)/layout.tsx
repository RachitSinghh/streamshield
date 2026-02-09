"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/src/hooks/useAuth";
import { Button } from "@/src/components/common/Button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, logout, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="glass-nav sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-8">
              <Link
                href="/videos"
                className="text-2xl font-bold text-white hover:text-indigo-300 transition-colors"
              >
                🛡️ StreamShield
              </Link>

              {/* Navigation Links */}
              <div className="hidden md:flex items-center gap-4">
                <Link
                  href="/videos"
                  className="text-white/80 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-all"
                >
                  Videos
                </Link>
                <Link
                  href="/upload"
                  className="text-white/80 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-all"
                >
                  Upload
                </Link>
                {user?.role === "admin" && (
                  <Link
                    href="/admin"
                    className="text-white/80 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-all"
                  >
                    Admin
                  </Link>
                )}
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-white/90 text-sm font-medium">
                  {user?.email}
                </p>
                <p className="text-white/60 text-xs capitalize">{user?.role}</p>
              </div>
              <Button variant="secondary" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
