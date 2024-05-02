import { FastifyInstance } from 'fastify'
import { BadRequest } from './routes/_errors/bad-request'
import { ZodError } from 'zod'
type FastifyErrorHandler = FastifyInstance['errorHandler']

// criação do errorHandler -> ele pegará os erros e fará um tratamento especial enviando um código HTTP e uma mensagem
export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  // se for uma instância do validador Zod, é porque possui erro de validação
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Error during validation',
      errors: error.flatten().fieldErrors,
    })
  }

  // se for instância de BadRequest, é porque há algum erro por parte do cliente
  if (error instanceof BadRequest) {
    return reply.status(400).send({ message: error.message })
  }

  // qualquer outro erro será do tipo 500
  return reply.status(500).send({ message: 'Internal server error!' })
}
