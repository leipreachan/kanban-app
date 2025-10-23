"use client"

import { useState, useEffect, useMemo } from "react"
import { loadData } from "../utils/storage"
import type { Task } from "../types"
import { Calendar, TrendingUp } from "lucide-react"

type ReportType = "weekly" | "monthly" | "yearly"
type ReportMode = "updated" | "completed"

export function Reports() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [reportType, setReportType] = useState<ReportType>("weekly")
  const [reportMode, setReportMode] = useState<ReportMode>("updated")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  useEffect(() => {
    const data = loadData()
    setTasks(data.tasks)

    // Set default date range based on report type
    const now = new Date()
    const end = now.toISOString().split("T")[0]
    const start = new Date()

    if (reportType === "weekly") {
      start.setDate(now.getDate() - 7)
    } else if (reportType === "monthly") {
      start.setMonth(now.getMonth() - 1)
    } else {
      start.setFullYear(now.getFullYear() - 1)
    }

    setStartDate(start.toISOString().split("T")[0])
    setEndDate(end)
  }, [reportType])

  const filteredTasks = useMemo(() => {
    if (!startDate || !endDate) return []

    const start = new Date(startDate).getTime()
    const end = new Date(endDate).getTime() + 86400000 // Add 1 day to include end date

    return tasks.filter((task) => {
      if (reportMode === "completed") {
        return task.completed && task.completed >= start && task.completed < end
      } else {
        return task.updated >= start && task.updated < end
      }
    })
  }, [tasks, startDate, endDate, reportMode])

  const stats = useMemo(() => {
    const total = filteredTasks.length
    const completed = filteredTasks.filter((t) => t.completed).length
    const updated = filteredTasks.filter((t) => !t.completed).length

    return { total, completed, updated }
  }, [filteredTasks])

  const tasksByDate = useMemo(() => {
    const grouped: Record<string, Task[]> = {}

    filteredTasks.forEach((task) => {
      const timestamp = reportMode === "completed" ? task.completed! : task.updated
      const date = new Date(timestamp).toLocaleDateString()

      if (!grouped[date]) {
        grouped[date] = []
      }
      grouped[date].push(task)
    })

    return Object.entries(grouped).sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
  }, [filteredTasks, reportMode])

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6">Task Reports</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as ReportType)}
              className="w-full px-3 py-2 bg-input text-foreground rounded border border-border focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Report Mode</label>
            <select
              value={reportMode}
              onChange={(e) => setReportMode(e.target.value as ReportMode)}
              className="w-full px-3 py-2 bg-input text-foreground rounded border border-border focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="updated">Updated Tasks</option>
              <option value="completed">Completed Tasks</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 bg-input text-foreground rounded border border-border focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 bg-input text-foreground rounded border border-border focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-secondary p-4 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
                <p className="text-3xl font-bold text-foreground mt-1">{stats.total}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
          </div>

          <div className="bg-secondary p-4 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold text-green-500 mt-1">{stats.completed}</p>
              </div>
              <Calendar className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-secondary p-4 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Updated</p>
                <p className="text-3xl font-bold text-accent mt-1">{stats.updated}</p>
              </div>
              <Calendar className="w-8 h-8 text-accent" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-xl font-semibold text-foreground mb-4">
          {reportMode === "completed" ? "Completed" : "Updated"} Tasks by Date
        </h3>

        {tasksByDate.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No tasks found for the selected date range</p>
        ) : (
          <div className="space-y-6">
            {tasksByDate.map(([date, dateTasks]) => (
              <div key={date}>
                <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {date}
                  <span className="text-sm text-muted-foreground">({dateTasks.length} tasks)</span>
                </h4>
                <div className="space-y-2 pl-6">
                  {dateTasks.map((task) => (
                    <div key={task.id} className="bg-secondary p-3 rounded border border-border">
                      <h5 className="font-medium text-foreground">{task.title}</h5>
                      {task.description && <p className="text-sm text-muted-foreground mt-1">{task.description}</p>}
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>Created: {new Date(task.created).toLocaleString()}</span>
                        <span>Updated: {new Date(task.updated).toLocaleString()}</span>
                        {task.completed && (
                          <span className="text-green-500">Completed: {new Date(task.completed).toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
