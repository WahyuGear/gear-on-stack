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
};

type Template = "starter" | "modern" | "professional";
type PreviewMode = "mobile" | "tablet" | "desktop";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default function BuilderPage({ params }: Props) {
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<"business" | "template">(
    "template"
  );

  const [template, setTemplate] = useState<Template>("modern");

  const [previewMode, setPreviewMode] =
    useState<PreviewMode>("mobile");

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

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
          "id, name, slug, category, description, source, location, status"
        )
        .eq("slug", id)
        .single();

      if (error || !data) {
        console.error("Builder error:", error);
        setLoading(false);
        return;
      }

      setBusiness(data);

      setName(data.name || "");
      setCategory(data.category || "");
      setDescription(data.description || "");
      setLocation(data.location || "");

      setLoading(false);
    }

    loadBusiness();
  }, [params]);

  async function saveBusiness() {
    if (!business) return;

    setSaving(true);
    setSaved(false);

    const supabase = createClient();

    const { error } = await supabase
      .from("businesses")
      .update({
        name,
        category,
        description,
        location,
      })
      .eq("id", business.id);

    if (error) {
      console.error("Save error:", error);
      setSaving(false);
      return;
    }

    setBusiness({
      ...business,
      name,
      category,
      description,
      location,
    });

    setSaving(false);
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-sm text-slate-500">
          Loading builder...
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
            href="/businesses"
            className="mt-5 inline-block text-sm font-semibold underline"
          >
            Kembali ke Businesses
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-slate-100 text-slate-950">
      {/* TOP BAR */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href={`/businesses/${business.slug}`}
            className="text-lg text-slate-500 hover:text-slate-950"
          >
            ←
          </Link>

          <div className="h-6 w-px bg-slate-200" />

          <div className="min-w-0">
            <p className="truncate text-sm font-bold">
              Website Builder
            </p>

            <p className="truncate text-xs text-slate-500">
              {business.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {saved && (
            <span className="hidden text-xs font-medium text-slate-500 sm:block">
              Changes saved
            </span>
          )}

          <Link
            href={`/businesses/${business.slug}/settings`}
            className="hidden rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 sm:block"
          >
            Edit Business
          </Link>

          <Link
            href={`/businesses/${business.slug}/products`}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Products
          </Link>

          <button
            onClick={saveBusiness}
            disabled={saving}
            className="rounded-lg bg-slate-950 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-60 sm:px-4 sm:text-sm"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* LEFT SETTINGS */}
        <aside className="w-[320px] shrink-0 overflow-y-auto border-r border-slate-200 bg-white">
          <div className="border-b border-slate-200 p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
              GearOnStack
            </p>

            <h1 className="mt-2 text-lg font-bold">
              {business.name}
            </h1>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Build your business website.
            </p>
          </div>

          {/* TABS */}
          <div className="border-b border-slate-200 p-3">
            <div className="grid grid-cols-2 rounded-lg bg-slate-100 p-1">
              <button
                onClick={() => setActiveTab("business")}
                className={`rounded-md px-3 py-2 text-xs font-semibold ${
                  activeTab === "business"
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-slate-500"
                }`}
              >
                Business
              </button>

              <button
                onClick={() => setActiveTab("template")}
                className={`rounded-md px-3 py-2 text-xs font-semibold ${
                  activeTab === "template"
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-slate-500"
                }`}
              >
                Template
              </button>
            </div>
          </div>

          {/* BUSINESS SETTINGS */}
          {activeTab === "business" && (
            <div className="space-y-5 p-5">
              <Field
                label="Business Name"
                value={name}
                onChange={setName}
              />

              <Field
                label="Category"
                value={category}
                onChange={setCategory}
              />

              <Field
                label="Location"
                value={location}
                onChange={setLocation}
              />

              <div>
                <label className="text-xs font-semibold text-slate-600">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  className="mt-2 w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-950"
                />
              </div>

              <InfoBox
                title="Business Source"
                value={business.source || "Not available"}
              />

              <InfoBox
                title="Status"
                value={business.status}
              />
            </div>
          )}

          {/* TEMPLATE SETTINGS */}
          {activeTab === "template" && (
            <div className="space-y-4 p-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  Website Templates
                </p>

                <h2 className="mt-2 text-lg font-bold">
                  Choose your style
                </h2>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Every GearOnStack template is built mobile-first.
                </p>
              </div>

              <TemplateCard
                title="Business Starter"
                description="Simple business website"
                active={template === "starter"}
                onClick={() => setTemplate("starter")}
                type="starter"
              />

              <TemplateCard
                title="Modern Store"
                description="Best for shops & products"
                active={template === "modern"}
                onClick={() => setTemplate("modern")}
                type="modern"
              />

              <TemplateCard
                title="Professional"
                description="For services & companies"
                active={template === "professional"}
                onClick={() => setTemplate("professional")}
                type="professional"
              />
            </div>
          )}
        </aside>

        {/* PREVIEW */}
        <section className="flex min-w-0 flex-1 flex-col overflow-hidden bg-slate-200">
          {/* PREVIEW BAR */}
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-300 bg-white px-4">
            <div>
              <p className="text-sm font-semibold">
                Live Preview
              </p>

              <p className="text-[10px] text-slate-400 sm:text-xs">
                Customer website preview
              </p>
            </div>

            {/* DEVICE SWITCH */}
            <div className="flex items-center rounded-lg bg-slate-100 p-1">
              <DeviceButton
                active={previewMode === "mobile"}
                onClick={() => setPreviewMode("mobile")}
              >
                Mobile
              </DeviceButton>

              <DeviceButton
                active={previewMode === "tablet"}
                onClick={() => setPreviewMode("tablet")}
              >
                Tablet
              </DeviceButton>

              <DeviceButton
                active={previewMode === "desktop"}
                onClick={() => setPreviewMode("desktop")}
              >
                Desktop
              </DeviceButton>
            </div>
          </div>

          {/* PREVIEW CANVAS */}
          <div className="min-h-0 flex-1 overflow-auto p-4 sm:p-8">
            <div className="flex min-h-full justify-center">
              <div
                className={`
                  overflow-hidden bg-white shadow-xl transition-all duration-300
                  ${
                    previewMode === "mobile"
                      ? "w-[390px] max-w-full rounded-[28px] border-[8px] border-slate-900"
                      : previewMode === "tablet"
                        ? "w-[768px] max-w-full rounded-2xl border border-slate-300"
                        : "w-full max-w-6xl rounded-xl border border-slate-300"
                  }
                `}
              >
                {template === "starter" && (
                  <StarterTemplate
                    name={name}
                    category={category}
                    description={description}
                    location={location}
                  />
                )}

                {template === "modern" && (
                  <ModernStoreTemplate
                    name={name}
                    category={category}
                    description={description}
                    location={location}
                  />
                )}

                {template === "professional" && (
                  <ProfessionalTemplate
                    name={name}
                    category={category}
                    description={description}
                    location={location}
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

/* ============================================================
   FIELD
============================================================ */

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-600">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-950"
      />
    </div>
  );
}

/* ============================================================
   INFO BOX
============================================================ */

function InfoBox({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {title}
      </p>

      <p className="mt-1 text-sm font-medium capitalize">
        {value}
      </p>
    </div>
  );
}

/* ============================================================
   DEVICE BUTTON
============================================================ */

function DeviceButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-2.5 py-1.5 text-[10px] font-semibold transition sm:px-3 sm:text-xs ${
        active
          ? "bg-white text-slate-950 shadow-sm"
          : "text-slate-400 hover:text-slate-700"
      }`}
    >
      {children}
    </button>
  );
}

/* ============================================================
   TEMPLATE CARD
============================================================ */

function TemplateCard({
  title,
  description,
  active,
  onClick,
  type,
}: {
  title: string;
  description: string;
  active: boolean;
  onClick: () => void;
  type: Template;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-xl border-2 p-3 text-left transition ${
        active
          ? "border-slate-950"
          : "border-slate-200 hover:border-slate-400"
      }`}
    >
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="mx-auto w-[150px] py-3">
          {type === "starter" && (
            <div>
              <div className="flex items-center justify-between">
                <div className="h-2.5 w-12 rounded bg-slate-950" />
                <div className="h-2 w-5 rounded bg-slate-200" />
              </div>

              <div className="mt-5 h-7 w-24 rounded bg-slate-950" />
              <div className="mt-2 h-2 w-20 rounded bg-slate-200" />
              <div className="mt-4 h-7 w-16 rounded bg-slate-950" />
              <div className="mt-5 h-20 rounded bg-slate-100" />
            </div>
          )}

          {type === "modern" && (
            <div>
              <div className="rounded bg-slate-950 p-3">
                <div className="h-2.5 w-12 rounded bg-white" />

                <div className="mt-5 h-7 w-24 rounded bg-white/80" />

                <div className="mt-2 h-2 w-20 rounded bg-white/30" />

                <div className="mt-4 h-7 w-16 rounded bg-white" />
              </div>

              <div className="mt-3 h-2 w-20 rounded bg-slate-950" />

              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="h-20 rounded bg-slate-100" />
                <div className="h-20 rounded bg-slate-100" />
              </div>
            </div>
          )}

          {type === "professional" && (
            <div>
              <div className="flex items-center justify-between">
                <div className="h-2.5 w-12 rounded bg-slate-950" />
                <div className="h-2 w-8 rounded bg-slate-200" />
              </div>

              <div className="mt-6 h-7 w-28 rounded bg-slate-950" />
              <div className="mt-2 h-2 w-20 rounded bg-slate-200" />

              <div className="mt-5 grid grid-cols-3 gap-1">
                <div className="h-12 rounded bg-slate-50" />
                <div className="h-12 rounded bg-slate-50" />
                <div className="h-12 rounded bg-slate-50" />
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="mt-3 text-sm font-bold">
        {title}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>
    </button>
  );
}

/* ============================================================
   STARTER TEMPLATE
============================================================ */

function StarterTemplate({
  name,
  category,
  description,
  location,
}: {
  name: string;
  category: string;
  description: string;
  location: string;
}) {
  return (
    <div className="bg-white">
      {/* HEADER */}
      <header className="border-b border-slate-200 px-5 py-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold">
            {name || "Your Business"}
          </p>

          <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200">
            ☰
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="px-5 py-14 sm:px-10 sm:py-20">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
          {category || "Business"}
        </p>

        <h1 className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
          {name || "Your Business"}
        </h1>

        <p className="mt-5 text-sm leading-6 text-slate-500">
          {description ||
            "Tell customers about your business."}
        </p>

        <button className="mt-7 w-full rounded-lg bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white sm:w-auto">
          Contact Business
        </button>
      </section>

      {/* ABOUT */}
      <section className="border-t border-slate-200 bg-slate-50 px-5 py-12 sm:px-10 sm:py-16">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
          About
        </p>

        <h2 className="mt-3 text-2xl font-bold">
          {name}
        </h2>

        <p className="mt-4 text-sm leading-6 text-slate-500">
          {description ||
            "Business information goes here."}
        </p>
      </section>

      {/* CONTACT */}
      <section className="px-5 py-12 sm:px-10 sm:py-16">
        <h2 className="text-2xl font-bold">
          Ready to connect?
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          Contact {name || "this business"} directly.
        </p>

        <button className="mt-6 w-full rounded-lg bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white">
          Contact Business
        </button>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 px-5 py-6">
        <p className="text-sm font-bold">
          {name}
        </p>

        <p className="mt-1 text-xs text-slate-400">
          {location}
        </p>

        <p className="mt-4 text-[10px] text-slate-400">
          Website powered by GearOnStack
        </p>
      </footer>
    </div>
  );
}

/* ============================================================
   MODERN STORE TEMPLATE
============================================================ */

function ModernStoreTemplate({
  name,
  category,
  description,
  location,
}: {
  name: string;
  category: string;
  description: string;
  location: string;
}) {
  return (
    <div className="bg-white">
      {/* HEADER */}
      <header className="bg-slate-950 px-5 py-4 text-white">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold">
            {name || "Store"}
          </p>

          <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700">
            ☰
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-slate-950 px-5 pb-14 pt-10 text-white sm:px-10 sm:pb-20">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
          {category || "Fashion / Grosir"}
        </p>

        <h1 className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
          {name || "Your Store"}
        </h1>

        <p className="mt-5 text-sm leading-6 text-slate-400">
          {description ||
            "Discover our products and services."}
        </p>

        <button className="mt-7 w-full rounded-lg bg-white px-5 py-3.5 text-sm font-semibold text-slate-950">
          View Products
        </button>
      </section>

      {/* PRODUCTS */}
      <section className="px-5 py-12 sm:px-10 sm:py-16">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
          Products
        </p>

        <h2 className="mt-3 text-2xl font-bold">
          Featured Products
        </h2>

        <div className="mt-7 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item}>
              <div className="aspect-square overflow-hidden rounded-xl bg-slate-100">
                <div className="flex h-full items-center justify-center text-xs text-slate-400">
                  Product image
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-bold">
                  Product {item}
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Product description
                </p>

                <p className="mt-3 text-sm font-bold">
                  Rp 0
                </p>

                <button className="mt-3 w-full rounded-lg border border-slate-200 px-4 py-3 text-xs font-semibold">
                  View Product
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="bg-slate-50 px-5 py-12 sm:px-10 sm:py-16">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
          About
        </p>

        <h2 className="mt-3 text-2xl font-bold">
          About {name}
        </h2>

        <p className="mt-4 text-sm leading-6 text-slate-500">
          {description ||
            "About this business."}
        </p>

        {location && (
          <p className="mt-4 text-xs font-semibold">
            {location}
          </p>
        )}
      </section>

      {/* WHATSAPP CTA */}
      <section className="bg-slate-950 px-5 py-12 text-white sm:px-10 sm:py-16">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
          Order
        </p>

        <h2 className="mt-3 text-2xl font-bold">
          Ready to order?
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          Contact {name || "this business"} directly.
        </p>

        <button className="mt-7 flex w-full items-center justify-center gap-2 rounded-lg bg-white px-5 py-3.5 text-sm font-semibold text-slate-950">
          <span>💬</span>
          Order via WhatsApp
        </button>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 px-5 py-6">
        <p className="text-sm font-bold">
          {name}
        </p>

        <p className="mt-1 text-xs text-slate-400">
          {location}
        </p>

        <p className="mt-4 text-[10px] text-slate-400">
          Website powered by GearOnStack
        </p>
      </footer>
    </div>
  );
}

/* ============================================================
   PROFESSIONAL TEMPLATE
============================================================ */

function ProfessionalTemplate({
  name,
  category,
  description,
  location,
}: {
  name: string;
  category: string;
  description: string;
  location: string;
}) {
  return (
    <div className="bg-white">
      {/* HEADER */}
      <header className="border-b border-slate-200 px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">
              {name || "Your Company"}
            </p>

            <p className="mt-1 truncate text-[10px] text-slate-400">
              {category || "Professional Services"}
            </p>
          </div>

          <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200">
            ☰
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="px-5 py-14 sm:px-10 sm:py-20">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
          {category || "Professional Services"}
        </p>

        <h1 className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
          {name || "Your Company"}
        </h1>

        <p className="mt-5 text-sm leading-6 text-slate-500">
          {description ||
            "Professional business information and services."}
        </p>

        <button className="mt-7 w-full rounded-lg bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white sm:w-auto">
          Get in Touch
        </button>
      </section>

      {/* BUSINESS INFO */}
      <section className="border-y border-slate-200 bg-slate-50 px-5 py-10 sm:px-10 sm:py-14">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <InfoItem
            title="Business"
            value={name}
          />

          <InfoItem
            title="Category"
            value={category || "Not available"}
          />

          <InfoItem
            title="Location"
            value={location || "Not available"}
          />
        </div>
      </section>

      {/* ABOUT */}
      <section className="px-5 py-12 sm:px-10 sm:py-16">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
          About
        </p>

        <h2 className="mt-3 text-2xl font-bold">
          {name}
        </h2>

        <p className="mt-4 text-sm leading-6 text-slate-500">
          {description ||
            "Business description goes here."}
        </p>
      </section>

      {/* CTA */}
      <section className="bg-slate-950 px-5 py-12 text-white sm:px-10 sm:py-16">
        <h2 className="text-2xl font-bold">
          Let&apos;s work together.
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          Contact {name || "our business"} for more information.
        </p>

        <button className="mt-7 w-full rounded-lg bg-white px-5 py-3.5 text-sm font-semibold text-slate-950">
          Contact Business
        </button>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 px-5 py-6">
        <p className="text-sm font-bold">
          {name}
        </p>

        <p className="mt-1 text-xs text-slate-400">
          {location}
        </p>

        <p className="mt-4 text-[10px] text-slate-400">
          Website powered by GearOnStack
        </p>
      </footer>
    </div>
  );
}

/* ============================================================
   INFO ITEM
============================================================ */

function InfoItem({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
        {title}
      </p>

      <p className="mt-2 text-sm font-bold">
        {value || "Not available"}
      </p>
    </div>
  );
}