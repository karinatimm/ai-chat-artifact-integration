"use client";
import type { UIMessage } from "ai";
import { useEffect, useRef, type ComponentProps, type HTMLAttributes } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
// import { useArtifact } from "@/hooks/use-artifact";
import { useWebviewArtifact } from "@/components/artifact/hooks/use-artifact";



export const MessageContent = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { openArtifact } = useWebviewArtifact();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const link = target.closest("a");
      if (!link) return;

      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:")) return;

      event.preventDefault();
      console.log("✅ Intercepted link click:", href);
      openArtifact({ type: "webview", url: href });
    };

    el.addEventListener("click", handleClick);
    return () => el.removeEventListener("click", handleClick);
  }, [openArtifact]);

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-2 overflow-hidden rounded-lg px-4 py-3 text-foreground text-sm",
        "group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground",
        "group-[.is-assistant]:bg-secondary group-[.is-assistant]:text-foreground",
        "prose prose-invert prose-a:text-blue-400 hover:prose-a:underline cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};



export type MessageAvatarProps = ComponentProps<typeof Avatar> & {
  src: string;
  name?: string;
};

export const MessageAvatar = ({
  src,
  name,
  className,
  ...props
}: MessageAvatarProps) => (
  <Avatar className={cn("size-8 ring-1 ring-border", className)} {...props}>
    <AvatarImage alt="" className="my-0" src={src} />
    <AvatarFallback>{name?.slice(0, 2) || "ME"}</AvatarFallback>
  </Avatar>
);

