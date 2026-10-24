"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { loginHref } from "@/lib/role-access";
import { useAppSelector } from "@/redux/hooks";

const items = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/applications", label: "Applications" },
  { href: "/admin/professionals", label: "Professionals" },
  { href: "/admin/requests", label: "Requests" },
  { href: "/admin/disputes", label: "Disputes" },
  { href: "/admin/members", label: "Memberships" },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAppSelector((state) => state.auth.user);
  const hydrated = useAppSelector((state) => state.auth.hydrated);
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      router.replace(loginHref({ role: "admin", next: "/admin" }));
      return;
    }
    if (user.role === "homeowner") router.replace("/account");
    if (user.role === "pro") router.replace("/pro");
  }, [hydrated, router, user]);

  if (!hydrated || !user || user.role !== "admin") return null;

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Navbar />
      <div className="container-site flex flex-1 flex-col items-stretch gap-6 pt-6 pb-12 md:flex-row md:items-start md:gap-8 md:pt-8 md:pb-16">
        <DashboardSidebar items={items} />
        <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col">{children}</div>
      </div>
    </div>
  );
}
