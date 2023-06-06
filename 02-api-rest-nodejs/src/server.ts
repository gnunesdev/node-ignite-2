import fastify from 'fastify';
import cookie from '@fastify/cookie';

import { env } from './env';
import { transactionRoutes } from './routes/transactions';
import { logResource } from './middlewares/log-resource';

const app = fastify();

app.register(cookie);
app.addHook('preHandler', logResource);
app.register(transactionRoutes, {
  prefix: 'transactions',
});

app.listen({ port: env.PORT }).then(() => {
  console.log('🚀 HTTP Server running!');
});
