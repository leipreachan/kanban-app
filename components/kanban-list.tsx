"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Edit2, Check, X, ChevronUp } from "lucide-react"
import { TaskCard } from "./task-card"
import type { List, Task } from "@/lib/types"

interface KanbanListProps {
  list: List
  onAddTask: (listId: string, title: string, description?: string) => void
  onDeleteTask: (taskId: string) => void
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void
  onDeleteList: (listId: string) => void
  onUpdateListTitle: (listId: string, title: string) => void
  onToggleCollapse: (listId: string) => void
  onDragStart: (e: React.DragEvent, taskId: string) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, listId: string) => void
  onTagClick?: (tag: string) => void
}

export function KanbanList({
  list,
  onAddTask,
  onDeleteTask,
  onUpdateTask,
  onDeleteList,
  onUpdateListTitle,
  onToggleCollapse,
  onDragStart,
  onDragOver,
  onDrop,
  onTagClick,
}: KanbanListProps) {
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskDescription, setNewTaskDescription] = useState("")
  const [listTitle, setListTitle] = useState(list.title)

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      onAddTask(list.id, newTaskTitle, newTaskDescription || undefined)
      setNewTaskTitle("")
      setNewTaskDescription("")
      setIsAddingTask(false)
    }
  }

  const handleSaveTitle = () => {
    if (listTitle.trim()) {
      onUpdateListTitle(list.id, listTitle)
      setIsEditingTitle(false)
    }
  }

  const handleCancelTitle = () => {
    setListTitle(list.title)
    setIsEditingTitle(false)
  }

  return (
    <div className="flex-shrink-0 w-80" onDragOver={onDragOver} onDrop={(e) => onDrop(e, list.id)}>
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2">
            {isEditingTitle ? (
              <div className="flex-1 flex gap-2">
                <Input
                  value={listTitle}
                  onChange={(e) => setListTitle(e.target.value)}
                  className="h-8"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveTitle()
                    if (e.key === "Escape") handleCancelTitle()
                  }}
                />
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleSaveTitle}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleCancelTitle}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <CardTitle className="text-lg flex items-center gap-2">
                  {list.title}
                  <span className="text-sm text-muted-foreground font-normal">({list.tasks.length})</span>
                </CardTitle>
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => onToggleCollapse(list.id)}
                    title="Collapse list"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setIsEditingTitle(true)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onDeleteList(list.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto">
          <div className="space-y-2">
            {list.tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={onDeleteTask}
                onUpdate={onUpdateTask}
                onDragStart={onDragStart}
                onTagClick={onTagClick}
              />
            ))}
          </div>

          {isAddingTask ? (
            <Card className="mt-2 border-dashed">
              <CardContent className="p-4">
                <Input
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Task title"
                  className="mb-2"
                  autoFocus
                />
                <Textarea
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  placeholder="Task description (optional)"
                  rows={3}
                  className="mb-2"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddTask}>
                    Add Task
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setIsAddingTask(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Button variant="ghost" className="w-full mt-2" onClick={() => setIsAddingTask(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
