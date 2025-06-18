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
