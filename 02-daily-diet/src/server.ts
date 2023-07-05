import Fastify from 'fastify';
import { env } from './services/environment';
import { knex } from './services/database';

const server = Fastify({
  logger: true,
});

server.get('/', async (request, reply) => {
  const tables = await knex('sqlite_schema').select('*');
  return tables;
});

server.listen({ port: env.PORT }, function (err, address) {
  console.log('HTTP Server started 🚀');
  if (err) {
    server.log.error(err);
  }
});
