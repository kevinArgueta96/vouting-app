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
  // Email-safe version with more compatible styling for email clients
  return (
    <html>
      <head>
        {/* Prevent Apple Mail from reformatting styles */}
        <meta name="x-apple-disable-message-reformatting" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        
        {/* Email-safe font embedding */}
        <style dangerouslySetInnerHTML={{ __html: `
          @import url('https://fonts.googleapis.com/css2?family=Russo+One&family=Poppins:wght@400;500;700&display=swap');
          
          /* Fallback font definitions */
          @font-face {
            font-family: 'Russo One';
            font-style: normal;
            font-weight: 400;
            src: url(https://fonts.gstatic.com/s/russoone/v14/Z9XUDmZRWg6M1LvRYsHOy8mJrrg.woff2) format('woff2');
            mso-font-alt: 'Arial';
          }
          
          @font-face {
            font-family: 'Poppins';
            font-style: normal;
            font-weight: 400;
            src: url(https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecg.woff2) format('woff2');
            mso-font-alt: 'Arial';
          }
          
          @font-face {
            font-family: 'Poppins';
            font-style: normal;
            font-weight: 500;
            src: url(https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2) format('woff2');
            mso-font-alt: 'Arial';
          }
          
          @font-face {
            font-family: 'Poppins';
            font-style: normal;
            font-weight: 700;
            src: url(https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2) format('woff2');
            mso-font-alt: 'Arial';
          }
        `}} />
        
        {/* Outlook-specific font definitions */}
        {/* Using conditional comments for Outlook */}
        <meta name="if:outlook" content="mso" />
        {/* This will be ignored by most email clients but used by Outlook */}
        <style dangerouslySetInnerHTML={{ __html: `
          .font-russo {
            font-family: Arial, sans-serif !important;
            font-weight: bold !important;
          }
          .font-poppins {
            font-family: Arial, sans-serif !important;
          }
        `}} />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
    <div style={{ backgroundColor: '#334798', width: '100%', maxWidth: '793px', margin: '0 auto' }}>
      <table cellPadding={0} cellSpacing={0} border={0} width="100%" style={{
        backgroundColor: '#334798',
        fontFamily: 'Arial, Helvetica, sans-serif',
        width: '100%',
        maxWidth: '793px',
        margin: '0 auto',
        borderCollapse: 'collapse',
      }}>
        <tbody>
          
          {/* <tr>
            <td align="center" style={{ padding: '33px 0 0 0' }}> */}
              {/* Logo container - simplified for email clients */}
              {/* <table cellPadding={0} cellSpacing={0} border={0} width="238">
                <tbody>
                  <tr>
                    <td align="center" valign="middle" style={{
                      backgroundColor: '#fffbf5',
                      borderRadius: '50%',
                      width: '238px',
                      height: '108px',
                    }}>
                      <table cellPadding={0} cellSpacing={0} border={0} width="100%">
                        <tbody>
                          <tr>
                            <td align="center" valign="middle" style={{ height: '108px' }}> */}
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              {/* <img 
                                src="https://cjdbnnncevpbeqeafmde.supabase.co/storage/v1/object/public/images//logo-mail.png"
                                alt="mail-logo"
                                width="238"
                                height="108"
                                style={{
                                  display: 'block',
                                  width: '238px',
                                  height: '108px',
                                }}
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr> */}
          
          <tr>
            <td align="center" style={{ padding: '40px 20px 0 20px' }}>
              {/* Title */}
              <table cellPadding={0} cellSpacing={0} border={0} width="100%" style={{ maxWidth: '564px' }}>
                <tbody>
                  <tr>
                    <td align="center">
                      <span style={{
                        display: 'block',
                        color: '#FFD4D4',
                        fontSize: '31px',
                        fontFamily: '"Russo One", "Trebuchet MS", Helvetica, Arial, sans-serif',
                        fontWeight: 'bold',
                        lineHeight: '38px',
                        letterSpacing: '0px',
                        textTransform: 'uppercase',
                        textAlign: 'center',
                      }}>
                        {translations.title}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          <tr>
            <td align="center" style={{ padding: '20px 20px 0 20px' }}>
              {/* Subtitle */}
              <table cellPadding={0} cellSpacing={0} border={0} width="100%" style={{ maxWidth: '640px' }}>
                <tbody>
                  <tr>
                    <td align="center">
                      <span style={{
                        display: 'block',
                        color: '#ffffff',
                        fontSize: '18px',
                        fontFamily: 'Arial, Helvetica, sans-serif',
                        textAlign: 'center',
                      }}>
                        {translations.message}
                        
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          
          
          <tr>
            <td align="center" style={{ padding: '20px 20px 0 20px' }}>
              {/* Subtitle */}
              <table cellPadding={0} cellSpacing={0} border={0} width="100%" style={{ maxWidth: '640px' }}>
                <tbody>
                  <tr>
                    <td align="center">
                      <span style={{
                        display: 'block',
                        color: '#FFD4D4',
                        fontSize: '18px',
                        fontFamily: '"Poppins", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
                        fontWeight: '500',
                        textAlign: 'center',
                      }}>
                        {translations.entryConfirm}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          
          <tr>
            <td align="center" style={{ padding: '30px 20px' }}>
              {/* White box */}
              <table cellPadding={0} cellSpacing={0} border={0} width="100%" style={{
                maxWidth: '696px',
                backgroundColor: '#ffffff',
                borderRadius: '25px',
              }}>
                <tbody>
                  <tr>
                    <td align="center" style={{ padding: '30px 20px' }}>
                      {/* Using dangerouslySetInnerHTML to render the HTML content */}
                      <span 
                        style={{ 
                          display: 'block',
                          color: '#334798',
                          fontSize: '18px',
                          fontFamily: 'Arial, Helvetica, sans-serif',
                          textAlign: 'center',
                        }}
                        dangerouslySetInnerHTML={{ __html: translations.goodLuck }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          
          <tr>
            <td align="center" style={{ padding: '20px 0 40px 0' }}>
              {/* Footer */}
              <table cellPadding={0} cellSpacing={0} border={0} width="100%" style={{ maxWidth: '300px' }}>
                <tbody>
                  <tr>
                    <td align="center">
                      <span style={{ 
                        display: 'block',
                        color: '#ffffff',
                        fontSize: '16px',
                        fontFamily: 'Arial, Helvetica, sans-serif',
                        textAlign: 'center',
                        lineHeight: '1.5',
                      }}>
                        {translations.regards}<br/>
                        {translations.company}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    </body>
    </html>
  );
}
