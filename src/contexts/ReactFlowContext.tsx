'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { 
  Node, 
  Edge, 
  NodeChange, 
  EdgeChange, 
  Connection, 
  applyNodeChanges, 
  applyEdgeChanges, 
  addEdge 
} from '@xyflow/react'

interface ReactFlowContextType {
  nodes: Node[]
  edges: Edge[]
  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  onConnect: (connection: Connection) => void
  updateDiagramData: (nodes: Node[], edges: Edge[]) => void
  addNode: (node: Node) => void
  projectId: string | null
}

const defaultContext: ReactFlowContextType = {
  nodes: [],
  edges: [],
  onNodesChange: () => {},
  onEdgesChange: () => {},
  onConnect: () => {},
  updateDiagramData: () => {},
  addNode: () => {},
  projectId: null
}

const ReactFlowContext = createContext<ReactFlowContextType>(defaultContext)

export const useReactFlowContext = () => useContext(ReactFlowContext)

interface ReactFlowProviderProps {
  children: ReactNode
  projectId: string
}

export function ReactFlowProvider({ children, projectId }: ReactFlowProviderProps) {
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds))
    },
    []
  )
  
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((eds) => applyEdgeChanges(changes, eds))
    },
    []
  )
  
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds))
    },
    []
  )
  
  const updateDiagramData = useCallback(
    (newNodes: Node[], newEdges: Edge[]) => {
      setNodes(newNodes)
      setEdges(newEdges)
    },
    []
  )
  
  const addNode = useCallback(
    (node: Node) => {
      setNodes((nds) => [...nds, node])
    },
    []
  )
  
  // Load project data from localStorage or API
  React.useEffect(() => {
    // TODO: Load project data from backend or localStorage
    const loadInitialData = async () => {
      try {
        // Start with an empty canvas
        const initialNodes: Node[] = []
        const initialEdges: Edge[] = []
        
        setNodes(initialNodes)
        setEdges(initialEdges)
      } catch (error) {
        console.error('Error loading project data:', error)
      }
    }
    
    loadInitialData()
  }, [projectId])
  
  const contextValue = {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    updateDiagramData,
    addNode,
    projectId
  }
  
  return (
    <ReactFlowContext.Provider value={contextValue}>
      {children}
    </ReactFlowContext.Provider>
  )
} 