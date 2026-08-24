"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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

export default function DashboardPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      setUserEmail(user.email ?? "");

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

    loadDashboard();
  }, []);

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
                className="block rounded-lg bg-slate-950 px-3 py-2.5 text-sm font-medium text-white"
              >
                Dashboard
              </Link>

              <Link
                href="/businesses"
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
              >
                Businesses
              </Link>

              <button className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-100">
                Websites
              </button>

              <button className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-100">
                Templates
              </button>

              <button className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-100">
                Settings
              </button>
            </div>
          </nav>

          <div className="border-t border-slate-200 p-4">
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="truncate text-sm font-semibold">Admin</p>
              <p className="mt-1 truncate text-xs text-slate-500">
                {userEmail}
              </p>
            </div>
          </div>
        </aside>

        {/* Main */}
        <section className="min-w-0 flex-1">
          <header className="border-b border-slate-200 bg-white px-6 py-5 lg:px-8">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Workspace
                </p>

                <h1 className="mt-1 text-2xl font-bold tracking-tight">
                  Dashboard
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Kelola bisnis dan website pelanggan dari satu tempat.
                </p>
              </div>

              <div className="hidden h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white sm:flex">
                HW
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-7xl space-y-8 p-6 lg:p-8">
            {/* Welcome */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 lg:p-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                GearOnStack
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight">
                Build websites for your businesses.
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                Tambahkan bisnis, pilih template, lalu bangun website
                profesional untuk pelanggan.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/businesses"
                  className="rounded-lg bg-slate-950 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Manage Businesses
                </Link>

                <button className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50">
                  Create Website
                </button>
              </div>
            </section>

            {/* Stats */}
            <section className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <p className="text-sm text-slate-500">Businesses</p>
                <p className="mt-3 text-3xl font-bold">
                  {loading ? "—" : businesses.length}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <p className="text-sm text-slate-500">Websites</p>
                <p className="mt-3 text-3xl font-bold">0</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <p className="text-sm text-slate-500">Templates</p>
                <p className="mt-3 text-3xl font-bold">0</p>
              </div>
            </section>

            {/* Businesses */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-bold">Your Businesses</h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Data bisnis berasal langsung dari Supabase.
                  </p>
                </div>

                <Link
                  href="/businesses"
                  className="text-sm font-semibold text-slate-900 underline"
                >
                  View all
                </Link>
              </div>

              {loading ? (
                <div className="p-8 text-sm text-slate-500">
                  Loading businesses...
                </div>
              ) : businesses.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="font-semibold">Belum ada bisnis</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Tambahkan bisnis pertama untuk mulai membuat website.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {businesses.map((business) => (
                    <div
                      key={business.id}
                      className="flex flex-col gap-5 px-6 py-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-lg font-bold text-white">
                          {business.name.charAt(0)}
                        </div>

                        <div>
                          <h3 className="font-bold">{business.name}</h3>

                          <p className="mt-1 text-sm text-slate-500">
                            {business.category || "Business"}
                          </p>

                          <div className="mt-2 flex flex-wrap gap-2">
                            {business.source && (
                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                                {business.source}
                              </span>
                            )}

                            {business.location && (
                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                                {business.location}
                              </span>
                            )}

                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs capitalize text-slate-600">
                              {business.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Link
                        href={`/businesses/${business.slug}`}
                        className="rounded-lg bg-slate-950 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
                      >
                        Open Business
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}