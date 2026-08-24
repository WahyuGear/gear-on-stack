"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Business = {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  location: string | null;
  description: string | null;
  facebook: string | null;
  instagram: string | null;
  whatsapp: string | null;
};

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default function BusinessSettingsPage({ params }: Props) {
  const [business, setBusiness] = useState<Business | null>(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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
        .select("*")
        .eq("slug", id)
        .single();

      if (error) {
        console.log("LOAD BUSINESS ERROR:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });

        alert(
          `Gagal memuat business.\n\nCode: ${
            error.code || "-"
          }\nMessage: ${error.message || "-"}\nDetails: ${
            error.details || "-"
          }\nHint: ${error.hint || "-"}`
        );

        setLoading(false);
        return;
      }

      if (!data) {
        console.log("BUSINESS DATA KOSONG");

        setLoading(false);
        return;
      }

      setBusiness(data);

      setName(data.name || "");
      setCategory(data.category || "");
      setLocation(data.location || "");
      setDescription(data.description || "");
      setFacebook(data.facebook || "");
      setInstagram(data.instagram || "");
      setWhatsapp(data.whatsapp || "");

      setLoading(false);
    }

    loadBusiness();
  }, [params]);

  async function saveChanges() {
    if (!business) return;

    if (!name.trim()) {
      alert("Nama bisnis wajib diisi.");
      return;
    }

    setSaving(true);
    setSaved(false);

    const supabase = createClient();

    const { data, error } = await supabase
      .from("businesses")
      .update({
        name: name.trim(),
        category: category.trim() || null,
        location: location.trim() || null,
        description: description.trim() || null,
        facebook: facebook.trim() || null,
        instagram: instagram.trim() || null,
        whatsapp: whatsapp.trim() || null,
      })
      .eq("id", business.id)
      .select()
      .single();

    if (error) {
      console.log("SAVE BUSINESS ERROR:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });

      alert(
        `Gagal menyimpan perubahan.\n\nCode: ${
          error.code || "-"
        }\nMessage: ${error.message || "-"}\nDetails: ${
          error.details || "-"
        }\nHint: ${error.hint || "-"}`
      );

      setSaving(false);
      return;
    }

    if (!data) {
      console.log("SAVE BERHASIL TAPI DATA KOSONG");

      alert(
        "Perubahan belum bisa dikonfirmasi karena data tidak dikembalikan."
      );

      setSaving(false);
      return;
    }

    setBusiness(data);

    setName(data.name || "");
    setCategory(data.category || "");
    setLocation(data.location || "");
    setDescription(data.description || "");
    setFacebook(data.facebook || "");
    setInstagram(data.instagram || "");
    setWhatsapp(data.whatsapp || "");

    setSaving(false);
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-sm text-slate-500">
          Loading business...
        </p>
      </main>
    );
  }

  if (!business) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <h1 className="text-xl font-bold">
            Business tidak ditemukan
          </h1>

          <Link
            href="/dashboard"
            className="mt-5 inline-block text-sm font-semibold underline"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link
              href={`/businesses/${business.slug}/builder`}
              className="text-sm font-medium text-slate-500 hover:text-slate-950"
            >
              ← Builder
            </Link>

            <div className="h-5 w-px bg-slate-200" />

            <div>
              <p className="text-sm font-bold">
                Business Settings
              </p>

              <p className="text-xs text-slate-400">
                {business.name}
              </p>
            </div>
          </div>

          <button
            onClick={saveChanges}
            disabled={saving}
            className="rounded-lg bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
            Business Information
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            {business.name}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Atur informasi yang akan ditampilkan pada customer website.
          </p>
        </div>

        {saved && (
          <div className="mt-6 rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold">
            ✓ Changes saved successfully
          </div>
        )}

        <div className="mt-8 space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="border-b border-slate-100 pb-5">
              <h2 className="text-base font-bold">
                Basic Information
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Informasi utama bisnis.
              </p>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <label className="text-xs font-semibold text-slate-600">
                  Business Name
                </label>

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama bisnis"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-slate-600">
                    Category
                  </label>

                  <input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Fashion / Grosir"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600">
                    Location
                  </label>

                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="NTB"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  placeholder="Deskripsikan bisnis Anda..."
                  className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none transition focus:border-slate-950"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="border-b border-slate-100 pb-5">
              <h2 className="text-base font-bold">
                Social & Contact
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Hubungkan customer dengan bisnis Anda.
              </p>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <label className="text-xs font-semibold text-slate-600">
                  Facebook
                </label>

                <input
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="https://facebook.com/..."
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600">
                  Instagram
                </label>

                <input
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600">
                  WhatsApp
                </label>

                <input
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="628xxxxxxxxxx"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
                />

                <p className="mt-2 text-xs text-slate-400">
                  Gunakan format internasional, contoh: 628123456789.
                </p>
              </div>
            </div>
          </section>

          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5">
            <div>
              <p className="text-sm font-bold">
                Ready to publish your changes?
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Perubahan akan digunakan oleh customer website.
              </p>
            </div>

            <button
              onClick={saveChanges}
              disabled={saving}
              className="rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}