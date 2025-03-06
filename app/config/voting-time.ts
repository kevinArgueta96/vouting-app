// Configuration for the voting time period in Finnish timezone (EET/EEST)
// Times are in ISO 8601 format with timezone offset

export const votingTimeConfig = {
  // Start time of the voting period (in Finnish timezone)
  startTime: "2025-03-06T07:41:00+02:00", // Example: March 9, 2025, 10:00 AM Finnish time
  
  // End time of the voting period (in Finnish timezone)
  endTime: "2025-03-16T14:00:00+02:00",   // Example: March 9, 2025, 6:00 PM Finnish time
  
  // Whether to enforce the voting time restriction
  enforceVotingTime: true
};
