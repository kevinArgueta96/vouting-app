import sgMail from '@sendgrid/mail';
import { NextResponse } from 'next/server';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error('SENDGRID_API_KEY environment variable is required');
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(request: Request) {
  try {
    // Validate environment variables
    if (!process.env.SENDGRID_API_KEY) {
      console.error('SENDGRID_API_KEY is not set');
      return NextResponse.json(
        { success: false, error: 'SendGrid API key not configured' },
        { status: 500 }
      );
    }

    if (!process.env.SENDGRID_FROM_EMAIL) {
      console.error('SENDGRID_FROM_EMAIL is not set');
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

    const msg = {
      to,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject,
      text,
      html: html || text,
    };

    console.log('Email payload:', {
      ...msg,
      text: text.substring(0, 100) + '...' // Log truncated text for privacy
    });

    try {
      const [response] = await sgMail.send(msg);
      console.log('SendGrid response:', response);
      
      if (response.statusCode === 202) {
        console.log('Email sent successfully');
        return NextResponse.json({ success: true });
      } else {
        console.error('Unexpected SendGrid status code:', response.statusCode);
        return NextResponse.json(
          { success: false, error: `Unexpected status: ${response.statusCode}` },
          { status: 500 }
        );
      }
    } catch (sendError: any) {
      console.error('SendGrid error details:', {
        message: sendError.message,
        code: sendError.code,
        response: sendError.response?.body
      });
      if (sendError.response) {
        console.error('SendGrid error body:', sendError.response.body);
      }
      return NextResponse.json(
        { success: false, error: sendError.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('API route error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
