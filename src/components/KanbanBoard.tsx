"use client"

import { useState, useEffect } from "react"
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable"
import { KanbanList } from "./KanbanList"
import { TaskCard } from "./TaskCard"
import { AddListButton } from "./AddListButton"
import { loadData, saveData } from "../utils/storage"
import type { Task, List } from "../types"

export function KanbanBoard() {
  const [lists, setLists] = useState<List[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

  useEffect(() => {
    const data = loadData()
    setLists(data.lists)
    setTasks(data.tasks)
  }, [])

  useEffect(() => {
    saveData({ lists, tasks })
  }, [lists, tasks])

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id)
    if (task) {
      setActiveTask(task)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null)

    const { active, over } = event
    if (!over) return

    const taskId = active.id as string
    const overId = over.id as string

    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    // Check if dropped on a list
    const targetList = lists.find((l) => l.id === overId)
    if (targetList && task.listId !== targetList.id) {
      setTasks(tasks.map((t) => (t.id === taskId ? { ...t, listId: targetList.id, updated: Date.now() } : t)))
    }
  }

  const addList = (title: string) => {
    const newList: List = {
      id: Date.now().toString(),
      title,
      order: lists.length,
    }
    setLists([...lists, newList])
  }

  const deleteList = (listId: string) => {
    setLists(lists.filter((l) => l.id !== listId))
    setTasks(tasks.filter((t) => t.listId !== listId))
  }

  const updateListTitle = (listId: string, title: string) => {
    setLists(lists.map((l) => (l.id === listId ? { ...l, title } : l)))
  }

  const addTask = (listId: string, title: string, description: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      created: Date.now(),
      updated: Date.now(),
      listId,
    }
    setTasks([...tasks, newTask])
  }

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((t) => t.id !== taskId))
  }

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, ...updates, updated: Date.now() } : t)))
  }

  const markTaskComplete = (taskId: string) => {
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, completed: Date.now(), updated: Date.now() } : t)))
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-1">
        <SortableContext items={lists.map((l) => l.id)} strategy={horizontalListSortingStrategy}>
          {lists.map((list) => (
            <KanbanList
              key={list.id}
              list={list}
              tasks={tasks.filter((t) => t.listId === list.id)}
              onAddTask={addTask}
              onDeleteTask={deleteTask}
              onUpdateTask={updateTask}
              onMarkComplete={markTaskComplete}
              onDeleteList={deleteList}
              onUpdateTitle={updateListTitle}
            />
          ))}
        </SortableContext>

        <AddListButton onAdd={addList} />
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="rotate-3 opacity-80">
            <TaskCard task={activeTask} onDelete={() => {}} onUpdate={() => {}} onMarkComplete={() => {}} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
