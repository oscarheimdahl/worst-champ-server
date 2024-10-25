// const baseUrl = prod ? 'worst-champ-server.deno.dev' : 'localhost:8000';
const secure = import.meta.env.VITE_USE_SECURE;
const baseUrl = window.location.host;
export const socketUrl = `PROTOCOL://${baseUrl}/socket`.replace(
  'PROTOCOL',
  secure ? 'wss' : 'ws'
);
export const apiUrl = `PROTOCOL://${baseUrl}/api`.replace(
  'PROTOCOL',
  secure ? 'https' : 'http'
);
