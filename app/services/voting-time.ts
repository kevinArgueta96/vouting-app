/**
 * Service for managing voting time settings
 */

interface VotingTimeConfig {
  startTime: string;
  endTime: string;
  enforceVotingTime: boolean;
}

export const votingTimeService = {
  /**
   * Get the current voting time configuration
   * @returns The current voting time configuration
   */
  async getConfig(): Promise<VotingTimeConfig> {
    const response = await fetch('/api/voting-time', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch voting time configuration');
    }

    return await response.json();
  },

  /**
   * Update the voting time range
   * @param startTime The new start time in ISO format with timezone
   * @param endTime The new end time in ISO format with timezone
   */
  async updateTimeRange(startTime: string, endTime: string): Promise<void> {
    const response = await fetch('/api/voting-time', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ startTime, endTime }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update voting time range');
    }
  },

  /**
   * Toggle the voting time restriction
   * @param enabled Whether to enable or disable the voting time restriction
   */
  async toggleTimeRestriction(enabled: boolean): Promise<void> {
    const response = await fetch('/api/voting-time', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ enforceVotingTime: enabled }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to toggle voting time restriction');
    }
  },
};
