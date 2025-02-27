import * as React from 'react';
import { Database } from '../../types/supabase';

type CocktailTranslation = Database['public']['Tables']['cocktails_translations']['Row'];
type Cocktail = Database['public']['Tables']['cocktails']['Row'] & {
  translations?: CocktailTranslation[];
};

interface EmailTranslations {
  title: string;
  message: string;
  raffleMessage: string;
  recipeIntro: string;
  recipe: string;
  finalMessage: string;
  followUs: string;
  regards: string;
  company: string;
}

interface CombinedEmailProps {
  cocktail: Cocktail;
  translations: EmailTranslations;
  locale: string;
}

export default function CombinedEmail({
  cocktail,
  translations,
  locale
}: CombinedEmailProps) {

  return (
    <div style={{
      backgroundColor: '#F9F6F0',
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      maxWidth: '600px',
      margin: '0 auto',
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
      }}>
        <p style={{ marginBottom: '15px' }}>
          {translations.message}
        </p>
        
        <p style={{ marginBottom: '20px' }}>
          {translations.raffleMessage}
        </p>
        
        <p style={{ marginBottom: '15px' }}>
          {translations.recipeIntro}
        </p>
        
        <h2 style={{
          fontSize: '20px',
          color: '#1a1a1a',
          marginBottom: '5px',
          textTransform: 'uppercase',
        }}>
          {cocktail.name}
        </h2>
        
        <p style={{ marginBottom: '15px', fontSize: '14px' }}>
          By {cocktail.brand}
        </p>
        
        <div style={{
          marginTop: '20px',
          marginBottom: '20px',
        }}>
          <h3 style={{
            fontSize: '18px',
            color: '#1a1a1a',
            marginBottom: '10px'
          }}>
            {translations.recipe}
          </h3>
          <p style={{ lineHeight: '1.5', whiteSpace: 'pre-line' }}>
            {cocktail.translations?.find((t) => t.locale === locale)?.recipe}
          </p>
        </div>
        
        <p style={{ marginBottom: '15px' }}>
          {translations.finalMessage}
        </p>
      </div>

      <div style={{
        textAlign: 'center',
        color: '#666666',
        fontSize: '14px',
      }}>
        <p style={{ marginBottom: '15px' }} dangerouslySetInnerHTML={{ __html: translations.followUs }}></p>
        <p>
          {translations.regards}<br/>
          {translations.company}
        </p>
      </div>
    </div>
  );
}
