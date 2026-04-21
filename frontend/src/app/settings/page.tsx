"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BellRing, RefreshCcw } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { ReminderStatusBadge } from "@/components/dashboard/reminder-status-badge";
import { api } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import type { Reminder, RemindersResponse } from "@/types";

export default function SettingsPage() {
  const router = useRouter();

  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReminders = async () => {
    setError("");

    try {
      const response = await api.get<RemindersResponse>("/reminders");
      setReminders(response.data.data);
    } catch {
      setError("Failed to fetch reminders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    const loadReminders = async () => {
      try {
        const response = await api.get<RemindersResponse>("/reminders");
        setReminders(response.data.data);
      } catch {
        setError("Failed to fetch reminders.");
      } finally {
        setLoading(false);
      }
    };

    void loadReminders();
  }, [router]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1">
        <Topbar title="Follow-ups" />

        <main className="space-y-6 p-6">
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BellRing className="h-5 w-5 text-slate-700" />
                <h2 className="text-lg font-semibold text-slate-900">
                  Follow-ups & Reminders
                </h2>
              </div>

              <button
                onClick={() => {
                  setLoading(true);
                  void fetchReminders();
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
              <p className="text-slate-500">Loading reminders...</p>
            ) : reminders.length === 0 ? (
              <p className="text-slate-500">No reminders found.</p>
            ) : (
              <div className="space-y-4">
                {reminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className="rounded-2xl border border-slate-200 p-5"
                  >
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          {reminder.title}
                        </h3>
                        <p className="text-sm text-slate-500">
                          Assigned to: {reminder.assignedTo.name}
                        </p>
                      </div>

                      <ReminderStatusBadge status={reminder.status} />
                    </div>

                    <div className="space-y-2 text-sm text-slate-600">
                      <p>
                        <span className="font-medium">Due At:</span>{" "}
                        {new Date(reminder.dueAt).toLocaleString()}
                      </p>

                      {reminder.description ? (
                        <p>
                          <span className="font-medium">Description:</span>{" "}
                          {reminder.description}
                        </p>
                      ) : null}

                      {reminder.lead ? (
                        <p>
                          <span className="font-medium">Lead:</span>{" "}
                          {reminder.lead.fullName}
                        </p>
                      ) : null}

                      {reminder.client ? (
                        <p>
                          <span className="font-medium">Client:</span>{" "}
                          {reminder.client.fullName}
                        </p>
                      ) : null}
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