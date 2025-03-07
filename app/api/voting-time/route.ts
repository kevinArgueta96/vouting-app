import { NextRequest, NextResponse } from 'next/server';
import { votingTimeService } from '@/app/services/voting-time';

export async function GET() {
  try {
    // Get the current configuration from the service
    const config = await votingTimeService.getConfig();
    
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error getting voting time configuration:', error);
    return NextResponse.json(
      { error: 'Failed to get voting time configuration' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { startTime, endTime, enforceVotingTime } = body;
    
    console.log('Received POST request with body:', body);
    
    // Validate inputs
    if (
      (startTime && typeof startTime !== 'string') ||
      (endTime && typeof endTime !== 'string') ||
      (enforceVotingTime !== undefined && typeof enforceVotingTime !== 'boolean')
    ) {
      console.error('Invalid input types:', { startTime, endTime, enforceVotingTime });
      return NextResponse.json(
        { error: 'Invalid input types' },
        { status: 400 }
      );
    }
    
    // Validate date formats if provided
    if (startTime && endTime) {
      try {
        // Ensure they're valid ISO dates
        const startDate = new Date(startTime);
        const endDate = new Date(endTime);
        
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          throw new Error('Invalid date');
        }
        
        // Update the time range
        await votingTimeService.updateTimeRange(startTime, endTime);
      } catch (error) {
        console.error('Error updating time range:', error);
        return NextResponse.json(
          { error: 'Invalid date format or failed to update time range' },
          { status: 400 }
        );
      }
    } else if (enforceVotingTime !== undefined) {
      // Toggle the time restriction
      await votingTimeService.toggleTimeRestriction(enforceVotingTime);
    }
    
    return NextResponse.json({ 
      success: true,
      updated: {
        startTime: startTime !== undefined && endTime !== undefined,
        endTime: startTime !== undefined && endTime !== undefined,
        enforceVotingTime: enforceVotingTime !== undefined
      }
    });
  } catch (error) {
    console.error('Error updating voting time configuration:', error);
    return NextResponse.json(
      { error: 'Failed to update voting time configuration' },
      { status: 500 }
    );
  }
}
