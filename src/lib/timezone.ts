// Timezone utility functions

/**
 * Convert a UTC date to a specific timezone
 */
export const convertToTimezone = (utcDate: string | Date, timezone: string): string => {
  const date = new Date(utcDate);
  return date.toLocaleString('en-US', {
    timeZone: timezone,
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

/**
 * Convert a UTC date to a specific timezone with full format
 */
export const convertToTimezoneFull = (utcDate: string | Date, timezone: string): string => {
  const date = new Date(utcDate);
  return date.toLocaleString('en-US', {
    timeZone: timezone,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Get just the time in a specific timezone
 */
export const getTimeInTimezone = (utcDate: string | Date, timezone: string): string => {
  const date = new Date(utcDate);
  return date.toLocaleString('en-US', {
    timeZone: timezone,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Get just the date in a specific timezone
 */
export const getDateInTimezone = (utcDate: string | Date, timezone: string): string => {
  const date = new Date(utcDate);
  return date.toLocaleDateString('en-US', {
    timeZone: timezone,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format timezone name for display
 */
export const formatTimezoneName = (timezone: string): string => {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'short',
    });
    const parts = formatter.formatToParts(now);
    const tzPart = parts.find(p => p.type === 'timeZoneName');
    return tzPart ? tzPart.value : timezone;
  } catch {
    return timezone;
  }
};
