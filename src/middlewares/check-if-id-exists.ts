import { FastifyReply, FastifyRequest } from 'fastify'
import { knex } from '../database';

export async function CheckUserIdExists(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id: userId} = request.headers as { id: string }

  const userExists = await knex('users').where({ id: userId }).first()

  if (!userExists) {
    return reply.status(401).send({
      error: 'User not found',
    })
  }

  return;
}
