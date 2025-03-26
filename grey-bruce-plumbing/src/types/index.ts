// Database models based on Supabase schema
export interface SitewideSettings {
  company_name: string
  company_logo_url?: string
  phone_number: string
  emergency_phone: string
  email: string
  business_hours: string // Format: "monday:8AM-9PM,tuesday:8AM-9PM..."
  booking_link?: string
  footer_text: string
  address1_line: string
  address1_city: string
  address1_province: string
  address1_postal_code: string
  address2_line?: string
  address2_city?: string
  address2_province?: string
  address2_postal_code?: string
  facebook_url?: string
  twitter_url?: string
  instagram_url?: string
  linkedin_url?: string
  id: string
  created_at?: string
  updated_at?: string
  address1_phone?: string
  address2_phone?: string
  email2: string
  favicon_url?: string
}

export interface ServiceArea {
  name: string
  id: string
  active?: boolean
  created_at?: string
  is_main_address?: boolean
  address?: string
}

export interface Service {
  slug: string
  title: string
  overview: string
  id: string
  benefits?: any
  process?: any
  created_at?: string
  updated_at?: string
  commonProblems?: any
  relatedServices?: any
  imageUrl: string
  summary: string
}

// Simplify the types related to chatbot
// Keep the existing types but simplify the chatbot-related ones

// Chatbot specific types
export type ChatMessage = {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

export interface DialogflowResponse {
  fulfillmentText: string
  intent: {
    displayName: string
    name: string
  }
  parameters: Record<string, any>
  outputContexts?: any[]
}

export interface ChatbotState {
  messages: ChatMessage[]
  isOpen: boolean
  isMinimized: boolean
  isLoading: boolean
}

export interface ChatbotContextType {
  state: ChatbotState
  sendMessage: (message: string) => Promise<void>
  toggleChatbot: () => void
  minimizeChatbot: () => void
  resetChat: () => void
}

export interface PlumbingIssue {
  id: string
  name: string
  description: string
  severity: "low" | "medium" | "high"
  recommendedService: string
  emergencyContact?: boolean
}

export interface ServiceRecommendation {
  id: string
  serviceId: string
  title: string
  description: string
  slug: string
  bookingLink: string
}

