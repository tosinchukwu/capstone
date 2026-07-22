"use client";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import AdminLayout from "@/components/AdminLayout";
import { isAdminWallet } from "@/lib/admin";

export default function AdminSettings() {
  const { address, isConnected } = useAccount();
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [newWallet, setNewWallet] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

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
      const res = await fetch(`/api/admin/settings`);
      const data = await res.json();
      setSettings(data);
      setLoading(false);
    })();
  }, [address, isConnected]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/admin/settings?wallet=${address}`, {
      method: "PUT",
      body: JSON.stringify(settings),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      alert("✅ Settings saved!");
    } else {
      const data = await res.json();
      alert("❌ Failed to save settings: " + (data.error || "Unknown error"));
    }
  };

  const addAdminWallet = () => {
    if (!newWallet.trim()) return;
    const current = settings.adminWallets || [];
    if (current.includes(newWallet.trim())) {
      alert("Wallet already whitelisted.");
      return;
    }
    setSettings({
      ...settings,
      adminWallets: [...current, newWallet.trim()],
    });
    setNewWallet("");
  };

  const removeAdminWallet = (wallet: string) => {
    setSettings({
      ...settings,
      adminWallets: (settings.adminWallets || []).filter((w: string) => w !== wallet),
    });
  };

  if (!isConnected) return <div className="p-4 sm:p-8 text-center">Please connect your wallet.</div>;
  if (!address) return <div className="p-4 sm:p-8 text-center">No wallet address detected.</div>;
  if (!isAdmin) return <div className="p-4 sm:p-8 text-red-500 text-center">Unauthorized.</div>;
  if (loading) return <div className="p-4 sm:p-8 text-center">Loading...</div>;

  return (
    <AdminLayout wallet={address}>
      <h2 className="text-2xl sm:text-3xl font-serif text-gold-300 mb-4 sm:mb-6">Hospital Settings</h2>
      <form onSubmit={handleSubmit} className="bg-slate-800/70 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-gold-500/20 space-y-4 max-w-2xl">
        <input className="w-full px-3 sm:px-4 py-2 bg-slate-700 rounded-lg text-sm sm:text-base" placeholder="Hospital Name" value={settings.name || ""} onChange={(e) => setSettings({ ...settings, name: e.target.value })} />
        <input className="w-full px-3 sm:px-4 py-2 bg-slate-700 rounded-lg text-sm sm:text-base" placeholder="Email" value={settings.email || ""} onChange={(e) => setSettings({ ...settings, email: e.target.value })} />
        <input className="w-full px-3 sm:px-4 py-2 bg-slate-700 rounded-lg text-sm sm:text-base" placeholder="Phone" value={settings.phone || ""} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} />
        <input className="w-full px-3 sm:px-4 py-2 bg-slate-700 rounded-lg text-sm sm:text-base" placeholder="Address" value={settings.address || ""} onChange={(e) => setSettings({ ...settings, address: e.target.value })} />
        <input className="w-full px-3 sm:px-4 py-2 bg-slate-700 rounded-lg text-sm sm:text-base" placeholder="Website" value={settings.website || ""} onChange={(e) => setSettings({ ...settings, website: e.target.value })} />
        <input className="w-full px-3 sm:px-4 py-2 bg-slate-700 rounded-lg text-sm sm:text-base" placeholder="Twitter" value={settings.twitter || ""} onChange={(e) => setSettings({ ...settings, twitter: e.target.value })} />
        <input className="w-full px-3 sm:px-4 py-2 bg-slate-700 rounded-lg text-sm sm:text-base" placeholder="LinkedIn" value={settings.linkedin || ""} onChange={(e) => setSettings({ ...settings, linkedin: e.target.value })} />

        <div className="border-t border-gold-500/20 pt-4">
          <h3 className="text-base sm:text-lg font-semibold text-gold-300 mb-2">Admin Wallets</h3>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              className="flex-1 px-3 sm:px-4 py-2 bg-slate-700 rounded-lg text-sm sm:text-base"
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

        <button type="submit" className="bg-gold-500 hover:bg-gold-600 text-slate-900 px-4 sm:px-6 py-2 rounded-lg font-semibold transition text-sm sm:text-base">
          Save Settings
        </button>
      </form>
    </AdminLayout>
  );
}