import { Navigation } from "@/components/navigation"
import { ReportsPage } from "@/components/reports-page"

export default function Reports() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <ReportsPage />
      </main>
    </div>
  )
}
