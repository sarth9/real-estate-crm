"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BarChart3, RefreshCcw } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { StatsCard } from "@/components/dashboard/stats-card";
import { api } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import { formatCurrency } from "@/lib/utils";
import type {
  AgentPerformanceItem,
  AgentPerformanceReportResponse,
  DashboardReportResponse,
  DashboardSummary,
  LeadReportResponse,
  SalesReportResponse,
} from "@/types";

export default function ReportsPage() {
  const router = useRouter();

  const [dashboardSummary, setDashboardSummary] =
    useState<DashboardSummary | null>(null);
  const [leadBreakdown, setLeadBreakdown] = useState<
    LeadReportResponse["data"]["breakdown"]
  >([]);
  const [salesData, setSalesData] = useState<SalesReportResponse["data"] | null>(
    null
  );
  const [agents, setAgents] = useState<AgentPerformanceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReports = async () => {
    setError("");

    try {
      const [dashboardRes, leadsRes, salesRes, agentsRes] = await Promise.all([
        api.get<DashboardReportResponse>("/reports/dashboard"),
        api.get<LeadReportResponse>("/reports/leads"),
        api.get<SalesReportResponse>("/reports/sales"),
        api.get<AgentPerformanceReportResponse>("/reports/agents"),
      ]);

      setDashboardSummary(dashboardRes.data.data.summary);
      setLeadBreakdown(leadsRes.data.data.breakdown);
      setSalesData(salesRes.data.data);
      setAgents(agentsRes.data.data);
    } catch {
      setError("Failed to fetch reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    const loadReports = async () => {
      try {
        const [dashboardRes, leadsRes, salesRes, agentsRes] = await Promise.all([
          api.get<DashboardReportResponse>("/reports/dashboard"),
          api.get<LeadReportResponse>("/reports/leads"),
          api.get<SalesReportResponse>("/reports/sales"),
          api.get<AgentPerformanceReportResponse>("/reports/agents"),
        ]);

        setDashboardSummary(dashboardRes.data.data.summary);
        setLeadBreakdown(leadsRes.data.data.breakdown);
        setSalesData(salesRes.data.data);
        setAgents(agentsRes.data.data);
      } catch {
        setError("Failed to fetch reports.");
      } finally {
        setLoading(false);
      }
    };

    void loadReports();
  }, [router]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1">
        <Topbar title="Reports" />

        <main className="space-y-6 p-6">
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-slate-700" />
                <h2 className="text-lg font-semibold text-slate-900">
                  Reports Overview
                </h2>
              </div>

              <button
                onClick={() => {
                  setLoading(true);
                  void fetchReports();
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <RefreshCcw className="h-4 w-4" />
                Refresh
              </button>
            </div>

            {error ? (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            ) : null}

            {loading ? (
              <p className="text-slate-500">Loading reports...</p>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                <StatsCard
                  title="Total Leads"
                  value={dashboardSummary?.totalLeads ?? 0}
                  icon={<BarChart3 className="h-5 w-5" />}
                />
                <StatsCard
                  title="Closed Deals"
                  value={dashboardSummary?.closedDeals ?? 0}
                  icon={<BarChart3 className="h-5 w-5" />}
                />
                <StatsCard
                  title="Revenue"
                  value={formatCurrency(dashboardSummary?.totalRevenue ?? 0)}
                  icon={<BarChart3 className="h-5 w-5" />}
                />
                <StatsCard
                  title="Commission"
                  value={formatCurrency(dashboardSummary?.totalCommission ?? 0)}
                  icon={<BarChart3 className="h-5 w-5" />}
                />
              </div>
            )}
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">
                Lead Breakdown
              </h3>

              {loading ? (
                <p className="text-slate-500">Loading lead data...</p>
              ) : leadBreakdown.length === 0 ? (
                <p className="text-slate-500">No lead data found.</p>
              ) : (
                <div className="space-y-3">
                  {leadBreakdown.map((item) => (
                    <div
                      key={item.status}
                      className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3"
                    >
                      <div>
                        <p className="font-medium text-slate-900">{item.status}</p>
                        <p className="text-sm text-slate-500">
                          {item.percentage}% of total leads
                        </p>
                      </div>
                      <p className="text-lg font-semibold text-slate-900">
                        {item.count}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">
                Sales Breakdown
              </h3>

              {loading ? (
                <p className="text-slate-500">Loading sales data...</p>
              ) : !salesData ? (
                <p className="text-slate-500">No sales data found.</p>
              ) : (
                <div className="space-y-3">
                  <div className="rounded-xl border border-slate-200 px-4 py-3">
                    <p className="text-sm text-slate-500">Total Deals</p>
                    <p className="text-xl font-semibold text-slate-900">
                      {salesData.totalDeals}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 px-4 py-3">
                    <p className="text-sm text-slate-500">Closed Deals</p>
                    <p className="text-xl font-semibold text-slate-900">
                      {salesData.closedDeals}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 px-4 py-3">
                    <p className="text-sm text-slate-500">Total Revenue</p>
                    <p className="text-xl font-semibold text-slate-900">
                      {formatCurrency(salesData.totalRevenue)}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 px-4 py-3">
                    <p className="text-sm text-slate-500">Total Commission</p>
                    <p className="text-xl font-semibold text-slate-900">
                      {formatCurrency(salesData.totalCommission)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              Agent Performance
            </h3>

            {loading ? (
              <p className="text-slate-500">Loading agents...</p>
            ) : agents.length === 0 ? (
              <p className="text-slate-500">No agent data found.</p>
            ) : (
              <div className="space-y-4">
                {agents.map((agent) => (
                  <div
                    key={agent.id}
                    className="rounded-2xl border border-slate-200 p-5"
                  >
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h4 className="text-lg font-semibold text-slate-900">
                          {agent.name}
                        </h4>
                        <p className="text-sm text-slate-500">
                          {agent.email} • {agent.role}
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                      <div className="rounded-xl bg-slate-50 px-4 py-3">
                        <p className="text-sm text-slate-500">Assigned Leads</p>
                        <p className="text-lg font-semibold text-slate-900">
                          {agent.totalAssignedLeads}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 px-4 py-3">
                        <p className="text-sm text-slate-500">Closed Leads</p>
                        <p className="text-lg font-semibold text-slate-900">
                          {agent.closedLeadCount}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 px-4 py-3">
                        <p className="text-sm text-slate-500">Total Deals</p>
                        <p className="text-lg font-semibold text-slate-900">
                          {agent.totalDeals}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 px-4 py-3">
                        <p className="text-sm text-slate-500">Closed Deals</p>
                        <p className="text-lg font-semibold text-slate-900">
                          {agent.closedDeals}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 px-4 py-3">
                        <p className="text-sm text-slate-500">Deal Value</p>
                        <p className="text-lg font-semibold text-slate-900">
                          {formatCurrency(agent.totalDealValue)}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 px-4 py-3">
                        <p className="text-sm text-slate-500">Commission</p>
                        <p className="text-lg font-semibold text-slate-900">
                          {formatCurrency(agent.totalCommission)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}