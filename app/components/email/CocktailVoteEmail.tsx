import * as React from 'react';
import { Database } from '../../types/supabase';

type Cocktail = Database['public']['Tables']['cocktails']['Row'];

interface CocktailVoteEmailProps {
  cocktail: Cocktail;
}

export default function CocktailVoteEmail({
  cocktail,
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
        Thank you for voting for {cocktail.name}!
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
          Cocktail Details
        </h2>
        
        <p style={{ marginBottom: '15px' }}>
          <strong>Name:</strong> {cocktail.name}
        </p>
        
        <p style={{ marginBottom: '15px' }}>
          <strong>Brand:</strong> {cocktail.brand}
        </p>
        
        <p style={{ marginBottom: '20px' }}>
          <strong>Description:</strong> {cocktail.description}
        </p>
      </div>

      <p style={{
        textAlign: 'center',
        color: '#666666',
        fontSize: '14px',
      }}>
        We appreciate your participation in voting for our cocktails!
      </p>
    </div>
  );
}
