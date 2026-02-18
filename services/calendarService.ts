import { CalendarConflictResult } from '../types';

/**
 * SIMULATION NOTE:
 * A real implementation would requires Google OAuth 2.0.
 * 1. Load the Google API Client Library (gapi).
 * 2. Authenticate the user (gapi.auth2.getAuthInstance().signIn()).
 * 3. Call gapi.client.calendar.events.list().
 * 
 * Since this is a client-side demo without a backend/project-id setup, 
 * we simulate the check logic.
 */

export const checkCalendarConflict = async (date: Date): Promise<CalendarConflictResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate a random conflict for demonstration purposes
      // In a real app, this would check `gapi.client.calendar.events.list`
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const hours = date.getHours();
      
      // Simulate "Busy" during typical work hours on weekdays occasionally
      const isBusyTime = !isWeekend && hours >= 9 && hours <= 17;
      const randomChance = Math.random() > 0.7; // 30% chance of conflict simulation

      if (isBusyTime && randomChance) {
        resolve({
          hasConflict: true,
          message: "Conflitto rilevato: Hai una riunione 'Work Sync' in Google Calendar a quest'ora."
        });
      } else {
        resolve({
          hasConflict: false,
          message: "Nessuna sovrapposizione trovata nel tuo calendario."
        });
      }
    }, 1500); // Simulate API latency
  });
};