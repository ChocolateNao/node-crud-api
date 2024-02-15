import { availableParallelism } from 'node:os';
import cluster from 'cluster';

import 'dotenv/config';

import { Database } from './db/db';
import { Server } from './server/server';

const port = Number(process.env.PORT) ?? 4000;
const db = new Database();

const app = new Server(port, db);

if (cluster.isPrimary) {
  if (process.env.MULTI === 'true') {
    const numCPUs = availableParallelism() - 1;
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork({ PORT: (port + i).toString() });
    }

    cluster.on('exit', () => {
      cluster.fork({ PORT: port + Object.keys(cluster.workers ?? {}).length });
    });
  } else {
    cluster.fork({ port });
  }
} else {
  app.start();
}
