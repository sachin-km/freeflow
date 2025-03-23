'use client'

import { useState } from 'react'
import { Send, Lightbulb, Sparkles } from 'lucide-react'

interface AIAssistantProps {
  className?: string
}

export default function AIAssistant({ className }: AIAssistantProps) {
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: 'Hi! I can help you create and enhance your diagram. Ask me to add shapes, suggest improvements, or explain concepts.' }
  ])
  
  const handleExampleAction = (action: string) => {
    const newUserMessage = { 
      role: 'user' as const, 
      content: `Help me create a ${action}` 
    }
    
    const newAssistantMessage = { 
      role: 'assistant' as const, 
      content: `I'll help you create a ${action}. Once we implement the new diagram solution, I'll be able to assist with creating and modifying diagrams.` 
    }
    
    setMessages([...messages, newUserMessage, newAssistantMessage])
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!prompt.trim()) return
    
    // Add user message
    const newMessages = [
      ...messages,
      { role: 'user' as const, content: prompt }
    ]
    
    setMessages(newMessages)
    setPrompt('')
    setIsLoading(true)
    
    // Simulate AI response
    setTimeout(() => {
      setMessages([
        ...newMessages,
        { 
          role: 'assistant', 
          content: "I understand you need help with that. Once we implement the new diagram solution, I'll be able to assist with more specific diagram tasks."
        }
      ])
      setIsLoading(false)
    }, 1000)
  }
  
  return (
    <div className={`flex flex-col h-full bg-white rounded-lg shadow-sm ${className}`}>
      {/* Header */}
      <div className="p-3 border-b border-[#C7D9DD]/30">
        <h3 className="flex items-center gap-1.5 text-sm font-medium text-[#4A4A4A]">
          <Sparkles size={16} className="text-[#ADB2D4]" />
          AI Assistant
        </h3>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-auto p-3 space-y-4">
        {messages.map((message, i) => (
          <div key={i} className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
            <div 
              className={`max-w-[85%] p-3 rounded-lg text-sm ${
                message.role === 'assistant' 
                  ? 'bg-[#EEF1DA]/50 text-[#4A4A4A]' 
                  : 'bg-[#ADB2D4]/20 text-[#4A4A4A]'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[85%] p-3 rounded-lg bg-[#EEF1DA]/50 text-[#4A4A4A] text-sm">
              <div className="flex space-x-1.5">
                <div className="w-2 h-2 rounded-full bg-[#ADB2D4] animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-[#ADB2D4] animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-[#ADB2D4] animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Example Actions */}
      <div className="p-3 border-t border-[#C7D9DD]/30">
        <h4 className="text-xs text-[#4A4A4A]/70 mb-2 font-medium flex items-center gap-1">
          <Lightbulb size={14} className="text-[#D5E5D5]" />
          Example Actions
        </h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleExampleAction('flowchart')}
            className="text-xs px-2.5 py-1.5 rounded-full bg-[#EEF1DA]/50 text-[#4A4A4A] hover:bg-[#EEF1DA]/70 transition-colors"
          >
            Add Flowchart
          </button>
          <button
            onClick={() => handleExampleAction('org chart')}
            className="text-xs px-2.5 py-1.5 rounded-full bg-[#EEF1DA]/50 text-[#4A4A4A] hover:bg-[#EEF1DA]/70 transition-colors"
          >
            Add Org Chart
          </button>
        </div>
      </div>
      
      {/* Input Form */}
      <div className="p-3 border-t border-[#C7D9DD]/30">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask AI to help with your diagram..."
            className="flex-1 text-sm p-2 rounded-lg border border-[#C7D9DD]/30 focus:outline-none focus:ring-2 focus:ring-[#ADB2D4]/30 bg-white text-[#4A4A4A]"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="p-2 rounded-lg bg-[#ADB2D4] text-white hover:bg-[#ADB2D4]/90 transition-colors disabled:opacity-50"
            disabled={isLoading || !prompt.trim()}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  )
} 