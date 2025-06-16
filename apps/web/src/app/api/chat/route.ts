// import { openai } from "@ai-sdk/openai";
import { generateSystemPrompt } from "@/services/system-prompt";
import { google } from "@ai-sdk/google";
import { auth, currentUser, User } from "@clerk/nextjs/server";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, model, userInfo } = await req.json();
  const defaultModel = "gemini-2.0-flash-exp";

  const authData = await auth();
  let user: User | null = null;

  if (authData && authData.isAuthenticated) {
    user = await currentUser();
  }

  const systemPrompt = generateSystemPrompt(
    model || defaultModel,
    user,
    userInfo,
  );

  const result = streamText({
    model: google("models/gemini-2.0-flash-exp"),
    messages,
    system: systemPrompt,
  });

  return result.toDataStreamResponse();
}
