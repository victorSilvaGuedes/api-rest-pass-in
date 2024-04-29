import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { generateSlug } from '../utils/generate-slug'
import { prisma } from '../lib/prisma'
import { FastifyInstance } from 'fastify'
import { BadRequest } from './_errors/bad-request'

export async function createEvent(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/events',
    // o schema consegue ter acesso a propriedades da api
    {
      schema: {
        summary: 'Create an event',
        tags: ['events'],
        // o fastify já envia o objeto de validação automaticamente no body
        body: z.object({
          title: z.string().min(4),
          details: z.string().nullable(),
          maximumAttendees: z.number().int().positive().nullable(),
        }),
        // validação se o código for 201, precise retornar o id do evento
        response: {
          201: z.object({ eventId: z.string().uuid() }),
        },
      },
    },
    async (request, reply) => {
      const { title, details, maximumAttendees } = request.body

      // gerar o slug a partir do title
      const slug = generateSlug(title)
      // verifica se já possui um title/slug igual no bd
      const eventWithSameSlug = await prisma.event.findUnique({
        where: {
          slug,
        },
      })
      // emite um erro caso existir
      if (eventWithSameSlug !== null) {
        throw new BadRequest('Another event with same title already exists!')
      }

      const newEvent = await prisma.event.create({
        data: {
          title,
          details,
          maximumAttendees,
          slug,
        },
      })

      return reply.status(201).send({ eventId: newEvent.id })
    },
  )
}
