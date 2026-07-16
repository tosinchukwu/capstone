"use client";
import { useEffect, useState } from "react";
import AppointmentCard from "./AppointmentCard";

export default function AppointmentList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/appointments")
      .then((res) => res.json())
      .then((data) => {
        setAppointments(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
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

  return (
    <div className="grid gap-4">
      {appointments.map((app: any) => (
        <AppointmentCard key={app.id} appointment={app} />
      ))}
    </div>
  );
}
