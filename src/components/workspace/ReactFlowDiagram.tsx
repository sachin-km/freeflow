'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  ReactFlow,
  Controls,
  Background,
  ReactFlowProvider as ReactFlowLibProvider,
  Panel,
  useReactFlow,
  BackgroundVariant,
  Connection,
  SelectionMode,
  DefaultEdgeOptions,
  MarkerType,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import '@/styles/reactflow-custom.css'
import { useReactFlowContext } from '@/contexts/ReactFlowContext'

interface ReactFlowDiagramProps {
  className?: string
  isGridVisible: boolean
  gridType: 'dots' | 'lines' | 'cross'
  zoom: number
  onZoomChange: (zoom: number) => void
}

function DiagramContent({
  isGridVisible,
  gridType,
  zoom,
  onZoomChange
}: ReactFlowDiagramProps) {
  const { 
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange, 
    onConnect 
  } = useReactFlowContext()
  const reactFlowInstance = useReactFlow()
  const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 1 })
  const [interactionEnabled, setInteractionEnabled] = useState(true)
  
  // Set zoom when it changes from outside (e.g., toolbar buttons)
  useEffect(() => {
    if (Math.abs(viewport.zoom - zoom) > 0.001) {
      // Maintain the current viewport position when zooming
      reactFlowInstance.setViewport({ x: viewport.x, y: viewport.y, zoom })
    }
  }, [zoom, reactFlowInstance, viewport])
  
  // Set initial viewport and handle reset
  useEffect(() => {
    // Initialize viewport with proper zoom
    if (reactFlowInstance) {
      // Initial setup
      reactFlowInstance.fitView({ padding: 0.2 })
      
      // Set the zoom after fitting view
      setTimeout(() => {
        const currentViewport = reactFlowInstance.getViewport()
        setViewport(currentViewport)
        onZoomChange(currentViewport.zoom)
      }, 100)
    }
  }, [reactFlowInstance, onZoomChange])
  
  // Handle viewport change from user interactions (pan, zoom)
  const handleViewportChange = useCallback(
    (newViewport: { x: number; y: number; zoom: number }) => {
      setViewport(newViewport)
      
      // Only trigger parent update if zoom actually changed
      if (Math.abs(newViewport.zoom - zoom) > 0.001) {
        // Round to 2 decimal places for UI display
        const roundedZoom = Math.round(newViewport.zoom * 100) / 100
        onZoomChange(roundedZoom)
      }
    },
    [zoom, onZoomChange]
  )
  
  // Track grid changes with more verbose logging
  useEffect(() => {
    console.log('Grid visibility changed:', isGridVisible)
    console.log('Grid type changed:', gridType)
    
    // Log types and values to verify
    console.log('BackgroundVariant type check:', {
      dotsValue: BackgroundVariant.Dots,
      dotsType: typeof BackgroundVariant.Dots,
      linesValue: BackgroundVariant.Lines,
      linesType: typeof BackgroundVariant.Lines,
      crossValue: BackgroundVariant.Cross,
      crossType: typeof BackgroundVariant.Cross
    })
    
    // Add direct verification of the strings used
    console.log('String values check:', {
      dots: 'dots',
      lines: 'lines',
      cross: 'cross'
    })
  }, [isGridVisible, gridType])
  
  // Define direct BackgroundVariant values for each grid type for readability
  const dotsBgVariant = BackgroundVariant.Dots
  const linesBgVariant = BackgroundVariant.Lines
  const crossBgVariant = BackgroundVariant.Cross

  // Add default node and edge styling
  const defaultEdgeOptions: DefaultEdgeOptions = {
    style: {
      strokeWidth: 2,
      stroke: '#4263eb',
    },
    type: 'default',
    markerEnd: {
      type: MarkerType.Arrow,
      color: '#4263eb',
      width: 20,
      height: 20,
    },
  };

  // Custom style for the React Flow pane
  const customStyle = {
    backgroundColor: '#f0f5ff',  // Light blue background for better contrast
  }

  // Handle toggling interaction for the lock feature
  const handleInteractionChange = useCallback((enabled: boolean) => {
    setInteractionEnabled(enabled)
  }, [])

  // Reset viewport to fit all nodes
  const resetView = useCallback(() => {
    if (reactFlowInstance) {
      // First get current nodes to ensure they're all in view
      const nodes = reactFlowInstance.getNodes();
      
      if (nodes.length === 0) {
        // If no nodes, just center the viewport
        reactFlowInstance.setViewport({ x: 0, y: 0, zoom: 1 });
        setViewport({ x: 0, y: 0, zoom: 1 });
        onZoomChange(1);
      } else {
        // If nodes exist, fit view to show them all
        reactFlowInstance.fitView({ 
          padding: 0.2,
          includeHiddenNodes: true,
          minZoom: 0.1,
          maxZoom: 2 
        });
      
        // Update zoom state after reset
        setTimeout(() => {
          const currentViewport = reactFlowInstance.getViewport();
          setViewport(currentViewport);
          onZoomChange(currentViewport.zoom);
        }, 100);
      }
      
      console.log('View reset completed');
    }
  }, [reactFlowInstance, onZoomChange]);

  // Get background props based on grid type
  const getBackgroundProps = () => {
    interface BackgroundProps {
      variant: BackgroundVariant;
      gap: number;
      size: number;
      color: string;
      style: React.CSSProperties;
    }
    
    let props: BackgroundProps;
    
    if (gridType === 'dots') {
      props = {
        variant: BackgroundVariant.Dots,
        gap: 20,
        size: 1.5,
        color: '#5c6ac4',
        style: { opacity: 0.6 }
      };
    } else if (gridType === 'lines') {
      props = {
        variant: BackgroundVariant.Lines,
        gap: 25,
        size: 1.0,
        color: '#4263eb',
        style: { opacity: 0.6 }
      };
    } else { // cross
      props = {
        variant: BackgroundVariant.Cross,
        gap: 25,
        size: 6,
        color: '#4263eb',
        style: { opacity: 0.6 }
      };
    }
    
    console.log('Using background variant:', props.variant);
    return props;
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onViewportChange={handleViewportChange}
      style={customStyle}
      defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      minZoom={0.1}
      maxZoom={2}
      fitView={false}
      fitViewOptions={{ padding: 0.2 }}
      attributionPosition="bottom-right"
      panOnScroll={interactionEnabled}
      zoomOnScroll={interactionEnabled}
      zoomOnPinch={interactionEnabled}
      zoomOnDoubleClick={interactionEnabled}
      selectionOnDrag={interactionEnabled}
      panOnDrag={interactionEnabled}
      nodesDraggable={interactionEnabled}
      nodesConnectable={interactionEnabled}
      elementsSelectable={interactionEnabled}
      selectionMode={SelectionMode.Partial}
      deleteKeyCode="Delete"
      multiSelectionKeyCode="Control"
      proOptions={{ hideAttribution: true }}
      defaultEdgeOptions={defaultEdgeOptions}
    >
      {/* Direct string literals as fallback approach */}
      {isGridVisible && gridType === 'dots' && (
        <Background
          variant={'dots' as any}  // Explicit fallback to string literal
          gap={20}
          size={1.5}
          color="#5c6ac4"
          style={{ opacity: 0.6 }}
          id="dots-background"
        />
      )}
      
      {isGridVisible && gridType === 'lines' && (
        <Background
          variant={'lines' as any}  // Explicit fallback to string literal
          gap={25}
          size={1.0}
          color="#4263eb" 
          style={{ opacity: 0.6 }}
          id="lines-background"
        />
      )}
      
      {isGridVisible && gridType === 'cross' && (
        <Background
          variant={'cross' as any}  // Explicit fallback to string literal
          gap={25}
          size={6}
          color="#4263eb"
          style={{ opacity: 0.6 }}
          id="cross-background"
        />
      )}
      
      <Controls
        position="bottom-right"
        className="react-flow-controls-blue"
        style={{
          transform: 'scale(1.2)',
          margin: '16px'
        }}
        showZoom={true}
        showFitView={true}
        showInteractive={true}
        onFitView={resetView}
        onInteractiveChange={handleInteractionChange}
      />
    </ReactFlow>
  )
}

export default function ReactFlowDiagram(props: ReactFlowDiagramProps) {
  return (
    <ReactFlowLibProvider>
      <div className={`w-full h-full rounded-lg overflow-hidden ${props.className}`}>
        <DiagramContent {...props} />
      </div>
    </ReactFlowLibProvider>
  )
} 