import { champions } from './data/champions.ts';

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

type Champion = { id: string; name: string; votes: number };
export async function getChampions() {
  const championsList: Array<Champion> = [];
  for await (const entry of kv.list({ prefix: ['champions'] })) {
    championsList.push(entry.value as Champion);
  }
  return championsList.sort((a, b) => b.votes - a.votes); // Sort by votes descending
}

export async function upvoteChampion(championId: string) {
  const championData = await kv.get(['champions', championId]);
  const champion = championData.value as Champion;
  if (champion) {
    await kv.set(['champions', championId], {
      ...champion,
      votes: champion.votes + 1,
    });
  }
}

export async function resetVotes() {
  const promises = [];
  for (const champion of champions) {
    promises.push(
      kv.set(['champions', champion.id], {
        ...champion,
        votes: 0,
      })
    );
  }
  await Promise.all(promises);
}

export async function saveChampions(
  isoString: string,
  champions: { name: string; votes: number }[]
) {
  await kv.set(['saved-champions', isoString], champions);
}

export async function deleteAllSavedChampions() {
  for await (const entry of kv.list({ prefix: ['saved-champions'] })) {
    await kv.delete(entry.key);
    console.log(`Deleted key: ${entry.key}`);
  }
}

export async function getSavedChampions() {
  const entries = new Map<string, { name: string; votes: number }[]>();
  for await (const entry of kv.list({ prefix: ['saved-champions'] })) {
    entries.set(
      entry.key.at(1) as string,
      entry.value as { name: string; votes: number }[]
    );
  }
  return entries;
}
