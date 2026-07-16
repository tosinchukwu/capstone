import { User, Appointment, AppointmentStatus, Role } from '@prisma/client';

// Re‑export Prisma generated types for convenience
export type { User, Appointment, AppointmentStatus, Role };

// Custom types with relations (useful for API responses)
export type AppointmentWithRelations = Appointment & {
  patient: User;
  doctor: User;
};

export type UserWithAppointments = User & {
  patientAppointments: Appointment[];
  doctorAppointments: Appointment[];
};

// For creating an appointment (POST body)
export type CreateAppointmentInput = {
  chainAppointmentId: bigint; // or number if you cast
  patientId: string;
  doctorId: string;
  date: Date | string;
  description: string;
  status?: AppointmentStatus; // defaults to PENDING
};

// For updating an appointment (PUT body)
export type UpdateAppointmentInput = Partial<CreateAppointmentInput> & {
  status?: AppointmentStatus;
};
