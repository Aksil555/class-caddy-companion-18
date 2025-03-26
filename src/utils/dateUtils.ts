
// Format time from "HH:MM" to "h:MM AM/PM"
export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
};

// Format a date to "Month Day, Year"
export const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

// Format a date to "Month Day"
export const formatShortDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

// Get remaining days from now to the due date
export const getRemainingDays = (dueDate: string): number => {
  const now = new Date();
  const due = new Date(dueDate);
  const diffTime = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Get day name from day of week number
export const getDayName = (dayOfWeek: number): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayOfWeek];
};

// Get short day name from day of week number
export const getShortDayName = (dayOfWeek: number): string => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[dayOfWeek];
};

// Check if a date is today
export const isToday = (isoDate: string): boolean => {
  const date = new Date(isoDate);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

// Check if a date is tomorrow
export const isTomorrow = (isoDate: string): boolean => {
  const date = new Date(isoDate);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return (
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear()
  );
};

// Get relative time string (e.g. "Today", "Tomorrow", "in 3 days", etc.)
export const getRelativeTimeString = (isoDate: string): string => {
  const days = getRemainingDays(isoDate);
  
  if (days < 0) return 'Overdue';
  if (isToday(isoDate)) return 'Today';
  if (isTomorrow(isoDate)) return 'Tomorrow';
  if (days <= 7) return `In ${days} days`;
  
  return formatShortDate(isoDate);
};
