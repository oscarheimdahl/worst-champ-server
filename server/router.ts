import { Hono } from 'hono';
import { upgradeWebSocket } from 'hono/deno';
import { cors } from 'hono/cors';
import { champions } from './data/champions.ts';
import { getChampions, upvoteChampion } from './db.ts';
import { typeToMime } from './utils.ts';
import { rateLimit } from './middleware.ts';

export const app = new Hono();

const sockets = new Map<string, WebSocket>();

app.get(
  '/socket',
  upgradeWebSocket(() => {
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
  const championsData = await getChampions();
  return c.json(championsData);
});

app.post('/api/champions/vote', rateLimit, async (c) => {
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

app.get('/*', async (c) => {
  const requestedFile = new URL(c.req.url).pathname;
  const fileName =
    requestedFile === '/' ? 'index.html' : requestedFile.substring(1);
  const fileType = fileName.split('.').pop()!;
  const filePath = fileName.startsWith('imgs/')
    ? 'server/' + fileName
    : `server/dist/${fileName}`;

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
