'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { getProjectById } from '@/lib/projectStorage'

// Import WorkspaceLayout with dynamic import
const WorkspaceLayout = dynamic(
  () => import('@/components/workspace/WorkspaceLayout'),
  { ssr: false, loading: () => <LoadingWorkspace /> }
)

function LoadingWorkspace() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-900">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-white/20 border-t-white/80 rounded-full animate-spin mb-4 mx-auto"></div>
        <p className="text-white">Loading workspace...</p>
      </div>
    </div>
  )
}

export default function WorkspacePage({ params }: { params: { projectId: string } }) {
  const router = useRouter()
  const { projectId } = params
  const [isLoading, setIsLoading] = useState(true)
  const [projectExists, setProjectExists] = useState(false)
  
  // Check if project exists
  useEffect(() => {
    async function checkProject() {
      setIsLoading(true)
      try {
        const project = await getProjectById(projectId)
        if (!project) {
          router.push('/dashboard/projects')
        } else {
          setProjectExists(true)
        }
      } catch (error) {
        console.error('Error loading project:', error)
        router.push('/dashboard/projects')
      } finally {
        setIsLoading(false)
      }
    }
    
    checkProject()
  }, [projectId, router])
  
  if (isLoading) {
    return <LoadingWorkspace />
  }
  
  if (!projectExists) {
    return null
  }
  
  return <WorkspaceLayout projectId={projectId} />
} 