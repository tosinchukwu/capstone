"use client";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useCreateAppointment } from "@/hooks/useAppointments";
import { useRouter } from "next/navigation";

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  location: string;
  wallet: string;
  rating: number;
  bio: string;
  yearsExperience: number;
};

export default function AppointmentForm() {
  const { address } = useAccount();
  const router = useRouter();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [date, setDate] = useState("");
  const [patientName, setPatientName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDoctorAddress, setSelectedDoctorAddress] = useState("");

  const { create, isPending } = useCreateAppointment();

  useEffect(() => {
    fetch("/api/doctors")
      .then((res) => res.json())
      .then((data) => {
        setDoctors(data);
        setLoading(false);
      })
      .catch(() => {
        console.error("Failed to fetch doctors");
        setLoading(false);
      });
  }, []);

  const handleDoctorSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const doctorId = e.target.value;
    const doctor = doctors.find((d) => d.id === doctorId);
    if (doctor) {
      setSelectedDoctor(doctorId);
      setSelectedDoctorAddress(doctor.wallet);
    } else {
      setSelectedDoctor("");
      setSelectedDoctorAddress("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !selectedDoctorAddress || !date || !patientName || !description) {
      alert("Please fill all fields.");
      return;
    }

    const dateTimestamp = Math.floor(new Date(date).getTime() / 1000);

    // Call the contract
    create([selectedDoctorAddress as `0x${string}`, BigInt(dateTimestamp)]);

    // For now, we use a placeholder appointmentId; later you'd get it from event logs.
    const appointmentId = 0;

    // Save to database
    try {
      await fetch("/api/appointments", {
        method: "POST",
        body: JSON.stringify({
          chainAppointmentId: appointmentId,
          patientId: address, // we don't have a user id yet, but we can store the wallet
          doctorId: selectedDoctor, // this is the doctor's UUID
          date: new Date(date).toISOString(),
          description,
          status: "PENDING",
        }),
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("Failed to save appointment:", err);
    }

    router.push("/");
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-600 dark:text-gray-400">Loading doctors...</div>;
  }

  if (doctors.length === 0) {
    return <div className="text-center py-8 text-gray-600 dark:text-gray-400">No doctors available yet.</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-4 bg-white dark:bg-gray-800 rounded-xl shadow-card">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Create Appointment</h1>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Select Doctor
        </label>
        <select
          value={selectedDoctor}
          onChange={handleDoctorSelect}
          className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          required
        >
          <option value="">Choose a doctor...</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name} – {doctor.specialty} ({doctor.hospital})
            </option>
          ))}
        </select>
        {selectedDoctor && (
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            <p>Wallet: {selectedDoctorAddress.slice(0, 6)}...{selectedDoctorAddress.slice(-4)}</p>
            <p>Rating: ⭐ {doctors.find(d => d.id === selectedDoctor)?.rating.toFixed(1)}</p>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Date & Time
        </label>
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Your Name
        </label>
        <input
          type="text"
          placeholder="Enter your full name"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description / Symptoms
        </label>
        <textarea
          placeholder="Describe your symptoms or reason for consultation"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          rows={4}
          required
        />
      </div>

      <button
        type="submit"
        className="w-full btn-primary"
        disabled={isPending || !address || !selectedDoctor}
      >
        {isPending ? "Creating..." : "Create Appointment"}
      </button>
    </form>
  );
}
