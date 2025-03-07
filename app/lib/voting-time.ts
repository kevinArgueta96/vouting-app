import { votingTimeService } from '../services/voting-time';

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
export async function getVotingPeriodInfo(locale: string) {
  try {
    const config = await votingTimeService.getConfig();
    
    const startTime = new Date(config.startTime);
    const endTime = new Date(config.endTime);
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
      isTimeRestrictionEnabled: config.enforceVotingTime
    };
  } catch (error) {
    console.error('Error getting voting period info:', error);
    // Return default values in case of error
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return {
      startTime: now,
      endTime: tomorrow,
      formattedStartTime: formatFinnishDate(now, locale),
      formattedEndTime: formatFinnishDate(tomorrow, locale),
      isVotingActive: true,
      hasVotingStarted: true,
      hasVotingEnded: false,
      isTimeRestrictionEnabled: false
    };
  }
}
