import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, tasks } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const boardSummary = tasks && tasks.length > 0
      ? `\n\nCurrent board state (${tasks.length} tasks):\n${tasks.map((t: any) =>
          `- [${t.status}] id="${t.id}" "${t.title}" (priority: ${t.priority}${t.assignee ? `, assignee: ${t.assignee}` : ''}${t.due_date ? `, due: ${t.due_date}` : ''}${t.labels?.length ? `, labels: ${t.labels.join(', ')}` : ''})`
        ).join('\n')}`
      : '\n\nThe board is currently empty.';

    const systemPrompt = `You are a Kanban board AI assistant. You help users manage their tasks, analyze workload, and suggest priorities.

You have full context of the user's board.${boardSummary}

IMPORTANT RULES:
- When the user asks to modify/update/change an EXISTING task, use the "update_task" action with the task's id and the fields to change. Do NOT create a new task.
- When the user asks to create a NEW task, use the "create_task" action.
- When the user asks to move a task, use the "move_task" action.
- When the user asks to delete a task, use the "delete_task" action.
- Match tasks by title or context from the board state above. Use the exact id from the board state.

Keep responses concise and actionable. Use markdown formatting.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
        tools: [
          {
            type: "function",
            function: {
              name: "board_action",
              description: "Perform an action on the Kanban board like creating, updating, moving, or deleting tasks",
              parameters: {
                type: "object",
                properties: {
                  action: {
                    type: "string",
                    enum: ["create_task", "update_task", "move_task", "delete_task"],
                    description: "The action to perform. Use update_task to modify existing tasks.",
                  },
                  task: {
                    type: "object",
                    description: "For create_task: the new task details",
                    properties: {
                      title: { type: "string" },
                      description: { type: "string" },
                      priority: { type: "string", enum: ["low", "medium", "high"] },
                      status: { type: "string", enum: ["todo", "in_progress", "pending", "completed"] },
                      labels: { type: "array", items: { type: "string" } },
                      assignee: { type: "string" },
                    },
                  },
                  task_id: {
                    type: "string",
                    description: "The id of the existing task to update/move/delete",
                  },
                  updates: {
                    type: "object",
                    description: "For update_task: the fields to change on the existing task",
                    properties: {
                      title: { type: "string" },
                      description: { type: "string" },
                      priority: { type: "string", enum: ["low", "medium", "high"] },
                      status: { type: "string", enum: ["todo", "in_progress", "pending", "completed"] },
                      labels: { type: "array", items: { type: "string" } },
                      assignee: { type: "string" },
                      due_date: { type: "string" },
                    },
                  },
                  new_status: { type: "string", enum: ["todo", "in_progress", "pending", "completed"] },
                },
                required: ["action"],
              },
            },
          },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits in Settings." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
