"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
      <Card className="mb-2">
        <CardHeader className="p-4">
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task description (use #tag for tags)"
            rows={3}
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
                    className="h-6 w-24 text-xs"
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
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave}>
              <Check className="h-4 w-4 mr-1" />
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="cursor-move hover:shadow-md transition-shadow" draggable onDragStart={handleTaskDragStart}>
      <CardHeader className="">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 flex-1">
            <GripVertical className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <CardDescription className="mt-1 text-sm">{task.description}</CardDescription>
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
          </div>
          <div className="flex gap-1 shrink-0">
            <Button
              size="icon"
              variant="ghost"
              onClick={handleComplete}
              title={task.completedAt ? "Mark as incomplete" : "Mark as complete"}
            >
              <Check className={`h-4 w-4 ${task.completedAt ? "text-green-600" : ""}`} />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => setIsEditing(true)}>
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => onDelete(task.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-2">Updated: {new Date(task.updatedAt).toLocaleString()}</div>
      </CardHeader>
    </Card>
  )
}
