"use client";

import { useWebviewArtifact } from "@/components/artifact/hooks/use-artifact";
import WebviewArtifact from "@/components/artifact/WebviewArtifact";
import { cn } from "@/lib/utils";

export default function ClientChatContainer({ children }: { children: React.ReactNode }) {
  const { artifact } = useWebviewArtifact();

  return (
    <div className="relative flex h-screen w-full overflow-hidden">
      <div
        className={cn(
          "flex flex-col h-full transition-all duration-300 ease-in-out",
          artifact ? "lg:w-1/2" : "w-full",
          artifact ? "hidden lg:flex" : "flex"
        )}
      >
        {children}
      </div>

      {artifact && (
        <div
          className={cn(
            "flex flex-col h-full bg-zinc-950 border-l border-zinc-800 transition-all duration-300 ease-in-out",
            "lg:w-1/2 w-full sticky top-0 z-10"
          )}
        >
          <WebviewArtifact />
        </div>
      )}
    </div>
  );
}
