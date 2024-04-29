import {
  errorHandler
} from "./chunk-DCZJQNPL.mjs";
import {
  checkIn
} from "./chunk-QGIYE4GG.mjs";
import {
  createEvent
} from "./chunk-JQ52TCAV.mjs";
import "./chunk-KDMJHR3Z.mjs";
import {
  getAttendeeBadge
} from "./chunk-HG7NEODL.mjs";
import {
  getEventAttendees
} from "./chunk-36MTXM2A.mjs";
import {
  getEvent
} from "./chunk-QBWIO3TS.mjs";
import {
  registerForEvent
} from "./chunk-SFTYYHEV.mjs";
import "./chunk-JRO4E4TH.mjs";
import "./chunk-JV6GRE7Y.mjs";

// src/server.ts
import fastify from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler
} from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyCors from "@fastify/cors";
var app = fastify();
app.register(fastifyCors, {
  origin: "*"
});
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(fastifySwagger, {
  swagger: {
    // dizendo que o app consome e produz dados do tipo json
    consumes: ["application/json"],
    produces: ["application/json"],
    info: {
      title: "pass.in",
      description: "API para o back-end da aplica\xE7\xE3o pass.in",
      version: "1.0.0"
    }
  },
  // como o swagger deve entender o schema de cada rota (zod)
  transform: jsonSchemaTransform
});
app.register(fastifySwaggerUi, { prefix: "/docs" });
app.register(createEvent);
app.register(registerForEvent);
app.register(getEvent);
app.register(getAttendeeBadge);
app.register(checkIn);
app.register(getEventAttendees);
app.setErrorHandler(errorHandler);
app.listen({
  port: 2222,
  host: "0.0.0.0"
}).then(() => {
  console.log("Server running");
});
