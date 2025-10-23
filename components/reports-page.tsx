"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useKanban } from "@/hooks/use-kanban"
import type { ReportFilters, ReportType } from "@/lib/types"
import {
  filterTasksForReport,
  getPresetDateRange,
  groupTasksByList,
  getTaskStats,
  groupTasksByWeek,
  groupTasksByMonth,
  formatWeekRange,
  formatMonth,
} from "@/lib/report-utils"
import { BarChart3, Calendar, CheckCircle2, Clock, Copy, Check } from "lucide-react"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

export function ReportsPage() {
  const { data } = useKanban()

  const [filters, setFilters] = useState<ReportFilters>({
    type: "weekly",
    ...getPresetDateRange("weekly"),
    includeCompleted: true,
    includeUpdated: true,
  })

  const [excludedLists, setExcludedLists] = useState<Set<string>>(new Set())
  const [copied, setCopied] = useState(false)

  const allTasks = useMemo(() => {
    return data.lists.flatMap((list) => list.tasks)
  }, [data.lists])

  const filteredTasks = useMemo(() => {
    return filterTasksForReport(allTasks, filters)
  }, [allTasks, filters])

  const tasksByList = useMemo(() => {
    return groupTasksByList(filteredTasks)
  }, [filteredTasks])

  const groupedTasks = useMemo(() => {
    if (filters.type === "monthly") {
      return groupTasksByWeek(filteredTasks)
    } else if (filters.type === "yearly") {
      return groupTasksByMonth(filteredTasks)
    }
    return null
  }, [filteredTasks, filters.type])

  const stats = useMemo(() => {
    return getTaskStats(filteredTasks)
  }, [filteredTasks])

  const listChartData = useMemo(() => {
    return Object.entries(tasksByList).map(([listId, tasks]) => {
      const list = data.lists.find((l) => l.id === listId)
      const completed = tasks.filter((t) => t.completedAt).length
      return {
        name: list?.title || "Unknown",
        total: tasks.length,
        completed,
        inProgress: tasks.length - completed,
      }
    })
  }, [tasksByList, data.lists])

  const completionPieData = useMemo(() => {
    return [
      { name: "Completed", value: stats.completed },
      { name: "In Progress", value: stats.inProgress },
    ]
  }, [stats])

  const timelineData = useMemo(() => {
    const dailyStats: Record<string, { date: string; created: number; completed: number }> = {}

    filteredTasks.forEach((task) => {
      const createdDate = new Date(task.createdAt).toISOString().split("T")[0]
      if (!dailyStats[createdDate]) {
        dailyStats[createdDate] = { date: createdDate, created: 0, completed: 0 }
      }
      dailyStats[createdDate].created++

      if (task.completedAt) {
        const completedDate = new Date(task.completedAt).toISOString().split("T")[0]
        if (!dailyStats[completedDate]) {
          dailyStats[completedDate] = { date: completedDate, created: 0, completed: 0 }
        }
        dailyStats[completedDate].completed++
      }
    })

    return Object.values(dailyStats).sort((a, b) => a.date.localeCompare(b.date))
  }, [filteredTasks])

  const textReport = useMemo(() => {
    const startDate = new Date(filters.startDate).toLocaleDateString()
    const endDate = new Date(filters.endDate).toLocaleDateString()

    let report = `${startDate} - ${endDate}\n\n`

    Object.entries(tasksByList).forEach(([listId, tasks]) => {
      // Skip excluded lists
      if (excludedLists.has(listId)) return

      const list = data.lists.find((l) => l.id === listId)
      if (!list) return

      report += `${list.title}:\n`
      tasks.forEach((task) => {
        report += `  - ${task.description}\n`
      })
      report += `\n`
    })

    return report.trim()
  }, [tasksByList, data.lists, filters.startDate, filters.endDate, excludedLists])

  const handleCopyReport = async () => {
    await navigator.clipboard.writeText(textReport)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const toggleListExclusion = (listId: string) => {
    const newExcluded = new Set(excludedLists)
    if (newExcluded.has(listId)) {
      newExcluded.delete(listId)
    } else {
      newExcluded.add(listId)
    }
    setExcludedLists(newExcluded)
  }

  const handlePresetChange = (type: ReportType) => {
    setFilters({
      type,
      ...getPresetDateRange(type),
      includeCompleted: filters.includeCompleted,
      includeUpdated: filters.includeUpdated,
    })
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Reports</h1>
        <p className="text-muted-foreground">Analyze your task activity and completion rates</p>
      </div>

      <div className="grid gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Text Report</CardTitle>
            <CardDescription>Simple text format report for easy sharing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Exclude Lists from Report</Label>
              <div className="flex flex-wrap gap-2">
                {data.lists.map((list) => (
                  <Button
                    key={list.id}
                    variant={excludedLists.has(list.id) ? "outline" : "default"}
                    size="sm"
                    onClick={() => toggleListExclusion(list.id)}
                  >
                    {list.title}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Report Preview</Label>
                <Button variant="outline" size="sm" onClick={handleCopyReport} className="gap-2 bg-transparent">
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy Report
                    </>
                  )}
                </Button>
              </div>
              <div className="bg-muted p-4 rounded-md font-mono text-sm whitespace-pre-wrap max-h-[400px] overflow-y-auto">
                {textReport || "No tasks found for the selected filters"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">In selected period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">{stats.completionRate}% completion rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">Active tasks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Lists</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(tasksByList).length}</div>
            <p className="text-xs text-muted-foreground">Active lists</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Customize your report parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Report Type</Label>
              <div className="flex flex-col gap-2">
                <Button
                  variant={filters.type === "weekly" ? "default" : "outline"}
                  className="w-full"
                  onClick={() => handlePresetChange("weekly")}
                >
                  Weekly
                </Button>
                <Button
                  variant={filters.type === "monthly" ? "default" : "outline"}
                  className="w-full"
                  onClick={() => handlePresetChange("monthly")}
                >
                  Monthly
                </Button>
                <Button
                  variant={filters.type === "yearly" ? "default" : "outline"}
                  className="w-full"
                  onClick={() => handlePresetChange("yearly")}
                >
                  Yearly
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              />
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-completed"
                  checked={filters.includeCompleted}
                  onCheckedChange={(checked) => setFilters({ ...filters, includeCompleted: checked as boolean })}
                />
                <Label htmlFor="include-completed" className="text-sm font-normal cursor-pointer">
                  Include completed tasks
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-updated"
                  checked={filters.includeUpdated}
                  onCheckedChange={(checked) => setFilters({ ...filters, includeUpdated: checked as boolean })}
                />
                <Label htmlFor="include-updated" className="text-sm font-normal cursor-pointer">
                  Include updated tasks
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Completion Status</CardTitle>
            <CardDescription>Overview of task completion</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.total > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={completionPieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {completionPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">No data available</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Tasks by List</CardTitle>
            <CardDescription>Distribution of tasks across lists</CardDescription>
          </CardHeader>
          <CardContent>
            {listChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={listChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" stackId="a" fill={CHART_COLORS[0]} name="Completed" />
                  <Bar dataKey="inProgress" stackId="a" fill={CHART_COLORS[1]} name="In Progress" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">No data available</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Activity Timeline</CardTitle>
            <CardDescription>Task creation and completion over time</CardDescription>
          </CardHeader>
          <CardContent>
            {timelineData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="created" stroke={CHART_COLORS[2]} name="Created" />
                  <Line type="monotone" dataKey="completed" stroke={CHART_COLORS[0]} name="Completed" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">No data available</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Task Details</CardTitle>
            <CardDescription>
              {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""} found
              {filters.type === "monthly" && " (grouped by week)"}
              {filters.type === "yearly" && " (grouped by month)"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {groupedTasks
                ? Object.entries(groupedTasks)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([groupKey, tasks]) => {
                      const groupLabel = filters.type === "monthly" ? formatWeekRange(groupKey) : formatMonth(groupKey)

                      return (
                        <div key={groupKey} className="space-y-3">
                          <div className="flex items-center gap-2 pb-2 border-b">
                            <Calendar className="h-4 w-4 text-primary" />
                            <h3 className="font-semibold text-lg">{groupLabel}</h3>
                            <span className="text-sm text-muted-foreground">({tasks.length} tasks)</span>
                          </div>

                          {/* Group tasks by list within each time period */}
                          {Object.entries(groupTasksByList(tasks)).map(([listId, listTasks]) => {
                            const list = data.lists.find((l) => l.id === listId)
                            if (!list) return null

                            return (
                              <div key={listId} className="ml-4 space-y-2">
                                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                                  {list.title} ({listTasks.length})
                                </h4>
                                <div className="space-y-2">
                                  {listTasks.map((task) => (
                                    <Card key={task.id} className="border-l-4 border-l-primary">
                                      <CardContent className="p-4">
                                        <div className="flex items-start justify-between gap-2">
                                          <div className="flex-1">
                                            <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                                            <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                                              <span>Updated: {new Date(task.updatedAt).toLocaleDateString()}</span>
                                              {task.completedAt && (
                                                <span className="text-green-600">
                                                  Completed: {new Date(task.completedAt).toLocaleDateString()}
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                          {task.completedAt && (
                                            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                                          )}
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )
                    })
                : Object.entries(tasksByList).map(([listId, tasks]) => {
                    const list = data.lists.find((l) => l.id === listId)
                    if (!list) return null

                    return (
                      <div key={listId} className="space-y-2">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                          {list.title} ({tasks.length})
                        </h3>
                        <div className="space-y-2">
                          {tasks.map((task) => (
                            <Card key={task.id} className="border-l-4 border-l-primary">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1">
                                    <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                                      <span>Updated: {new Date(task.updatedAt).toLocaleDateString()}</span>
                                      {task.completedAt && (
                                        <span className="text-green-600">
                                          Completed: {new Date(task.completedAt).toLocaleDateString()}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  {task.completedAt && (
                                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )
                  })}

              {filteredTasks.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No tasks found for the selected filters</p>
                  <p className="text-sm mt-2">Try adjusting your date range or filter options</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
