"use client";

import type React from "react";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, Filter } from "lucide-react";
import { KanbanList } from "./kanban-list";
import { useKanban } from "@/hooks/use-kanban";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getTagColor, getContrastColor } from "@/lib/tag-utils";

export function KanbanBoard() {
  const {
    data,
    isLoading,
    addList,
    deleteList,
    updateListTitle,
    toggleListCollapse,
    reorderLists,
    addTask,
    deleteTask,
    updateTask,
    moveTask,
  } = useKanban();

  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [draggedListIndex, setDraggedListIndex] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTagFilter, setShowTagFilter] = useState(false);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    data.lists.forEach((list) => {
      list.tasks.forEach((task) => {
        task.tags?.forEach((tag) => tagSet.add(tag));
      });
    });
    return Array.from(tagSet).sort();
  }, [data.lists]);

  const filteredData = useMemo(() => {
    if (selectedTags.length === 0) return data;

    return {
      ...data,
      lists: data.lists.map((list) => ({
        ...list,
        tasks: list.tasks.filter((task) =>
          selectedTags.every((selectedTag) => task.tags?.includes(selectedTag))
        ),
      })),
    };
  }, [data, selectedTags]);

  const handleAddList = () => {
    if (newListTitle.trim()) {
      addList(newListTitle);
      setNewListTitle("");
      setIsAddingList(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("type", "task");
    e.dataTransfer.setData("taskId", taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetListId: string) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("type");
    if (type === "task" && draggedTaskId) {
      moveTask(draggedTaskId, targetListId);
      setDraggedTaskId(null);
    }
  };

  const handleListDragStart = (e: React.DragEvent, index: number) => {
    setDraggedListIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("type", "list");
    e.dataTransfer.setData("listIndex", index.toString());
  };

  const handleListDragOver = (e: React.DragEvent, index: number) => {
    const type = e.dataTransfer.types.includes("type")
      ? e.dataTransfer.getData("type")
      : null;
    if (type !== "list") return;

    e.preventDefault();
    if (draggedListIndex === null || draggedListIndex === index) return;

    e.dataTransfer.dropEffect = "move";
  };

  const handleListDrop = (e: React.DragEvent, dropIndex: number) => {
    const type = e.dataTransfer.getData("type");
    if (
      type === "list" &&
      draggedListIndex !== null &&
      draggedListIndex !== dropIndex
    ) {
      e.preventDefault();
      e.stopPropagation();
      reorderLists(draggedListIndex, dropIndex);
      setDraggedListIndex(null);
    }
  };

  const toggleTagFilter = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearTagFilters = () => {
    setSelectedTags([]);
  };

  const handleTagClick = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setShowTagFilter(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const collapsedLists = filteredData.lists.filter((list) => list.collapsed);
  const expandedLists = filteredData.lists.filter((list) => !list.collapsed);

  return (
    <div className="h-full flex flex-col">
      <div className="px-2 pt-1 pb-1 border-b flex-shrink-0">
        <div className="flex items-center gap-2 mb-2">
          {collapsedLists.length > 0 && (
            <div className="">
              {collapsedLists.map((list) => (
                <Button
                  key={list.id}
                  variant="outline"
                  size="sm"
                  onClick={() => toggleListCollapse(list.id)}
                  className="h-auto py-2 px-3"
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{list.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {list.tasks.length}{" "}
                      {list.tasks.length == 1 ? "task" : "tasks"}
                    </span>
                  </div>
                </Button>
              ))}
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTagFilter(!showTagFilter)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filter by tags
            {selectedTags.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {selectedTags.length}
              </Badge>
            )}
          </Button>
          {selectedTags.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearTagFilters}>
              Clear filters
            </Button>
          )}
        </div>

        {showTagFilter && allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-md">
            {allTags.map((tag) => {
              const bgColor = getTagColor(tag);
              const textColor = getContrastColor(bgColor);
              const isSelected = selectedTags.includes(tag);
              return (
                <Badge
                  key={tag}
                  style={
                    isSelected
                      ? { backgroundColor: bgColor, color: textColor }
                      : {
                          backgroundColor: "transparent",
                          color: bgColor,
                          borderColor: bgColor,
                        }
                  }
                  className="cursor-pointer hover:opacity-80 transition-opacity border-2"
                  onClick={() => toggleTagFilter(tag)}
                >
                  {tag}
                </Badge>
              );
            })}
          </div>
        )}

        {showTagFilter && allTags.length === 0 && (
          <div className="p-3 bg-muted/50 rounded-md text-sm text-muted-foreground">
            No tags found. Add tags to your tasks to filter them.
          </div>
        )}
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-scroll">
        <div className="flex gap-4 p-6 h-full">
          {expandedLists.map((list, index) => {
            const originalIndex = data.lists.findIndex((l) => l.id === list.id);
            return (
              <div
                key={list.id}
                draggable
                onDragStart={(e) => handleListDragStart(e, originalIndex)}
                onDragOver={(e) => handleListDragOver(e, originalIndex)}
                onDrop={(e) => handleListDrop(e, originalIndex)}
                className="cursor-move"
              >
                <KanbanList
                  list={list}
                  onAddTask={addTask}
                  onDeleteTask={deleteTask}
                  onUpdateTask={updateTask}
                  onDeleteList={deleteList}
                  onUpdateListTitle={updateListTitle}
                  onToggleCollapse={toggleListCollapse}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onTagClick={handleTagClick}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-shrink-0 border-t bg-background p-4">
        {isAddingList ? (
          <div className="max-w-md mx-auto">
            <Card>
              <CardContent className="p-4">
                <Input
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  placeholder="List title"
                  className="mb-2"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddList();
                    if (e.key === "Escape") setIsAddingList(false);
                  }}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddList}>
                    Add List
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsAddingList(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => setIsAddingList(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add List
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
