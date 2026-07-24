"use client";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useGetAppointment } from "@/hooks/useAppointments";
import Link from "next/link";

type AppointmentContract = {
  id: bigint;
  patient: string;
  doctor: string;
  date: bigint;
  isConfirmed: boolean;
  isCompleted: boolean;
};

export default function AppointmentDetail({ id }: { id: number }) {
  const { address } = useAccount();
  const [dbData, setDbData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const validId = Number.isInteger(id) && id >= 0 ? id : 0;

  const { data: contractData, refetch: refetchContract } = useGetAppointment(validId);

  // ✅ Fetch both sources – used for initial load and refresh
  const fetchData = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setRefreshing(true);
    setError(null);

    try {
      // 1. Fetch database data
      const dbRes = await fetch(`/api/appointments/${id}`);
      if (!dbRes.ok) throw new Error("Appointment not found in database");
      const dbJson = await dbRes.json();
      setDbData(dbJson);

      // 2. Fetch contract data (refetch)
      await refetchContract();
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to load appointment");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ✅ Initial load
  useEffect(() => {
    fetchData(true);
  }, [id]);

  // ✅ Manual refresh
  const handleRefresh = () => {
    fetchData(false);
  };

  // Loading / error states
  if (loading) {
    return (
      <div className="p-4 text-center text-gray-600 dark:text-gray-300">
        Loading appointment details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        Error: {error}
        <button
          onClick={handleRefresh}
          className="ml-4 text-sm bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!dbData || !contractData) {
    return (
      <div className="p-4 text-center text-gray-500">No data available.</div>
    );
  }

  const data = contractData as unknown as AppointmentContract;
  const { patient, doctor, isConfirmed, isCompleted } = data;
  const contractDate = data.date
    ? new Date(Number(data.date) * 1000).toLocaleString()
    : "N/A";

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition"
        >
          ← Back to Home
        </Link>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-1 rounded transition disabled:opacity-50"
        >
          {refreshing ? "Refreshing..." : "⟳ Refresh"}
        </button>
      </div>

      <h1 className="text-2xl font-bold">Appointment #{validId}</h1>
      <div className="mt-4 space-y-2">
        <p>
          <strong>Patient:</strong> {dbData.patient?.name || "Unknown"} (
          {patient})
        </p>
        <p>
          <strong>Doctor:</strong> {dbData.doctor?.name || "Unknown"} (
          {doctor})
        </p>
        <p>
          <strong>Description:</strong> {dbData.description || "No description"}
        </p>
        <p>
          <strong>Date:</strong> {contractDate}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span
            className={`px-2 py-1 rounded text-sm font-medium ${
              isCompleted
                ? "bg-blue-100 text-blue-800"
                : isConfirmed
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {isCompleted ? "COMPLETED" : isConfirmed ? "CONFIRMED" : "PENDING"}
          </span>
        </p>
      </div>
    </div>
  );
}