import { FastifyRequest } from 'fastify';

export async function logResource(request: FastifyRequest) {
  console.log(`[${request.method}] ${request.url}`);
}
