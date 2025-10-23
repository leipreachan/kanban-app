"use client"

import { useState } from "react"
import { exportData, importData } from "../utils/storage"
import { Download, Upload, Database } from "lucide-react"

export function DataManager() {
  const [showMenu, setShowMenu] = useState(false)

  const handleExport = () => {
    const data = exportData()
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `kanban-backup-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setShowMenu(false)
  }

  const handleImport = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "application/json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          try {
            const jsonString = event.target?.result as string
            importData(jsonString)
            alert("Data imported successfully! Please refresh the page.")
            window.location.reload()
          } catch (error) {
            alert("Error importing data. Please check the file format.")
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
    setShowMenu(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
      >
        <Database className="w-4 h-4" />
        Data
      </button>

      {showMenu && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
          <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-20 overflow-hidden">
            <button
              onClick={handleExport}
              className="w-full flex items-center gap-2 px-4 py-3 text-foreground hover:bg-secondary transition-colors"
            >
              <Download className="w-4 h-4" />
              Export Data
            </button>
            <button
              onClick={handleImport}
              className="w-full flex items-center gap-2 px-4 py-3 text-foreground hover:bg-secondary transition-colors border-t border-border"
            >
              <Upload className="w-4 h-4" />
              Import Data
            </button>
          </div>
        </>
      )}
    </div>
  )
}
