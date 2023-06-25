import { FastifyInstance } from 'fastify';
import { knex } from '../../database';

import { z } from 'zod';
import { randomUUID } from 'crypto';
import { checkSessionIdExists } from '../../middlewares/check-session-id-exists';

export async function transactionRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies;

      const transactions = await knex('transactions')
        .select()
        .where({ session_id: sessionId });

      return { transactions };
    },
  );

  app.get(
    '/summary',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies;

      const summary = await knex('transactions')
        .first()
        .sum('amount', { as: 'amount' })
        .where({ session_id: sessionId });

      return { summary };
    },
  );

  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const getTransactionParamsSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = getTransactionParamsSchema.parse(request.params);

      const { sessionId } = request.cookies;

      const transaction = await knex('transactions')
        .first()
        .where({ id, session_id: sessionId });

      return {
        transaction,
      };
    },
  );

  app.post('/', async (request, reply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    });

    let data;

    try {
      data = createTransactionBodySchema.parse(request.body);
    } catch (error) {
      console.error(error);
      return reply
        .status(400)
        .send({ error: 'there was an error parsing the data sent' });
    }

    const { title, amount, type } = data;

    let sessionId = request.cookies.sessionId;

    if (!sessionId) {
      sessionId = randomUUID();

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      });
    }

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    });

    return reply.status(201).send();
  });
}
