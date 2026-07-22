"use client";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import AdminLayout from "@/components/AdminLayout";
import { isAdminWallet } from "@/lib/admin";
import Link from "next/link";

export default function AdminDashboard() {
  const { address, isConnected } = useAccount();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
      try {
        const res = await fetch(`/api/admin/stats?wallet=${address}`);
        if (!res.ok) throw new Error("Failed to fetch stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Stats error:", err);
      }
      setLoading(false);
    })();
  }, [address, isConnected]);

  // Error / unauthorized screens
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
  if (loading) return <div className="p-4 sm:p-8 text-center admin-text">Loading stats...</div>;

  const cards = [
    { label: "Total Appointments", value: stats?.totalAppointments || 0 },
    { label: "Pending", value: stats?.pending || 0 },
    { label: "Confirmed", value: stats?.confirmed || 0 },
    { label: "Completed", value: stats?.completed || 0 },
    { label: "Cancelled", value: stats?.cancelled || 0 },
    { label: "Doctors", value: stats?.totalDoctors || 0 },
    { label: "Patients", value: stats?.totalPatients || 0 },
  ];

  return (
    <AdminLayout wallet={address}>
      <h2 className="text-2xl sm:text-3xl font-serif admin-accent mb-4 sm:mb-6">Dashboard</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {cards.map((card) => (
          <div key={card.label} className="admin-card border admin-border rounded-xl p-4 sm:p-6 shadow-lg">
            <p className="text-xs sm:text-sm admin-text-secondary uppercase tracking-wider">{card.label}</p>
            <p className="text-xl sm:text-3xl font-bold admin-text">{card.value}</p>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}