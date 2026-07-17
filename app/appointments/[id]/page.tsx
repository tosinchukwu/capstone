"use client";
import AppointmentDetail from "@/components/AppointmentDetail";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function DetailPage() {
  const { id } = useParams();
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto">
        <Link 
          href="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Back to Appointments
        </Link>
        <AppointmentDetail id={Number(id)} />
      </div>
    </div>
  );
}
