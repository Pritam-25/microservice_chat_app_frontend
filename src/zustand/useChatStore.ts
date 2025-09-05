import { create } from "zustand"
import type { Socket } from "socket.io-client"

export type ChatMessage = {
  text: string
  sender: string
  receiver: string
}

type ChatStore = {
  messages: ChatMessage[]
  addMessage: (m: ChatMessage) => void
  socket: Socket | null
  setSocket: (s: Socket | null) => void
}

const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  addMessage: (m) => set((state) => ({ messages: [...state.messages, m] })),
  socket: null,
  setSocket: (s) => set({ socket: s }),
}))

export default useChatStore