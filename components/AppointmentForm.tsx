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

type Slot = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
};

export default function AppointmentForm() {
  const { address } = useAccount();
  const router = useRouter();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [patientName, setPatientName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDoctorAddress, setSelectedDoctorAddress] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { create, isPending } = useCreateAppointment();

  // Fetch doctors
  useEffect(() => {
    fetch("/api/doctors")
      .then((res) => res.json())
      .then((data) => {
        setDoctors(data);
        setLoadingDoctors(false);
      })
      .catch(() => setLoadingDoctors(false));
  }, []);

  // Fetch slots when doctor is selected
  useEffect(() => {
    if (!selectedDoctorId) {
      setSlots([]);
      return;
    }
    setLoadingSlots(true);
    fetch(`/api/availability?doctorId=${selectedDoctorId}`)
      .then((res) => res.json())
      .then((data) => {
        setSlots(data);
        setLoadingSlots(false);
      })
      .catch(() => setLoadingSlots(false));
  }, [selectedDoctorId]);

  const handleDoctorSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const doctorId = e.target.value;
    const doctor = doctors.find((d) => d.id === doctorId);
    if (doctor) {
      setSelectedDoctor(doctorId);
      setSelectedDoctorAddress(doctor.wallet);
      setSelectedDoctorId(doctorId);
      setSelectedSlot("");
    }
  };

  const handleSlotSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSlot(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      alert("Please connect your wallet first.");
      return;
    }
    if (!selectedDoctorAddress) {
      alert("Please select a doctor.");
      return;
    }
    if (!selectedSlot) {
      alert("Please select an available slot.");
      return;
    }
    if (!patientName || !description) {
      alert("Please fill in all fields.");
      return;
    }

    const slot = slots.find((s) => s.id === selectedSlot);
    if (!slot) {
      alert("Selected slot not found.");
      return;
    }

    setIsSubmitting(true);

    const dateTimestamp = Math.floor(new Date(slot.date).getTime() / 1000);

    // 1. Call the contract
    try {
      await create([selectedDoctorAddress as `0x${string}`, BigInt(dateTimestamp)]);
    } catch (err: any) {
      console.error("Contract call failed:", err);
      alert("Contract call failed: " + (err.message || "Unknown error"));
      setIsSubmitting(false);
      return;
    }

    // 2. Save to database
    try {
      const uniqueId = Date.now();

      const res = await fetch("/api/appointments", {
        method: "POST",
        body: JSON.stringify({
          chainAppointmentId: uniqueId,
          patientWallet: address,
          patientName: patientName,
          doctorId: selectedDoctorId,
          date: slot.date,
          description,
          availabilityId: selectedSlot,
          status: "PENDING",
        }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save appointment");
      }
    } catch (err: any) {
      console.error("API call failed:", err);
      alert("Failed to save appointment to database: " + (err.message || "Unknown error"));
      setIsSubmitting(false);
      return;
    }

    alert("Appointment booked successfully!");
    router.push("/");
  };

  if (loadingDoctors) {
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
            <p>Rating: ⭐ {doctors.find(d => d.id === selectedDoctor)?.rating?.toFixed(1) || "N/A"}</p>
          </div>
        )}
      </div>

      {selectedDoctorId && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Available Slots
          </label>
          {loadingSlots ? (
            <p className="text-sm text-gray-500">Loading slots...</p>
          ) : slots.length === 0 ? (
            <p className="text-sm text-yellow-600">No available slots for this doctor.</p>
          ) : (
            <select
              value={selectedSlot}
              onChange={handleSlotSelect}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              required
            >
              <option value="">Select a slot...</option>
              {slots.map((slot) => (
                <option key={slot.id} value={slot.id}>
                  {new Date(slot.date).toLocaleDateString()} {slot.startTime} - {slot.endTime}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

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
        disabled={isPending || isSubmitting || !selectedSlot}
      >
        {isPending || isSubmitting ? "Booking..." : "Book Appointment"}
      </button>
    </form>
  );
}
