// const baseUrl = prod ? 'worst-champ-server.deno.dev' : 'localhost:8000';
const secure = import.meta.env.VITE_USE_SECURE;
const prod = import.meta.env.PROD;

const baseUrl = prod ? window.location.host : 'localhost:8000';
export const socketUrl = `PROTOCOL://${baseUrl}/socket`.replace(
  'PROTOCOL',
  secure ? 'wss' : 'ws'
);
export const apiUrl = `PROTOCOL://${baseUrl}/api`.replace(
  'PROTOCOL',
  secure ? 'https' : 'http'
);
