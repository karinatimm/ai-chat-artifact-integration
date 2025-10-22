"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize2, ExternalLink } from "lucide-react";
import { useWebviewArtifact } from "./hooks/use-artifact";
import { cn } from "@/lib/utils";

const WebPreview = ({ url }: { url: string }) => (
  <iframe
    src={url}
    className="w-full h-full border-none  bg-zinc-950"
    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
  />
);


const WebviewArtifact = () => {

  const { artifact, closeArtifact } = useWebviewArtifact();
  const [isMaximized, setIsMaximized] = useState(false);

  if (!artifact || artifact.type !== "webview") return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={cn(
          "relative flex flex-col h-full  border-l border-zinc-800",
          "bg-gradient-to-b from-zinc-950 to-zinc-900 shadow-2xl overflow-hidden",
          "transition-all duration-500 ease-in-out"
        )}
        style={{
          width: isMaximized ? "100%" : "100%",
          height: isMaximized ? "100vh" : "100%",
          position: isMaximized ? "fixed" : "relative",
          top: isMaximized ? 0 : "auto",
          left: isMaximized ? 0 : "auto",
          zIndex: isMaximized ? 50 : 10,
        }}
      >
        {/* 🧭 Modern Glass Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-2.5 border-b border-zinc-800 bg-zinc-900/70 backdrop-blur-lg backdrop-saturate-150">
          <div className="truncate text-sm text-zinc-300 font-medium flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {artifact.url}
          </div>

          {/*  Controls */}
          <div className="flex items-center gap-2">
            {/* External link */}
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => window.open(artifact.url, "_blank")}
              className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800/70 transition-colors"
              title="Open in new tab"
            >
              <ExternalLink size={16} />
            </motion.button>

            {/* Maximize */}
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                setIsMaximized((v) => !v);
              }}
              className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800/70 transition-colors"
              title={isMaximized ? "Restore" : "Maximize"}
            >
              <Maximize2
                size={16}
                className={cn(
                  "transition-transform duration-300",
                  isMaximized && "rotate-180 text-white"
                )}
              />
            </motion.button>

            {/* Close */}
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                closeArtifact();
              }}
              className="p-1.5 rounded-md text-zinc-400 hover:text-red-500 hover:bg-zinc-800/70 transition-colors"
              title="Close"
            >
              <X size={16} />
            </motion.button>
          </div>
        </div>

        {/*  Smooth iframe fade */}
        <motion.div
          key={artifact.url}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex-1 overflow-hidden"
        >
          <WebPreview url={artifact.url} />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WebviewArtifact;
