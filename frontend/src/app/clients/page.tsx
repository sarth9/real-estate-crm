"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Contact, RefreshCcw } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { ClientTypeBadge } from "@/components/dashboard/client-type-badge";
import { api } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import type { Client, ClientsResponse, CreateClientResponse } from "@/types";

type ClientType = "BUYER" | "SELLER" | "INVESTOR" | "TENANT";

export default function ClientsPage() {
  const router = useRouter();

  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [clientType, setClientType] = useState<ClientType>("BUYER");
  const [preferences, setPreferences] = useState("");
  const [notes, setNotes] = useState("");

  const fetchClients = async () => {
    setError("");

    try {
      const response = await api.get<ClientsResponse>("/clients");
      setClients(response.data.data);
    } catch {
      setError("Failed to fetch clients.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    const loadClients = async () => {
      try {
        const response = await api.get<ClientsResponse>("/clients");
        setClients(response.data.data);
      } catch {
        setError("Failed to fetch clients.");
      } finally {
        setLoading(false);
      }
    };

    void loadClients();
  }, [router]);

  const handleCreateClient = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreating(true);
    setError("");

    try {
      const payload = {
        fullName,
        phone: phone || undefined,
        email: email || undefined,
        clientType,
        preferences: preferences || undefined,
        notes: notes || undefined,
      };

      const response = await api.post<CreateClientResponse>("/clients", payload);

      setClients((prev) => [response.data.data, ...prev]);
      setFullName("");
      setPhone("");
      setEmail("");
      setClientType("BUYER");
      setPreferences("");
      setNotes("");
    } catch {
      setError("Failed to create client.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1">
        <Topbar title="Clients" />

        <main className="space-y-6 p-6">
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <Contact className="h-5 w-5 text-slate-700" />
              <h2 className="text-lg font-semibold text-slate-900">
                Add New Client
              </h2>
            </div>

            <form
              onSubmit={handleCreateClient}
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
              />

              <input
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <select
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                value={clientType}
                onChange={(e) => setClientType(e.target.value as ClientType)}
              >
                <option value="BUYER">BUYER</option>
                <option value="SELLER">SELLER</option>
                <option value="INVESTOR">INVESTOR</option>
                <option value="TENANT">TENANT</option>
              </select>

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
                  {creating ? "Creating..." : "Create Client"}
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
                <h2 className="text-lg font-semibold text-slate-900">All Clients</h2>
                <p className="text-sm text-slate-500">
                  View and manage client profiles
                </p>
              </div>

              <button
                onClick={() => {
                  setLoading(true);
                  void fetchClients();
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <RefreshCcw className="h-4 w-4" />
                Refresh
              </button>
            </div>

            {loading ? (
              <p className="text-slate-500">Loading clients...</p>
            ) : clients.length === 0 ? (
              <p className="text-slate-500">No clients found yet.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {clients.map((client) => (
                  <div
                    key={client.id}
                    className="rounded-2xl border border-slate-200 p-5"
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {client.fullName}
                      </h3>
                      <ClientTypeBadge type={client.clientType} />
                    </div>

                    <div className="space-y-2 text-sm text-slate-600">
                      {client.phone ? (
                        <p>
                          <span className="font-medium">Phone:</span> {client.phone}
                        </p>
                      ) : null}

                      {client.email ? (
                        <p>
                          <span className="font-medium">Email:</span> {client.email}
                        </p>
                      ) : null}

                      {client.preferences ? (
                        <p>
                          <span className="font-medium">Preferences:</span>{" "}
                          {client.preferences}
                        </p>
                      ) : null}

                      {client.notes ? (
                        <p>
                          <span className="font-medium">Notes:</span> {client.notes}
                        </p>
                      ) : null}

                      {client.linkedLead ? (
                        <p>
                          <span className="font-medium">Linked Lead:</span>{" "}
                          {client.linkedLead.fullName}
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