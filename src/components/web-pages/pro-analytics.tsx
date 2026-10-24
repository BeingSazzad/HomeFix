"use client";

import { useState } from "react";
import {
  TrendingUp,
  Users,
  DollarSign,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  MapPin,
  Star,
  ArrowUpRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type YearlyMetrics = {
  totalRevenue: number;
  completedJobs: number;
  totalClients: number;
  repeatClients: number;
  avgTicket: number;
  growthRate: string;
  monthly: Array<{
    month: string;
    income: number;
    clients: number;
    jobs: number;
  }>;
};

export const yearlyData: Record<number, YearlyMetrics> = {
  2026: {
    totalRevenue: 38450,
    completedJobs: 45,
    totalClients: 38,
    repeatClients: 13,
    avgTicket: 854,
    growthRate: "+18.4%",
    monthly: [
      { month: "Jan", income: 2400, clients: 3, jobs: 3 },
      { month: "Feb", income: 2850, clients: 3, jobs: 4 },
      { month: "Mar", income: 3400, clients: 4, jobs: 4 },
      { month: "Apr", income: 3200, clients: 4, jobs: 4 },
      { month: "May", income: 4100, clients: 5, jobs: 5 },
      { month: "Jun", income: 4350, clients: 4, jobs: 5 },
      { month: "Jul", income: 4600, clients: 5, jobs: 5 },
      { month: "Aug", income: 5200, clients: 6, jobs: 6 },
      { month: "Sep", income: 3950, clients: 4, jobs: 4 },
      { month: "Oct", income: 3100, clients: 4, jobs: 3 },
      { month: "Nov", income: 1300, clients: 2, jobs: 2 },
      { month: "Dec", income: 0, clients: 0, jobs: 0 },
    ],
  },
  2025: {
    totalRevenue: 36200,
    completedJobs: 43,
    totalClients: 35,
    repeatClients: 10,
    avgTicket: 841,
    growthRate: "+24.8%",
    monthly: [
      { month: "Jan", income: 1900, clients: 2, jobs: 2 },
      { month: "Feb", income: 2200, clients: 3, jobs: 3 },
      { month: "Mar", income: 2700, clients: 3, jobs: 3 },
      { month: "Apr", income: 2800, clients: 3, jobs: 4 },
      { month: "May", income: 3400, clients: 4, jobs: 4 },
      { month: "Jun", income: 3900, clients: 4, jobs: 5 },
      { month: "Jul", income: 4200, clients: 5, jobs: 5 },
      { month: "Aug", income: 4500, clients: 5, jobs: 5 },
      { month: "Sep", income: 3300, clients: 3, jobs: 4 },
      { month: "Oct", income: 2800, clients: 3, jobs: 3 },
      { month: "Nov", income: 2400, clients: 3, jobs: 3 },
      { month: "Dec", income: 2100, clients: 2, jobs: 2 },
    ],
  },
  2024: {
    totalRevenue: 29000,
    completedJobs: 35,
    totalClients: 28,
    repeatClients: 6,
    avgTicket: 828,
    growthRate: "+31.2%",
    monthly: [
      { month: "Jan", income: 1200, clients: 2, jobs: 2 },
      { month: "Feb", income: 1500, clients: 2, jobs: 2 },
      { month: "Mar", income: 2100, clients: 2, jobs: 3 },
      { month: "Apr", income: 2300, clients: 3, jobs: 3 },
      { month: "May", income: 2800, clients: 3, jobs: 3 },
      { month: "Jun", income: 3200, clients: 4, jobs: 4 },
      { month: "Jul", income: 3600, clients: 4, jobs: 4 },
      { month: "Aug", income: 3900, clients: 4, jobs: 4 },
      { month: "Sep", income: 2700, clients: 3, jobs: 3 },
      { month: "Oct", income: 2200, clients: 3, jobs: 2 },
      { month: "Nov", income: 1800, clients: 2, jobs: 2 },
      { month: "Dec", income: 1700, clients: 2, jobs: 2 },
    ],
  },
};

const recentCompletedJobs = [
  {
    id: "comp-1",
    client: "Maya Chen",
    location: "Austin, 78701",
    service: "Kitchen Sink Leak & P-Trap Repair",
    date: "Oct 14, 2026",
    amount: "$280.00",
    rating: 5,
  },
  {
    id: "comp-2",
    client: "Jordan Hale",
    location: "Austin, 78745",
    service: "Emergency Pipe Pressure Diagnostics",
    date: "Sep 28, 2026",
    amount: "$450.00",
    rating: 4.8,
  },
  {
    id: "comp-3",
    client: "Elena Ruiz",
    location: "Austin, 78702",
    service: "Main Supply Line Resealing",
    date: "Sep 15, 2026",
    amount: "$320.00",
    rating: 5,
  },
  {
    id: "comp-4",
    client: "Sam Okonkwo",
    location: "Round Rock, 78664",
    service: "Water Heater Valve Replacement",
    date: "Aug 29, 2026",
    amount: "$520.00",
    rating: 5,
  },
  {
    id: "comp-5",
    client: "David Miller",
    location: "Austin, 78704",
    service: "Garbage Disposal Installation",
    date: "Aug 12, 2026",
    amount: "$240.00",
    rating: 5,
  },
];

type AnalyticsTab = "overview" | "revenue" | "jobs";

export function ProAnalytics() {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>("overview");
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [hoveredIncomeMonth, setHoveredIncomeMonth] = useState<number | null>(null);
  const [hoveredClientsMonth, setHoveredClientsMonth] = useState<number | null>(null);

  const activeData = yearlyData[selectedYear] ?? yearlyData[2026];

  const maxIncome = Math.max(...activeData.monthly.map((m) => m.income), 6000);
  const maxClients = Math.max(...activeData.monthly.map((m) => m.clients), 8);

  const activeIncomeItem =
    hoveredIncomeMonth !== null ? activeData.monthly[hoveredIncomeMonth] : null;
  const activeClientsItem =
    hoveredClientsMonth !== null ? activeData.monthly[hoveredClientsMonth] : null;

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. STANDARD SEGMENTED CONTROL TABS + UNIFIED PERIOD SELECTOR             */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line/70 pb-3">
        <div className="inline-flex rounded-xl bg-stone-100/80 p-1 border border-line/60">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={cn(
              "rounded-lg px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer",
              activeTab === "overview"
                ? "bg-white text-title shadow-2xs"
                : "text-stone-500 hover:text-title"
            )}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("revenue")}
            className={cn(
              "rounded-lg px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer",
              activeTab === "revenue"
                ? "bg-white text-title shadow-2xs"
                : "text-stone-500 hover:text-title"
            )}
          >
            Revenue Analytics
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("jobs")}
            className={cn(
              "rounded-lg px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer",
              activeTab === "jobs"
                ? "bg-white text-title shadow-2xs"
                : "text-stone-500 hover:text-title"
            )}
          >
            Jobs &amp; Clients
          </button>
        </div>

        {/* Unified Year / Period Selector */}
        <div className="flex items-center gap-2 self-start sm:self-auto rounded-xl border border-line bg-white px-3 py-1.5 shadow-2xs">
          <Calendar className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-medium text-muted">Period:</span>
          <select
            aria-label="Filter analytics by year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="cursor-pointer bg-transparent text-xs font-bold text-title outline-none focus:text-primary"
          >
            <option value={2026}>2026 (YTD)</option>
            <option value={2025}>2025</option>
            <option value={2024}>2024</option>
          </select>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. EXECUTIVE KPI CARDS (Always visible or shared)                         */}
      {/* ========================================================================= */}
      <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        {/* Card 1: Total Revenue */}
        <Card className="p-5 transition-all hover:border-primary/40 hover:shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
              Total Earnings ({selectedYear})
            </span>
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-blue-50 text-blue-600">
              <DollarSign className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-title">
              ${activeData.totalRevenue.toLocaleString()}
            </span>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600">
              <TrendingUp className="mr-0.5 h-3 w-3" />
              {activeData.growthRate}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-line/60 pt-2.5 text-xs text-muted">
            <span>Direct homeowner payments</span>
            <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[11px]">
              $0 Fee Paid
            </span>
          </div>
        </Card>

        {/* Card 2: Completed Jobs */}
        <Card className="p-5 transition-all hover:border-emerald-300 hover:shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
              Completed Jobs ({selectedYear})
            </span>
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-title">
              {activeData.completedJobs} Jobs
            </span>
            <span className="text-xs text-muted">All-time: 128</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-line/60 pt-2.5 text-xs text-muted">
            <span>Average ticket</span>
            <span className="font-semibold text-title text-xs">
              ${activeData.avgTicket} / job
            </span>
          </div>
        </Card>

        {/* Card 3: Total Clients */}
        <Card className="p-5 transition-all hover:border-amber-300 hover:shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
              Total Clients ({selectedYear})
            </span>
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-amber-50 text-amber-600">
              <Users className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-title">
              {activeData.totalClients} Clients
            </span>
            <span className="inline-flex items-center rounded-md bg-amber-50 px-1.5 py-0.5 text-[11px] font-semibold text-amber-700">
              {activeData.repeatClients} Repeat
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-line/60 pt-2.5 text-xs text-muted">
            <span>Repeat rate</span>
            <span className="font-semibold text-title text-xs">
              {Math.round((activeData.repeatClients / activeData.totalClients) * 100)}% Returning
            </span>
          </div>
        </Card>

        {/* Card 4: Pro Rating & Clearance */}
        <Card className="p-5 transition-all hover:border-purple-300 hover:shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
              Reputation &amp; Trust
            </span>
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-purple-50 text-purple-600">
              <ShieldCheck className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-title flex items-center gap-1">
              4.8 <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
            </span>
            <span className="text-xs text-muted">36 Verified reviews</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-line/60 pt-2.5 text-xs text-muted">
            <span>Austin Clearance</span>
            <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[11px]">
              Licensed &amp; Insured
            </span>
          </div>
        </Card>
      </div>

      {/* ========================================================================= */}
      {/* 3. TAB 1: OVERVIEW (Dual Visual Trends + Recent Jobs Table)              */}
      {/* ========================================================================= */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Income Trend Chart */}
            <Card className="p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line/70 pb-3.5">
                <div>
                  <h2 className="font-display text-base font-bold text-title flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    Monthly Income Overview
                  </h2>
                  <p className="mt-0.5 text-xs text-muted">
                    Annual revenue breakdown • 100% direct payouts
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-muted">Yearly: </span>
                  <span className="font-display text-sm font-bold text-title">
                    ${activeData.totalRevenue.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Chart Graphics */}
              <div className="mt-5">
                <div className="relative h-48 w-full">
                  {activeIncomeItem ? (
                    <div className="absolute top-0 right-0 z-10 flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs font-semibold text-primary">
                      <span>{activeIncomeItem.month} {selectedYear}:</span>
                      <span>${activeIncomeItem.income.toLocaleString()}</span>
                      <span className="text-muted">•</span>
                      <span>{activeIncomeItem.jobs} jobs</span>
                    </div>
                  ) : null}

                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                    <div className="border-b border-dashed border-line text-[10px] text-muted">$5,000</div>
                    <div className="border-b border-dashed border-line text-[10px] text-muted">$3,500</div>
                    <div className="border-b border-dashed border-line text-[10px] text-muted">$2,000</div>
                    <div className="border-b border-line text-[10px] text-muted">$0</div>
                  </div>

                  {/* Bars */}
                  <div className="absolute inset-x-0 bottom-0 top-5 flex items-end justify-between gap-1 sm:gap-2 px-1">
                    {activeData.monthly.map((item, idx) => {
                      const heightPercent = Math.max((item.income / maxIncome) * 100, 3);
                      const isHovered = hoveredIncomeMonth === idx;
                      const isPeak = item.income === Math.max(...activeData.monthly.map((m) => m.income));

                      return (
                        <div
                          key={item.month}
                          className="group relative flex h-full flex-1 flex-col items-center justify-end cursor-pointer"
                          onMouseEnter={() => setHoveredIncomeMonth(idx)}
                          onMouseLeave={() => setHoveredIncomeMonth(null)}
                        >
                          <div
                            style={{ height: `${heightPercent}%` }}
                            className={cn(
                              "w-full max-w-[24px] sm:max-w-[28px] rounded-t-lg transition-all duration-200",
                              isHovered
                                ? "bg-primary shadow-sm scale-y-105"
                                : isPeak
                                ? "bg-primary"
                                : item.income > 0
                                ? "bg-primary/80 hover:bg-primary"
                                : "bg-line/50"
                            )}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* X-axis */}
                <div className="mt-3 flex justify-between px-1 text-[11px] font-medium text-muted">
                  {activeData.monthly.map((item, idx) => (
                    <span
                      key={item.month}
                      className={cn(
                        "flex-1 text-center transition-colors",
                        hoveredIncomeMonth === idx && "font-bold text-primary"
                      )}
                    >
                      {item.month}
                    </span>
                  ))}
                </div>
              </div>
            </Card>

            {/* Clients & Work Volume Chart */}
            <Card className="p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line/70 pb-3.5">
                <div>
                  <h2 className="font-display text-base font-bold text-title flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Clients &amp; Work Volume
                  </h2>
                  <p className="mt-0.5 text-xs text-muted">
                    Unique clients served &amp; job completion pace
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-muted">Total: </span>
                  <span className="font-display text-sm font-bold text-title">
                    {activeData.totalClients} Clients
                  </span>
                </div>
              </div>

              {/* Chart Graphics */}
              <div className="mt-5">
                <div className="relative h-48 w-full">
                  {activeClientsItem ? (
                    <div className="absolute top-0 right-0 z-10 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                      <span>{activeClientsItem.month} {selectedYear}:</span>
                      <span>{activeClientsItem.clients} clients</span>
                      <span className="text-muted">•</span>
                      <span>{activeClientsItem.jobs} jobs</span>
                    </div>
                  ) : null}

                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                    <div className="border-b border-dashed border-line text-[10px] text-muted">8 Clients</div>
                    <div className="border-b border-dashed border-line text-[10px] text-muted">5 Clients</div>
                    <div className="border-b border-dashed border-line text-[10px] text-muted">3 Clients</div>
                    <div className="border-b border-line text-[10px] text-muted">0</div>
                  </div>

                  {/* Bars */}
                  <div className="absolute inset-x-0 bottom-0 top-5 flex items-end justify-between gap-1 sm:gap-2 px-1">
                    {activeData.monthly.map((item, idx) => {
                      const heightPercent = Math.max((item.clients / maxClients) * 100, 3);
                      const isHovered = hoveredClientsMonth === idx;
                      const isPeak = item.clients === Math.max(...activeData.monthly.map((m) => m.clients));

                      return (
                        <div
                          key={item.month}
                          className="group relative flex h-full flex-1 flex-col items-center justify-end cursor-pointer"
                          onMouseEnter={() => setHoveredClientsMonth(idx)}
                          onMouseLeave={() => setHoveredClientsMonth(null)}
                        >
                          <div
                            style={{ height: `${heightPercent}%` }}
                            className={cn(
                              "w-full max-w-[24px] sm:max-w-[28px] rounded-t-lg transition-all duration-200",
                              isHovered
                                ? "bg-emerald-600 shadow-sm scale-y-105"
                                : isPeak
                                ? "bg-emerald-600"
                                : item.clients > 0
                                ? "bg-emerald-500/80 hover:bg-emerald-600"
                                : "bg-line/50"
                            )}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* X-axis */}
                <div className="mt-3 flex justify-between px-1 text-[11px] font-medium text-muted">
                  {activeData.monthly.map((item, idx) => (
                    <span
                      key={item.month}
                      className={cn(
                        "flex-1 text-center transition-colors",
                        hoveredClientsMonth === idx && "font-bold text-emerald-700"
                      )}
                    >
                      {item.month}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Completed Jobs Table */}
          <Card className="p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line/70 pb-4">
              <div>
                <h2 className="font-display text-base font-bold text-title">
                  Recent Completed Jobs &amp; Payouts
                </h2>
                <p className="mt-0.5 text-xs text-muted">
                  Homeowners paid you directly upon 100% job satisfaction ($0 middleman fee).
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab("jobs")}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
              >
                View all jobs ({activeData.completedJobs}) <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-line/70 text-muted uppercase tracking-wider text-[11px]">
                    <th className="py-2.5 font-semibold">Client &amp; Location</th>
                    <th className="py-2.5 font-semibold">Service Performed</th>
                    <th className="py-2.5 font-semibold">Date</th>
                    <th className="py-2.5 font-semibold">Direct Payout</th>
                    <th className="py-2.5 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/60">
                  {recentCompletedJobs.slice(0, 4).map((job) => (
                    <tr key={job.id} className="hover:bg-smoke/50 transition-colors">
                      <td className="py-3">
                        <p className="font-semibold text-title">{job.client}</p>
                        <p className="text-[11px] text-muted flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3" />
                          {job.location}
                        </p>
                      </td>
                      <td className="py-3 font-medium text-title">{job.service}</td>
                      <td className="py-3 text-muted">{job.date}</td>
                      <td className="py-3 font-display font-bold text-title text-sm">{job.amount}</td>
                      <td className="py-3 text-right">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Paid Direct
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. TAB 2: REVENUE ANALYTICS (Deep Dive Breakdown & Direct Payout Terms) */}
      {/* ========================================================================= */}
      {activeTab === "revenue" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <Card className="p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line/70 pb-4">
              <div>
                <h2 className="font-display text-base font-bold text-title">
                  Revenue Breakdown &amp; Monthly Performance ({selectedYear})
                </h2>
                <p className="mt-0.5 text-xs text-muted">
                  Itemized view of income, completed jobs, and average earnings per job.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-800">
                  Year Total: ${activeData.totalRevenue.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-line/70 text-muted uppercase tracking-wider text-[11px]">
                    <th className="py-2.5 font-semibold">Month</th>
                    <th className="py-2.5 font-semibold">Monthly Income</th>
                    <th className="py-2.5 font-semibold">Jobs Completed</th>
                    <th className="py-2.5 font-semibold">Avg Ticket</th>
                    <th className="py-2.5 font-semibold text-right">% of Annual Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/60">
                  {activeData.monthly.map((m) => {
                    const avgPerJob = m.jobs > 0 ? Math.round(m.income / m.jobs) : 0;
                    const pctOfTotal = activeData.totalRevenue > 0
                      ? Math.round((m.income / activeData.totalRevenue) * 100)
                      : 0;

                    return (
                      <tr key={m.month} className="hover:bg-smoke/50 transition-colors">
                        <td className="py-3 font-semibold text-title">{m.month} {selectedYear}</td>
                        <td className="py-3 font-display font-bold text-title text-sm">
                          ${m.income.toLocaleString()}
                        </td>
                        <td className="py-3 text-stone-700">{m.jobs} jobs</td>
                        <td className="py-3 text-stone-700">
                          {avgPerJob > 0 ? `$${avgPerJob}` : "—"}
                        </td>
                        <td className="py-3 text-right">
                          <span className="font-semibold text-stone-600">{pctOfTotal}%</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Direct Payout Model Reassurance */}
          <div className="rounded-2xl border border-blue-200/80 bg-gradient-to-r from-blue-50/70 via-primary/[0.03] to-surface p-4 sm:p-5 flex items-start gap-3.5 shadow-2xs">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-xs">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="text-xs">
              <p className="font-bold text-title text-sm">
                100% Direct Payout Advantage
              </p>
              <p className="text-muted mt-1 leading-relaxed">
                LocalHomeFix does not hold your payments or take percentage cuts from your invoices. Homeowners pay you directly via credit card, check, or cash upon 100% job completion.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. TAB 3: JOBS & CLIENTS (Complete Job Ledger & Retention Analysis)      */}
      {/* ========================================================================= */}
      {activeTab === "jobs" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <Card className="p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line/70 pb-4">
              <div>
                <h2 className="font-display text-base font-bold text-title">
                  All Completed Jobs &amp; Client Ledger ({selectedYear})
                </h2>
                <p className="mt-0.5 text-xs text-muted">
                  Full historical records of client requests, ratings received, and payouts.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-800">
                  {activeData.completedJobs} Total Completed
                </span>
              </div>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-line/70 text-muted uppercase tracking-wider text-[11px]">
                    <th className="py-2.5 font-semibold">Client Name</th>
                    <th className="py-2.5 font-semibold">Location</th>
                    <th className="py-2.5 font-semibold">Service Details</th>
                    <th className="py-2.5 font-semibold">Completion Date</th>
                    <th className="py-2.5 font-semibold">Rating</th>
                    <th className="py-2.5 font-semibold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/60">
                  {recentCompletedJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-smoke/50 transition-colors">
                      <td className="py-3 font-semibold text-title">{job.client}</td>
                      <td className="py-3 text-muted">{job.location}</td>
                      <td className="py-3 font-medium text-stone-700">{job.service}</td>
                      <td className="py-3 text-muted">{job.date}</td>
                      <td className="py-3">
                        <span className="inline-flex items-center gap-0.5 font-semibold text-title">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                          {job.rating}
                        </span>
                      </td>
                      <td className="py-3 text-right font-display font-bold text-title text-sm">
                        {job.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Retention Stats Card */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="p-4 border-line/80">
              <span className="block text-[11px] font-semibold text-muted uppercase">Repeat Homeowners</span>
              <span className="font-display text-2xl font-bold text-title mt-1 block">
                {activeData.repeatClients}
              </span>
              <span className="text-xs text-muted mt-1 block">
                Satisfied returning clients
              </span>
            </Card>
            <Card className="p-4 border-line/80">
              <span className="block text-[11px] font-semibold text-muted uppercase">Repeat Rate</span>
              <span className="font-display text-2xl font-bold text-emerald-600 mt-1 block">
                {Math.round((activeData.repeatClients / activeData.totalClients) * 100)}%
              </span>
              <span className="text-xs text-muted mt-1 block">
                Well above industry avg (18%)
              </span>
            </Card>
            <Card className="p-4 border-line/80">
              <span className="block text-[11px] font-semibold text-muted uppercase">Average Rating</span>
              <span className="font-display text-2xl font-bold text-title mt-1 flex items-center gap-1">
                4.8 <Star className="h-5 w-5 fill-amber-400 text-amber-500" />
              </span>
              <span className="text-xs text-muted mt-1 block">
                36 verified reviews
              </span>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
