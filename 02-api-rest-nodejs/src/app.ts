import fastify from 'fastify';
import cookie from '@fastify/cookie';

import { transactionRoutes } from './routes/transactions';
import { logResource } from './middlewares/log-resource';

export const app = fastify();

app.addHook('preHandler', logResource);
app.register(cookie);
app.register(transactionRoutes, {
  prefix: 'transactions',
});
