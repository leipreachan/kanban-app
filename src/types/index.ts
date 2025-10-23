export interface Task {
  id: string
  title: string
  description: string
  created: number
  updated: number
  completed?: number
  listId: string
}

export interface List {
  id: string
  title: string
  order: number
}

export interface KanbanData {
  lists: List[]
  tasks: Task[]
}
