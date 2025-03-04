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
  // Email-safe version with more compatible styling for email clients
  return (
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
          <tr>
            <td align="center" style={{ padding: '33px 0 0 0' }}>
              {/* Logo container - simplified for email clients */}
              <table cellPadding={0} cellSpacing={0} border={0} width="238">
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
                            <td align="center" valign="middle" style={{ height: '108px' }}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img 
                                src="https://cjdbnnncevpbeqeafmde.supabase.co/storage/v1/object/public/images/logo-mail.png"
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
          </tr>
          
          <tr>
            <td align="center" style={{ padding: '40px 20px 0 20px' }}>
              {/* Title */}
              <table cellPadding={0} cellSpacing={0} border={0} width="100%" style={{ maxWidth: '564px' }}>
                <tbody>
                  <tr>
                    <td align="center">
                      <span style={{
                        display: 'block',
                        color: '#F6B8AF',
                        fontSize: '31px',
                        fontFamily: 'Russo One, Regular',
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
              {/* Raffle Message */}
              <table cellPadding={0} cellSpacing={0} border={0} width="100%" style={{ maxWidth: '640px' }}>
                <tbody>
                  <tr>
                    <td align="center">
                      <span style={{
                        display: 'block',
                        color: '#FFFFFF',
                        fontSize: '19px',
                        fontFamily: 'Poppins, Arial, Helvetica, sans-serif',
                        lineHeight: '24px',
                        letterSpacing: '0.42px',
                        textAlign: 'center',
                      }}>
                        {translations.raffleMessage}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          
          <tr>
            <td align="center" style={{ padding: '30px 20px 0 20px' }}>
              {/* Recipe Intro */}
              <table cellPadding={0} cellSpacing={0} border={0} width="100%" style={{ maxWidth: '640px' }}>
                <tbody>
                  <tr>
                    <td align="center">
                      <span style={{
                        display: 'block',
                        color: '#F6B8AF',
                        fontSize: '19px',
                        fontFamily: 'Poppins, Arial, Helvetica, sans-serif',
                        fontWeight: 'medium',
                        lineHeight: '21px',
                        letterSpacing: '0.42px',
                        textAlign: 'center',
                      }}>
                        {translations.recipeIntro}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          
          <tr>
            <td align="center" style={{ padding: '30px 20px' }}>
              {/* White box with cocktail details */}
              <table cellPadding={0} cellSpacing={0} border={0} width="100%" style={{
                maxWidth: '696px',
                backgroundColor: '#ffffff',
                borderRadius: '25px',
              }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '30px' }}>
                      {/* Cocktail name and bar */}
                      <table cellPadding={0} cellSpacing={0} border={0} width="100%">
                        <tbody>
                          <tr>
                            <td>
                              <h2 style={{
                                fontSize: '28px',
                                color: '#334798',
                                margin: '0 0 5px 0',
                                fontWeight: 'bold',
                              }}>
                                {cocktail.name}
                              </h2>
                              <p style={{
                                fontSize: '20px',
                                color: '#E8B298',
                                margin: '0 0 20px 0',
                              }}>
                                By {cocktail.brand}
                              </p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      
                      {/* Recipe section */}
                      <table cellPadding={0} cellSpacing={0} border={0} width="100%" style={{
                        backgroundColor: '#F0F8F6',
                        borderRadius: '15px',
                        margin: '10px 0 20px 0',
                      }}>
                        <tbody>
                          <tr>
                            <td style={{ padding: '20px' }}>
                              <h3 style={{
                                fontSize: '22px',
                                color: '#334798',
                                margin: '0 0 15px 0',
                              }}>
                                {translations.recipe}:
                              </h3>
                              <div 
                                style={{
                                  fontSize: '16px',
                                  color: '#334798',
                                  lineHeight: '1.5',
                                  margin: '0',
                                }}
                                dangerouslySetInnerHTML={{ 
                                  __html: cocktail.translations?.find((t) => t.locale === locale)?.recipe || '' 
                                }}
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      
                      {/* Final Message */}
                      <table cellPadding={0} cellSpacing={0} border={0} width="100%">
                        <tbody>
                          <tr>
                            <td>
                              <p style={{
                                fontSize: '22px',
                                color: '#334798',
                                margin: '0',
                                fontWeight: 'bold',
                              }}>
                                {translations.finalMessage}
                              </p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          
          {/* Social media section */}
          <tr>
            <td align="center" style={{ padding: '0 20px 30px 20px' }}>
              <table cellPadding={0} cellSpacing={0} border={0} width="100%" style={{
                maxWidth: '696px',
                backgroundColor: '#EE97AB',
                borderRadius: '25px',
                padding: '20px',
              }}>
                <tbody>
                  <tr>
                    <td align="center">
                      <span 
                        style={{ 
                          display: 'block',
                          color: '#334798',
                          fontSize: '18px',
                          fontFamily: 'Arial, Helvetica, sans-serif',
                          textAlign: 'center',
                          padding: '10px 20px',
                        }}
                        dangerouslySetInnerHTML={{ __html: translations.followUs }}
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
  );
}
