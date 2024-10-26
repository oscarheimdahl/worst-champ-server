import { Hono } from 'hono';
import { upgradeWebSocket } from 'hono/deno';
import { cors } from 'hono/cors';
import { champions } from './data/champions.ts';
import { getChampions, initDB, upvoteChampion } from './db.ts';

initDB();

const sockets = new Map<string, WebSocket>();

const app = new Hono();

app.get(
  '/socket',
  upgradeWebSocket((c) => {
    const socketId = crypto.randomUUID();
    return {
      onOpen: (_, ws) => {
        if (ws.raw) sockets.set(socketId, ws.raw);
      },
      onClose: () => sockets.delete(socketId),
    };
  })
);

app.use(
  '*',
  cors({
    origin: ['http://localhost:5173'],
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
  })
);

app.get('/api/champions', async (c) => {
  console.log(`🔴`);
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

app.on('GET', ['/', '/*'], async (c) => {
  const requestedFile = new URL(c.req.url).pathname;
  const fileName =
    requestedFile === '/' ? 'index.html' : requestedFile.substring(1);
  const fileType = fileName.split('.').pop()!;
  const filePath = fileName.startsWith('imgs/')
    ? fileName
    : `./dist/${fileName}`;

  console.log(fileName, fileType, filePath);

  try {
    const file = await Deno.open(filePath, { read: true });
    const mime = typeToMime(fileType);
    return new Response(file.readable, {
      headers: { 'Content-Type': mime },
    });
  } catch (e) {
    console.error(`${filePath}, No such file`);
    return c.text('Not Found', 404);
  }
});

Deno.serve({ port: 8000 }, app.fetch);

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
