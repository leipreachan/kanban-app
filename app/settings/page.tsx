import { Navigation } from "@/components/navigation"
import { DataManager } from "@/components/data-manager"
import { BoardLimitSettings } from "@/components/board-limit-settings"

export default function Settings() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 p-6">
        <div className="container mx-auto max-w-2xl space-y-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-muted-foreground">Manage your application data and preferences</p>
          </div>
          <BoardLimitSettings />
          <DataManager />
        </div>
      </main>
    </div>
  )
}
