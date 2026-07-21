"use client";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import AdminLayout from "@/components/AdminLayout";
import { isAdminWallet } from "@/lib/admin";

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
    return <div className="p-8 text-center">Loading stats...</div>;
  }

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
      <h2 className="text-3xl font-serif text-gold-300 mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-slate-800/70 backdrop-blur-sm border border-gold-500/20 rounded-xl p-6 shadow-lg hover:shadow-gold-500/10 transition">
            <p className="text-sm text-gray-400 uppercase tracking-wider">{card.label}</p>
            <p className={`text-3xl font-bold text-${card.color}-400`}>{card.value}</p>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}