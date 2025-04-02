"use client"

import { useChatbot } from "../../contexts/chatbot-context"

export function ChatbotHeader() {
  const { minimizeChatbot, resetConversation } = useChatbot()

  return (
    <div className="bg-[#152f59] text-white p-4 rounded-t-lg flex justify-between items-center w-full sticky top-0 z-20">
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-[#152f59]"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
          </svg>
        </div>
        <h3 className="font-bold">Grey-Bruce Plumbing Assistant</h3>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={resetConversation}
          className="text-white hover:text-gray-200 transition-colors"
          aria-label="Reset chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <button
          onClick={minimizeChatbot}
          className="text-white hover:text-gray-200 transition-colors"
          aria-label="Minimize chatbot"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  )
}

