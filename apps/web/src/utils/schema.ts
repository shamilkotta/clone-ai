import { z } from "zod";

export const chatSchema = z.object({
  messages: z
    .array(
      z.object(
        {
          id: z.string().uuid().optional().or(z.string().cuid().optional()),
          parts: z.array(
            z.object({
              text: z.string().optional(),
              type: z.string({ message: "Invalid input" }),
            }),
          ),
          role: z.enum(["user", "assistant"], { message: "Invalid input" }),
        },
        { message: "Invalid input" },
      ),
      { message: "User input is required" },
    )
    .min(1, { message: "User input is required" }),
  model: z.string({ message: "Selecte a model" }).trim().min(1),
  userInfo: z.object({
    timeZone: z.string().refine(
      (val) => {
        try {
          Intl.DateTimeFormat(undefined, { timeZone: val });
          return true;
        } catch {
          return false;
        }
      },
      {
        message: "Invalid time zone string",
      },
    ),
  }),
  threadId: z
    .string()
    .trim()
    .uuid("Invalid thread Id")
    .optional()
    .or(z.string().cuid("Invalid thread ID").optional())
    .optional(),
});
export type ChatSchema = z.infer<typeof chatSchema>;
