import { z } from 'zod';
import { config } from 'dotenv';

config();

const envSchema = z.object({
  DATABASE_CLIENT: z.enum(['sqlite', 'pg']),
  DATABASE_URL: z.string(),
  PORT: z.number().default(3333),
});

const envValidationResult = envSchema.safeParse(process.env);

if (envValidationResult.success === false) {
  console.error(
    '⚠ Invalid environment variables',
    envValidationResult.error.format(),
  );

  throw new Error('Invalid environment variables.');
}

export const env = envValidationResult.data;

console.log(env);
