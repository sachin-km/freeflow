'use client'

import React from 'react'
import { Toaster, toast } from 'sonner'

export { toast }

export default function ToastWrapper() {
  return <Toaster richColors position="top-right" />
} 