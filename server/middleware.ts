import { createMiddleware } from 'hono/factory';
import { getConnInfo } from 'hono/deno';

const REQUEST_LIMIT = 5;
const TIME_WINDOW = 5 * 1000;

const requestCounts = new Map();

export const rateLimit = createMiddleware(async (c, next) => {
  const info = getConnInfo(c);
  const remote = info.remote;
  const address = remote.address;
  const port = remote.port;

  if (!address || !port) return c.text('Bad Request', 400);
  const clientId = `${address}:${port}`;

  const now = Date.now();

  const clientData = requestCounts.get(clientId) || {
    count: 0,
    startTime: now,
  };

  if (now - clientData.startTime < TIME_WINDOW) {
    if (clientData.count >= REQUEST_LIMIT) {
      return c.text('Too Many Requests', 429);
    }
    clientData.count += 1;
  } else {
    clientData.count = 1;
    clientData.startTime = now;
  }

  requestCounts.set(clientId, clientData);

  await next();
});
