"use client";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import AdminLayout from "@/components/AdminLayout";
import { isAdminWallet } from "@/lib/admin";
import Link from "next/link";

export default function AdminSettings() {
  const { address, isConnected } = useAccount();
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
      await fetchSettings();
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
      // Re‑fetch to get the latest data (including adminWallets)
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

  // ... (unauthorized and loading screens unchanged)

  return (
    <AdminLayout wallet={address}>
      <h2 className="text-2xl sm:text-3xl font-serif admin-accent mb-4 sm:mb-6">Hospital Settings</h2>
      {error && <div className="admin-card border border-red-500/50 text-red-300 p-3 rounded-lg mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="admin-card border admin-border p-4 sm:p-6 rounded-xl space-y-4 max-w-2xl">
        {/* input fields unchanged */}
        ...
      </form>
    </AdminLayout>
  );
}