import type React from "react"
import type { ChatMessage } from "../../types"

interface MessageBubbleProps {
  message: ChatMessage
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === "user"

  // Format message text with links and line breaks
  const formatMessageText = (text: string) => {
    // Replace URLs with clickable links
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const textWithLinks = text.replace(
      urlRegex,
      (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-[#7ac144] underline">${url}</a>`,
    )

    // Replace phone numbers with clickable links
    const phoneRegex = /($$\d{3}$$\s*\d{3}-\d{4}|\d{3}-\d{3}-\d{4})/g
    const textWithPhoneLinks = textWithLinks.replace(
      phoneRegex,
      (phone) => `<a href="tel:${phone.replace(/[()-\s]/g, "")}" class="text-[#7ac144] underline">${phone}</a>`,
    )

    // Replace line breaks with <br> tags
    return textWithPhoneLinks.replace(/\n/g, "<br>")
  }

  // Dynamic classes for message bubble
  const messageBubbleClasses = [
    "max-w-[80%]",
    "rounded-lg",
    "px-4",
    "py-2",
    isUser ? "bg-[#152f59] text-white" : "bg-gray-100 text-black",
  ].join(" ")

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={messageBubbleClasses}>
        {/* Message text with formatted content */}
        {isUser ? (
          <div className="whitespace-pre-wrap">{message.text}</div>
        ) : (
          <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: formatMessageText(message.text) }} />
        )}

        {/* Timestamp */}
        <div className="text-xs opacity-70 mt-1 text-right">
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </div>
  )
}

