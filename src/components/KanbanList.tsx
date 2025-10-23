"use client"

import { useState } from "react"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { TaskCard } from "./TaskCard"
import type { Task, List } from "../types"
import { Plus, Trash2, Edit2, Check, X } from "lucide-react"

interface KanbanListProps {
  list: List
  tasks: Task[]
  onAddTask: (listId: string, description: string) => void
  onDeleteTask: (taskId: string) => void
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void
  onMarkComplete: (taskId: string) => void
  onDeleteList: (listId: string) => void
  onUpdateTitle: (listId: string, title: string) => void
}

export function KanbanList({
  list,
  tasks,
  onAddTask,
  onDeleteTask,
  onUpdateTask,
  onMarkComplete,
  onDeleteList,
  onUpdateTitle,
}: KanbanListProps) {
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [newTaskDescription, setNewTaskDescription] = useState("")
  const [editedTitle, setEditedTitle] = useState(list.title)

  const { setNodeRef } = useDroppable({
    id: list.id,
  })

  const handleAddTask = () => {
    if (newTaskDescription.trim()) {
      onAddTask(list.id, newTaskDescription)
      setNewTaskDescription("")
      setIsAddingTask(false)
    }
  }

  const handleUpdateTitle = () => {
    if (editedTitle.trim()) {
      onUpdateTitle(list.id, editedTitle)
      setIsEditingTitle(false)
    }
  }

  return (
    <div ref={setNodeRef} className="flex flex-col w-80 flex-shrink-0 bg-card rounded-lg border border-border">
      <div className="flex items-center justify-between p-4 border-b border-border">
        {isEditingTitle ? (
          <div className="flex items-center gap-2 flex-1">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="flex-1 px-2 py-1 bg-input text-foreground rounded border border-border focus:outline-none focus:ring-2 focus:ring-ring"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleUpdateTitle()
                if (e.key === "Escape") {
                  setEditedTitle(list.title)
                  setIsEditingTitle(false)
                }
              }}
            />
            <button onClick={handleUpdateTitle} className="p-1 hover:bg-secondary rounded">
              <Check className="w-4 h-4 text-green-500" />
            </button>
            <button
              onClick={() => {
                setEditedTitle(list.title)
                setIsEditingTitle(false)
              }}
              className="p-1 hover:bg-secondary rounded"
            >
              <X className="w-4 h-4 text-red-500" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">{list.title}</h3>
              <span className="text-sm text-muted-foreground">({tasks.length})</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsEditingTitle(true)}
                className="p-1 hover:bg-secondary rounded transition-colors"
              >
                <Edit2 className="w-4 h-4 text-muted-foreground" />
              </button>
              <button
                onClick={() => onDeleteList(list.id)}
                className="p-1 hover:bg-secondary rounded transition-colors"
              >
                <Trash2 className="w-4 h-4 text-muted-foreground hover:text-red-500" />
              </button>
            </div>
          </>
        )}
      </div>

      <div className="flex-1 p-4 space-y-3 min-h-[200px] max-h-[calc(100vh-300px)] overflow-y-auto">
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={onDeleteTask}
              onUpdate={onUpdateTask}
              onMarkComplete={onMarkComplete}
            />
          ))}
        </SortableContext>
      </div>

      <div className="p-4 border-t border-border">
        {isAddingTask ? (
          <div className="space-y-2">

            <textarea
              placeholder="Description (optional)"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              className="w-full px-3 py-2 bg-input text-foreground rounded border border-border focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              rows={2}
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddTask}
                className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setIsAddingTask(false)
                  setNewTaskDescription("")
                }}
                className="px-3 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingTask(true)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        )}
      </div>
    </div>
  )
}
