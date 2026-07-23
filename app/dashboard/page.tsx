"use client";
import { useEffect, useState } from "react";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ConnectWallet from "@/components/ConnectWallet";
import AppointmentList from "@/components/AppointmentList";
import Greeting from "@/components/Greeting";
import { useConfirmAppointment, useCompleteAppointment } from "@/hooks/useAppointments";

type Slot = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
};

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [newSlotDate, setNewSlotDate] = useState("");
  const [newSlotStart, setNewSlotStart] = useState("");
  const [newSlotEnd, setNewSlotEnd] = useState("");
  const [loading, setLoading] = useState(true);
  const [doctorId, setDoctorId] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const { confirm: confirmAppointment, isPending: confirmPending, data: confirmData } = useConfirmAppointment();
  const { complete: completeAppointment, isPending: completePending, data: completeData } = useCompleteAppointment();

  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const { isLoading: isWaiting, isSuccess, isError } = useWaitForTransactionReceipt({ hash: txHash });

  useEffect(() => {
    if (!isConnected || !address) return;

    fetch(`/api/doctors/profile?wallet=${address}`)
      .then((res) => {
        if (!res.ok) throw new Error("Doctor profile not found");
        return res.json();
      })
      .then((data) => {
        if (data.id) {
          setDoctorId(data.id);
          fetchSlots(data.id);
        } else {
          router.push("/register-doctor");
        }
      })
      .catch(() => {
        router.push("/register-doctor");
      });
  }, [address, isConnected, router]);

  const fetchSlots = async (id: string) => {
    try {
      const res = await fetch(`/api/availability?doctorId=${id}`);
      if (!res.ok) throw new Error("Failed to fetch slots");
      const data = await res.json();
      setSlots(data);
    } catch (error) {
      console.error("Error fetching slots:", error);
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshSlots = async () => {
    if (doctorId) {
      setLoading(true);
      await fetchSlots(doctorId);
      setLoading(false);
    }
  };

  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorId || !newSlotDate || !newSlotStart || !newSlotEnd) {
      alert("Please fill all fields.");
      return;
    }
    try {
      const res = await fetch("/api/availability", {
        method: "POST",
        body: JSON.stringify({
          doctorId,
          date: newSlotDate,
          startTime: newSlotStart,
          endTime: newSlotEnd,
        }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.ok) {
        setSlots([...slots, data]);
        setNewSlotDate("");
        setNewSlotStart("");
        setNewSlotEnd("");
        alert("Slot added successfully!");
        setRefreshKey((prev) => prev + 1);
      } else {
        alert("Failed to add slot: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error adding slot:", error);
      alert("Error adding slot. Check console.");
    }
  };

  const handleDeleteSlot = async (id: string) => {
    if (!window.confirm("Delete this slot?")) return;
    const res = await fetch(`/api/availability?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setSlots(slots.filter((s) => s.id !== id));
    } else {
      alert("Failed to delete slot.");
    }
  };

  const handleRefreshAppointments = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // No updateAppointmentStatus here – AppointmentList handles it internally

  useEffect(() => {
    if (confirmData) setTxHash(confirmData as `0x${string}`);
    if (completeData) setTxHash(completeData as `0x${string}`);
  }, [confirmData, completeData]);

  const isContractPending = confirmPending || completePending || isWaiting;

  if (!isConnected) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Doctor Dashboard</h1>
        <div className="mt-8 text-center py-20">
          <p className="text-gray-500 dark:text-gray-400">Connect your wallet to access the dashboard.</p>
          <ConnectWallet />
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="max-w-6xl mx-auto p-4 text-gray-600 dark:text-gray-300">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Doctor Dashboard</h1>
        <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">← Home</Link>
      </div>

      <Greeting />

      <div className="mb-4">
        <Link href="/dashboard/profile" className="text-blue-600 dark:text-blue-400 hover:underline">
          Edit Profile →
        </Link>
        <button
          onClick={handleRefreshAppointments}
          className="ml-4 text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          Refresh Appointments
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Appointments</h2>
        {/* ✅ Only required props – onStatusUpdate and isPending are removed */}
        <AppointmentList
          doctorId={doctorId}
          refresh={refreshKey}
          onUpdate={handleRefreshAppointments}
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Manage Slots</h2>
          <button onClick={refreshSlots} className="btn-secondary text-sm px-3 py-1">
            Refresh Slots
          </button>
        </div>
        <form onSubmit={handleAddSlot} className="flex flex-wrap gap-2 mb-4">
          <input
            type="date"
            value={newSlotDate}
            onChange={(e) => setNewSlotDate(e.target.value)}
            className="input-field"
            required
          />
          <input
            type="time"
            value={newSlotStart}
            onChange={(e) => setNewSlotStart(e.target.value)}
            className="input-field"
            required
          />
          <input
            type="time"
            value={newSlotEnd}
            onChange={(e) => setNewSlotEnd(e.target.value)}
            className="input-field"
            required
          />
          <button type="submit" className="btn-primary">Add Slot</button>
        </form>

        {slots.length === 0 && <p className="text-gray-500 dark:text-gray-400">No slots created yet.</p>}
        <div className="grid gap-2">
          {slots.map((slot) => (
            <div key={slot.id} className="flex justify-between items-center p-3 bg-white dark:bg-slate-800 rounded border border-gray-200 dark:border-slate-700">
              <span className="text-gray-700 dark:text-gray-300">
                {slot.date ? new Date(slot.date).toLocaleDateString() : "No date"} {slot.startTime} - {slot.endTime}
                {slot.isBooked && " (Booked)"}
              </span>
              {!slot.isBooked && (
                <button
                  onClick={() => handleDeleteSlot(slot.id)}
                  className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
