import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import request from 'supertest';
import { app } from '../app';
import { execSync } from 'child_process';

describe('Transactions', () => {
  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all');
    execSync('npm run knex migrate:latest');
  });

  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('user should be able to create a new transaction', async () => {
    const response = await request(app.server).post('/transactions').send({
      title: 'Presente',
      amount: 100,
      type: 'debit',
    });

    expect(response.statusCode).toEqual(201);
  });

  it('should be able to list all transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Presente',
        amount: 100,
        type: 'credit',
      });

    const cookies = createTransactionResponse.get('Set-Cookie');

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies);

    expect(listTransactionsResponse.statusCode).toEqual(200);
    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'Presente',
        amount: 100,
      }),
    ]);
  });

  it('should be able to get a specific transaction', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Presente',
        amount: 100,
        type: 'credit',
      });

    const cookies = createTransactionResponse.get('Set-Cookie');

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies);

    const createdTransactionId =
      listTransactionsResponse.body.transactions[0].id;

    const getTransactionResponse = await request(app.server)
      .get(`/transactions/${createdTransactionId}`)
      .set('Cookie', cookies);

    expect(getTransactionResponse.body.transaction).toEqual(
      expect.objectContaining({
        title: 'Presente',
        amount: 100,
      }),
    );
  });

  it('should be able to get the summary', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Presente',
        amount: 100,
        type: 'credit',
      });

    const cookies = createTransactionResponse.get('Set-Cookie');

    await request(app.server)
      .post('/transactions')
      .send({
        title: 'Presente',
        amount: 50,
        type: 'debit',
      })
      .set('Cookie', cookies);

    const summaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies);

    expect(summaryResponse.body.summary).toEqual({ amount: 50 });
  });
});
