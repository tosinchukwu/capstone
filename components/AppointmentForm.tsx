"use client";
import { useState } from "react";
import { useAccount } from "wagmi";
import { useCreateAppointment } from "@/hooks/useAppointments";
import { useRouter } from "next/navigation";

export default function AppointmentForm() {
  const { address } = useAccount();
  const router = useRouter();
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");
  const [patientName, setPatientName] = useState("");
  const [description, setDescription] = useState("");

  const { create, isPending } = useCreateAppointment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;

    const dateTimestamp = Math.floor(new Date(date).getTime() / 1000);
    
    // Call the contract
    create([doctor as `0x${string}`, BigInt(dateTimestamp)]);

    // For now, we'll use a placeholder appointment ID
    // Later, you'll need to parse the event logs
    const appointmentId = 0;

    // Save to DB
    await fetch('/api/appointments', {
      method: 'POST',
      body: JSON.stringify({
        id: appointmentId,
        patientAddress: address,
        doctorAddress: doctor,
        patientName,
        description,
        date: new Date(date).toISOString(),
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    router.push('/');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Create Appointment</h1>
      <input
        type="text"
        placeholder="Doctor Address (0x...)"
        value={doctor}
        onChange={(e) => setDoctor(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="datetime-local"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="text"
        placeholder="Patient Name"
        value={patientName}
        onChange={(e) => setPatientName(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <textarea
        placeholder="Description / Symptoms"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border rounded"
        rows={4}
      />
      <button 
        type="submit" 
        className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:opacity-50"
        disabled={isPending || !address}
      >
        {isPending ? "Creating..." : "Create Appointment"}
      </button>
    </form>
  );
}
