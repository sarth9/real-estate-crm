"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Handshake,
  Pencil,
  RefreshCcw,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { DealStageBadge } from "@/components/dashboard/deal-stage-badge";
import { api } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import { formatCurrency } from "@/lib/utils";
import type {
  Client,
  ClientsResponse,
  CreateDealResponse,
  Deal,
  DealsResponse,
  MeResponse,
  PropertiesResponse,
  Property,
} from "@/types";

type DealStage = "NEGOTIATION" | "AGREEMENT" | "CLOSED";

interface EditDealFormState {
  id: string;
  title: string;
  clientId: string;
  propertyId: string;
  stage: DealStage;
  dealValue: string;
  commissionPercent: string;
  notes: string;
}

export default function DealsPage() {
  const router = useRouter();

  const [deals, setDeals] = useState<Deal[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [agentId, setAgentId] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [clientId, setClientId] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [stage, setStage] = useState<DealStage>("NEGOTIATION");
  const [dealValue, setDealValue] = useState("");
  const [commissionPercent, setCommissionPercent] = useState("2");
  const [notes, setNotes] = useState("");

  const [editingDeal, setEditingDeal] = useState<EditDealFormState | null>(null);

  const fetchDeals = async () => {
    setError("");

    try {
      const response = await api.get<DealsResponse>("/deals");
      setDeals(response.data.data);
    } catch {
      setError("Failed to fetch deals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    const loadPageData = async () => {
      try {
        const [dealsRes, clientsRes, propertiesRes, meRes] = await Promise.all([
          api.get<DealsResponse>("/deals"),
          api.get<ClientsResponse>("/clients"),
          api.get<PropertiesResponse>("/properties"),
          api.get<MeResponse>("/auth/me"),
        ]);

        setDeals(dealsRes.data.data);
        setClients(clientsRes.data.data);
        setProperties(propertiesRes.data.data);
        setAgentId(meRes.data.data.id);
      } catch {
        setError("Failed to fetch deals page data.");
      } finally {
        setLoading(false);
      }
    };

    void loadPageData();
  }, [router]);

  const resetCreateForm = () => {
    setTitle("");
    setClientId("");
    setPropertyId("");
    setStage("NEGOTIATION");
    setDealValue("");
    setCommissionPercent("2");
    setNotes("");
  };

  const handleCreateDeal = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreating(true);
    setError("");

    try {
      const payload = {
        title,
        clientId,
        propertyId,
        agentId,
        stage,
        dealValue: Number(dealValue),
        commissionPercent: Number(commissionPercent),
        notes: notes || undefined,
      };

      const response = await api.post<CreateDealResponse>("/deals", payload);

      setDeals((prev) => [response.data.data, ...prev]);
      resetCreateForm();
    } catch {
      setError("Failed to create deal.");
    } finally {
      setCreating(false);
    }
  };

  const handleStartEdit = (deal: Deal) => {
    setEditingDeal({
      id: deal.id,
      title: deal.title,
      clientId: deal.client.id,
      propertyId: deal.property.id,
      stage: deal.stage,
      dealValue: String(deal.dealValue),
      commissionPercent: String(deal.commissionPercent),
      notes: deal.notes ?? "",
    });
  };

  const handleEditDeal = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingDeal) {
      return;
    }

    setUpdating(true);
    setError("");

    try {
      const payload = {
        title: editingDeal.title,
        clientId: editingDeal.clientId,
        propertyId: editingDeal.propertyId,
        agentId,
        stage: editingDeal.stage,
        dealValue: Number(editingDeal.dealValue),
        commissionPercent: Number(editingDeal.commissionPercent),
        notes: editingDeal.notes || undefined,
      };

      const response = await api.patch<CreateDealResponse>(
        `/deals/${editingDeal.id}`,
        payload
      );

      setDeals((prev) =>
        prev.map((deal) =>
          deal.id === editingDeal.id ? response.data.data : deal
        )
      );

      setEditingDeal(null);
    } catch {
      setError("Failed to update deal.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteDeal = async (dealId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this deal?");

    if (!confirmed) {
      return;
    }

    setDeletingId(dealId);
    setError("");

    try {
      await api.delete(`/deals/${dealId}`);
      setDeals((prev) => prev.filter((deal) => deal.id !== dealId));
    } catch {
      setError("Failed to delete deal.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleStageUpdate = async (dealId: string, nextStage: DealStage) => {
    setError("");

    try {
      await api.patch(`/deals/${dealId}/stage`, { stage: nextStage });

      setDeals((prev) =>
        prev.map((deal) =>
          deal.id === dealId
            ? {
                ...deal,
                stage: nextStage,
                closedAt:
                  nextStage === "CLOSED"
                    ? new Date().toISOString()
                    : deal.closedAt,
              }
            : deal
        )
      );
    } catch {
      setError("Failed to update deal stage.");
    }
  };

  const handleDocumentUpload = async (dealId: string, file: File) => {
    const formData = new FormData();
    formData.append("document", file);
    formData.append("category", "AGREEMENT");

    try {
      await api.post(`/deals/${dealId}/documents`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await fetchDeals();
    } catch {
      setError("Failed to upload deal document.");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1">
        <Topbar title="Deals" />

        <main className="space-y-6 p-6">
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <Handshake className="h-5 w-5 text-slate-700" />
              <h2 className="text-lg font-semibold text-slate-900">
                Create New Deal
              </h2>
            </div>

            <form
              onSubmit={handleCreateDeal}
              className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
            >
              <input
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                placeholder="Deal title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <select
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                required
              >
                <option value="">Select client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.fullName}
                  </option>
                ))}
              </select>

              <select
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                value={propertyId}
                onChange={(e) => setPropertyId(e.target.value)}
                required
              >
                <option value="">Select property</option>
                {properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.title} - {property.city}
                  </option>
                ))}
              </select>

              <select
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                value={stage}
                onChange={(e) => setStage(e.target.value as DealStage)}
              >
                <option value="NEGOTIATION">NEGOTIATION</option>
                <option value="AGREEMENT">AGREEMENT</option>
                <option value="CLOSED">CLOSED</option>
              </select>

              <input
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                placeholder="Deal value"
                value={dealValue}
                onChange={(e) => setDealValue(e.target.value)}
                required
              />

              <input
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                placeholder="Commission percent"
                value={commissionPercent}
                onChange={(e) => setCommissionPercent(e.target.value)}
                required
              />

              <input
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400 md:col-span-2 xl:col-span-3"
                placeholder="Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />

              <div className="md:col-span-2 xl:col-span-3">
                <button
                  type="submit"
                  disabled={creating || !agentId}
                  className="rounded-xl bg-slate-900 px-5 py-3 font-medium text-white transition hover:bg-slate-800 disabled:opacity-70"
                >
                  {creating ? "Creating..." : "Create Deal"}
                </button>
              </div>
            </form>

            {error ? (
              <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            ) : null}
          </section>

          {editingDeal ? (
            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">
                  Edit Deal
                </h2>
                <button
                  onClick={() => setEditingDeal(null)}
                  className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form
                onSubmit={handleEditDeal}
                className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
              >
                <input
                  className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                  placeholder="Deal title"
                  value={editingDeal.title}
                  onChange={(e) =>
                    setEditingDeal((prev) =>
                      prev ? { ...prev, title: e.target.value } : prev
                    )
                  }
                  required
                />

                <select
                  className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                  value={editingDeal.clientId}
                  onChange={(e) =>
                    setEditingDeal((prev) =>
                      prev ? { ...prev, clientId: e.target.value } : prev
                    )
                  }
                  required
                >
                  <option value="">Select client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.fullName}
                    </option>
                  ))}
                </select>

                <select
                  className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                  value={editingDeal.propertyId}
                  onChange={(e) =>
                    setEditingDeal((prev) =>
                      prev ? { ...prev, propertyId: e.target.value } : prev
                    )
                  }
                  required
                >
                  <option value="">Select property</option>
                  {properties.map((property) => (
                    <option key={property.id} value={property.id}>
                      {property.title} - {property.city}
                    </option>
                  ))}
                </select>

                <select
                  className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                  value={editingDeal.stage}
                  onChange={(e) =>
                    setEditingDeal((prev) =>
                      prev ? { ...prev, stage: e.target.value as DealStage } : prev
                    )
                  }
                >
                  <option value="NEGOTIATION">NEGOTIATION</option>
                  <option value="AGREEMENT">AGREEMENT</option>
                  <option value="CLOSED">CLOSED</option>
                </select>

                <input
                  className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                  placeholder="Deal value"
                  value={editingDeal.dealValue}
                  onChange={(e) =>
                    setEditingDeal((prev) =>
                      prev ? { ...prev, dealValue: e.target.value } : prev
                    )
                  }
                  required
                />

                <input
                  className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                  placeholder="Commission percent"
                  value={editingDeal.commissionPercent}
                  onChange={(e) =>
                    setEditingDeal((prev) =>
                      prev
                        ? { ...prev, commissionPercent: e.target.value }
                        : prev
                    )
                  }
                  required
                />

                <input
                  className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400 md:col-span-2 xl:col-span-3"
                  placeholder="Notes"
                  value={editingDeal.notes}
                  onChange={(e) =>
                    setEditingDeal((prev) =>
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
                    {updating ? "Updating..." : "Update Deal"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingDeal(null)}
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
                <h2 className="text-lg font-semibold text-slate-900">All Deals</h2>
                <p className="text-sm text-slate-500">
                  View and manage your deal pipeline
                </p>
              </div>

              <button
                onClick={() => {
                  setLoading(true);
                  void fetchDeals();
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <RefreshCcw className="h-4 w-4" />
                Refresh
              </button>
            </div>

            {loading ? (
              <p className="text-slate-500">Loading deals...</p>
            ) : deals.length === 0 ? (
              <p className="text-slate-500">No deals found yet.</p>
            ) : (
              <div className="space-y-4">
                {deals.map((deal) => (
                  <div
                    key={deal.id}
                    className="rounded-2xl border border-slate-200 p-5"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-semibold text-slate-900">
                            {deal.title}
                          </h3>
                          <DealStageBadge stage={deal.stage} />
                        </div>

                        <p className="text-sm text-slate-600">
                          <span className="font-medium">Client:</span>{" "}
                          {deal.client.fullName}
                        </p>

                        <p className="text-sm text-slate-600">
                          <span className="font-medium">Property:</span>{" "}
                          {deal.property.title}
                        </p>

                        <p className="text-sm text-slate-600">
                          <span className="font-medium">Agent:</span>{" "}
                          {deal.agent.name}
                        </p>

                        <p className="text-sm text-slate-600">
                          <span className="font-medium">Deal Value:</span>{" "}
                          {formatCurrency(deal.dealValue)}
                        </p>

                        <p className="text-sm text-slate-600">
                          <span className="font-medium">Commission:</span>{" "}
                          {deal.commissionPercent}% (
                          {formatCurrency(deal.commissionAmount)})
                        </p>

                        {deal.documents?.length ? (
                          <div className="text-sm text-slate-600">
                            <span className="font-medium">Documents:</span>
                            <div className="mt-1 space-y-1">
                              {deal.documents.map((doc) => (
                                <div key={doc.id}>
                                  <a
                                    href={doc.fileUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-600 underline"
                                  >
                                    {doc.fileName}
                                  </a>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : null}

                        {deal.notes ? (
                          <p className="text-sm text-slate-600">
                            <span className="font-medium">Notes:</span>{" "}
                            {deal.notes}
                          </p>
                        ) : null}
                      </div>

                      <div className="flex flex-col gap-2 sm:min-w-[180px]">
                        <select
                          className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                          value={deal.stage}
                          onChange={(e) =>
                            handleStageUpdate(
                              deal.id,
                              e.target.value as DealStage
                            )
                          }
                        >
                          <option value="NEGOTIATION">NEGOTIATION</option>
                          <option value="AGREEMENT">AGREEMENT</option>
                          <option value="CLOSED">CLOSED</option>
                        </select>

                        <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                          <Upload className="h-4 w-4" />
                          Upload Document
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                void handleDocumentUpload(deal.id, file);
                              }
                            }}
                          />
                        </label>

                        <button
                          onClick={() => handleStartEdit(deal)}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </button>

                        <button
                          onClick={() => handleDeleteDeal(deal.id)}
                          disabled={deletingId === deal.id}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-70"
                        >
                          <Trash2 className="h-4 w-4" />
                          {deletingId === deal.id ? "Deleting..." : "Delete"}
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