import {
  generateSlug
} from "./chunk-KDMJHR3Z.mjs";
import {
  BadRequest
} from "./chunk-JRO4E4TH.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/create-event.ts
import z from "zod";
async function createEvent(app) {
  app.withTypeProvider().post(
    "/events",
    // o schema consegue ter acesso a propriedades da api
    {
      schema: {
        summary: "Create an event",
        tags: ["events"],
        // o fastify já envia o objeto de validação automaticamente no body
        body: z.object({
          title: z.string().min(4),
          details: z.string().nullable(),
          maximumAttendees: z.number().int().positive().nullable()
        }),
        // validação se o código for 201, precise retornar o id do evento
        response: {
          201: z.object({ eventId: z.string().uuid() })
        }
      }
    },
    async (request, reply) => {
      const { title, details, maximumAttendees } = request.body;
      const slug = generateSlug(title);
      const eventWithSameSlug = await prisma.event.findUnique({
        where: {
          slug
        }
      });
      if (eventWithSameSlug !== null) {
        throw new BadRequest("Another event with same title already exists!");
      }
      const newEvent = await prisma.event.create({
        data: {
          title,
          details,
          maximumAttendees,
          slug
        }
      });
      return reply.status(201).send({ eventId: newEvent.id });
    }
  );
}

export {
  createEvent
};
