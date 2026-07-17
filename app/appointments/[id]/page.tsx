"use client";
import AppointmentDetail from "@/components/AppointmentDetail";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function DetailPage() {
  const { id } = useParams();
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4">
        <Link 
          href="/" 
          className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 mb-4 transition"
        >
          ← Back to Appointments
        </Link>
        <AppointmentDetail id={Number(id)} />
      </div>
    </div>
  );
}
