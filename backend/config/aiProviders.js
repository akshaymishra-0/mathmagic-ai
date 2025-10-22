export const aiProviders = {
  openrouter: {
    name: "OpenRouter",
    baseURL: "https://openrouter.ai/api/v1/chat/completions",
    headers: (apiKey) => ({
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:5173",
      "X-Title": "Math Solver App",
    }),
    formatRequest: (model, messages) => ({
      model: model,
      messages: messages,
      temperature: 0.3,
      max_tokens: 4000,
    }),
  },
};

export const getProvider = (providerName) => {
  const provider = aiProviders[providerName?.toLowerCase()];
  if (!provider) {
    throw new Error(
      `AI Provider "${providerName}" not found. Available: ${Object.keys(
        aiProviders
      ).join(", ")}`
    );
  }
  return provider;
};
