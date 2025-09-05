"use client"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { User } from "@/zustand/useUserStore"
import useAuthStore from "@/zustand/useAuthStore"
import useChatStore from "@/zustand/useChatStore"

export default function MessageInput({ activeUser }: { activeUser: User | null }) {
  const [value, setValue] = useState("")
  const { authUser } = useAuthStore()
  const { socket, addMessage } = useChatStore()

  const send = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeUser || !value.trim() || !authUser) return

    const msgToBeSent = {
      textMsg: value,
      sender: authUser,
      receiver: activeUser.username,
    }

    if (socket) {
      socket.emit('chat message', msgToBeSent)
    }

    addMessage({ text: value, sender: authUser, receiver: activeUser.username })
    setValue("")
  }

  return (
    <form onSubmit={send} className="p-3 flex items-center gap-2 bg-sidebar">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={activeUser ? `Message ${activeUser.username}` : "Select a chat to start"}
        disabled={!activeUser}
      />
      <Button type="submit" disabled={!activeUser || !value.trim()}>Send</Button>
    </form>
  )
}
