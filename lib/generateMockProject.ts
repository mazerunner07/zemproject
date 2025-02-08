export interface Project {
    id: number
    name: string
    image: string
    price: number
  }
  
  export function generateMockProjects(count: number): Project[] {
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `Project ${i + 1}`,
      image: `/placeholder.svg?height=200&width=300&text=Project+${i + 1}`,
      price: Math.floor(Math.random() * 10000) + 1000,
    }))
  }
  
  