"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { useAppSelector } from "@/redux/hooks";

const items = [
  { href: "/account", label: "Requests" },
  { href: "/account/post-job", label: "Post a request" },
  { href: "/account/messages", label: "Messages" },
  { href: "/account/profile", label: "Profile" },
  { href: "/account/password", label: "Password" },
];

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAppSelector((state) => state.auth.user);
  const hydrated = useAppSelector((state) => state.auth.hydrated);
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;
    if (!user) router.replace("/login");
    if (user?.role === "pro") router.replace("/pro");
  }, [hydrated, router, user]);

  if (!hydrated || !user || user.role !== "homeowner") return null;

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Navbar />
      <div className="container-site flex flex-1 flex-col gap-6 py-8 md:flex-row">
        <DashboardSidebar items={items} />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
      <Footer />
    </div>
  );
}
