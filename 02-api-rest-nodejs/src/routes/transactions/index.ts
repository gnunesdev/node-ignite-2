import { FastifyInstance } from 'fastify';
import { knex } from '../../database';

import { z } from 'zod';
import { randomUUID } from 'crypto';

export async function transactionRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const transactions = await knex('transactions').select();

    return { transactions };
  });

  app.get('/summary', async () => {
    const summary = await knex('transactions')
      .first()
      .sum('amount', { as: 'amount' });

    return { summary };
  });

  app.get('/:id', async (request) => {
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = getTransactionParamsSchema.parse(request.params);

    const transaction = await knex('transactions').first().where('id', id);

    return {
      transaction,
    };
  });

  app.post('/', async (request, reply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    });

    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body,
    );

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
    });

    return reply.status(201).send();
  });
}
