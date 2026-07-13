import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: false,
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.ts'],
    fileParallelism: false,
    pool: 'forks',
    testTimeout: 30_000,
    hookTimeout: 30_000,
  },
});
