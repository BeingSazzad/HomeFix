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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
];

export function ProAnalytics() {
  const [incomeYear, setIncomeYear] = useState<number>(2026);
  const [clientsYear, setClientsYear] = useState<number>(2026);
  const [hoveredIncomeMonth, setHoveredIncomeMonth] = useState<number | null>(null);
  const [hoveredClientsMonth, setHoveredClientsMonth] = useState<number | null>(null);

  const incomeData = yearlyData[incomeYear] ?? yearlyData[2026];
  const clientsData = yearlyData[clientsYear] ?? yearlyData[2026];

  const maxIncome = Math.max(...incomeData.monthly.map((m) => m.income), 6000);
  const maxClients = Math.max(...clientsData.monthly.map((m) => m.clients), 8);

  const activeIncomeItem =
    hoveredIncomeMonth !== null ? incomeData.monthly[hoveredIncomeMonth] : null;
  const activeClientsItem =
    hoveredClientsMonth !== null ? clientsData.monthly[hoveredClientsMonth] : null;

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. EXECUTIVE KPI SUMMARY CARDS                                            */}
      {/* ========================================================================= */}
      <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        {/* Card 1: Total Revenue */}
        <Card className="relative overflow-hidden p-5 sm:p-6 transition-all hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
              Total Earnings ({incomeYear})
            </span>
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary/10 text-primary">
              <DollarSign className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-title">
              ${incomeData.totalRevenue.toLocaleString()}
            </span>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600">
              <TrendingUp className="mr-0.5 h-3 w-3" />
              {incomeData.growthRate}
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
        <Card className="relative overflow-hidden p-5 sm:p-6 transition-all hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
              Completed Jobs ({incomeYear})
            </span>
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-title">
              {incomeData.completedJobs} Jobs
            </span>
            <span className="text-xs text-muted">All-time: 128</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-line/60 pt-2.5 text-xs text-muted">
            <span>Average ticket</span>
            <span className="font-semibold text-title font-display text-xs">
              ${incomeData.avgTicket} / job
            </span>
          </div>
        </Card>

        {/* Card 3: Total Clients */}
        <Card className="relative overflow-hidden p-5 sm:p-6 transition-all hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
              Total Clients ({clientsYear})
            </span>
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-amber-50 text-amber-600">
              <Users className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-title">
              {clientsData.totalClients} Clients
            </span>
            <span className="inline-flex items-center rounded-md bg-amber-50 px-1.5 py-0.5 text-[11px] font-semibold text-amber-700">
              {clientsData.repeatClients} Repeat
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-line/60 pt-2.5 text-xs text-muted">
            <span>Repeat rate</span>
            <span className="font-semibold text-title font-display text-xs">
              {Math.round((clientsData.repeatClients / clientsData.totalClients) * 100)}% Returning
            </span>
          </div>
        </Card>

        {/* Card 4: Pro Rating & Clearance */}
        <Card className="relative overflow-hidden p-5 sm:p-6 transition-all hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
              Reputation & Trust
            </span>
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-title">
              4.8 ★
            </span>
            <span className="text-xs text-muted">36 Verified reviews</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-line/60 pt-2.5 text-xs text-muted">
            <span>Austin Clearance</span>
            <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[11px]">
              Licensed & Insured
            </span>
          </div>
        </Card>
      </div>

      {/* ========================================================================= */}
      {/* 2. THE TWO ESSENTIAL CHARTS (INCOME & CLIENTS) WITH YEAR FILTERS          */}
      {/* ========================================================================= */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* CHART 1: MONTHLY INCOME GRAPH */}
        <Card className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line/70 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary">
                  <DollarSign className="h-4 w-4" />
                </span>
                <h2 className="font-display text-lg font-semibold tracking-tight text-title">
                  Total Income Overview
                </h2>
              </div>
              <p className="mt-1 text-xs text-[#757575]">
                Annual revenue breakdown by month • 100% direct payouts
              </p>
            </div>

            {/* TOP-RIGHT YEAR FILTER */}
            <div className="flex items-center gap-2 rounded-xl border border-line bg-surface/80 px-3 py-1.5 shadow-xs">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium text-muted">Year:</span>
              <select
                aria-label="Filter income by year"
                value={incomeYear}
                onChange={(e) => setIncomeYear(Number(e.target.value))}
                className="cursor-pointer bg-transparent font-display text-xs font-bold text-title outline-none focus:text-primary"
              >
                <option value={2026}>2026</option>
                <option value={2025}>2025</option>
                <option value={2024}>2024</option>
              </select>
            </div>
          </div>

          {/* Quick Stats Header for Income */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-smoke/60 px-4 py-2.5 text-xs">
            <div>
              <span className="text-muted">Yearly Total: </span>
              <span className="font-display font-bold text-title text-sm">
                ${incomeData.totalRevenue.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-muted">Monthly Avg: </span>
              <span className="font-display font-bold text-title text-sm">
                ${Math.round(incomeData.totalRevenue / 12).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-muted">Peak Month: </span>
              <span className="font-display font-bold text-primary text-sm">
                Aug (${Math.max(...incomeData.monthly.map((m) => m.income)).toLocaleString()})
              </span>
            </div>
          </div>

          {/* Chart Graphic Area */}
          <div className="mt-6">
            <div className="relative h-56 w-full">
              {/* Active hover info tooltip banner */}
              {activeIncomeItem ? (
                <div className="absolute top-0 right-0 z-10 flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary shadow-xs animate-in fade-in duration-150">
                  <span className="font-bold">{activeIncomeItem.month} {incomeYear}:</span>
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

              {/* Bars container */}
              <div className="absolute inset-x-0 bottom-0 top-5 flex items-end justify-between gap-1 sm:gap-2 px-1">
                {incomeData.monthly.map((item, idx) => {
                  const heightPercent = Math.max((item.income / maxIncome) * 100, 3);
                  const isHovered = hoveredIncomeMonth === idx;
                  const isPeak = item.income === Math.max(...incomeData.monthly.map((m) => m.income));

                  return (
                    <div
                      key={item.month}
                      className="group relative flex h-full flex-1 flex-col items-center justify-end"
                      onMouseEnter={() => setHoveredIncomeMonth(idx)}
                      onMouseLeave={() => setHoveredIncomeMonth(null)}
                    >
                      {/* Bar Pillar */}
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full max-w-[28px] rounded-t-lg transition-all duration-300 ${
                          isHovered
                            ? "bg-primary shadow-[0_0_12px_rgba(24,90,219,0.35)] scale-y-105"
                            : isPeak
                            ? "bg-primary"
                            : item.income > 0
                            ? "bg-primary/80 hover:bg-primary"
                            : "bg-line/60"
                        }`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* X-Axis Month Labels */}
            <div className="mt-3 flex justify-between px-1 text-[11px] font-medium text-muted">
              {incomeData.monthly.map((item, idx) => (
                <span
                  key={item.month}
                  className={`flex-1 text-center transition-colors ${
                    hoveredIncomeMonth === idx ? "font-bold text-primary" : ""
                  }`}
                >
                  {item.month}
                </span>
              ))}
            </div>
          </div>
        </Card>

        {/* CHART 2: TOTAL CLIENTS GRAPH */}
        <Card className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line/70 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
                  <Users className="h-4 w-4" />
                </span>
                <h2 className="font-display text-lg font-semibold tracking-tight text-title">
                  Total Clients & Work Volume
                </h2>
              </div>
              <p className="mt-1 text-xs text-[#757575]">
                Monthly unique homeowners served and completed requests
              </p>
            </div>

            {/* TOP-RIGHT YEAR FILTER */}
            <div className="flex items-center gap-2 rounded-xl border border-line bg-surface/80 px-3 py-1.5 shadow-xs">
              <Calendar className="h-3.5 w-3.5 text-emerald-600" />
              <span className="text-xs font-medium text-muted">Year:</span>
              <select
                aria-label="Filter clients by year"
                value={clientsYear}
                onChange={(e) => setClientsYear(Number(e.target.value))}
                className="cursor-pointer bg-transparent font-display text-xs font-bold text-title outline-none focus:text-emerald-700"
              >
                <option value={2026}>2026</option>
                <option value={2025}>2025</option>
                <option value={2024}>2024</option>
              </select>
            </div>
          </div>

          {/* Quick Stats Header for Clients */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-smoke/60 px-4 py-2.5 text-xs">
            <div>
              <span className="text-muted">Total Clients: </span>
              <span className="font-display font-bold text-title text-sm">
                {clientsData.totalClients} Unique
              </span>
            </div>
            <div>
              <span className="text-muted">Total Jobs: </span>
              <span className="font-display font-bold text-title text-sm">
                {clientsData.completedJobs} Completed
              </span>
            </div>
            <div>
              <span className="text-muted">Repeat Rate: </span>
              <span className="font-display font-bold text-emerald-700 text-sm">
                {Math.round((clientsData.repeatClients / clientsData.totalClients) * 100)}%
              </span>
            </div>
          </div>

          {/* Chart Graphic Area */}
          <div className="mt-6">
            <div className="relative h-56 w-full">
              {/* Active hover info tooltip banner */}
              {activeClientsItem ? (
                <div className="absolute top-0 right-0 z-10 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800 shadow-xs animate-in fade-in duration-150">
                  <span className="font-bold">{activeClientsItem.month} {clientsYear}:</span>
                  <span>{activeClientsItem.clients} clients served</span>
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

              {/* Bars container */}
              <div className="absolute inset-x-0 bottom-0 top-5 flex items-end justify-between gap-1 sm:gap-2 px-1">
                {clientsData.monthly.map((item, idx) => {
                  const heightPercent = Math.max((item.clients / maxClients) * 100, 3);
                  const isHovered = hoveredClientsMonth === idx;
                  const isPeak = item.clients === Math.max(...clientsData.monthly.map((m) => m.clients));

                  return (
                    <div
                      key={item.month}
                      className="group relative flex h-full flex-1 flex-col items-center justify-end"
                      onMouseEnter={() => setHoveredClientsMonth(idx)}
                      onMouseLeave={() => setHoveredClientsMonth(null)}
                    >
                      {/* Bar Pillar */}
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full max-w-[28px] rounded-t-lg transition-all duration-300 ${
                          isHovered
                            ? "bg-emerald-600 shadow-[0_0_12px_rgba(5,150,105,0.35)] scale-y-105"
                            : isPeak
                            ? "bg-emerald-600"
                            : item.clients > 0
                            ? "bg-emerald-500/80 hover:bg-emerald-600"
                            : "bg-line/60"
                        }`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* X-Axis Month Labels */}
            <div className="mt-3 flex justify-between px-1 text-[11px] font-medium text-muted">
              {clientsData.monthly.map((item, idx) => (
                <span
                  key={item.month}
                  className={`flex-1 text-center transition-colors ${
                    hoveredClientsMonth === idx ? "font-bold text-emerald-700" : ""
                  }`}
                >
                  {item.month}
                </span>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* ========================================================================= */}
      {/* 3. RECENT COMPLETED CLIENT JOBS & DIRECT PAYOUTS LEDGER                  */}
      {/* ========================================================================= */}
      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line/70 pb-4">
          <div>
            <h2 className="font-display text-lg font-semibold tracking-tight text-title">
              Recent Completed Jobs & Payouts
            </h2>
            <p className="mt-1 text-xs text-[#757575]">
              Homeowners paid you directly upon 100% job satisfaction ($0 middleman cut).
            </p>
          </div>
          <Button
            href="/pro/jobs"
            variant="ghost"
            size="sm"
            className="text-xs font-semibold"
          >
            Find more jobs ↗
          </Button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-line/70 text-muted uppercase tracking-wider text-[11px]">
                <th className="py-2.5 font-medium">Client & Location</th>
                <th className="py-2.5 font-medium">Service Performed</th>
                <th className="py-2.5 font-medium">Completed Date</th>
                <th className="py-2.5 font-medium">Direct Payout</th>
                <th className="py-2.5 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {recentCompletedJobs.map((job) => (
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
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Paid 100% Direct
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
