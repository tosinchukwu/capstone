"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AppointmentDetail from "@/components/AppointmentDetail";

export default function DetailPage() {
  const { id } = useParams();
  const [chainId, setChainId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/appointments/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Appointment not found");
        return res.json();
      })
      .then((data) => {
        setChainId(Number(data.chainAppointmentId));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch appointment:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-4">Loading appointment...</div>;
  if (!chainId) return <div className="p-4">Appointment not found.</div>;

  return <AppointmentDetail id={chainId} />;
}