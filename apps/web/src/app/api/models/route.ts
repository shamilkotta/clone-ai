import { currentUser } from "@clerk/nextjs/server";

import { prisma } from "@repo/db";
import { z } from "zod";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const userModels = await prisma.userModels.findMany({
      where: { userId: user.id },
    });

    return Response.json({ data: userModels }, { status: 200 });
  } catch {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { name, model, key } = body;

    const result = z
      .object({
        name: z.string().min(1, "Name is required"),
        model: z.string().min(1, "Model is required"),
        key: z.string().min(1, "Key is required"),
      })
      .safeParse(body);

    if (!result.success) {
      return Response.json(
        { error: result.error.errors.map((e) => e.message).join(", ") },
        { status: 400 },
      );
    }

    const newModel = await prisma.userModels.create({
      data: {
        userId: user.id,
        name,
        model,
        key,
      },
    });

    return Response.json({ data: newModel }, { status: 201 });
  } catch (error) {
    console.error("Error creating model:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await currentUser();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await request.json();
    const result = z.string().min(1, "Model ID is required").safeParse(id);
    if (!result.success) {
      return Response.json(
        { error: result.error.errors.map((e) => e.message).join(", ") },
        { status: 400 },
      );
    }

    const model = await prisma.userModels.findFirst({
      where: {
        model: id,
        userId: user.id,
      },
    });
    if (!model) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const deletedModel = await prisma.userModels.delete({
      where: {
        id: model.id,
      },
    });

    return Response.json({ data: deletedModel }, { status: 200 });
  } catch (error) {
    console.error("Error deleting model:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
