"use client"

import { ChatbotHeader } from "./chatbot-header"
import { ChatInterface } from "./chat-interface"
import { ChatbotLauncher } from "./chatbot-launcher"
import { useChatbot } from "../../contexts/chatbot-context"
import { useEffect, useState, useRef } from "react"
import { useWindowSize } from "../../hooks/useWindowSize"

export function ChatbotContainer() {
  const { isOpen } = useChatbot()
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const windowSize = useWindowSize()

  // Calculate dynamic dimensions based on screen size
  const getDynamicDimensions = () => {
    if (!windowSize.width) return { width: 380, height: 500 }

    // Base dimensions
    let width = 380
    let height = 500

    // Adjust for mobile
    if (windowSize.width < 640) {
      width = Math.min(windowSize.width - 32, 380) // 16px padding on each side
      height = Math.min(windowSize.height * 0.7, 500)
    }
    // Adjust for tablets
    else if (windowSize.width < 1024) {
      width = 380
      height = Math.min(windowSize.height * 0.7, 550)
    }
    // Adjust for larger screens
    else {
      width = 420
      height = Math.min(windowSize.height * 0.7, 600)
    }

    return { width, height }
  }

  const { width, height } = getDynamicDimensions()

  // Use effect to handle initial mounting animation
  useEffect(() => {
    if (isOpen && !mounted) {
      setMounted(true)
    }
  }, [isOpen])

  // Adjust container position based on screen size
  const getContainerPosition = () => {
    if (windowSize.width && windowSize.width < 640) {
      return "bottom-16 right-4 left-4 mx-auto"
    }
    return "bottom-24 right-6"
  }

  return (
    <>
      {/* Chatbot launcher button */}
      <ChatbotLauncher />

      {/* Chatbot window */}
      {isOpen && (
        <div
          ref={containerRef}
          className={`fixed ${getContainerPosition()} shadow-xl rounded-lg bg-white z-40 flex flex-col ${
            mounted ? "transition-all duration-300" : ""
          } overflow-hidden`}
          style={{
            width: windowSize.width && windowSize.width < 640 ? "auto" : `${width}px`,
            height: `${height}px`,
            maxHeight: "80vh",
            maxWidth: windowSize.width && windowSize.width < 640 ? "calc(100vw - 2rem)" : `${width}px`,
          }}
        >
          <div className="h-16 flex-shrink-0 sticky top-0 z-10">
            <ChatbotHeader />
          </div>

          <div className="flex-1 overflow-hidden">
            <ChatInterface maxHeight={height - 64 - 72} /> {/* Subtract header (64px) and input area (72px) heights */}
          </div>
        </div>
      )}
    </>
  )
}

