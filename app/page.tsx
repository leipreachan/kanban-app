import { Navigation } from "@/components/navigation"
import { KanbanBoard } from "@/components/kanban-board"

export default function Home() {
  return (
    <div className="h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 overflow-hidden">
        <KanbanBoard />
      </main>
    </div>
  )
}
