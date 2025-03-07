/**
 * Service for managing voting time settings using Supabase
 */
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';

type VoteTimeWindow = Database['public']['Tables']['vote_time_window']['Row'];
type VoteTimeWindowInsert = Database['public']['Tables']['vote_time_window']['Insert'];
type VoteTimeWindowUpdate = Database['public']['Tables']['vote_time_window']['Update'];

interface VotingTimeConfig {
  startTime: string;
  endTime: string;
  enforceVotingTime: boolean;
}

export const votingTimeService = {
  /**
   * Get the current voting time configuration from Supabase
   * @returns The current voting time configuration
   */
  async getConfig(): Promise<VotingTimeConfig> {
    try {
      // Get the active time window from Supabase
      const { data, error } = await supabase
        .from('vote_time_window')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        // If no active time window exists, create a default one
        if (error.code === 'PGRST116') { // No rows found
          // Check if any time window exists
          const { count, error: countError } = await supabase
            .from('vote_time_window')
            .select('*', { count: 'exact', head: true });
          
          if (countError) throw countError;
          
          // If no time windows exist at all, create a default one
          if (count === 0) {
            const defaultStartTime = new Date();
            const defaultEndTime = new Date();
            defaultEndTime.setDate(defaultEndTime.getDate() + 1); // Default to 1 day from now
            
            const { data: newData, error: insertError } = await supabase
              .from('vote_time_window')
              .insert({
                start_time: defaultStartTime.toISOString(),
                end_time: defaultEndTime.toISOString(),
                active: true
              })
              .select()
              .single();
            
            if (insertError) throw insertError;
            
            return {
              startTime: newData.start_time,
              endTime: newData.end_time,
              enforceVotingTime: newData.active
            };
          }
          
          // If time windows exist but none are active, return the most recent one but mark as inactive
          const { data: latestData, error: latestError } = await supabase
            .from('vote_time_window')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
          
          if (latestError) throw latestError;
          
          return {
            startTime: latestData.start_time,
            endTime: latestData.end_time,
            enforceVotingTime: false // Not active
          };
        }
        
        throw error;
      }

      return {
        startTime: data.start_time,
        endTime: data.end_time,
        enforceVotingTime: data.active
      };
    } catch (error) {
      console.error('Error fetching voting time configuration:', error);
      throw new Error('Failed to fetch voting time configuration');
    }
  },

  /**
   * Update the voting time range
   * @param startTime The new start time in ISO format with timezone
   * @param endTime The new end time in ISO format with timezone
   */
  async updateTimeRange(startTime: string, endTime: string): Promise<void> {
    try {
      // Get the current active time window
      const { data: currentData, error: fetchError } = await supabase
        .from('vote_time_window')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (fetchError) {
        // If no active time window exists, create a new one
        if (fetchError.code === 'PGRST116') { // No rows found
          const { error: insertError } = await supabase
            .from('vote_time_window')
            .insert({
              start_time: startTime,
              end_time: endTime,
              active: true
            });
          
          if (insertError) throw insertError;
          return;
        }
        
        throw fetchError;
      }

      // Update the existing time window
      const { error: updateError } = await supabase
        .from('vote_time_window')
        .update({
          start_time: startTime,
          end_time: endTime,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentData.id);
      
      if (updateError) throw updateError;
    } catch (error) {
      console.error('Error updating voting time range:', error);
      throw new Error('Failed to update voting time range');
    }
  },

  /**
   * Toggle the voting time restriction
   * @param enabled Whether to enable or disable the voting time restriction
   */
  async toggleTimeRestriction(enabled: boolean): Promise<void> {
    try {
      // Get the current time window (active or not)
      const { data: currentData, error: fetchError } = await supabase
        .from('vote_time_window')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (fetchError) {
        // If no time window exists, create a default one
        if (fetchError.code === 'PGRST116') { // No rows found
          const defaultStartTime = new Date();
          const defaultEndTime = new Date();
          defaultEndTime.setDate(defaultEndTime.getDate() + 1); // Default to 1 day from now
          
          const { error: insertError } = await supabase
            .from('vote_time_window')
            .insert({
              start_time: defaultStartTime.toISOString(),
              end_time: defaultEndTime.toISOString(),
              active: enabled
            });
          
          if (insertError) throw insertError;
          return;
        }
        
        throw fetchError;
      }

      // Update the existing time window
      const { error: updateError } = await supabase
        .from('vote_time_window')
        .update({
          active: enabled,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentData.id);
      
      if (updateError) throw updateError;
    } catch (error) {
      console.error('Error toggling voting time restriction:', error);
      throw new Error('Failed to toggle voting time restriction');
    }
  }
};
