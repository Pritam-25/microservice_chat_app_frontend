"use client"
import type { User } from "@/zustand/useUserStore"

export default function ChatHeader({ activeUser }: { activeUser: User | null }) {
  return (
    <div className="px-4 py-3 flex items-center gap-3">
      {activeUser && (
        <>
          <div className="size-8 rounded-full bg-blue-200" />
          <div className="flex flex-col">
            <div className="font-medium">{activeUser.username}</div>
            <div className="text-xs text-muted-foreground">online</div>
          </div>
        </>
      )}
    </div>
  )
}
