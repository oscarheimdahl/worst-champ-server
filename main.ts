import { initDB } from './server/db.ts';
import { app } from './server/router.ts';

initDB();

Deno.serve({ port: 8000 }, app.fetch);
