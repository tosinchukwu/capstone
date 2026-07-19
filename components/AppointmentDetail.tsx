"use client";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useConfirmAppointment, useCompleteAppointment, useGetAppointment } from "@/hooks/useAppointments";

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
  const validId = Number.isInteger(id) && id >= 0 ? id : 0;
  const { data: contractData, refetch } = useGetAppointment(validId);
  const { confirm, isPending: confirmPending } = useConfirmAppointment();
  const { complete, isPending: completePending } = useCompleteAppointment();

  useEffect(() => {
    if (!Number.isInteger(id) || id < 0) return;
    fetch(`/api/appointments/${id}`)
      .then((res) => res.json())
      .then(setDbData)
      .catch(console.error);
  }, [id]);

  if (!dbData || !contractData) return <div>Loading...</div>;

  const data = contractData as unknown as AppointmentContract;
  const { patient, doctor, isConfirmed, isCompleted } = data;

  // Safe date formatting
  const dbDate = dbData.date ? new Date(dbData.date).toLocaleString() : "Not set";
  const contractDate = data.date ? new Date(Number(data.date) * 1000).toLocaleString() : "N/A";

  const handleConfirm = () => {
    confirm([BigInt(validId)]);
    setTimeout(refetch, 5000);
  };

  const handleComplete = () => {
    complete([BigInt(validId)]);
    setTimeout(refetch, 5000);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold">Appointment #{validId}</h1>
      <p><strong>Patient:</strong> {dbData.patientName || "Unknown"} ({patient})</p>
      <p><strong>Doctor:</strong> {dbData.doctorAddress || "Unknown"}</p>
      <p><strong>Description:</strong> {dbData.description || "No description"}</p>
      <p><strong>Date (DB):</strong> {dbDate}</p>
      <p><strong>Date (Contract):</strong> {contractDate}</p>
      <p><strong>Status:</strong> {isCompleted ? "Completed" : isConfirmed ? "Confirmed" : "Pending"}</p>

      {doctor === address && !isConfirmed && (
        <button
          onClick={handleConfirm}
          className="bg-yellow-500 text-white px-4 py-2 rounded mt-2 hover:bg-yellow-600"
          disabled={confirmPending}
        >
          {confirmPending ? "Confirming..." : "Confirm Appointment"}
        </button>
      )}
      {doctor === address && isConfirmed && !isCompleted && (
        <button
          onClick={handleComplete}
          className="bg-green-600 text-white px-4 py-2 rounded mt-2 hover:bg-green-700"
          disabled={completePending}
        >
          {completePending ? "Completing..." : "Complete Appointment"}
        </button>
      )}
    </div>
  );
}