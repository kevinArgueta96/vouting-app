import { votingTimeConfig } from '../config/voting-time';

/**
 * Formats a date in Finnish timezone for display
 * @param date The date to format
 * @param locale The locale to use for formatting
 * @returns Formatted date string
 */
export function formatFinnishDate(date: Date, locale: string): string {
  try {
    // Create a formatter that explicitly uses the Finnish timezone
    const formatter = new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Helsinki', // Finnish timezone
      hour12: false // Use 24-hour format
    });
    
    return formatter.format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    // Fallback formatting if Intl.DateTimeFormat fails
    return date.toLocaleString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }) + ' (Finnish time)';
  }
}

/**
 * Gets the voting period information
 * @param locale The locale to use for formatting dates
 * @returns Object with voting period information
 */
export function getVotingPeriodInfo(locale: string) {
  const startTime = new Date(votingTimeConfig.startTime);
  const endTime = new Date(votingTimeConfig.endTime);
  const now = new Date();
  
  const isVotingActive = now >= startTime && now <= endTime;
  const hasVotingStarted = now >= startTime;
  const hasVotingEnded = now > endTime;
  
  return {
    startTime,
    endTime,
    formattedStartTime: formatFinnishDate(startTime, locale),
    formattedEndTime: formatFinnishDate(endTime, locale),
    isVotingActive,
    hasVotingStarted,
    hasVotingEnded,
    isTimeRestrictionEnabled: votingTimeConfig.enforceVotingTime
  };
}
