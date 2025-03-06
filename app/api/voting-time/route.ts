import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Path to the voting time configuration file
const configPath = path.join(process.cwd(), 'app/config/voting-time.ts');

export async function GET() {
  try {
    // Read the current configuration
    const configContent = fs.readFileSync(configPath, 'utf8');
    
    // Extract values using regex
    const startTimeMatch = configContent.match(/startTime: "([^"]+)"/);
    const endTimeMatch = configContent.match(/endTime: "([^"]+)"/);
    const enforceMatch = configContent.match(/enforceVotingTime: (true|false)/);
    
    if (!startTimeMatch || !endTimeMatch || !enforceMatch) {
      return NextResponse.json(
        { error: 'Failed to parse configuration file' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      startTime: startTimeMatch[1],
      endTime: endTimeMatch[1],
      enforceVotingTime: enforceMatch[1] === 'true'
    });
  } catch (error) {
    console.error('Error reading voting time configuration:', error);
    return NextResponse.json(
      { error: 'Failed to read configuration' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { startTime, endTime, enforceVotingTime } = await request.json();
    
    // Validate inputs
    if (
      (startTime && typeof startTime !== 'string') ||
      (endTime && typeof endTime !== 'string') ||
      (enforceVotingTime !== undefined && typeof enforceVotingTime !== 'boolean')
    ) {
      return NextResponse.json(
        { error: 'Invalid input types' },
        { status: 400 }
      );
    }
    
    // Validate date formats if provided
    if (startTime) {
      try {
        // Ensure it's a valid ISO date with timezone
        const date = new Date(startTime);
        if (isNaN(date.getTime())) {
          throw new Error('Invalid date');
        }
        
        // Ensure it has timezone information
        if (!startTime.match(/([+-]\d{2}:\d{2})$/)) {
          return NextResponse.json(
            { error: 'Start time must include timezone information' },
            { status: 400 }
          );
        }
      } catch (error) {
        console.error('Error parsing start time:', error);
        return NextResponse.json(
          { error: 'Invalid start time format' },
          { status: 400 }
        );
      }
    }
    
    if (endTime) {
      try {
        // Ensure it's a valid ISO date with timezone
        const date = new Date(endTime);
        if (isNaN(date.getTime())) {
          throw new Error('Invalid date');
        }
        
        // Ensure it has timezone information
        if (!endTime.match(/([+-]\d{2}:\d{2})$/)) {
          return NextResponse.json(
            { error: 'End time must include timezone information' },
            { status: 400 }
          );
        }
      } catch (error) {
        console.error('Error parsing end time:', error);
        return NextResponse.json(
          { error: 'Invalid end time format' },
          { status: 400 }
        );
      }
    }
    
    // Read the current configuration
    let configContent = fs.readFileSync(configPath, 'utf8');
    
    // Update the configuration
    if (startTime) {
      configContent = configContent.replace(
        /(startTime: ")[^"]+(")/, 
        `$1${startTime}$2`
      );
    }
    
    if (endTime) {
      configContent = configContent.replace(
        /(endTime: ")[^"]+(")/, 
        `$1${endTime}$2`
      );
    }
    
    if (enforceVotingTime !== undefined) {
      configContent = configContent.replace(
        /(enforceVotingTime: )(true|false)/, 
        `$1${enforceVotingTime}`
      );
    }
    
    // Write the updated configuration back to the file
    fs.writeFileSync(configPath, configContent, 'utf8');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating voting time configuration:', error);
    return NextResponse.json(
      { error: 'Failed to update configuration' },
      { status: 500 }
    );
  }
}
