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
      const res = await fetch(`/api/admin/stats?wallet=${address}`);
      const data = await res.json();
      setStats(data);
      setLoading(false);
    })();
  }, [address, isConnected]);

  // ✅ Home button included on all error/unauthorized screens
  if (!isConnected) {
    return (
      <div className="p-4 sm:p-8 text-center">
        <p>Please connect your wallet.</p>
        <Link href="/" className="mt-4 inline-block bg-gold-500 text-slate-900 px-4 py-2 rounded-lg">
          Go Home
        </Link>
      </div>
    );
  }
  if (!address) {
    return (
      <div className="p-4 sm:p-8 text-center">
        <p>No wallet address detected.</p>
        <Link href="/" className="mt-4 inline-block bg-gold-500 text-slate-900 px-4 py-2 rounded-lg">
          Go Home
        </Link>
      </div>
    );
  }
  if (!isAdmin) {
    return (
      <div className="p-4 sm:p-8 text-center">
        <p className="text-red-500 text-lg font-semibold">⛔ Unauthorized – you are not an admin.</p>
        <Link href="/" className="mt-4 inline-block bg-gold-500 text-slate-900 px-4 py-2 rounded-lg">
          Go Home
        </Link>
      </div>
    );
  }
  if (loading) return <div className="p-4 sm:p-8 text-center">Loading stats...</div>;

  const cards = [
    { label: "Total Appointments", value: stats.totalAppointments, color: "gold" },
    { label: "Pending", value: stats.pending, color: "yellow" },
    { label: "Confirmed", value: stats.confirmed, color: "green" },
    { label: "Completed", value: stats.completed, color: "blue" },
    { label: "Cancelled", value: stats.cancelled, color: "red" },
    { label: "Doctors", value: stats.totalDoctors, color: "purple" },
    { label: "Patients", value: stats.totalPatients, color: "indigo" },
  ];

  return (
    <AdminLayout wallet={address}>
      <h2 className="text-2xl sm:text-3xl font-serif text-gold-300 mb-4 sm:mb-6">Dashboard</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-slate-800/70 backdrop-blur-sm border border-gold-500/20 rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-gold-500/10 transition">
            <p className="text-xs sm:text-sm text-gray-400 uppercase tracking-wider">{card.label}</p>
            <p className={`text-xl sm:text-3xl font-bold text-${card.color}-400`}>{card.value}</p>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}