// OpenRouter — OpenAI-compatible, used via Authorization header
export const aiProviders = {
  openrouter: {
    name: "OpenRouter",
    baseURL: "https://openrouter.ai/api/v1/chat/completions",
    headers: (apiKey) => ({
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:5173",
      "X-Title": "MathMagic",
    }),
    formatRequest: (model, messages) => ({
      model,
      messages,
      temperature: 0.3,
      max_tokens: 8192,
    }),
  },

  // Google Gemini — different URL/request format, handled separately in AIService
  gemini: {
    name: "Google Gemini",
  },
};

export const getProvider = (providerName) => {
  const provider = aiProviders[providerName?.toLowerCase()];
  if (!provider) {
    throw new Error(
      `AI Provider "${providerName}" not found. Available: ${Object.keys(aiProviders).join(", ")}`
    );
  }
  return provider;
};
