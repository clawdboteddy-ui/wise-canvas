

# Kanban Board with AI Assistant

## Overview
A sleek, dark-mode-first Kanban board with rich task cards, drag-and-drop, an integrated AI command sidebar, and cloud persistence — no login required.

## Layout
- **Left icon sidebar** (collapsed): Home, Settings icons
- **Main area**: Kanban board with 4 columns — To Do, In Progress, Pending, Completed
- **Right sidebar** (toggleable): AI command panel that slides in, pushing the board

## Task Cards (Rich)
Each card includes:
- **Title** and **description**
- **Priority** badge (Low / Medium / High) with color coding
- **Labels/tags** (custom, color-coded chips)
- **Due date** picker
- **Assignee** name field
- Quick actions menu (edit, delete, move)

## Board Interactions
- **Drag & drop** between columns using @hello-pangea/dnd (smooth, 60fps)
- **Keyboard shortcut** `N` to create a new task in To Do with auto-focus
- **Click card** to open edit modal with all fields
- **Column "+" button** to add tasks inline
- Optimistic UI updates — feels instant

## AI Command Sidebar
- Integrated panel (not a floating bubble) that slides from the right
- Powered by Lovable AI (Gemini) via edge function
- **Read-only**: "What should I prioritize?" → AI analyzes tasks and suggests focus
- **Action-oriented**: "Create a task called 'Fix login bug' with high priority" → AI creates it on the board
- "Move all pending tasks to in progress" → AI executes batch moves
- Streaming responses with markdown rendering
- Task context sent with each message so AI understands your board

## Persistence (Supabase)
- Single shared board stored in Supabase (no auth required)
- Tables: `boards`, `tasks`, `task_labels`
- Real-time sync so changes persist immediately
- Board loads from DB on page load

## Design System (Dark Mode First)
- **Background**: Zinc-950 (`#09090B`)
- **Surface**: Zinc-900 for cards and panels
- **Accent**: Blue-500 (`#3B82F6`) for AI active states and primary CTAs
- **Typography**: Geist-inspired system font stack, 14px body, 12px uppercase column headers
- **Depth**: Layered shadow stack (no hard borders), subtle glow on hover
- **Animations**: `cubic-bezier(0.2, 0, 0, 1)` for drag lift (scale 1.02), smooth sidebar slide

## Edge Function
- `chat` function for AI interactions — receives board state + user message, returns streaming response
- AI can parse commands and return structured tool calls to modify the board

