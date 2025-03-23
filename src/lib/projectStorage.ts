'use client'



// Get all projects
export async function getProjects(): Promise<Project[]> {
  if (typeof window === 'undefined') return []
  
  try {
    const projectsJSON = localStorage.getItem('freeflow_projects')
    if (!projectsJSON) return []
    
    return JSON.parse(projectsJSON)
  } catch (error) {
    console.error('Error getting projects:', error)
    return []
  }
}

// Get project by ID
export async function getProjectById(id: string): Promise<Project | null> {
  try {
    const projects = await getProjects()
    return projects.find(project => project.id === id) || null
  } catch (error) {
    console.error(`Error getting project ${id}:`, error)
    return null
  }
}

// Create new project
export async function createNewProject(name: string, type: 'flowchart' | 'processflow' | 'orgchart' | 'brainstorming'): Promise<Project> {
  try {
    const projects = await getProjects()
    
    const newProject: Project = {
      id: `project_${Date.now()}`,
      name,
      type,
      createdAt: new Date().toISOString(),
      lastEdited: new Date().toISOString(),
      diagramData: {
        nodeDataArray: [],
        linkDataArray: []
      }
    }
    
    const updatedProjects = [...projects, newProject]
    localStorage.setItem('freeflow_projects', JSON.stringify(updatedProjects))
    
    return newProject
  } catch (error) {
    console.error('Error creating project:', error)
    throw new Error('Failed to create project')
  }
}

// Save project
export async function saveProject(id: string, data: Project): Promise<void> {
  try {
    const projects = await getProjects()
    const index = projects.findIndex(p => p.id === id)
    
    if (index === -1) throw new Error(`Project with ID ${id} not found`)
    
    projects[index] = {
      ...data,
      id, // Ensure ID remains unchanged
      lastEdited: new Date().toISOString()
    }
    
    localStorage.setItem('freeflow_projects', JSON.stringify(projects))
  } catch (error) {
    console.error(`Error saving project ${id}:`, error)
    throw new Error('Failed to save project')
  }
}

// Delete project
export async function deleteProject(id: string): Promise<void> {
  try {
    const projects = await getProjects()
    const updatedProjects = projects.filter(p => p.id !== id)
    
    localStorage.setItem('freeflow_projects', JSON.stringify(updatedProjects))
  } catch (error) {
    console.error(`Error deleting project ${id}:`, error)
    throw new Error('Failed to delete project')
  }
}

// Get recent projects (last 5)
export async function getRecentProjects(): Promise<Project[]> {
  const projects = await getProjects()
  return projects
    .sort((a: Project, b: Project) => 
      new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime()
    )
    .slice(0, 5)
} 