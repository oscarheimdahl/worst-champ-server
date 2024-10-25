const prod = import.meta.env.PROD;

// const baseUrl = prod ? 'worst-champ-server.deno.dev' : 'localhost:8000';
const baseUrl = window.location.host;
export const socketUrl = `PROTOCOL://${baseUrl}/socket`.replace(
  'PROTOCOL',
  prod ? 'wss' : 'ws'
);
export const apiUrl = `PROTOCOL://${baseUrl}/api`.replace(
  'PROTOCOL',
  prod ? 'https' : 'http'
);
