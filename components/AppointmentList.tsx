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

export default function AppointmentList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/appointments")
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
  }, []);

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

  // Group appointments by date
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
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {date}
          </h3>
          <div className="grid gap-4">
            {apps.map((app) => (
              <AppointmentCard key={app.id} appointment={app} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}