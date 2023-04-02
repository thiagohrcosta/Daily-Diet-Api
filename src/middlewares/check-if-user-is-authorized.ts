import { FastifyReply, FastifyRequest } from 'fastify'
import { knex } from '../database'

export async function CheckIfUserIsAuthorized(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = request.headers as { id: string }
  const { mealId } = request.params as { mealId: string }

  const user = await knex('users').where({ id }).first()
  const meal = await knex('meals').where({ id: mealId }).first()

  if (user.id !== meal.userId) {
    return reply.status(401).send({
      error: 'Unauthorized',
    })
  }

  return;
}
