import type { KanbanData } from "./types"

export interface ParsedTextReport {
  dateRange: string
  listTasks: Map<string, string[]>
}

export function parseTextReport(text: string): ParsedTextReport | null {
  try {
    const lines = text.split("\n").map((line) => line.trim())

    // Find date range (first non-empty line)
    const dateRange = lines.find((line) => line.length > 0) || ""

    const listTasks = new Map<string, string[]>()
    let currentList: string | null = null

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i]

      if (!line) continue

      // Check if this is a list name (ends with colon)
      if (line.endsWith(":")) {
        currentList = line.slice(0, -1).trim()
        listTasks.set(currentList, [])
      }
      // Check if this is a task (starts with dash)
      else if (line.startsWith("-") && currentList) {
        const taskTitle = line.slice(1).trim()
        if (taskTitle) {
          listTasks.get(currentList)?.push(taskTitle)
        }
      }
    }

    return { dateRange, listTasks }
  } catch (error) {
    console.error("[v0] Error parsing text report:", error)
    return null
  }
}

export function importTextReport(text: string, currentData: KanbanData): KanbanData | null {
  const parsed = parseTextReport(text)
  if (!parsed) return null

  const newData = { ...currentData }

  // Process each list from the parsed report
  parsed.listTasks.forEach((taskTitles, listName) => {
    // Find the list by name (case-insensitive)
    const targetList = newData.lists.find((list) => list.title.toLowerCase() === listName.toLowerCase())

    if (!targetList) {
      // List doesn't exist, skip it (as per requirements)
      console.log(`[v0] List "${listName}" not found, skipping`)
      return
    }

    // Get existing task titles in this list (case-insensitive for comparison)
    const existingTaskTitles = new Set(targetList.tasks.map((task) => task.title.toLowerCase()))

    // Add new tasks that don't already exist
    taskTitles.forEach((taskTitle) => {
      if (!existingTaskTitles.has(taskTitle.toLowerCase())) {
        // Create new task
        const newTask = {
          id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          listId: targetList.id,
          title: taskTitle,
          description: "",
          tags: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        targetList.tasks.push(newTask)
        console.log(`[v0] Added task "${taskTitle}" to list "${listName}"`)
      } else {
        console.log(`[v0] Task "${taskTitle}" already exists in list "${listName}", skipping`)
      }
    })
  })

  return newData
}
