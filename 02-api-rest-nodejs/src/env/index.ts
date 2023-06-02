import 'dotenv/config';

import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_URL: z.string(),
  PORT: z.number().default(3333),
});

const tempEnv = envSchema.safeParse(process.env);

if (tempEnv.success === false) {
  console.error('⚠ Invalid environment variables', tempEnv.error.format());

  throw new Error('Invalid environment variables.');
}

export const env = tempEnv.data;
