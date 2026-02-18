import { Appointment, UserSettings, AppointmentStatus } from '../types';

const APPOINTMENTS_KEY = 'bullcut_appointments';
const SETTINGS_KEY = 'bullcut_settings';

export const getStoredAppointments = (): Appointment[] => {
  const stored = localStorage.getItem(APPOINTMENTS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveAppointments = (appointments: Appointment[]) => {
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
};

export const getStoredSettings = (): UserSettings => {
  const stored = localStorage.getItem(SETTINGS_KEY);
  return stored ? JSON.parse(stored) : { frequencyDays: 28 };
};

export const saveSettings = (settings: UserSettings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};