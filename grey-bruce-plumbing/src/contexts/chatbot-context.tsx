"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react"
import { v4 as uuidv4 } from "uuid"
import { DialogflowService } from "../services/dialogflow-service"
import type { ChatMessage } from "../types"

interface ChatbotContextType {
  messages: ChatMessage[]
  isOpen: boolean
  isLoading: boolean
  sendMessage: (text: string) => Promise<void>
  toggleChatbot: () => void
  resetConversation: () => void
  minimizeChatbot: () => void
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined)

// Optimize the chatbot context to prevent unnecessary re-renders
export const ChatbotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState("")

  // Initialize session ID and welcome message
  useEffect(() => {
    const newSessionId = uuidv4()
    setSessionId(newSessionId)

    // Send welcome event when chatbot is first opened
    const handleWelcome = async () => {
      if (isOpen && messages.length === 0) {
        setIsLoading(true)
        try {
          const response = await DialogflowService.sendEvent("WELCOME", newSessionId)

          // Add bot message
          const botMessage: ChatMessage = {
            id: uuidv4(),
            text: response.fulfillmentText,
            sender: "bot",
            timestamp: new Date(),
          }

          setMessages([botMessage])
        } catch (error) {
          console.error("Error sending welcome event:", error)

          // Add fallback message
          const fallbackMessage: ChatMessage = {
            id: uuidv4(),
            text: "Welcome to Grey-Bruce Plumbing! How can I help you today?",
            sender: "bot",
            timestamp: new Date(),
          }

          setMessages([fallbackMessage])
        } finally {
          setIsLoading(false)
        }
      }
    }

    handleWelcome()
  }, [isOpen])

  // Optimize the sendMessage function to handle loading state better
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return

      // Add user message
      const userMessage: ChatMessage = {
        id: uuidv4(),
        text,
        sender: "user",
        timestamp: new Date(),
      }

      // Update messages with user message first for immediate feedback
      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)

      try {
        // Send message to Dialogflow
        const response = await DialogflowService.sendMessage(text, sessionId)

        // Add bot message
        const botMessage: ChatMessage = {
          id: uuidv4(),
          text: response.fulfillmentText,
          sender: "bot",
          timestamp: new Date(),
        }

        // Update messages with bot response
        setMessages((prev) => [...prev, botMessage])
      } catch (error) {
        console.error("Error sending message:", error)

        // Add error message
        const errorMessage: ChatMessage = {
          id: uuidv4(),
          text: "I'm having trouble connecting right now. Please try again or call our office directly.",
          sender: "bot",
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
      }
    },
    [sessionId],
  )

  // Toggle chatbot open/closed
  const toggleChatbot = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  // Also update the resetConversation function to use the same pattern
  const resetConversation = useCallback(() => {
    const newSessionId = uuidv4()
    setSessionId(newSessionId)
    setMessages([])
    setIsLoading(true)

    // Send welcome event
    DialogflowService.sendEvent("WELCOME", newSessionId)
      .then((response) => {
        const botMessage: ChatMessage = {
          id: uuidv4(),
          text: response.fulfillmentText,
          sender: "bot",
          timestamp: new Date(),
        }
        setMessages([botMessage])
      })
      .catch((error) => {
        console.error("Error sending welcome event:", error)
        const fallbackMessage: ChatMessage = {
          id: uuidv4(),
          text: "Welcome to Grey-Bruce Plumbing! How can I help you today?",
          sender: "bot",
          timestamp: new Date(),
        }
        setMessages([fallbackMessage])
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  // Minimize chatbot
  const minimizeChatbot = useCallback(() => {
    setIsOpen(false)
  }, [])

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      messages,
      isOpen,
      isLoading,
      sendMessage,
      toggleChatbot,
      resetConversation,
      minimizeChatbot,
    }),
    [messages, isOpen, isLoading, sendMessage, toggleChatbot, resetConversation, minimizeChatbot],
  )

  return <ChatbotContext.Provider value={contextValue}>{children}</ChatbotContext.Provider>
}

export const useChatbot = () => {
  const context = useContext(ChatbotContext)
  if (context === undefined) {
    throw new Error("useChatbot must be used within a ChatbotProvider")
  }
  return context
}

