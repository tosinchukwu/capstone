"use client";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useConfirmAppointment, useCompleteAppointment, useGetAppointment } from "@/hooks/useAppointments";

export default function AppointmentDetail({ id }: { id: number }) {
  const { address } = useAccount();
  const [dbData, setDbData] = useState<any>(null);
  const { data: contractData, refetch } = useGetAppointment(id);
  
  const { write: confirm } = useConfirmAppointment();
  const { write: complete } = useCompleteAppointment();

  useEffect(() => {
    fetch(`/api/appointments/${id}`)
      .then(res => res.json())
      .then(setDbData);
  }, [id]);

  if (!dbData || !contractData) return <div>Loading...</div>;

  const { patient, doctor, isConfirmed, isCompleted } = contractData;

  const handleConfirm = () => {
    confirm({ args: [BigInt(id)] });
    setTimeout(refetch, 5000); // Wait for transaction to confirm
  };

  const handleComplete = () => {
    complete({ args: [BigInt(id)] });
    setTimeout(refetch, 5000);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold">Appointment #{id}</h1>
      <p><strong>Patient:</strong> {dbData.patientName} ({patient})</p>
      <p><strong>Doctor:</strong> {dbData.doctorAddress}</p>
      <p><strong>Description:</strong> {dbData.description}</p>
      <p><strong>Date:</strong> {new Date(dbData.date).toLocaleString()}</p>
      <p><strong>Status:</strong> {isCompleted ? "Completed" : isConfirmed ? "Confirmed" : "Pending"}</p>

      {doctor === address && !isConfirmed && (
        <button
          onClick={handleConfirm}
          className="bg-yellow-500 text-white px-4 py-2 rounded mt-2 hover:bg-yellow-600"
        >
          Confirm Appointment
        </button>
      )}
      {doctor === address && isConfirmed && !isCompleted && (
        <button
          onClick={handleComplete}
          className="bg-green-600 text-white px-4 py-2 rounded mt-2 hover:bg-green-700"
        >
          Complete Appointment
        </button>
      )}
    </div>
  );
}
