export interface SitewideSettings {
    id?: string;
    company_name: string;
    company_logo_url: string;
    favicon_url: string;
    phone_number: string;
    emergency_phone: string;
    email: string;
    email2?: string;
    business_hours: string;
    booking_link: string;
    footer_text: string;
    // Address 1
    address1_line: string;
    address1_city: string;
    address1_province: string;
    address1_postal_code: string;
    address1_phone: string; // Added phone number for address 1
    // Address 2
    address2_line?: string;
    address2_city?: string;
    address2_province?: string;
    address2_postal_code?: string;
    address2_phone?: string; // Added phone number for address 2
    // Social media
    facebook_url: string;
    twitter_url: string;
    instagram_url: string;
    linkedin_url: string;
    created_at?: string;
    updated_at?: string;
  }