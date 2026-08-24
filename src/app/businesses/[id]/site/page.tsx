"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Business = {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  location: string | null;
  description: string | null;
};

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  category: string | null;
};

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default function CustomerWebsite({ params }: Props) {
  const [business, setBusiness] = useState<Business | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWebsite() {
      const { id } = await params;
      const supabase = createClient();

      const { data: businessData, error: businessError } =
        await supabase
          .from("businesses")
          .select(
            "id, name, slug, category, location, description"
          )
          .eq("slug", id)
          .single();

      if (businessError || !businessData) {
        console.error(businessError);
        setLoading(false);
        return;
      }

      setBusiness(businessData);

      const { data: productData, error: productError } =
        await supabase
          .from("products")
          .select(
            "id, name, description, price, image_url, category"
          )
          .eq("business_id", businessData.id)
          .eq("status", "active")
          .order("created_at", {
            ascending: false,
          });

      if (productError) {
        console.error(productError);
      } else {
        setProducts(productData || []);
      }

      setLoading(false);
    }

    loadWebsite();
  }, [params]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-sm text-slate-500">
          Loading website...
        </p>
      </main>
    );
  }

  if (!business) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-xl font-bold">
            Website tidak ditemukan
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Business belum tersedia.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-slate-950">
      {/* NAVBAR */}

      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <a
            href="#home"
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-sm font-bold text-white">
              {business.name.charAt(0)}
            </div>

            <span className="text-sm font-bold">
              {business.name}
            </span>
          </a>

          <nav className="hidden gap-6 text-sm font-medium text-slate-600 sm:flex">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#products">Products</a>
            <a href="#contact">Contact</a>
          </nav>

          <a
            href="#contact"
            className="rounded-lg bg-slate-950 px-4 py-2.5 text-xs font-semibold text-white"
          >
            Contact
          </a>
        </div>
      </header>

      {/* HERO */}

      <section
        id="home"
        className="border-b border-slate-200 bg-slate-50"
      >
        <div className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
          <div className="max-w-3xl">
            {business.category && (
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                {business.category}
              </p>
            )}

            <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
              {business.name}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              {business.description ||
                "Temukan produk dan layanan terbaik dari bisnis kami."}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#products"
                className="rounded-lg bg-slate-950 px-6 py-3.5 text-center text-sm font-semibold text-white"
              >
                View Products
              </a>

              <a
                href="#contact"
                className="rounded-lg border border-slate-300 bg-white px-6 py-3.5 text-center text-sm font-semibold"
              >
                Contact Business
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}

      <section
        id="about"
        className="border-b border-slate-200 bg-white"
      >
        <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
            About
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight">
            Tentang {business.name}
          </h2>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            {business.description ||
              "Informasi mengenai bisnis akan ditampilkan di sini."}
          </p>

          {business.location && (
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Location
              </p>

              <p className="mt-1 text-sm font-medium">
                {business.location}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* PRODUCTS */}

      <section
        id="products"
        className="border-b border-slate-200 bg-slate-50"
      >
        <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              Products
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              Produk Kami
            </h2>

            <p className="mt-3 text-sm text-slate-500">
              Produk yang tersedia dari {business.name}.
            </p>
          </div>

          {products.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <p className="text-sm text-slate-500">
                Belum ada produk yang tersedia.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <article
                  key={product.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                >
                  <div className="aspect-square bg-slate-100">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-slate-400">
                        Product Image
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    {product.category && (
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {product.category}
                      </p>
                    )}

                    <h3 className="mt-1 text-sm font-bold">
                      {product.name}
                    </h3>

                    {product.description && (
                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
                        {product.description}
                      </p>
                    )}

                    <p className="mt-4 text-sm font-bold">
                      Rp{" "}
                      {Number(
                        product.price || 0
                      ).toLocaleString("id-ID")}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CONTACT */}

      <section
        id="contact"
        className="bg-slate-950 text-white"
      >
        <div className="mx-auto max-w-6xl px-5 py-16 text-center sm:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            Contact
          </p>

          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to connect with {business.name}?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-400">
            Hubungi bisnis untuk mendapatkan informasi lebih lanjut
            mengenai produk dan layanan.
          </p>

          <button className="mt-8 rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-slate-950">
            Contact Business
          </button>
        </div>
      </section>

      {/* FOOTER */}

      <footer className="bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <div>
            <p className="text-sm font-bold">
              {business.name}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Website powered by GearOnStack
            </p>
          </div>

          <p className="text-xs text-slate-400">
            © 2026 {business.name}
          </p>
        </div>
      </footer>
    </main>
  );
}