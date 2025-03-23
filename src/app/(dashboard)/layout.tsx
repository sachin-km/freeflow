'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, 
  Clock, 
  FolderKanban, 
  Users, 
  ChevronLeft, 
  PlusCircle,
  MessageSquareMore,
  LogOut,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createNewProject } from '@/lib/projectStorage'

const navItems = [
  { icon: Home, label: 'Home', href: '/dashboard' },
  { icon: Clock, label: 'Recents', href: '/dashboard/recents' },
  { icon: FolderKanban, label: 'Your Projects', href: '/dashboard/projects' },
  { icon: Users, label: 'Your Team', href: '/dashboard/team' },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    router.push('/auth/login')
  }

  const handleNewProject = async () => {
    try {
      // Create a new flowchart project directly
      const newProject = await createNewProject('Flowchart', 'flowchart')
      // Navigate to the workspace with the new project ID
      router.push(`/workspace/${newProject.id}`)
    } catch (error) {
      console.error('Error creating project:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#303F9F] to-[#5C6BC0]">
      {/* Sidebar */}
      <motion.div 
        className={`fixed left-0 top-0 h-full bg-white/10 backdrop-blur-xl border-r border-white/20 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
        initial={false}
      >
        <div className="p-4">
          <motion.button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute right-[-12px] top-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full p-1"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className={`w-4 h-4 text-white transition-transform ${
              isCollapsed ? 'rotate-180' : ''
            }`} />
          </motion.button>

          {/* Logo */}
          {!isCollapsed && (
            <div className="mb-6 text-center">
              <div className="flex items-center justify-center">
                <div className="flex items-center">
                  <h1 className="text-4xl font-cursive whitespace-nowrap">
                    <span className="logo-first-letter logo-color text-white">F</span><span className="logo-color text-white">reeflow</span>
                  </h1>
                </div>
              </div>
            </div>
          )}

          {/* New Project Button */}
          <motion.button
            onClick={handleNewProject}
            className="w-full bg-gradient-to-r from-[#7986CB] to-[#9FA8DA] text-white rounded-lg p-3 flex items-center gap-2 mb-8"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <PlusCircle className="w-5 h-5" />
            {!isCollapsed && <span>New Project</span>}
          </motion.button>

          {/* Navigation Items */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : 'text-white/70 hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="w-5 h-5" />
                    {!isCollapsed && <span>{item.label}</span>}
                  </motion.div>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Add Logout Button */}
        <motion.button
          onClick={handleLogout}
          className={`p-4 flex items-center gap-3 text-white/70 hover:text-white hover:bg-white/10 transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span>Logout</span>}
        </motion.button>
      </motion.div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${
        isCollapsed ? 'ml-20' : 'ml-64'
      }`}>
        <main className="p-8">
          {children}
        </main>
      </div>

      {/* AI Assistant Chat Bubble */}
      <motion.button
        className="fixed bottom-8 right-8 bg-gradient-to-r from-[#7986CB] to-[#9FA8DA] text-white rounded-full p-4 shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <MessageSquareMore className="w-6 h-6" />
      </motion.button>
    </div>
  )
} 