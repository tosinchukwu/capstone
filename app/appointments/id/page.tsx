"use client";
import AppointmentDetail from "@/components/AppointmentDetail";
import { useParams } from "next/navigation";
export default function DetailPage() {
  const { id } = useParams();
  return <AppointmentDetail id={Number(id)} />;
}
