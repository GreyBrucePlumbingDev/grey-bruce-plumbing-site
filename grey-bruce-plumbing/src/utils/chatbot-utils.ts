import type { SitewideSettings } from '../types/index';

/**
 * Parses business hours string into a structured format
 * @param hoursString Format: "monday:8AM-9PM,tuesday:8AM-9PM..."
 */
export function parseBusinessHours(hoursString: string): Record<string, { open: string; close: string }> {
  const days = hoursString.split(',');
  const hoursMap: Record<string, { open: string; close: string }> = {};
  
  days.forEach(day => {
    const [dayName, hours] = day.split(':');
    const [open, close] = hours.split('-');
    hoursMap[dayName.toLowerCase()] = { open, close };
  });
  
  return hoursMap;
}

/**
 * Gets current day's business hours
 */
export function getTodayHours(settings: SitewideSettings): string {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = days[new Date().getDay()];
  const hours = parseBusinessHours(settings.business_hours);
  
  if (hours[today]) {
    return `${hours[today].open} - ${hours[today].close}`;
  }
  
  return 'Closed today';
}

/**
 * Formats a phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  return phone;
}

/**
 * Generates a unique ID for chat messages
 */
export function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Extracts keywords from user message for better intent matching
 */
export function extractKeywords(message: string): string[] {
  const keywords = [
    'hours', 'open', 'close', 'contact', 'phone', 'email', 
    'emergency', 'service', 'area', 'location', 'address',
    'leak', 'clog', 'drain', 'water', 'pipe', 'toilet', 'sink',
    'heater', 'hot', 'cold', 'pressure', 'low', 'high',
    'repair', 'install', 'replace', 'maintenance'
  ];
  
  return keywords.filter(keyword => 
    message.toLowerCase().includes(keyword.toLowerCase())
  );
}
