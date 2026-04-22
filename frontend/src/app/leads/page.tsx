"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, RefreshCcw, Trash2, X } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { api } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import type { CreateLeadResponse, Lead, LeadsResponse } from "@/types";

type LeadStatus = "NEW" | "CONTACTED" | "QUALIFIED" | "CLOSED" | "LOST";
type LeadSource = "WEBSITE" | "ADS" | "CALL" | "REFERRAL" | "MANUAL";

interface EditLeadFormState {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  source: LeadSource;
  budgetMin: string;
  budgetMax: string;
  preferences: string;
  notes: string;
}

export default function LeadsPage() {
  const router = useRouter();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [source, setSource] = useState<LeadSource>("MANUAL");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [preferences, setPreferences] = useState("");
  const [notes, setNotes] = useState("");

  const [editingLead, setEditingLead] = useState<EditLeadFormState | null>(null);

  const fetchLeads = async () => {
    setError("");

    try {
      const response = await api.get<LeadsResponse>("/leads");
      setLeads(response.data.data);
    } catch {
      setError("Failed to fetch leads.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    const loadLeads = async () => {
      try {
        const response = await api.get<LeadsResponse>("/leads");
        setLeads(response.data.data);
      } catch {
        setError("Failed to fetch leads.");
      } finally {
        setLoading(false);
      }
    };

    void loadLeads();
  }, [router]);

  const resetCreateForm = () => {
    setFullName("");
    setPhone("");
    setEmail("");
    setSource("MANUAL");
    setBudgetMin("");
    setBudgetMax("");
    setPreferences("");
    setNotes("");
  };

  const handleCreateLead = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreating(true);
    setError("");

    try {
      const payload = {
        fullName,
        phone,
        email: email || undefined,
        source,
        budgetMin: budgetMin ? Number(budgetMin) : undefined,
        budgetMax: budgetMax ? Number(budgetMax) : undefined,
        preferences: preferences || undefined,
        notes: notes || undefined,
      };

      const response = await api.post<CreateLeadResponse>("/leads", payload);

      setLeads((prev) => [response.data.data, ...prev]);
      resetCreateForm();
    } catch {
      setError("Failed to create lead.");
    } finally {
      setCreating(false);
    }
  };

  const handleStatusUpdate = async (leadId: string, status: LeadStatus) => {
    setError("");

    try {
      await api.patch(`/leads/${leadId}/status`, { status });

      setLeads((prev) =>
        prev.map((lead) => (lead.id === leadId ? { ...lead, status } : lead))
      );
    } catch {
      setError("Failed to update lead status.");
    }
  };

  const handleStartEdit = (lead: Lead) => {
    setEditingLead({
      id: lead.id,
      fullName: lead.fullName,
      phone: lead.phone,
      email: lead.email ?? "",
      source: lead.source,
      budgetMin:
        lead.budgetMin !== null && lead.budgetMin !== undefined
          ? String(lead.budgetMin)
          : "",
      budgetMax:
        lead.budgetMax !== null && lead.budgetMax !== undefined
          ? String(lead.budgetMax)
          : "",
      preferences: lead.preferences ?? "",
      notes: lead.notes ?? "",
    });
  };

  const handleEditLead = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingLead) {
      return;
    }

    setUpdating(true);
    setError("");

    try {
      const payload = {
        fullName: editingLead.fullName,
        phone: editingLead.phone,
        email: editingLead.email || undefined,
        source: editingLead.source,
        budgetMin: editingLead.budgetMin
          ? Number(editingLead.budgetMin)
          : undefined,
        budgetMax: editingLead.budgetMax
          ? Number(editingLead.budgetMax)
          : undefined,
        preferences: editingLead.preferences || undefined,
        notes: editingLead.notes || undefined,
      };

      const response = await api.patch<CreateLeadResponse>(
        `/leads/${editingLead.id}`,
        payload
      );

      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === editingLead.id ? response.data.data : lead
        )
      );

      setEditingLead(null);
    } catch {
      setError("Failed to update lead.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this lead?");

    if (!confirmed) {
      return;
    }

    setDeletingId(leadId);
    setError("");

    try {
      await api.delete(`/leads/${leadId}`);
      setLeads((prev) => prev.filter((lead) => lead.id !== leadId));
    } catch {
      setError("Failed to delete lead.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1">
        <Topbar title="Leads" />

        <main className="space-y-6 p-6">
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <Plus className="h-5 w-5 text-slate-700" />
              <h2 className="text-lg font-semibold text-slate-900">
                Create New Lead
              </h2>
            </div>

            <form
              onSubmit={handleCreateLead}
              className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
            >
              <input
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />

              <input
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />

              <input
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <select
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                value={source}
                onChange={(e) => setSource(e.target.value as LeadSource)}
              >
                <option value="MANUAL">MANUAL</option>
                <option value="WEBSITE">WEBSITE</option>
                <option value="ADS">ADS</option>
                <option value="CALL">CALL</option>
                <option value="REFERRAL">REFERRAL</option>
              </select>

              <input
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                placeholder="Budget Min"
                value={budgetMin}
                onChange={(e) => setBudgetMin(e.target.value)}
              />

              <input
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                placeholder="Budget Max"
                value={budgetMax}
                onChange={(e) => setBudgetMax(e.target.value)}
              />

              <input
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400 md:col-span-2 xl:col-span-1"
                placeholder="Preferences"
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
              />

              <input
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400 md:col-span-2"
                placeholder="Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />

              <div className="md:col-span-2 xl:col-span-3">
                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-xl bg-slate-900 px-5 py-3 font-medium text-white transition hover:bg-slate-800 disabled:opacity-70"
                >
                  {creating ? "Creating..." : "Create Lead"}
                </button>
              </div>
            </form>

            {error ? (
              <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            ) : null}
          </section>

          {editingLead ? (
            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Edit Lead</h2>
                <button
                  onClick={() => setEditingLead(null)}
                  className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form
                onSubmit={handleEditLead}
                className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
              >
                <input
                  className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                  placeholder="Full name"
                  value={editingLead.fullName}
                  onChange={(e) =>
                    setEditingLead((prev) =>
                      prev ? { ...prev, fullName: e.target.value } : prev
                    )
                  }
                  required
                />

                <input
                  className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                  placeholder="Phone"
                  value={editingLead.phone}
                  onChange={(e) =>
                    setEditingLead((prev) =>
                      prev ? { ...prev, phone: e.target.value } : prev
                    )
                  }
                  required
                />

                <input
                  className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                  placeholder="Email"
                  value={editingLead.email}
                  onChange={(e) =>
                    setEditingLead((prev) =>
                      prev ? { ...prev, email: e.target.value } : prev
                    )
                  }
                />

                <select
                  className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                  value={editingLead.source}
                  onChange={(e) =>
                    setEditingLead((prev) =>
                      prev
                        ? { ...prev, source: e.target.value as LeadSource }
                        : prev
                    )
                  }
                >
                  <option value="MANUAL">MANUAL</option>
                  <option value="WEBSITE">WEBSITE</option>
                  <option value="ADS">ADS</option>
                  <option value="CALL">CALL</option>
                  <option value="REFERRAL">REFERRAL</option>
                </select>

                <input
                  className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                  placeholder="Budget Min"
                  value={editingLead.budgetMin}
                  onChange={(e) =>
                    setEditingLead((prev) =>
                      prev ? { ...prev, budgetMin: e.target.value } : prev
                    )
                  }
                />

                <input
                  className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                  placeholder="Budget Max"
                  value={editingLead.budgetMax}
                  onChange={(e) =>
                    setEditingLead((prev) =>
                      prev ? { ...prev, budgetMax: e.target.value } : prev
                    )
                  }
                />

                <input
                  className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400 md:col-span-2 xl:col-span-1"
                  placeholder="Preferences"
                  value={editingLead.preferences}
                  onChange={(e) =>
                    setEditingLead((prev) =>
                      prev ? { ...prev, preferences: e.target.value } : prev
                    )
                  }
                />

                <input
                  className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400 md:col-span-2"
                  placeholder="Notes"
                  value={editingLead.notes}
                  onChange={(e) =>
                    setEditingLead((prev) =>
                      prev ? { ...prev, notes: e.target.value } : prev
                    )
                  }
                />

                <div className="md:col-span-2 xl:col-span-3 flex gap-3">
                  <button
                    type="submit"
                    disabled={updating}
                    className="rounded-xl bg-slate-900 px-5 py-3 font-medium text-white transition hover:bg-slate-800 disabled:opacity-70"
                  >
                    {updating ? "Updating..." : "Update Lead"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingLead(null)}
                    className="rounded-xl border border-slate-200 px-5 py-3 font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </section>
          ) : null}

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">All Leads</h2>
                <p className="text-sm text-slate-500">
                  View and manage your lead pipeline
                </p>
              </div>

              <button
                onClick={() => {
                  setLoading(true);
                  void fetchLeads();
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <RefreshCcw className="h-4 w-4" />
                Refresh
              </button>
            </div>

            {loading ? (
              <p className="text-slate-500">Loading leads...</p>
            ) : leads.length === 0 ? (
              <p className="text-slate-500">No leads found yet.</p>
            ) : (
              <div className="space-y-4">
                {leads.map((lead) => (
                  <div
                    key={lead.id}
                    className="rounded-2xl border border-slate-200 p-5"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-semibold text-slate-900">
                            {lead.fullName}
                          </h3>
                          <StatusBadge status={lead.status} />
                        </div>

                        <p className="text-sm text-slate-600">
                          <span className="font-medium">Phone:</span> {lead.phone}
                        </p>

                        {lead.email ? (
                          <p className="text-sm text-slate-600">
                            <span className="font-medium">Email:</span> {lead.email}
                          </p>
                        ) : null}

                        <p className="text-sm text-slate-600">
                          <span className="font-medium">Source:</span> {lead.source}
                        </p>

                        {(lead.budgetMin || lead.budgetMax) && (
                          <p className="text-sm text-slate-600">
                            <span className="font-medium">Budget:</span>{" "}
                            {lead.budgetMin ?? 0} - {lead.budgetMax ?? 0}
                          </p>
                        )}

                        {lead.preferences ? (
                          <p className="text-sm text-slate-600">
                            <span className="font-medium">Preferences:</span>{" "}
                            {lead.preferences}
                          </p>
                        ) : null}

                        {lead.notes ? (
                          <p className="text-sm text-slate-600">
                            <span className="font-medium">Notes:</span> {lead.notes}
                          </p>
                        ) : null}
                      </div>

                      <div className="flex flex-col gap-2 sm:min-w-[180px]">
                        <select
                          className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                          value={lead.status}
                          onChange={(e) =>
                            handleStatusUpdate(
                              lead.id,
                              e.target.value as LeadStatus
                            )
                          }
                        >
                          <option value="NEW">NEW</option>
                          <option value="CONTACTED">CONTACTED</option>
                          <option value="QUALIFIED">QUALIFIED</option>
                          <option value="CLOSED">CLOSED</option>
                          <option value="LOST">LOST</option>
                        </select>

                        <button
                          onClick={() => handleStartEdit(lead)}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </button>

                        <button
                          onClick={() => handleDeleteLead(lead.id)}
                          disabled={deletingId === lead.id}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-70"
                        >
                          <Trash2 className="h-4 w-4" />
                          {deletingId === lead.id ? "Deleting..." : "Delete"}
                        </button>
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