"use server";

import { google } from "@ai-sdk/google";
import { currentUser, User } from "@clerk/nextjs/server";
import { generateText } from "ai";
import { z } from "zod";

import { Message, prisma, Thread } from "@repo/db";
import { revalidatePath } from "next/cache";

export const getAllThread = async (user: User) => {
  const threads = await prisma.thread.findMany({
    where: {
      authorId: user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: 15,
  });
  return threads;
};

interface ThreadMessage extends Thread {
  messages: Message[];
}
export const getThreadMessages = async (
  threadId: string,
): Promise<ThreadMessage | null> => {
  try {
    const user = await currentUser();
    if (!user) return null;
    const thread = await prisma.thread.findFirst({
      where: {
        id: threadId,
        authorId: user.id,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    return thread;
  } catch {
    return null;
  }
};

export const getThread = async (threadId?: string) => {
  try {
    if (!threadId) return null;
    const res = z
      .string()
      .trim()
      .uuid()
      .or(z.string().trim().cuid())
      .safeParse(threadId);
    if (!res.success) return null;
    const user = await currentUser();
    if (!user) return null;
    const thread = await prisma.thread.findFirst({
      where: {
        id: threadId,
        authorId: user.id,
      },
    });

    return thread;
  } catch {
    return null;
  }
};

export const getQuerySuggestions = async () => {
  "use cache";

  const message = `Give 4 ai prompt suggestions for below 4 commands: 
    - Create
    - Explore
    - Code
    - Learn

    the response should be proper json formtaed, the key shoould be command and value should be array of pormpts.
    each prompt should be around 10 words.
  `;

  try {
    const result = await generateText({
      model: google("models/gemini-2.0-flash-exp"),
      prompt: message,
      temperature: 0.7,
    });
    const regex = /^```json\n([\s\S]*?)\n```$/;
    const match = result.text.trim().match(regex);

    if (!match || !match[1]) {
      return Response.json({});
    }

    return JSON.parse(match[1]);
  } catch {
    return {};
  }
};

export const revalidateIndex = async () => {
  revalidatePath("/");
};