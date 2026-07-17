"use client";
import { useAccount } from "wagmi";
import AppointmentList from "@/components/AppointmentList";
import ConnectWallet from "@/components/ConnectWallet";
import HealthTips from "@/components/HealthTips";
import ThemeToggle from "@/components/ThemeToggle";
import Link from "next/link";

export default function Home() {
  const { isConnected, address } = useAccount();

  return (
    <div className="min-h-screen">
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            🏥 Health Consultation Booking
          </h1>
          <div className="flex items-center gap-3">
            {isConnected && (
              <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">
                Dashboard
              </Link>
            )}
            <ThemeToggle />
            <ConnectWallet />
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-4 mt-8">
        {!isConnected ? (
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold text-gray-700 dark:text-gray-200 mb-4">
              Welcome to Health Consultation Booking
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              Connect your wallet to book appointments with doctors
            </p>
            <ConnectWallet />
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  Your Appointments
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
                </p>
              </div>
              <Link
                href="/appointments/create"
                className="btn-primary"
              >
                + New Appointment
              </Link>
            </div>
            <AppointmentList />
          </div>
        )}

        <div className="mt-12">
          <h2 className="section-title">💡 Daily Health Tips</h2>
          <HealthTips />
        </div>
      </main>
    </div>
  );
}
