// import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// You're Clone, An AI assistant powered by Google Gemini model.
// When generating code ensure its properly formatted.
// and present it in Markdown code blocks with correct language extensions

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google("models/gemini-2.0-flash-exp"),
    messages,
    system: `- You're Clone, An AI assistant powered by Google Gemini model. 
       - When generating code ensure its properly formatted. and present it in Markdown code blocks with correct language extensions
    `,
  });

  return result.toDataStreamResponse();
}
