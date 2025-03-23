'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Toolbar from './Toolbar'
import AIAssistant from './AIAssistant'
import NotesPanel from './NotesPanel'
import ReactFlowDiagram from './ReactFlowDiagram'
import { ReactFlowProvider } from '@/contexts/ReactFlowContext'

export default function WorkspaceLayout() {
  const router = useRouter()
  const params = useParams<{ projectId: string }>()
  const projectId = params?.projectId
  const [leftPanelOpen, setLeftPanelOpen] = useState(true)
  const [rightPanelOpen, setRightPanelOpen] = useState(true)
  
  // React Flow state
  const [zoom, setZoom] = useState(1)
  const [isGridVisible, setIsGridVisible] = useState(true)
  const [gridType, setGridType] = useState<'dots' | 'lines' | 'cross'>('dots')
  
  const toggleLeftPanel = () => {
    setLeftPanelOpen(!leftPanelOpen)
  }
  
  const toggleRightPanel = () => {
    setRightPanelOpen(!rightPanelOpen)
  }
  
  // Toolbar handlers
  const handleZoomIn = useCallback(() => {
    setZoom(prevZoom => {
      // Increase zoom by 25% (multiply by 1.25)
      const newZoom = Math.min(prevZoom * 1.25, 2)
      return Math.round(newZoom * 100) / 100 // Round to 2 decimal places
    })
  }, [])
  
  const handleZoomOut = useCallback(() => {
    setZoom(prevZoom => {
      // Decrease zoom by 20% (multiply by 0.8)
      const newZoom = Math.max(prevZoom * 0.8, 0.1)
      return Math.round(newZoom * 100) / 100 // Round to 2 decimal places
    })
  }, [])
  
  // Handle zoom change from ReactFlow
  const handleZoomChange = useCallback((newZoom: number) => {
    // Round to 2 decimal places for stability
    const roundedZoom = Math.round(newZoom * 100) / 100
    if (Math.abs(zoom - roundedZoom) > 0.001) {
      setZoom(roundedZoom)
    }
  }, [zoom])
  
  const toggleGrid = useCallback(() => {
    setIsGridVisible(prev => {
      console.log('Toggling grid from', prev, 'to', !prev)
      return !prev
    })
  }, [])
  
  const handleGridTypeChange = useCallback((type: 'dots' | 'lines' | 'cross') => {
    console.log('Changing grid type from', gridType, 'to', type)
    setGridType(type)
  }, [gridType])
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Zoom in/out with keyboard shortcuts (Ctrl + +/-)
      if (event.ctrlKey) {
        if (event.key === '+' || event.key === '=') {
          event.preventDefault()
          handleZoomIn()
        } else if (event.key === '-') {
          event.preventDefault()
          handleZoomOut()
        } else if (event.key === '0') {
          // Reset zoom to 100%
          event.preventDefault()
          setZoom(1)
        }
      }
      
      // Toggle grid visibility with 'g'
      if (event.key === 'g' && !event.ctrlKey && !event.altKey && !event.shiftKey) {
        event.preventDefault()
        toggleGrid()
      }
      
      // Cycle through grid types with 'Shift + G'
      if (event.key === 'G' || (event.key === 'g' && event.shiftKey)) {
        event.preventDefault()
        const gridTypes: Array<'dots' | 'lines' | 'cross'> = ['dots', 'lines', 'cross']
        const currentIndex = gridTypes.indexOf(gridType)
        const nextIndex = (currentIndex + 1) % gridTypes.length
        handleGridTypeChange(gridTypes[nextIndex])
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleZoomIn, handleZoomOut, toggleGrid, gridType, handleGridTypeChange])
  
  useEffect(() => {
    if (!projectId) {
      router.replace('/dashboard/projects')
    }
  }, [projectId, router])
  
  if (!projectId) return null
  
  return (
    <ReactFlowProvider projectId={projectId}>
      <div className="h-screen">
        <div className="flex flex-col h-screen bg-[#e6efff]">
          <div className="flex-none">
            <Toolbar 
              isGridVisible={isGridVisible}
              toggleGrid={toggleGrid}
              gridType={gridType}
              setGridType={handleGridTypeChange}
            />
          </div>
          
          <div className="flex-grow flex overflow-hidden p-4">
            {/* Left Panel - AI Assistant */}
            <div className={`flex transition-all duration-300 ease-in-out ${
              leftPanelOpen ? 'w-80' : 'w-0'
            }`}>
              {leftPanelOpen && (
                <AIAssistant className="flex-1" />
              )}
            </div>
            
            {/* Left Panel Toggle */}
            <button 
              onClick={toggleLeftPanel}
              className="h-12 self-center flex items-center justify-center bg-white text-[#4263eb] hover:bg-[#4263eb]/10 p-1 rounded-full shadow-sm border border-[#4263eb]/20 transition-all duration-150"
            >
              {leftPanelOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
            
            {/* Main Canvas Area */}
            <div className="flex-1 flex flex-col mx-2">            
              {/* Diagram Canvas */}
              <div className="flex-1 bg-[#f0f5ff] rounded-lg shadow-md overflow-hidden border border-[#4263eb]/20">
                <ReactFlowDiagram 
                  isGridVisible={isGridVisible}
                  gridType={gridType}
                  zoom={zoom}
                  onZoomChange={handleZoomChange}
                />
              </div>
            </div>
            
            {/* Right Panel Toggle */}
            <button 
              onClick={toggleRightPanel}
              className="h-12 self-center flex items-center justify-center bg-white text-[#4263eb] hover:bg-[#4263eb]/10 p-1 rounded-full shadow-sm border border-[#4263eb]/20 transition-all duration-150"
            >
              {rightPanelOpen ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
            
            {/* Right Panel - Notes */}
            <div className={`flex transition-all duration-300 ease-in-out ${
              rightPanelOpen ? 'w-80' : 'w-0'
            }`}>
              {rightPanelOpen && (
                <NotesPanel className="flex-1" />
              )}
            </div>
          </div>
        </div>
      </div>
    </ReactFlowProvider>
  )
} 