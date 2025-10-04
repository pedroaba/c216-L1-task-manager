import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

export const registerUserRoute: FastifyPluginAsyncZod = async (server) => {
	server.post(
		"/users/register",
		{
			schema: {
				tags: ["users"],
				summary: "Register a user",
				body: z.object({
					name: z.string().min(5, "Nome precisa ter 5 caracteres"),
					email: z.email("Email inválido"),
					password: z.string().min(8, "Senha precisa ter 8 caracteres"),
				}),
				response: {
					201: z
						.object({ userId: z.uuid() })
						.describe("Usuário registrado com sucesso!"),
				},
			},
		},
		async (request, reply) => {},
	);
};
