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

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default function BusinessDetailPage({ params }: Props) {
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadBusiness() {
      const { id } = await params;

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
        .eq("slug", id)
        .single();

      if (error || !data) {
        console.error("Business detail error:", error);
        setErrorMessage("Business tidak ditemukan.");
        setLoading(false);
        return;
      }

      setBusiness(data);
      setLoading(false);
    }

    loadBusiness();
  }, [params]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <p className="text-sm text-slate-500">
              Loading business...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!business) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
          <Link
            href="/businesses"
            className="text-sm font-medium text-slate-500 hover:text-slate-950"
          >
            ← Kembali ke Businesses
          </Link>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <h1 className="text-xl font-bold">Business tidak ditemukan</h1>

            <p className="mt-2 text-sm text-slate-500">
              {errorMessage}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 lg:px-8">
          <Link
            href="/businesses"
            className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
          >
            ← Businesses
          </Link>

          <Link
  href={`/businesses/${business.slug}/site`}
  className="rounded-lg bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
>
  View Website
</Link>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-6xl space-y-6 px-6 py-8 lg:px-8 lg:py-10">
        {/* Business Hero */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 lg:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-2xl font-bold text-white">
                {business.name.charAt(0)}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-3xl font-bold tracking-tight">
                    {business.name}
                  </h1>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-600">
                    {business.status}
                  </span>
                </div>

                <p className="mt-2 text-base text-slate-500">
                  {business.category || "Business"}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {business.source && (
                    <span className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500">
                      Source: {business.source}
                    </span>
                  )}

                  {business.location && (
                    <span className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500">
                      {business.location}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <Link
  href={`/businesses/${business.slug}/site`}
  className="inline-flex rounded-lg bg-slate-950 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
>
  View Website →
</Link>
          </div>
        </section>

        {/* Business Information */}
        <div className="grid gap-6 lg:grid-cols-3">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Business Information
            </p>

            <h2 className="mt-2 text-xl font-bold">
              Tentang Business
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-600">
              {business.description ||
                "Belum ada deskripsi business. Informasi ini nantinya akan digunakan GearOnStack untuk membantu membuat website."}
            </p>
          </section>

          {/* Status */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Website
            </p>

            <h2 className="mt-2 text-xl font-bold">
              Ready to Build
            </h2>

            <div className="mt-6 space-y-4">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-400">
                  Business ID
                </p>

                <p className="mt-1 break-all text-sm font-semibold">
                  {business.id}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-400">
                  Slug
                </p>

                <p className="mt-1 break-all text-sm font-semibold">
                  {business.slug}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-400">
                  Created
                </p>

                <p className="mt-1 text-sm font-semibold">
                  {new Date(
                    business.created_at
                  ).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Builder CTA */}
        <section className="rounded-2xl bg-slate-950 p-8 text-white lg:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                GearOnStack Website Builder
              </p>

              <h2 className="mt-3 text-2xl font-bold">
                View {business.name}'s website
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Lihat tampilan website customer yang dibuat untuk business ini.
              </p>
            </div>

            <Link
  href={`/businesses/${business.slug}/site`}
  className="shrink-0 rounded-lg bg-white px-6 py-3.5 text-center text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
>
  View Website
</Link>
          </div>
        </section>
      </div>
    </main>
  );
}