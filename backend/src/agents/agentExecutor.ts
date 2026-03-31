import { tools } from "../tools/toolRegistry.js";
import { prisma } from "../config/prisma.js";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { storeMemory, queryMemory } from "../memory/vectorStore.js";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToolName = keyof typeof tools;

// ─── Model ───────────────────────────────────────────────────────────────────

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GOOGLE_API_KEY!,
});

// ─── Role Behavior Injection ──────────────────────────────────────────────────

function getRoleBehavior(role: string): string {
  const lower = role.toLowerCase();

  if (
    lower.includes("legal") ||
    lower.includes("law") ||
    lower.includes("lawyer") ||
    lower.includes("advocate") ||
    lower.includes("court") ||
    lower.includes("justice")
  ) {
    return `
- Always cite specific laws, acts, and sections (e.g. IPC Section 420, CrPC 164)
- Structure advice as: Situation Analysis → Applicable Law → Recommended Action
- Add disclaimer: "This is AI-generated legal information, not professional legal advice"
- If jurisdiction matters, ask which state/country before answering
- Use web_search to find current relevant case laws and precedents
- Never give a direct verdict — always present options and consequences
    `;
  }

  if (
    lower.includes("finance") ||
    lower.includes("invest") ||
    lower.includes("stock") ||
    lower.includes("money") ||
    lower.includes("budget") ||
    lower.includes("tax") ||
    lower.includes("accounting") ||
    lower.includes("crypto")
  ) {
    return `
- Always give specific numbers, percentages, and comparisons
- Structure as: Current Situation → Risk Analysis → Recommendations
- Add disclaimer: "This is not certified financial advice"
- Use calculator for any numerical analysis
- Use web_search for current market data and prices
- Always mention risk level (low/medium/high) for any investment suggestion
    `;
  }

  if (
    lower.includes("travel") ||
    lower.includes("trip") ||
    lower.includes("tour") ||
    lower.includes("vacation") ||
    lower.includes("holiday") ||
    lower.includes("itinerary")
  ) {
    return `
- Always give specific costs in INR and USD
- Structure as: Itinerary → Budget Breakdown → Local Tips → Packing List
- Include best time to visit, transport options, accommodation range
- Use web_search for current prices, visa requirements, and travel advisories
- Always mention safety tips for the destination
- CRITICAL: When user asks for a PDF or Email of an existing plan, DO NOT search the web again. Copy the exact itinerary from the "Conversation history" into the tool input.
- When user asks to summarize, ALWAYS call summarizer tool first
- Never skip tool calls — the user can see which tools you used
- When user asks to schedule something, ALWAYS call google_calendar with exact date and time
- Chain tools naturally: web_search (if new destination) → google_calendar → pdf_generator → send_email
    `;
  }

  if (
    lower.includes("tutor") ||
    lower.includes("teach") ||
    lower.includes("learn") ||
    lower.includes("educat") ||
    lower.includes("coach") ||
    lower.includes("mentor") ||
    lower.includes("student") ||
    lower.includes("exam") ||
    lower.includes("dsa") ||
    lower.includes("coding") ||
    lower.includes("interview")
  ) {
    return `
- Explain concepts from first principles, never assume prior knowledge
- Use real world analogies and concrete examples
- After explaining, always give a practice problem or quiz question
- Structure as: Concept Explanation → Example → Practice Problem → Hint
- If user gets something wrong, explain WHY it's wrong before giving the correct answer
- Be encouraging and patient
    `;
  }

  if (
    lower.includes("research") ||
    lower.includes("analyst") ||
    lower.includes("analysis") ||
    lower.includes("report") ||
    lower.includes("investigat") ||
    lower.includes("data")
  ) {
    return `
- Always use web_search before answering to get current data
- Cite sources in your response with URLs when available
- Structure as: Executive Summary → Key Findings → Detailed Analysis → Conclusion
- Use pdf_generator when user asks for a report or document
- Always include data points, statistics, and evidence
- Distinguish between facts and interpretations clearly
    `;
  }

  if (
    lower.includes("health") ||
    lower.includes("medical") ||
    lower.includes("doctor") ||
    lower.includes("medicine") ||
    lower.includes("symptom") ||
    lower.includes("diet") ||
    lower.includes("fitness") ||
    lower.includes("nutrition")
  ) {
    return `
- Always add disclaimer: "This is not professional medical advice. Consult a doctor."
- Structure as: Overview → Possible Causes → General Recommendations → When to See a Doctor
- Never diagnose — only provide general health information
- Use web_search for current medical guidelines and research
- Always recommend consulting a healthcare professional for serious symptoms
    `;
  }

  if (
    lower.includes("market") ||
    lower.includes("content") ||
    lower.includes("social media") ||
    lower.includes("seo") ||
    lower.includes("brand") ||
    lower.includes("copywr") ||
    lower.includes("advertis")
  ) {
    return `
- Always tailor content to the target audience specified
- Structure as: Strategy → Content Plan → Key Messages → Call to Action
- Use web_search for current trends, competitor analysis, and platform best practices
- Give specific, actionable recommendations not generic advice
- Include metrics to measure success when relevant
    `;
  }

  if (
    lower.includes("hr") ||
    lower.includes("recruit") ||
    lower.includes("hiring") ||
    lower.includes("resume") ||
    lower.includes("career") ||
    lower.includes("job")
  ) {
    return `
- Be professional and unbiased in all recommendations
- Structure as: Assessment → Strengths → Areas to Improve → Action Plan
- Use web_search for current industry salary data and job market trends
- For resume/interview help, give specific examples and templates
- Always consider both employer and candidate perspectives
    `;
  }

  if (
    lower.includes("support") ||
    lower.includes("customer") ||
    lower.includes("helpdesk") ||
    lower.includes("service")
  ) {
    return `
- Always be empathetic and solution-focused
- Structure as: Acknowledge Issue → Diagnose Problem → Provide Solution → Follow Up
- Escalate clearly when issue is beyond scope
- Keep responses concise and actionable
- Always confirm if the solution resolved the issue
    `;
  }

  // Default
  return `
- Be specific and actionable in every response
- Use tools when needed to give accurate and current information
- Structure responses clearly with headers for readability
- Always verify facts with web_search when accuracy matters
- End responses with clear next steps or recommendations
  `;
}

// ─── JSON Extractor ───────────────────────────────────────────────────────────

function extractJSON(raw: string): string {
  let cleaned = raw.replace(/```json|```/g, "").trim();

  const start = cleaned.indexOf("{");
  if (start === -1) return cleaned;

  let depth = 0;
  let end = -1;
  let inString = false;
  let escape = false;

  for (let i = start; i < cleaned.length; i++) {
    const char = cleaned[i];

    if (escape) {
      escape = false;
      continue;
    }
    if (char === "\\") {
      escape = true;
      continue;
    }
    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (!inString) {
      if (char === "{") depth++;
      else if (char === "}") {
        depth--;
        if (depth === 0) {
          end = i;
          break;
        }
      }
    }
  }

  return end !== -1 ? cleaned.slice(start, end + 1) : cleaned;
}

// ─── Main Agent Runner ────────────────────────────────────────────────────────

export async function runAgent(
  agentId: string,
  task: string,
  history: { role: string; content: string }[] = [],
  emit: (event: object) => void,
  userId: string,
) {
  // 1️⃣ Fetch agent config
  const agent = await prisma.agentConfig.findUnique({
    where: { id: agentId },
  });

  if (!agent) {
    emit({ type: "error", message: "Agent not found" });
    return "Agent configuration not found";
  }

  // 2️⃣ Role behavior
  const roleBehavior = getRoleBehavior(agent.role);

  // 3️⃣ System prompt
  const systemPrompt = `
You are ${agent.name}, a highly specialized AI agent.

YOUR SPECIALIZATION:
${agent.role}

HOW YOU MUST BEHAVE:
${roleBehavior}

AVAILABLE TOOLS: ${agent.tools.join(", ")}

If you cannot complete all requested actions due to iteration limits, 
complete as many as possible and tell the user exactly which ones were done 
and which ones were not. Never pretend to have done something you haven't.

TOOL DESCRIPTIONS:
- web_search: Search the internet for current information, facts, news, prices
- calculator: Evaluate math expressions like "10% of 3700000000000" or "sqrt(144)"
- summarizer: Summarize a long piece of text into key points
- pdf_generator: Generate a PDF from markdown text content and return a download URL
- send_email: Send an email to any address.
  Input must be a JSON object with "to", "subject", and "body" keys.
  Example input: {"to": "john@gmail.com", "subject": "Trip Plan", "body": "Here is your Goa itinerary..."}
  Always ask user for their email address if not provided before calling this tool.
  Example: "to:john@gmail.com|subject:Trip Plan|body:Here is your Goa itinerary..."
  WARNING: For the body parameter, replace all newlines with \\n and escape all quotes. Do not use raw line breaks inside the string.
  Always ask user for their email address if not provided before calling this tool.
- google_calendar: Create or list Google Calendar events.
  To CREATE: "action:create|title:Meeting|date:2025-12-25|time:14:00|duration:60|description:Team sync"
  To LIST: "action:list|days:7"
  Always use YYYY-MM-DD format for dates and HH:MM for time.
  If user says "tomorrow" or "next Monday" — calculate the actual date before calling the tool.

CRITICAL RULES:
0. YOUR ENTIRE RESPONSE MUST BE VALID JSON ONLY — no prose, no markdown, no explanation before or after the JSON. If you write anything outside {}, the system will crash.
1. "input" must ALWAYS be a plain string — never an object or array
2. "tool" must be one of: ${agent.tools.join(", ")}
3. Never add text outside the JSON object
4. Your entire response must start with { and end with }
5. If pdf_generator returns a URL, include it in final answer as [Download PDF](url)
6. If a tool fails, try a different approach — do not repeat the same failing tool
7. Use tools proactively — use web_search when current data improves your answer
8. DO NOT REPEAT YOURSELF: Never call the exact same tool with the exact same input more than once. If you already searched for it, use the results you have.
9. TRUST THE HISTORY: If the user asks you to email, summarize, or generate a PDF of something you ALREADY discussed, DO NOT use web_search. Extract the information directly from the "Conversation history".
10. For send_email — if user has not provided an email address, ask for it before calling the tool
11. For google_calendar — always convert relative dates like "tomorrow", "next week" to actual YYYY-MM-DD format before calling
12. For send_email — the body should contain the full formatted content, not a summary
13. Never say you have completed an action without actually calling the tool
14. Never fabricate tool results — if you cannot complete all tasks, say so honestly
15. For multiple calendar events, call google_calendar multiple times — once per event
16. TOOL CHAINING: If you need to generate a PDF and email it, call pdf_generator first, wait for the result, and THEN call send_email with the PDF link included.
17. NEVER call web_search more than once for the same task.
18. After getting search results, you MUST use them to proceed to next step (pdf/email).
19. If sufficient data is available, STOP calling tools and return final.
TO USE A TOOL:
{
  "action": "tool",
  "reason": "specific reason why you need this tool",
  "tool": "tool_name",
  "input": "plain string input only — never an object or array"
}

WHEN TASK IS COMPLETE:
{
  "action": "final",
  "answer": "your complete professional response here"
}
`;

  // 4️⃣ Memory
  emit({ type: "thinking", message: "Retrieving relevant memories..." });

  let memoryContext = "";
  if (agent.memoryEnabled) {
    memoryContext = await queryMemory(agent.id, task);
  }

  emit({
    type: "memory",
    hasMemory: memoryContext.length > 0,
    count: memoryContext.length > 0 ? 1 : 0,
  });

  // 5️⃣ History
  const historyText =
    history.length > 0
      ? history
          .map((m) => `${m.role === "user" ? "User" : "Agent"}: ${m.content}`)
          .join("\n")
      : "No previous messages";

  // 6️⃣ Context
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const todayFormatted = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Kolkata",
  });

  let context = `
TODAY'S DATE: ${today} (${todayFormatted})
Use this to calculate "tomorrow", "next Monday", "in 3 days" etc.

--- PAST CONVERSATION HISTORY ---
${historyText}
---------------------------------

--- RELEVANT MEMORY ---
${memoryContext || "None"}
-----------------------

==================================================
🎯 CURRENT NEW DIRECTIVE (YOU MUST EXECUTE THIS):
${task}
==================================================

CRITICAL INSTRUCTION: 
Read the "CURRENT NEW DIRECTIVE" above. This is your ONLY goal right now. 
Do not restart tasks from the past conversation history. 
Use the history ONLY if the current directive asks you to do something with it (e.g., "email me the plan we just made").
`;
  let iteration = 0;

  // 7️⃣ Autonomous loop
  while (iteration < 10) {
    emit({
      type: "thinking",
      message: `Reasoning... (iteration ${iteration + 1})`,
    });

    const llmResponse = await model.invoke([
      { role: "system", content: systemPrompt },
      { role: "user", content: context },
    ]);

    let rawContent = "";
    if (typeof llmResponse.content === "string") {
      rawContent = llmResponse.content;
    } else if (Array.isArray(llmResponse.content)) {
      rawContent = llmResponse.content
        .map((part: unknown) => (part as { text?: string }).text || "")
        .join("");
    } else {
      rawContent = JSON.stringify(llmResponse.content);
    }

    rawContent = extractJSON(rawContent);

    let response: {
      action: string;
      tool?: string;
      input?: unknown;
      reason?: string;
      answer?: unknown;
    };

    try {
      response = JSON.parse(rawContent);
    } catch {
      emit({ type: "error", message: "LLM returned invalid JSON" });
      return "Invalid JSON response from LLM";
    }

    // 8️⃣ Tool action
    if (response.action === "tool") {
      const toolName = response.tool;

      if (!toolName || !agent.tools.includes(toolName)) {
        emit({ type: "error", message: `Tool "${toolName}" not allowed` });
        context += `\nTool "${toolName}" is not available. Use one of: ${agent.tools.join(", ")}\n`;
        iteration++;
        continue;
      }

      const toolFunc = tools[toolName as ToolName];
      if (!toolFunc) {
        emit({ type: "error", message: `Tool "${toolName}" not implemented` });
        iteration++;
        continue;
      }

      emit({
        type: "tool_selected",
        tool: toolName,
        input: response.input,
        reason: response.reason,
      });

      let toolResult = "";
      const start = Date.now();

      try {
        const toolInput =
          typeof response.input === "string"
            ? response.input
            : JSON.stringify(response.input);

        toolResult = await toolFunc(toolInput, userId);

        if (typeof toolResult !== "string") {
          toolResult = JSON.stringify(toolResult);
        }
      } catch (err: unknown) {
        const error = err as Error;
        console.error(`TOOL ERROR [${toolName}]:`, error.message);
        toolResult = `Tool execution failed: ${error.message}`;

        emit({
          type: "tool_result",
          tool: toolName,
          result: toolResult,
          time: "0.0s",
        });

        context += `\nTool "${toolName}" failed: ${error.message}\nDo not retry this tool. Try a different approach.\n`;
        iteration++;
        continue;
      }

      const elapsed = ((Date.now() - start) / 1000).toFixed(1);

      emit({
        type: "tool_result",
        tool: toolName,
        result: toolResult.slice(0, 200),
        time: `${elapsed}s`,
      });

      if (agent.memoryEnabled) {
        await storeMemory(
          agent.id,
          `Tool: ${toolName}\nInput: ${response.input}\nResult: ${toolResult}`,
        );
      }

      context += `\nTool "${toolName}" result:\n${toolResult}\n\nContinue reasoning or return final answer.\n`;
    }

    // 9️⃣ Final answer
    if (response.action === "final") {
      const finalAnswer =
        typeof response.answer === "string"
          ? response.answer
          : JSON.stringify(response.answer, null, 2);
      emit({ type: "final", answer: finalAnswer });

      if (agent.memoryEnabled) {
        await storeMemory(agent.id, `User: ${task}\nAgent: ${finalAnswer}`);
      }

      await prisma.agentRun.create({
        data: {
          agentId: agent.id,
          task,
          response:
            typeof response.answer === "string"
              ? response.answer
              : JSON.stringify(response.answer, null, 2),
        },
      });

      return finalAnswer;
    }

    iteration++;
  }

  emit({ type: "error", message: "Maximum iterations reached" });
  return "Maximum iterations reached";
}
