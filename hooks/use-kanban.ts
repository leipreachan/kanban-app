"use client"

import { useState, useEffect, useCallback } from "react"
import type { KanbanData, Task } from "@/lib/types"
import { storage, createTask, createList, createBoard } from "@/lib/storage"

export function useKanban() {
  const [data, setData] = useState<KanbanData>({ boards: [], activeBoard: null, lists: [] })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadedData = storage.getData()

    if (loadedData.boards.length === 0) {
      const defaultBoard = createBoard("Main Board")
      const initialData = {
        boards: [defaultBoard],
        activeBoard: defaultBoard.id,
        lists: [],
      }
      storage.saveData(initialData)
      setData(initialData)
    } else {
      setData(loadedData)
    }

    setIsLoading(false)
  }, [])

  const saveData = useCallback((newData: KanbanData) => {
    setData(newData)
    storage.saveData(newData)
  }, [])

  const addBoard = useCallback(
    (name: string) => {
      const newBoard = createBoard(name)
      const newData = {
        ...data,
        boards: [...data.boards, newBoard],
        activeBoard: data.activeBoard || newBoard.id,
      }
      saveData(newData)
    },
    [data, saveData],
  )

  const deleteBoard = useCallback(
    (boardId: string) => {
      const newBoards = data.boards.filter((board) => board.id !== boardId)
      const newData = {
        ...data,
        boards: newBoards,
        activeBoard: data.activeBoard === boardId ? newBoards[0]?.id || null : data.activeBoard,
      }
      saveData(newData)
    },
    [data, saveData],
  )

  const updateBoardName = useCallback(
    (boardId: string, name: string) => {
      const newData = {
        ...data,
        boards: data.boards.map((board) => (board.id === boardId ? { ...board, name } : board)),
      }
      saveData(newData)
    },
    [data, saveData],
  )

  const setActiveBoard = useCallback(
    (boardId: string) => {
      const newData = {
        ...data,
        activeBoard: boardId,
      }
      saveData(newData)
    },
    [data, saveData],
  )

  const addList = useCallback(
    (title: string) => {
      if (!data.activeBoard) return

      const newData = {
        ...data,
        boards: data.boards.map((board) => {
          if (board.id === data.activeBoard) {
            const newList = createList(title, board.lists.length)
            return {
              ...board,
              lists: [...board.lists, newList],
            }
          }
          return board
        }),
      }
      saveData(newData)
    },
    [data, saveData],
  )

  const deleteList = useCallback(
    (listId: string) => {
      if (!data.activeBoard) return

      const newData = {
        ...data,
        boards: data.boards.map((board) => {
          if (board.id === data.activeBoard) {
            return {
              ...board,
              lists: board.lists.filter((list) => list.id !== listId),
            }
          }
          return board
        }),
      }
      saveData(newData)
    },
    [data, saveData],
  )

  const updateListTitle = useCallback(
    (listId: string, title: string) => {
      if (!data.activeBoard) return

      const newData = {
        ...data,
        boards: data.boards.map((board) => {
          if (board.id === data.activeBoard) {
            return {
              ...board,
              lists: board.lists.map((list) => (list.id === listId ? { ...list, title } : list)),
            }
          }
          return board
        }),
      }
      saveData(newData)
    },
    [data, saveData],
  )

  const toggleListCollapse = useCallback(
    (listId: string) => {
      if (!data.activeBoard) return

      const newData = {
        ...data,
        boards: data.boards.map((board) => {
          if (board.id === data.activeBoard) {
            return {
              ...board,
              lists: board.lists.map((list) => (list.id === listId ? { ...list, collapsed: !list.collapsed } : list)),
            }
          }
          return board
        }),
      }
      saveData(newData)
    },
    [data, saveData],
  )

  const reorderLists = useCallback(
    (sourceIndex: number, destinationIndex: number) => {
      if (!data.activeBoard) return

      const newData = {
        ...data,
        boards: data.boards.map((board) => {
          if (board.id === data.activeBoard) {
            const newLists = [...board.lists]
            const [removed] = newLists.splice(sourceIndex, 1)
            newLists.splice(destinationIndex, 0, removed)

            const reorderedLists = newLists.map((list, index) => ({
              ...list,
              order: index,
            }))

            return {
              ...board,
              lists: reorderedLists,
            }
          }
          return board
        }),
      }
      saveData(newData)
    },
    [data, saveData],
  )

  const addTask = useCallback(
    (listId: string, description: string) => {
      if (!data.activeBoard) return

      const newTask = createTask(listId, description)
      const newData = {
        ...data,
        boards: data.boards.map((board) => {
          if (board.id === data.activeBoard) {
            return {
              ...board,
              lists: board.lists.map((list) =>
                list.id === listId ? { ...list, tasks: [...list.tasks, newTask] } : list,
              ),
            }
          }
          return board
        }),
      }
      saveData(newData)
    },
    [data, saveData],
  )

  const deleteTask = useCallback(
    (taskId: string) => {
      if (!data.activeBoard) return

      const newData = {
        ...data,
        boards: data.boards.map((board) => {
          if (board.id === data.activeBoard) {
            return {
              ...board,
              lists: board.lists.map((list) => ({
                ...list,
                tasks: list.tasks.filter((task) => task.id !== taskId),
              })),
            }
          }
          return board
        }),
      }
      saveData(newData)
    },
    [data, saveData],
  )

  const updateTask = useCallback(
    (taskId: string, updates: Partial<Task>) => {
      if (!data.activeBoard) return

      const newData = {
        ...data,
        boards: data.boards.map((board) => {
          if (board.id === data.activeBoard) {
            return {
              ...board,
              lists: board.lists.map((list) => ({
                ...list,
                tasks: list.tasks.map((task) =>
                  task.id === taskId ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task,
                ),
              })),
            }
          }
          return board
        }),
      }
      saveData(newData)
    },
    [data, saveData],
  )

  const moveTask = useCallback(
    (taskId: string, targetListId: string) => {
      if (!data.activeBoard) return

      let taskToMove: Task | null = null

      const newData = {
        ...data,
        boards: data.boards.map((board) => {
          if (board.id === data.activeBoard) {
            // Find and remove the task from its current list
            const listsWithoutTask = board.lists.map((list) => ({
              ...list,
              tasks: list.tasks.filter((task) => {
                if (task.id === taskId) {
                  taskToMove = task
                  return false
                }
                return true
              }),
            }))

            if (!taskToMove) return board

            // Update the task with new listId and timestamp
            const updatedTask = {
              ...taskToMove,
              listId: targetListId,
              updatedAt: new Date().toISOString(),
            }

            // Add the task to the target list
            return {
              ...board,
              lists: listsWithoutTask.map((list) =>
                list.id === targetListId ? { ...list, tasks: [...list.tasks, updatedTask] } : list,
              ),
            }
          }
          return board
        }),
      }

      saveData(newData)
    },
    [data, saveData],
  )

  const exportDataAsText = useCallback(() => {
    return storage.exportDataAsText(data.activeBoard || undefined)
  }, [data.activeBoard])

  const exportDataAsJSON = useCallback(() => {
    return storage.exportDataAsJSON()
  }, [])

  const importDataFromJSON = useCallback((jsonString: string) => {
    const success = storage.importDataFromJSON(jsonString)
    if (success) {
      const loadedData = storage.getData()
      setData(loadedData)
    }
    return success
  }, [])

  const exportData = useCallback(() => {
    return storage.exportDataAsText(data.activeBoard || undefined)
  }, [data.activeBoard])

  const importData = useCallback((jsonString: string) => {
    const success = storage.importData(jsonString)
    if (success) {
      const loadedData = storage.getData()
      setData(loadedData)
    }
    return success
  }, [])

  const activeBoard = data.boards.find((board) => board.id === data.activeBoard)

  return {
    data: activeBoard ? { lists: activeBoard.lists } : { lists: [] },
    boards: data.boards,
    activeBoard: data.activeBoard,
    isLoading,
    addBoard,
    deleteBoard,
    updateBoardName,
    setActiveBoard,
    addList,
    deleteList,
    updateListTitle,
    toggleListCollapse,
    reorderLists,
    addTask,
    deleteTask,
    updateTask,
    moveTask,
    exportData,
    importData,
    exportDataAsText,
    exportDataAsJSON,
    importDataFromJSON,
  }
}
