const config = {
  frontend: {
    development: "http://localhost:3000",
    production: "https://url-shortener-frontend-f9ew.onrender.com",
  },
  backend: {
    development: "http://localhost:9808",
    production: "https://shrinkr-2k0u.onrender.com",
  },
};

export function getFrontendBaseUrl(): string {
  return process.env.NODE_ENV === "development"
    ? config.frontend.development
    : config.frontend.production;
}

export function getBackendBaseUrl(): string {
  return process.env.NODE_ENV === "development"
    ? config.backend.development
    : config.backend.production;
}

export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || getBackendBaseUrl();
}

export default config; 