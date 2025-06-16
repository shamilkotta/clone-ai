import { User } from "@clerk/nextjs/server";
import { Message } from "ai";

export const getThread = async (
  id: string,
  user: User,
): Promise<Thread<Message> | null> => {
  // TODO: Implement
  return null;
};
