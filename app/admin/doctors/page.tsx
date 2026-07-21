"use client";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import AdminLayout from "@/components/AdminLayout";
import { isAdminWallet } from "@/lib/admin";

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
        const res = await fetch(`/api/admin/doctors?wallet=${address}`);
        const data = await res.json();
        setDoctors(data);
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

    if (!isConnected) {
        return <div className="p-8 text-center">Please connect your wallet.</div>;
    }
    if (!address) {
        return <div className="p-8 text-center">No wallet address detected.</div>;
    }
    if (!isAdmin) {
        return <div className="p-8 text-red-500 text-center">Unauthorized – you are not an admin.</div>;
    }
    if (loading) {
        return <div className="p-8 text-center">Loading doctors...</div>;
    }

    return (
        <AdminLayout wallet={address}>
            <h2 className="text-3xl font-serif text-gold-300 mb-6">Manage Doctors</h2>

            <form onSubmit={handleSubmit} className="bg-slate-800/70 backdrop-blur-sm p-6 rounded-xl border border-gold-500/20 mb-8">
                <h3 className="text-xl font-semibold text-gold-300 mb-4">{editing ? "Edit Doctor" : "Add New Doctor"}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input className="px-4 py-2 bg-slate-700 rounded-lg" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                    <input className="px-4 py-2 bg-slate-700 rounded-lg" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    <input className="px-4 py-2 bg-slate-700 rounded-lg" placeholder="Wallet Address" value={form.wallet} onChange={(e) => setForm({ ...form, wallet: e.target.value })} required />
                    <input className="px-4 py-2 bg-slate-700 rounded-lg" placeholder="Specialty" value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} required />
                    <input className="px-4 py-2 bg-slate-700 rounded-lg" placeholder="Hospital" value={form.hospital} onChange={(e) => setForm({ ...form, hospital: e.target.value })} />
                    <input className="px-4 py-2 bg-slate-700 rounded-lg" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                    <input className="px-4 py-2 bg-slate-700 rounded-lg" placeholder="Years Experience" value={form.yearsExperience} onChange={(e) => setForm({ ...form, yearsExperience: e.target.value })} />
                    <input className="px-4 py-2 bg-slate-700 rounded-lg" placeholder="Rating (0-5)" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
                    <textarea className="px-4 py-2 bg-slate-700 rounded-lg col-span-2" placeholder="Bio" rows={2} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
                    <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                        Active
                    </label>
                </div>
                <button type="submit" className="mt-4 bg-gold-500 hover:bg-gold-600 text-slate-900 px-6 py-2 rounded-lg font-semibold transition">
                    {editing ? "Update" : "Add"} Doctor
                </button>
                {editing && (
                    <button type="button" className="ml-4 text-gray-400 hover:text-gray-200" onClick={() => { setEditing(null); setForm({ name: "", email: "", wallet: "", specialty: "", hospital: "", location: "", bio: "", yearsExperience: "", rating: "", isActive: true }); }}>Cancel</button>
                )}
            </form>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-slate-800/70 text-gold-300 uppercase tracking-wider">
                        <tr>
                            <th className="p-3 text-left">Name</th>
                            <th className="p-3 text-left">Specialty</th>
                            <th className="p-3 text-left">Hospital</th>
                            <th className="p-3 text-left">Active</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {doctors.map((doc) => (
                            <tr key={doc.id} className="border-b border-slate-700/50 hover:bg-slate-800/30">
                                <td className="p-3">{doc.name}</td>
                                <td className="p-3">{doc.specialty}</td>
                                <td className="p-3">{doc.hospital || "—"}</td>
                                <td className="p-3">{doc.isActive ? "✅" : "❌"}</td>
                                <td className="p-3 space-x-2">
                                    <button className="text-gold-400 hover:text-gold-300" onClick={() => { setEditing(doc); setForm({ ...doc, yearsExperience: String(doc.yearsExperience || 0), rating: String(doc.rating || 0) }); }}>Edit</button>
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