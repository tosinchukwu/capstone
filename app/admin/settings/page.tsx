"use client";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import AdminLayout from "@/components/AdminLayout";
import { isAdminWallet } from "@/lib/admin";
import Link from "next/link";

export default function AdminSettings() {
  const { address, isConnected } = useAccount();
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [newWallet, setNewWallet] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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
      try {
        const res = await fetch(`/api/admin/settings`);
        if (!res.ok) throw new Error("Failed to fetch settings");
        const data = await res.json();
        setSettings(data);
      } catch (err) {
        setError("Could not load settings.");
      }
      setLoading(false);
    })();
  }, [address, isConnected]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/settings?wallet=${address}`, {
        method: "PUT",
        body: JSON.stringify(settings),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save settings");
      alert("✅ Settings saved successfully!");
    } catch (err: any) {
      setError(err.message);
      alert("❌ " + err.message);
    }
    setSaving(false);
  };

  const addAdminWallet = () => {
    if (!newWallet.trim()) return;
    const current = settings.adminWallets || [];
    if (current.includes(newWallet.trim())) {
      setError("Wallet already whitelisted.");
      return;
    }
    setSettings({
      ...settings,
      adminWallets: [...current, newWallet.trim()],
    });
    setNewWallet("");
    setError("");
  };

  const removeAdminWallet = (wallet: string) => {
    setSettings({
      ...settings,
      adminWallets: (settings.adminWallets || []).filter((w: string) => w !== wallet),
    });
  };

  if (!isConnected) {
    return (
      <div className="p-4 sm:p-8 text-center">
        <p>Please connect your wallet.</p>
        <Link href="/" className="mt-4 inline-block bg-gold-500 text-slate-900 px-4 py-2 rounded-lg">Go Home</Link>
      </div>
    );
  }
  if (!address) {
    return (
      <div className="p-4 sm:p-8 text-center">
        <p>No wallet address detected.</p>
        <Link href="/" className="mt-4 inline-block bg-gold-500 text-slate-900 px-4 py-2 rounded-lg">Go Home</Link>
      </div>
    );
  }
  if (!isAdmin) {
    return (
      <div className="p-4 sm:p-8 text-center">
        <p className="text-red-500 text-lg font-semibold">⛔ Unauthorized – you are not an admin.</p>
        <Link href="/" className="mt-4 inline-block bg-gold-500 text-slate-900 px-4 py-2 rounded-lg">Go Home</Link>
      </div>
    );
  }
  if (loading) return <div className="p-4 sm:p-8 text-center">Loading...</div>;

  return (
    <AdminLayout wallet={address}>
      <h2 className="text-2xl sm:text-3xl font-serif text-gold-300 mb-4 sm:mb-6">Hospital Settings</h2>

      {error && <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-slate-800/70 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-gold-500/20 space-y-4 max-w-2xl">
        <input
          className="w-full px-3 sm:px-4 py-2 bg-slate-700 text-white rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-gold-500 outline-none"
          placeholder="Hospital Name"
          value={settings.name || ""}
          onChange={(e) => setSettings({ ...settings, name: e.target.value })}
        />
        <input
          className="w-full px-3 sm:px-4 py-2 bg-slate-700 text-white rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-gold-500 outline-none"
          placeholder="Email"
          value={settings.email || ""}
          onChange={(e) => setSettings({ ...settings, email: e.target.value })}
        />
        <input
          className="w-full px-3 sm:px-4 py-2 bg-slate-700 text-white rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-gold-500 outline-none"
          placeholder="Phone"
          value={settings.phone || ""}
          onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
        />
        <input
          className="w-full px-3 sm:px-4 py-2 bg-slate-700 text-white rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-gold-500 outline-none"
          placeholder="Address"
          value={settings.address || ""}
          onChange={(e) => setSettings({ ...settings, address: e.target.value })}
        />
        <input
          className="w-full px-3 sm:px-4 py-2 bg-slate-700 text-white rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-gold-500 outline-none"
          placeholder="Website"
          value={settings.website || ""}
          onChange={(e) => setSettings({ ...settings, website: e.target.value })}
        />
        <input
          className="w-full px-3 sm:px-4 py-2 bg-slate-700 text-white rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-gold-500 outline-none"
          placeholder="Twitter"
          value={settings.twitter || ""}
          onChange={(e) => setSettings({ ...settings, twitter: e.target.value })}
        />
        <input
          className="w-full px-3 sm:px-4 py-2 bg-slate-700 text-white rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-gold-500 outline-none"
          placeholder="LinkedIn"
          value={settings.linkedin || ""}
          onChange={(e) => setSettings({ ...settings, linkedin: e.target.value })}
        />

        <div className="border-t border-gold-500/20 pt-4">
          <h3 className="text-base sm:text-lg font-semibold text-gold-300 mb-2">Admin Wallets</h3>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              className="flex-1 px-3 sm:px-4 py-2 bg-slate-700 text-white rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-gold-500 outline-none"
              placeholder="Add wallet address"
              value={newWallet}
              onChange={(e) => setNewWallet(e.target.value)}
            />
            <button type="button" onClick={addAdminWallet} className="bg-gold-500 text-slate-900 px-4 py-2 rounded-lg font-semibold hover:bg-gold-600 transition text-sm sm:text-base">
              Add
            </button>
          </div>
          <div className="mt-2 space-y-1">
            {(settings.adminWallets || []).map((w: string) => (
              <div key={w} className="flex justify-between items-center bg-slate-700/50 px-3 py-1 rounded">
                <span className="text-xs sm:text-sm text-gray-300 truncate">{w}</span>
                <button type="button" onClick={() => removeAdminWallet(w)} className="text-red-400 hover:text-red-300 text-xs sm:text-sm">
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="bg-gold-500 hover:bg-gold-600 text-slate-900 px-4 sm:px-6 py-2 rounded-lg font-semibold transition text-sm sm:text-base" disabled={saving}>
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </AdminLayout>
  );
}