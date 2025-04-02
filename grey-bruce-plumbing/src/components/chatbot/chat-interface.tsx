"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useChatbot } from "../../contexts/chatbot-context"
import { MessageBubble } from "./message-bubble"

interface ChatInterfaceProps {
  maxHeight?: number
}

// Completely revamp the ChatInterface component to fix scrolling issues
export const ChatInterface: React.FC<ChatInterfaceProps> = ({ maxHeight }) => {
  const { messages, isLoading, sendMessage, resetConversation, isOpen } = useChatbot()
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [prevMessagesLength, setPrevMessagesLength] = useState(0)

  // Improved scroll handling that maintains position when new messages are added
  useEffect(() => {
    if (messages.length > prevMessagesLength) {
      // Only auto-scroll when new messages are added
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
    setPrevMessagesLength(messages.length)
  }, [messages, prevMessagesLength])

  // Auto-focus input field when chat is opened or after sending a message
  useEffect(() => {
    // Focus when messages change (after sending a message)
    if (!isLoading && inputRef.current) {
      inputRef.current.focus()
    }
  }, [messages, isLoading])

  // Focus input when chat is opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Small timeout to ensure the chat is fully rendered
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  // Update the form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      sendMessage(input)
      setInput("")
      // Focus will be handled by the useEffect that watches messages
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
        style={{ maxHeight: maxHeight ? `${maxHeight}px` : "calc(100% - 72px)" }}
      >
        <div className="h-2"></div>

        {messages.map((message, index) => (
          <MessageBubble
            key={message.id}
            message={message}
            isLastInGroup={index === messages.length - 1 || messages[index + 1]?.sender !== message.sender}
          />
        ))}

        {/* Message-specific loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg px-4 py-3 bg-gray-100 text-black shadow-sm">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div
                    className="w-2 h-2 rounded-full bg-[#152f59] animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-[#152f59] animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-[#152f59] animate-bounce"
                    style={{ animationDelay: "600ms" }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500">Grey-Bruce Plumbing is typing...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="border-t p-4 flex gap-2 bg-white sticky bottom-0 z-10">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
          className="input input-bordered w-full focus:outline-none focus:border-[#152f59] focus:ring-1 focus:ring-[#152f59]"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="btn btn-square bg-[#152f59] hover:bg-[#152f59]/90 text-white disabled:bg-gray-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={resetConversation}
          className="btn btn-square btn-outline border-[#152f59] text-[#152f59] hover:bg-[#152f59] hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </form>
    </div>
  )
}

