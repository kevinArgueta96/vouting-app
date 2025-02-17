import * as React from 'react';
import { Database } from '../../types/supabase';

type CocktailTranslation = Database['public']['Tables']['cocktails_translations']['Row'];
type Cocktail = Database['public']['Tables']['cocktails']['Row'] & {
  translations?: CocktailTranslation[];
};

interface EmailTranslations {
  title: string;
  cocktailDetails: string;
  name: string;
  brand: string;
  description: string;
  recipe: string;
  appreciation: string;
}

interface CocktailVoteEmailProps {
  cocktail: Cocktail;
  translations: EmailTranslations;
  locale: string;
}

export default function CocktailVoteEmail({
  cocktail,
  translations,
  locale
}: CocktailVoteEmailProps) {

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
        {translations.title.replace('{cocktailName}', cocktail.name)}
      </h1>

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
          {translations.cocktailDetails}
        </h2>
        
        <p style={{ marginBottom: '15px' }}>
          <strong>{translations.name}:</strong> {cocktail.name}
        </p>
        
        <p style={{ marginBottom: '15px' }}>
          <strong>{translations.brand}:</strong> {cocktail.brand}
        </p>
        
        <p style={{ marginBottom: '15px' }}>
          <strong>{translations.description}:</strong> {cocktail.description}
        </p>
        
        <div style={{
          marginTop: '20px',
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: '#f5f5f5',
          borderRadius: '5px',
          border: '1px solid #e0e0e0'
        }}>
          <h3 style={{
            fontSize: '18px',
            color: '#1a1a1a',
            marginBottom: '10px'
          }}>
            {translations.recipe}
          </h3>
          <p style={{ lineHeight: '1.5' }}>
            {cocktail.translations?.find((t) => t.locale === locale)?.recipe}
          </p>
        </div>
      </div>

      <p style={{
        textAlign: 'center',
        color: '#666666',
        fontSize: '14px',
      }}>
        {translations.appreciation}
      </p>
    </div>
  );
}
