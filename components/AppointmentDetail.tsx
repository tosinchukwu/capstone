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

  const validId = Number.isInteger(id) && id >= 0 ? id : 0;

  const { data: contractData, refetch } = useGetAppointment(validId);

  useEffect(() => {
    if (!id || id < 0) {
      setLoading(false);
      setError("Invalid appointment ID");
      return;
    }
    fetch(`/api/appointments/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Appointment not found");
        return res.json();
      })
      .then((data) => {
        setDbData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch appointment:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-4">Loading appointment details...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
  if (!dbData || !contractData) return <div className="p-4">No data available.</div>;

  const data = contractData as unknown as AppointmentContract;
  const { patient, doctor, isConfirmed, isCompleted } = data;

  const contractDate = data.date ? new Date(Number(data.date) * 1000).toLocaleString() : "N/A";

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Link
        href="/"
        className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-4 transition"
      >
        ← Back to Home
      </Link>

      <h1 className="text-2xl font-bold">Appointment #{validId}</h1>
      <div className="mt-4 space-y-2">
        <p><strong>Patient:</strong> {dbData.patient?.name || "Unknown"} ({patient})</p>
        <p><strong>Doctor:</strong> {dbData.doctor?.name || "Unknown"} ({doctor})</p>
        <p><strong>Description:</strong> {dbData.description || "No description"}</p>
        <p><strong>Date:</strong> {contractDate}</p>
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

      {/* ✅ Confirm/Complete buttons removed – only view details */}
    </div>
  );
}