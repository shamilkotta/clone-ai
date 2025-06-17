import { NextResponse } from "next/server";

import { prisma } from "@repo/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "0", 10);
  const pageSize = 15;

  try {
    const threads = await prisma.thread.findMany({
      skip: page * pageSize,
      take: pageSize,
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json({
      data: threads,
    });
  } catch (error) {
    console.error("Error fetching threads:", error);
    return NextResponse.json(
      { error: "Failed to fetch threads" },
      { status: 500 },
    );
  }
}
