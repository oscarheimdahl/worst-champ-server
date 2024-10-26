import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { champions } from './data/champions.ts';
import { getChampions, initDB, upvoteChampion } from './db.ts';

initDB();

const sockets = new Map<string, WebSocket>();

const app = new Hono();
Deno.serve({ port: 8787 }, app.fetch);

app.use(
  '*',
  cors({
    origin: ['http://localhost:5173'],
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
  })
);

app.get('/api/champions', async (c) => {
  const championsData = await getChampions();
  return c.json(championsData);
});

app.post('/api/champions/vote', async (c) => {
  const { championId, clientId } = await c.req.json();
  const champion = champions.find((item) => item.id === championId);

  if (!champion) {
    return c.text('Bad champion name', 400);
  }

  try {
    await upvoteChampion(champion.id);
    sockets.forEach((socket) => {
      socket.send(
        JSON.stringify({
          type: 'vote',
          championId,
          clientId,
        })
      );
    });
    return c.text('Vote received', 200);
  } catch (e) {
    console.error(e);
    return c.text('Error', 500);
  }
});

app.get('/socket', (c) => {
  if (c.req.header('upgrade') !== 'websocket') {
    return c.text('Endpoint for websockets only', 400);
  }

  const { response, socket } = Deno.upgradeWebSocket(c.req.raw);
  const socketId = crypto.randomUUID();

  socket.onopen = () => sockets.set(socketId, socket);
  socket.onclose = () => sockets.delete(socketId);

  return response;
});

app.get('/:file', async (c) => {
  const fileName = c.req.param('file') || 'index.html';
  const fileType = fileName.split('.').pop()!;
  const filePath = fileName.startsWith('imgs/')
    ? fileName
    : `./dist/${fileName}`;

  try {
    const file = await Deno.open(filePath, { read: true });
    return new Response(file.readable, {
      headers: { 'Content-Type': typeToMime(fileType) },
    });
  } catch (e) {
    console.error(`${filePath}, No such file`);
    return c.text('Not Found', 404);
  }
});

// Function to map file types to MIME types
function typeToMime(type: string): string {
  switch (type) {
    case 'html':
      return 'text/html';
    case 'js':
      return 'application/javascript';
    case 'css':
      return 'text/css';
    case 'png':
      return 'image/png';
    case 'jpg':
      return 'image/jpeg';
    case 'jpeg':
      return 'image/jpeg';
    case 'svg':
      return 'image/svg+xml';
    case 'ico':
      return 'image/x-icon';
    default:
      return 'text/plain';
  }
}
