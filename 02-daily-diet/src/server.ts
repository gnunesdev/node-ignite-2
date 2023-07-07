import Fastify from 'fastify';
import { env } from './services/environment';
import { userRoutes } from './routes/user';

const server = Fastify({
  logger: true,
});

server.register(userRoutes, {
  prefix: 'users',
});

server.listen({ port: env.PORT }, () => {
  console.log('HTTP Server started 🚀');
});
