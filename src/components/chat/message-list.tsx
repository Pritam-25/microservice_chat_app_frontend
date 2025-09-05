"use client"
import { useEffect, useMemo, useRef } from "react"
import type { User } from "@/zustand/useUserStore"
import useAuthStore from "@/zustand/useAuthStore"
import useChatStore from "@/zustand/useChatStore"

export default function MessageList({ activeUser }: { activeUser: User | null }) {
  const { authUser } = useAuthStore()
  const { messages } = useChatStore()
  const bottomRef = useRef<HTMLDivElement | null>(null)

  const filtered = useMemo(() => {
    if (!activeUser) return []
    return messages.filter(
      (m) => (m.sender === authUser && m.receiver === activeUser.username) ||
        (m.sender === activeUser.username && m.receiver === authUser)
    )
  }, [messages, activeUser, authUser])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [filtered.length])

  return (
    <div className="h-full overflow-y-auto bg-background">
      <div className="p-4 space-y-2">
        {filtered.map((m, i) => {
          const mine = m.sender === authUser
          return (
            <div key={i} className={`flex w-full ${mine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] rounded-lg px-3 py-2 text-sm ${mine ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                {m.text}
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
