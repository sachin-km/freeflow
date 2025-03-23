'use client'

import { useState } from 'react'
import { 
  Save, Undo, Redo, Grid3X3, 
  Download, Share, ChevronDown
} from 'lucide-react'

interface ToolbarProps {
  className?: string
  isGridVisible?: boolean
  toggleGrid?: () => void
  setGridType?: (type: 'dots' | 'lines' | 'cross') => void
  gridType?: 'dots' | 'lines' | 'cross'
}

export default function Toolbar({ 
  className,
  isGridVisible = true,
  toggleGrid,
  setGridType,
  gridType = 'dots'
}: ToolbarProps) {
  const [gridMenuOpen, setGridMenuOpen] = useState(false)
  
  const handleToggleGrid = () => {
    console.log('Grid toggle button clicked, current state:', isGridVisible)
    if (toggleGrid) toggleGrid()
  }
  
  const handleGridTypeChange = (type: 'dots' | 'lines' | 'cross') => {
    console.log('Setting grid type to:', type);
    if (setGridType) {
      setGridType(type);
      // If grid is not visible, make it visible when changing type
      if (!isGridVisible && toggleGrid) {
        console.log('Grid was off, turning it on');
        toggleGrid();
      }
    } else {
      console.error('setGridType function is not available');
    }
    setGridMenuOpen(false);
  }
  
  const getGridTypeLabel = () => {
    switch (gridType) {
      case 'dots': return 'Dots'
      case 'lines': return 'Lines'
      case 'cross': return 'Cross'
      default: return 'Grid'
    }
  }
  
  // Placeholder save function
  const handleSave = () => {
    console.log('Save functionality will be implemented soon')
  }
  
  return (
    <div className={`flex flex-col bg-white border-b border-[#4263eb]/20 shadow-[0_2px_8px_rgba(66,99,235,0.1)] ${className}`}>
      {/* Primary toolbar */}
      <div className="flex items-center justify-between py-3 px-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSave}
            className="p-2 text-[#4263eb] hover:text-[#4263eb] hover:bg-[#4263eb]/10 rounded-lg transition-colors duration-150"
            title="Save"
          >
            <Save size={20} />
          </button>
          <button
            className="p-2 rounded-md text-[#4263eb] hover:bg-[#4263eb]/10 transition-colors"
            title="Undo"
          >
            <Undo size={18} />
          </button>
          <button
            className="p-2 rounded-md text-[#4263eb] hover:bg-[#4263eb]/10 transition-colors"
            title="Redo"
          >
            <Redo size={18} />
          </button>
          <div className="h-6 w-px bg-[#4263eb]/20 mx-2"></div>
          <div className="relative">
            <button
              onClick={handleToggleGrid}
              className={`p-2 rounded-lg transition-colors duration-150 mr-1 ${
                isGridVisible 
                  ? 'text-[#4263eb] bg-[#4263eb]/20 border-l-2 border-[#4263eb]' 
                  : 'text-[#4263eb] hover:text-[#4263eb] hover:bg-[#4263eb]/10'
              }`}
              title={isGridVisible ? `Grid: ${getGridTypeLabel()}` : "Show Grid"}
            >
              <Grid3X3 size={20} />
            </button>
            <button
              onClick={() => setGridMenuOpen(!gridMenuOpen)}
              className={`p-1 text-[#4263eb] hover:bg-[#4263eb]/10 rounded transition-colors duration-150 ${
                gridMenuOpen ? 'bg-[#4263eb]/20' : ''
              }`}
              title="Grid Options"
            >
              <ChevronDown size={16} />
            </button>
            {gridMenuOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-md border border-[#4263eb]/20 z-10 w-32">
                <button
                  onClick={() => handleGridTypeChange('dots')}
                  className={`w-full text-left px-3 py-2 text-sm ${gridType === 'dots' ? 'bg-[#4263eb]/20 font-medium text-[#4263eb]' : 'text-[#4A4A4A] hover:bg-[#4263eb]/5'}`}
                >
                  Dots
                </button>
                <button
                  onClick={() => handleGridTypeChange('lines')}
                  className={`w-full text-left px-3 py-2 text-sm ${gridType === 'lines' ? 'bg-[#4263eb]/20 font-medium text-[#4263eb]' : 'text-[#4A4A4A] hover:bg-[#4263eb]/5'}`}
                >
                  Lines
                </button>
                <button
                  onClick={() => handleGridTypeChange('cross')}
                  className={`w-full text-left px-3 py-2 text-sm ${gridType === 'cross' ? 'bg-[#4263eb]/20 font-medium text-[#4263eb]' : 'text-[#4A4A4A] hover:bg-[#4263eb]/5'}`}
                >
                  Cross
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            className="p-2 text-[#4263eb] hover:text-[#4263eb] hover:bg-[#4263eb]/10 rounded-lg transition-colors duration-150"
            title="Export"
          >
            <Download size={20} />
          </button>
          <button
            className="p-2 text-[#4263eb] hover:text-[#4263eb] hover:bg-[#4263eb]/10 rounded-lg transition-colors duration-150"
            title="Share"
          >
            <Share size={20} />
          </button>
        </div>
      </div>
    </div>
  )
} 