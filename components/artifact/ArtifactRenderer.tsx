"use client";

import { useEffect, useState } from "react";
import { useWebviewArtifact } from "./hooks/use-artifact";
import WebviewArtifact from "./WebviewArtifact";


//  Controls when and what artifact to show.
//  Waits for client mount to avoid hydration mismatch.
const Artifact = () => {
  const { artifact } = useWebviewArtifact();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // don’t render until mounted (prevents hydration timing bug)
  if (!mounted) return null;
  if (!artifact) return null;

  if (artifact.type === "webview") {
    return <WebviewArtifact />;
  }

  return null;
};

export default Artifact;
