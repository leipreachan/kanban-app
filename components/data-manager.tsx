"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, AlertCircle, CheckCircle2, FileJson, FileText } from "lucide-react"
import { useKanban } from "@/hooks/use-kanban"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function DataManager() {
  const { exportDataAsText, exportDataAsJSON, importData, importDataFromJSON } = useKanban()
  const [importStatus, setImportStatus] = useState<"idle" | "success" | "error">("idle")
  const [importMessage, setImportMessage] = useState("")
  const textFileInputRef = useRef<HTMLInputElement>(null)
  const jsonFileInputRef = useRef<HTMLInputElement>(null)

  const handleExportText = () => {
    const textData = exportDataAsText()
    const blob = new Blob([textData], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `kanban-backup-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleExportJSON = () => {
    const jsonData = exportDataAsJSON()
    const blob = new Blob([jsonData], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `kanban-backup-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleImportText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      const success = importData(content)

      if (success) {
        setImportStatus("success")
        setImportMessage("Data imported successfully! The page will reload.")
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      } else {
        setImportStatus("error")
        setImportMessage("Failed to import data. Please check the file format.")
      }

      setTimeout(() => {
        setImportStatus("idle")
        setImportMessage("")
      }, 3000)
    }

    reader.readAsText(file)

    if (textFileInputRef.current) {
      textFileInputRef.current.value = ""
    }
  }

  const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      const success = importDataFromJSON(content)

      if (success) {
        setImportStatus("success")
        setImportMessage("Data imported successfully! The page will reload.")
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      } else {
        setImportStatus("error")
        setImportMessage("Failed to import JSON data. Please check the file format.")
      }

      setTimeout(() => {
        setImportStatus("idle")
        setImportMessage("")
      }, 3000)
    }

    reader.readAsText(file)

    if (jsonFileInputRef.current) {
      jsonFileInputRef.current.value = ""
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Management</CardTitle>
        <CardDescription>Export your data as backup or import from a previous backup</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleExportText} className="flex-1">
              <FileText className="h-4 w-4 mr-2" />
              Export as Text
            </Button>

            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => textFileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Import from Text
            </Button>

            <input ref={textFileInputRef} type="file" accept=".txt" onChange={handleImportText} className="hidden" />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleExportJSON} variant="secondary" className="flex-1">
              <FileJson className="h-4 w-4 mr-2" />
              Export as JSON
            </Button>

            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => jsonFileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Import from JSON
            </Button>

            <input ref={jsonFileInputRef} type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
          </div>
        </div>

        {importStatus !== "idle" && (
          <Alert variant={importStatus === "error" ? "destructive" : "default"}>
            {importStatus === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertDescription>{importMessage}</AlertDescription>
          </Alert>
        )}

        <div className="text-sm text-muted-foreground space-y-1">
          <p>• Text export creates a readable backup of task titles grouped by lists</p>
          <p>• JSON export creates a complete backup with all data (tags, dates, descriptions)</p>
          <p>• Text import adds tasks without deleting existing data</p>
          <p>• JSON import replaces all data with the imported backup</p>
          <p>• All data is stored locally in your browser</p>
        </div>
      </CardContent>
    </Card>
  )
}
