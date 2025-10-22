# Chat Artifact Integration — Overview

This update introduces a **modular Artifact rendering system** into the chat experience.  
It allows the assistant to display external content, such as websites, documents, or code previews — directly inside the chat interface, without leaving the page.

---

## 🏗️ Architecture Overview

app/
│
├─ layout.tsx
│ → 🌐 Global server layout (auth, sidebar, data providers)
│
├─ (chat)/
│ ├─ layout.tsx
│ │ → ⚙️ Chat module server layout (loads sidebar, pyodide script)
│ │
│ ├─ ChatSplitView.tsx
│ │ → 💡 Client layout shell (splits Chat ↔ Artifact)
│ │ Handles responsive transitions and animation logic
│ │
│ └─ chat/
│ ├─ page.tsx
│ │ → 🧠 Server component (fetches chat data, messages, model, session)
│ │
│ └─ ChatClient.tsx
│ → 💬 Client chat logic (renders <Chat /> + DataStreamHandler)
│
├─ components/
│ ├─ elements/
│ │ └─ message.tsx
│ │ → 🪄 Handles message rendering and link interception
│ │ (opens artifact when clicking AI-generated links)
│ │
│ └─ artifact/
│ ├─ hooks/use-artifact.ts
│ │ → 🧩 Global artifact store (Zustand)
│ │
│ ├─ ArtifactRenderer.tsx
│ │ → 🎛️ Chooses which artifact type to render (Webview, etc.)
│ │
│ └─ WebviewArtifact.tsx
│ → 🌍 Renders live web previews with Framer Motion
│
└─ src/
└─ types/
└─ ai-elements.d.ts
→ 🧾 Type declarations for ai-elements WebPreview component

---

### Why This Structure

When I was refactoring the project, my main goal was to **separate server logic from client interactivity** and make the artifact system behave smoothly, like in real production assistants.

**Server components** handle:

- Authentication, cookies, and database fetching.
- Heavy logic runs on the server to prevent hydration issues.

**Client components** handle:

- UI rendering, real-time updates, and user interactions.
- Framer Motion animations for smooth transitions (will be improved in future).

**Zustand global state** manages communication between chat and artifact UIs,  
so the chat doesn’t need to know _what_ artifact is displayed, it just triggers it.

---

Each component below plays a specific role in the local-only artifact system required for the trial task.  
This ensures that all functionality (link interception, webview rendering, layout animation) happens purely on the client, without any database persistence.

## ⚙️ Component Responsibilities

### 🧩 1. `app/layout.tsx`

- **Type:** Server component
- **Purpose:** Defines the global application shell (auth, sidebar, and data context).
- **Key features:**
  - Authenticates the user.
  - Loads global providers like `DataStreamProvider` and `SidebarProvider`.
  - Injects the global sidebar and layout used across all app routes.

---

### 🧩 2. `app/(chat)/layout.tsx`

- **Type:** Server component
- **Purpose:** Entry point for the chat section.
- **Key features:**
  - Loads **Pyodide script** for AI code execution.
  - Restores sidebar state from cookies.
  - Wraps the chat UI with the global sidebar and providers.
  - Renders the `ChatSplitView` (client shell for chat + artifact).

---

### 🧩 3. `app/(chat)/ChatSplitView.tsx`

- **Type:** Client component
- **Purpose:** Main visual layout shell that splits the screen into two parts: chat and artifact.
- **Key features:**
  - Uses **Framer Motion** to animate layout changes when the artifact opens or closes.
  - Responsive: the chat shrinks smoothly on large screens and hides on mobile.
  - Keeps both chat and artifact panels visually synchronized.
  - Provides the premium “split-panel” feel like Notion or Linear.

---

### 🧩 4. `app/(chat)/chat/page.tsx`

- **Type:** Server component
- **Purpose:** Fetches and prepares all data for a specific chat page.
- **Key features:**
  - Loads chat data, messages, and session info from the database.
  - Applies model settings from cookies.
  - Passes data into the client component `ChatClient`.

---

### 🧩 5. `app/(chat)/chat/ChatClient.tsx`

- **Type:** Client component
- **Purpose:** Handles the actual chat rendering and AI message streaming.
- **Key features:**
  - Renders `<Chat />` and `<DataStreamHandler />`.
  - Mounts the chat interface only after hydration (to prevent mismatch).
  - Manages live, streaming AI responses from the backend.

---

### 🧩 6. `components/elements/message.tsx`

- **Type:** Client component
- **Purpose:** Renders message bubbles and intercepts links in assistant messages.
- **Key features:**
  - Detects when a user clicks a link in a message.
  - Intercepts the click and opens it in a webview artifact:
    ```ts
    openArtifact({ type: "webview", url });
    ```
  - Adds accessible and consistent visual styling to user and assistant messages.
  - Includes avatar rendering with fallback initials.

---

### 🧩 7. `components/artifact/hooks/use-artifact.ts`

- **Type:** Zustand store
- **Purpose:** Global state management for artifact UI.
- **Key features:**
  - Stores which artifact is currently open (`type` and `url`).
  - Provides `openArtifact()` and `closeArtifact()` actions.
  - Accessible from any component (chat, message, or layout).

---

### 🧩 8. `components/artifact/ArtifactRenderer.tsx`

- **Type:** Client component
- **Purpose:** Chooses which artifact type to render based on the global state.
- **Key features:**
  - Acts as a “router” for artifact types.
  - Example: `type === "webview"` → renders `WebviewArtifact`.
  - Supports easy future extension (PDF, Code, Image, etc.).

---

### 🧩 9. `components/artifact/WebviewArtifact.tsx`

- **Type:** Client component
- **Purpose:** Displays a live website preview inside the chat UI.
- **Key features:**
  - Embeds the content in an animated `<iframe>`.
  - Includes full user controls:
    - **Open in new tab**
    - **Maximize / restore**
    - **Close**
  - Uses **Framer Motion** for smooth entrance and exit transitions.
  - Visually styled with a dark gradient background and glass header.

---
