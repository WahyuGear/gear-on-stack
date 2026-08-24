import Link from "next/link";

const navigation = [
  { name: "Overview", href: "/dashboard" },
  { name: "Businesses", href: "/businesses" },
  { name: "Websites", href: "/businesses/kapluk-grosir-china/builder" },
  { name: "Templates", href: "/templates" },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
          {/* Brand */}
          <div className="border-b border-slate-200 px-6 py-5">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-sm font-bold text-white">
                G
              </div>

              <div>
                <p className="font-bold tracking-tight">GearOnStack</p>
                <p className="text-xs text-slate-400">
                  Business Workspace
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
            <p className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              Workspace
            </p>

            <div className="space-y-1">
              {navigation.map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    index === 0
                      ? "bg-slate-950 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>

          {/* User */}
          <div className="border-t border-slate-200 p-4">
            <Link
              href="/"
              className="block rounded-lg px-3 py-2.5 text-sm text-slate-600 transition hover:bg-slate-100"
            >
              ← Back to GearOnStack
            </Link>

            <div className="mt-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white">
                HW
              </div>

              <div>
                <p className="text-sm font-semibold">Workspace</p>
                <p className="text-xs text-slate-400">Administrator</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <section className="min-w-0 flex-1">
          {/* Header */}
          <header className="border-b border-slate-200 bg-white">
            <div className="flex items-center justify-between px-6 py-5 lg:px-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Workspace
                </p>

                <h1 className="mt-1 text-2xl font-bold tracking-tight">
                  Dashboard
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Build and manage your business websites.
                </p>
              </div>

              <Link
                href="/businesses"
                className="hidden rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 sm:block"
              >
                + Add Business
              </Link>
            </div>
          </header>

          <div className="space-y-8 p-6 lg:p-8">
            {/* Welcome */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 lg:p-8">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                GearOnStack Workspace
              </p>

              <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight">
                Build your business website from one workspace.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-500">
                Add a business, organize its information, choose a website
                direction, and build the experience your customers will see.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/businesses"
                  className="rounded-lg bg-slate-950 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  View Businesses
                </Link>

                <Link
                  href="/"
                  className="rounded-lg border border-slate-200 px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  View Public Website
                </Link>
              </div>
            </section>

            {/* Current Project */}
            <section>
              <div className="mb-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Current Project
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Business we're building
                </h2>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-lg font-bold text-white">
                      K
                    </div>

                    <div>
                      <p className="text-lg font-bold">
                        Kapluk Grosir China
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Fashion / Grosir
                      </p>

                      <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
                        First business demo for GearOnStack. This project will
                        become our real example for the website generation flow.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Link
                      href="/businesses/kapluk-grosir-china"
                      className="rounded-lg border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Business Detail
                    </Link>

                    <Link
                      href="/businesses/kapluk-grosir-china/builder"
                      className="rounded-lg bg-slate-950 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      Open Builder
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Workspace Areas */}
            <section>
              <div className="mb-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Workspace
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Manage your website projects
                </h2>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Link
                  href="/businesses"
                  className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-slate-300 hover:shadow-sm"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold">
                    B
                  </div>

                  <h3 className="mt-5 font-bold">Businesses</h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Manage the businesses you are building websites for.
                  </p>

                  <p className="mt-5 text-sm font-semibold">
                    Open Businesses →
                  </p>
                </Link>

                <Link
                  href="/businesses/kapluk-grosir-china/builder"
                  className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-slate-300 hover:shadow-sm"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold">
                    W
                  </div>

                  <h3 className="mt-5 font-bold">Websites</h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Build and preview the website for a selected business.
                  </p>

                  <p className="mt-5 text-sm font-semibold">
                    Open Builder →
                  </p>
                </Link>

                <Link
                  href="/templates"
                  className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-slate-300 hover:shadow-sm"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold">
                    T
                  </div>

                  <h3 className="mt-5 font-bold">Templates</h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Templates will become the visual foundation for generated
                    websites.
                  </p>

                  <p className="mt-5 text-sm font-semibold">
                    Explore Templates →
                  </p>
                </Link>
              </div>
            </section>

            {/* Next Step */}
            <section className="rounded-2xl bg-slate-950 p-6 text-white lg:p-8">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Next Step
              </p>

              <div className="mt-3 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    Build the Kapluk website.
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                    We will use Kapluk as the first real business case to
                    develop and test the GearOnStack website-building flow.
                  </p>
                </div>

                <Link
                  href="/businesses/kapluk-grosir-china/builder"
                  className="shrink-0 rounded-lg bg-white px-5 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
                >
                  Open Kapluk Builder
                </Link>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}