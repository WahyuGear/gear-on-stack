"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Business = {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  description: string | null;
  source: string | null;
  location: string | null;
  status: string;
  created_at: string;
};

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBusinesses() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      const { data, error } = await supabase
        .from("businesses")
        .select(
          "id, name, slug, category, description, source, location, status, created_at"
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to load businesses:", error);
        setLoading(false);
        return;
      }

      setBusinesses(data ?? []);
      setLoading(false);
    }

    loadBusinesses();
  }, []);

  const filteredBusinesses = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return businesses;

    return businesses.filter((business) => {
      return (
        business.name.toLowerCase().includes(query) ||
        business.category?.toLowerCase().includes(query) ||
        business.location?.toLowerCase().includes(query) ||
        business.source?.toLowerCase().includes(query)
      );
    });
  }, [businesses, search]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
          <div className="border-b border-slate-200 px-6 py-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-sm font-bold text-white">
                G
              </div>

              <div>
                <p className="font-bold tracking-tight">GearOnStack</p>
                <p className="text-xs text-slate-500">
                  Business Website Platform
                </p>
              </div>
            </Link>
          </div>

          <nav className="flex-1 px-4 py-6">
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Workspace
            </p>

            <div className="space-y-1">
              <Link
                href="/dashboard"
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
              >
                Dashboard
              </Link>

              <Link
                href="/businesses"
                className="block rounded-lg bg-slate-950 px-3 py-2.5 text-sm font-medium text-white"
              >
                Businesses
              </Link>

              <button className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-600 hover:bg-slate-100">
                Websites
              </button>

              <button className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-600 hover:bg-slate-100">
                Templates
              </button>

              <button className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-600 hover:bg-slate-100">
                Settings
              </button>
            </div>
          </nav>

          <div className="border-t border-slate-200 p-4">
            <Link
              href="/dashboard"
              className="block rounded-lg bg-slate-50 p-3 transition hover:bg-slate-100"
            >
              <p className="text-sm font-semibold">Admin</p>
              <p className="mt-1 text-xs text-slate-500">
                GearOnStack Workspace
              </p>
            </Link>
          </div>
        </aside>

        {/* Main */}
        <section className="min-w-0 flex-1">
          <header className="border-b border-slate-200 bg-white px-6 py-5 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-slate-500 hover:text-slate-950"
              >
                ← Dashboard
              </Link>

              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Workspace
                </p>

                <h1 className="mt-1 text-3xl font-bold tracking-tight">
                  Businesses
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                  Kelola bisnis yang akan dibuatkan website oleh GearOnStack.
                </p>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-7xl space-y-6 p-6 lg:p-8">
            {/* Search + Add */}
            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 md:flex-row md:items-center md:justify-between">
              <div className="flex-1">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari nama bisnis, kategori, lokasi..."
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
                />
              </div>

              <button className="rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                + Tambah Bisnis
              </button>
            </div>

            {/* Count */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">
                  {loading
                    ? "Loading..."
                    : `${filteredBusinesses.length} Business`}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Data berasal langsung dari Supabase.
                </p>
              </div>
            </div>

            {/* Business List */}
            {loading ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
                <p className="text-sm text-slate-500">
                  Loading businesses...
                </p>
              </div>
            ) : filteredBusinesses.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 font-bold">
                  G
                </div>

                <h2 className="mt-4 font-bold">
                  {search ? "Business tidak ditemukan" : "Belum ada business"}
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                  {search
                    ? "Coba gunakan kata pencarian yang berbeda."
                    : "Tambahkan business pertama untuk mulai membuat website."}
                </p>
              </div>
            ) : (
              <div className="grid gap-5">
                {filteredBusinesses.map((business) => (
                  <article
                    key={business.id}
                    className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-slate-300 hover:shadow-sm"
                  >
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-xl font-bold text-white">
                          {business.name.charAt(0)}
                        </div>

                        <Link
  href={`/businesses/${business.slug}/site`}
  className="text-lg font-bold transition hover:underline"
>
  {business.name}
</Link>

                          <p className="mt-1 text-sm text-slate-500">
                            {business.category || "Business"}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-2">
                            {business.source && (
                              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                                {business.source}
                              </span>
                            )}

                            {business.location && (
                              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                                {business.location}
                              </span>
                            )}

                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-600">
                              {business.status}
                            </span>
                          </div>

                          {business.description && (
                            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-500">
                              {business.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
  <Link
    href={`/businesses/${business.slug}/site`}
    className="rounded-lg bg-slate-950 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
  >
    View Website
  </Link>

  <Link
    href={`/businesses/${business.slug}/site`}
    className="rounded-lg border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
  >
    View Website
  </Link>

  <Link
    href={`/businesses/${business.slug}/settings`}
    className="rounded-lg border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
  >
    Edit
  </Link>
</div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}