"use client";

import { useState } from "react";

export default function WebsiteBuilder() {
  const [name, setName] = useState("Kapluk Grosir China");

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <h1 className="text-3xl font-bold">
        Website Builder
      </h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">

        <section className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-lg font-bold">
            Business Information
          </h2>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-4 w-full rounded-lg border p-3"
          />
        </section>

        <section className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">
            Live Preview
          </p>

          <h2 className="mt-4 text-2xl font-bold">
            {name}
          </h2>

          <p className="mt-2 text-slate-500">
            Website preview pelanggan
          </p>
        </section>

      </div>
    </main>
  );
}