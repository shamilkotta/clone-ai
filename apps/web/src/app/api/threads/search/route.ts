import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@repo/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const user = await currentUser();

  if (!query || !user) {
    return Response.json(
      { error: "Query parameter is required" },
      { status: 400 },
    );
  }

  try {
    const threads = await prisma.thread.findMany({
      where: {
        title: {
          contains: query,
          mode: "insensitive",
        },
        authorId: user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 20,
    });

    return Response.json({ data: threads });
  } catch {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
