"use client";

import Link from "next/link";
import { useState } from "react";

import SlackInput from "./SlackInput";

export default function Page() {
  const [messages, setMessages] = useState<string[]>([]);

  const handleSendMessage = (message: string) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  return (
    <main className="flex h-screen flex-col items-center p-24">
      <div className="mb-10">
        <Link href="/">Home</Link>
      </div>
      <div className="w-1/2">
        <SlackInput onSendMessage={handleSendMessage} />
        <div className="mt-4">
          <h2>Sent Messages:</h2>
          <ul>
            {messages.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
