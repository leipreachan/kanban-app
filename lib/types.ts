export interface Task {
  id: string
  title: string
  description?: string
  tags: string[]
  createdAt: string
  updatedAt: string
  completedAt?: string
  listId: string
}

export interface List {
  id: string
  title: string
  order: number
  collapsed?: boolean
  tasks: Task[]
}

export interface Board {
  id: string
  name: string
  createdAt: string
  lists: List[]
}

export interface KanbanData {
  boards: Board[]
  activeBoard: string | null
  lists: List[] // deprecated, kept for backward compatibility
}

export type ReportType = "weekly" | "monthly" | "yearly"

export interface ReportFilters {
  type: ReportType
  startDate: string
  endDate: string
  includeCompleted: boolean
  includeUpdated: boolean
}
