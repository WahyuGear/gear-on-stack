import Link from "next/link";

const features = [
  "Business-focused design",
  "Product & service showcase",
  "Mobile-ready website",
  "Easy customer contact",
];

const whatsappUrl =
  "https://wa.me/6285337338786?text=Halo%20GearOnStack%2C%20saya%20tertarik%20untuk%20membuat%20website%20untuk%20bisnis%20saya.";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-sm font-bold text-white">
              G
            </div>

            <span className="text-lg font-bold tracking-tight">
              GearOnStack
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a
              href="#features"
              className="transition hover:text-slate-950"
            >
              Features
            </a>

            <a
              href="#demo"
              className="transition hover:text-slate-950"
            >
              Demo
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-slate-950"
            >
              Contact
            </a>
          </nav>

          <Link
            href="/login"
            className="rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Client Portal
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="overflow-hidden border-b border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 py-20 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-28">
          <div>
            <div className="mb-6 inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600">
              Website platform for businesses
            </div>

            <h1 className="max-w-2xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
              Your business deserves a better website.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              GearOnStack helps businesses turn their information, products,
              and identity into a professional website.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-slate-950 px-6 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Contact Us
              </a>

              <a
                href="#demo"
                className="rounded-lg border border-slate-300 bg-white px-6 py-3.5 text-center text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                See Demo
              </a>
            </div>
          </div>

          {/* Hero Website Mockup */}
          <div className="relative">
            <div className="absolute -inset-6 rounded-[2rem] bg-slate-200/50 blur-2xl" />

            <div className="relative rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
              <div className="overflow-hidden rounded-xl border border-slate-200">
                {/* Browser Bar */}
                <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                  <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                  <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />

                  <div className="ml-4 flex-1 rounded-md bg-white px-3 py-1.5 text-[10px] text-slate-400">
                    yourbusiness.gearonstack.com
                  </div>
                </div>

                {/* Website Preview */}
                <div className="bg-white p-6 sm:p-8">
                  <div className="flex items-center justify-between">
                    <div className="h-5 w-28 rounded bg-slate-950" />

                    <div className="flex gap-2">
                      <div className="h-2 w-10 rounded bg-slate-200" />
                      <div className="h-2 w-10 rounded bg-slate-200" />
                      <div className="h-2 w-10 rounded bg-slate-200" />
                    </div>
                  </div>

                  <div className="mt-10">
                    <div className="h-4 w-24 rounded bg-slate-200" />

                    <div className="mt-4 h-10 max-w-md rounded bg-slate-950" />

                    <div className="mt-3 h-3 max-w-sm rounded bg-slate-200" />

                    <div className="mt-2 h-3 max-w-xs rounded bg-slate-200" />

                    <div className="mt-6 h-10 w-32 rounded-lg bg-slate-950" />
                  </div>

                  <div className="mt-10 grid grid-cols-3 gap-3">
                    <div className="h-24 rounded-lg bg-slate-100" />
                    <div className="h-24 rounded-lg bg-slate-100" />
                    <div className="h-24 rounded-lg bg-slate-100" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Built for business
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything your business website needs.
            </h2>

            <p className="mt-5 max-w-xl leading-7 text-slate-600">
              GearOnStack focuses on the things that matter most: presenting
              your business clearly and making it easy for customers to reach
              you.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature}
                className="rounded-xl border border-slate-200 p-5"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white">
                  ✓
                </div>

                <p className="mt-5 text-sm font-semibold">
                  {feature}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo */}
      <section id="demo" className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                First business demo
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Meet Kapluk Grosir China.
              </h2>

              <p className="mt-5 max-w-xl leading-7 text-slate-400">
                Kapluk is our first business case for GearOnStack — showing
                how a real business can become a professional digital
                storefront.
              </p>

              <Link
                href="/businesses/kapluk-grosir-china/site"
                className="mt-8 inline-flex rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
              >
                View Website →
              </Link>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <div className="rounded-xl bg-white p-6 text-slate-950">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-400">
                      Business Demo
                    </p>

                    <h3 className="mt-2 text-xl font-bold">
                      Kapluk Grosir China
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Fashion / Grosir
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-sm font-bold text-white">
                    K
                  </div>
                </div>

                <div className="mt-7 grid grid-cols-3 gap-3">
                  <div className="h-24 rounded-lg bg-slate-100" />
                  <div className="h-24 rounded-lg bg-slate-100" />
                  <div className="h-24 rounded-lg bg-slate-100" />
                </div>

                <div className="mt-5 h-10 rounded-lg bg-slate-950" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center lg:py-24">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to grow your business online?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-slate-600">
            Tell us about your business and let&apos;s build something
            professional together.
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex rounded-lg bg-slate-950 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Contact Us
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div>
            <p className="font-bold">GearOnStack</p>

            <p className="mt-1 text-xs text-slate-500">
              Professional websites for businesses.
            </p>
          </div>

          <div className="flex items-center gap-5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-slate-600 transition hover:text-slate-950"
            >
              Contact Us
            </a>

            <Link
              href="/login"
              className="text-xs font-semibold text-slate-600 transition hover:text-slate-950"
            >
              Client Portal
            </Link>

            <p className="text-xs text-slate-400">
              © 2026 GearOnStack
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
