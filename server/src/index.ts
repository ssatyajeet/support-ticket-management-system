import { app } from './app';
import { env } from './config/env';
import { prisma } from './lib/prisma';

async function start(): Promise<void> {
  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    console.error(
      'Database connection failed — check DATABASE_URL and that PostgreSQL is running.',
    );
    process.exit(1);
  }

  app.listen(env.port, () => {
    console.log(`Server listening on http://localhost:${env.port}`);
  });
}

void start();
