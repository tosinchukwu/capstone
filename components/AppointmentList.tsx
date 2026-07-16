'use client';
import { useEffect, useState } from 'react';
import AppointmentCard from './AppointmentCard';
import Link from 'next/link';

export default function AppointmentList() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetch('/api/appointments')
      .then(res => res.json())
      .then(setAppointments);
  }, []);

  return (
    <div className="grid gap-4 mt-4">
      <Link href="/appointments/create" className="bg-blue-500 text-white px-4 py-2 rounded inline-block">
        Create New Appointment
      </Link>
      {appointments.map((app: any) => (
        <AppointmentCard key={app.id} appointment={app} />
      ))}
    </div>
  );
}
