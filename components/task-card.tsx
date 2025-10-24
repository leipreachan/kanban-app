"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, GripVertical, Edit2, Check, X, Tag, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import type { Task } from "@/lib/types"
import { extractTagsFromText, getTagColor, getContrastColor } from "@/lib/tag-utils"

interface TaskCardProps {
  task: Task
  onDelete: (taskId: string) => void
  onUpdate: (taskId: string, updates: Partial<Task>) => void
  onDragStart: (e: React.DragEvent, taskId: string) => void
  onTagClick?: (tag: string) => void
}

export function TaskCard({ task, onDelete, onUpdate, onDragStart, onTagClick }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [description, setDescription] = useState(task.description)
  const [tags, setTags] = useState<string[]>(task.tags || [])
  const [newTag, setNewTag] = useState("")
  const [isAddingTag, setIsAddingTag] = useState(false)

  const handleSave = () => {
    const extractedTags = extractTagsFromText(description)
    const allTags = [...new Set([...tags, ...extractedTags])]
    onUpdate(task.id, { description, tags: allTags })
    setIsEditing(false)
    setIsAddingTag(false)
  }

  const handleCancel = () => {
    setDescription(task.description)
    setTags(task.tags || [])
    setIsEditing(false)
    setIsAddingTag(false)
    setNewTag("")
  }

  const handleComplete = () => {
    onUpdate(task.id, {
      completedAt: task.completedAt ? undefined : new Date().toISOString(),
    })
  }

  const handleTaskDragStart = (e: React.DragEvent) => {
    e.stopPropagation()
    onDragStart(e, task.id)
  }

  const handleAddTag = () => {
    const trimmedTag = newTag.trim()
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.stopPropagation()
    if (onTagClick) {
      onTagClick(tag)
    }
  }

  if (isEditing) {
    return (
      <Card variant="task">
        <CardHeader className="p-2 pb-0">
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task description (use #tag for tags)"
            rows={4}
            className="mb-2"
          />
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Tag className="h-4 w-4" />
              <span>Tags (or use #tag in description)</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {tags.map((tag) => {
                const bgColor = getTagColor(tag)
                const textColor = getContrastColor(bgColor)
                return (
                  <Badge key={tag} style={{ backgroundColor: bgColor, color: textColor }} className="gap-1 border-0">
                    {tag}
                    <button onClick={() => handleRemoveTag(tag)} className="ml-1 hover:opacity-70">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )
              })}
              {isAddingTag ? (
                <div className="flex gap-1">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Tag name"
                    className="h-6 w-24 text-xs bg-white"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddTag()
                      }
                      if (e.key === "Escape") {
                        setIsAddingTag(false)
                        setNewTag("")
                      }
                    }}
                  />
                  <Button size="icon" variant="ghost" className="h-6 w-6" onClick={handleAddTag}>
                    <Check className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 px-2 bg-transparent"
                  onClick={() => setIsAddingTag(true)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add tag
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <div className="flex justify-center gap-4">
            <Button size="default" onClick={handleSave}>
              <Check className="h-4 w-4 mr-1" />
              Save
            </Button>
            <Button size="default" variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card variant="task" className="cursor-move transition-shadow" draggable onDragStart={handleTaskDragStart}>
      <CardHeader className="">
        <div className="flex items-start gap-2 flex-1">
          <GripVertical className="h-4 w-4 text-base mt-0.5 shrink-0" />
          <CardDescription className="text-base">{task.description}</CardDescription>
        </div>
      </CardHeader>
      <CardFooter>
        <div className="flex-1 min-w-0">
          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {task.tags.map((tag) => {
                const bgColor = getTagColor(tag)
                const textColor = getContrastColor(bgColor)
                return (
                  <Badge
                    key={tag}
                    style={{ backgroundColor: bgColor, color: textColor }}
                    className="text-xs cursor-pointer hover:opacity-80 transition-opacity border-0"
                    onClick={(e) => handleTagClick(e, tag)}
                  >
                    {tag}
                  </Badge>
                )
              })}
            </div>
          )}
        </div>
      </CardFooter>
      <CardFooter>
        <div className="flex justify-between w-full pl-1 pr-1">
          <div className="text-xs text-muted-foreground w-3/5">Upd: {new Date(task.updatedAt).toLocaleString()}</div>
          <div className="flex w-2/5 justify-around">
            <Button
              size="xs"
              variant="ghost"
              onClick={handleComplete}
              title={task.completedAt ? "Mark as incomplete" : "Mark as complete"}
              className="hover:text-blue-500"
            >
              <Check className={`h-4 w-4 ${task.completedAt ? "text-green-600" : ""}`} />
            </Button>
            <Button size="xs" variant="ghost" onClick={() => setIsEditing(true)} title="Edit" className="hover:text-blue-500">
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button size="xs" variant="ghost" onClick={() => onDelete(task.id)} title="Delete" className="hover:text-red-500">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
