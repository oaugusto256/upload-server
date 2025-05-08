import fastifyCors from "@fastify/cors";
import { fastify } from "fastify";
import {
  hasZodFastifySchemaValidationErrors,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { env } from "../env";
import { uploadImageRoute } from "./routes/upload-image";

const server = fastify();

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.setErrorHandler((error, request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply
      .status(400)
      .send({ message: "Validation error", issues: error.validation });
  }

  // Sent error to observability platform (Sentry, Datadog, etc);

  console.log(error);

  return reply.status(500).send({ message: "Internal server error" });
});

server.register(fastifyCors, { origin: "*" });
server.register(uploadImageRoute);

console.log(env.DATABASE_URL);

server.listen({ port: 3333, host: "0.0.0.0" }, () => {
  console.log("HTTP server running!");
});
