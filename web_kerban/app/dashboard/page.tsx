"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { formatDate, cn } from "@/lib/utils";

interface Lapor {
  id: string;
  judul: string;
  namaPelapor: string | null;
  deskripsi: string;
  kategori: string | null;
  foto: string | null;
  lat: number;
  lng: number;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [lapors, setLapors] = useState<Lapor[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Lapor | null>(null);

  const role = (session?.user as any)?.role;
  const isAdmin = role === "endministrator";

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      fetchLapors();
    }
  }, [status]);

  const fetchLapors = async () => {
    const res = await fetch("/api/lapors");
    const data = await res.json();
    setLapors(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus laporan ini?")) return;
    await fetch(`/api/lapors/${id}`, { method: "DELETE" });
    setLapors((prev) => prev.filter((l) => l.id !== id));
  };

  const handleEdit = (lapor: Lapor) => {
    setEditing(lapor);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editing) return;
    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries());

    await fetch(`/api/lapors/${editing.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        lat: parseFloat(data.lat as string),
        lng: parseFloat(data.lng as string),
      }),
    });

    setEditing(null);
    fetchLapors();
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <span className="loader-spinner" />
      </div>
    );
  }

  // Stats
  const total = lapors.length;
  const last7Days = lapors.filter(
    (l) => new Date(l.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;
  const last30Days = lapors.filter(
    (l) => new Date(l.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  ).length;
  const uniqueCategories = new Set(lapors.map((l) => l.kategori).filter(Boolean)).size;

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl animate-fade-in">
      {/* Profile Card */}
      <div className="glass-card p-6 md:p-8 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
            <i className="bi bi-person-fill text-3xl text-primary-600 dark:text-primary-400" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{session?.user?.name}</h1>
            <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
            <span
              className={cn(
                "inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium",
                isAdmin
                  ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                  : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
              )}
            >
              {isAdmin ? "Administrator" : "Warga"}
            </span>
          </div>
        </div>
      </div>

      {/* Stats (Admin only) */}
      {isAdmin && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Laporan", value: total, icon: "bi-file-text", color: "from-blue-500 to-cyan-500" },
            { label: "7 Hari Terakhir", value: last7Days, icon: "bi-calendar-week", color: "from-green-500 to-emerald-500" },
            { label: "30 Hari Terakhir", value: last30Days, icon: "bi-calendar-month", color: "from-orange-500 to-yellow-500" },
            { label: "Kategori Unik", value: uniqueCategories, icon: "bi-tags", color: "from-purple-500 to-pink-500" },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <i className={`bi ${stat.icon} text-white`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lapor Table */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold mb-4">
          {isAdmin ? "Daftar Laporan" : "Laporan Saya"}
        </h2>

        {lapors.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">Belum ada laporan.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 font-medium">Judul</th>
                  <th className="text-left py-3 px-2 font-medium hidden md:table-cell">Pelapor</th>
                  <th className="text-left py-3 px-2 font-medium hidden sm:table-cell">Kategori</th>
                  <th className="text-left py-3 px-2 font-medium hidden lg:table-cell">Tanggal</th>
                  <th className="text-right py-3 px-2 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {lapors.map((l) => (
                  <tr key={l.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-2 font-medium">{l.judul}</td>
                    <td className="py-3 px-2 text-muted-foreground hidden md:table-cell">
                      {l.namaPelapor || "-"}
                    </td>
                    <td className="py-3 px-2 hidden sm:table-cell">
                      {l.kategori && (
                        <span className="px-2 py-0.5 rounded-full bg-muted text-xs">{l.kategori}</span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-muted-foreground hidden lg:table-cell">
                      {formatDate(l.createdAt)}
                    </td>
                    <td className="py-3 px-2 text-right">
                      <button
                        onClick={() => handleEdit(l)}
                        className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-primary-600 transition-all"
                        title="Edit"
                      >
                        <i className="bi bi-pencil" />
                      </button>
                      <button
                        onClick={() => handleDelete(l.id)}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-muted-foreground hover:text-red-500 transition-all"
                        title="Hapus"
                      >
                        <i className="bi bi-trash" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEditing(null)} />
          <div className="relative glass-card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
            <h3 className="text-lg font-semibold mb-4">Edit Laporan</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Judul</label>
                <input
                  name="judul"
                  defaultValue={editing.judul}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nama Pelapor</label>
                <input
                  name="namaPelapor"
                  defaultValue={editing.namaPelapor || ""}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Deskripsi</label>
                <textarea
                  name="deskripsi"
                  defaultValue={editing.deskripsi}
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Kategori</label>
                <input
                  name="kategori"
                  defaultValue={editing.kategori || ""}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Latitude</label>
                  <input
                    name="lat"
                    type="number"
                    step="any"
                    defaultValue={editing.lat}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Longitude</label>
                  <input
                    name="lng"
                    type="number"
                    step="any"
                    defaultValue={editing.lng}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary-500 outline-none"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="px-4 py-2 rounded-xl border border-border hover:bg-muted transition-all text-sm"
                >
                  Batal
                </button>
                <button type="submit" className="btn-primary text-sm">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
