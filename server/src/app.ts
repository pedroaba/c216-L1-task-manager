import fastifyCors from "@fastify/cors";
import { fastifySwagger } from "@fastify/swagger";
import fastify from "fastify";
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { healthRoute } from "./routes/health";
import { registerUserRoute } from "./routes/register-user";

export const app = fastify({
	logger: {
		transport: {
			target: "pino-pretty",
			options: {
				translateTime: "HH:MM:ss Z",
				ignore: "pid,hostname",
			},
		},
	},
}).withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
	origin: "*",
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization"],
});

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(fastifySwagger, {
	openapi: {
		info: {
			title: "Task Management API",
			version: "1.0.0",
		},
	},
	transform: jsonSchemaTransform,
});

app.register(import("@scalar/fastify-api-reference"), {
	routePrefix: "/reference",
	configuration: {
		title: "Task Management API Reference",
		pageTitle: "Task Management API Reference",
		theme: "fastify",
	},
});

app.register(registerUserRoute);
app.register(healthRoute);
