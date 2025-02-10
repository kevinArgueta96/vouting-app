import { Resend } from 'resend';
import { NextResponse } from 'next/server';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY environment variable is required');
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    // Validate environment variables
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set');
      return NextResponse.json(
        { success: false, error: 'Resend API key not configured' },
        { status: 500 }
      );
    }

    if (!process.env.RESEND_FROM_EMAIL) {
      console.error('RESEND_FROM_EMAIL is not set');
      return NextResponse.json(
        { success: false, error: 'Sender email not configured' },
        { status: 500 }
      );
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (e) {
      console.error('Failed to parse request body:', e);
      return NextResponse.json(
        { success: false, error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { to, subject, text, html } = body;

    // Validate required fields
    if (!to || !subject || !text) {
      console.error('Missing required fields');
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    console.log('Attempting to send email to:', to);

    try {
      const response = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to,
        subject,
        text,
        html: html || text,
      });

      console.log('Email payload:', {
        to,
        subject,
        text: text.substring(0, 100) + '...' // Log truncated text for privacy
      });

      if (!response.data?.id) {
        console.error('Failed to send email:', response);
        return NextResponse.json(
          { success: false, error: 'Failed to send email' },
          { status: 500 }
        );
      }

      console.log('Email sent successfully with ID:', response.data.id);
      return NextResponse.json({ success: true, id: response.data.id });
    } catch (sendError: unknown) {
      console.error('Resend error:', sendError);
      const error = sendError as Error;
      return NextResponse.json(
        { 
          success: false, 
          error: 'message' in error ? error.message : 'Failed to send email'
        },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error('API route error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      },
      { status: 500 }
    );
  }
}
