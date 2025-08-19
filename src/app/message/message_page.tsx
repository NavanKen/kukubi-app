"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Send, Bot, User, Phone, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { sendMessageToDify } from "@/lib/difyAi/difyAIClient";

interface Message {
  id: string;
  text: string;
  sender: "user" | "contact";
  timestamp: Date;
}

interface ContactInfo {
  name: string;
  role: string;
  avatar: React.ReactNode;
  status: "online" | "offline";
  lastSeen?: string;
}

const contactInfoMap: { [key: string]: ContactInfo } = {
  ai: {
    name: "Kukubi Assistant",
    role: "Asisten AI siap membantu Anda kapan saja",
    avatar: <Bot className="h-6 w-6 text-orange-500" />,
    status: "online",
  },
  dev1: {
    name: "Naufal Afandi",
    role: "Lead Developer",
    avatar: <User className="h-6 w-6 text-blue-500" />,
    status: "offline",
    lastSeen: "2 jam yang lalu",
  },
  dev2: {
    name: "Amru Savero",
    role: "Frontend Developer",
    avatar: <User className="h-6 w-6 text-purple-500" />,
    status: "offline",
    lastSeen: "5 jam yang lalu",
  },
};

const MessagePage = () => {
  const searchParams = useSearchParams();
  const chatType = searchParams.get("type") || "ai";
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const contactInfo: ContactInfo =
    contactInfoMap[chatType as keyof typeof contactInfoMap] ||
    contactInfoMap.ai;

  useEffect(() => {
    const initialMessage: Message = {
      id: "1",
      text:
        chatType === "ai"
          ? "Halo! Saya Customer Service AI Kukubi. Ada yang bisa saya bantu hari ini?"
          : `Halo! Ini ${contactInfo.name}. Maaf saya sedang tidak online, tapi Anda bisa meninggalkan pesan dan saya akan membalasnya segera.`,
      sender: "contact",
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
  }, [chatType, contactInfo.name]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");

    if (chatType === "ai") {
      setIsTyping(true);

      try {
        const data = await sendMessageToDify(newMessage);

        const aiText =
          data?.answer || "Maaf, saya tidak bisa merespons saat ini.";

        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: aiText,
          sender: "contact",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiResponse]);
      } catch (error: unknown) {
        console.log("error", error);
        const errorMessage: Message = {
          id: (Date.now() + 2).toString(),
          text: "Terjadi kesalahan saat menghubungkan ke AI.",
          sender: "contact",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsTyping(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/contact">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    chatType === "ai"
                      ? "bg-orange-100"
                      : chatType === "dev1"
                      ? "bg-blue-100"
                      : "bg-purple-100"
                  }`}
                >
                  {contactInfo.avatar}
                </div>
                <div
                  className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                    contactInfo.status === "online"
                      ? "bg-green-500"
                      : "bg-gray-400"
                  }`}
                ></div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  {contactInfo.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {contactInfo.status === "online"
                    ? "Online"
                    : `Terakhir dilihat ${contactInfo.lastSeen}`}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="p-2">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pt-20 space-y-4 min-h-0">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === "user"
                  ? "bg-orange-500 text-white"
                  : "bg-white text-gray-900 border border-gray-200"
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p
                className={`text-xs mt-1 ${
                  message.sender === "user"
                    ? "text-orange-100"
                    : "text-gray-500"
                }`}
              >
                {message.timestamp.toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-900 border border-gray-200 px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ketik pesan Anda..."
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4"
            disabled={!newMessage.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessagePage;
