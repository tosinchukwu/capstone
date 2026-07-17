"use client";
import { useAccount } from "wagmi";
import AppointmentList from "@/components/AppointmentList";
import ConnectWallet from "@/components/ConnectWallet";
import Link from "next/link";

export default function Home() {
  const { isConnected, address } = useAccount();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm p-4 border-b">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">
            🏥 Health Consultation Booking
          </h1>
          <ConnectWallet />
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-4 mt-8">
        {!isConnected ? (
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold text-gray-700 mb-4">
              Welcome to Health Consultation Booking
            </h2>
            <p className="text-gray-500 mb-8">
              Connect your wallet to book appointments with doctors
            </p>
            <ConnectWallet />
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Your Appointments
                </h2>
                <p className="text-sm text-gray-500">
                  Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
                </p>
              </div>
              <Link
                href="/appointments/create"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                + New Appointment
              </Link>
            </div>
            <AppointmentList />
          </div>
        )}
      </main>
    </div>
  );
}
