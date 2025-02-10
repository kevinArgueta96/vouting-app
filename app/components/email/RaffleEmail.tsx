import * as React from 'react';

interface EmailTranslations {
  title: string;
  message: string;
  entryConfirm: string;
  goodLuck: string;
  regards: string;
  company: string;
}

interface RaffleEmailProps {
  translations: EmailTranslations;
}

export default function RaffleEmail({
  translations
}: RaffleEmailProps) {

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

      <div style={{
        backgroundColor: '#ffffff',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
      }}>
        <p style={{ marginBottom: '15px' }}>
          {translations.message}
        </p>
        
        <div style={{ marginBottom: '20px' }}>
          <p>{translations.entryConfirm}</p>
        </div>
      </div>

      <div style={{
        textAlign: 'center',
        color: '#666666',
        fontSize: '14px',
      }}>
        <p style={{ marginBottom: '15px' }}>{translations.goodLuck}</p>
        <p>
          {translations.regards}<br/>
          {translations.company}
        </p>
      </div>
    </div>
  );
}
