"use client";
import { useEffect, useState } from "react";
import { useWaitForTransactionReceipt } from "wagmi";
import AppointmentCard from "./AppointmentCard";
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

interface AppointmentListProps {
  patientId?: string;
  patientWallet?: string;
  doctorId?: string;
  refresh?: number;
  onUpdate?: () => void;
  isPending?: boolean;
}

export default function AppointmentList({
  patientId,
  patientWallet,
  doctorId,
  refresh,
  onUpdate,
  isPending,
}: AppointmentListProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const [pendingUpdate, setPendingUpdate] = useState<{ id: string; status: string } | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { confirm: confirmAppointment, data: confirmData } = useConfirmAppointment();
  const { complete: completeAppointment, data: completeData } = useCompleteAppointment();

  const { isLoading: isWaiting, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  const fetchAppointments = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (patientId) params.append("patientId", patientId);
    if (patientWallet) params.append("patientWallet", patientWallet);
    if (doctorId) params.append("doctorId", doctorId);
    const url = `/api/appointments?${params.toString()}`;
    console.log("📡 Fetching appointments with params:", params.toString());
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch appointments");
        return res.json();
      })
      .then((data) => {
        console.log("✅ Fetched appointments:", data.length);
        setAppointments(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching appointments:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAppointments();
  }, [patientId, patientWallet, doctorId, refresh, refreshTrigger]);

  // When transaction data arrives, set the hash
  useEffect(() => {
    if (confirmData) {
      console.log("⛓️ confirmData received:", confirmData);
      setTxHash(confirmData as `0x${string}`);
    }
    if (completeData) {
      console.log("⛓️ completeData received:", completeData);
      setTxHash(completeData as `0x${string}`);
    }
  }, [confirmData, completeData]);

  // When transaction succeeds, refresh the list
  useEffect(() => {
    if (isSuccess) {
      console.log("✅ Transaction mined – refreshing appointments");
      fetchAppointments();
      setRefreshTrigger((prev) => prev + 1);
      if (onUpdate) onUpdate();
      setTxHash(undefined);
      setPendingUpdate(null);
    }
  }, [isSuccess]);

  // ✅ Fallback: after sending a transaction, also refresh after 15 seconds
  useEffect(() => {
    if (txHash && !isSuccess) {
      const timeout = setTimeout(() => {
        console.log("⏳ Fallback refresh after 15 seconds");
        fetchAppointments();
        setRefreshTrigger((prev) => prev + 1);
        if (onUpdate) onUpdate();
        setTxHash(undefined);
        setPendingUpdate(null);
      }, 15000);
      return () => clearTimeout(timeout);
    }
  }, [txHash, isSuccess]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete appointment");
      fetchAppointments();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error deleting appointment:", error);
      alert("Failed to delete appointment. Please try again.");
    }
  };

  const handleStatusUpdate = (id: string, status: string) => {
    console.log("📤 handleStatusUpdate called:", { id, status });

    if (isWaiting || txHash) {
      alert("⏳ A transaction is already in progress. Please wait.");
      return;
    }

    fetch(`/api/appointments/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Appointment not found");
        return res.json();
      })
      .then((app) => {
        const chainId = Number(app.chainAppointmentId);
        if (!chainId || chainId === 0) {
          alert("❌ Invalid appointment ID. Please refresh and try again.");
          return;
        }

        setPendingUpdate({ id, status });

        if (status === "CONFIRMED") {
          console.log("⛓️ Calling confirmAppointment with chainId:", chainId);
          confirmAppointment([BigInt(chainId)]);
          alert("⏳ Confirm transaction sent. Please approve in your wallet.");
        } else if (status === "COMPLETED") {
          console.log("⛓️ Calling completeAppointment with chainId:", chainId);
          completeAppointment([BigInt(chainId)]);
          alert("⏳ Complete transaction sent. Please approve in your wallet.");
        } else if (status === "CANCELLED") {
          setPendingUpdate(null);
          fetch(`/api/appointments/${id}`, {
            method: "PUT",
            body: JSON.stringify({ status }),
            headers: { "Content-Type": "application/json" },
          })
            .then((res) => {
              if (!res.ok) throw new Error("Failed to update database");
              alert("✅ Appointment rejected.");
              fetchAppointments();
              if (onUpdate) onUpdate();
            })
            .catch((err) => {
              console.error("Error rejecting appointment:", err);
              alert("❌ Failed to reject appointment.");
            });
        }
      })
      .catch((err) => {
        console.error("Error fetching appointment:", err);
        alert("❌ Failed to process appointment.");
      });
  };

  const combinedPending = isPending || isWaiting || !!txHash;

  if (loading) {
    return (
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-4 animate-pulse bg-gray-100 dark:bg-slate-700 h-24" />
        ))}
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg shadow">
        <p className="text-gray-500 dark:text-gray-400">No appointments yet</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
          Click "New Appointment" to book a consultation
        </p>
      </div>
    );
  }

  const grouped = appointments.reduce((acc, app) => {
    const date = app.date ? new Date(app.date).toLocaleDateString() : "Unknown";
    if (!acc[date]) acc[date] = [];
    acc[date].push(app);
    return acc;
  }, {} as Record<string, Appointment[]>);

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([date, apps]) => (
        <div key={date}>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">{date}</h3>
          <div className="grid gap-4">
            {apps.map((app) => (
              <AppointmentCard
                key={app.id}
                appointment={app}
                onDelete={handleDelete}
                onStatusUpdate={handleStatusUpdate}
                isPending={combinedPending}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 