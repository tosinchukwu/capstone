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
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-primary-600 dark:text-primary-400 truncate sm:truncate md:overflow-visible md:whitespace-normal max-w-[180px] sm:max-w-[300px] md:max-w-none">
            🏥 Health Consultation Booking
          </h1>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {isConnected && (
              <Link href="/dashboard" className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap">
                Dashboard
              </Link>
            )}
            <ThemeToggle />
            <ConnectWallet />
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-3 sm:p-4 mt-4 sm:mt-8">
        {!isConnected ? (
          <div className="text-center py-12 sm:py-20">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-700 dark:text-gray-200 mb-4">
              Welcome to Health Consultation Booking
            </h2>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-6 sm:mb-8">
              Connect your wallet to book appointments with doctors
            </p>
            <ConnectWallet />
          </div>
        ) : (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">
                  Your Appointments
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
                </p>
              </div>
              <Link href="/appointments/create" className="btn-primary text-sm sm:text-base px-4 py-2 sm:px-6">
                + New Appointment
              </Link>
            </div>
            <AppointmentList patientId={address} />
          </div>
        )}

        <div className="mt-8 sm:mt-12">
          <h2 className="section-title text-xl sm:text-2xl">💡 Daily Health Tips</h2>
          <HealthTips />
        </div>
      </main>
    </div>
  );
}