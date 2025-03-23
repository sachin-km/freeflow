'use client'

import React, { useState } from 'react'
import { StickyNote } from 'lucide-react'

interface NotesPanelProps {
  className?: string
}

export default function NotesPanel({ className }: NotesPanelProps) {
  const [notes, setNotes] = useState<string>('')
  
  return (
    <div className={`w-full h-full bg-white p-4 rounded-lg shadow-sm flex flex-col ${className}`}>
      <div className="flex items-center mb-4 space-x-2">
        <StickyNote size={18} className="text-[#4A4A4A]" />
        <h2 className="text-sm font-medium text-[#4A4A4A]">Element Notes</h2>
      </div>
      
      <div className="flex-1 flex flex-col">
        <div className="text-[#4A4A4A] text-center flex flex-col items-center justify-center h-full">
          <p className="text-sm">Select an element in the diagram to add notes</p>
        </div>
      </div>
    </div>
  )
} 