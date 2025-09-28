import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RiEyeLine, RiEditLine } from "react-icons/ri"
import { cn } from "@/lib/utils"

interface MarkdownEditorProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  maxLength?: number
  className?: string
  showPreview?: boolean
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value = '',
  onChange,
  placeholder = "Start typing... Use markdown for formatting",
  disabled = false,
  maxLength = 2000,
  className,
  showPreview = true
}) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [characterCount, setCharacterCount] = useState(value.length)

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setCharacterCount(newValue.length)
    onChange?.(newValue)
  }

  return (
    <div className={cn("border rounded-md", className)}>
      {/* Header with Preview Toggle */}
      {showPreview && (
        <div className="flex items-center justify-between border-b p-2 bg-gray-50">
          <div className="text-sm font-medium text-gray-700">
            {isPreviewMode ? 'Preview' : 'Editor'}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={!isPreviewMode ? "default" : "ghost"}
              size="sm"
              onClick={() => setIsPreviewMode(false)}
              disabled={disabled}
              className="h-8 text-xs"
            >
              <RiEditLine className="h-3 w-3 mr-1" />
              Edit
            </Button>
            <Button
              variant={isPreviewMode ? "default" : "ghost"}
              size="sm"
              onClick={() => setIsPreviewMode(true)}
              disabled={disabled}
              className="h-8 text-xs"
            >
              <RiEyeLine className="h-3 w-3 mr-1" />
              Preview
            </Button>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="relative">
        {isPreviewMode && showPreview ? (
          <div className="min-h-[200px] p-3 prose prose-sm max-w-none">
            <ReactMarkdown>{value || '*No content to preview*'}</ReactMarkdown>
          </div>
        ) : (
          <div className="relative">
            <Textarea
              value={value}
              onChange={handleTextChange}
              placeholder={placeholder}
              disabled={disabled}
              maxLength={maxLength}
              className="border-0 resize-none focus:ring-0 min-h-[200px]"
              style={{ outline: 'none', boxShadow: 'none' }}
            />
            {/* Character count */}
            {maxLength && (
              <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white px-2 py-1 rounded">
                {characterCount}/{maxLength}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Markdown syntax help */}
      <div className="border-t p-2 bg-gray-50 text-xs text-gray-600">
        <details>
          <summary className="cursor-pointer hover:text-gray-800 select-none">
            Markdown formatting help
          </summary>
          <div className="mt-2 space-y-1">
            <div><code>**bold text**</code> → <strong>bold text</strong></div>
            <div><code>*italic text*</code> → <em>italic text</em></div>
            <div><code>`inline code`</code> → <code className="bg-gray-100 px-1 rounded">inline code</code></div>
            <div><code>[link text](url)</code> → <a href="#" className="text-blue-600 underline">link text</a></div>
            <div><code>```code block```</code> → code block</div>
            <div><code># Heading 1</code>, <code>## Heading 2</code>, <code>### Heading 3</code></div>
          </div>
        </details>
      </div>
    </div>
  )
}