import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function GET(request: Request) {
  const message = `Give 4 ai prompt suggestions for below 4 commands: 
    - Create
    - Explore
    - Code
    - Learn

    the response should be proper json formtaed, the key shoould be command and value should be array of pormpts.
    each prompt should be around 10 words.
  `;

  try {
    const result = await generateText({
      model: google("models/gemini-2.0-flash-exp"),
      prompt: message,
    });
    const regex = /^```json\n([\s\S]*?)\n```$/;
    const match = result.text.trim().match(regex);

    if (!match || !match[1]) {
      return Response.json({});
    }

    const json = JSON.parse(match[1]);
    return Response.json(json);
  } catch {
    return Response.json({});
  }
}
