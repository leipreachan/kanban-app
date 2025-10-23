"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { settings } from "@/lib/storage"

export function BoardLimitSettings() {
  const [boardLimit, setBoardLimit] = useState(5)
  const [inputValue, setInputValue] = useState("5")

  useEffect(() => {
    const limit = settings.getBoardLimit()
    setBoardLimit(limit)
    setInputValue(String(limit))
  }, [])

  const handleSave = () => {
    const newLimit = Number.parseInt(inputValue, 10)
    if (isNaN(newLimit) || newLimit < 1) {
      alert("Please enter a valid number greater than 0")
      return
    }

    settings.setBoardLimit(newLimit)
    setBoardLimit(newLimit)
    alert("Board limit updated successfully!")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Board Limit</CardTitle>
        <CardDescription>Set the maximum number of boards you can create</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="board-limit">Maximum Boards</Label>
          <div className="flex gap-2">
            <Input
              id="board-limit"
              type="number"
              min="1"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="max-w-[200px]"
            />
            <Button onClick={handleSave}>Save</Button>
          </div>
          <p className="text-sm text-muted-foreground">Current limit: {boardLimit} boards</p>
        </div>
      </CardContent>
    </Card>
  )
}
