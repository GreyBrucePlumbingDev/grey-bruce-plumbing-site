"use client"

import { ChatbotHeader } from "./chatbot-header"
import { ChatInterface } from "./chat-interface"
import { ChatbotLauncher } from "./chatbot-launcher"
import { useChatbot } from "../../contexts/chatbot-context"
import { useEffect, useState } from "react"

export function ChatbotContainer() {
  const { isOpen, isLoading } = useChatbot()
  const [mounted, setMounted] = useState(false)

  // Use effect to handle initial mounting animation
  useEffect(() => {
    if (isOpen && !mounted) {
      setMounted(true)
    }
  }, [isOpen])

  return (
    <>
      {/* Chatbot launcher button */}
      <ChatbotLauncher />

      {/* Chatbot window */}
      {isOpen && (
        <div
          className={`fixed bottom-24 right-6 w-96 max-w-[calc(100vw-2rem)] shadow-xl rounded-lg bg-white z-40 flex flex-col ${
            mounted ? "transition-all duration-300" : ""
          } h-[500px] max-h-[80vh]`}
        >
          <div className="h-16 flex-shrink-0">
            <ChatbotHeader />
          </div>

          <div className="flex-1 overflow-hidden">
            <ChatInterface />
          </div>
        </div>
      )}
    </>
  )
}

