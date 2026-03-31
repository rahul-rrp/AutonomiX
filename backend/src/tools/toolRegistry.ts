import { calculator } from "./calculator.js";
import { webSearch } from "./web_search.js";
import { summarizer } from "./summarizer.js";
import { pdfGenerator } from "./pdfGenerator.js";
import { sendEmail } from "./emailSender.js";
import { googleCalendar } from "./calendar.js";
export const tools: Record<
  string,
  (input: string, userId?: string) => Promise<string>
> = {
  calculator,
  web_search: webSearch,
  summarizer,
  google_calendar: googleCalendar,
  pdf_generator: async (input: string) => {
    const url = await pdfGenerator(input);
    return `PDF generated successfully. [Download PDF](${url})`;
  },
  send_email: async (input: string): Promise<string> => {
    try {
      let parsedInput: any;

      // 🔥 Try JSON first
      try {
        parsedInput = JSON.parse(input);
      } catch {
        // 🔥 Fallback: custom parser
        const parts = input.split("|");
        parsedInput = {};

        for (const part of parts) {
          const [key, ...rest] = part.split(":");
          parsedInput[key.trim()] = rest.join(":").trim();
        }
      }

      const to = parsedInput.to;
      const subject = parsedInput.subject || "Message from AutonomiX Agent";
      let body = parsedInput.body || "";

      if (!to) return "Error: Missing 'to' field";
      if (!body) return "Error: Missing 'body' field";

      body = body.replace(/\\n/g, "\n");

      await sendEmail({ to, subject, body });

      return `Email sent successfully to: ${to}`;
    } catch (error) {
      const err = error as Error;
      return `Error: Email failed. ${err.message}`;
    }
  },
};
