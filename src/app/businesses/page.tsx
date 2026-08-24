import Link from "next/link";

const businesses = [
  {
    id: "kapluk-grosir-china",
    name: "Kapluk Grosir China",
    category: "Fashion / Grosir",
    source: "Facebook",
    status: "Analyzed",
    location: "NTB",
    products: 12,
  },
  {
    id: "roti-lombok",
    name: "Roti Lombok",
    category: "Bakery",
    source: "Instagram",
    status: "Website Ready",
    location: "Mataram",
    products: 18,
  },
  {
    id: "toko-oleh-oleh-ntb",
    name: "Toko Oleh-Oleh NTB",
    category: "Souvenir",
    source: "Google Business",
    status: "Analyzed",
    location: "Lombok",
    products: 25,
  },
];

export default function BusinessesPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-8">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Workspace
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight">
              Businesses
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Kelola bisnis yang akan dibuatkan website.
            </p>
          </div>

          <button className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
            + Tambah Bisnis
          </button>
        </div>

        {/* Search */}
        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-4">
          <input
            type="text"
            placeholder="Cari nama bisnis, kategori, atau lokasi..."
            className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-900"
          />
        </div>

        {/* Business List */}
        <div className="mt-6 grid gap-5">
          {businesses.map((business) => (
            <div
              key={business.id}
              className="rounded-xl border border-slate-200 bg-white p-6 transition hover:border-slate-300"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                <div className="flex items-start gap-4">

                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xl font-bold">
                    {business.name.charAt(0)}
                  </div>

                  <div>
                    <h2 className="text-lg font-bold">
                      {business.name}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {business.category}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">
                        {business.source}
                      </span>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">
                        {business.location}
                      </span>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">
                        {business.products} Produk
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

                  <span className="rounded-full border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600">
                    {business.status}
                  </span>

                  <Link
                    href={`/businesses/${business.id}`}
                    className="rounded-lg bg-slate-900 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    Lihat Detail
                  </Link>

                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}