// const baseUrl = prod ? 'worst-champ-server.deno.dev' : 'localhost:8000';
const baseUrl = window.location.host;
export const socketUrl = `PROTOCOL://${baseUrl}/socket`.replace(
  'PROTOCOL',
  import.meta.env.VITE_LOCAL ? 'ws' : 'wss'
);
export const apiUrl = `PROTOCOL://${baseUrl}/api`.replace(
  'PROTOCOL',
  import.meta.env.VITE_LOCAL ? 'http' : 'https'
);
