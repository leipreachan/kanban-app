"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ChevronDown, Plus, Trash2, Edit2 } from "lucide-react"
import { settings } from "@/lib/storage"
import type { Board } from "@/lib/types"

interface BoardSelectorProps {
  boards: Board[]
  activeBoard: string | null
  onSelectBoard: (boardId: string) => void
  onAddBoard: (name: string) => void
  onDeleteBoard: (boardId: string) => void
  onRenameBoard: (boardId: string, name: string) => void
}

export function BoardSelector({
  boards,
  activeBoard,
  onSelectBoard,
  onAddBoard,
  onDeleteBoard,
  onRenameBoard,
}: BoardSelectorProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const [newBoardName, setNewBoardName] = useState("")
  const [renameBoardId, setRenameBoardId] = useState<string | null>(null)
  const [renameBoardName, setRenameBoardName] = useState("")

  const currentBoard = boards.find((b) => b.id === activeBoard)
  const boardLimit = settings.getBoardLimit()

  const handleAddBoard = () => {
    if (newBoardName.trim()) {
      onAddBoard(newBoardName.trim())
      setNewBoardName("")
      setIsAddDialogOpen(false)
    }
  }

  const handleRenameBoard = () => {
    if (renameBoardId && renameBoardName.trim()) {
      onRenameBoard(renameBoardId, renameBoardName.trim())
      setRenameBoardId(null)
      setRenameBoardName("")
      setIsRenameDialogOpen(false)
    }
  }

  const openRenameDialog = (board: Board) => {
    setRenameBoardId(board.id)
    setRenameBoardName(board.name)
    setIsRenameDialogOpen(true)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2 bg-transparent">
            {currentBoard?.name || "Select Board"}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          {boards.map((board) => (
            <DropdownMenuItem
              key={board.id}
              onClick={() => onSelectBoard(board.id)}
              className="flex items-center justify-between"
            >
              <span className={board.id === activeBoard ? "font-semibold" : ""}>{board.name}</span>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation()
                    openRenameDialog(board)
                  }}
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
                {boards.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (confirm(`Delete board "${board.name}"?`)) {
                        onDeleteBoard(board.id)
                      }
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              if (boards.length >= boardLimit) {
                alert(`You can only create up to ${boardLimit} boards. Change the limit in Settings.`)
                return
              }
              setIsAddDialogOpen(true)
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Board
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Board</DialogTitle>
            <DialogDescription>Enter a name for your new Kanban board.</DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Board name"
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddBoard()
              }
            }}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddBoard}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Board</DialogTitle>
            <DialogDescription>Enter a new name for this board.</DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Board name"
            value={renameBoardName}
            onChange={(e) => setRenameBoardName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleRenameBoard()
              }
            }}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenameDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRenameBoard}>Rename</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
