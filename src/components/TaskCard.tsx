"use client"

import { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { Task } from "../types"
import { GripVertical, Trash2, Edit2, CheckCircle2 } from "lucide-react"

interface TaskCardProps {
  task: Task
  onDelete: (taskId: string) => void
  onUpdate: (taskId: string, updates: Partial<Task>) => void
  onMarkComplete: (taskId: string) => void
}

export function TaskCard({ task, onDelete, onUpdate, onMarkComplete }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedDescription, setEditedDescription] = useState(task.description)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleUpdate = () => {
    if (editedDescription.trim()) {
      onUpdate(task.id, { description: editedDescription })
      setIsEditing(false)
    }
  }

  if (isEditing) {
    return (
      <div ref={setNodeRef} style={style} className="bg-secondary border border-border">
        <textarea
          value={editedDescription}
          onChange={(e) => setEditedDescription(e.target.value)}
          className="w-full px-2 py-1 bg-input text-foreground rounded border border-border focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          rows={2}
        />
        <div className="flex gap-2">
          <button
            onClick={handleUpdate}
            className="flex-1 px-2 py-1 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90"
          >
            Save
          </button>
          <button
            onClick={() => {
              setEditedDescription(task.description)
              setIsEditing(false)
            }}
            className="px-2 py-1 bg-muted text-muted-foreground rounded text-sm hover:bg-muted/80"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-secondary border border-border hover:border-primary/50 transition-colors group"
    >
      <div className="flex items-start gap-1">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </button>

        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground mt-1 text-pretty">{task.description}</p>
          {task.completed && (
            <div className="flex items-center gap-1 mt-2 text-xs text-green-500">
              <CheckCircle2 className="w-3 h-3" />
              Completed
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {!task.completed && (
            <button
              onClick={() => onMarkComplete(task.id)}
              className="hover:bg-muted rounded transition-colors"
              title="Mark as complete"
            >
              <CheckCircle2 className="w-4 h-4 text-muted-foreground hover:text-green-500" />
            </button>
          )}
          <button onClick={() => setIsEditing(true)} title="Edit" className="hover:bg-muted rounded transition-colors">
            <Edit2 className="w-4 h-4 text-muted-foreground" />
          </button>
          <button onClick={() => onDelete(task.id)} title="Delete" className="hover:bg-muted rounded transition-colors">
            <Trash2 className="w-4 h-4 text-muted-foreground hover:text-red-500" />
          </button>
        </div>
      </div>
    </div>
  )
}
