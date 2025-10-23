import type { KanbanData, List, Task, Board } from "./types"

const STORAGE_KEY = "kanban-data"
const SETTINGS_KEY = "kanban-settings"

export const settings = {
  getBoardLimit: (): number => {
    if (typeof window === "undefined") return 5

    const settingsData = localStorage.getItem(SETTINGS_KEY)
    if (!settingsData) return 5

    try {
      const settings = JSON.parse(settingsData)
      return settings.boardLimit || 5
    } catch {
      return 5
    }
  },

  setBoardLimit: (limit: number): void => {
    if (typeof window === "undefined") return
    const settingsData = localStorage.getItem(SETTINGS_KEY)
    let settings = {}

    if (settingsData) {
      try {
        settings = JSON.parse(settingsData)
      } catch {
        settings = {}
      }
    }

    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...settings, boardLimit: limit }))
  },
}

export const storage = {
  getData: (): KanbanData => {
    if (typeof window === "undefined") return { boards: [], activeBoard: null, lists: [] }

    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) {
      return { boards: [], activeBoard: null, lists: [] }
    }

    try {
      const parsed = JSON.parse(data) as KanbanData

      if (!parsed.boards && parsed.lists) {
        const defaultBoard: Board = {
          id: `board-${Date.now()}`,
          name: "Main Board",
          createdAt: new Date().toISOString(),
          lists: parsed.lists,
        }
        return {
          boards: [defaultBoard],
          activeBoard: defaultBoard.id,
          lists: [],
        }
      }

      return parsed
    } catch {
      return { boards: [], activeBoard: null, lists: [] }
    }
  },

  saveData: (data: KanbanData): void => {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  },

  exportDataAsText: (boardId?: string): string => {
    const data = storage.getData()
    const board = boardId
      ? data.boards.find((b) => b.id === boardId)
      : data.boards.find((b) => b.id === data.activeBoard)

    if (!board) return ""

    let minDate: Date | null = null
    let maxDate: Date | null = null

    board.lists.forEach((list) => {
      list.tasks.forEach((task) => {
        const createdDate = new Date(task.createdAt)
        const updatedDate = new Date(task.updatedAt)

        if (!minDate || createdDate < minDate) minDate = createdDate
        if (!minDate || updatedDate < minDate) minDate = updatedDate
        if (!maxDate || createdDate > maxDate) maxDate = createdDate
        if (!maxDate || updatedDate > maxDate) maxDate = updatedDate
      })
    })

    const formatDate = (date: Date) => {
      const day = String(date.getDate()).padStart(2, "0")
      const month = String(date.getMonth() + 1).padStart(2, "0")
      const year = date.getFullYear()
      return `${day}/${month}/${year}`
    }

    const fromDate = minDate ? formatDate(minDate) : formatDate(new Date())
    const toDate = maxDate ? formatDate(maxDate) : formatDate(new Date())

    let report = `${fromDate} - ${toDate}\n`

    board.lists.forEach((list) => {
      if (list.tasks.length > 0) {
        report += `${list.title}:\n`
        list.tasks.forEach((task) => {
          report += `  - ${task.title}\n`
        })
      }
    })

    return report
  },

  exportDataAsJSON: (): string => {
    const data = storage.getData()
    return JSON.stringify(data, null, 2)
  },

  importDataFromJSON: (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString) as KanbanData

      if (!data.boards || !Array.isArray(data.boards)) {
        throw new Error("Invalid data structure")
      }

      storage.saveData(data)
      return true
    } catch {
      return false
    }
  },

  importData: (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString) as KanbanData

      if (!data.boards || !Array.isArray(data.boards)) {
        throw new Error("Invalid data structure")
      }

      storage.saveData(data)
      return true
    } catch {
      return false
    }
  },

  clearData: (): void => {
    if (typeof window === "undefined") return
    localStorage.removeItem(STORAGE_KEY)
  },
}

export const createBoard = (name: string): Board => {
  return {
    id: `board-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    createdAt: new Date().toISOString(),
    lists: [],
  }
}

export const createTask = (listId: string, title: string, description?: string): Task => {
  const now = new Date().toISOString()
  return {
    id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title,
    description,
    tags: [],
    listId,
    createdAt: now,
    updatedAt: now,
  }
}

export const createList = (title: string, order: number): List => {
  return {
    id: `list-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title,
    order,
    tasks: [],
  }
}
