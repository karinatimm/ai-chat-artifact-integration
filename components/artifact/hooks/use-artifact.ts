"use client";

import { create } from "zustand";

export type ArtifactType = "webview";

export interface ArtifactData {
  type: ArtifactType;
  url: string;
}

interface ArtifactState {
  artifact: ArtifactData | null;
  openArtifact: (artifact: ArtifactData) => void;
  closeArtifact: () => void;
}

// create local state for controlling artifact panel open or close
// what kind of artifact (and data) is currently shown
// which artifact to show { type: "webview", url: "https://example.com" }
export const useWebviewArtifact = create<ArtifactState>((set) => ({
  artifact: null,
  openArtifact: (artifact: ArtifactData) => set({ artifact }),
  closeArtifact: () => set({ artifact: null }),
}));

