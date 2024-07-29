"use client";

import { useState } from "react";
import { ClientMessage } from "./actions";
import { useActions, useUIState } from "ai/rsc";
import { generateId } from "ai";
import { Button } from "@/components/ui/button";
import { Bot, ChartArea, SendIcon, User } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [conversation, setConversation] = useUIState();
  const { continueConversation } = useActions();
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async () => {
    setInput("");
    setIsLoading(true);
    setConversation((currentConversation: ClientMessage[]) => [
      ...currentConversation,
      { id: generateId(), role: "user", display: input },
    ]);

    const message = await continueConversation(input);
    setIsLoading(false);
    setConversation((currentConversation: ClientMessage[]) => [
      ...currentConversation,
      message,
    ]);
  };

  return (
    <div className="flex flex-col h-screen justify-between bg-background">
      <header className="flex items-center gap-4 px-8 py-3 border-b bg-card">
        <div className="size-8 bg-muted rounded-full flex items-center justify-center">
          <ChartArea className="size-4 text-muted-foreground" />
        </div>
        <div className="text-card-foreground font-medium">Chart Plotter</div>
      </header>
      <div className="flex-1 overflow-auto pb-28 p-8">
        <div className="flex flex-col gap-4 justify-between">
          {conversation.map((message: ClientMessage) => {
            const { role, display } = message;
            return role === "user" ? (
              <div className="flex items-start gap-4">
                <div className="size-8 bg-muted rounded-full flex items-center justify-center">
                  <User className="size-4 text-muted-foreground" />
                </div>
                <div className="grid gap-1 bg-muted rounded-lg p-3 max-w-[80%]">
                  <div className="font-medium">You</div>
                  <div className="text-muted-foreground">
                    <p>{display}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-4 justify-end">
                <div className="grid gap-1 bg-primary rounded-lg p-3 max-w-[80%] text-primary-foreground">
                  <div className="font-medium">Chatbot</div>
                  <div>
                    <p>{display}</p>
                  </div>
                </div>
                <div className="size-8 bg-muted rounded-full flex items-center justify-center">
                  <Bot className="size-4 text-muted-foreground" />
                </div>
              </div>
            );
          })}
        </div>
        <div className="fixed bottom-0 left-0  w-full ">
          <div className="bg-card pb-4 relative mx-8">
            <Textarea
              placeholder="Type your message..."
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
              }}
              className=" rounded-2xl overflow-hidden  resize-none border border-neutral-400 shadow-sm pr-16"
            />
            <Button
              type="submit"
              size="icon"
              className="absolute w-8 h-8 top-3 right-3"
              onClick={handleSubmit}
            >
              <SendIcon className="w-4 h-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
