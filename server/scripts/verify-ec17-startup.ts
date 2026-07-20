/**
 * One-off EC-17 verification script — invalid DATABASE_URL startup probe.
 * Run: DATABASE_URL=postgresql://invalid@127.0.0.1:59999/nodb npx tsx scripts/verify-ec17-startup.ts
 */
process.env.DATABASE_URL =
  process.env.DATABASE_URL ?? 'postgresql://invalid@127.0.0.1:59999/nodb';

async function main(): Promise<void> {
  const { Pool } = await import('pg');
  const { PrismaPg } = await import('@prisma/adapter-pg');
  const { PrismaClient } = await import('@prisma/client');

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    console.error('UNEXPECTED: database connection succeeded');
    process.exit(0);
  } catch {
    console.error(
      'Database connection failed — check DATABASE_URL and that PostgreSQL is running.',
    );
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

void main();
