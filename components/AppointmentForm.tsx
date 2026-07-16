'use client';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useCreateAppointment } from '@/hooks/useAppointments';
import { useRouter } from 'next/navigation';

export default function AppointmentForm() {
  const { address } = useAccount();
  const router = useRouter();
  const [doctor, setDoctor] = useState('');
  const [date, setDate] = useState('');
  const [patientName, setPatientName] = useState('');
  const [description, setDescription] = useState('');

  const { writeAsync } = useCreateAppointment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;

    const dateTimestamp = Math.floor(new Date(date).getTime() / 1000);
    const tx = await writeAsync({
      args: [doctor as `0x${string}`, BigInt(dateTimestamp)],
    });

    // Wait for receipt to get appointmentId from event logs
    const receipt = await tx.wait();
    const event = receipt.logs.find(log => log.topics[0] === '0x...') // actually use contract event parser
    const appointmentId = 0; // parse from event

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
      <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">
        Create Appointment
      </button>
    </form>
  );
}
