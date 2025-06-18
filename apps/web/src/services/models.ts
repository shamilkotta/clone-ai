import { User } from "@clerk/nextjs/server";
import { google, createGoogleGenerativeAI } from "@ai-sdk/google";
import { vercel, createVercel } from "@ai-sdk/vercel";
import { openai, createOpenAI } from "@ai-sdk/openai";

import { MODELS } from "@/utils/models";
import { prisma } from "@repo/db";

export const getModel = (id: string, user: User | null) => {
  const selected = id.replace("custom.", "");
  const model = MODELS.find((model) => model.model === selected);
  if (!model) {
    return null;
  }

  if (id.startsWith("custom.")) {
    if (!user) return null;
    return createProvider(model.provider, model.model, user.id);
  }
  return getProvider(model.provider, model.model);
};

const getProvider = (provider: string, id: string) => {
  const prov = {
    Google: google,
    Vercel: vercel,
    OpenAI: openai,
  }[provider];

  return prov ? prov(id) : null;
};

const createProvider = async (provider: string, id: string, userId: string) => {
  const userKey = await prisma.userModels.findFirst({
    where: { model: id, userId: userId },
    select: { key: true },
  });

  if (!userKey?.key) return null;
  const modelId = id.replace("custom.", "");

  const prv = {
    Google: createGoogleGenerativeAI,
    Vercel: createVercel,
    OpenAI: createOpenAI,
  }[provider];

  return prv
    ? prv({
        apiKey: userKey.key,
      })(modelId)
    : null;
};
