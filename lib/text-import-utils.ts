import type { Board, KanbanData } from "./types"

export interface ParsedTextReport {
  dateRange: string
  listTasks: Map<string, string[]>
}

function parseFlexibleDate(dateStr: string): Date | null {
  const trimmed = dateStr.trim()

  // Try various date formats
  const formats = [
    // YYYY/MM/DD or YYYY-MM-DD
    /^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/,
    // DD/MM/YYYY or DD-MM-YYYY
    /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/,
    // MM/DD/YYYY or MM-DD-YYYY (US format)
    /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/,
  ]

  // Try YYYY/MM/DD format
  const match1 = trimmed.match(formats[0])
  if (match1) {
    const [, year, month, day] = match1
    const date = new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day))
    if (!isNaN(date.getTime())) return date
  }

  // Try DD/MM/YYYY format (common in Europe)
  const match2 = trimmed.match(formats[1])
  if (match2) {
    const [, day, month, year] = match2
    // Check if it makes sense as DD/MM/YYYY (day > 12 means it can't be MM/DD)
    const dayNum = Number.parseInt(day)
    const monthNum = Number.parseInt(month)

    if (dayNum > 12) {
      // Definitely DD/MM/YYYY
      const date = new Date(Number.parseInt(year), monthNum - 1, dayNum)
      if (!isNaN(date.getTime())) return date
    } else if (monthNum > 12) {
      // Definitely MM/DD/YYYY
      const date = new Date(Number.parseInt(year), dayNum - 1, monthNum)
      if (!isNaN(date.getTime())) return date
    } else {
      // Ambiguous, try DD/MM/YYYY first (more common internationally)
      const date = new Date(Number.parseInt(year), monthNum - 1, dayNum)
      if (!isNaN(date.getTime())) return date
    }
  }

  // Try parsing with Date constructor (handles formats like "Oct 20, 2025", "October 20, 2025")
  const date = new Date(trimmed)
  if (!isNaN(date.getTime())) return date

  return null
}

function normalizeDateRange(dateRangeStr: string): string {
  // Try to parse and normalize the date range
  const parts = dateRangeStr.split("-").map((s) => s.trim())

  if (parts.length === 2) {
    const startDate = parseFlexibleDate(parts[0])
    const endDate = parseFlexibleDate(parts[1])

    if (startDate && endDate) {
      // Format as DD/MM/YYYY - DD/MM/YYYY
      const format = (d: Date) => {
        const day = d.getDate().toString().padStart(2, "0")
        const month = (d.getMonth() + 1).toString().padStart(2, "0")
        const year = d.getFullYear()
        return `${day}/${month}/${year}`
      }

      return `${format(startDate)} - ${format(endDate)}`
    }
  }

  // If parsing fails, return original string
  return dateRangeStr
}

export function parseTextReport(text: string): ParsedTextReport | null {
  try {
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)

    // Find date range (first non-empty line)
    const dateRange = lines[0] ? normalizeDateRange(lines[0]) : ""

    const listTasks = new Map<string, string[]>()
    let currentList: string | null = null

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];

      // Check if this is a list name (ends with colon)
      if (line.endsWith(":")) {
        currentList = line.slice(0, -1).trim()
        listTasks.set(currentList, [])
      }
      // Check if this is a task (starts with dash)
      else if (line.startsWith("-") && currentList) {
        const taskDescription = line.slice(1).trim()
        if (taskDescription) {
          listTasks.get(currentList)?.push(taskDescription)
        }
      }
    }

    return { dateRange, listTasks }
  } catch (error) {
    console.error("Error parsing text report:", error)
    return null
  }
}

export function importTextReport(text: string, currentData: KanbanData): KanbanData | null {
  const parsed = parseTextReport(text)
  if (!parsed) return null

  const activeBoardId = currentData.activeBoard;

  const newData = {...currentData};
  const currentBoardData = newData.boards.filter(({id}) => id == activeBoardId)[0];

  // Process each list from the parsed report
  parsed.listTasks.forEach((taskDescriptions, listName) => {
    const targetList = currentBoardData.lists.find((list) => list.title.toLowerCase() === listName.toLowerCase())

    console.log(`Target List: ${JSON.stringify(targetList)}`);
    if (!targetList) {
      // List doesn't exist, skip it (as per requirements)
      console.log(`List "${listName}" not found, skipping`);
      return;
    }

    const existingTaskDescriptions = new Set(targetList.tasks.map((task) => task.description.toLowerCase()))

    // Add new tasks that don't already exist
    taskDescriptions.forEach((description) => {
      if (!existingTaskDescriptions.has(description.toLowerCase())) {
        // Create new task
        const newTask = {
          id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          listId: targetList.id,
          description: description,
          tags: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        targetList.tasks.push(newTask);
        console.log(`Added task "${description}" to list "${listName}"`)
      } else {
        console.log(`Task "${description}" already exists in list "${listName}", skipping`)
      }
    });
  })

  console.log(`Imported Data: ${JSON.stringify(newData)}`);

  return newData
}
