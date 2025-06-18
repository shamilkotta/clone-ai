import { currentUser } from "@clerk/nextjs/server";

import { prisma } from "@repo/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "0", 10);
  const pageSize = parseInt(searchParams.get("size") || "15", 10);

  try {
    const user = await currentUser();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
    const threads = await prisma.thread.findMany({
      where: {
        authorId: user?.id,
      },
      skip: page * pageSize,
      take: pageSize,
      orderBy: {
        updatedAt: "desc",
      },
    });

    return Response.json({
      data: threads,
    });
  } catch (error) {
    console.error("Error fetching threads:", error);
    return Response.json({ error: "Failed to fetch threads" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await currentUser();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await request.json();

    if (!id) {
      return Response.json({ error: "Thread ID is required" }, { status: 400 });
    }

    const thread = await prisma.thread.findUnique({
      where: { id: id, authorId: user.id },
    });

    if (!thread) {
      return Response.json(
        { error: "Thread not found or unauthorized" },
        { status: 404 },
      );
    }

    await prisma.thread.delete({
      where: { id: thread.id },
    });

    return Response.json({ message: "Thread deleted successfully" });
  } catch (error) {
    console.error("Error deleting thread:", error);
    return Response.json({ error: "Failed to delete thread" }, { status: 500 });
  }
}