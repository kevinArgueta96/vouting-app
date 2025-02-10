import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import CocktailVoteEmail from '../../components/email/CocktailVoteEmail';
import RaffleEmail from '../../components/email/RaffleEmail';
import CombinedEmail from '../../components/email/CombinedEmail';
import { Database } from '../../types/supabase';

type Cocktail = Database['public']['Tables']['cocktails']['Row'];

interface EmailRequestBody {
  to: string;
  cocktail: Cocktail;
  wantRecipe: boolean;
  wantRaffle: boolean;
  locale?: string;
}

// Import translations
import enTranslations from '../../../messages/en.json';
import fiTranslations from '../../../messages/fi.json';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY environment variable is required');
}

if (!process.env.RESEND_FROM_EMAIL) {
  throw new Error('RESEND_FROM_EMAIL environment variable is required');
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    // Validate environment variables
    if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
      console.error('Missing required environment variables');
      return NextResponse.json(
        { success: false, error: 'Email service not properly configured' },
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

    const { to, cocktail, wantRecipe, wantRaffle } = body as EmailRequestBody;

    // Validate required fields
    if (!to || !cocktail || (wantRecipe === undefined) || (wantRaffle === undefined)) {
      console.error('Missing required fields');
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    console.log('Attempting to send email to:', to);

    try {
      // Get translations based on locale
      const translations = body.locale === 'fi' ? fiTranslations : enTranslations;
      const emailTemplates = translations.EmailTemplates;

      let emailSubject: string;
      let EmailComponent: any;
      let emailProps: any = { cocktail };

      if (wantRecipe && wantRaffle) {
        emailSubject = emailTemplates.combined.title;
        EmailComponent = CombinedEmail;
        emailProps.translations = emailTemplates.combined;
      } else if (wantRecipe) {
        emailSubject = emailTemplates.recipe.title.replace('{cocktailName}', cocktail.name);
        EmailComponent = CocktailVoteEmail;
        emailProps.translations = emailTemplates.recipe;
      } else if (wantRaffle) {
        emailSubject = emailTemplates.raffle.title;
        EmailComponent = RaffleEmail;
        emailProps.translations = emailTemplates.raffle;
      } else {
        return NextResponse.json(
          { success: false, error: 'No email type selected' },
          { status: 400 }
        );
      }

      console.log('Attempting to send email with payload:', {
        from: process.env.RESEND_FROM_EMAIL,
        to,
        subject: emailSubject,
        type: EmailComponent.name,
        locale: body.locale
      });

      const response = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL,
        to,
        subject: emailSubject,
        react: EmailComponent(emailProps)
      });

      if (!response.data?.id) {
        console.error('Failed to send email. Response:', response);
        return NextResponse.json(
          { success: false, error: 'Failed to send email', details: response },
          { status: 500 }
        );
      }

      console.log('Email sent successfully with ID:', response.data.id);
      return NextResponse.json({ success: true, id: response.data.id });
    } catch (sendError: unknown) {
      console.error('Detailed Resend error:', sendError);
      const error = sendError as Error & { statusCode?: number; response?: any };
      return NextResponse.json(
        { 
          success: false, 
          error: 'message' in error ? error.message : 'Failed to send email',
          statusCode: error.statusCode,
          details: error.response
        },
        { status: error.statusCode || 500 }
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
