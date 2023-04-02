import { FastifyReply, FastifyRequest } from 'fastify'
import { knex } from '../database'

interface MealProps {
  id: string;
  name: string;
  description: string;
  date: Date;
  time: string;
  isOnDiet: boolean;
  user_id: string;
}

export async function CheckIfUserIsAuthorized(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = request.headers as { id: string }
  const { id: mealId } = request.params as { id: string }

  const user = await knex('users').where({ id }).first()
  const meal = await knex('meals').where({ id: mealId }).first() as MealProps

  if (user.id !== meal.user_id) {
    return reply.status(401).send({
      error: 'Unauthorized',
    })
  }

  return;
}
