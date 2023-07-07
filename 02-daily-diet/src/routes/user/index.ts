import { FastifyInstance } from 'fastify';
import { knex } from './../../services/database';

import z from 'zod';

import { randomUUID } from 'crypto';

export async function userRoutes(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    const users = await knex('users').select('*');

    return reply.send({ users });
  });

  app.post('/', async (request, reply) => {
    const userSchema = z.object({
      name: z.string(),
    });

    const userData = userSchema.parse(request.body);

    const { name } = userData;

    const userCreated = await knex('users').insert({
      id: randomUUID(),
      name,
    });

    return reply.send(userCreated);
  });
}
