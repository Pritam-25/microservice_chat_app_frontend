"use client"
import Sidebar from "@/components/chat/sidebar"
import ChatHeader from "@/components/chat/chat-header"
import MessageList from "@/components/chat/message-list"
import MessageInput from "@/components/chat/message-input"
import { Card } from "@/components/ui/card"
import { useState, useMemo } from "react"
import useUserStore, { User } from "@/zustand/useUserStore"
import useAuthStore from "@/zustand/useAuthStore"

export default function ChatLayout() {
  const { users } = useUserStore()
  const { authUser } = useAuthStore()
  const [activeUser, setActiveUser] = useState<User | null>(null)

  // Exclude self from list if present
  const filteredUsers = useMemo(() => users.filter(u => u.username !== authUser), [users, authUser])

  return (
    <div className="h-[100svh] w-full flex">
      {/* Left Sidebar */}
      <aside className="w-full max-w-[400px] border-r-2 ">
        <Sidebar users={filteredUsers} onSelect={setActiveUser} activeUserId={activeUser?._id} />
      </aside>

      {/* Chat area */}
      <main className="flex-1 flex flex-col">
        {activeUser ? (
          <>
            <div className="rounded-none border-0 bg-sidebar border-b h-16 flex items-center">
              <ChatHeader activeUser={activeUser} />
            </div>
            <div className="flex-1 min-h-0">
              <MessageList activeUser={activeUser} />
            </div>
            <div className="border-t">
              <MessageInput activeUser={activeUser} />
            </div>
          </>
        ) : (
          <div className="flex-1 min-h-0 flex items-center justify-center">
            <div className="text-sm text-muted-foreground">Select a chat to start messaging</div>
          </div>
        )}
      </main>
    </div>
  )
}
