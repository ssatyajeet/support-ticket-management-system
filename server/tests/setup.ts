import 'dotenv/config';

process.env.PORT = process.env.PORT ?? '3001';
process.env.CLIENT_URL = process.env.CLIENT_URL ?? 'http://localhost:5173';

if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL is required for integration tests. Copy server/.env.example to server/.env and configure PostgreSQL.',
  );
}

import { afterAll } from 'vitest';
import { disconnectPrisma } from '../src/lib/prisma';

afterAll(async () => {
  await disconnectPrisma();
});
