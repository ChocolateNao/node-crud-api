import 'dotenv/config';

import { Database } from './db/db';
import { Server } from './server/server';

const port = Number(process.env.PORT) ?? 4000;
const db = new Database();
const app = new Server(port, db);

app.start();
