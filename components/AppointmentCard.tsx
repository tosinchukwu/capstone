import Link from "next/link";

export default function AppointmentCard({ appointment }: { appointment: any }) {
  return (
    <div className="card card-hover">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Appointment #{appointment.id}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            <span className="font-medium">Patient:</span> {appointment.patientName}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">Doctor:</span> {appointment.doctorAddress?.slice(0, 6)}...
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">Date:</span>{" "}
            {new Date(appointment.date).toLocaleDateString()}
          </p>
          <div className="mt-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                appointment.status === "CONFIRMED"
                  ? "bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300"
                  : appointment.status === "COMPLETED"
                  ? "bg-secondary-100 text-secondary-800 dark:bg-secondary-900/30 dark:text-secondary-300"
                  : "bg-accent-100 text-accent-800 dark:bg-accent-900/30 dark:text-accent-300"
              }`}
            >
              {appointment.status || "PENDING"}
            </span>
          </div>
        </div>
        <Link
          href={`/appointments/${appointment.id}`}
          className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 text-sm font-medium underline-offset-2 hover:underline"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}
