// Configuration for API endpoints and short URL base
export const config = {
  // Backend API URL
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9808',
  
  // Short URL base (where short links are served from)
  shortUrlBase: process.env.NEXT_PUBLIC_SHORT_URL_BASE || 'http://localhost:9808',
  
  // Frontend URL
  frontendUrl: process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
};

// Helper function to build full short URL
export const buildShortUrl = (shortCode: string): string => {
  return `${config.shortUrlBase}/${shortCode}`;
};

// Helper function to build API URL
export const buildApiUrl = (endpoint: string): string => {
  return `${config.apiUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
}; 