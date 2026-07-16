'use client';
import { useParams } from 'next/navigation';
import AppointmentDetail from '@/components/AppointmentDetail';
export default function DetailPage() {
  const { id } = useParams();
  return <AppointmentDetail id={Number(id)} />;
}
