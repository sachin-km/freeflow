'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { FolderKanban, Plus, ArrowRight, Activity, GitBranch, Users, BrainCircuit, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getProjects, createNewProject, deleteProject } from '@/lib/projectStorage'
import { Project } from '@/lib/projectStorage'

const fadeInUp = {
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

export default function ProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [contextMenu, setContextMenu] = useState<{
    show: boolean;
    x: number;
    y: number;
    projectId: string;
  }>({
    show: false,
    x: 0,
    y: 0,
    projectId: ''
  })
  
  // Create ref for detecting clicks outside context menu
  const contextMenuRef = useRef<HTMLDivElement>(null)
  
  // Load projects on component mount
  useEffect(() => {
    async function loadProjects() {
      try {
        setIsLoading(true)
        const loadedProjects = await getProjects()
        setProjects(loadedProjects || [])
      } catch (error) {
        console.error('Error loading projects:', error)
        setProjects([])
      } finally {
        setIsLoading(false)
      }
    }
    
    loadProjects()
  }, [])
  
  // Handle document click to close context menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setContextMenu(prev => ({ ...prev, show: false }))
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  
  // Create a new project directly (using flowchart as default type)
  const createNewFlowchartProject = async () => {
    try {
      const newProject = await createNewProject('Flowchart', 'flowchart')
      router.push(`/workspace/${newProject.id}`)
    } catch (error) {
      console.error('Error creating project:', error)
    }
  }
  
  // Open an existing project
  const openProject = (projectId: string) => {
    router.push(`/workspace/${projectId}`)
  }
  
  // Show context menu
  const handleContextMenu = (e: React.MouseEvent, projectId: string) => {
    e.preventDefault()
    setContextMenu({
      show: true,
      x: e.clientX,
      y: e.clientY,
      projectId
    })
  }
  
  // Delete a project
  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteProject(projectId)
      // Update the projects list
      setProjects(projects.filter(project => project.id !== projectId))
      // Hide the context menu
      setContextMenu(prev => ({ ...prev, show: false }))
    } catch (error) {
      console.error('Error deleting project:', error)
    }
  }
  
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
      className="space-y-8"
    >
      <motion.div variants={fadeInUp}>
        <h1 className="text-3xl font-bold text-white mb-2">Your Projects</h1>
        <p className="text-white/60">Manage all your diagram projects</p>
      </motion.div>

      <motion.div 
        variants={fadeInUp}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {/* New Project Card */}
        <motion.div
          onClick={createNewFlowchartProject}
          className="aspect-video bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6 flex flex-col items-center justify-center cursor-pointer group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-white/10 transition-colors">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Create New Project</h3>
          <p className="text-white/60 text-sm text-center">
            Start a new diagram from scratch
          </p>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <motion.div
            className="aspect-video bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 flex flex-col items-center justify-center"
            variants={fadeInUp}
          >
            <div className="w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin mb-4"></div>
            <p className="text-white/60">Loading projects...</p>
          </motion.div>
        )}

        {/* Project Cards */}
        {!isLoading && projects.length > 0 && projects.map((project) => (
          <motion.div
            key={project.id}
            onClick={() => openProject(project.id)}
            onContextMenu={(e) => handleContextMenu(e, project.id)}
            className="aspect-video bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 flex flex-col cursor-pointer hover:bg-white/10 transition-colors"
            variants={fadeInUp}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Project Icon based on type */}
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4">
              {project.type === 'flowchart' && <GitBranch className="w-5 h-5 text-blue-400" />}
              {project.type === 'processflow' && <Activity className="w-5 h-5 text-green-400" />}
              {project.type === 'orgchart' && <Users className="w-5 h-5 text-purple-400" />}
              {project.type === 'brainstorming' && <BrainCircuit className="w-5 h-5 text-amber-400" />}
            </div>
            
            {/* Project Details */}
            <h3 className="text-lg font-semibold text-white mb-1">{project.name}</h3>
            <p className="text-white/40 text-xs mb-4">
              Last edited: {new Date(project.lastEdited).toLocaleDateString()}
            </p>
            
            {/* Project Status */}
            <div className="mt-auto flex items-center justify-between">
              <div className="text-white/60 text-sm flex items-center">
                <span className="mr-2">{project.type}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-white/60" />
            </div>
          </motion.div>
        ))}

        {/* Empty State (shows only when there are no projects) */}
        {!isLoading && projects.length === 0 && (
          <motion.div
            className="aspect-video bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-colors"
            variants={fadeInUp}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={createNewFlowchartProject}
          >
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <FolderKanban className="w-6 h-6 text-white/40" />
            </div>
            <p className="text-white/40 text-sm text-center">
              No projects yet - Click to create one
            </p>
          </motion.div>
        )}
      </motion.div>
      
      {/* Context Menu */}
      {contextMenu.show && (
        <div 
          ref={contextMenuRef}
          className="fixed bg-slate-800 border border-white/10 rounded-md shadow-lg p-1 z-50 min-w-[160px]" 
          style={{ 
            left: `${contextMenu.x}px`, 
            top: `${contextMenu.y}px` 
          }}
        >
          <button 
            onClick={() => handleDeleteProject(contextMenu.projectId)}
            className="w-full text-left p-2 rounded hover:bg-white/10 text-white text-sm flex items-center gap-2"
          >
            <Trash size={14} className="text-red-400" />
            Delete Project
          </button>
        </div>
      )}
    </motion.div>
  )
} 