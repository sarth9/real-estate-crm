"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCcw, Users } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { UserRoleBadge } from "@/components/dashboard/user-role-badge";
import { api } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import { formatCurrency } from "@/lib/utils";
import type { UserListItem, UsersResponse } from "@/types";

export default function UsersPage() {
  const router = useRouter();

  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    setError("");

    try {
      const response = await api.get<UsersResponse>("/users");
      setUsers(response.data.data);
    } catch {
      setError("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    const loadUsers = async () => {
      try {
        const response = await api.get<UsersResponse>("/users");
        setUsers(response.data.data);
      } catch {
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };

    void loadUsers();
  }, [router]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1">
        <Topbar title="Users" />

        <main className="space-y-6 p-6">
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-slate-700" />
                <h2 className="text-lg font-semibold text-slate-900">
                  Team Members
                </h2>
              </div>

              <button
                onClick={() => {
                  setLoading(true);
                  void fetchUsers();
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
              <p className="text-slate-500">Loading users...</p>
            ) : users.length === 0 ? (
              <p className="text-slate-500">No users found.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {users.map((user) => {
                  const closedDeals = user.deals.filter(
                    (deal) => deal.stage === "CLOSED"
                  ).length;

                  const totalDealValue = user.deals.reduce(
                    (sum, deal) => sum + deal.dealValue,
                    0
                  );

                  const totalCommission = user.deals.reduce(
                    (sum, deal) => sum + deal.commissionAmount,
                    0
                  );

                  return (
                    <div
                      key={user.id}
                      className="rounded-2xl border border-slate-200 p-5"
                    >
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <h3 className="text-lg font-semibold text-slate-900">
                          {user.name}
                        </h3>
                        <UserRoleBadge role={user.role} />
                      </div>

                      <div className="space-y-2 text-sm text-slate-600">
                        <p>
                          <span className="font-medium">Email:</span> {user.email}
                        </p>

                        {user.phone ? (
                          <p>
                            <span className="font-medium">Phone:</span> {user.phone}
                          </p>
                        ) : null}

                        <p>
                          <span className="font-medium">Status:</span>{" "}
                          {user.isActive ? "Active" : "Inactive"}
                        </p>

                        <p>
                          <span className="font-medium">Assigned Leads:</span>{" "}
                          {user.assignedLeads.length}
                        </p>

                        <p>
                          <span className="font-medium">Total Deals:</span>{" "}
                          {user.deals.length}
                        </p>

                        <p>
                          <span className="font-medium">Closed Deals:</span>{" "}
                          {closedDeals}
                        </p>

                        <p>
                          <span className="font-medium">Deal Value:</span>{" "}
                          {formatCurrency(totalDealValue)}
                        </p>

                        <p>
                          <span className="font-medium">Commission:</span>{" "}
                          {formatCurrency(totalCommission)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}