'use client';

import { useState } from 'react';
import { votingTimeConfig } from '@/app/config/voting-time';
import { formatFinnishDate } from '@/app/lib/voting-time';

interface VotingTimeSelectorProps {
  locale: string;
  onTimeRangeChange: (startTime: string, endTime: string) => Promise<void>;
  isTimeRestrictionEnabled: boolean;
  onToggleTimeRestriction: (enabled: boolean) => Promise<void>;
}

export function VotingTimeSelector({
  locale,
  onTimeRangeChange,
  isTimeRestrictionEnabled,
  onToggleTimeRestriction
}: VotingTimeSelectorProps) {
  // Parse the ISO date strings with timezone info to local Date objects
  const parseIsoDate = (isoString: string): Date => {
    try {
      // Create a date object directly from the ISO string
      // This properly handles the timezone information
      const date = new Date(isoString);
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        console.error('Invalid date format:', isoString);
        return new Date(); // Return current date as fallback
      }
      
      return date;
    } catch (error) {
      console.error('Error parsing date:', error);
      return new Date(); // Return current date as fallback
    }
  };

  const [startTime, setStartTime] = useState(parseIsoDate(votingTimeConfig.startTime));
  const [endTime, setEndTime] = useState(parseIsoDate(votingTimeConfig.endTime));
  const [isLoading, setIsLoading] = useState(false);
  const [showSelector, setShowSelector] = useState(false);

  // Format date to YYYY-MM-DDThh:mm format for datetime-local input
  const formatDateForInput = (date: Date) => {
    // Create a string in the format YYYY-MM-DDThh:mm
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Convert local datetime input to ISO string with Finnish timezone offset
  const toFinnishTimezone = (dateString: string) => {
    // Parse the input date string (which is in local format YYYY-MM-DDThh:mm)
    const [datePart, timePart] = dateString.split('T');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hours, minutes] = timePart.split(':').map(Number);
    
    // Create a date object (in local timezone)
    // Create a string in ISO format with the Finnish timezone offset
    // We'll keep the date and time exactly as entered by the user, just add the Finnish timezone
    const pad = (num: number) => String(num).padStart(2, '0');
    
    return `${year}-${pad(month)}-${pad(day)}T${pad(hours)}:${pad(minutes)}:00+02:00`;
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Convert dates to ISO strings with Finnish timezone
      const startIso = toFinnishTimezone(formatDateForInput(startTime));
      const endIso = toFinnishTimezone(formatDateForInput(endTime));
      
      await onTimeRangeChange(startIso, endIso);
      
      // Show success message
      alert('Voting time range updated successfully. The page will reload to apply changes.');
      
      // Force a page reload after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error('Error updating voting time range:', error);
      alert('Error updating voting time range. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleTimeRestriction = async () => {
    setIsLoading(true);
    try {
      // Pass the opposite of the current state to toggle it
      const newState = !isTimeRestrictionEnabled;
      console.log('Toggling time restriction to:', newState);
      
      await onToggleTimeRestriction(newState);
      
      // Show success message
      alert('Voting time restriction setting updated. The page will reload to apply changes.');
      
      // Force a page reload after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error('Error toggling time restriction:', error);
      alert('Error toggling time restriction. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#334798]">Voting Time Settings</h2>
        <div className="flex items-center">
          <label className="inline-flex items-center cursor-pointer mr-4">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={isTimeRestrictionEnabled}
              onChange={handleToggleTimeRestriction}
              disabled={isLoading}
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ms-3 text-sm font-medium text-gray-700">
              {isTimeRestrictionEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </label>
          <button
            onClick={() => setShowSelector(!showSelector)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {showSelector ? 'Cancel' : 'Change Time Range'}
          </button>
        </div>
      </div>

      {showSelector ? (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="mb-3 text-center">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              All times are in Finnish timezone (UTC+2)
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                type="datetime-local"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={formatDateForInput(startTime)}
                onChange={(e) => setStartTime(new Date(e.target.value))}
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <input
                type="datetime-local"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={formatDateForInput(endTime)}
                onChange={(e) => setEndTime(new Date(e.target.value))}
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`px-4 py-2 rounded-md text-white ${
                isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? 'Updating...' : 'Update Time Range'}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-600">
          <p>
            <span className="font-medium">Current voting period:</span>{' '}
            {formatFinnishDate(new Date(votingTimeConfig.startTime), locale)} to{' '}
            {formatFinnishDate(new Date(votingTimeConfig.endTime), locale)}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {isTimeRestrictionEnabled
              ? 'Only votes cast during this period are counted in the results.'
              : 'Time restriction is disabled. All votes are counted regardless of when they were cast.'}
          </p>
        </div>
      )}
    </div>
  );
}
