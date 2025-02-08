import { v4 as uuidv4 } from 'uuid';
import { supabase } from './supabase';

const USER_UUID_KEY = 'voting_user_uuid';

export const getUserUuid = (): string => {
  if (typeof window === 'undefined') return '';
  
  const userUuid = localStorage.getItem(USER_UUID_KEY);
  
  if (!userUuid) {
    const newUuid = uuidv4();
    localStorage.setItem(USER_UUID_KEY, newUuid);
    
    // Create user session in Supabase
    createUserSession(newUuid).catch(console.error);
    return newUuid;
  }
  
  return userUuid;
};

export const createUserSession = async (userUuid: string) => {
  let ipAddress = '0.0.0.0';
  let userAgent = '';

  if (typeof window === 'object') {
    userAgent = window.navigator.userAgent;
    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      ipAddress = ipData.ip;
    } catch (error) {
      console.error('Error fetching IP:', error);
    }
  }

  const { error } = await supabase
    .from('user_sessions')
    .insert({
      user_uuid: userUuid,
      ip_address: ipAddress,
      user_agent: userAgent
    });

  if (error && error.code !== '23505') { // Ignore unique violation errors
    console.error('Error creating user session:', error);
    throw error;
  }
};
