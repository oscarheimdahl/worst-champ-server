import { getChampions, saveChampions } from './db.ts';

const pattern = '0 */2 * * *'; // every two hours
// const pattern = '*/1 * * * *'; // every minute
export function initSaveChampionVotesCron() {
  Deno.cron('Save votes', pattern, async () => {
    console.log('Saving votes');
    const champions = await getChampions();

    const trimmedChampions = champions
      .filter((c) => c.votes > 0)
      .map((c) => {
        return {
          name: c.name,
          votes: c.votes,
        };
      });

    saveChampions(new Date().toISOString(), trimmedChampions);
  });
}
