"use client";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import AppointmentList from "@/components/AppointmentList";
import ConnectWallet from "@/components/ConnectWallet";
import HealthTips from "@/components/HealthTips";
import ThemeToggle from "@/components/ThemeToggle";
import Link from "next/link";
import HospitalInfo from "@/components/HospitalInfo"; // ✅ new import

export default function Home() {
  const { isConnected, address } = useAccount();
  const [role, setRole] = useState<"patient" | "doctor" | null>(null);

  useEffect(() => {
    const savedRole = localStorage.getItem("userRole") as "patient" | "doctor" | null;
    if (savedRole) setRole(savedRole);
  }, []);

  const selectRole = (selected: "patient" | "doctor") => {
    setRole(selected);
    localStorage.setItem("userRole", selected);
  };

  if (!role) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-card p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            🏥 Health Consultation
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Are you a patient or a doctor?
          </p>
          <div className="flex flex-col gap-4">
            <button
              onClick={() => selectRole("patient")}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-all hover:shadow-lg hover:scale-105 active:scale-95 w-full text-lg"
            >
              👤 I'm a Patient
            </button>
            <button
              onClick={() => selectRole("doctor")}
              className="bg-secondary-600 text-white px-6 py-3 rounded-lg hover:bg-secondary-700 transition-all hover:shadow-lg hover:scale-105 active:scale-95 w-full text-lg"
            >
              👨‍⚕️ I'm a Doctor
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-6">
            You can change this later from the "Switch Role" button.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-primary-600 dark:text-primary-400 truncate max-w-[180px] sm:max-w-[300px] md:max-w-none">
            🏥 Health Consultation Booking
          </h1>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {isConnected && (
              <>
                {role === "doctor" && (
                  <Link
                    href="/dashboard"
                    className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    localStorage.removeItem("userRole");
                    setRole(null);
                  }}
                  className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  Switch Role
                </button>
              </>
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
              Connect your wallet to continue
            </p>
            <ConnectWallet />
          </div>
        ) : (
          <div>
            {role === "patient" && (
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
                  <Link
                    href="/appointments/create"
                    className="btn-primary text-sm sm:text-base px-4 py-2 sm:px-6"
                  >
                    + New Appointment
                  </Link>
                </div>
                <AppointmentList patientWallet={address} />
              </div>
            )}

            {role === "doctor" && (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">
                      Doctor Dashboard
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
                    </p>
                  </div>
                  <Link
                    href="/dashboard"
                    className="btn-secondary text-sm sm:text-base px-4 py-2 sm:px-6"
                  >
                    Go to Full Dashboard →
                  </Link>
                </div>
                <AppointmentList doctorId={address} />
              </div>
            )}
          </div>
        )}

        <div className="mt-8 sm:mt-12">
          <h2 className="section-title text-xl sm:text-2xl">💡 Daily Health Tips</h2>
          <HealthTips />
        </div>
      </main>

      {/* ✅ Updated Footer – Admin Link + Hospital Info */}
      <footer className="max-w-6xl mx-auto px-4 pb-6 text-center text-xs text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4 mt-8">
        <div className="flex flex-col items-center gap-2">
          <Link href="/admin" className="hover:text-gold-500 transition-colors">
            Admin Panel
          </Link>
          <HospitalInfo />
        </div>
      </footer>
    </div>
  );
}