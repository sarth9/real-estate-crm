"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, RefreshCcw } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { PropertyStatusBadge } from "@/components/dashboard/property-status-badge";
import { api } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import { formatCurrency } from "@/lib/utils";
import type {
  CreatePropertyResponse,
  Property,
  PropertiesResponse,
} from "@/types";

type PropertyType = "RESIDENTIAL" | "COMMERCIAL";
type PropertyAvailability = "AVAILABLE" | "BOOKED" | "SOLD" | "RENTED";

export default function PropertiesPage() {
  const router = useRouter();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [type, setType] = useState<PropertyType>("RESIDENTIAL");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("India");
  const [price, setPrice] = useState("");
  const [sizeSqft, setSizeSqft] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [amenities, setAmenities] = useState("");
  const [availabilityStatus, setAvailabilityStatus] =
    useState<PropertyAvailability>("AVAILABLE");

  const fetchProperties = async () => {
    setError("");

    try {
      const response = await api.get<PropertiesResponse>("/properties");
      setProperties(response.data.data);
    } catch {
      setError("Failed to fetch properties.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    const loadProperties = async () => {
      try {
        const response = await api.get<PropertiesResponse>("/properties");
        setProperties(response.data.data);
      } catch {
        setError("Failed to fetch properties.");
      } finally {
        setLoading(false);
      }
    };

    void loadProperties();
  }, [router]);

  const handleCreateProperty = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreating(true);
    setError("");

    try {
      const payload = {
        title,
        type,
        description: description || undefined,
        address,
        city,
        state: state || undefined,
        country: country || undefined,
        price: Number(price),
        sizeSqft: sizeSqft ? Number(sizeSqft) : undefined,
        bedrooms: bedrooms ? Number(bedrooms) : undefined,
        bathrooms: bathrooms ? Number(bathrooms) : undefined,
        amenities: amenities || undefined,
        availabilityStatus,
      };

      const response = await api.post<CreatePropertyResponse>(
        "/properties",
        payload
      );

      setProperties((prev) => [response.data.data, ...prev]);
      setTitle("");
      setType("RESIDENTIAL");
      setDescription("");
      setAddress("");
      setCity("");
      setState("");
      setCountry("India");
      setPrice("");
      setSizeSqft("");
      setBedrooms("");
      setBathrooms("");
      setAmenities("");
      setAvailabilityStatus("AVAILABLE");
    } catch {
      setError("Failed to create property.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1">
        <Topbar title="Properties" />

        <main className="space-y-6 p-6">
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-slate-700" />
              <h2 className="text-lg font-semibold text-slate-900">
                Add New Property
              </h2>
            </div>

            <form
              onSubmit={handleCreateProperty}
              className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
            >
              <input
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                placeholder="Property title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <select
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                value={type}
                onChange={(e) => setType(e.target.value as PropertyType)}
              >
                <option value="RESIDENTIAL">RESIDENTIAL</option>
                <option value="COMMERCIAL">COMMERCIAL</option>
              </select>

              <input
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />

              <input
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />

              <input
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                placeholder="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />

              <input
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />

              <input
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />

              <input
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                placeholder="Size (sqft)"
                value={sizeSqft}
                onChange={(e) => setSizeSqft(e.target.value)}
              />

              <input
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                placeholder="Bedrooms"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
              />

              <input
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                placeholder="Bathrooms"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
              />

              <select
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                value={availabilityStatus}
                onChange={(e) =>
                  setAvailabilityStatus(e.target.value as PropertyAvailability)
                }
              >
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="BOOKED">BOOKED</option>
                <option value="SOLD">SOLD</option>
                <option value="RENTED">RENTED</option>
              </select>

              <input
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400 md:col-span-2 xl:col-span-1"
                placeholder="Amenities"
                value={amenities}
                onChange={(e) => setAmenities(e.target.value)}
              />

              <input
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400 md:col-span-2 xl:col-span-3"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <div className="md:col-span-2 xl:col-span-3">
                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-xl bg-slate-900 px-5 py-3 font-medium text-white transition hover:bg-slate-800 disabled:opacity-70"
                >
                  {creating ? "Creating..." : "Create Property"}
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
                <h2 className="text-lg font-semibold text-slate-900">
                  All Properties
                </h2>
                <p className="text-sm text-slate-500">
                  View and manage your property listings
                </p>
              </div>

              <button
                onClick={() => {
                  setLoading(true);
                  void fetchProperties();
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <RefreshCcw className="h-4 w-4" />
                Refresh
              </button>
            </div>

            {loading ? (
              <p className="text-slate-500">Loading properties...</p>
            ) : properties.length === 0 ? (
              <p className="text-slate-500">No properties found yet.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {properties.map((property) => (
                  <div
                    key={property.id}
                    className="rounded-2xl border border-slate-200 p-5"
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {property.title}
                      </h3>
                      <PropertyStatusBadge
                        status={property.availabilityStatus}
                      />
                    </div>

                    <div className="space-y-2 text-sm text-slate-600">
                      <p>
                        <span className="font-medium">Type:</span> {property.type}
                      </p>
                      <p>
                        <span className="font-medium">Price:</span>{" "}
                        {formatCurrency(property.price)}
                      </p>
                      <p>
                        <span className="font-medium">Address:</span>{" "}
                        {property.address}, {property.city}
                      </p>

                      {property.sizeSqft ? (
                        <p>
                          <span className="font-medium">Size:</span>{" "}
                          {property.sizeSqft} sqft
                        </p>
                      ) : null}

                      {property.bedrooms !== null &&
                      property.bedrooms !== undefined ? (
                        <p>
                          <span className="font-medium">Bedrooms:</span>{" "}
                          {property.bedrooms}
                        </p>
                      ) : null}

                      {property.bathrooms !== null &&
                      property.bathrooms !== undefined ? (
                        <p>
                          <span className="font-medium">Bathrooms:</span>{" "}
                          {property.bathrooms}
                        </p>
                      ) : null}

                      {property.amenities ? (
                        <p>
                          <span className="font-medium">Amenities:</span>{" "}
                          {property.amenities}
                        </p>
                      ) : null}

                      {property.description ? (
                        <p>
                          <span className="font-medium">Description:</span>{" "}
                          {property.description}
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