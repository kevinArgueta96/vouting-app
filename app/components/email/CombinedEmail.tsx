import * as React from 'react';
import { Database } from '../../types/supabase';

type Cocktail = Database['public']['Tables']['cocktails']['Row'];

interface CombinedEmailProps {
  cocktail: Cocktail;
}

export default function CombinedEmail({ cocktail }: CombinedEmailProps) {
  return (
    <div>
      <h1>Thank You for Your Interest!</h1>
      <p>Thank you for voting and participating in our raffle!</p>
      
      <div style={{ margin: '20px 0', padding: '20px', borderBottom: '1px solid #eee' }}>
        <h2>Your Requested Recipe: {cocktail.name}</h2>
        <p>By {cocktail.brand}</p>
        <div style={{ margin: '20px 0' }}>
          <h3>Description</h3>
          <p>{cocktail.description}</p>
        </div>
      </div>
      
      <div style={{ margin: '20px 0', padding: '20px' }}>
        <h2>Raffle Entry Confirmation</h2>
        <p>Your entry for the raffle has been successfully registered. Winners will be notified directly via email.</p>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <p>Good luck with the raffle and enjoy your cocktail!</p>
        <p>Best regards,<br/>Helsinki Distilling Company</p>
      </div>
    </div>
  );
}
