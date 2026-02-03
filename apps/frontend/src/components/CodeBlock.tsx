import { useState } from 'react'

/**
 * CodeBlock Component
 * 
 * A reusable component for displaying code with syntax highlighting and copy functionality.
 * Features:
 * 1. Syntax highlighting (via CSS classes)
 * 2. Copy to clipboard button
 * 3. Visual feedback when code is copied
 * 4. Horizontal scrolling for long code lines
 * 
 * Usage:
 * <CodeBlock 
 *   code="const x = 42;" 
 *   language="javascript" 
 *   id="unique-id" 
 * />
 */

interface CodeBlockProps {
  code: string
  language: string
  id: string
}

export default function CodeBlock({ code, language }: Omit<CodeBlockProps, 'id'>) {
  // State to track if code was recently copied
  const [copied, setCopied] = useState(false)

  /**
   * Copy code to clipboard and show success feedback
   */
  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    
    // Reset copied state after 2 seconds
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group">
      {/* Copy button - only visible on hover */}
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleCopy}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded transition-colors"
        >
          {copied ? '✓ Copied!' : 'Copy'}
        </button>
      </div>
      
      {/* Code display area */}
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  )
}
