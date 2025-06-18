import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@repo/db";

export async function GET(request: Request) {
  const { pathname } = new URL(request.url);
  const threadId = pathname.split("/").pop();
  const user = await currentUser();

  if (!threadId || !user) {
    return Response.json({ error: "Thread ID is required" }, { status: 400 });
  }
  try {
    const thread = await prisma.thread.findUnique({
      where: { id: threadId, authorId: user.id },
    });

    if (!thread) {
      return Response.json({ error: "Thread not found" }, { status: 404 });
    }

    return Response.json({ data: thread });
  } catch (error) {
    console.error("Error fetching thread:", error);
    return Response.json({ error: "Failed to fetch thread" }, { status: 500 });
  }
}
