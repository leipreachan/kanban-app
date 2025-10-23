import type { KanbanData } from "../types"

const STORAGE_KEY = "kanban-data"

export const loadData = (): KanbanData => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      return JSON.parse(data)
    }
  } catch (error) {
    console.error("Error loading data:", error)
  }

  return {
    lists: [
      { id: "1", title: "To Do", order: 0 },
      { id: "2", title: "In Progress", order: 1 },
      { id: "3", title: "Done", order: 2 },
    ],
    tasks: [],
  }
}

export const saveData = (data: KanbanData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error("Error saving data:", error)
  }
}

export const exportData = (): string => {
  const data = loadData()
  return JSON.stringify(data, null, 2)
}

export const importData = (jsonString: string): KanbanData => {
  try {
    const data = JSON.parse(jsonString)
    if (data.lists && data.tasks) {
      saveData(data)
      return data
    }
  } catch (error) {
    console.error("Error importing data:", error)
  }
  throw new Error("Invalid data format")
}
