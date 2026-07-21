"use client";
import { useEffect, useState } from "react";
import AppointmentCard from "./AppointmentCard";

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
  doctorId?: string;
  refresh?: number;
  onUpdate?: () => void;
  onStatusUpdate?: (id: string, status: string) => void;
  isPending?: boolean;
}

export default function AppointmentList({
  patientId,
  doctorId,
  refresh,
  onUpdate,
  onStatusUpdate,
  isPending
}: AppointmentListProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (patientId) params.append("patientId", patientId);
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
  }, [patientId, doctorId, refresh]);

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
    if (onStatusUpdate) {
      onStatusUpdate(id, status);
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-4 animate-pulse bg-gray-100 h-24" />
        ))}
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-500">No appointments yet</p>
        <p className="text-sm text-gray-400 mt-2">
          Click "New Appointment" to book a consultation
        </p>
      </div>
    );
  }

  // Group by date
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