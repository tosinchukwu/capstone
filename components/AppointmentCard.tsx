import Link from 'next/link';
export default function AppointmentCard({ appointment }: { appointment: any }) {
  return (
    <div className="border p-4 rounded shadow">
      <p><strong>ID:</strong> {appointment.id}</p>
      <p><strong>Patient:</strong> {appointment.patientName}</p>
      <p><strong>Doctor:</strong> {appointment.doctorAddress.slice(0, 6)}...</p>
      <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
      <Link href={`/appointments/${appointment.id}`} className="text-blue-600 underline">
        View Details
      </Link>
    </div>
  );
}
