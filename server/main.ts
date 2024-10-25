import { champions } from './data/champions.ts';
import { getChampions, initDB, upvoteChampion } from './db.ts';

initDB();

Deno.serve({
  port: 8000,
  handler: mainHandler,
});

function addCorsHeaders(req: Request, response: Response) {
  return response;
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
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

  // if (req.method === 'OPTIONS') {
  //   return addCorsHeaders(req, new Response(null, { status: 204 }));
  // }

  console.log(path);
  if (path === '/') {
    const file = await Deno.open('../client/dist/index.html', { read: true });
    return addCorsHeaders(req, new Response(file.readable));
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

  const filePath = url.pathname.substring(1);
  const fileType = filePath.split('.').at(-1)!;
  try {
    const file = await Deno.open(`../client/dist/${filePath}`, { read: true });
    return new Response(file.readable, {
      headers: { 'content-type': typeToMime(fileType) },
    });
  } catch (e) {
    console.log('404, No such file');
  }

  return addCorsHeaders(req, new Response('Not Found', { status: 404 }));
}

export function typeToMime(type: string) {
  switch (type) {
    case 'html':
      return 'text/html';
    case 'js':
      return 'text/javascript';
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
