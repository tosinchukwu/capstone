import AppointmentForm from "@/components/AppointmentForm";
import Link from "next/link";

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto">
        <Link 
          href="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Back to Home
        </Link>
        <AppointmentForm />
      </div>
    </div>
  );
}
