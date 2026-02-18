export enum AppointmentStatus {
  PLANNED = 'PRESO',
  COMPLETED = 'EFFETTUATO'
}

export interface Appointment {
  id: string;
  date: string; // ISO string format
  status: AppointmentStatus;
  notes?: string;
  frequencyDays?: number;
}

export interface UserSettings {
  frequencyDays: number;
}

export interface CalendarConflictResult {
  hasConflict: boolean;
  message: string;
}