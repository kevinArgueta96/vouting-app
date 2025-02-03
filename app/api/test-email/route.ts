import sgMail from '@sendgrid/mail';
import { NextResponse } from 'next/server';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error('SENDGRID_API_KEY environment variable is required');
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function GET(request: Request) {
  try {
    if (!process.env.SENDGRID_FROM_EMAIL) {
      return NextResponse.json(
        { success: false, error: 'SENDGRID_FROM_EMAIL not set' },
        { status: 500 }
      );
    }

    // Extract test email from query params
    const { searchParams } = new URL(request.url);
    const testEmail = searchParams.get('email');
    
    if (!testEmail) {
      return NextResponse.json(
        { success: false, error: 'Email parameter required' },
        { status: 400 }
      );
    }

    const msg = {
      to: testEmail,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: 'Test Email from Cocktail App',
      text: 'This is a test email to verify SendGrid configuration.',
      html: '<p>This is a test email to verify SendGrid configuration.</p>',
    };

    console.log('Sending test email to:', testEmail);
    console.log('From:', process.env.SENDGRID_FROM_EMAIL);

    try {
      const [response] = await sgMail.send(msg);
      console.log('SendGrid test response:', response);

      if (response.statusCode === 202) {
        return NextResponse.json({ 
          success: true,
          message: 'Test email sent successfully',
          statusCode: response.statusCode
        });
      } else {
        return NextResponse.json(
          { 
            success: false, 
            error: `Unexpected status: ${response.statusCode}`,
            details: response
          },
          { status: 500 }
        );
      }
    } catch (sendError: unknown) {
      if (!(sendError instanceof Error)) {
        throw sendError;
      }
      const error = sendError as Error & {
        code?: string;
        response?: { body?: unknown };
      };

      console.error('SendGrid test error:', {
        message: error.message,
        code: error.code,
        response: error.response?.body
      });
      
      return NextResponse.json(
        { 
          success: false, 
          error: error.message,
          details: error.response?.body
        },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error('Test route error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      },
      { status: 500 }
    );
  }
}
