import { supabase } from "../lib/supabase"
import type { DialogflowResponse } from "../types"

/**
 * Service for handling chatbot data retrieval
 */
export const ChatbotService = {
  /**
   * Fetches company information from Supabase
   */
  async getCompanyInfo() {
    try {
      const { data, error } = await supabase.from("sitewide_settings").select("*").single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error fetching company info:", error)
      return null
    }
  },

  /**
   * Process the Dialogflow response - simplified to just return the text
   */
  async processResponse(dialogflowResponse: DialogflowResponse): Promise<string> {
    // Simply return the fulfillment text without additional processing
    return dialogflowResponse.fulfillmentText
  },
}

