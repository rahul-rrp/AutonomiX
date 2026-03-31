import { google } from "googleapis";
import { prisma } from "../config/prisma.js";
export const googleCalendar = async (
  input: string,
  userId: string,
): Promise<string> => {
  try {
    if (!userId) {
      return "Error: User ID is required to access Google Calendar.";
    }
    const integration = await prisma.userIntegration.findUnique({
      where: { userId_provider: { userId, provider: "google_calendar" } },
    });

    if (!integration || !integration.refreshToken) {
      return "Error: Google Calendar is not connected. Please ask the user to connect it in the Tools menu.";
    }
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI,
    );

    oauth2Client.setCredentials({
      refresh_token: integration.refreshToken,
      access_token: integration.accessToken || undefined,
    });
    // console.log("refresh token", process.env.GOOGLE_REFRESH_TOKEN);

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const parts: Record<string, string> = {};

    input.split("|").forEach((part) => {
      const colonIndex = part.indexOf(":");
      if (colonIndex !== -1) {
        const key = part.slice(0, colonIndex).trim().toLowerCase();
        const value = part.slice(colonIndex + 1).trim();
        parts[key] = value;
      }
    });

    const action = parts["action"] || "create";

    // ── CREATE EVENT ──────────────────────────────────────────────────────────
    if (action === "create") {
      const title = parts["title"] || "Agent Scheduled Event";
      const date = parts["date"]; // YYYY-MM-DD
      const time = parts["time"] || "10:00"; // HH:MM
      const duration = parseInt(parts["duration"] || "60"); // minutes
      const description = parts["description"] || "";

      if (!date) {
        return "Error: Missing 'date' field. Format: YYYY-MM-DD";
      }

      // Build start and end times
      const startDateTime = new Date(`${date}T${time}:00`);
      const endDateTime = new Date(startDateTime.getTime() + duration * 60000);

      const event = await calendar.events.insert({
        calendarId: "primary",
        requestBody: {
          summary: title,
          description,
          start: {
            dateTime: startDateTime.toISOString(),
            timeZone: "Asia/Kolkata",
          },
          end: {
            dateTime: endDateTime.toISOString(),
            timeZone: "Asia/Kolkata",
          },
        },
      });

      return `Event created successfully: "${title}" on ${date} at ${time} for ${duration} minutes. Event link: ${event.data.htmlLink}`;
    }

    // ── LIST EVENTS ───────────────────────────────────────────────────────────
    if (action === "list") {
      const days = parseInt(parts["days"] || "7");

      const now = new Date();
      const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

      const response = await calendar.events.list({
        calendarId: "primary",
        timeMin: now.toISOString(),
        timeMax: future.toISOString(),
        singleEvents: true,
        orderBy: "startTime",
        maxResults: 10,
      });

      const events = response.data.items;

      if (!events || events.length === 0) {
        return `No events found in the next ${days} days.`;
      }

      const eventList = events
        .map((e) => {
          const start = e.start?.dateTime || e.start?.date || "Unknown";
          return `• ${e.summary} — ${new Date(start).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`;
        })
        .join("\n");

      return `Upcoming events (next ${days} days):\n${eventList}`;
    }

    return "Error: Unknown action. Use action:create or action:list";
  } catch (error) {
    const err = error as Error;
    console.log(err.message);
    return `Google Calendar error: ${err.message}`;
  }
};
