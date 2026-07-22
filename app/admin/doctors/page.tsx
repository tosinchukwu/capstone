"use client";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import AdminLayout from "@/components/AdminLayout";
import { isAdminWallet } from "@/lib/admin";
import Link from "next/link";

export default function AdminDoctors() {
  const { address, isConnected } = useAccount();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    wallet: "",
    specialty: "",
    hospital: "",
    location: "",
    bio: "",
    yearsExperience: "",
    rating: "",
    isActive: true,
  });

  useEffect(() => {
    if (!isConnected || !address) {
      setLoading(false);
      return;
    }
    (async () => {
      const admin = await isAdminWallet(address);
      setIsAdmin(admin);
      if (!admin) {
        setLoading(false);
        return;
      }
      await fetchDoctors();
    })();
  }, [address, isConnected]);

  const fetchDoctors = async () => {
    try {
      const res = await fetch(`/api/admin/doctors?wallet=${address}`);
      if (!res.ok) throw new Error("Failed to fetch doctors");
      const data = await res.json();
      setDoctors(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this doctor?")) return;
    await fetch(`/api/admin/doctors?wallet=${address}&id=${id}`, { method: "DELETE" });
    fetchDoctors();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = `/api/admin/doctors?wallet=${address}`;
    const method = editing ? "PUT" : "POST";
    const body = editing ? { ...form, id: editing.id } : form;
    await fetch(url, {
      method,
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });
    setEditing(null);
    setForm({
      name: "",
      email: "",
      wallet: "",
      specialty: "",
      hospital: "",
      location: "",
      bio: "",
      yearsExperience: "",
      rating: "",
      isActive: true,
    });
    fetchDoctors();
  };

  // Unauthorized / error screens
  if (!isConnected) {
    return (
      <div className="p-4 sm:p-8 text-center admin-text">
        <p>Please connect your wallet.</p>
        <Link href="/" className="mt-4 inline-block admin-accent-bg text-slate-900 px-4 py-2 rounded-lg hover:opacity-90 transition">
          🏠 Go Home
        </Link>
      </div>
    );
  }
  if (!address) {
    return (
      <div className="p-4 sm:p-8 text-center admin-text">
        <p>No wallet address detected.</p>
        <Link href="/" className="mt-4 inline-block admin-accent-bg text-slate-900 px-4 py-2 rounded-lg hover:opacity-90 transition">
          🏠 Go Home
        </Link>
      </div>
    );
  }
  if (!isAdmin) {
    return (
      <div className="p-4 sm:p-8 text-center">
        <p className="text-red-400 text-lg font-semibold">⛔ Unauthorized – you are not an admin.</p>
        <Link href="/" className="mt-4 inline-block admin-accent-bg text-slate-900 px-4 py-2 rounded-lg hover:opacity-90 transition">
          🏠 Go Home
        </Link>
      </div>
    );
  }
  if (loading) return <div className="p-4 sm:p-8 text-center admin-text">Loading...</div>;

  return (
    <AdminLayout wallet={address}>
      <h2 className="text-2xl sm:text-3xl font-serif admin-accent mb-4 sm:mb-6">Manage Doctors</h2>

      <form onSubmit={handleSubmit} className="admin-card border admin-border p-4 sm:p-6 rounded-xl mb-6 sm:mb-8">
        <h3 className="text-lg sm:text-xl font-semibold admin-accent mb-4">{editing ? "Edit Doctor" : "Add New Doctor"}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <input className="admin-input px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-admin-accent outline-none" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="admin-input px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-admin-accent outline-none" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="admin-input px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-admin-accent outline-none" placeholder="Wallet Address" value={form.wallet} onChange={(e) => setForm({ ...form, wallet: e.target.value })} required />
          <input className="admin-input px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-admin-accent outline-none" placeholder="Specialty" value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} required />
          <input className="admin-input px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-admin-accent outline-none" placeholder="Hospital" value={form.hospital} onChange={(e) => setForm({ ...form, hospital: e.target.value })} />
          <input className="admin-input px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-admin-accent outline-none" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <input className="admin-input px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-admin-accent outline-none" placeholder="Years Experience" value={form.yearsExperience} onChange={(e) => setForm({ ...form, yearsExperience: e.target.value })} />
          <input className="admin-input px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-admin-accent outline-none" placeholder="Rating (0-5)" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
          <textarea className="admin-input px-3 sm:px-4 py-2 rounded-lg col-span-1 sm:col-span-2 text-sm sm:text-base focus:ring-2 focus:ring-admin-accent outline-none" placeholder="Bio" rows={2} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          <label className="flex items-center gap-2 text-sm admin-text-secondary">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
            Active
          </label>
        </div>
        <button type="submit" className="mt-4 admin-accent-bg text-slate-900 px-4 sm:px-6 py-2 rounded-lg font-semibold transition hover:opacity-90 text-sm sm:text-base">
          {editing ? "Update" : "Add"} Doctor
        </button>
        {editing && (
          <button type="button" className="ml-4 text-sm admin-text-secondary hover:admin-text transition" onClick={() => { setEditing(null); setForm({ name: "", email: "", wallet: "", specialty: "", hospital: "", location: "", bio: "", yearsExperience: "", rating: "", isActive: true }); }}>Cancel</button>
        )}
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm">
          <thead className="admin-bg-secondary admin-border border-b">
            <tr>
              <th className="p-2 sm:p-3 text-left admin-text-secondary uppercase tracking-wider">Name</th>
              <th className="p-2 sm:p-3 text-left admin-text-secondary uppercase tracking-wider hidden sm:table-cell">Specialty</th>
              <th className="p-2 sm:p-3 text-left admin-text-secondary uppercase tracking-wider hidden md:table-cell">Hospital</th>
              <th className="p-2 sm:p-3 text-left admin-text-secondary uppercase tracking-wider">Active</th>
              <th className="p-2 sm:p-3 text-left admin-text-secondary uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doc) => (
              <tr key={doc.id} className="border-b admin-border hover:admin-bg-secondary/50 transition">
                <td className="p-2 sm:p-3 admin-text">{doc.name}</td>
                <td className="p-2 sm:p-3 admin-text-secondary hidden sm:table-cell">{doc.specialty}</td>
                <td className="p-2 sm:p-3 admin-text-secondary hidden md:table-cell">{doc.hospital || "—"}</td>
                <td className="p-2 sm:p-3 admin-text">{doc.isActive ? "✅" : "❌"}</td>
                <td className="p-2 sm:p-3 space-x-2">
                  <button className="admin-accent hover:underline" onClick={() => { setEditing(doc); setForm({ ...doc, yearsExperience: String(doc.yearsExperience || 0), rating: String(doc.rating || 0) }); }}>Edit</button>
                  <button className="text-red-400 hover:text-red-300" onClick={() => handleDelete(doc.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}