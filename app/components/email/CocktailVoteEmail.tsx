import * as React from 'react';
import { Database } from '../../types/supabase';

type Cocktail = Database['public']['Tables']['cocktails']['Row'];

interface EmailTranslations {
  title: string;
  cocktailDetails: string;
  name: string;
  brand: string;
  description: string;
  appreciation: string;
}

interface CocktailVoteEmailProps {
  cocktail: Cocktail;
  translations: EmailTranslations;
}

export default function CocktailVoteEmail({
  cocktail,
  translations
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
        
        <p style={{ marginBottom: '20px' }}>
          <strong>{translations.description}:</strong> {cocktail.description}
        </p>
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
