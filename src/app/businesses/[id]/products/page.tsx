"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Product = {
  id: string;
  business_id: string;
  name: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  category: string | null;
  status: string;
  created_at: string;
};

type Business = {
  id: string;
  name: string;
  slug: string;
};

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default function ProductsPage({ params }: Props) {
  const [business, setBusiness] = useState<Business | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("active");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] =
    useState<string | null>(null);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      const { id } = await params;
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      const { data: businessData, error: businessError } =
        await supabase
          .from("businesses")
          .select("id, name, slug")
          .eq("slug", id)
          .single();

      if (businessError || !businessData) {
        console.error(businessError);
        setLoading(false);
        return;
      }

      setBusiness(businessData);

      await loadProducts(businessData.id);

      setLoading(false);
    }

    loadData();
  }, [params]);

  async function loadProducts(businessId: string) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("products")
      .select(
        "id, business_id, name, description, price, image_url, category, status, created_at"
      )
      .eq("business_id", businessId)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);
      return;
    }

    setProducts(data || []);
  }

  function resetForm() {
    setName("");
    setCategory("");
    setPrice("");
    setDescription("");
    setStatus("active");
    setImageFile(null);

    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview(null);
    setEditingProduct(null);
  }

  function closeForm() {
    if (saving) return;

    resetForm();
    setShowForm(false);
  }

  function openAddForm() {
    resetForm();
    setShowForm(true);
  }

  function openEditForm(product: Product) {
    setEditingProduct(product);

    setName(product.name);
    setCategory(product.category || "");
    setPrice(
      product.price !== null
        ? String(product.price)
        : ""
    );
    setDescription(product.description || "");
    setStatus(product.status);

    setImageFile(null);
    setImagePreview(product.image_url);

    setShowForm(true);
  }

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran gambar maksimal 5 MB.");
      return;
    }

    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function uploadImage(file: File) {
    if (!business) return null;

    const supabase = createClient();

    const fileExtension =
      file.name.split(".").pop()?.toLowerCase() || "jpg";

    const safeName = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const fileName = `${Date.now()}-${safeName}.${fileExtension}`;

    const filePath = `${business.id}/${fileName}`;

    const { error } = await supabase.storage
      .from("product-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (error) {
      console.error(error);
      return null;
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    return publicUrl;
  }

  async function saveProduct() {
    if (!business) return;

    if (!name.trim()) {
      alert("Nama produk wajib diisi.");
      return;
    }

    setSaving(true);

    const supabase = createClient();

    let imageUrl =
      editingProduct?.image_url || null;

    /*
     * Upload gambar baru jika admin memilih gambar.
     */
    if (imageFile) {
      const uploadedUrl = await uploadImage(imageFile);

      if (!uploadedUrl) {
        alert("Gagal mengupload gambar.");
        setSaving(false);
        return;
      }

      imageUrl = uploadedUrl;
    }

    /*
     * EDIT
     */
    if (editingProduct) {
      const { data, error } = await supabase
        .from("products")
        .update({
          name: name.trim(),
          category: category.trim() || null,
          price: Number(price) || 0,
          description:
            description.trim() || null,
          image_url: imageUrl,
          status,
        })
        .eq("id", editingProduct.id)
        .select()
        .single();

      if (error) {
        console.error(error);
        alert("Gagal mengubah produk.");
        setSaving(false);
        return;
      }

      setProducts((current) =>
        current.map((product) =>
          product.id === editingProduct.id
            ? data
            : product
        )
      );

      closeForm();
      setSaving(false);
      return;
    }

    /*
     * ADD
     */
    const { data, error } = await supabase
      .from("products")
      .insert({
        business_id: business.id,
        name: name.trim(),
        category: category.trim() || null,
        price: Number(price) || 0,
        description:
          description.trim() || null,
        image_url: imageUrl,
        status,
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      alert("Gagal menyimpan produk.");
      setSaving(false);
      return;
    }

    setProducts((current) => [
      data,
      ...current,
    ]);

    closeForm();
    setSaving(false);
  }

  async function deleteProduct(product: Product) {
    const confirmed = window.confirm(
      `Hapus produk "${product.name}"?`
    );

    if (!confirmed) return;

    const supabase = createClient();

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id);

    if (error) {
      console.error(error);
      alert("Gagal menghapus produk.");
      return;
    }

    setProducts((current) =>
      current.filter(
        (item) => item.id !== product.id
      )
    );
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-sm text-slate-500">
          Loading products...
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
      {/* HEADER */}

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
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
                Products
              </p>

              <p className="text-xs text-slate-400">
                {business.name}
              </p>
            </div>
          </div>

          <button
            onClick={openAddForm}
            className="rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            + Add Product
          </button>
        </div>
      </header>

      {/* CONTENT */}

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              Business Products
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              {business.name}
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage products displayed on the customer website.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
            <p className="text-xs text-slate-400">
              Total Products
            </p>

            <p className="mt-1 text-2xl font-bold">
              {products.length}
            </p>
          </div>
        </div>

        {/* EMPTY */}

        {products.length === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
              📦
            </div>

            <h2 className="mt-5 text-lg font-bold">
              Belum ada produk
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Tambahkan produk pertama untuk mulai
              membangun katalog {business.name}.
            </p>

            <button
              onClick={openAddForm}
              className="mt-6 rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
            >
              + Add First Product
            </button>
          </div>
        )}

        {/* TABLE */}

        {products.length > 0 && (
          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-6 py-4">
              <p className="text-sm font-bold">
                Product Catalog
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500">
                      Product
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold text-slate-500">
                      Category
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold text-slate-500">
                      Price
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
                            {product.image_url ? (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-xs text-slate-400">
                                IMG
                              </span>
                            )}
                          </div>

                          <div>
                            <p className="text-sm font-bold">
                              {product.name}
                            </p>

                            {product.description && (
                              <p className="mt-1 max-w-sm truncate text-xs text-slate-400">
                                {product.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-500">
                        {product.category || "-"}
                      </td>

                      <td className="px-6 py-5 text-sm font-semibold">
                        Rp{" "}
                        {Number(
                          product.price || 0
                        ).toLocaleString("id-ID")}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            product.status === "active"
                              ? "bg-slate-100 text-slate-700"
                              : "bg-slate-50 text-slate-400"
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() =>
                              openEditForm(product)
                            }
                            className="text-xs font-semibold text-slate-600 hover:text-slate-950"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              deleteProduct(product)
                            }
                            className="text-xs font-semibold text-slate-400 hover:text-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ADD / EDIT MODAL */}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-6">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold">
                  {editingProduct
                    ? "Edit Product"
                    : "Add Product"}
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  {editingProduct
                    ? `Edit ${editingProduct.name}`
                    : `Add a product to ${business.name}`}
                </p>
              </div>

              <button
                onClick={closeForm}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500"
              >
                ×
              </button>
            </div>

            {/* FORM */}

            <div className="space-y-5 p-6">
              {/* IMAGE */}

              <div>
                <label className="text-xs font-semibold text-slate-600">
                  Product Image
                </label>

                <label className="mt-2 block cursor-pointer">
                  <div className="overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50">
                    {imagePreview ? (
                      <div className="relative aspect-square w-full">
                        <img
                          src={imagePreview}
                          alt="Product preview"
                          className="h-full w-full object-cover"
                        />

                        <div className="absolute inset-x-0 bottom-0 bg-slate-950/70 px-4 py-3 text-center text-xs font-semibold text-white">
                          Click to change image
                        </div>
                      </div>
                    ) : (
                      <div className="flex h-48 flex-col items-center justify-center">
                        <div className="text-3xl">
                          📷
                        </div>

                        <p className="mt-3 text-sm font-semibold">
                          Upload Product Image
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          JPG, PNG or WEBP • Max 5 MB
                        </p>
                      </div>
                    )}
                  </div>

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* NAME */}

              <div>
                <label className="text-xs font-semibold text-slate-600">
                  Product Name
                </label>

                <input
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Contoh: Dress Korea"
                  className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-slate-950"
                />
              </div>

              {/* CATEGORY + PRICE */}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600">
                    Category
                  </label>

                  <input
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value)
                    }
                    placeholder="Fashion"
                    className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-slate-950"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600">
                    Price
                  </label>

                  <input
                    value={price}
                    onChange={(e) =>
                      setPrice(e.target.value)
                    }
                    type="number"
                    placeholder="150000"
                    className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-slate-950"
                  />
                </div>
              </div>

              {/* DESCRIPTION */}

              <div>
                <label className="text-xs font-semibold text-slate-600">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  rows={4}
                  placeholder="Deskripsi produk..."
                  className="mt-2 w-full resize-none rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-slate-950"
                />
              </div>

              {/* STATUS */}

              <div>
                <label className="text-xs font-semibold text-slate-600">
                  Status
                </label>

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value)
                  }
                  className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-slate-950"
                >
                  <option value="active">
                    Active
                  </option>

                  <option value="inactive">
                    Inactive
                  </option>
                </select>
              </div>
            </div>

            {/* FOOTER */}

            <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-5">
              <button
                onClick={closeForm}
                disabled={saving}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={saveProduct}
                disabled={saving}
                className="rounded-lg bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingProduct
                  ? "Save Changes"
                  : "Save Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}