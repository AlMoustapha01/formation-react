export const config = {
  port: process.env.PORT || 3001,
  
  jwt: {
    secret: process.env.JWT_SECRET || 'cnss-formation-react-secret-key-2025',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'cnss-formation-react-refresh-secret-2025',
    accessTokenExpiry: '15m',
    refreshTokenExpiry: '7d',
    accessTokenExpirySeconds: 900, // 15 minutes
  },
  
  cors: {
    origins: [
      'http://localhost:5173',  // Vite
      'http://localhost:3000',  // CRA
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000',
    ],
  },
  
  pagination: {
    defaultPage: 1,
    defaultLimit: 10,
    maxLimit: 100,
  },
  
  simulation: {
    minDelay: 100,  // ms
    maxDelay: 400,  // ms
    slowEndpointDelay: 3000, // ms
  },
} as const;
