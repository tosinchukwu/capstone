"use client";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import { isAdminWallet } from "@/lib/admin";
import Link from "next/link";

export default function AdminSettings() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newWallet, setNewWallet] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchSettings = async () => {
    try {
      const res = await fetch(`/api/admin/settings`);
      if (!res.ok) throw new Error("Failed to fetch settings");
      const data = await res.json();
      setSettings(data);
    } catch (err) {
      setError("Could not load settings. Using default values.");
      setSettings({
        name: "MEDCRUSH BLOCKCHAIN HOSPITAL",
        email: "medcrush@gmail.com",
        phone: "08023000000",
        address: "2, Hospital Road, Benin",
        adminWallets: [],
      });
    }
  };

  useEffect(() => {
    if (!isConnected) {
      router.push("/");
      return;
    }
    if (!address) {
      router.push("/");
      return;
    }
    (async () => {
      try {
        const admin = await isAdminWallet(address);
        setIsAdmin(admin);
        if (!admin) {
          setLoading(false);
          return;
        }
        await fetchSettings();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [address, isConnected, router]);

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
      await fetchSettings();
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

  if (!isConnected || !address) {
    return null; // redirecting
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-600 dark:text-gray-300">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="p-4 sm:p-8 text-center">
        <p className="text-red-600 dark:text-red-400 text-lg font-semibold">⛔ Unauthorized – you are not an admin.</p>
        <Link href="/" className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          🏠 Go Home
        </Link>
      </div>
    );
  }

  return (
    <AdminLayout wallet={address}>
      <h2 className="text-2xl sm:text-3xl font-serif text-blue-600 dark:text-blue-400 mb-4 sm:mb-6">Hospital Settings</h2>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-4 sm:p-6 rounded-xl space-y-4 max-w-2xl">
        <input
          className="input-field"
          placeholder="Hospital Name"
          value={settings?.name || ""}
          onChange={(e) => setSettings({ ...settings, name: e.target.value })}
        />
        <input
          className="input-field"
          placeholder="Email"
          value={settings?.email || ""}
          onChange={(e) => setSettings({ ...settings, email: e.target.value })}
        />
        <input
          className="input-field"
          placeholder="Phone"
          value={settings?.phone || ""}
          onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
        />
        <input
          className="input-field"
          placeholder="Address"
          value={settings?.address || ""}
          onChange={(e) => setSettings({ ...settings, address: e.target.value })}
        />
        <input
          className="input-field"
          placeholder="Website"
          value={settings?.website || ""}
          onChange={(e) => setSettings({ ...settings, website: e.target.value })}
        />
        <input
          className="input-field"
          placeholder="Twitter"
          value={settings?.twitter || ""}
          onChange={(e) => setSettings({ ...settings, twitter: e.target.value })}
        />
        <input
          className="input-field"
          placeholder="LinkedIn"
          value={settings?.linkedin || ""}
          onChange={(e) => setSettings({ ...settings, linkedin: e.target.value })}
        />

        <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Admin Wallets</h3>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              className="input-field flex-1"
              placeholder="Add wallet address"
              value={newWallet}
              onChange={(e) => setNewWallet(e.target.value)}
            />
            <button
              type="button"
              onClick={addAdminWallet}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition text-sm sm:text-base"
            >
              Add
            </button>
          </div>
          <div className="mt-2 space-y-1">
            {(settings?.adminWallets || []).map((w: string) => (
              <div key={w} className="flex justify-between items-center bg-gray-50 dark:bg-slate-700/50 px-3 py-1 rounded">
                <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 truncate">{w}</span>
                <button
                  type="button"
                  onClick={() => removeAdminWallet(w)}
                  className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-xs sm:text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary w-full sm:w-auto"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </AdminLayout>
  );
}