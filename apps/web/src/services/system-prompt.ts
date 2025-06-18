import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { User } from "@clerk/nextjs/server";

import { ChatSchema } from "@/utils/schema";

export const generateSystemPrompt = (
  model: string,
  user: User | null,
  userInfo: ChatSchema["userInfo"],
) => {
  let message = `- You're CloneAI, An AI assistant chat interface. 
       - When generating code ensure its properly formatted. and present it in Markdown code blocks with correct language extensions
       - Current date and tiem including timzone is ${new Date().toLocaleString(
         "en-US",
         {
           timeZone: userInfo.timeZone,
           timeZoneName: "short",
         },
       )}
    `;

  if (user && user.fullName) {
    message += `- You'r speaking with ${user.fullName}, You don't need to mention the name unless the user asks for it.`;
  }

  return message;
};

export const generateTitle = async (query?: string) => {
  if (!query) return "New Chat";

  const result = await generateText({
    model: google("models/gemini-2.0-flash-exp"),
    prompt: `
      Generate a short title for this query ${query}
      - Its an ai conversion starting query
      - Make it Short and precise max 10 words
      - Return as plain text, no formating, styling or special characters
    `,
  });

  return result.text.trim();
};
