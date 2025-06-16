import { MODELS } from "@/utils/models";
import { User } from "@clerk/nextjs/server";

export const generateSystemPrompt = (
  model: string,
  user: User | null,
  userInfo: any,
) => {
  let message = `- You're CloneAI, An AI assistant powered by ${MODELS[model]?.name}. 
       - When generating code ensure its properly formatted. and present it in Markdown code blocks with correct language extensions
       - Current date and tiem including timzone is ${new Date().toLocaleString(
         "en-US",
         {
           timeZone: userInfo.timezone,
           timeZoneName: "short",
         },
       )}
    `;

  if (user && user.fullName) {
    message += `- You'r speaking with ${user.fullName}`;
  }

  return message;
};
