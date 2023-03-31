import { FastifyReply, FastifyRequest } from 'fastify'

export async function CheckUserIdExists(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = request.headers as { id: string }
  console.log(id)

  if (!id) {
    return reply.status(401).send({
      error: 'Unauthorized',
    })
  }

}
