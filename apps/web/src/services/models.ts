import { MODELS } from "@/utils/models";
import { google } from "@ai-sdk/google";
import { vercel } from "@ai-sdk/vercel";
import { openai } from "@ai-sdk/openai";

export const getModel = (id: string) => {
  const selected = id.replace("custom.", "");
  let provider = MODELS.find((model) => model.model === selected)?.provider;
  if (!provider) {
    return null;
  }

  return {
    provider: getProvider(provider, id),
    custom: id.startsWith("custom."),
  };
};

const getProvider = (provider: string, id: string) => {
  return {
    Google: google(id),
    Vercel: vercel(id),
    OpenAI: openai(id),
  }[provider];
};
