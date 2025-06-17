// import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
// import { vercel } from "@ai-sdk/vercel";
import { currentUser } from "@clerk/nextjs/server";
import { streamText } from "ai";
import { waitUntil } from "@vercel/functions";

import { prisma, Role } from "@repo/db";
import { generateSystemPrompt, generateTitle } from "@/services/system-prompt";
import { chatSchema } from "@/utils/schema";
import { NextResponse } from "next/server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, model, userInfo, threadId } = await req.json();

  const validationRes = chatSchema.safeParse({
    messages,
    model,
    userInfo,
    threadId,
  });

  if (!validationRes.success) {
    return NextResponse.json(
      {
        success: false,
        messages: validationRes.error.errors?.[0]?.message,
        filed: validationRes.error.message,
      },
      { status: 400 },
    );
  }

  const selectedModel = model || "gemini-2.0-flash-exp";
  const user = await currentUser();
  const systemPrompt = generateSystemPrompt(selectedModel, user, userInfo);

  const createThread = async () => {
    if (!user || !threadId) return false;
    const existingThread = await prisma.thread.findUnique({
      where: { id: threadId },
    });
    // unauthorized therad access
    if (existingThread && existingThread.authorId !== user.id) return false;
    const query = messages[messages.length - 1].parts[0].text;
    if (!existingThread) {
      let title = "New Chat";
      try {
        title = await generateTitle(query);
      } catch (err) {
        console.error(err);
      }
      await prisma.thread.create({
        data: {
          id: threadId,
          title,
          authorId: user.id,
        },
      });
    }

    return true;
  };
  const threadPromise = createThread();

  const onFinish = async ({ text }: { text: string }) => {
    const result = await threadPromise;
    if (!result) return;

    const now = new Date();
    await prisma.message.createMany({
      data: [
        {
          role: Role.user,
          parts: messages[messages.length - 1].parts,
          createdAt: now,
          threadId,
        },
        {
          role: Role.assistant,
          parts: [{ type: "text", text }],
          createdAt: new Date(now.getTime() + 1000),
          model: selectedModel,
          threadId,
        },
      ],
    });
  };

  const result = streamText({
    model: google("models/gemini-2.0-flash-exp"),
    messages,
    system: systemPrompt,
    onFinish: ({ text }) => {
      waitUntil(onFinish({ text }));
    },
  });

  return result.toDataStreamResponse();
}
