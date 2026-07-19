import Link from "next/link";

type Appointment = {
  id: string;
  patient: { name: string; wallet: string } | null;
  doctor: { name: string; wallet: string } | null;
  date: string | null;
  status: string;
  description: string;
};

export default function AppointmentCard({ appointment }: { appointment: Appointment }) {
  // Safe date formatter
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Not set";
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? "Invalid date" : d.toLocaleDateString();
  };

  const patientName = appointment.patient?.name || "Unknown";
  const doctorAddress = appointment.doctor?.wallet
    ? `${appointment.doctor.wallet.slice(0, 6)}...${appointment.doctor.wallet.slice(-4)}`
    : "Unknown";

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Appointment #{appointment.id.slice(0, 8)}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            <span className="font-medium">Patient:</span> {patientName}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Doctor:</span> {doctorAddress}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Date:</span> {formatDate(appointment.date)}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            <span className="font-medium">Status:</span>{" "}
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${appointment.status === "CONFIRMED"
                ? "bg-green-100 text-green-800"
                : appointment.status === "COMPLETED"
                  ? "bg-blue-100 text-blue-800"
                  : appointment.status === "CANCELLED"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
            >
              {appointment.status || "PENDING"}
            </span>
          </p>
        </div>
        <Link
          href={`/appointments/${appointment.id}`}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}