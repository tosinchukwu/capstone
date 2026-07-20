"use client";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ConnectWallet from "@/components/ConnectWallet";
import { useConfirmAppointment, useCompleteAppointment } from "@/hooks/useAppointments";

type Appointment = {
  id: string;
  chainAppointmentId: string | number;
  patient: { name: string; wallet: string } | null;
  doctor: { name: string; wallet: string } | null;
  date: string | null;
  status: string;
  description: string;
};

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
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [newSlotDate, setNewSlotDate] = useState("");
  const [newSlotStart, setNewSlotStart] = useState("");
  const [newSlotEnd, setNewSlotEnd] = useState("");
  const [loading, setLoading] = useState(true);
  const [doctorId, setDoctorId] = useState("");

  // ✅ Rename to avoid shadowing window.confirm
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
          fetchData(data.id);
        } else {
          router.push("/register-doctor");
        }
      })
      .catch(() => {
        router.push("/register-doctor");
      });
  }, [address, isConnected, router]);

  const fetchData = async (id: string) => {
    try {
      const [appointmentsRes, slotsRes] = await Promise.all([
        fetch(`/api/appointments?doctorId=${id}`),
        fetch(`/api/availability?doctorId=${id}`),
      ]);

      if (!appointmentsRes.ok) throw new Error("Failed to fetch appointments");
      if (!slotsRes.ok) throw new Error("Failed to fetch slots");

      const appointmentsData = await appointmentsRes.json();
      const slotsData = await slotsRes.json();

      setAppointments(appointmentsData);
      setSlots(slotsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setAppointments([]);
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshSlots = async () => {
    if (doctorId) {
      setLoading(true);
      await fetchData(doctorId);
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
      } else {
        alert("Failed to add slot: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error adding slot:", error);
      alert("Error adding slot. Check console.");
    }
  };

  const handleDeleteSlot = async (id: string) => {
    // ✅ Use window.confirm to avoid shadowing
    if (!window.confirm("Delete this slot?")) return;
    const res = await fetch(`/api/availability?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setSlots(slots.filter((s) => s.id !== id));
    } else {
      alert("Failed to delete slot.");
    }
  };

  const updateAppointmentStatus = async (id: string, status: string) => {
    try {
      const app = appointments.find((a) => a.id === id);
      if (!app) {
        alert("Appointment not found. Please refresh and try again.");
        return;
      }

      if (status === "CONFIRMED") {
        const chainId = typeof app.chainAppointmentId === 'string'
          ? BigInt(app.chainAppointmentId)
          : BigInt(app.chainAppointmentId);
        confirmAppointment([chainId]); // ✅ use renamed function
        console.log("✅ Confirm transaction sent");
      } else if (status === "COMPLETED") {
        const chainId = typeof app.chainAppointmentId === 'string'
          ? BigInt(app.chainAppointmentId)
          : BigInt(app.chainAppointmentId);
        completeAppointment([chainId]); // ✅ use renamed function
        console.log("✅ Complete transaction sent");
      } else if (status === "CANCELLED") {
        console.log("📝 Cancelling (database only)");
      }

      if (status === "CONFIRMED" || status === "COMPLETED") {
        console.log("⏳ Waiting for transaction...");
        await new Promise((resolve) => setTimeout(resolve, 5000));
        console.log("✅ Transaction should be mined");
      }

      const res = await fetch(`/api/appointments/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
        headers: { "Content-Type": "application/json" },
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error(`Server returned ${res.status}: ${res.statusText}`);
      }

      if (!res.ok) {
        throw new Error(data.error || "Failed to update status");
      }

      console.log(`✅ Appointment ${id} → ${status}`);

      if (doctorId) {
        await fetchData(doctorId);
      }
    } catch (error) {
      console.error("❌ Error:", error);
      alert("Failed to update appointment: " + (error as Error).message);
    }
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
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Appointments</h2>
        {appointments.length === 0 && <p className="text-gray-500">No appointments yet.</p>}
        <div className="grid gap-4">
          {appointments.map((app) => (
            <div key={app.id} className="card card-hover">
              <div className="flex justify-between items-start">
                <div>
                  <p><strong>Patient:</strong> {app.patient?.name || "Unknown"}</p>
                  <p><strong>Date:</strong> {app.date ? new Date(app.date).toLocaleString() : "Not set"}</p>
                  <p><strong>Description:</strong> {app.description}</p>
                  <p className="mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${app.status === "CONFIRMED" ? "bg-green-100 text-green-800" :
                        app.status === "COMPLETED" ? "bg-blue-100 text-blue-800" :
                          app.status === "CANCELLED" ? "bg-red-100 text-red-800" :
                            "bg-yellow-100 text-yellow-800"
                      }`}>
                      {app.status || "PENDING"}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2">
                  {app.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => updateAppointmentStatus(app.id, "CONFIRMED")}
                        className="btn-primary text-sm px-3 py-1"
                        disabled={confirmPending}
                      >
                        {confirmPending ? "Confirming..." : "Confirm"}
                      </button>
                      <button
                        onClick={() => updateAppointmentStatus(app.id, "CANCELLED")}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {app.status === "CONFIRMED" && (
                    <button
                      onClick={() => updateAppointmentStatus(app.id, "COMPLETED")}
                      className="btn-accent text-sm px-3 py-1"
                      disabled={completePending}
                    >
                      {completePending ? "Completing..." : "Complete"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
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