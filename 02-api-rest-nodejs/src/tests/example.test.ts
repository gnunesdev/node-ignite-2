import { afterAll, beforeAll, expect, test } from 'vitest';

import request from 'supertest';
import { app } from '../app';

beforeAll(async () => {
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

test('user should be able to create a new transaction', async () => {
  const response = await request(app.server).post('/transactions').send({
    title: 'Passeio no parque',
    amount: 100,
    type: 'debit',
  });

  expect(response.statusCode).toEqual(201);
});
