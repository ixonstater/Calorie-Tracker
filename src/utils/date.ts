// Date utility functions for week logic

// Returns ISO date string for the Monday of the week containing the given date
export function getMondayDate(date = new Date()): string {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday, 1 = Monday, ...
  const diff = (day === 0) ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().split('T')[0]; // 'YYYY-MM-DD'
}

// Returns ISO date string for the current week's Monday
export function getCurrentMondayDate(): string {
  return getMondayDate(new Date());
}

// Returns array of ISO date strings for all days in a week starting from given Monday
export function getWeekDates(mondayDate: string): string[] {
  const base = new Date(mondayDate);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    return d.toISOString().split('T')[0];
  });
}

// Returns a display range like 'Mar 30 – Apr 5, 2026'
export function formatWeekRange(mondayDate: string): string {
  const weekDates = getWeekDates(mondayDate);
  const start = new Date(weekDates[0]);
  const end = new Date(weekDates[6]);
  const startStr = start.toLocaleString('en-US', { month: 'short', day: 'numeric' });
  const endStr = end.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return `${startStr} – ${endStr}`;
}

// Returns day abbreviation (Mon, Tue, ...) for a date
export function getDayAbbr(date: string): string {
  return new Date(date).toLocaleString('en-US', { weekday: 'short' });
}

// Returns date number (e.g., 4/3) for a date
export function getDateNumber(date: string): string {
  const d = new Date(date);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}
