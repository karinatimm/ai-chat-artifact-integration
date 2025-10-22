"use client";

import { useEffect, useState } from "react";
import { Chat } from "@/components/chat";
import { DataStreamHandler } from "@/components/data-stream-handler";

export default function ChatLayout({ chat, uiMessages, model, session }: any) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log("🟢 ChatLayout mounted (React ready)");
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex h-full w-full overflow-hidden bg-background">
      <div className="flex flex-col h-full w-full">
        <Chat
          autoResume
          id={chat.id}
          initialChatModel={model}
          initialLastContext={chat.lastContext ?? undefined}
          initialMessages={uiMessages}
          initialVisibilityType={chat.visibility}
          isReadonly={session?.user?.id !== chat.userId}
        />
        <DataStreamHandler />
      </div>
    </div>
  );
}

