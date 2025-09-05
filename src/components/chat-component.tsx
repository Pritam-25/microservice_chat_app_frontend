"use client";
import { useEffect } from "react";
import io, { Socket } from "socket.io-client";
import useAuthStore from "@/zustand/useAuthStore";
import axios from "axios";
import useUserStore from "@/zustand/useUserStore";
import ChatLayout from "@/components/chat/chat-layout";
import useChatStore from "@/zustand/useChatStore";

type Incoming = { textMsg: string; sender: string; receiver: string }

export default function ChatApp() {
  const { authUser } = useAuthStore();
  const { updateUsers } = useUserStore();
  const { addMessage, setSocket } = useChatStore();

  const getUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users", { withCredentials: true });
      updateUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  useEffect(() => {
    if (!authUser) return;
    const newSocket: Socket = io("http://localhost:4000", {
      query: { username: authUser },
      withCredentials: true,
    });
    setSocket(newSocket)

    newSocket.on("chat message", (message: Incoming) => {
      addMessage({ text: message.textMsg, sender: message.sender, receiver: message.receiver })
    });

    getUsers();

    return () => {
      newSocket.off("chat message");
      newSocket.disconnect();
      setSocket(null)
    };
  }, [authUser]);

  return <ChatLayout />
}                 