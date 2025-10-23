"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, BarChart3, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { BoardSelector } from "@/components/board-selector"
import { useKanban } from "@/hooks/use-kanban"

export function Navigation() {
  const pathname = usePathname()
  const { boards, activeBoard, setActiveBoard, addBoard, deleteBoard, updateBoardName } = useKanban()

  const links = [
    {
      href: "/",
      label: "Board",
      icon: LayoutDashboard,
    },
    {
      href: "/reports",
      label: "Reports",
      icon: BarChart3,
    },
    {
      href: "/settings",
      label: "Settings",
      icon: Settings,
    },
  ]

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-6 w-6" />
              <h1 className="text-xl font-bold">Kanban Board</h1>
            </div>

            {pathname === "/" && (
              <BoardSelector
                boards={boards}
                activeBoard={activeBoard}
                onSelectBoard={setActiveBoard}
                onAddBoard={addBoard}
                onDeleteBoard={deleteBoard}
                onRenameBoard={updateBoardName}
              />
            )}
          </div>

          <div className="flex gap-2">
            {links.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href

              return (
                <Button key={link.href} variant={isActive ? "default" : "ghost"} asChild className={cn("gap-2")}>
                  <Link href={link.href}>
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                </Button>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
