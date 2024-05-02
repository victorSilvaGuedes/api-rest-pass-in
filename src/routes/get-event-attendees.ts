import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { prisma } from '../lib/prisma'

export async function getEventAttendees(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/events/:eventId/attendees',
    {
      schema: {
        summary: 'Get event attendees',
        tags: ['events'],
        params: z.object({
          eventId: z.string().uuid(),
        }),
        querystring: z.object({
          query: z.string().nullish(),
          pageIndex: z.string().nullish().default('0').transform(Number),
        }),
        response: {
          200: z.object({
            attendees: z.array(
              z.object({
                id: z.number().int(),
                name: z.string(),
                email: z.string().email(),
                createdAt: z.date(),
                checkInAt: z.date().nullable(),
              }),
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const { eventId } = request.params
      const { pageIndex, query } = request.query

      // listagem de todos participantes que estão num evento específico
      const attendees = await prisma.attendee.findMany({
        // se possui uma query (parâmetro de busca), pega os nomes dos participantes que contém o query
        where: query
          ? {
              eventId,
              name: { contains: query },
            }
          : {
              eventId,
            },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          checkIn: {
            select: { createdAt: true },
          },
        },
        // ordena decrescente pela data criada
        orderBy: {
          createdAt: 'desc',
        },
        // lista somente 10 resultados por página
        take: 10,
        skip: pageIndex * 10,
      })

      return reply.status(200).send({
        attendees: attendees.map((attendee) => {
          return {
            id: attendee.id,
            name: attendee.name,
            email: attendee.email,
            createdAt: attendee.createdAt,
            checkInAt: attendee.checkIn?.createdAt ?? null,
          }
        }),
      })
    },
  )
}
