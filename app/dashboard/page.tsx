"use client";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ConnectWallet from "@/components/ConnectWallet";
import AppointmentList from "@/components/AppointmentList";
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

  const { confirm: confirmAppointment, isPending: confirmPending } = useConfirmAppointment();
  const { complete: completeAppointment, isPending: completePending } = useCompleteAppointment();

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

  // ✅ Status update handler – calls contract then updates DB
  const updateAppointmentStatus = async (id: string, status: string) => {
    try {
      // 1. Fetch appointment to get chainAppointmentId
      const res = await fetch(`/api/appointments/${id}`);
      if (!res.ok) throw new Error("Appointment not found");
      const app = await res.json();

      // 2. Call contract if confirming or completing
      if (status === "CONFIRMED") {
        const chainId = BigInt(app.chainAppointmentId);
        confirmAppointment([chainId]);
        console.log("✅ Confirm transaction sent for ID:", chainId.toString());
      } else if (status === "COMPLETED") {
        const chainId = BigInt(app.chainAppointmentId);
        completeAppointment([chainId]);
        console.log("✅ Complete transaction sent for ID:", chainId.toString());
      } else if (status === "CANCELLED") {
        console.log("📝 Rejecting (database only)");
      }

      // 3. Wait 15 seconds for mining (if contract called)
      if (status === "CONFIRMED" || status === "COMPLETED") {
        console.log("⏳ Waiting for transaction to mine...");
        await new Promise((resolve) => setTimeout(resolve, 15000));
        console.log("✅ Transaction should be mined");
      }

      // 4. Update database
      const updateRes = await fetch(`/api/appointments/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
        headers: { "Content-Type": "application/json" },
      });
      if (!updateRes.ok) {
        const errData = await updateRes.json();
        throw new Error(errData.error || "Failed to update status in database");
      }

      // 5. Refresh list
      setRefreshKey((prev) => prev + 1);
      alert(`Appointment ${status.toLowerCase()} successfully!`);
    } catch (error) {
      console.error("❌ Error updating appointment:", error);
      alert("Failed to update appointment: " + (error as Error).message);
    }
  };

  const handleRefreshAppointments = () => {
    setRefreshKey((prev) => prev + 1);
  };

  if (!isConnected) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
        <div className="mt-8 text-center py-20">
          <p className="text-gray-500">Connect your wallet to access the dashboard.</p>
          <ConnectWallet />
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="max-w-6xl mx-auto p-4">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Doctor Dashboard</h1>
        <Link href="/" className="text-primary-600 hover:underline">← Home</Link>
      </div>

      <div className="mb-4">
        <Link href="/dashboard/profile" className="text-blue-600 hover:underline">
          Edit Profile →
        </Link>
        <button
          onClick={handleRefreshAppointments}
          className="ml-4 text-sm text-blue-600 hover:underline"
        >
          Refresh Appointments
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Appointments</h2>
        <AppointmentList
          doctorId={doctorId}
          refresh={refreshKey}
          onUpdate={handleRefreshAppointments}
          onStatusUpdate={updateAppointmentStatus}
          isPending={confirmPending || completePending}
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Manage Slots</h2>
          <button onClick={refreshSlots} className="btn-secondary text-sm px-3 py-1">
            Refresh Slots
          </button>
        </div>
        <form onSubmit={handleAddSlot} className="flex flex-wrap gap-2 mb-4">
          <input
            type="date"
            value={newSlotDate}
            onChange={(e) => setNewSlotDate(e.target.value)}
            className="p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
            required
          />
          <input
            type="time"
            value={newSlotStart}
            onChange={(e) => setNewSlotStart(e.target.value)}
            className="p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
            required
          />
          <input
            type="time"
            value={newSlotEnd}
            onChange={(e) => setNewSlotEnd(e.target.value)}
            className="p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
            required
          />
          <button type="submit" className="btn-primary">Add Slot</button>
        </form>

        {slots.length === 0 && <p className="text-gray-500">No slots created yet.</p>}
        <div className="grid gap-2">
          {slots.map((slot) => (
            <div key={slot.id} className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-800 rounded">
              <span>
                {slot.date ? new Date(slot.date).toLocaleDateString() : "No date"} {slot.startTime} - {slot.endTime}
                {slot.isBooked && " (Booked)"}
              </span>
              {!slot.isBooked && (
                <button
                  onClick={() => handleDeleteSlot(slot.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
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