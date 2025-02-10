import { Resend } from 'resend';
import { NextResponse } from 'next/server';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY environment variable is required');
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: Request) {
  try {
    if (!process.env.RESEND_FROM_EMAIL) {
      return NextResponse.json(
        { success: false, error: 'RESEND_FROM_EMAIL not set' },
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

    console.log('Sending test email to:', testEmail);
    console.log('From:', process.env.RESEND_FROM_EMAIL);

    try {
      const response = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: testEmail,
        subject: 'Test Email from Cocktail App',
        text: 'This is a test email to verify Resend configuration.',
        html: '<p>This is a test email to verify Resend configuration.</p>',
      });

      if (!response.data?.id) {
        console.error('Failed to send test email:', response);
        return NextResponse.json(
          { 
            success: false, 
            error: 'Failed to send test email'
          },
          { status: 500 }
        );
      }

      console.log('Test email sent successfully with ID:', response.data.id);
      return NextResponse.json({ 
        success: true,
        message: 'Test email sent successfully',
        id: response.data.id
      });
    } catch (sendError: unknown) {
      console.error('Resend test error:', sendError);
      const error = sendError as Error;
      return NextResponse.json(
        { 
          success: false, 
          error: 'message' in error ? error.message : 'Failed to send test email'
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
