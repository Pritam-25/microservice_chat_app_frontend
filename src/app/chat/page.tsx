"use client";
import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useAuthStore from "@/zustand/useAuthStore";
import axios from "axios";
import useUserStore from "@/zustand/useUserStore";

// Define a proper type
interface Message {
  text: string;
  sentByCurrentUser: boolean;
  sender: string;
  receiver: string;
}

export default function ChatApp() {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const { authUser } = useAuthStore();
  const { updateUsers } = useUserStore();

  const getUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users", { withCredentials: true });
      updateUsers(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }


  useEffect(() => {
    const newSocket = io("http://localhost:4000", {
      query: { username: authUser }
    });
    setSocket(newSocket);

    //   Listen for incoming messages
    newSocket.on(
      "chat message",
      (message: { textMsg: string; sender: string; receiver: string }) => {
        setMessages((prev) => [
          ...prev,
          {
            text: message.textMsg,
            sentByCurrentUser: message.sender === authUser,
            sender: message.sender,
            receiver: message.receiver,
          },
        ]);
      }
    );

    return () => { newSocket.disconnect() };
  }, []);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const msgToBeSent = {
      textMsg: msg,
      sender: authUser,
      receiver: "maityp394"
    }
    if (socket && msg.trim() !== "") {
      socket.emit("chat message", msgToBeSent);

      // Add the sent message to UI immediately
      setMessages((prev) => [
        ...prev,
        {
          text: msg, sentByCurrentUser: true,
          sender: authUser,       // ✅ keep consistent
          receiver: "maityp394",
        },
      ]);

      setMsg("");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 flex flex-col h-screen">
      <h1 className="text-2xl font-semibold mb-4 text-center">
        Chat Application
      </h1>

      {/* Messages area */}
      <Card className="flex-1 overflow-y-auto mb-4">
        <CardContent className="flex flex-col space-y-2 p-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`px-4 py-1 rounded-lg max-w-[75%] ${m.sentByCurrentUser
                ? "bg-gray-500 text-white self-end"
                : "bg-gray-200 text-black self-start"
                }`}
            >
              {m.text}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Input form at bottom */}
      <form onSubmit={sendMessage} className="flex items-center space-x-2">
        <Input
          type="text"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
}                 