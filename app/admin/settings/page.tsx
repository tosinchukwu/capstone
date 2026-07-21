"use client";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import AdminLayout from "@/components/AdminLayout";

const ADMIN_WALLET = process.env.NEXT_PUBLIC_ADMIN_WALLET || "0xYourAdminWalletAddress";

export default function AdminSettings() {
    const { address, isConnected } = useAccount();
    const [settings, setSettings] = useState<any>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isConnected || address !== ADMIN_WALLET) return;
        fetch(`/api/admin/settings?wallet=${address}`)
            .then((res) => res.json())
            .then((data) => {
                setSettings(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [address, isConnected]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch(`/api/admin/settings?wallet=${address}`, {
            method: "PUT",
            body: JSON.stringify(settings),
            headers: { "Content-Type": "application/json" },
        });
        alert("Settings saved!");
    };

    if (!isConnected) return <div className="p-8">Please connect your wallet.</div>;
    if (address !== ADMIN_WALLET) return <div className="p-8 text-red-500">Unauthorized.</div>;
    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <AdminLayout wallet={address}>
            <h2 className="text-3xl font-serif text-gold-300 mb-6">Hospital Settings</h2>
            <form onSubmit={handleSubmit} className="bg-slate-800/70 backdrop-blur-sm p-6 rounded-xl border border-gold-500/20 space-y-4 max-w-2xl">
                <input className="w-full px-4 py-2 bg-slate-700 rounded-lg" placeholder="Hospital Name" value={settings.name || ""} onChange={(e) => setSettings({ ...settings, name: e.target.value })} />
                <input className="w-full px-4 py-2 bg-slate-700 rounded-lg" placeholder="Email" value={settings.email || ""} onChange={(e) => setSettings({ ...settings, email: e.target.value })} />
                <input className="w-full px-4 py-2 bg-slate-700 rounded-lg" placeholder="Phone" value={settings.phone || ""} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} />
                <input className="w-full px-4 py-2 bg-slate-700 rounded-lg" placeholder="Address" value={settings.address || ""} onChange={(e) => setSettings({ ...settings, address: e.target.value })} />
                <input className="w-full px-4 py-2 bg-slate-700 rounded-lg" placeholder="Website" value={settings.website || ""} onChange={(e) => setSettings({ ...settings, website: e.target.value })} />
                <input className="w-full px-4 py-2 bg-slate-700 rounded-lg" placeholder="Twitter" value={settings.twitter || ""} onChange={(e) => setSettings({ ...settings, twitter: e.target.value })} />
                <input className="w-full px-4 py-2 bg-slate-700 rounded-lg" placeholder="LinkedIn" value={settings.linkedin || ""} onChange={(e) => setSettings({ ...settings, linkedin: e.target.value })} />
                <button type="submit" className="bg-gold-500 hover:bg-gold-600 text-slate-900 px-6 py-2 rounded-lg font-semibold transition">Save Settings</button>
            </form>
        </AdminLayout>
    );
}