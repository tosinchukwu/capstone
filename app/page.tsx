"use client";
import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useAccount } from "wagmi";
import AppointmentList from "@/components/AppointmentList";
import ConnectWallet from "@/components/ConnectWallet";
import HealthTips from "@/components/HealthTips";
import ThemeSettings from "@/components/ThemeSettings";
import Greeting from "@/components/Greeting";
import Link from "next/link";
import Logo from "@/components/Logo";
import HospitalInfo from "@/components/HospitalInfo";

export default function Home() {
  const { authenticated } = usePrivy();
  const { address } = useAccount();
  const [role, setRole] = useState<"patient" | "doctor" | null>(null);
  const [rememberChoice, setRememberChoice] = useState(true);

  useEffect(() => {
    const savedRole = localStorage.getItem("userRole") as "patient" | "doctor" | null;
    if (savedRole) setRole(savedRole);
  }, []);

  const selectRole = (selected: "patient" | "doctor") => {
    setRole(selected);
    if (rememberChoice) {
      localStorage.setItem("userRole", selected);
    } else {
      sessionStorage.setItem("userRole", selected);
    }
  };

  // Role selector
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
          <div className="mt-4 flex items-center justify-center gap-2">
            <input
              type="checkbox"
              id="rememberChoice"
              checked={rememberChoice}
              onChange={(e) => setRememberChoice(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="rememberChoice" className="text-sm text-gray-500 dark:text-gray-400">
              Remember my choice
            </label>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            You can always switch roles later using the "Switch Role" button.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b theme-border">
        <div className="relative max-w-6xl mx-auto">
          <div className="absolute left-0 top-0 h-full flex items-center">
            <div className="ml-2 sm:ml-4">
              <Logo />
            </div>
          </div>
          <div className="flex justify-end items-center min-h-14 sm:h-16 px-2 sm:px-4">
            <div className="flex items-center gap-1 sm:gap-3 flex-wrap justify-end">
              {authenticated && (
                <>
                  {role === "doctor" && (
                    <Link
                      href="/dashboard"
                      className="text-[10px] sm:text-sm text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap"
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      localStorage.removeItem("userRole");
                      setRole(null);
                    }}
                    className="text-[10px] sm:text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 whitespace-nowrap"
                  >
                    Switch Role
                  </button>
                </>
              )}
              <ThemeSettings />
              <ConnectWallet />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-3 sm:p-4 mt-4 sm:mt-8">
        {!authenticated ? (
          <div className="text-center py-12 sm:py-20">
            <h2 className="text-2xl sm:text-3xl font-bold theme-text mb-4">
              Welcome to MEDCRUSH Blockchain Hospital
            </h2>
            <p className="text-sm sm:text-base theme-text-secondary mb-6 sm:mb-8">
              Connect your wallet to continue
            </p>
            <ConnectWallet />
          </div>
        ) : (
          <div>
            <Greeting />
            {role === "patient" && (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold theme-text">
                      Your Appointments
                    </h2>
                    <p className="text-xs sm:text-sm theme-text-secondary">
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
                    <h2 className="text-xl sm:text-2xl font-bold theme-text">
                      Doctor Dashboard
                    </h2>
                    <p className="text-xs sm:text-sm theme-text-secondary">
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
          <h2 className="section-title">💡 Daily Health Tips</h2>
          <HealthTips />
        </div>
      </main>

      <footer className="max-w-6xl mx-auto px-4 pb-6 text-center text-xs text-gray-400 border-t theme-border pt-4 mt-8">
        <div className="flex flex-col items-center gap-2">
          <Link href="/admin" className="hover:theme-accent transition-colors">
            Admin Panel
          </Link>
          <HospitalInfo />
        </div>
      </footer>
    </div>
  );
}