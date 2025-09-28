import React from 'react'
import ReactMarkdown from 'react-markdown'
import { cn } from "@/lib/utils"

interface MarkdownViewerProps {
  content: string
  className?: string
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({
  content,
  className
}) => {
  if (!content.trim()) {
    return (
      <div className={cn("text-gray-500 italic", className)}>
        No content available
      </div>
    )
  }

  return (
    <div className={cn("prose prose-sm max-w-none", className)}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  )
}