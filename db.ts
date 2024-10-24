import { champions } from './data/champions.ts';

// Initialize the KV store
let dbInitialized = false;
let kv: Deno.Kv;

export async function initDB() {
  if (dbInitialized) return;
  kv = await Deno.openKv();
  dbInitialized = true;

  await seedChampions();
}

async function seedChampions() {
  for (const champion of champions) {
    const existingChampion = await kv.get(['champions', champion.id]);
    if (!existingChampion.value) {
      await kv.set(['champions', champion.id], {
        id: champion.id,
        name: champion.name,
        votes: 0,
      });
    }
  }
}

export async function getChampions() {
  const championsList: Array<{ id: string; name: string; votes: number }> = [];
  for await (const entry of kv.list({ prefix: ['champions'] })) {
    championsList.push(entry.value);
  }
  return championsList.sort((a, b) => b.votes - a.votes); // Sort by votes descending
}

export async function upvoteChampion(championId: string) {
  const champion = await kv.get(['champions', championId]);
  if (champion.value) {
    await kv.set(['champions', championId], {
      ...champion.value,
      votes: champion.value.votes + 1,
    });
  }
}
