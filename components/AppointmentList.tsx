"use client";
import { useEffect, useState } from "react";
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

  // ✅ Contract hooks directly inside
  const { confirm: confirmAppointment } = useConfirmAppointment();
  const { complete: completeAppointment } = useCompleteAppointment();

  const fetchAppointments = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (patientId) params.append("patientId", patientId);
    if (patientWallet) params.append("patientWallet", patientWallet);
    if (doctorId) params.append("doctorId", doctorId);
    const url = `/api/appointments?${params.toString()}`;
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch appointments");
        return res.json();
      })
      .then((data) => {
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
  }, [patientId, patientWallet, doctorId, refresh]);

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

  // ✅ Direct contract call logic (same as detail page)
  const handleStatusUpdate = (id: string, status: string) => {
    console.log("📤 AppointmentList.handleStatusUpdate called:", { id, status });

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

        if (status === "CONFIRMED") {
          console.log("⛓️ Calling confirmAppointment with chainId:", chainId);
          confirmAppointment([BigInt(chainId)]);
          alert("⏳ Confirm transaction sent. Please approve in your wallet.");
        } else if (status === "COMPLETED") {
          console.log("⛓️ Calling completeAppointment with chainId:", chainId);
          completeAppointment([BigInt(chainId)]);
          alert("⏳ Complete transaction sent. Please approve in your wallet.");
        } else if (status === "CANCELLED") {
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

  if (loading) { /* ... loading UI ... */ }
  if (appointments.length === 0) { /* ... empty state ... */ }

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
                isPending={isPending}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
