"use client";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useConfirmAppointment, useCompleteAppointment, useGetAppointment } from "@/hooks/useAppointments";
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
  const { confirm, isPending: confirmPending } = useConfirmAppointment();
  const { complete, isPending: completePending } = useCompleteAppointment();

  // Fetch DB data
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

  // Safe date formatter
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Not set";
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? "Invalid date" : d.toLocaleString();
  };

  // Check if contract data is valid (not empty / zero addresses)
  const hasValidContractData = () => {
    if (!contractData) return false;
    const data = contractData as unknown as AppointmentContract;
    return data.patient !== "0x0000000000000000000000000000000000000000" ||
      data.doctor !== "0x0000000000000000000000000000000000000000" ||
      data.date > 0;
  };

  if (loading) return <div className="p-4">Loading appointment details...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  // If DB data is missing, show a friendly message
  if (!dbData) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <Link href="/" className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 mb-4 transition">
          ← Back to Home
        </Link>
        <h1 className="text-2xl font-bold">Appointment #{validId}</h1>
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-yellow-800">⚠️ Appointment data not found in database.</p>
          <p className="text-sm text-gray-600 mt-2">This appointment may have been deleted or not yet synced.</p>
        </div>
      </div>
    );
  }

  // Determine if contract data exists
  const contractExists = hasValidContractData();
  const data = contractData as unknown as AppointmentContract | undefined;

  // Safe display values
  const patientAddress = data?.patient || "Not on-chain";
  const doctorAddress = data?.doctor || "Not on-chain";
  const isConfirmed = data?.isConfirmed || false;
  const isCompleted = data?.isCompleted || false;

  const dbDate = dbData.date ? formatDate(dbData.date) : "Not set";
  const contractDate = data?.date ? new Date(Number(data.date) * 1000).toLocaleString() : "N/A";

  const handleConfirm = () => {
    confirm([BigInt(validId)]);
    setTimeout(refetch, 5000);
  };

  const handleComplete = () => {
    complete([BigInt(validId)]);
    setTimeout(refetch, 5000);
  };

  const isDoctor = address === data?.doctor;
  const canConfirm = isDoctor && !isConfirmed && contractExists;
  const canComplete = isDoctor && isConfirmed && !isCompleted && contractExists;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Link
        href="/"
        className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 mb-4 transition"
      >
        ← Back to Home
      </Link>

      <h1 className="text-2xl font-bold">Appointment #{validId}</h1>

      <div className="mt-4 space-y-2">
        <p><strong>Patient:</strong> {dbData.patient?.name || "Unknown"} ({patientAddress})</p>
        <p><strong>Doctor:</strong> {dbData.doctor?.name || "Unknown"} ({doctorAddress})</p>
        <p><strong>Description:</strong> {dbData.description || "No description"}</p>
        <p><strong>Date (DB):</strong> {dbDate}</p>
        <p><strong>Date (Contract):</strong> {contractDate}</p>
        <p>
          <strong>Status:</strong>{" "}
          <span
            className={`px-2 py-1 rounded text-sm font-medium ${isCompleted
                ? "bg-blue-100 text-blue-800"
                : isConfirmed
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
          >
            {isCompleted ? "COMPLETED" : isConfirmed ? "CONFIRMED" : "PENDING"}
          </span>
        </p>

        {/* Show warning if contract data is missing */}
        {!contractExists && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-800">
              ⚠️ This appointment is not yet recorded on the blockchain.
              You may need to wait for the transaction to confirm.
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 space-x-2">
        {canConfirm && (
          <button
            onClick={handleConfirm}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 disabled:opacity-50"
            disabled={confirmPending}
          >
            {confirmPending ? "Confirming..." : "Confirm Appointment"}
          </button>
        )}
        {canComplete && (
          <button
            onClick={handleComplete}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            disabled={completePending}
          >
            {completePending ? "Completing..." : "Complete Appointment"}
          </button>
        )}
      </div>
    </div>
  );
}