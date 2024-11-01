import { initSaveChampionVotesCron } from './server/cron.ts';
import { initDB } from './server/db.ts';
import { app } from './server/router.ts';

await initDB();
initSaveChampionVotesCron();

Deno.serve({ port: 8000 }, app.fetch);
