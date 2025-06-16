type Model = {
  name: string;
  id: string;
  group: string;
};

export const MODELS: Record<string, Model> = {
  "gemini-2.0-flash-exp": {
    name: "Gemini Flash 2.0",
    id: "models/gemini-2.0-flash-exp",
    group: "Gemini",
  },
};
