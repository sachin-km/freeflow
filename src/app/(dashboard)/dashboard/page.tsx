'use client'

import { motion, Variants } from 'framer-motion'
import { 
  Zap, 
  GitBranch, 
  Network, 
  Brain, 
  Lightbulb,
  ArrowRight
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createNewProject } from '@/lib/projectStorage'

const categories = [
  {
    icon: Zap,
    title: 'Quick-start AI Templates',
    description: 'Get started quickly with AI-powered templates',
    color: 'from-purple-500 to-blue-500',
    projectType: 'flowchart'
  },
  {
    icon: GitBranch,
    title: 'Process Flows',
    description: 'Map out your business processes efficiently',
    color: 'from-blue-500 to-cyan-500',
    projectType: 'processflow'
  },
  {
    icon: Network,
    title: 'Organization Charts',
    description: 'Visualize your team structure',
    color: 'from-cyan-500 to-teal-500',
    projectType: 'orgchart'
  },
  {
    icon: Brain,
    title: 'Mind Maps',
    description: 'Organize your thoughts and ideas',
    color: 'from-teal-500 to-green-500',
    projectType: 'brainstorming'
  },
  {
    icon: Lightbulb,
    title: 'Brainstorming',
    description: 'Collaborate and ideate with your team',
    color: 'from-green-500 to-yellow-500',
    projectType: 'brainstorming'
  }
]

const fadeInUp: Variants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
}

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function DashboardPage() {
  const router = useRouter()

  const handleNewProject = async () => {
    try {
      const newProject = await createNewProject('Flowchart', 'flowchart')
      router.push(`/workspace/${newProject.id}`)
    } catch (error) {
      console.error('Error creating new project:', error)
    }
  }

  const handleCategoryClick = async (projectType: 'flowchart' | 'processflow' | 'orgchart' | 'brainstorming', title: string) => {
    try {
      const newProject = await createNewProject(title, projectType)
      router.push(`/workspace/${newProject.id}`)
    } catch (error) {
      console.error(`Error creating ${projectType} project:`, error)
    }
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={stagger}
      className="space-y-8"
    >
      {/* Hero Section */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-8"
      >
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to <span className="font-cursive logo-color"><span className="logo-first-letter">F</span>reeflow</span>
          </h1>
          <p className="text-white/80 text-lg mb-6">
            Create intelligent flowcharts with AI assistance. Get started by choosing a template or start from scratch.
          </p>
          <motion.button
            onClick={handleNewProject}
            className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Create New Project
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Background Animation */}
        <div className="absolute inset-0 -z-10">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white/5 rounded-full"
              style={{
                width: Math.random() * 100 + 50,
                height: Math.random() * 100 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                x: [0, Math.random() * 50 - 25, 0],
                y: [0, Math.random() * 50 - 25, 0],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Categories Grid */}
      <motion.div 
        variants={fadeInUp}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {categories.map((category, index) => {
          const Icon = category.icon
          
          return (
            <motion.div
              key={index}
              className="group relative overflow-hidden rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 p-6 hover:bg-white/20 transition-colors cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCategoryClick(category.projectType as 'flowchart' | 'processflow' | 'orgchart' | 'brainstorming', category.title)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
              
              <Icon className="w-8 h-8 text-white mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {category.title}
              </h3>
              <p className="text-white/70 mb-4">
                {category.description}
              </p>
              <div className="text-white/90 hover:text-white flex items-center gap-2 text-sm">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        variants={fadeInUp}
        className="rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 p-6"
      >
        <h2 className="text-2xl font-semibold text-white mb-4">
          Recent Activity
        </h2>
        <div className="text-white/70 text-center py-8">
          No recent activity yet. Start by creating a new project!
        </div>
      </motion.div>
    </motion.div>
  )
} 