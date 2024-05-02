import fastify from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { createEvent } from './routes/create-event'
import { registerForEvent } from './routes/register-for-event'
import { getEvent } from './routes/get-event'
import { getAttendeeBadge } from './routes/get-attendee-badge'
import { checkIn } from './routes/check-in'
import { getEventAttendees } from './routes/get-event-attendees'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { errorHandler } from './error-handler'
import fastifyCors from '@fastify/cors'

const app = fastify()

app.register(fastifyCors, {
  origin: '*',
})

// adiciona o schema de validação e serializer
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

// registrado o swagger para documentar
app.register(fastifySwagger, {
  swagger: {
    // dizendo que o app consome e produz dados do tipo json
    consumes: ['application/json'],
    produces: ['application/json'],
    info: {
      title: 'pass.in',
      description: 'API para o back-end da aplicação pass.in',
      version: '1.0.0',
    },
  },
  // como o swagger deve entender o schema de cada rota (zod)
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, { prefix: '/docs' })

// registrando todas as rotas do servidor
app.register(createEvent)
app.register(registerForEvent)
app.register(getEvent)
app.register(getAttendeeBadge)
app.register(checkIn)
app.register(getEventAttendees)

// registrando o errorHandler (todos erros cairão aqui, e terão um tratamento)
app.setErrorHandler(errorHandler)

app
  .listen({
    port: 2222,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log('Server running')
  })
