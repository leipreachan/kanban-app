"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

interface AddListButtonProps {
  onAdd: (title: string) => void
}

export function AddListButton({ onAdd }: AddListButtonProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [title, setTitle] = useState("")

  const handleAdd = () => {
    if (title.trim()) {
      onAdd(title)
      setTitle("")
      setIsAdding(false)
    }
  }

  if (isAdding) {
    return (
      <div className="w-80 flex-shrink-0 bg-card rounded-lg border border-border p-2">
        <input
          type="text"
          placeholder="List title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 bg-input text-foreground rounded border border-border focus:outline-none focus:ring-2 focus:ring-ring mb-2"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAdd()
            if (e.key === "Escape") {
              setIsAdding(false)
              setTitle("")
            }
          }}
        />
        <div className="flex gap-2">
          <button
            onClick={handleAdd}
            className="flex-1 px-3 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
          >
            Add List
          </button>
          <button
            onClick={() => {
              setIsAdding(false)
              setTitle("")
            }}
            className="px-3 py-1 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setIsAdding(true)}
      className="w-80 flex-shrink-0 h-fit bg-card/50 rounded-lg border-2 border-dashed border-border hover:border-primary/50 hover:bg-card transition-colors p-4 flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
    >
      <Plus className="w-5 h-5" />
      Add List
    </button>
  )
}
