import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  PORT: z.coerce.number().int().min(1).max(65535),
  CLIENT_URL: z.string().url('CLIENT_URL must be a valid URL'),
});

function parseEnv(): z.infer<typeof envSchema> {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const messages = result.error.issues.map((issue) => {
      const field = issue.path.join('.') || 'unknown';
      return `${field}: ${issue.message}`;
    });

    throw new Error(`Environment validation failed:\n${messages.join('\n')}`);
  }

  return result.data;
}

const parsed = parseEnv();

export const env = {
  databaseUrl: parsed.DATABASE_URL,
  port: parsed.PORT,
  clientUrl: parsed.CLIENT_URL,
} as const;

export type Env = typeof env;
