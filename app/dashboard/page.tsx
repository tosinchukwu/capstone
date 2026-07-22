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
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const [pendingUpdate, setPendingUpdate] = useState<{ id: string; status: string } | null>(null);

  const { confirm: confirmAppointment, isPending: confirmPending, data: confirmData } = useConfirmAppointment();
  const { complete: completeAppointment, isPending: completePending, data: completeData } = useCompleteAppointment();

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

  const updateAppointmentStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/appointments/${id}`);
      if (!res.ok) throw new Error("Appointment not found");
      const app = await res.json();

      if (status === "CONFIRMED") {
        const chainId = BigInt(app.chainAppointmentId);
        setPendingUpdate({ id, status });
        confirmAppointment([chainId]);
        alert("⏳ Confirm transaction sent. Waiting for confirmation...");
      } else if (status === "COMPLETED") {
        const chainId = BigInt(app.chainAppointmentId);
        setPendingUpdate({ id, status });
        completeAppointment([chainId]);
        alert("⏳ Complete transaction sent. Waiting for confirmation...");
      } else if (status === "CANCELLED") {
        const updateRes = await fetch(`/api/appointments/${id}`, {
          method: "PUT",
          body: JSON.stringify({ status }),
          headers: { "Content-Type": "application/json" },
        });
        if (!updateRes.ok) throw new Error("Failed to update database");
        setRefreshKey((prev) => prev + 1);
        alert("✅ Appointment rejected.");
      }
    } catch (error) {
      console.error("❌ Error:", error);
      alert("Failed to update appointment: " + (error as Error).message);
    }
  };

  useEffect(() => {
    if (confirmData) setTxHash(confirmData as `0x${string}`);
    if (completeData) setTxHash(completeData as `0x${string}`);
  }, [confirmData, completeData]);

  useEffect(() => {
    if (isSuccess && pendingUpdate) {
      const { id, status } = pendingUpdate;
      fetch(`/api/appointments/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to update DB");
          setRefreshKey((prev) => prev + 1);
          alert(`✅ Appointment ${status.toLowerCase()} successfully!`);
          setPendingUpdate(null);
        })
        .catch((err) => {
          console.error("DB update error:", err);
          alert("❌ Transaction confirmed but failed to update database.");
          setPendingUpdate(null);
        });
    }
    if (isError) {
      setPendingUpdate(null);
      alert("❌ Transaction failed. Please try again.");
    }
  }, [isSuccess, isError, pendingUpdate]);

  const isContractPending = confirmPending || completePending || isWaiting;

  if (!isConnected) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-bold theme-text">Doctor Dashboard</h1>
        <div className="mt-8 text-center py-20">
          <p className="theme-text-secondary">Connect your wallet to access the dashboard.</p>
          <ConnectWallet />
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="max-w-6xl mx-auto p-4 theme-text">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold theme-text">Doctor Dashboard</h1>
        <Link href="/" className="theme-accent hover:underline">← Home</Link>
      </div>

      <Greeting />   {/* ✅ added here */}

      <div className="mb-4">
        <Link href="/dashboard/profile" className="theme-accent hover:underline">
          Edit Profile →
        </Link>
        <button
          onClick={() => setRefreshKey((prev) => prev + 1)}
          className="ml-4 text-sm theme-accent hover:underline"
        >
          Refresh Appointments
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold theme-text mb-4">Appointments</h2>
        <AppointmentList
          doctorId={doctorId}
          refresh={refreshKey}
          onStatusUpdate={updateAppointmentStatus}
          isPending={isContractPending}
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold theme-text">Manage Slots</h2>
          <button onClick={refreshSlots} className="btn-secondary text-sm px-3 py-1">
            Refresh Slots
          </button>
        </div>
        <form onSubmit={handleAddSlot} className="flex flex-wrap gap-2 mb-4">
          <input
            type="date"
            value={newSlotDate}
            onChange={(e) => setNewSlotDate(e.target.value)}
            className="p-2 border rounded theme-input theme-border focus:ring-2 focus:ring-accent outline-none"
            required
          />
          <input
            type="time"
            value={newSlotStart}
            onChange={(e) => setNewSlotStart(e.target.value)}
            className="p-2 border rounded theme-input theme-border focus:ring-2 focus:ring-accent outline-none"
            required
          />
          <input
            type="time"
            value={newSlotEnd}
            onChange={(e) => setNewSlotEnd(e.target.value)}
            className="p-2 border rounded theme-input theme-border focus:ring-2 focus:ring-accent outline-none"
            required
          />
          <button type="submit" className="btn-primary">Add Slot</button>
        </form>

        {slots.length === 0 && <p className="theme-text-secondary">No slots created yet.</p>}
        <div className="grid gap-2">
          {slots.map((slot) => (
            <div key={slot.id} className="flex justify-between items-center p-3 theme-bg-secondary rounded border theme-border">
              <span className="theme-text-secondary">
                {slot.date ? new Date(slot.date).toLocaleDateString() : "No date"} {slot.startTime} - {slot.endTime}
                {slot.isBooked && " (Booked)"}
              </span>
              {!slot.isBooked && (
                <button
                  onClick={() => handleDeleteSlot(slot.id)}
                  className="theme-danger hover:opacity-80 text-sm"
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