"use client";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import { isAdminWallet } from "@/lib/admin";
import Link from "next/link";

export default function AdminDashboard() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

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
  }, [address, isConnected, router]);

  if (!isConnected || !address) {
    return null; // will redirect
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
      <h2 className="text-2xl sm:text-3xl font-serif text-blue-600 dark:text-blue-400 mb-4 sm:mb-6">Dashboard</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4 sm:p-6 shadow-md">
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">{card.label}</p>
            <p className="text-xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">{card.value}</p>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}