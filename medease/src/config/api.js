export const API_CONFIG = {
  API_KEY: import.meta.env.VITE_OPENROUTER_API_KEY || '',
  API_URL: 'https://openrouter.ai/api/v1/chat/completions'
}

// Log configuration loading (but not the key itself)
console.log('API Configuration loaded:', {
  hasKey: !!import.meta.env.VITE_OPENROUTER_API_KEY,
  url: 'https://openrouter.ai/api/v1/chat/completions'
}); 