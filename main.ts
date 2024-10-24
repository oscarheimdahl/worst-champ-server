import { champions } from './data/champions.ts';
import { getChampions, initDB, upvoteChampion } from './db.ts';

initDB();

Deno.serve({
  port: 8000,
  handler: mainHandler,
});

async function mainHandler(req: Request) {
  const url = new URL(req.url);
  const path = url.pathname;

  if (path === '/') {
    return new Response('Hello World');
  }

  if (path === '/api/champions') {
    if (req.method === 'GET') {
      const champions = await getChampions();
      return new Response(JSON.stringify(champions));
    }
    if (req.method === 'POST') {
      const { championId, clientId } = await req.json();

      const champion = champions.find((item) => item.id === championId);
      if (!champion) return new Response('Bad champion name', { status: 400 });

      try {
        await upvoteChampion(champion.id);
        // votesEmitter.emit('newVote', { championId, clientId });
        return new Response('Vote received', { status: 200 });
      } catch (e) {
        console.log(e);
        return new Response('Error', { status: 500 });
      }
    }
  }

  return new Response('Not Found', { status: 404 });
}
