import { champions } from './data/champions.ts';
import { getChampions, initDB, upvoteChampion } from './db.ts';

initDB();

Deno.serve({
  port: 8000,
  handler: mainHandler,
});

function addCorsHeaders(req: Request, response: Response) {
  const allowedOrigins = [
    'http://localhost:3000',
    'https://worst-champ.vercel.app',
  ];
  const origin = req.headers.get('origin');

  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  }
  return response;
}

const sockets = new Map<string, WebSocket>();

async function mainHandler(req: Request) {
  const url = new URL(req.url);
  const path = url.pathname;

  if (req.method === 'OPTIONS') {
    return addCorsHeaders(req, new Response(null, { status: 204 }));
  }

  if (path === '/') {
    return addCorsHeaders(req, new Response('Hello World'));
  }

  if (path === '/api/champions') {
    if (req.method === 'GET') {
      const championsData = await getChampions();
      return addCorsHeaders(
        req,
        new Response(JSON.stringify(championsData), {
          headers: { 'Content-Type': 'application/json' },
        })
      );
    }
  }
  if (path === '/api/champions/vote') {
    if (req.method === 'POST') {
      const { championId, clientId } = await req.json();
      const champion = champions.find((item) => item.id === championId);
      if (!champion)
        return addCorsHeaders(
          req,
          new Response('Bad champion name', { status: 400 })
        );

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
        return addCorsHeaders(
          req,
          new Response('Vote received', { status: 200 })
        );
      } catch (e) {
        console.log(e);
        console.log(`🔴`);
        return addCorsHeaders(req, new Response('Error', { status: 500 }));
      }
    }
  }

  if (path === '/socket') {
    if (req.headers.get('upgrade') !== 'websocket') {
      return addCorsHeaders(
        req,
        new Response('Endpoint for websockets only', { status: 400 })
      );
    }

    const { socket, response } = Deno.upgradeWebSocket(req);

    const socketId = crypto.randomUUID();

    socket.onopen = () => {
      sockets.set(socketId, socket);
    };

    socket.onclose = () => {
      sockets.delete(socketId);
    };

    return response;
  }

  return addCorsHeaders(req, new Response('Not Found', { status: 404 }));
}
