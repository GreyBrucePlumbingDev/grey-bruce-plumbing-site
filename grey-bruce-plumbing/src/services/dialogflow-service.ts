import type { DialogflowResponse, DialogflowContext, ConversationState } from "../types"
import { supabase } from "../lib/supabase"

/**
 * Service for interacting with Dialogflow via Supabase Edge Function
 */
export const DialogflowService = {
  /**
   * Sends a message to Dialogflow and gets the response
   * @param message User message
   * @param sessionId Unique session ID for conversation tracking
   * @param contexts Optional contexts to send with the request
   */
  async sendMessage(message: string, sessionId: string, contexts?: DialogflowContext[]): Promise<DialogflowResponse> {
    try {
      // Call the deployed Supabase Edge Function
      const { data, error } = await supabase.functions.invoke("dialogflow-proxy", {
        body: {
          message,
          sessionId,
          contexts,
        },
      })

      console.log("Edge function response:", data)

      if (error) {
        console.error("Edge function error:", error)
        throw error
      }

      return {
        fulfillmentText: data.fulfillmentText,
        intent: {
          displayName: data.intent?.displayName || "Default Fallback Intent",
          name: data.intent?.name || "Default Fallback Intent",
        },
        parameters: data.parameters || {},
        outputContexts: data.outputContexts || [],
      }
    } catch (error) {
      console.error("Error communicating with Dialogflow proxy:", error)
      return {
        fulfillmentText:
          "I'm having trouble connecting to my brain right now. Please try again later or call our office directly.",
        intent: {
          displayName: "Default Fallback Intent",
          name: "Default Fallback Intent",
        },
        parameters: {},
        outputContexts: [],
        conversationState: "initial",
      }
    }
  },

  /**
   * Sends an event to Dialogflow
   * @param eventName Name of the event to trigger
   * @param sessionId Unique session ID for conversation tracking
   * @param parameters Optional parameters to send with the event
   * @param contexts Optional contexts to send with the request
   */
  async sendEvent(
    eventName: string,
    sessionId: string,
    parameters: Record<string, any> = {},
    contexts?: DialogflowContext[],
  ): Promise<DialogflowResponse> {
    try {
      // Call the deployed Supabase Edge Function
      const { data, error } = await supabase.functions.invoke("dialogflow-proxy", {
        body: {
          event: eventName,
          sessionId,
          parameters,
          contexts,
        },
      })

      console.log("Edge function response for event:", data)

      if (error) {
        console.error("Edge function error:", error)
        throw error
      }

      return {
        fulfillmentText: data.fulfillmentText,
        intent: {
          displayName: data.intent?.displayName || "Default Fallback Intent",
          name: data.intent?.name || "Default Fallback Intent",
        },
        parameters: data.parameters || {},
        outputContexts: data.outputContexts || [],
      }
    } catch (error) {
      console.error("Error sending event to Dialogflow proxy:", error)
      return {
        fulfillmentText:
          "I'm having trouble connecting to my brain right now. Please try again later or call our office directly.",
        intent: {
          displayName: "Default Fallback Intent",
          name: "Default Fallback Intent",
        },
        parameters: {},
        outputContexts: [],
        conversationState: "initial",
      }
    }
  },
}

