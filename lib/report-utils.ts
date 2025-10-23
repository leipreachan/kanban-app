import type { Task, ReportFilters } from "./types"

export function filterTasksForReport(tasks: Task[], filters: ReportFilters): Task[] {
  const startDate = new Date(filters.startDate)
  const endDate = new Date(filters.endDate)
  endDate.setHours(23, 59, 59, 999) // Include the entire end date

  return tasks.filter((task) => {
    const updatedDate = new Date(task.updatedAt)
    const completedDate = task.completedAt ? new Date(task.completedAt) : null

    // Check if task is within date range
    const isInDateRange = updatedDate >= startDate && updatedDate <= endDate

    if (!isInDateRange) return false

    // Filter by completion status
    if (filters.includeCompleted && completedDate && completedDate >= startDate && completedDate <= endDate) {
      return true
    }

    // Filter by update status (moved between lists)
    if (filters.includeUpdated) {
      return true
    }

    return false
  })
}

export function getPresetDateRange(type: "weekly" | "monthly" | "yearly"): { startDate: string; endDate: string } {
  const now = new Date()
  const endDate = now.toISOString().split("T")[0]

  let startDate: Date

  switch (type) {
    case "weekly":
      startDate = new Date(now)
      startDate.setDate(now.getDate() - 7)
      break
    case "monthly":
      startDate = new Date(now)
      startDate.setMonth(now.getMonth() - 1)
      break
    case "yearly":
      startDate = new Date(now)
      startDate.setFullYear(now.getFullYear() - 1)
      break
  }

  return {
    startDate: startDate.toISOString().split("T")[0],
    endDate,
  }
}

export function groupTasksByList(tasks: Task[]): Record<string, Task[]> {
  return tasks.reduce(
    (acc, task) => {
      if (!acc[task.listId]) {
        acc[task.listId] = []
      }
      acc[task.listId].push(task)
      return acc
    },
    {} as Record<string, Task[]>,
  )
}

export function groupTasksByWeek(tasks: Task[]): Record<string, Task[]> {
  return tasks.reduce(
    (acc, task) => {
      const date = new Date(task.updatedAt)
      const weekStart = getWeekStart(date)
      const weekKey = weekStart.toISOString().split("T")[0]

      if (!acc[weekKey]) {
        acc[weekKey] = []
      }
      acc[weekKey].push(task)
      return acc
    },
    {} as Record<string, Task[]>,
  )
}

export function groupTasksByMonth(tasks: Task[]): Record<string, Task[]> {
  return tasks.reduce(
    (acc, task) => {
      const date = new Date(task.updatedAt)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

      if (!acc[monthKey]) {
        acc[monthKey] = []
      }
      acc[monthKey].push(task)
      return acc
    },
    {} as Record<string, Task[]>,
  )
}

function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
  return new Date(d.setDate(diff))
}

export function formatWeekRange(weekStartStr: string): string {
  const weekStart = new Date(weekStartStr)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)

  return `${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`
}

export function formatMonth(monthKey: string): string {
  const [year, month] = monthKey.split("-")
  const date = new Date(Number.parseInt(year), Number.parseInt(month) - 1)
  return date.toLocaleDateString(undefined, { year: "numeric", month: "long" })
}

export function getTaskStats(tasks: Task[]) {
  const completed = tasks.filter((t) => t.completedAt).length
  const total = tasks.length

  return {
    total,
    completed,
    inProgress: total - completed,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
  }
}
