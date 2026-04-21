"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Contact,
  Handshake,
  IndianRupee,
  TrendingUp,
  Users,
} from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { StatsCard } from "@/components/dashboard/stats-card";
import { api } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import { formatCurrency } from "@/lib/utils";
import type { DashboardReportResponse, DashboardSummary } from "@/types";

export default function DashboardPage() {
  const router = useRouter();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    const fetchDashboard = async () => {
      try {
        const response = await api.get<DashboardReportResponse>(
          "/reports/dashboard"
        );
        setSummary(response.data.data.summary);
      } catch {
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-slate-600">Loading dashboard...</p>
      </main>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1">
        <Topbar title="Dashboard" />

        <main className="p-6">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <StatsCard
              title="Total Leads"
              value={summary?.totalLeads ?? 0}
              icon={<Users className="h-5 w-5" />}
            />
            <StatsCard
              title="Total Clients"
              value={summary?.totalClients ?? 0}
              icon={<Contact className="h-5 w-5" />}
            />
            <StatsCard
              title="Total Properties"
              value={summary?.totalProperties ?? 0}
              icon={<Building2 className="h-5 w-5" />}
            />
            <StatsCard
              title="Total Deals"
              value={summary?.totalDeals ?? 0}
              icon={<Handshake className="h-5 w-5" />}
            />
            <StatsCard
              title="Closed Deals"
              value={summary?.closedDeals ?? 0}
              icon={<TrendingUp className="h-5 w-5" />}
            />
            <StatsCard
              title="Revenue"
              value={formatCurrency(summary?.totalRevenue ?? 0)}
              icon={<IndianRupee className="h-5 w-5" />}
            />
            <StatsCard
              title="Commission"
              value={formatCurrency(summary?.totalCommission ?? 0)}
              icon={<IndianRupee className="h-5 w-5" />}
            />
            <StatsCard
              title="Lead Conversion"
              value={`${summary?.leadConversionRate ?? 0}%`}
              icon={<TrendingUp className="h-5 w-5" />}
            />
          </div>
        </main>
      </div>
    </div>
  );
}