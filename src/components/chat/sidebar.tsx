"use client"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useMemo, useState } from "react"
import type { User } from "@/zustand/useUserStore"
import { Menu, PenBox } from "lucide-react"
import { Button } from "../ui/button"

type Props = {
  users: User[]
  onSelect: (u: User) => void
  activeUserId?: string
}

export default function Sidebar({ users, onSelect, activeUserId }: Props) {
  const [q, setQ] = useState("")
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return users
    return users.filter((u) => u.username.toLowerCase().includes(s))
  }, [q, users])

  return (
    <div className="flex h-full flex-col bg-sidebar pl-2">
      <div className="h-16 flex items-center justify-between ">
        <div className="px-4">
          <h2 className="text-xl font-bold">Chats</h2>
        </div>
        <div className="px-4 flex items-center gap-2">
          <Button variant={"ghost"}>
            <PenBox className="size-4" />
          </Button>
          <Button variant={"ghost"}>
            <Menu className="size-4" />
          </Button>
        </div>
      </div>
      <div className="px-3">
        <Input placeholder="Search or start new chat" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto pt-3">
        <ul>
          {filtered.map((u) => (
            <li key={u._id}>
              <button
                type="button"
                onClick={() => onSelect(u)}
                className={cn(
                  "w-full text-left px-4 py-3 hover:bg-sidebar-accent rounded-sm",
                  activeUserId === u._id && "bg-blue-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-blue-100 border-2 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{u.username}</div>
                    <div className="text-sm text-muted-foreground truncate">Click to chat</div>
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
