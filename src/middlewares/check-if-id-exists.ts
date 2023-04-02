import { FastifyReply, FastifyRequest } from 'fastify'
import knex from 'knex';

export async function CheckUserIdExists(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = request.headers as { id: string }

  const userExists = await knex('users').where({ id }).first()

  if (!userExists) {
    return reply.status(401).send({
      error: 'User not found',
    })
  }

  return;
}
