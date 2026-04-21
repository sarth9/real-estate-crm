"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Handshake, RefreshCcw } from "lucide-react";
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

export default function DealsPage() {
  const router = useRouter();

  const [deals, setDeals] = useState<Deal[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [agentId, setAgentId] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [clientId, setClientId] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [stage, setStage] = useState<DealStage>("NEGOTIATION");
  const [dealValue, setDealValue] = useState("");
  const [commissionPercent, setCommissionPercent] = useState("2");
  const [notes, setNotes] = useState("");

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
      setTitle("");
      setClientId("");
      setPropertyId("");
      setStage("NEGOTIATION");
      setDealValue("");
      setCommissionPercent("2");
      setNotes("");
    } catch {
      setError("Failed to create deal.");
    } finally {
      setCreating(false);
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

                        {deal.notes ? (
                          <p className="text-sm text-slate-600">
                            <span className="font-medium">Notes:</span>{" "}
                            {deal.notes}
                          </p>
                        ) : null}
                      </div>

                      <div className="flex flex-col gap-2">
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