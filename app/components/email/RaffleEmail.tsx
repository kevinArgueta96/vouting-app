import * as React from 'react';

export default function RaffleEmail() {
  return (
    <div>
      <h1>Thank You for Participating in Our Raffle!</h1>
      <p>We've received your entry for the raffle. Thank you for participating!</p>
      
      <div style={{ margin: '20px 0' }}>
        <p>Your entry has been successfully registered. Winners will be notified directly via email.</p>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <p>Good luck!</p>
        <p>Best regards,<br/>Helsinki Distilling Company</p>
      </div>
    </div>
  );
}
