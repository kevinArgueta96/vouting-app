import * as React from 'react';
import { Database } from '../../types/supabase';

type Cocktail = Database['public']['Tables']['cocktails']['Row'];

interface EmailTranslations {
  title: string;
  message: string;
  recipeTitle: string;
  description: string;
  raffleTitle: string;
  raffleMessage: string;
  finalMessage: string;
  regards: string;
  company: string;
}

interface CombinedEmailProps {
  cocktail: Cocktail;
  translations: EmailTranslations;
}

export default function CombinedEmail({
  cocktail,
  translations
}: CombinedEmailProps) {

  return (
    <div style={{
      backgroundColor: '#F9F6F0',
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      maxWidth: '600px',
      margin: '0 auto',
    }}>
      <h1 style={{
        textAlign: 'center',
        color: '#1a1a1a',
        fontSize: '24px',
        marginBottom: '20px',
      }}>
        {translations.title}
      </h1>

      <p style={{
        textAlign: 'center',
        marginBottom: '20px',
      }}>
        {translations.message}
      </p>

      <div style={{
        backgroundColor: '#ffffff',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
      }}>
        <h2 style={{
          fontSize: '20px',
          color: '#1a1a1a',
          marginBottom: '15px',
        }}>
          {translations.recipeTitle.replace('{cocktailName}', cocktail.name)}
        </h2>
        
        <p style={{ marginBottom: '15px' }}>
          <strong>Brand:</strong> {cocktail.brand}
        </p>
        
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{
            fontSize: '18px',
            color: '#1a1a1a',
            marginBottom: '10px',
          }}>
            {translations.description}
          </h3>
          <p>{cocktail.description}</p>
        </div>
      </div>

      <div style={{
        backgroundColor: '#ffffff',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
      }}>
        <h2 style={{
          fontSize: '20px',
          color: '#1a1a1a',
          marginBottom: '15px',
        }}>
          {translations.raffleTitle}
        </h2>
        <p>{translations.raffleMessage}</p>
      </div>

      <div style={{
        textAlign: 'center',
        color: '#666666',
        fontSize: '14px',
      }}>
        <p style={{ marginBottom: '15px' }}>{translations.finalMessage}</p>
        <p>
          {translations.regards}<br/>
          {translations.company}
        </p>
      </div>
    </div>
  );
}
