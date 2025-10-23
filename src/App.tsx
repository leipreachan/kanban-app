"use client"

import { useState } from "react"
import { KanbanBoard } from "./components/KanbanBoard"
import { Reports } from "./components/Reports"
import { DataManager } from "./components/DataManager"
import { LayoutGrid, BarChart3 } from "lucide-react"

type View = "board" | "reports"

function App() {
  const [currentView, setCurrentView] = useState<View>("board")

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold text-foreground">Kanban Board</h1>

          <nav className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView("board")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                currentView === "board"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Board
            </button>
            <button
              onClick={() => setCurrentView("reports")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                currentView === "reports"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Reports
            </button>
          </nav>

          <DataManager />
        </div>
      </header>

      <main className="p-6">{currentView === "board" ? <KanbanBoard /> : <Reports />}</main>
    </div>
  )
}

export default App
