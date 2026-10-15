"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { useAppSelector } from "@/redux/hooks";

const items = [
  { href: "/pro", label: "Overview" },
  { href: "/pro/jobs", label: "Available jobs" },
  { href: "/pro/messages", label: "Messages" },
  { href: "/pro/notifications", label: "Notifications" },
  { href: "/pro/application", label: "Application" },
  { href: "/pro/verification", label: "Verification" },
  { href: "/pro/reviews", label: "Reviews" },
  { href: "/pro/pricing", label: "Membership" },
  { href: "/pro/profile", label: "Profile" },
  { href: "/pro/security", label: "Security" },
  { href: "/pro/password", label: "Password" },
];

export default function AgentDashboardLayout({
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
    if (user?.role === "homeowner") router.replace("/account");
  }, [hydrated, router, user]);

  if (!hydrated || !user || user.role !== "pro") return null;

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Navbar />
      <div className="container-site flex flex-1 flex-col items-stretch gap-4 py-4 pb-6 md:flex-row md:items-start md:gap-6 md:py-5">
        <DashboardSidebar items={items} />
        <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col">{children}</div>
      </div>
    </div>
  );
}
