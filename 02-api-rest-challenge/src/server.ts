import Fastify from 'fastify';

const server = Fastify({
  logger: true,
});

server.get('/', function (request, reply) {
  reply.send({ hello: 'world' });
});

server.listen({ port: 3000 }, function (err, address) {
  console.log('HTTP Server started 🚀');
  if (err) {
    server.log.error(err);
  }
});
